const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

const matches = [...indexCode.matchAll(/\btp\s*=\s*l\(\{[^}]+handler\(s\(`([^`]+)`\)\)/g)];
console.log('tp serverFn:', matches.map(m => m[1]));
if (matches.length === 0) {
  // cari semua yang berakhir handler(s(`...`)) dekat tp
  const pos = indexCode.indexOf('tp=');
  console.log('Snippet around tp=:\n', indexCode.slice(Math.max(0, pos - 100), pos + 300));
}

