const unzipper = require('unzipper');
const fs = require('fs');

async function parseLatestSiswa() {
  const filePath = 'G:/My Drive/Trainer/B+/Update data akun terbaru/1 Tawangsari/Master_Data_Siswa_SMAN_1_Tawangsari-1.xlsx';
  console.log('Reading latest siswa file:', filePath);
  
  const directory = await unzipper.Open.file(filePath);
  console.log('Files in zip:', directory.files.map(f => f.path));

  // Ambil sharedStrings
  const sharedFile = directory.files.find(f => f.path.replace(/\\/g, '/').toLowerCase().includes('sharedstrings.xml'));
  let sharedStrings = [];
  if (sharedFile) {
    const sbuf = await sharedFile.buffer();
    sharedStrings = [...sbuf.toString('utf8').matchAll(/<t[^>]*>([\s\S]*?)<\/t>/gi)].map(m => m[1]);
    console.log(`Loaded ${sharedStrings.length} shared strings`);
  }

  // Cari sheet data
  const sheetFile = directory.files.find(f => f.path.replace(/\\/g, '/').toLowerCase().includes('sheet1.xml'));
  const buf = await sheetFile.buffer();
  const xml = buf.toString('utf8');

  const rows = [...xml.matchAll(/<row r="(\d+)">([\s\S]*?)<\/row>/g)];
  console.log(`Found ${rows.length} rows in Sheet1`);

  const students = [];
  let header = null;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const rowNum = r[1];
    const rowXml = r[2];
    const cells = [...rowXml.matchAll(/<c r="([A-Z]+)\d+"(?: t="([^"]*)")?[^>]*>(?:<v>([^<]*)<\/v>)?<\/c>/g)];
    const rowData = {};
    for (const c of cells) {
      const col = c[1];
      const type = c[2];
      let val = c[3] || '';
      if (type === 's' && sharedStrings[parseInt(val)]) {
        val = sharedStrings[parseInt(val)];
      }
      rowData[col] = val.trim();
    }

    if (i === 0) {
      header = rowData;
      console.log('Header Row:', header);
    } else {
      students.push({ row: rowNum, ...rowData });
    }
  }

  console.log(`Total data rows: ${students.length}`);
  fs.writeFileSync('tws_latest_students_raw.json', JSON.stringify({ header, students: students.slice(0, 50) }, null, 2));

  // Analisa kolom: cari kolom nama, email, rombel, tingkat, dll
  console.log('First 5 students:', students.slice(0, 5));

  // Kelompokkan siswa berdasarkan rombel di file ini
  // Cari kolom yang memuat info rombel (misal kolom C, D, E, dll)
  const rombelCounts = {};
  for (const s of students) {
    // Cari value yang mirip format rombel (misal X-1, 10-1, Kelas 10-1, dsb)
    for (const [col, val] of Object.entries(s)) {
      if (col === 'row') continue;
      if (typeof val === 'string' && (val.includes('10-') || val.includes('11-') || val.includes('12-') || val.includes('X') || val.includes('XI') || val.includes('XII') || val.toLowerCase().includes('kelas'))) {
        rombelCounts[val] = (rombelCounts[val] || 0) + 1;
      }
    }
  }

  console.log('\nRombel value distribution found in file:');
  console.table(rombelCounts);
  fs.writeFileSync('tws_latest_students_all.json', JSON.stringify(students, null, 2));
}

parseLatestSiswa().catch(console.error);

