const puppeteer = require('puppeteer');
const cache = require('memory-cache');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

exports.ScrapeAndSaveControllerV1 = async (req, res) => {
    const { url } = req.body;

    // Scrape data from the website URL
    const scrapeData = async (url) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const content = await page.content();
        await browser.close();
        return content;
    };

    // Cache the scraped data
    const cacheKey = `scraped-data-${url}`;
    let cachedData = cache.get(cacheKey);
    if (!cachedData) {
        cachedData = await scrapeData(url);
        cache.put(cacheKey, cachedData, 3600000); // cache for 1 hour
    }

    res.json({ response: "I'm ready to help you, aske me anything related to given url." });
};

exports.AnswerQuestionControllerV1 = async (req, res) => {
    const { message, url } = req.body;

    // Retrieve the saved scraped data from cache
    const cacheKey = `scraped-data-${url}`;
    const scrapedData = cache.get(cacheKey);

    if (!scrapedData) {
        return res.status(404).json({ message: 'No data found for the given URL. Please scrape the site first.' });
    }

    // Process the user's question with Google Generative AI
    const response = await processQuestionWithGoogleAI(scrapedData, message);
    res.json({ response });
};


// Function to process the question using Google Generative AI
const processQuestionWithGoogleAI = async (data, question) => {
    try {
        const prompt = `
      You are given a website's scraped data. Analyze the content and provide a concise and relevant answer to the user's question based on the data. Ensure the response includes specific technologies or details relevant to the question. Do not include introductory phrases or statements about the source of the information.

      Here is the data:
      "${data}"
      
      The user's question is: "${question}"

      Provide a clear and customized response, focusing on the relevant details. Include the most pertinent technologies or information directly related to the question without additional context or source information.
    `;
        const result = await model.generateContent(prompt)
        const response = result.response;
        const transcription = response.text();

        // return completion.choices[0].message.content.trim();
        return transcription;
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        return 'Sorry, I could not generate a response at this time.';
    }
};
