const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

// Endpoint to handle reseller registration
app.post('/register_reseller', (req, res) => {
  const { resellerInfo } = req.body;
  // Logic to register reseller with Sinch or within your system
  res.json({ success: true, message: 'Reseller registered', resellerId: 'generatedResellerId' });
});

// Endpoint to provision a number for a reseller
app.post('/provision_number', (req, res) => {
  const { resellerId } = req.body;
  // Logic to provision a number via Sinch and associate it with the resellerId
  res.json({ success: true, message: 'Number provisioned', number: 'generatedNumber' });
});

app.listen(PORT, () => {
  console.log(`Reseller service running on port ${PORT}`);
});
