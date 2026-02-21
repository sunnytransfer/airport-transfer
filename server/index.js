process.on('uncaughtException', (err) => { console.error('\x1b[31m[ERROR] UNCAUGHT EXCEPTION:\x1b[0m', err); });
process.on('unhandledRejection', (reason, promise) => { console.error('\x1b[31m[ERROR] UNHANDLED REJECTION:\x1b[0m', reason); });
const express = require('express');
const cors = require('cors');
const db = require('./db');
const nodemailer = require('nodemailer'); // For emails
const multer = require('multer'); // For file uploads
const sharp = require('sharp'); // For image optimization
const path = require('path');
const fs = require('fs');
const { sendReservationUpdate } = require('./services/emailService');
const axios = require('axios'); // Added for currency API

// ---- Safety guard: prevent dev token usage in production ----
if (process.env.NODE_ENV === 'production') {
    const t = process.env.ADMIN_TOKEN || '';
    if (!t || t === 'dev-admin-token') {
        console.error('FATAL: ADMIN_TOKEN must be set to a secure value in production.');
        process.exit(1);
    }
}
// -----------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// [OPS_WATCH] Structured Logging Helper
// [OPS_WATCH] Structured Logging Helper
const logOps = (event, data = {}) => {
    let prefix = '[OPS]';
    if (event.includes('ERROR') || event.includes('FAILED')) prefix = '[ERROR]';
    if (event.includes('EMAIL')) prefix = '[EMAIL]';
    if (event.includes('PAYMENT') || event.includes('PAID')) prefix = '[PAYMENT]';

    // Add color coding for terminal (ANSI escape codes)
    const reset = "\x1b[0m";
    const red = "\x1b[31m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const blue = "\x1b[34m";

    let color = blue;
    if (prefix === '[ERROR]') color = red;
    if (prefix === '[PAYMENT]') color = green;
    if (prefix === '[EMAIL]') color = yellow;

    console.log(`${color}${prefix} [${event}]${reset}`, JSON.stringify(data, null, 0));
};

// Heartbeat
if (process.env.NODE_ENV !== 'test') {
    setInterval(() => {
        console.log(`\x1b[36m[SYSTEM] System running... (Port ${process.env.PORT || 5000})\x1b[0m`);
    }, 30000);
}


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure upload directories exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. Create Booking
app.post('/api/bookings', (req, res) => {
    const { customer_name, email, phone, pickup_location, dropoff_location, flight_time, is_return, hotel_name, flight_number, note, passenger_count, price, payment_method } = req.body;

    // Payment Feature Flag Logic
    const requestedMethod = payment_method || 'arrival';
    if (requestedMethod === 'online') {
        db.get("SELECT value FROM settings WHERE key = 'payment_settings'", [], (err, row) => {
            let paymentsEnabled = false;
            if (row && row.value) {
                try {
                    const settings = JSON.parse(row.value);
                    if (settings.enabled) paymentsEnabled = true;
                } catch (e) { }
            }
            if (!paymentsEnabled) {
                return res.status(400).json({ error: 'Online payments are currently disabled.' });
            }
            processBooking();
        });
    } else {
        processBooking();
    }

    function processBooking() {

        // Smart Return Logic: Calculate Pickup Time
        let pickup_time = req.body.pickup_time;
        let final_pickup_time = pickup_time;

        // If it's a return trip and we have a flight time, calculate standard pickup (e.g. 4 hours before)
        if (is_return && flight_time) {
            const flightDate = new Date(flight_time);
            flightDate.setHours(flightDate.getHours() - 4);
            final_pickup_time = flightDate.toISOString();
        }

        const sql = `INSERT INTO bookings (customer_name, email, phone, pickup_location, dropoff_location, flight_time, pickup_time, is_return, hotel_name, flight_number, note, passenger_count, price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`;
        const params = [customer_name, email, phone, pickup_location, dropoff_location, flight_time, final_pickup_time, is_return ? 1 : 0, hotel_name, flight_number, note, passenger_count || 1, price || '0'];

        db.run(sql, params, function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            const bookingId = this.lastID;

            // Trigger Automatic Booking Confirmation Email (Customer)
            sendConfirmationEmail(email, {
                customer_name,
                pickup_time: final_pickup_time,
                pickup_location,
                dropoff_location,
                price: price || '£0.00',
                is_return,
                vehicle_name: 'Standard Vehicle' // Should ideally come from frontend
            });

            // Trigger Admin Notification Email
            sendConfirmationEmail(ADMIN_EMAIL, {
                customer_name,
                phone,
                email,
                pickup_location,
                dropoff_location,
                pickup_time: final_pickup_time,
                note,
                price: price || '£0.00',
                flight_time,
                flight_number
            }, true);

            // Trigger WhatsApp Notification (New System Update)
            sendWhatsAppNotification(phone, { customer_name, pickup_time: final_pickup_time, pickup_location });

            logOps('BOOKING_CREATED', { id: bookingId, customer: customer_name, time: final_pickup_time });

            res.json({
                message: 'Booking created successfully',
                data: { id: bookingId, ...req.body, pickup_time: final_pickup_time }
            });
        });
    } // End of processBooking()
});

