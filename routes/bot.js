const express = require('express');
const { WebBotController } = require('../controllers/bot');

const app = express.Router();

// Define a route for GET requests to /api/hello
app.post('/web', WebBotController)

module.exports = app;
