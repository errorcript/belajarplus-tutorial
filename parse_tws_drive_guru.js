const unzipper = require('unzipper');
const fs = require('fs');

async function parseDriveGuru() {
  const filePath = 'G:/My Drive/Trainer/B+/AKUN/44. SMAN 1 Tawangsari/BERKAS_AKUN_RESMI_SMAN_1_TAWANGSARI/Master_Data_Guru_SMAN_1_Tawangsari.xlsx';
  console.log('Reading:', filePath);
  const directory = await unzipper.Open.file(filePath);
  
  // Cari worksheet
  const sheetFile = directory.files.find(f => f.path.replace(/\\/g, '/').toLowerCase().includes('sheet1.xml'));
  const buf = await sheetFile.buffer();
  const xml = buf.toString('utf8');

  // Cek apakah ada sharedStrings
  const sharedFile = directory.files.find(f => f.path.replace(/\\/g, '/').toLowerCase().includes('sharedstrings.xml'));
  let sharedStrings = [];
  if (sharedFile) {
    const sbuf = await sharedFile.buffer();
    const sxml = sbuf.toString('utf8');
    sharedStrings = [...sxml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/gi)].map(m => m[1]);
  }

  // Parse rows
  const rows = [...xml.matchAll(/<row r="(\d+)">([\s\S]*?)<\/row>/g)];
  console.log(`Found ${rows.length} rows`);

  const teachers = [];
  for (const r of rows) {
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
      rowData[col] = val;
    }
    teachers.push({ row: rowNum, ...rowData });
  }

  fs.writeFileSync('tws_drive_raw_guru.json', JSON.stringify(teachers, null, 2));
  console.log('Sample rows:');
  teachers.slice(0, 10).forEach(t => console.log(t));
}

parseDriveGuru().catch(console.error);
