const express = require('express');
const { talkToGemini, nodeNLP, talkToOpenAI, naturalNLP, processMessage, realtimeMessage } = require('../controllers/index.js');

const app = express.Router();

// Define a route for GET requests to /api/hello
app.post('/gemini', talkToGemini);
app.post('/openai', talkToOpenAI);
app.post('/natural-nlp', naturalNLP);
app.post('/node-nlp', nodeNLP);
app.post('/process', processMessage);
app.post('/realtime', realtimeMessage);

module.exports = app;
