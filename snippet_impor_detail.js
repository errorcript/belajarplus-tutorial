const fs = require('fs');
const code = fs.readFileSync('jadwal_bundle.js', 'utf8');

// Cari definisi 'de' dan 'R'
const idxDe = code.indexOf('contoh-impor-jadwal.xlsx');
console.log('Snippet before idxDe:');
console.log(code.slice(Math.max(0, idxDe - 2000), idxDe));

