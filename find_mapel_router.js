const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

// Cari master-data/mapel dalam rute
const matches = [...indexCode.matchAll(/path:\s*['"]mapel['"]/g)];
console.log('Matches for path: mapel:', matches.length);

const idx = indexCode.indexOf('master-data/mapel');
console.log('master-data/mapel occurrences:');
let pos = 0;
while ((pos = indexCode.indexOf('master-data/mapel', pos)) !== -1) {
  console.log('Context at', pos, ':\n', indexCode.slice(Math.max(0, pos - 100), Math.min(indexCode.length, pos + 250)));
  pos += 17;
}

