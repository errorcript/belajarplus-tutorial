const unzipper = require('unzipper');
const fs = require('fs');

async function searchInZip(filePath) {
  const directory = await unzipper.Open.file(filePath);
  console.log(`Files in ${filePath}:`, directory.files.map(f => f.path));

  for (const file of directory.files) {
    if (file.path.endsWith('.xml')) {
      const buf = await file.buffer();
      const txt = buf.toString('utf8');
      if (txt.toLowerCase().includes('fitri')) {
        console.log(`FOUND in ${file.path}!`);
        const matches = [...txt.matchAll(/<t[^>]*>([^<]*fitri[^<]*)<\/t>/gi)].map(m => m[1]);
        if (matches.length > 0) {
          console.log('Matches:', matches);
        } else {
          // print snippet
          const idx = txt.toLowerCase().indexOf('fitri');
          console.log('Snippet:', txt.slice(Math.max(0, idx - 100), idx + 200));
        }
      }
    }
  }
}

async function main() {
  const files = [
    'G:/My Drive/Trainer/B+/AKUN/58. SMAN 1 Rawalo/SMA Negeri 1 RAWALO.xlsx',
    'G:/My Drive/Trainer/B+/AKUN/58. SMAN 1 Rawalo/SMA Negeri 1 RAWALO_ORIGINAL_BACKUP.xlsx'
  ];
  for (const f of files) {
    if (fs.existsSync(f)) {
      await searchInZip(f);
    }
  }
}

main().catch(console.error);

