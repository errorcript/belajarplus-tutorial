const fs = require('fs');

// Ambil data guru dari unique_teachers_purworejo11.json atau parse_teachers
const teachersRaw = JSON.parse(fs.readFileSync('unique_teachers_purworejo11.json', 'utf8'));
const platformTeacherNames = teachersRaw.map(t => t.name.trim()).filter(n => 
  !n.includes('SMA NEGERI') && 
  !n.includes('Beranda') && 
  !n.includes('Guru & Tenaga') && 
  !n.includes('NAMA') && 
  !n.includes('41') &&
  n.length > 2
);
console.log('Platform Teacher Names (clean count =', platformTeacherNames.length, '):');
console.log(platformTeacherNames);

// Ambil semua guru yang ada di slots
const slots = JSON.parse(fs.readFileSync('clean_schedule_slots.json', 'utf8'));
const slotTeachers = [...new Set(slots.map(s => s.guruNamaLengkap.trim()))].filter(Boolean);
console.log('\nSlot Teachers count =', slotTeachers.length);

const teacherMap = {};
for (const st of slotTeachers) {
  // Cari di platformTeacherNames
  // Bisa exact, case-insensitive, atau match tanpa gelar
  const cleanSt = st.toLowerCase().replace(/,\s*[a-z\.\s]+$/i, '').trim();
  const matched = platformTeacherNames.find(pt => {
    const ptLow = pt.toLowerCase();
    const stLow = st.toLowerCase();
    if (ptLow === stLow) return true;
    if (ptLow === cleanSt) return true;
    const cleanPt = ptLow.replace(/,\s*[a-z\.\s]+$/i, '').trim();
    if (cleanPt === cleanSt) return true;
    if (cleanPt.includes(cleanSt) || cleanSt.includes(cleanPt)) return true;
    return false;
  });

  teacherMap[st] = matched || 'NOT_FOUND';
  console.log(`- "${st}" -> "${teacherMap[st]}"`);
}

fs.writeFileSync('teacher_matched_map.json', JSON.stringify(teacherMap, null, 2));

