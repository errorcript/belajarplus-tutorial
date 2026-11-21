const fs = require('fs');
const content = fs.readFileSync('rombel_asset.js', 'utf8');

// Cari di mana R didefinisikan di awal file
const idx = content.indexOf('function re(');
console.log('Snippet before function re:\n', content.substring(idx - 1500, idx));

