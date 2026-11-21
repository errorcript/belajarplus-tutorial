const { chromium } = require('playwright');

const accounts = [
  { name: 'Andrew', email: 'And.aliffiansyah@gmail.com', pass: 'kerja98' },
  { name: 'Adnan', email: 'adnancindyana1234@gmail.com', pass: 'trainer98' },
  { name: 'Arum', email: 'rumaysch@gmail.com', pass: 'A410Arum' },
  { name: 'Mevi', email: 'Fitrinoveiraa@gmail.com', pass: 'Mevi2026^' }
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (let acc of accounts) {
    const page = await browser.newPage();
    console.log(`Checking ${acc.name}...`);
    await page.goto('https://belajarplus.com/auth', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', acc.email);
    await page.fill('input[type="password"]', acc.pass);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    const text = await page.evaluate(() => document.body.innerText.replace(/\n+/g, ' '));
    console.log(`${acc.name} snippet: ${text.substring(0, 200)}`);
    if (text.toLowerCase().includes('sukodono')) {
      console.log(`🎯 FOUND SUKODONO ON ${acc.name}!`);
      // Find exact card
      const institutions = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('li, div.border.rounded-xl, div.border.rounded-lg, div'))
          .map(el => el.innerText.split('\n')[0].trim())
          .filter(t => t.length > 5 && t.length < 50);
      });
      console.log('Institutions visible on page:', institutions.slice(0, 10));
    }
    await page.close();
  }
  await browser.close();
})();

