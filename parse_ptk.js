const fs = require('fs');
const txt = fs.readFileSync('full_ptk_gemolong.txt', 'utf8');

const strMatches = [...txt.matchAll(/"s":"([^"]+)"/g)].map(m => m[1]);
console.log('Total strings in PTK response:', strMatches.length);

// Look for names
const possibleNames = strMatches.filter(s => s.length > 3 && !s.includes('-') && !s.includes('@') && !s.includes('/') && !s.includes('T') && !s.includes('{'));
console.log('Possible PTK names in Gemolong:', possibleNames);