// --- NOTIFICATION SERVICES ---

// Mock WhatsApp Notification Service
const sendWhatsAppNotification = (phone, bookingDetails) => {
    // In a real production environment, this would integrate with Twilio, Meta API, or similar.
    // For now, we simulate the logic as requested to demonstrate the system update.
    console.log(`[System Notification] Sending WhatsApp confirmation to ${phone}...`);
    logOps('WHATSAPP_SENT', { phone, type: 'CONFIRMATION' });
    return true;
};

// 2. Get All Bookings (for Admin)
// 2. Get All Bookings (Filtered)
app.get('/api/bookings', (req, res) => {
    const { status } = req.query;
    let sql = "SELECT * FROM bookings WHERE 1=1";
    let params = [];

    if (status === 'trash') {
        sql += " AND deleted_at IS NOT NULL";
    } else {
        sql += " AND deleted_at IS NULL"; // Hide deleted by default

        if (status === 'archived') {
            sql += " AND is_archived = 1";
        } else if (status === 'active') {
            sql += " AND (is_archived = 0 OR is_archived IS NULL)";
        }
    }

    sql += " ORDER BY created_at DESC";

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// 2.5 Update Booking (Status/Details)
// 2.5 Update Booking (Status/Details/Archive/Restore)
app.put('/api/bookings/:id', (req, res) => {
    const { status, note, price, payment_status, is_archived } = req.body;
    const { id } = req.params;

    // Dynamic update
    let updates = [];
    let params = [];

    if (status !== undefined) { updates.push("status = ?"); params.push(status); }
    if (note !== undefined) { updates.push("note = ?"); params.push(note); }
    if (price !== undefined) { updates.push("price = ?"); params.push(price); }
    if (payment_status !== undefined) { updates.push("payment_status = ?"); params.push(payment_status); }
    if (is_archived !== undefined) { updates.push("is_archived = ?"); params.push(is_archived); }
    if (req.body.driver_name !== undefined) {
        updates.push("driver_name = ?");
        params.push(req.body.driver_name);
        logOps('DRIVER_ASSIGNED', { id, driver: req.body.driver_name });
    }
    if (req.body.driver_phone !== undefined) { updates.push("driver_phone = ?"); params.push(req.body.driver_phone); }

    if (updates.length === 0) return res.json({ message: "No changes" });

    params.push(id);
    const sql = `UPDATE bookings SET ${updates.join(", ")} WHERE id = ?`;

    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ error: err.message });

        // If Approved logic (only if status changed to approved)
        if (status === 'approved') {
            db.get("SELECT * FROM bookings WHERE id = ?", [id], (err, row) => {
                if (!err && row && sendReservationUpdate) sendReservationUpdate(row, 'approved');
            });
        }

        // Structured Logging for Updates
        const logData = { id };
        if (status) logData.status = status;
        if (is_archived !== undefined) logOps(is_archived ? 'ARCHIVED' : 'UNARCHIVED', { id });
        if (payment_status) logOps('MARK_PAID', { id, status: payment_status });
        if (updates.length > 0) logOps('BOOKING_UPDATED', { id, fields: updates }); // Simplified

        res.json({ message: "Booking updated", changes: this.changes });
    });
});

// Soft Delete (Trash)
app.delete('/api/bookings/:id', (req, res) => {
    db.run("UPDATE bookings SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        logOps('TRASHED', { id: req.params.id });
        res.json({ message: "Moved to trash", changes: this.changes });
    });
});

// Restore from Trash
app.put('/api/bookings/:id/restore', (req, res) => {
    db.run("UPDATE bookings SET deleted_at = NULL WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        logOps('RESTORED', { id: req.params.id });
        res.json({ message: "Restored from trash", changes: this.changes });
    });
});

