const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
const fs = require('fs');

async function parsePdf(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjs.getDocument(data).promise;
  console.log('PDF Pages:', doc.numPages);
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += '\n--- PAGE ' + i + ' ---\n' + pageText;
  }
  return fullText;
}

parsePdf('G:\\My Drive\\Trainer\\B+\\AKUN\\03. SMAN 11 Purworejo\\Laporan_Data_Akun_Guru_dan_PTK_SMAN_11_Purworejo.pdf')
  .then(text => {
    fs.writeFileSync('extracted_guru_purworejo11.txt', text);
    console.log('Extracted characters:', text.length);
    console.log('Preview first 1200 chars:\n', text.slice(0, 1200));
  })
  .catch(console.error);

