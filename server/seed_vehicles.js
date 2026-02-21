const db = require('./db');

db.serialize(() => {
    // Clear existing rules to prevent duplicates
    db.run("DELETE FROM pricing_rules;", (err) => {
        if (err) console.error("Clean failed:", err.message);
        else console.log("Cleaned pricing_rules table.");
    });

    // Insert Sedan
    db.run(`INSERT INTO pricing_rules (min_pax, max_pax, vehicle_name, vehicle_image, one_way_price, return_price, vehicle_features, detail_link) 
    VALUES (1, 4, 'Standard Sedan', '/assets/sedan.jpeg', 50, 90, 'Air Con, 3 Bags, Free WiFi', '/vehicle/sedan')`, (err) => {
        if (err) console.error("Error adding Sedan:", err.message);
        else console.log("Added Standard Sedan (1-4 pax)");
    });

    // Insert Vito
    db.run(`INSERT INTO pricing_rules (min_pax, max_pax, vehicle_name, vehicle_image, one_way_price, return_price, vehicle_features, detail_link) 
    VALUES (5, 8, 'Mercedes Vito', '/assets/vito.jpeg', 75, 140, 'VIP, Air Con, 8 Bags', '/vehicle/vito')`, (err) => {
        if (err) console.error("Error adding Vito:", err.message);
        else console.log("Added Mercedes Vito (5-8 pax)");
    });

    // Verify
    db.all("SELECT count(*) as count FROM pricing_rules", (err, rows) => {
        if (rows) console.log("Total Rules:", rows[0].count);
    });
});
