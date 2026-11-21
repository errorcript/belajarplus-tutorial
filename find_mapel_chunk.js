const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

// Cari import dynamic untuk mapel chunk
const matches = [...indexCode.matchAll(/"\/assets\/mapel-[^"]+\.js"|"\.\/mapel-[^"]+\.js"/g)];
console.log('Mapel chunk matches:', matches.map(m => m[0]));
if (matches.length === 0) {
  // cari semua chunk yang ada di indexCode
  const allChunks = [...indexCode.matchAll(/"(?:\/assets\/|\.\/)([a-zA-Z0-9_\-\.]+?\.js)"/g)].map(m => m[1]);
  const mapelChunks = allChunks.filter(c => c.toLowerCase().includes('mapel') || c.toLowerCase().includes('kurikulum') || c.toLowerCase().includes('academic'));
  console.log('Related chunks:', [...new Set(mapelChunks)]);
}

