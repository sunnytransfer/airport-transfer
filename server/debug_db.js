const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'transport.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.all("PRAGMA table_info(settings)", (err, rows) => {
        if (err) {
            console.error("Error fetching schema:", err);
            return;
        }
        console.log("Schema for 'settings':", rows);
    });

    // Check SQLite version
    db.get("SELECT sqlite_version() as version", (err, row) => {
        console.log("SQLite Version:", row.version);
    });
});

db.close();
