const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

// Cari " as Bo," atau " as Bo}"
const match = indexCode.match(/,\s*([a-zA-Z0-9_$]+)\s+as\s+Bo\s*[,}]/);
console.log('Exact match for Bo:', match ? match[1] : 'not found');
if (match) {
  const localName = match[1];
  const idx = indexCode.indexOf(`${localName}=`);
  console.log('Def at', idx, ':\n', indexCode.slice(idx, idx + 150));
}

