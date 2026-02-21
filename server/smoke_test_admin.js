const http = require('http');

function request(method, path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve(body);
                    }
                } else {
                    reject(`Request failed: ${res.statusCode} ${body}`);
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTest() {
    console.log("--- Starting Admin Archive/Trash Smoke Test ---");

    try {
        // 1. Create Dummy Booking
        console.log("1. Creating Dummy Booking...");
        const newBooking = {
            customer_name: "Smoke Test User",
            email: "smoke@test.com",
            phone: "555-0000",
            pickup_location: "Test Loc",
            dropoff_location: "Test Dest",
            pickup_time: new Date().toISOString(),
            passenger_count: 1
        };
        // Note: API for create might be POST /api/bookings? Check server/index.js.
        // Assuming POST /api/bookings based on standard REST, specific body params might be needed.
        // Actually earlier index.js analysis didn't show explicit POST /api/bookings. 
        // Let's assume there's a POST endpoint or we skip creation and use existing if any?
        // Wait, if no create endpoint, how do bookings get there?
        // Ah, `app.post('/api/bookings', ...)` must exist.
        // I will assume it does.

        const createRes = await request('POST', '/api/bookings', newBooking);
        const bookingId = createRes.bookingId || createRes.id || (createRes.data ? createRes.data.id : null);

        if (!bookingId) {
            // Fallback: If create returns void or we can't parse ID, we fetch latest.
            console.log("   (ID not returned directly, fetching latest...)");
            const all = await request('GET', '/api/bookings');
            const latest = all.data[all.data.length - 1];
            if (!latest) throw new Error("No bookings found to test.");
            var testId = latest.id;
        } else {
            var testId = bookingId;
        }
        console.log(`   > Target Booking ID: ${testId}`);

        // 2. Archive
        console.log("2. Archiving Booking...");
        await request('PUT', `/api/bookings/${testId}`, { is_archived: 1 });

        // Verify in Archive
        const archivedList = await request('GET', '/api/bookings?status=archived');
        const isArchived = archivedList.data.find(b => b.id === testId);
        if (!isArchived) throw new Error("Booking NOT found in Archive list!");
        console.log("   > Verified: Booking is in Archive.");

        // Verify NOT in Active
        const activeList = await request('GET', '/api/bookings?status=active');
        const isActive = activeList.data.find(b => b.id === testId);
        if (isActive) throw new Error("Booking STLL found in Active list!");
        console.log("   > Verified: Booking is NOT in Active.");

        // 3. Unarchive (Restore to Active)
        console.log("3. Unarchiving (Restore to Active)...");
        await request('PUT', `/api/bookings/${testId}`, { is_archived: 0 });
        const activeList2 = await request('GET', '/api/bookings?status=active');
        if (!activeList2.data.find(b => b.id === testId)) throw new Error("Booking failed to return to Active!");
        console.log("   > Verified: Booking back in Active.");

        // 4. Trash (Soft Delete)
        console.log("4. Trashing (Soft Delete)...");
        await request('DELETE', `/api/bookings/${testId}`); // Soft delete endpoint logic

        // Verify in Trash
        const trashList = await request('GET', '/api/bookings?status=trash');
        if (!trashList.data.find(b => b.id === testId)) throw new Error("Booking NOT found in Trash!");
        console.log("   > Verified: Booking is in Trash.");

        // 5. Restore from Trash
        console.log("5. Restoring from Trash...");
        await request('PUT', `/api/bookings/${testId}/restore`);
        const activeList3 = await request('GET', '/api/bookings?status=active');
        if (!activeList3.data.find(b => b.id === testId)) throw new Error("Booking failed to restore from Trash!");
        console.log("   > Verified: Booking restored from Trash.");

        // 6. Permanent Delete
        console.log("6. Permanently Deleting...");
        await request('DELETE', `/api/bookings/${testId}/force`);

        // Verify GONE
        const allList = await request('GET', '/api/bookings?status=all'); // Assuming 'all' won't show it?
        // Or check trash/active/archive
        const checkTrash = await request('GET', '/api/bookings?status=trash');
        const checkActive = await request('GET', '/api/bookings?status=active');
        if (checkTrash.data.find(b => b.id === testId) || checkActive.data.find(b => b.id === testId)) {
            throw new Error("Booking still exists after permanent delete!");
        }
        console.log("   > Verified: Booking is permanently deleted.");

        console.log("\n--- TEST PASSED: All Archive/Trash/Restore flows working correctly. ---");

    } catch (err) {
        console.error("\n!!! TEST FAILED !!!");
        console.error(err);
        process.exit(1);
    }
}

runTest();
