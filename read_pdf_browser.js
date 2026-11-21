const { chromium } = require('playwright');
const fs = require('fs');

async function readPdfViaBrowser() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Load PDF file
  const filePath = 'file:///G:/My%20Drive/Trainer/B+/AKUN/03.%20SMAN%2011%20Purworejo/Laporan_Data_Akun_Guru_dan_PTK_SMAN_11_Purworejo.pdf';
  console.log('Loading PDF in browser:', filePath);
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Coba ambil teks dari pdf viewer bawaan chrome
  const text = await page.evaluate(() => {
    // Chrome internal pdf plugin
    return document.body ? document.body.innerText : '';
  });

  console.log('Text from chrome PDF viewer:\n', text.slice(0, 1000));
  fs.writeFileSync('pdf_guru_text.txt', text);

  await browser.close();
}

readPdfViaBrowser().catch(console.error);

