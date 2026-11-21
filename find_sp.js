const fs = require('fs');

async function findSp() {
  const code = fs.readFileSync('index-BBcvfogD.js', 'utf8');
  // Cari definisi sp =
  const regex = /\bsp\s*=\s*([^,;]+)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    console.log('Match:', match[0].slice(0, 80));
    console.log('Context:\n', code.slice(Math.max(0, match.index - 50), Math.min(code.length, match.index + 200)));
  }
}

findSp().catch(console.error);

