const db = require('./db');

const fixTypos = () => {
    console.log('Scanning for typos "Pessenger"...');

    // Check settings table
    db.all("SELECT key, value, draft_value FROM settings", [], (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        rows.forEach(row => {
            let updateNeeded = false;
            let newValue = row.value;
            let newDraft = row.draft_value;

            if (row.value && row.value.includes('Pessenger')) {
                console.log(`Fixing typo in settings key: ${row.key} (value)`);
                newValue = row.value.replace(/Pessenger/g, 'Passenger');
                updateNeeded = true;
            }

            if (row.draft_value && row.draft_value.includes('Pessenger')) {
                console.log(`Fixing typo in settings key: ${row.key} (draft)`);
                newDraft = row.draft_value.replace(/Pessenger/g, 'Passenger');
                updateNeeded = true;
            }

            if (updateNeeded) {
                db.run("UPDATE settings SET value = ?, draft_value = ? WHERE key = ?", [newValue, newDraft, row.key], (err) => {
                    if (err) console.error(`Failed to update ${row.key}`);
                    else console.log(`Updated ${row.key}`);
                });
            }
        });
    });

    // Check bookings table (note field maybe?)
    db.all("SELECT id, note FROM bookings WHERE note LIKE '%Pessenger%'", [], (err, rows) => {
        if (err) return;
        rows.forEach(row => {
            const newNote = row.note.replace(/Pessenger/g, 'Passenger');
            db.run("UPDATE bookings SET note = ? WHERE id = ?", [newNote, row.id], (err) => {
                if (!err) console.log(`Fixed booking note ${row.id}`);
            });
        });
    });
};

fixTypos();
