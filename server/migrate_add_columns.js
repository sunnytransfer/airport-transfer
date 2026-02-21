const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'transport.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Add passenger_count column if not exists
    db.run("ALTER TABLE bookings ADD COLUMN passenger_count INTEGER DEFAULT 1", (err) => {
        if (err && err.message.includes('duplicate column name')) {
            console.log('Column passenger_count already exists.');
        } else if (err) {
            console.error('Error adding passenger_count:', err.message);
        } else {
            console.log('Added passenger_count column.');
        }
    });

    // Add payment_status column if not exists
    db.run("ALTER TABLE bookings ADD COLUMN payment_status TEXT DEFAULT 'Pending'", (err) => {
        if (err && err.message.includes('duplicate column name')) {
            console.log('Column payment_status already exists.');
        } else if (err) {
            console.error('Error adding payment_status:', err.message);
        } else {
            console.log('Added payment_status column.');
        }
    });
});

db.close();
