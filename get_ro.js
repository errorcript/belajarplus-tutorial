const https = require('https');
const fs = require('fs');

console.log('Downloading index-BBcvfogD.js...');
https.get('https://belajarplus.com/assets/index-BBcvfogD.js', (res) => {
  let chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    console.log('Downloaded size:', buf.length);
    const code = buf.toString('utf8');
    // Cari Ro export
    const roMatches = code.match(/Ro\s*=\s*[^,;]+|export\s*\{[^}]*Ro[^}]*\}/g);
    console.log('Ro matches:', roMatches);
    // Cari string di sekitar Ro
    const idx = code.indexOf('Ro=');
    if (idx !== -1) {
      console.log('Snippet around Ro=:\n', code.slice(idx - 100, idx + 300));
    }
  });
}).on('error', console.error);

