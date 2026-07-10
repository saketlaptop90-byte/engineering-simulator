import puppeteer from 'puppeteer';
import express from 'express';
import path from 'path';

const app = express();
app.use(express.static('.'));

(async () => {
  const server = app.listen(8081, async () => {
    console.log("Server running on port 8081");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    page.on('requestfailed', req => console.log('REQ FAIL:', req.url(), req.failure().errorText));
    
    await page.goto('http://localhost:8081/simulator.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    await new Promise(r => setTimeout(r, 8000));
    
    const status = await page.evaluate(() => {
      const s = document.getElementById('loader-status');
      return s ? s.textContent : 'No loader-status';
    });
    console.log("LOADER STATUS:", status);
    
    await browser.close();
    server.close();
  });
})();
