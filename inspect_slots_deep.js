const fs = require('fs');

const slots = JSON.parse(fs.readFileSync('clean_schedule_slots.json', 'utf8'));

const rombels = [...new Set(slots.map(s => s.rombelPlatform))];
console.log('Rombel Platform count:', rombels.length, rombels);

const mapels = [...new Set(slots.map(s => s.mapelStandar))];
console.log('Mapel Standar count:', mapels.length, mapels);

const teachers = [...new Set(slots.map(s => s.guruNamaLengkap))];
console.log('Guru Nama Lengkap count:', teachers.length);

const waktuSlots = [...new Set(slots.map(s => `${s.hari} Jam ${s.jamKe}: ${s.waktu}`))];
console.log('Sample waktu slots:', waktuSlots.slice(0, 10));

