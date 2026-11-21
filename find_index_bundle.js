const fs = require('fs');

// Cari Ro di index bundle jika ada file lokal atau fetch
// Mari kita cek apakah file index-BBcvfogD.js ada di assets atau scratch
const possiblePaths = [
  'assets/index-BBcvfogD.js',
  'node_modules/index-BBcvfogD.js'
];

for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    console.log('Found:', p);
  }
}