// Force Delete
app.delete('/api/bookings/:id/force', (req, res) => {
    db.run("DELETE FROM bookings WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        logOps('DELETE_FOREVER', { id: req.params.id });
        res.json({ message: "Permanently deleted", changes: this.changes });
    });
});

// Empty Archive
app.delete('/api/bookings/archive/empty', (req, res) => {
    db.run("DELETE FROM bookings WHERE is_archived = 1", function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Archive emptied", changes: this.changes });
    });
});

// --- CURRENCY RATES ENDPOINT ---
let ratesCache = {
    timestamp: 0,
    data: null
};

app.get('/api/rates', async (req, res) => {
    const NOW = Date.now();
    const TTL = 30 * 60 * 1000; // 30 minutes

    // Check cache
    if (ratesCache.data && (NOW - ratesCache.timestamp < TTL)) {
        return res.json(ratesCache.data);
    }

    try {
        console.log('Fetching live currency rates...');
        // Using a free API (Option: exchangerate-api.com)
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/GBP');

        ratesCache = {
            timestamp: NOW,
            data: {
                base: "GBP",
                timestamp: NOW,
                ttlMinutes: 30,
                rates: {
                    EUR: response.data.rates.EUR,
                    USD: response.data.rates.USD,
                    TRY: response.data.rates.TRY
                }
            }
        };

        res.json(ratesCache.data);
    } catch (error) {
        console.error('FX Fetch Failed:', error.message);

        // Return stale cache if available
        if (ratesCache.data) {
            return res.json({ ...ratesCache.data, stale: true });
        }

        // Hard fallback if no cache
        res.json({
            base: "GBP",
            timestamp: NOW,
            ttlMinutes: 0,
            rates: { EUR: 1.15, USD: 1.25, TRY: 40.0 }, // Safe approximate defaults
            stale: true,
            error: "Provider failed"
        });
    }
});

// --- PRICING RULES ENDPOINTS ---

// Get Pricing Rules
app.get('/api/pricing-rules', (req, res) => {
    const sql = "SELECT * FROM pricing_rules ORDER BY min_pax ASC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching pricing rules:', err.message);
            // Fallback to empty array to prevent frontend crash
            return res.json({ message: "success", data: [] });
        }
        res.json({ message: "success", data: rows || [] });
    });
});

// Update Pricing Rule (Admin Compatibility: Input GBP One-Way only)
app.put('/api/pricing-rules/:id', (req, res) => {
    const { min_pax, max_pax, vehicle_name, one_way_price, vehicle_features } = req.body;

    // Auto-calculate Return Price (e.g. 10% discount on double one-way?)
    // User requested: "Saving stores payableReturnGBP into existing gidis_donus field"
    // Let's assume standard logic: Return = (OneWay * 2) * 0.9 (10% discount) OR just keep it simple
    // The previous code had `return_price` in body. If the frontend sends it, we use it.
    // If we want to enforcing the rule "Owner enters ONLY one-way price", we should calculate it here OR rely on frontend calculation.
    // Let's rely on frontend sending the correct calculated value to keep backend flexible, 
    // BUT user said "Saving stores payableReturnGBP...". 
    // I will stick to update what is sent, but ensure consistency if needed.
    // Actually, the prompt says "Return fields are auto-calculated and read-only" (Frontend). 
    // "Saving stores payableReturnGBP into existing gidis_donus field". 
    // So the frontend will send the calculated return price. Implementation here is standard update.

    // However, I must ensure we update `return_price` (which Maps to `gidis_donus` conceptually)
    const return_price = req.body.return_price;

    // Safety: one_way_price should be a number
    // We update all fields
    const sql = `UPDATE pricing_rules SET min_pax = ?, max_pax = ?, vehicle_name = ?, one_way_price = ?, return_price = ?, vehicle_features = ? WHERE id = ?`;

    db.run(sql, [min_pax, max_pax, vehicle_name, one_way_price, return_price, vehicle_features, req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Rule updated", changes: this.changes });
    });
});

// --- SITE SETTINGS (Singleton) ENDPOINTS ---

const SITE_IDENTITY_KEY = 'site_identity';

