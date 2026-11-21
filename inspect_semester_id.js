const fs = require('fs');
const code = fs.readFileSync('jadwal_bundle.js', 'utf8');

const idx = code.indexOf('semesterId:R');
console.log('Snippet around semesterId:R:');
console.log(code.slice(Math.max(0, idx - 1500), idx + 200));

