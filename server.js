const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const SCREENSHOTS_DIR = 'screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR);
}

app.get('/screenshot', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const screenshotPath = path.join(SCREENSHOTS_DIR, `${url.replace(/[^a-zA-Z]/g, '_')}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await browser.close();
        res.json({ message: 'Screenshot taken', path: screenshotPath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
