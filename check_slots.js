const fs = require('fs');

const slots = JSON.parse(fs.readFileSync('clean_schedule_slots.json', 'utf8'));
console.log('Total slots in clean_schedule_slots.json:', slots.length);
console.log('Sample slot 0:\n', slots[0]);
console.log('Sample slot 1:\n', slots[1]);

// Cek rombel apa saja yang ada di slot
const rombels = [...new Set(slots.map(s => s.rombel))];
console.log('Rombels in slots:', rombels);

// Cek mapel apa saja yang ada di slot
const mapels = [...new Set(slots.map(s => s.mapel))];
console.log('Mapels in slots:', mapels);

// Cek guru apa saja yang ada di slot
const teachers = [...new Set(slots.map(s => s.guru))];
console.log('Teachers in slots (count):', teachers.length);

