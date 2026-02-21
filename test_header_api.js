
const BASE_URL = 'http://localhost:5000/api';

async function testHeaderFlow() {
    try {
        console.log("1. Saving Draft...");
        const draftData = {
            siteTitle: "Test Title " + Date.now(),
            navItems: [{ label: "Test Link", path: "/test", icon: "Car" }]
        };

        let res = await fetch(`${BASE_URL}/admin/settings/header/draft`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ draft_value: draftData })
        });
        if (!res.ok) throw new Error(`Save Failed: ${res.statusText}`);
        console.log("Draft Saved.");

        console.log("2. Fetching Admin Settings...");
        res = await fetch(`${BASE_URL}/admin/settings/header`);
        let json = await res.json();
        const fetchedDraft = json.data.draft_value;
        console.log("Fetched Draft:", fetchedDraft);

        if (!fetchedDraft || fetchedDraft.siteTitle !== draftData.siteTitle) {
            console.error("FAIL: Draft not persisted correctly.");
        } else {
            console.log("SUCCESS: Draft persisted.");
        }

        console.log("3. Publishing...");
        res = await fetch(`${BASE_URL}/admin/settings/header/publish`, { method: 'POST' });
        if (!res.ok) throw new Error(`Publish Failed: ${res.statusText}`);
        console.log("Published.");

        console.log("4. Fetching Public Settings...");
        res = await fetch(`${BASE_URL}/settings`);
        json = await res.json();
        const publicHeader = json.data.header; // Access "header" key directly
        console.log("Public Header:", publicHeader);

        if (!publicHeader || publicHeader.siteTitle !== draftData.siteTitle) {
            console.error("FAIL: Published value not updated.");
        } else {
            console.log("SUCCESS: Published value updated.");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testHeaderFlow();
