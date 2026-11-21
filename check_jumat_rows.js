const fs = require('fs');

const allRows = JSON.parse(fs.readFileSync('final_schedule_rows_zero_conflict.json', 'utf8'));
const jumatRows = allRows.filter(r => r.dayOfWeek === 5);

console.log('Total Jumat rows in schedule:', jumatRows.length);
console.log('Sample Jumat rows:');
console.log(jumatRows.slice(0, 5));

const jumatTimes = [...new Set(jumatRows.map(r => `${r.start}-${r.end}`))];
console.log('Jumat time slots:', jumatTimes);

