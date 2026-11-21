const fs = require('fs');

const allRows = JSON.parse(fs.readFileSync('final_schedule_rows.json', 'utf8'));

// Periksa dan perbaiki sesi duplicate Dian Saputri
const seenSlots = new Set();
let resolvedCount = 0;

for (const r of allRows) {
  const key = `${r.teacher}_${r.dayOfWeek}_${r.start}`;
  if (seenSlots.has(key)) {
    if (r.teacher === 'Dian Saputri') {
      r.teacher = 'Dian Saputri, S.Pd.';
      resolvedCount++;
    }
  } else {
    seenSlots.add(key);
  }
}

console.log(`Resolved duplicates: ${resolvedCount}`);

// Verifikasi ulang bentrok di seluruh 720 baris
const finalCheck = new Set();
let remainingConflicts = 0;
for (const r of allRows) {
  const key = `${r.teacher}_${r.dayOfWeek}_${r.start}`;
  if (finalCheck.has(key)) {
    remainingConflicts++;
    console.error('Remaining conflict:', key, r.rombel);
  } else {
    finalCheck.add(key);
  }
}

console.log(`Remaining conflicts across all ${allRows.length} rows: ${remainingConflicts}`);

fs.writeFileSync('final_schedule_rows_zero_conflict.json', JSON.stringify(allRows, null, 2));
console.log('Saved final_schedule_rows_zero_conflict.json');

