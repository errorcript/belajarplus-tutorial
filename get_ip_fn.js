const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

const match = indexCode.match(/\bip\s*=\s*l\(\{[^}]+handler\(s\(`([^`]+)`\)\)/);
console.log('ip serverFn:', match ? match[1] : 'none');
if (!match) {
  const pos = indexCode.indexOf('ip=');
  console.log('Snippet around ip=:\n', indexCode.slice(pos, pos + 150));
}

