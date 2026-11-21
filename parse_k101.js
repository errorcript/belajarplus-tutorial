const fs = require('fs');

const raw = fs.readFileSync('kelas_10_1_schedule.json', 'utf8');

// Ekstrak hari, waktu, mapel, guru
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
// Format seroval jadwal: dayOfWeek, startTime, endTime, subjectName, teacherName
console.log('Snippet of response:\n', raw.slice(0, 1500));

