const fs = require('fs');

const allRows = JSON.parse(fs.readFileSync('final_schedule_rows_zero_conflict.json', 'utf8'));
const liveSlots = JSON.parse(fs.readFileSync('all_live_slots.json', 'utf8'));

// Cek Kelas 10-1 Day 4
const target10_1_d4 = allRows.filter(r => r.rombel === 'Kelas 10-1' && r.dayOfWeek === 4);
const live10_1_d4 = liveSlots.filter(s => s.rombel === 'Kelas 10-1' && s.dayOfWeek === 4);

console.log('Target Kelas 10-1 Day 4:');
console.table(target10_1_d4.map(r => ({ start: r.start, end: r.end, subject: r.subject, teacher: r.teacher })));

console.log('\nLive Kelas 10-1 Day 4:');
console.table(live10_1_d4.map(s => ({ start: s.start, end: s.end, subject: s.subjectName, teacher: s.teacherName })));

