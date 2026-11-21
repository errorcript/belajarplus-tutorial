const fs = require('fs');

const allRows = JSON.parse(fs.readFileSync('final_schedule_rows.json', 'utf8'));

const riyantoSlots = allRows.filter(r => r.teacher === 'RIYANTO');
console.log('Riyanto slots count:', riyantoSlots.length);
if (riyantoSlots.length > 0) {
  console.log('Sample Riyanto slot:', riyantoSlots[0]);
}

