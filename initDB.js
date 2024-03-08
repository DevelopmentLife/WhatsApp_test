const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./whatsapp.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Create customers table
db.run(`CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  other_details TEXT
)`, (err) => {
  if (err) {
    console.log('Error creating customers table', err);
    return;
  }
  console.log('Customers table created or already exists.');
});

// Create messages table
db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  customer_id INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
)`, (err) => {
  if (err) {
    console.log('Error creating messages table', err);
    return;
  }
  console.log('Messages table created or already exists.');
});

// You can add more tables as necessary for numbers or resellers

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing the database', err);
    return;
  }
  console.log('Database connection closed.');
});
