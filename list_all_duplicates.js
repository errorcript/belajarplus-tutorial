const fs = require('fs');

const allRows = JSON.parse(fs.readFileSync('final_schedule_rows.json', 'utf8'));

const teacherTimeMap = {};
const duplicates = [];

for (const r of allRows) {
  const key = `${r.teacher}_${r.dayOfWeek}_${r.start}`;
  if (!teacherTimeMap[key]) {
    teacherTimeMap[key] = r;
  } else {
    duplicates.push({
      first: teacherTimeMap[key],
      second: r
    });
  }
}

console.log('Total duplicates:', duplicates.length);
duplicates.forEach((d, i) => {
  console.log(`${i + 1}. Teacher: "${d.first.teacher}" | Hari: ${d.first.dayOfWeek} | Jam: ${d.first.start}-${d.first.end} | Rombel 1: ${d.first.rombel} vs Rombel 2: ${d.second.rombel} | Mapel: ${d.first.subject} vs ${d.second.subject}`);
});

