const unzipper = require('unzipper');
const fs = require('fs');

async function parseSheetProperly() {
  const filePath = 'G:/My Drive/Trainer/B+/Update data akun terbaru/1 Tawangsari/Master_Data_Siswa_SMAN_1_Tawangsari-1.xlsx';
  const directory = await unzipper.Open.file(filePath);

  // 1. Parse Shared Strings
  const sharedFile = directory.files.find(f => f.path.replace(/\\/g, '/').toLowerCase() === 'xl/sharedstrings.xml');
  const sxml = (await sharedFile.buffer()).toString('utf8');
  const siMatches = [...sxml.matchAll(/<si>([\s\S]*?)<\/si>/g)];
  const sharedStrings = siMatches.map(si => {
    const texts = [...si[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(t => t[1]);
    return texts.join('');
  });
  console.log(`Total shared strings: ${sharedStrings.length}`);

  // 2. Parse Sheet1
  const sheetFile = directory.files.find(f => f.path.replace(/\\/g, '/').toLowerCase() === 'xl/worksheets/sheet1.xml');
  const xml = (await sheetFile.buffer()).toString('utf8');

  // Cari semua <row ...> ... </row>
  const rowRegex = /<row\s+[^>]*?r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  const rows = [];
  let m;
  while ((m = rowRegex.exec(xml)) !== null) {
    const rowNum = parseInt(m[1]);
    const rowContent = m[2];

    // Parse cells: <c r="A1" ...>...</c>
    const cellRegex = /<c\s+[^>]*?r="([A-Z]+)\d+"([^>]*)>(?:<v>([^<]*)<\/v>)?<\/c>/g;
    let cm;
    const rowData = { _row: rowNum };
    while ((cm = cellRegex.exec(rowContent)) !== null) {
      const col = cm[1];
      const attrs = cm[2];
      const rawVal = cm[3];

      let val = rawVal;
      if (attrs.includes('t="s"') && rawVal !== undefined) {
        val = sharedStrings[parseInt(rawVal)] || '';
      }
      rowData[col] = val !== undefined ? String(val).trim() : '';
    }
    rows.push(rowData);
  }

  console.log(`Total rows parsed: ${rows.length}`);
  console.log('Header (Row 1):', rows[0]);
  console.log('Sample Row 2:', rows[1]);
  console.log('Sample Row 3:', rows[2]);
  console.log('Last Row:', rows[rows.length - 1]);

  fs.writeFileSync('tws_latest_students_parsed.json', JSON.stringify(rows, null, 2));

  // Analisa Rombel dari file ini
  const header = rows[0];
  // Cari kolom rombel (nama kolom atau value)
  console.log('\nColumn names:');
  for (const [col, val] of Object.entries(header)) {
    console.log(`  Col ${col}: "${val}"`);
  }

  // Distribusi rombel
  const rombelDist = {};
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    // Coba tebak kolom rombel (misal D, E, F)
    const rombelVal = r.D || r.E || r.C || 'KOSONG';
    rombelDist[rombelVal] = (rombelDist[rombelVal] || 0) + 1;
  }
  console.log('\nDistribusi Rombel (sample col D):', rombelDist);
}

parseSheetProperly().catch(console.error);

