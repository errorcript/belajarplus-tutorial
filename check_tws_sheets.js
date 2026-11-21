const unzipper = require('unzipper');
const fs = require('fs');

async function checkAllSheets() {
  const filePath = 'G:/My Drive/Trainer/B+/Update data akun terbaru/1 Tawangsari/Master_Data_Siswa_SMAN_1_Tawangsari-1.xlsx';
  const directory = await unzipper.Open.file(filePath);
  
  // Baca workbook.xml
  const wbFile = directory.files.find(f => f.path.replace(/\\/g, '/').toLowerCase() === 'xl/workbook.xml');
  const wbXml = (await wbFile.buffer()).toString('utf8');
  console.log('--- SHEETS IN WORKBOOK ---');
  const sheetMatches = [...wbXml.matchAll(/<sheet[^>]*name="([^"]+)"[^>]*sheetId="([^"]+)"[^>]*r:id="([^"]+)"/g)];
  sheetMatches.forEach(m => console.log(`Sheet Name: "${m[1]}" | ID: ${m[2]} | rId: ${m[3]}`));

  // Baca sharedStrings.xml
  const sharedFile = directory.files.find(f => f.path.replace(/\\/g, '/').toLowerCase() === 'xl/sharedstrings.xml');
  let sharedStrings = [];
  if (sharedFile) {
    const sxml = (await sharedFile.buffer()).toString('utf8');
    // Ambil semua teks di dalam <si>
    const siMatches = [...sxml.matchAll(/<si>([\s\S]*?)<\/si>/g)];
    sharedStrings = siMatches.map(si => {
      const texts = [...si[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(t => t[1]);
      return texts.join('');
    });
    console.log(`Loaded ${sharedStrings.length} shared strings properly`);
  }

  // Periksa masing-masing sheet1, sheet2, sheet3
  for (let s = 1; s <= 3; s++) {
    const sheetFile = directory.files.find(f => f.path.replace(/\\/g, '/').toLowerCase() === `xl/worksheets/sheet${s}.xml`);
    if (!sheetFile) continue;
    const sxml = (await sheetFile.buffer()).toString('utf8');
    const rowMatches = [...sxml.matchAll(/<row r="(\d+)">([\s\S]*?)<\/row>/g)];
    console.log(`\n=== SHEET ${s} (${sheetMatches[s - 1]?.[1] || 'Unknown'}): ${rowMatches.length} rows ===`);

    // Parse 5 baris pertama
    for (let i = 0; i < Math.min(5, rowMatches.length); i++) {
      const r = rowMatches[i];
      const rowNum = r[1];
      const cells = [...r[2].matchAll(/<c r="([A-Z]+)\d+"(?: t="([^"]*)")?[^>]*>(?:<v>([^<]*)<\/v>)?<\/c>/g)];
      const rowObj = {};
      for (const c of cells) {
        const col = c[1];
        const type = c[2];
        const val = c[3];
        let textVal = val;
        if (type === 's' && val !== undefined) {
          textVal = sharedStrings[parseInt(val)];
        }
        rowObj[col] = textVal;
      }
      console.log(`Row ${rowNum}:`, JSON.stringify(rowObj));
    }
  }
}

checkAllSheets().catch(console.error);

