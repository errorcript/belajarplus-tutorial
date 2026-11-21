const fs = require('fs');

const allRows = JSON.parse(fs.readFileSync('final_schedule_rows.json', 'utf8'));

// Cek bentrok guru di jam yang sama di dalam final_schedule_rows
const teacherTimeMap = {};
const uniqueTeacherSlots = [];
const duplicateTeacherSlots = [];

for (const r of allRows) {
  const key = `${r.teacher}_${r.dayOfWeek}_${r.start}`;
  if (!teacherTimeMap[key]) {
    teacherTimeMap[key] = [r];
    uniqueTeacherSlots.push(r);
  } else {
    teacherTimeMap[key].push(r);
    duplicateTeacherSlots.push(r);
  }
}

console.log('Total schedule rows:', allRows.length);
console.log('Unique teacher-time slots:', uniqueTeacherSlots.length);
console.log('Duplicate (joint-class) slots:', duplicateTeacherSlots.length);

console.log('\nSample duplicate slot details:');
duplicateTeacherSlots.slice(0, 10).forEach(d => {
  const original = teacherTimeMap[`${d.teacher}_${d.dayOfWeek}_${d.start}`][0];
  console.log(`- ${d.teacher} pada Hari ${d.dayOfWeek} Jam ${d.start}: Rombel ${d.rombel} vs ${original.rombel} (Mapel: ${d.subject})`);
});