// Get Public Site Settings (Published only, with defaults)
app.get('/api/site-settings', (req, res) => {
    db.get("SELECT value FROM settings WHERE key = ?", [SITE_IDENTITY_KEY], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });

        // Default Foundation Settings
        const defaults = {
            brandName: 'MarmarisTrip',
            logoUrl: '/logo.png', // Placeholder
            primaryColor: '#3b82f6', // blue-500
            secondaryColor: '#1e40af', // blue-800
            enableTransfers: true,
            enableExcursions: false,
            enableBlog: false,
            enableWhatsApp: true,
            contactPhone: '+90 555 555 55 55',
            contactEmail: 'info@example.com'
        };

        if (row && row.value) {
            try {
                const published = JSON.parse(row.value);
                return res.json({ ...defaults, ...published });
            } catch (e) {
                console.error("Failed to parse site settings", e);
            }
        }
        res.json(defaults);
    });
});

// Admin: Get Site Settings (Draft + Published)
app.get('/api/admin/site-settings', (req, res) => {
    db.get("SELECT * FROM settings WHERE key = ?", [SITE_IDENTITY_KEY], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });

        let data = {
            key: SITE_IDENTITY_KEY,
            value: null,
            draft_value: null,
            version: 0,
            updated_at: null,
            published_at: null
        };

        if (row) {
            try {
                if (row.value) data.value = JSON.parse(row.value);
                if (row.draft_value) data.draft_value = JSON.parse(row.draft_value);
                if (row.history) {
                    const history = JSON.parse(row.history);
                    data.version = history.length + 1;
                }
                data.updated_at = row.updated_at;
                data.published_at = row.published_at;
            } catch (e) {
                console.error("Error parsing admin settings", e);
            }
        }
        res.json(data);
    });
});

// Admin: Save Draft
app.put('/api/admin/site-settings', (req, res) => {
    const draftData = req.body; // Expects full object

    if (!draftData) {
        return res.status(400).json({ error: "No body" });
    }

    const strValue = JSON.stringify(draftData);

    const sql = `INSERT INTO settings (key, draft_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) 
        ON CONFLICT(key) DO UPDATE SET draft_value = ?, updated_at = CURRENT_TIMESTAMP`;

    db.run(sql,
        [SITE_IDENTITY_KEY, strValue, strValue],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: "Draft saved", changes: this.changes });
        }
    );
});

// Admin: Publish
app.post('/api/admin/site-settings/publish', (req, res) => {
    db.get("SELECT * FROM settings WHERE key = ?", [SITE_IDENTITY_KEY], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row || !row.draft_value) return res.status(400).json({ error: "No draft to publish" });

        const currentDraft = row.draft_value;
        const previousValue = row.value;
        let history = [];

        try {
            history = row.history ? JSON.parse(row.history) : [];
        } catch (e) { }

        if (previousValue) {
            history.unshift({
                timestamp: new Date().toISOString(),
                value: JSON.parse(previousValue)
            });
            if (history.length > 10) history = history.slice(0, 10);
        }

        db.run(`UPDATE settings SET value = ?, history = ?, draft_value = NULL, updated_at = CURRENT_TIMESTAMP, published_at = CURRENT_TIMESTAMP WHERE key = ?`,
            [currentDraft, JSON.stringify(history), SITE_IDENTITY_KEY],
            function (err) {
                if (err) return res.status(400).json({ error: err.message });
                logOps('SITE_SETTINGS_PUBLISHED', { key: SITE_IDENTITY_KEY });
                res.json({ message: "Site settings published", published_at: new Date().toISOString() });
            }
        );
    });
});

// --- GENERIC SETTINGS ENDPOINTS ---

// Get All Settings
app.get('/api/settings', (req, res) => {
    db.all("SELECT * FROM settings", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        const settings = {};
        rows.forEach(row => {
            try {
                settings[row.key] = JSON.parse(row.value);
            } catch (e) {
                settings[row.key] = row.value;
            }
        });
        res.json({ message: "success", data: settings });
    });
});

// Update Setting (Key/Value)
app.put('/api/settings/:key', (req, res) => {
    const { value } = req.body;
    const key = req.params.key;
    const strValue = typeof value === 'object' ? JSON.stringify(value) : value;

    db.run(`INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?`,
        [key, strValue, strValue],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Setting updated" });
        }
    );
});

// Admin: Get Specific Setting (Full Details)
app.get('/api/admin/settings/:key', (req, res) => {
    const key = req.params.key;
    db.get("SELECT * FROM settings WHERE key = ?", [key], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.json({ message: "Setting not found", data: null });

        try {
            const data = {
                key: row.key,
                value: row.value ? JSON.parse(row.value) : null,
                draft_value: row.draft_value ? JSON.parse(row.draft_value) : null,
                history: row.history ? JSON.parse(row.history) : [],
                updated_at: row.updated_at,
                published_at: row.published_at
            };
            res.json({ message: "success", data });
        } catch (e) {
            console.error("Error parsing setting JSON:", e);
            res.status(500).json({ error: "Failed to parse setting data" });
        }
    });
});

