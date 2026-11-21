const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

const pos = 506331;
console.log(indexCode.slice(pos - 150, pos + 400));

