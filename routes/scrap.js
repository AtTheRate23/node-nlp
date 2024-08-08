const express = require('express');
const { ScrapCheerio, ScrapPuppeteer } = require('../controllers/scrap');

const app = express.Router();

// Define a route for GET requests to /api/hello
app.get('/cheerio', ScrapCheerio)
app.get('/puppeteer', ScrapPuppeteer)

module.exports = app;