const fs = require('fs');

const teachers = JSON.parse(fs.readFileSync('all_29_teachers_purworejo11.json', 'utf8'));
const ery = teachers.filter(t => t.nama.toLowerCase().includes('ery') || t.nama.toLowerCase().includes('eka'));
console.log('Ery in 29 teachers:', ery);

