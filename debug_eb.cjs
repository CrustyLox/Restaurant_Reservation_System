const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174/dashboard', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Fill login
  try {
    await page.type('input[type="email"]', 'cherry@demo.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  } catch(e) {}
  
  const html = await page.evaluate(() => document.body.innerText);
  console.log('TEXT:', html.substring(0, 500));
  
  await browser.close();
})();
