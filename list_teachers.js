const fs = require('fs');
const raw = fs.readFileSync('all_teachers_serverfn_raw.json', 'utf8');
const data = JSON.parse(raw);
const teachers = JSON.parse(data.p.v[0].p.v[0].s);
console.log('Total teachers in file:', teachers.length);
teachers.forEach((t, i) => {
  console.log(`${i+1}. [${t.full_name}] - ${t.email} - roles: ${(t.roles||[]).join(',')} - user_id: ${t.user_id} - member_id: ${t.membership_id}`);
});

