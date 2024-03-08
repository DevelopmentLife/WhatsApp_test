const express = require('express');
const httpProxy = require('express-http-proxy');

const app = express();
const port = 3000;

// Define the proxies to your microservices
const customerServiceProxy = httpProxy('http://localhost:3001');
const messagingServiceProxy = httpProxy('http://localhost:3002');
const resellerServiceProxy = httpProxy('http://localhost:3003');

// Route requests to the respective services
app.use('/customers', (req, res, next) => customerServiceProxy(req, res, next));
app.use('/messages', (req, res, next) => messagingServiceProxy(req, res, next));
app.use('/reseller', (req, res, next) => resellerServiceProxy(req, res, next));

app.listen(port, () => {
  console.log(`Gateway running on port ${port}`);
});
