const fs = require('fs');

const obj = JSON.parse(fs.readFileSync('all_teachers_serverfn_raw.json', 'utf8'));

function findStaffString(val) {
  if (typeof val === 'string' && val.includes('kind') && val.includes('teacher')) {
    return val;
  }
  if (typeof val === 'object' && val !== null) {
    for (const k of Object.keys(val)) {
      const res = findStaffString(val[k]);
      if (res) return res;
    }
  }
  return null;
}

let staffStr = findStaffString(obj);
// Unescape jika diperlukan
if (staffStr.startsWith('[{\\"')) {
  staffStr = staffStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

const teachers = JSON.parse(staffStr);
console.log('Successfully found teachers! Count:', teachers.length);
fs.writeFileSync('official_41_teachers.json', JSON.stringify(teachers, null, 2));

console.log('--- ALL OFFICIAL TEACHERS ---');
teachers.forEach((t, i) => {
  console.log(`${i + 1}. "${t.full_name}" (${t.email})`);
});
