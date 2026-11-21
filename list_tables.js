const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function listSupabaseTables() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();

  // Test beberapa tabel yang mungkin ada:
  const candidateTables = [
    'schedules',
    'schedule_items',
    'jadwal',
    'jadwal_pelajaran',
    'classes',
    'rombels',
    'study_groups',
    'academic_years',
    'subjects',
    'courses',
    'lessons',
    'agenda',
    'agendas'
  ];

  for (const table of candidateTables) {
    try {
      const res = await fetch(`https://rwmcfzsnkjkklytthmow.supabase.co/rest/v1/${table}?select=*&limit=1`, {
        headers: {
          'apikey': 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✅ TABEL DITEMUKAN: [${table}] - Status: ${res.status}, Sample:`, Array.isArray(data) ? `Array (${data.length})` : typeof data);
      } else {
        console.log(`❌ Tabel [${table}] - ${res.status}: ${data.message || data.code}`);
      }
    } catch (e) {
      console.log(`⚠️ Err checking [${table}]:`, e.message);
    }
  }
}

listSupabaseTables().catch(console.error);

