const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'transport.db');

const db = new sqlite3.Database(dbPath);

console.log("Adding 'price' column to bookings table...");

db.serialize(() => {
    // Add price column
    db.run("ALTER TABLE bookings ADD COLUMN price REAL DEFAULT 0", (err) => {
        if (err && err.message.includes("duplicate column")) {
            console.log("price column already exists.");
        } else if (err) {
            console.error("Error adding price:", err.message);
        } else {
            console.log("Added price column.");
        }
    });
});

db.close(() => {
    console.log("Migration complete.");
});
