const fs = require('fs');
const txt = fs.readFileSync('full_rombel_gemolong.txt', 'utf8');

console.log('--- ALL DISPLAY NAMES IN full_rombel_gemolong.txt ---');
const regex = /"displayName"[^}]+?"t":1,"s":"([^"]+)"/g;
let m;
while ((m = regex.exec(txt)) !== null) {
  console.log('DisplayName:', m[1]);
}

console.log('\n--- ALL STRING VALUES IN full_rombel_gemolong.txt ---');
const strRegex = /"s":"([^"]+)"/g;
const allStrings = new Set();
while ((m = strRegex.exec(txt)) !== null) {
  allStrings.add(m[1]);
}
for (const s of allStrings) {
  if (s.toLowerCase().includes('fa') || s.toLowerCase().includes('xi') || s.toLowerCase().includes('11') || s.toLowerCase().includes('anis') || s.toLowerCase().includes('guru') || s.toLowerCase().includes('kelas')) {
    console.log('Matched string:', s);
  }
}

