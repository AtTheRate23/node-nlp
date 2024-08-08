const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const axios = require('axios');

const ScrapCheerio = async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL query parameter is required' });
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Get the page title
        const title = $('title').text();

        // Organize content by type
        const content = {
            paragraphs: [],
            headings: [],
            listItems: [],
            others: []
        };

        // Get text from all paragraphs
        $('p').each((index, element) => {
            content.paragraphs.push($(element).text().trim());
        });

        // Get text from all headings
        for (let i = 1; i <= 6; i++) {
            $(`h${i}`).each((index, element) => {
                content.headings.push({
                    level: `h${i}`,
                    text: $(element).text().trim()
                });
            });
        }

        // Get text from all list items
        $('li').each((index, element) => {
            content.listItems.push($(element).text().trim());
        });

        // Get other text content (excluding style and script)
        // $('body *').not('style, script, p, h1, h2, h3, h4, h5, h6, li').each((index, element) => {
        //     const text = $(element).text().trim();
        //     if (text) {
        //         content.others.push(text);
        //     }
        // });

        // Get all links
        const links = $('a').map((i, el) => $(el).attr('href')).get();

        // Get all images (with their alt text and src)
        const images = $('img').map((i, el) => ({
            src: $(el).attr('src'),
            alt: $(el).attr('alt') || ''
        })).get();

        // Sending the organized scraped data as a JSON response
        res.json({
            title,
            content,
            links,
            images
        });
    } catch (error) {
        res.status(500).json({ error: `Error fetching data: ${error.message}` });
    }
}

const ScrapPuppeteer = async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL query parameter is required' });
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);

        // Example: Get the title and paragraphs
        const title = await page.title();
        const paragraphs = await page.evaluate(() =>
            Array.from(document.querySelectorAll('p')).map(p => p.innerText)
        );

        await browser.close();
        res.json({ title, paragraphs });
    } catch (error) {
        res.status(500).json({ error: `Error fetching data: ${error.message}` });
    }
}

module.exports = { ScrapCheerio, ScrapPuppeteer };