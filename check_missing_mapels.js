const fs = require('fs');

const schoolSubjects = JSON.parse(fs.readFileSync('school_subjects_list.json', 'utf8'));
const schoolSubNames = schoolSubjects.map(s => s.name.toUpperCase().trim());

const slots = JSON.parse(fs.readFileSync('clean_schedule_slots.json', 'utf8'));
const slotMapels = [...new Set(slots.map(s => s.mapelStandar.trim()))].filter(Boolean);

console.log('School subjects in platform (count =', schoolSubNames.length, '):');
console.log(schoolSubNames);

console.log('\nMapels in schedule slots (count =', slotMapels.length, '):');
for (const sm of slotMapels) {
  const norm = sm.toUpperCase().trim();
  const found = schoolSubNames.find(sn => sn === norm || (norm.includes('PJOK') && sn.includes('PJOK')) || (norm.includes('AGAMA') && sn.includes('AGAMA')));
  console.log(`- "${sm}" -> matched: ${found ? found : 'MISSING!'}`);
}

