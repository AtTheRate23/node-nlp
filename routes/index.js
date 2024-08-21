const express = require('express');
const { talkToGemini, nodeNLP, processMessage, deleteAudio, restartProcessing, realtimeMessage, getName } = require('../controllers/index.js');
// const { realtimeMessage } = require('../controllers/process.js');

const app = express.Router();

// Define a route for GET requests to /api/hello
app.post('/gemini', talkToGemini);
app.post('/node-nlp', nodeNLP);
app.post('/process', processMessage);
app.post('/realtime', realtimeMessage);
app.delete('/delete-audio',deleteAudio);
app.get('/restart', restartProcessing);
app.post('/get-name', getName)

module.exports = app;
