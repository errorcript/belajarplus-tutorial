const fs = require('fs');

const allRows = JSON.parse(fs.readFileSync('final_schedule_rows.json', 'utf8'));
const sample = allRows.slice(30, 40);
console.log(JSON.stringify(sample, null, 2));

