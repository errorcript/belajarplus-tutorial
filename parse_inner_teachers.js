const fs = require('fs');

const text = fs.readFileSync('all_teachers_serverfn_raw.json', 'utf8');

// Cari string json di dalamnya
const start = text.indexOf('"[{\\"kind\\":\\"staff\\"');
const end = text.indexOf('}]"', start);
if (start !== -1 && end !== -1) {
  const jsonStrEscaped = text.slice(start, end + 3);
  const jsonStr = JSON.parse(jsonStrEscaped);
  const teachers = JSON.parse(jsonStr);
  console.log('Total teachers parsed:', teachers.length);
  fs.writeFileSync('official_41_teachers.json', JSON.stringify(teachers, null, 2));
  teachers.forEach((t, i) => {
    console.log(`${i + 1}. ${t.full_name} (${t.email})`);
  });
} else {
  console.log('Not found by pattern');
}