// Admin: Save Draft
app.put('/api/admin/settings/:key/draft', (req, res) => {
    const { draft_value } = req.body;
    const key = req.params.key;
    const strValue = JSON.stringify(draft_value);

    db.run(`INSERT INTO settings (key, draft_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) 
        ON CONFLICT(key) DO UPDATE SET draft_value = ?, updated_at = CURRENT_TIMESTAMP`,
        [key, strValue, strValue],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Draft saved successfully", changes: this.changes });
        }
    );
});

// Admin: Publish Draft
app.post('/api/admin/settings/:key/publish', (req, res) => {
    const key = req.params.key;

    db.get("SELECT * FROM settings WHERE key = ?", [key], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row || !row.draft_value) return res.status(400).json({ error: "No draft to publish" });

        const currentDraft = row.draft_value;
        const previousValue = row.value; // Store as string
        let history = [];

        try {
            history = row.history ? JSON.parse(row.history) : [];
        } catch (e) {
            console.warn("History parse error, resetting history");
        }

        // Add previous version to history if it exists
        if (previousValue) {
            history.unshift({
                timestamp: new Date().toISOString(),
                value: JSON.parse(previousValue)
            });
            // Limit history size (e.g., last 10 versions)
            if (history.length > 10) history = history.slice(0, 10);
        }

        const strHistory = JSON.stringify(history);

        db.run(`UPDATE settings SET value = ?, history = ?, draft_value = NULL, updated_at = CURRENT_TIMESTAMP, published_at = CURRENT_TIMESTAMP WHERE key = ?`,
            [currentDraft, strHistory, key],
            function (err) {
                if (err) return res.status(400).json({ error: err.message });
                logOps('SETTINGS_PUBLISHED', { key });
                res.json({ message: "Settings published successfully", published_at: new Date().toISOString() });
            }
        );
    });
});

// Admin: Revert Draft (Discard Changes)
app.post('/api/admin/settings/:key/revert', (req, res) => {
    const key = req.params.key;
    db.run(`UPDATE settings SET draft_value = NULL WHERE key = ?`, [key], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Draft redundant changes discarded." });
    });
});

// Admin: Rollback to History Version
app.post('/api/admin/settings/:key/rollback', (req, res) => {
    const key = req.params.key;
    const { versionIndex } = req.body;

    db.get("SELECT * FROM settings WHERE key = ?", [key], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Setting not found" });

        let history = [];
        try {
            history = row.history ? JSON.parse(row.history) : [];
        } catch (e) {
            return res.status(500).json({ error: "Invalid history data" });
        }

        if (versionIndex < 0 || versionIndex >= history.length) {
            return res.status(400).json({ error: "Invalid version index" });
        }

        const targetVersion = history[versionIndex];
        // When rolling back, the current value becomes a history item too? 
        // Or we just swap. Let's simplfy: The target becomes the new value. 
        // We push the *current* value to history as usual on next publish.
        // Wait, "rollback" implies immediate effect or creating a draft?
        // Let's create a DRAFT from the history version, so admin can review before publishing.

        const strValue = JSON.stringify(targetVersion.value);

        db.run(`UPDATE settings SET draft_value = ? WHERE key = ?`,
            [strValue, key],
            function (err) {
                if (err) return res.status(400).json({ error: err.message });
                res.json({ message: "Version restored to draft. Review and publish to apply." });
            }
        );
    });
});

// --- PAYMENTS ENDPOINTS ---
app.get('/api/admin/settings/payments', (req, res) => {
    db.get("SELECT value FROM settings WHERE key = 'payment_settings'", [], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        const defaults = {
            enabled: false,
            provider: "none",
            pay_on_arrival_enabled: true,
            currency: "EUR"
        };
        if (row && row.value) {
            try {
                const settings = JSON.parse(row.value);
                return res.json({ ...defaults, ...settings });
            } catch (e) { }
        }
        res.json(defaults);
    });
});

