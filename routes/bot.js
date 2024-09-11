const express = require('express');
const { ScrapeAndSaveControllerV1, AnswerQuestionControllerV1 } = require('../controllers/bot.js');
const { ScrapeAndSaveController, AnswerQuestionController } = require('../controllers/botV2.js');
const { ScrapeAndSaveControllerV3, AnswerQuestionControllerV3 } = require('../controllers/botV3.js');

const app = express.Router();

// Define a route for GET requests to /api/hello
app.post('/v1/web-bot/send-url', ScrapeAndSaveControllerV1)
app.post('/v1/web-bot/ask-ques', AnswerQuestionControllerV1)
app.post('/v2/web-bot/send-url', ScrapeAndSaveController)
app.post('/v2/web-bot/ask-ques', AnswerQuestionController)
app.post('/v3/web-bot/send-url', ScrapeAndSaveControllerV3)
app.post('/v3/web-bot/ask-ques', AnswerQuestionControllerV3)

module.exports = app;
