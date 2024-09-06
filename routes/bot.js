const express = require('express');
const { OpenAiController } = require('../controllers/bot');

const app = express.Router();

// Define a route for GET requests to /api/hello
app.post('/web', OpenAiController)

module.exports = app;
