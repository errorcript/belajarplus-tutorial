const fs = require('fs');

const teachers = JSON.parse(fs.readFileSync('all_school_teachers_live.json', 'utf8'));
console.log('Sample teachers:');
const uniqueTeachers = [];
const seen = new Set();
for (const t of teachers) {
  if (t.name && !seen.has(t.name)) {
    seen.add(t.name);
    uniqueTeachers.push(t);
  }
}
console.log('Total unique teachers:', uniqueTeachers.length);
console.log('First 10:', uniqueTeachers.slice(0, 10));
fs.writeFileSync('unique_teachers_purworejo11.json', JSON.stringify(uniqueTeachers, null, 2));

