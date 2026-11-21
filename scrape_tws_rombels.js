const { chromium } = require('playwright');
const fs = require('fs');

async function scrapeRombelsLive() {
  const session = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const schoolId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--dns-result-order=ipv4first']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  const authSession = {
    access_token: session,
    token_type: 'bearer',
    user: { id: '32c05e30-a379-4518-a8b4-409bc2c220d4', email: 'Henrisusilo00@gmail.com' }
  };

  await context.addInitScript(({ authSession, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', JSON.stringify(authSession));
    localStorage.setItem('bp:institution:32c05e30-a379-4518-a8b4-409bc2c220d4', schoolId);
  }, { authSession, schoolId });

  const page = await context.newPage();

  console.log('Navigating to /master-data/rombel...');
  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'tws_rombels_page.png', fullPage: true });
  console.log('Screenshot saved to tws_rombels_page.png');

  const rombelData = await page.evaluate(() => {
    const rows = [];
    document.querySelectorAll('tbody tr, [role="row"]').forEach(tr => {
      const text = tr.innerText.trim().replace(/\n+/g, ' | ');
      if (text.includes('10-') || text.includes('11-') || text.includes('12-')) {
        rows.push(text);
      }
    });

    const cards = [];
    document.querySelectorAll('.rounded-xl, .rounded-2xl, .border').forEach(c => {
      const t = c.innerText.trim();
      if ((t.includes('10-') || t.includes('11-') || t.includes('12-')) && t.includes('Siswa')) {
        cards.push(t.replace(/\n+/g, ' | '));
      }
    });

    return {
      title: document.title,
      url: window.location.href,
      bodySnippet: document.body.innerText.slice(0, 1500),
      rows,
      cards: cards.slice(0, 35)
    };
  });

  console.log('Page Title:', rombelData.title);
  console.log('Rows count:', rombelData.rows.length);
  console.log('Cards count:', rombelData.cards.length);
  console.log('Sample body:\n', rombelData.bodySnippet.slice(0, 800));

  fs.writeFileSync('tws_scraped_rombels.json', JSON.stringify(rombelData, null, 2));

  await browser.close();
}

scrapeRombelsLive().catch(console.error);
