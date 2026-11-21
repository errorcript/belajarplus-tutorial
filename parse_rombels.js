const fs = require('fs');

const raw = fs.readFileSync('rombels_raw.json', 'utf8');

// Ekstrak objek rombel dari seroval
// Cari pattern displayName, id, gradeCode, levelCode
console.log('--- Inspecting rombel objects ---');
const regex = /"displayName"\s*,\s*"homeroomName"\s*,\s*"studentCount"[\s\S]*?\{"t":1,"s":"([^"]+)"\}/g;

// Cara lain: regex semua string field
const rombelEntries = [];
const idMatches = [...raw.matchAll(/\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

console.log('Matches count:', idMatches.length);
if (idMatches.length === 0) {
  // Let's print snippets containing Kelas
  const kelasMatches = [...raw.matchAll(/"Kelas [^"]+"/g)];
  console.log('Kelas names found:', kelasMatches.map(m => m[0]));
} else {
  for (const m of idMatches) {
    console.log({
      id: m[1],
      suffix: m[2],
      yearId: m[3],
      gradeCode: m[4],
      gradeSort: m[5],
      levelCode: m[6],
      levelSort: m[7],
      gradeLabel: m[8]
    });
  }
}

