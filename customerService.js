const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

const db = new sqlite3.Database('./whatsapp.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
    return;
  }
  console.log('Customer service connected to the SQLite database.');
});

// CRUD endpoints for customers
app.post('/create_customer', (req, res) => {
  const { name, otherDetails } = req.body;
  db.run("INSERT INTO customers (name, other_details) VALUES (?, ?)", [name, otherDetails], function(err) {
    if (err) {
      console.error('Error creating customer:', err.message);
      return res.status(500).json({ success: false, message: 'Error creating customer' });
    }
    res.json({ success: true, message: 'Customer created', customerId: this.lastID });
  });
});

app.get('/get_customers', (req, res) => {
  db.all("SELECT * FROM customers", [], (err, rows) => {
    if (err) {
      console.error('Error fetching customers:', err.message);
      return res.status(500).json({ success: false, message: 'Error fetching customers' });
    }
    res.json({ customers: rows });
  });
});

app.delete('/delete_customer/:id', (req, res) => {
  db.run("DELETE FROM customers WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error('Error deleting customer:', err.message);
      return res.status(500).json({ success: false, message: 'Error deleting customer' });
    }
    res.json({ success: true, message: 'Customer deleted' });
  });
});

app.put('/update_customer/:id', (req, res) => {
  const { name, otherDetails } = req.body;
  db.run("UPDATE customers SET name = ?, other_details = ? WHERE id = ?", [name, otherDetails, req.params.id], (err) => {
    if (err) {
      console.error('Error updating customer:', err.message);
      return res.status(500).json({ success: false, message: 'Error updating customer' });
    }
    res.json({ success: true, message: 'Customer updated' });
  });
});

app.listen(PORT, () => {
  console.log(`Customer service running on port ${PORT}`);
});
