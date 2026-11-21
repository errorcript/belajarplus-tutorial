const fs = require('fs');

const raw = fs.readFileSync('all_teachers_serverfn_raw.json', 'utf8');

// Ekstrak nama dan email dari seroval raw
// Cari pattern nama dan email
const teachers = [];
// Dalam seroval: {"t":1,"s":"...fullName..."} ... {"t":1,"s":"...email..."}
const emailRegex = /"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})"/g;
const emails = [...new Set([...raw.matchAll(emailRegex)].map(m => m[1]))];

console.log('Total emails found:', emails.length);
console.log('Sample emails:', emails.slice(0, 10));

// Cari nama lengkap di sekitar email
const pairs = [];
for (const em of emails) {
  const idx = raw.indexOf(em);
  const snippet = raw.slice(Math.max(0, idx - 400), idx + 200);
  // Cari string nama sebelum email
  const strMatches = [...snippet.matchAll(/"s":"([^"]+)"/g)].map(m => m[1]);
  // Guru nama biasanya string sebelum email atau di sekitarnya
  pairs.push({
    email: em,
    contextStrings: strMatches
  });
}

fs.writeFileSync('all_41_teachers_context.json', JSON.stringify(pairs, null, 2));

