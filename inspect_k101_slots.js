const fs = require('fs');

const raw = fs.readFileSync('kelas_10_1_schedule.json', 'utf8');

// Ekstrak semua slot id, start, end, dayOfWeek, subjectName, teacherName
const slots = [];
const regex = /\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":2,"s":0\}\s*,\s*\{"t":2,"s":0\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"[^"]+"\}\s*,\s*\{"t":1,"s":"[^"]+"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g;

let m;
while ((m = regex.exec(raw)) !== null) {
  slots.push({
    id: m[1],
    end: m[2],
    start: m[3],
    dayOfWeek: m[4],
    subject: m[5],
    teacher: m[6]
  });
}

console.log('Slots in Kelas 10-1 count =', slots.length);
slots.forEach(s => {
  console.log(`Hari ${s.dayOfWeek} ${s.start}-${s.end}: ${s.subject} (${s.teacher})`);
});

