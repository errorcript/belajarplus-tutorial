const fs = require('fs');
const txt = fs.readFileSync('bandongan_students_full_query.txt', 'utf8');

function parseTanStack(jsonStr) {
  try {
    const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
    const v0 = data.p?.v?.[0];
    if (v0 && Array.isArray(v0.a)) {
      return v0.a.map(item => {
        if (!item.p?.k || !item.p?.v) return null;
        const obj = {};
        item.p.k.forEach((key, idx) => {
          const valObj = item.p.v[idx];
          if (!valObj) return;
          obj[key] = valObj.s !== undefined ? valObj.s : (valObj.v !== undefined ? valObj.v : valObj);
        });
        return obj;
      }).filter(Boolean);
    }
  } catch (e) {}
  return [];
}

const list = parseTanStack(txt);
const manual43 = list.filter(s => s.joined_at && s.joined_at.startsWith('2026-10-21'));

// Standard password format
const defaultPassword = 'Bandongan2026!';

const enriched = manual43.map((s, idx) => {
  return {
    no: idx + 1,
    student_id: s.student_id,
    full_name: s.full_name,
    email: s.email,
    rombel: s.class_name, // PSAS_XI FA 2 / PSAS_XI FA 1 / PSAS_XI FE
    new_password: defaultPassword,
    joined_at: s.joined_at,
    status: 'Aktif (Terverifikasi)'
  };
});

// Sort by rombel then name
enriched.sort((a, b) => a.rombel.localeCompare(b.rombel) || a.full_name.localeCompare(b.full_name));

fs.writeFileSync('manual_43_students_enriched.json', JSON.stringify(enriched, null, 2));
console.log(`Saved ${enriched.length} manual students with new password ${defaultPassword}`);

// Group by rombel
const byRombel = {};
enriched.forEach(s => {
  if (!byRombel[s.rombel]) byRombel[s.rombel] = [];
  byRombel[s.rombel].push(s);
});

for (const [r, students] of Object.entries(byRombel)) {
  console.log(`\n=== ROMBEL: ${r} (${students.length} Siswa) ===`);
  students.forEach((s, i) => {
    console.log(`  ${i+1}. ${s.full_name} | ${s.email} | Pass: ${s.new_password}`);
  });
}

