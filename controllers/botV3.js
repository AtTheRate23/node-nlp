// const cheerio = require('cheerio');
// const axios = require('axios');
// const cache = require('memory-cache');
// const xml2js = require('xml2js');
// const ChatBot = require('../models/WebBot.js');
// const { Cluster } = require('puppeteer-cluster');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const { OpenAI } = require('openai');

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// // Puppeteer cluster for concurrent scraping
// const cluster = Cluster.launch({
//     concurrency: Cluster.CONCURRENCY_CONTEXT,
//     maxConcurrency: 5,  // Adjust based on server's capacity
// });

// // Function to fetch and parse the sitemap
// const fetchSitemapUrls = async (sitemapUrl) => {
//     try {
//         const response = await axios.get(sitemapUrl);
//         const sitemapXml = response.data;

//         // Parse the XML
//         const parser = new xml2js.Parser();
//         const parsedXml = await parser.parseStringPromise(sitemapXml);

//         let urls = [];

//         if (parsedXml.sitemapindex && parsedXml.sitemapindex.sitemap) {
//             const sitemaps = parsedXml.sitemapindex.sitemap.map(sitemap => sitemap.loc[0]);
//             const results = await Promise.all(sitemaps.map(fetchSitemapUrls));
//             urls = urls.concat(...results);
//         }

//         if (parsedXml.urlset && parsedXml.urlset.url) {
//             urls = parsedXml.urlset.url.map(entry => entry.loc[0]);
//         }

//         return urls;
//     } catch (error) {
//         console.error('Error fetching sitemap:', error);
//         return [];
//     }
// };

// // Fetch sitemap locations from robots.txt
// const fetchFromRobotsTxt = async (baseUrl) => {
//     try {
//         const response = await axios.get(`${baseUrl}/robots.txt`);
//         const sitemapRegex = /Sitemap:\s*(.*)/gi;
//         const sitemaps = [];
//         let match;
//         while ((match = sitemapRegex.exec(response.data)) !== null) {
//             sitemaps.push(match[1]);
//         }
//         return sitemaps;
//     } catch (error) {
//         console.error('Error fetching robots.txt:', error);
//         return [];
//     }
// };

// // Cheerio-based scraping (for lightweight scraping without JS rendering)
// const cheerioScrapeData = async (url) => {
//     try {
//         const response = await axios.get(url);
//         const $ = cheerio.load(response.data);
//         return $.html(); // Modify to scrape specific elements if necessary
//     } catch (error) {
//         console.error(`Error scraping ${url}:`, error);
//         return '';
//     }
// };

// // Puppeteer-based scraping using cluster
// const puppeteerScrapeData = async (url) => {
//     try {
//         const result = await cluster.execute(url);
//         return result;
//     } catch (error) {
//         console.error(`Error scraping ${url}:`, error);
//         return '';
//     }
// };

// // Scraping API: Scrape and store data
// exports.ScrapeAndSaveControllerV3 = async (req, res) => {
//     const { url } = req.body;

//     let sitemapUrls = await fetchSitemapUrls(`${url}/sitemap.xml`);

//     if (sitemapUrls.length === 0) {
//         const robotSitemapUrls = await fetchFromRobotsTxt(url);
//         const additionalUrls = await Promise.all(robotSitemapUrls.map(fetchSitemapUrls));
//         sitemapUrls = sitemapUrls.concat(...additionalUrls);
//     }

//     let scrapedData = '';
//     if (sitemapUrls.length === 0) {
//         console.warn('No sitemap found. Falling back to crawling the site.');
//         scrapedData = await cheerioScrapeData(url);  // Use Cheerio for lightweight scraping
//     } else {
//         // Scrape data from URLs in sitemap using Puppeteer cluster
//         const cacheKey = `scraped-data-${url}`;
//         const promises = sitemapUrls.map(async (siteUrl) => {
//             let cachedData = cache.get(siteUrl);
//             if (!cachedData) {
//                 cachedData = await puppeteerScrapeData(siteUrl);
//                 cache.put(siteUrl, cachedData, 3600000); // Cache for 1 hour
//             }
//             return cachedData;
//         });
//         const results = await Promise.all(promises);
//         scrapedData = results.join(' ');
//     }

//     // Cache and return success
//     cache.put(`scraped-data-${url}`, scrapedData, 3600000);
//     res.json({ response: "Hi, I'm your virtual assistant! I'm ready to help you to uncover the information you need. How can I help you today?" });
// };

// // Google AI processing
// const processQuestionWithGoogleAI = async (data, question) => {
//     try {
//         // Optional: Trim data if too long
//         // const promptData = data.length > 5000 ? data.substring(0, 5000) : data;
//         const prompt = `
//         You are given a website's scraped data. Analyze the content and provide a concise and relevant answer to the user's question based on the data. Ensure the response includes specific technologies or details relevant to the question.

//         Here is the data:
//         "${data}"
        
//         The user's question is: "${question}"

//         Provide a clear and customized response, focusing on the relevant details.
//     `;
//         const result = await model.generateContent(prompt);
//         let responseText = await result.response.text();

//         // Remove any sentences that contain scraped data
//         const sanitizedText = responseText
//             .split('. ')
//             .filter(sentence => !data.includes(sentence.trim()))
//             .join('. ');

//         return sanitizedText;
//     } catch (error) {
//         console.error('Error with Google Generative AI:', error);
//         return 'Sorry, I could not generate a response at this time.';
//     }
// };

// const processQuestionWithOpenAI = async (data, question) => {
//     try {
//         const prompt = `
//         You are given a website's scraped data. Analyze the content and provide a concise and relevant answer to the user's question based on the data. Ensure the response includes specific technologies or details relevant to the question.
  
//         Here is the data:
//         "${data}"
  
//         The user's question is: "${question}"
  
//         Provide a clear and customized response, focusing on the relevant details.
//       `;
//         const response = await openai.chat.completions.create({
//             model: 'gpt-4o-mini',
//             prompt: prompt,
//             temperature: 0.5,
//             max_tokens: 2048,
//         });
//         let responseText = response.choices[0].text;

//         // Remove any sentences that contain scraped data
//         const sanitizedText = responseText
//             .split('. ')
//             .filter(sentence => !data.includes(sentence.trim()))
//             .join('. ');

//         return sanitizedText;
//     } catch (error) {
//         console.error('Error with OpenAI:', error);
//         return 'Sorry, I could not generate a response at this time.';
//     }
// };

// // Question API: Use saved data to answer questions
// exports.AnswerQuestionControllerV3 = async (req, res) => {
//     const { message, url, id } = req.body;

//     const cacheKey = `scraped-data-${url}`;
//     const scrapedData = cache.get(cacheKey);

//     if (!scrapedData) {
//         return res.status(404).json({ message: 'something went wrong. please try again' });
//     }
//     // const response = await processQuestionWithGoogleAI(scrapedData, message);
//     const response = await processQuestionWithOpenAI(scrapedData, message);

//     if (id) {
//         const payload = { chat_id: id, user_query: message, bot_resp: response };
//         await ChatBot.InsertChats(payload, (err, result) => {
//             if (err) throw err;
//             res.status(200).json({ message: 'Chats updated successfully!', data: { id, user_query: message, bot_resp: response }, response });
//         });
//     } else {
//         const payload = { first_message: message };
//         await ChatBot.createChat(payload, (err, result) => {
//             if (err) throw err;
//             res.status(200).json({ message: 'Chats created successfully!', data: { id: result.insertId, user_query: message, bot_resp: response }, response });
//         });
//     }
// };
