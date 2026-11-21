const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const sessionJson = fs.readFileSync('production_supabase_session.json', 'utf8');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to domain to initialize localStorage
  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });

  // Inject session
  await page.evaluate(({ sessionJson }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', sessionJson);
    localStorage.setItem('sb-jpmfsldnzptdgfhvdqpb-auth-token', sessionJson);
  }, { sessionJson });

  console.log('Navigating to https://belajarplus.com...');
  await page.goto('https://belajarplus.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('Final URL:', page.url());

  // Listen to network or inspect elements
  const pageText = await page.evaluate(() => document.body.innerText);
  console.log('Page text snippet:\n', pageText.slice(0, 500));

  // Find school switcher or links
  const schools = await page.evaluate(() => {
    // Look for links or select options
    const items = [];
    document.querySelectorAll('a, button, li').forEach(el => {
      const text = el.innerText ? el.innerText.trim() : '';
      if (text.toLowerCase().includes('purworejo') || text.toLowerCase().includes('sman')) {
        items.push({ tag: el.tagName, text: text, href: el.getAttribute('href') });
      }
    });
    return items;
  });

  console.log('Found elements related to schools:', JSON.stringify(schools, null, 2));

  await browser.close();
})();

