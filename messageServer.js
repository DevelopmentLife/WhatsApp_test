const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3002;

app.use(bodyParser.json());

// Initialize the SQLite database
const db = new sqlite3.Database('./messages.db', (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// CREATE: Send and store a message
app.post('/send_message', async (req, res) => {
  const { phoneNumber, message, customerId } = req.body;

  try {
    // Placeholder: In a real scenario, authenticate and get the token from Sinch
    const sessionToken = 'your-sinch-session-token';
    const sinchSendMessageUrl = `https://us.conversation.api.sinch.com/v1/projects/${process.env.SINCH_PROJECT_ID}/messages`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`
    };

    const data = {
      "to": [{"type": "whatsapp", "number": phoneNumber}],
      "from": "whatsapp_channel_number",  // Your registered WhatsApp number on Sinch
      "message": {
        "content": {
          "type": "text",
          "text": message
        }
      }
    };

    await axios.post(sinchSendMessageUrl, data, { headers });

    // Store the message in the database
    db.run("INSERT INTO messages (phone_number, message, status, customer_id) VALUES (?, ?, ?, ?)", 
      [phoneNumber, message, 'SENT', customerId], function(err) {
      if (err) {
        console.error('Error storing message:', err.message);
        return res.status(500).json({ success: false, message: 'Error storing message' });
      }
      res.json({ success: true, message: 'Message sent and stored', messageId: this.lastID });
    });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
});

// READ: Fetch all messages
app.get('/get_messages', (req, res) => {
  db.all("SELECT * FROM messages", [], (err, rows) => {
    if (err) {
      console.error('Error fetching messages:', err.message);
      return res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
    res.json({ success: true, messages: rows });
  });
});

// UPDATE: Modify an existing message (assuming you might need to update status or content)
app.put('/update_message/:id', (req, res) => {
  const { message, status } = req.body;
  db.run("UPDATE messages SET message = ?, status = ? WHERE id = ?", [message, status, req.params.id], function(err) {
    if (err) {
      console.error('Error updating message:', err.message);
      return res.status(500).json({ success: false, message: 'Error updating message' });
    }
    res.json({ success: true, message: 'Message updated' });
  });
});

// DELETE: Remove a message
app.delete('/delete_message/:id', (req, res) => {
  db.run("DELETE FROM messages WHERE id = ?", [req.params.id], function(err) {
    if (err) {
      console.error('Error deleting message:', err.message);
      return res.status(500).json({ success: false, message: 'Error deleting message' });
    }
    res.json({ success: true, message: 'Message deleted' });
  });
});

app.listen(port, () => {
  console.log(`Messaging service running on port ${port}`);
});
