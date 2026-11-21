const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

const idx = indexCode.indexOf('np=l({method:`POST`}');
console.log('Snippet around np:\n', indexCode.slice(idx, idx + 200));

