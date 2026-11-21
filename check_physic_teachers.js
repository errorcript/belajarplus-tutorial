const fs = require('fs');

const teachers = JSON.parse(fs.readFileSync('official_41_teachers.json', 'utf8'));

// Cek nama guru
console.log('Official teachers list count:', teachers.length);
teachers.forEach(t => {
  if (t.full_name.toLowerCase().includes('dian') || t.full_name.toLowerCase().includes('saputri') || t.full_name.toLowerCase().includes('guru ke 18')) {
    console.log(t.full_name, t.email);
  }
});

