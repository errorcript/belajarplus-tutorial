const fs = require('fs');
const code = fs.readFileSync('jadwal_bundle.js', 'utf8');

const idx = code.indexOf('contoh-impor-jadwal.xlsx');
console.log('Index:', idx);
if (idx !== -1) {
  console.log('Snippet around contoh-impor-jadwal.xlsx:');
  console.log(code.slice(Math.max(0, idx - 1000), Math.min(code.length, idx + 1500)));
}

