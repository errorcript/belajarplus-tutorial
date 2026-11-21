const fs = require('fs');

const code = fs.readFileSync('mapel_bundle.js', 'utf8');

const idx = code.indexOf('await l({data:{id:e.id??null');
console.log('Snippet around mutation:\n', code.slice(Math.max(0, idx - 100), Math.min(code.length, idx + 500)));

