const fs = require('fs');

const allRows = JSON.parse(fs.readFileSync('final_schedule_rows_zero_conflict.json', 'utf8'));
const sample = allRows.filter(r => r.row >= 622 && r.row <= 626);
console.log(JSON.stringify(sample, null, 2));

