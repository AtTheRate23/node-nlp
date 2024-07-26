const express = require('express');
const { nlp, talkToGemini, nodeNLP } = require('../controllers/index.js');

const app = express.Router();

// Define a route for GET requests to /api/hello
app.get('/gemini', talkToGemini);
app.post('/nlp', nlp);
app.post('/node-nlp', nodeNLP)

module.exports = app;
