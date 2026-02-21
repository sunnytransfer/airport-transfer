const db = require('./db');

const addColumn = (colName, colType) => {
    db.run(`ALTER TABLE bookings ADD COLUMN ${colName} ${colType}`, (err) => {
        if (err) {
            if (err.message.includes('duplicate column')) {
                console.log(`Column ${colName} already exists.`);
            } else {
                console.error(`Error adding column ${colName}:`, err.message);
            }
        } else {
            console.log(`Column ${colName} added successfully.`);
        }
    });
};

addColumn('driver_name', 'TEXT');
addColumn('driver_phone', 'TEXT'); // Optional for future
