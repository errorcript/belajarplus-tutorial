const fs = require('fs');

const allRows = JSON.parse(fs.readFileSync('final_schedule_rows_zero_conflict.json', 'utf8'));
const h5 = allRows.filter(r => r.dayOfWeek === 5 && r.start === '14:10');

console.log('Rows on Hari 5 14:10 (count =', h5.length, '):');
h5.forEach(r => {
  console.log(`Row ${r.row}: ${r.rombel} | ${r.subject} | Teacher: "${r.teacher}"`);
});

