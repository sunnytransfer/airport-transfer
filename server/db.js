const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'transport.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

function initDb() {
  db.serialize(() => {
    // Bookings Table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      pickup_location TEXT NOT NULL,
      dropoff_location TEXT NOT NULL,
      flight_time DATETIME,
      pickup_time DATETIME NOT NULL,
      is_return BOOLEAN DEFAULT 0,
      status TEXT DEFAULT 'pending',
      hotel_name TEXT,
      flight_number TEXT,
      note TEXT,
      passenger_count INTEGER DEFAULT 1,
      payment_status TEXT DEFAULT 'Pending' CHECK(payment_status IN ('Pending', 'Paid', 'Failed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Photos Table
    db.run(`CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_path TEXT,
      optimized_path TEXT,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Pricing Rules Table
    db.run(`CREATE TABLE IF NOT EXISTS pricing_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      min_pax INTEGER NOT NULL,
      max_pax INTEGER NOT NULL,
      vehicle_name TEXT NOT NULL,
      vehicle_image TEXT,
      one_way_price REAL NOT NULL,
      return_price REAL NOT NULL,
      vehicle_features TEXT,
      detail_link TEXT
    )`);

    // Settings Table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      draft_value TEXT,
      history TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Add columns if they don't exist (migrations)
    const addColumn = (colName, colType) => {
      db.run(`ALTER TABLE settings ADD COLUMN ${colName} ${colType}`, (err) => {
        // Ignore error if column already exists
      });
    };

    addColumn('draft_value', 'TEXT');
    addColumn('history', 'TEXT');
    addColumn('published_at', 'DATETIME');

    console.log('Database tables initialized. Seeding skipped for stability.');
  });
}

initDb();

module.exports = db;
