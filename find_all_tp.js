const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

const regex = /\btp\s*=\s*/g;
let m;
while ((m = regex.exec(indexCode)) !== null) {
  console.log('tp= at', m.index, ':\n', indexCode.slice(m.index, m.index + 120));
}

