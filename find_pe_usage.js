const fs = require('fs');
const code = fs.readFileSync('jadwal_bundle.js', 'utf8');

// Cari pemanggilan pe (komponen modal impor)
const idx = code.indexOf('pe,');
console.log('pe occurrences:');
let pos = 0;
while ((pos = code.indexOf('pe', pos)) !== -1) {
  // cek konteks
  const snippet = code.slice(Math.max(0, pos - 50), Math.min(code.length, pos + 80));
  if (snippet.includes('semesterId') || snippet.includes('jsx') || snippet.includes('open:')) {
    console.log('Snippet at', pos, ':\n', snippet);
  }
  pos += 2;
}

