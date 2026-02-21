const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'transport.db');

const db = new sqlite3.Database(dbPath);

console.log("Adding 'is_archived' and 'deleted_at' columns to bookings table...");

db.serialize(() => {
    // Add is_archived column
    db.run("ALTER TABLE bookings ADD COLUMN is_archived BOOLEAN DEFAULT 0", (err) => {
        if (err && err.message.includes("duplicate column")) {
            console.log("is_archived column already exists.");
        } else if (err) {
            console.error("Error adding is_archived:", err.message);
        } else {
            console.log("Added is_archived column.");
        }
    });

    // Add deleted_at column (Soft Delete)
    db.run("ALTER TABLE bookings ADD COLUMN deleted_at DATETIME", (err) => {
        if (err && err.message.includes("duplicate column")) {
            console.log("deleted_at column already exists.");
        } else if (err) {
            console.error("Error adding deleted_at:", err.message);
        } else {
            console.log("Added deleted_at column.");
        }
    });
});

db.close(() => {
    console.log("Migration complete.");
});
