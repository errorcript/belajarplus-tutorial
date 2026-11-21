const fs = require('fs');

const raw = fs.readFileSync('last_mapel_response.json', 'utf8');
console.log('Raw length:', raw.length);

// Ekstrak nama, id, levelCode, gradeCodes dari json
// Karena format Seroval, kita regex saja polanya
const items = [];
const regex = /"name",.*?"s":"([^"]+)".*?"levelCode",.*?"gradeCodes",.*?"a":(\[[^\]]*\])/g;
// Atau cari string name
console.log('Sample raw snippet:\n', raw.slice(0, 800));