app.put('/api/admin/settings/payments', (req, res) => {
    const settings = req.body;
    const strValue = JSON.stringify(settings);

    db.run(`INSERT INTO settings (key, value, updated_at, published_at) VALUES ('payment_settings', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
        ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP, published_at = CURRENT_TIMESTAMP`,
        [strValue, strValue],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            if (typeof logOps === 'function') logOps('PAYMENT_SETTINGS_UPDATED', settings);
            res.json({ message: "Payment settings updated", changes: this.changes });
        }
    );
});

// --- MEDIA ENDPOINTS ---

// List Uploaded Media
app.get('/api/media', (req, res) => {
    db.all("SELECT * FROM photos ORDER BY upload_date DESC", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// 3. Image Upload & Optimization
app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const filename = `optimized-${Date.now()}.webp`; // Convert to WebP for SEO/Performance
    const outputPath = path.join(uploadDir, filename);

    try {
        await sharp(req.file.buffer)
            .resize(800) // Resize to reasonable width
            .webp({ quality: 80 }) // Compress
            .toFile(outputPath);

        // Save to DB (simplified)
        db.run(`INSERT INTO photos (filename, optimized_path) VALUES (?, ?)`, [filename, outputPath]);

        res.json({ message: 'Image uploaded and optimized', url: `/uploads/${filename}` });
    } catch (error) {
        res.status(500).json({ error: 'Image processing failed' });
    }
});

// Mock Email Sender
// Email Sender Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred service
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-password'
    }
});

const ADMIN_EMAIL = 'info@marmaristrip.com'; // Admin notification email

function sendConfirmationEmail(to, details, isAdmin = false) {
    if (process.env.NODE_ENV === 'test') return; // Disable emails in testing

    const subject = isAdmin
        ? `[NEW BOOKING] ${details.pickup_location} -> ${details.dropoff_location}`
        : 'Booking Confirmation - MarmarisTrip';

    const text = isAdmin
        ? `New Booking Received!\n\nCustomer: ${details.customer_name}\nPhone: ${details.phone}\nEmail: ${details.email}\n\nFrom: ${details.pickup_location}\nTo: ${details.dropoff_location}\nDate: ${details.pickup_time}\nPrice: ${details.price}\nNote: ${details.note}\n\nCheck admin panel for details.`
        : `Dear ${details.customer_name},\n\nYour transfer booking has been confirmed.\n\nType: ${details.is_return ? 'Return Trip' : 'One Way'}\nPick-up Time: ${new Date(details.pickup_time).toLocaleString()}\nFrom: ${details.pickup_location}\nTo: ${details.dropoff_location}\n\nVehicle: ${details.vehicle_name || 'Standard Sedan'}\nPrice: ${details.price}\nPayment: Pay on Arrival\n\nDriver will meet you at the pickup location.\n\nThank you for choosing MarmarisTrip!\nSafe Travels!`;

    const mailOptions = {
        from: process.env.EMAIL_USER || 'no-reply@marmaristrip.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(`Error sending ${isAdmin ? 'admin' : 'customer'} email:`, error);
            logOps('EMAIL_FAILED', { to: to, type: isAdmin ? 'ADMIN' : 'CUSTOMER', error: error.message });
        } else {
            console.log(`${isAdmin ? 'Admin' : 'Customer'} email sent: ` + info.response);
            logOps('EMAIL_SENT', { to: to, type: isAdmin ? 'ADMIN' : 'CUSTOMER' });
        }
    });
}

// --- Public Site Settings Endpoint ---
app.get('/api/site/settings', (req, res) => {
    try {
        const data = require('fs').readFileSync('./data/site_settings.json', 'utf-8');
        res.setHeader('Cache-Control', 'public, max-age=60'); // fast SPA load
        res.json(JSON.parse(data));
    } catch (e) {
        res.status(500).json({ error: 'settings_read_failed' });
    }
});
// ------------------------------------

// ---- Minimal health + auth endpoints (DEV) ----
app.get('/api/health', (req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
});

// Very basic auth "me" endpoint:
// Expects Authorization: Bearer <token>
// For now accepts token === process.env.ADMIN_TOKEN and returns admin user.
// IMPORTANT: Replace with real auth later.
app.get('/api/auth/me', (req, res) => {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    if (!token) return res.status(401).json({ error: 'missing_token' });

    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken) return res.status(500).json({ error: 'ADMIN_TOKEN_not_set' });

    if (token !== adminToken) return res.status(403).json({ error: 'forbidden' });

    return res.json({ user: { id: 'admin', name: 'Admin' }, role: 'admin' });
});
// ---------------------------------------------

// NOTE: app.listen moved to start.js for testability

module.exports = app;
