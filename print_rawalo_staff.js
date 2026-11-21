const fs = require('fs');
const staff = JSON.parse(fs.readFileSync('rawalo_all_staff.json', 'utf8'));
console.log('--- DAFTAR SEMUA 46 PTK SMAN 1 RAWALO ---');
staff.forEach((s, i) => {
  const num = (i + 1).toString().padStart(2);
  console.log(`${num}. [${s.full_name}] | Email: ${s.email} | Roles: ${s.roles.join(',')} | Status: ${s.status} | UserID: ${s.user_id}`);
});

