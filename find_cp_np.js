const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

const regex = /\b(cp|np)\s*=\s*/g;
let m;
while ((m = regex.exec(indexCode)) !== null) {
  if (m.index > 300000) {
    console.log(m[1], 'at', m.index, ':\n', indexCode.slice(m.index, m.index + 120));
  }
}

