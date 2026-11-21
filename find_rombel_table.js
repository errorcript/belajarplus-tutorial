const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function findRombelTable() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const candidateTables = [
    'classes',
    'class_rooms',
    'classrooms',
    'school_classes',
    'school_rombels',
    'study_groups',
    'learning_groups',
    'student_groups',
    'groups',
    'academic_classes',
    'institution_classes',
    'courses'
  ];

  for (const t of candidateTables) {
    const res = await fetch(`https://rwmcfzsnkjkklytthmow.supabase.co/rest/v1/${t}?select=*&limit=1`, {
      headers: {
        'apikey': 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U',
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      console.log(`✅ TABEL DITEMUKAN: [${t}]`);
      const data = await res.json();
      console.log('Sample:', data);
    }
  }
}

findRombelTable().catch(console.error);

