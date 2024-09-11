const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const cache = require('memory-cache');
const xml2js = require('xml2js');
const ChatBot = require('../models/WebBot.js')

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { processQuestionWithoutAI } = require('./customBot');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to fetch and parse the sitemap (support both sitemapindex and urlset)
const fetchSitemapUrls = async (sitemapUrl) => {
    try {
        const response = await axios.get(sitemapUrl);
        const sitemapXml = response.data;

        // Parse the XML
        const parser = new xml2js.Parser();
        const parsedXml = await parser.parseStringPromise(sitemapXml);

        let urls = [];

        // Check if it's a sitemap index file
        if (parsedXml.sitemapindex && parsedXml.sitemapindex.sitemap) {
            const sitemaps = parsedXml.sitemapindex.sitemap;
            const promises = sitemaps.map(sitemap => {
                const loc = sitemap.loc[0];
                // Recursively fetch URLs from each sitemap
                return fetchSitemapUrls(loc);
            });
            const results = await Promise.all(promises);
            urls = urls.concat(...results);
        }

        // Check if it's a standard urlset
        if (parsedXml.urlset && parsedXml.urlset.url) {
            const urlEntries = parsedXml.urlset.url;
            urls = urlEntries.map(entry => entry.loc[0]);
        }

        return urls;
    } catch (error) {
        console.error('Error fetching sitemap:', error);
        return [];
    }
};

// Function to check for robots.txt and extract sitemap locations
const fetchFromRobotsTxt = async (baseUrl) => {
    try {
        const response = await axios.get(`${baseUrl}/robots.txt`);
        const robotsTxt = response.data;
        // console.log("robotsTxt", robotsTxt)

        const sitemapRegex = /Sitemap:\s*(.*)/gi;
        let sitemaps = [];
        let match;
        while ((match = sitemapRegex.exec(robotsTxt)) !== null) {
            sitemaps.push(match[1]);
        }
        return sitemaps;
    } catch (error) {
        console.error('Error fetching robots.txt:', error);
        return [];
    }
};

// Function to scrape a site without sitemap (fallback)
const crawlSite = async (url, maxDepth = 5, currentDepth = 0, visited = new Set()) => {
    if (currentDepth > maxDepth || visited.has(url)) return [];
    visited.add(url);

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const links = $('a[href]').map((index, element) => $(element).attr('href')).get();
        const content = response.data;

        // Recursively crawl the links on the site (limit to internal links)
        const internalLinks = links.filter(link => link.startsWith(url));
        let allContent = [content];
        for (const link of internalLinks) {
            const moreContent = await crawlSite(link, maxDepth, currentDepth + 1, visited);
            allContent.push(...moreContent);
        }

        return allContent;
    } catch (error) {
        console.error('Error crawling site:', error);
        return [];
    }
};

// Function to scrape data from a given URL
const scrapeData = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const content = await page.content();
        await browser.close();
        return content;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return '';
    }
};

// Scraping API: This API will scrape and store data from the provided URL
exports.ScrapeAndSaveController = async (req, res) => {
    const { url } = req.body;

    // Step 1: Attempt to find sitemaps
    let sitemapUrls = await fetchSitemapUrls(`${url}/sitemap.xml`);

    // Step 2: If no sitemap at default location, try robots.txt
    if (sitemapUrls.length === 0) {
        const robotSitemapUrls = await fetchFromRobotsTxt(url);
        for (const sitemap of robotSitemapUrls) {
            const additionalUrls = await fetchSitemapUrls(sitemap);
            sitemapUrls = sitemapUrls.concat(additionalUrls);
        }
    }

    // Step 3: Fallback to crawling if no sitemap found
    let scrapedData = '';
    if (sitemapUrls.length === 0) {
        console.warn('No sitemap found. Falling back to crawling the site.');
        const crawledContent = await crawlSite(url);
        scrapedData = crawledContent.join(' ');
    } else {
        // Scrape data from all URLs in the sitemap
        const promises = sitemapUrls.map(async (siteUrl) => {
            const cacheKey = `scraped-data-${siteUrl}`;
            let cachedData = cache.get(cacheKey);

            if (!cachedData) {
                cachedData = await scrapeData(siteUrl);
                cache.put(cacheKey, cachedData, 3600000); // Cache for 1 hour
            }
            return cachedData;
        });
        const results = await Promise.all(promises);
        scrapedData = results.join(' ');
    }

    // Save the scraped data (for now, use memory-cache for simplicity)
    const cacheKey = `scraped-data-${url}`;
    cache.put(cacheKey, scrapedData, 3600000); // Cache for 1 hour

    res.json({ response: "Hi, I'm your virtual assistant! What's your name? I'm ready to help you to uncover the information you need." });
};

// Function to process the question using Google Generative AI
const processQuestionWithGoogleAI = async (data, question) => {
    try {
        const prompt = `
            You are given a website's scraped data. Analyze the content and provide a concise and relevant answer to the user's question based on the data. Ensure the response includes specific technologies or details relevant to the question.

            Here is the data:
            "${data}"
            
            The user's question is: "${question}"

            Provide a clear and customized response, focusing on the relevant details.
        `;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const transcription = response.text();

        return transcription;
    } catch (error) {
        console.error('Error with Google Generative AI:', error);
        return 'Sorry, I could not generate a response at this time.';
    }
};

// Question API: This API will use saved data to answer questions
exports.AnswerQuestionController = async (req, res) => {
    const { message, url, id } = req.body;

    // Retrieve the saved scraped data from cache
    const cacheKey = `scraped-data-${url}`;
    const scrapedData = cache.get(cacheKey);

    if (!scrapedData) {
        return res.status(404).json({ message: 'No data found for the given URL. something went wrong.' });
    }

    // Process the user's question with Google Generative AI
    const response = await processQuestionWithGoogleAI(scrapedData, message);
    // check wheather id is empty or not

    if (id) {
        const payload = {
            chat_id: id,
            user_query: message,
            bot_resp: response
        }
        await ChatBot.InsertChats(payload, (err, result) => {
            if (err) throw err;
            const data = {
                id,
                user_query: message,
                bot_resp: response,
            }
            res.status(200).json({ message: 'Chats updated successfully!', data, response });
        })
    } else {
        const payload = {
            first_message: message,
        }
        await ChatBot.createChat(payload, (err, result) => {
            if (err) throw err;
            const data = {
                id: result.insertId,
                user_query: message,
                bot_resp: response,
            }
            res.status(200).json({ message: 'Chats created successfully!', data, response });
        })
    }
};


