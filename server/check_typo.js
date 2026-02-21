const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'transport.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        checkData();
    }
});

function checkData() {
    db.serialize(() => {
        // Check Settings
        db.all("SELECT key, value FROM settings", [], (err, rows) => {
            if (err) {
                console.error(err);
            } else {
                rows.forEach(row => {
                    if (row.value && row.value.includes('Pessenger')) {
                        console.log(`Found in settings[${row.key}]:`, row.value);
                    }
                });
            }
        });

        // Check Pricing Rules
        db.all("SELECT id, vehicle_name, vehicle_features FROM pricing_rules", [], (err, rows) => {
            if (err) {
                console.error(err);
            } else {
                rows.forEach(row => {
                    if ((row.vehicle_name && row.vehicle_name.includes('Pessenger')) ||
                        (row.vehicle_features && row.vehicle_features.includes('Pessenger'))) {
                        console.log(`Found in pricing_rules[${row.id}]`);
                    }
                });
            }
        });
    });

    // db.close(); // Keep open to see output?
}
