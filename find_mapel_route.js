const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

const idx = indexCode.indexOf('/master-data/mapel');
console.log('Index of /master-data/mapel:', idx);
if (idx !== -1) {
  console.log('Snippet around route:\n', indexCode.slice(Math.max(0, idx - 150), idx + 250));
}
