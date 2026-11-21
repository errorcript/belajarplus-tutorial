const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function auditTwsRombelSiswa() {
  const token = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const schoolId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';

  console.log('1. Fetching Academic Years for SMAN 1 Tawangsari...');
  const taPayload = {
    t: {
      t: 10, i: 0,
      p: {
        k: ['data'],
        v: [{
          t: 10, i: 1,
          p: { k: ['schoolId'], v: [{ t: 1, s: schoolId }] },
          o: 0
        }]
      },
      o: 0
    },
    f: 127, m: []
  };

  const taRes = await fetch('https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': schoolId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taPayload)
  });

  const taText = await taRes.text();
  console.log('TA Response Status:', taRes.status, 'len:', taText.length);
  fs.writeFileSync('tws_ta_raw.txt', taText);

  // Parse Academic Years
  // Format seroval: id, name, is_active
  const taMatches = [...taText.matchAll(/\{"t":1,"s":"([0-9a-fA-F-]{36})"\},[^{]*?\{"t":1,"s":"(202[0-9]\/202[0-9])"\}/g)];
  console.log('Matched Academic Years:', taMatches.map(m => ({ id: m[1], name: m[2] })));

  // Ambil TA aktif (atau pertama)
  const activeYear = taMatches[0];
  if (!activeYear) {
    console.error('No academic year found!');
    return;
  }
  const yearId = activeYear[1];
  const yearName = activeYear[2];
  console.log(`Active Year: ${yearName} (${yearId})`);

  console.log('\n2. Fetching Rombels for Year:', yearName);
  const rPayload = {
    t: {
      t: 10, i: 0,
      p: {
        k: ['data'],
        v: [{
          t: 10, i: 1,
          p: { k: ['yearId'], v: [{ t: 1, s: yearId }] },
          o: 0
        }]
      },
      o: 0
    },
    f: 127, m: []
  };

  const rRes = await fetch('https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': schoolId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rPayload)
  });

  const rText = await rRes.text();
  console.log('Rombel Response Status:', rRes.status, 'len:', rText.length);
  fs.writeFileSync('tws_rombels_raw.txt', rText);

  // Parse Rombels
  // Cari id, displayName / name, gradeCode
  const rombelItems = [...rText.matchAll(/\{"t":1,"s":"([0-9a-fA-F-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-fA-F-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

  const liveRombels = rombelItems.map(m => ({
    id: m[1],
    suffix: m[2],
    name: m[4],
    gradeCode: m[6],
    levelCode: m[7],
    displayName: `${m[8]}-${m[2]}`
  }));

  console.log(`Total live rombels found via regex: ${liveRombels.length}`);
  if (liveRombels.length === 0) {
    // Regex alternatif
    const simpleMatches = [...rText.matchAll(/"id":"([0-9a-fA-F-]{36})"[^}]*?"displayName":"([^"]+)"/g)];
    console.log('Simple regex matches:', simpleMatches.length);
  }

  console.log('\n3. Fetching Students Roster...');
  const stuPayload = {
    t: {
      t: 10, i: 0,
      p: {
        k: ['data'],
        v: [{
          t: 10, i: 1,
          p: {
            k: ['op', 'institutionId', 'kind'],
            v: [
              { t: 1, s: 'roster' },
              { t: 1, s: schoolId },
              { t: 1, s: 'student' }
            ]
          },
          o: 0
        }]
      },
      o: 0
    },
    f: 127, m: []
  };

  const stuRes = await fetch('https://belajarplus.com/_serverFn/338cb13c9aa10d5bf9bbbac6a7408ce8a833f425d9483d9693ddebf46a8c1efb', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': schoolId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(stuPayload)
  });

  const stuText = await stuRes.text();
  console.log('Students Roster len:', stuText.length);
  fs.writeFileSync('tws_students_raw.txt', stuText);

  function findJsonString(val) {
    if (typeof val === 'string' && val.includes('student') && val.includes('user_id')) return val;
    if (typeof val === 'object' && val !== null) {
      for (const k of Object.keys(val)) {
        const r = findJsonString(val[k]);
        if (r) return r;
      }
    }
    return null;
  }

  let students = [];
  try {
    const data = JSON.parse(stuText);
    let str = findJsonString(data);
    if (str) {
      if (str.startsWith('[{\\"')) {
        str = str.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      students = JSON.parse(str);
    }
  } catch (e) {
    console.error('Error parsing students:', e.message);
  }

  console.log(`Total students parsed from platform roster: ${students.length}`);
  fs.writeFileSync('tws_platform_students.json', JSON.stringify(students, null, 2));

  // Hitung berapa siswa yang sudah punya rombel vs belum
  const placed = students.filter(s => s.has_rombel);
  const unplaced = students.filter(s => !s.has_rombel);
  console.log(`- Sudah ditempatkan di Rombel: ${placed.length}`);
  console.log(`- Belum ditempatkan (Unplaced): ${unplaced.length}`);
}

auditTwsRombelSiswa().catch(console.error);

