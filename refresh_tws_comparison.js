const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function refreshAudit() {
  const token = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const schoolId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';

  console.log('1. Fetching updated Students Roster from platform...');
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

  let platformStudents = [];
  try {
    const data = JSON.parse(stuText);
    let str = findJsonString(data);
    if (str) {
      if (str.startsWith('[{\\"')) {
        str = str.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      platformStudents = JSON.parse(str);
    }
  } catch (e) {
    console.error('Error parsing students:', e.message);
  }

  console.log(`Total live platform students parsed: ${platformStudents.length}`);
  fs.writeFileSync('tws_platform_students.json', JSON.stringify(platformStudents, null, 2));

  // Ambil hitungan rombel live dari file verify_rombel_live (1080 siswa)
  const rombelBody = fs.readFileSync('tws_rombel_after_import_body.txt', 'utf8');
  const lines = rombelBody.split('\n').map(l => l.trim()).filter(Boolean);
  const liveRombelCounts = {};
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('Kelas 10-') || lines[i].startsWith('Kelas 11-') || lines[i].startsWith('Kelas 12-')) {
      const name = lines[i];
      const info = lines[i+1] || '';
      const match = info.match(/(\d+)\s+siswa/);
      liveRombelCounts[name] = match ? parseInt(match[1]) : 0;
    }
  }

  // Komparasi dengan Drive
  const driveRows = JSON.parse(fs.readFileSync('tws_latest_students_parsed.json', 'utf8')).slice(1);
  const platformByEmail = new Map();
  const platformByName = new Map();
  for (const s of platformStudents) {
    if (s.email) platformByEmail.set(s.email.toLowerCase().trim(), s);
    if (s.full_name) platformByName.set(s.full_name.toLowerCase().trim(), s);
  }

  const missingInPlatform = [];
  const foundInPlatform = [];

  for (const d of driveRows) {
    const email = (d.B || '').toLowerCase().trim();
    const name = (d.A || '').toLowerCase().trim();
    let matched = platformByEmail.get(email) || platformByName.get(name);
    if (matched) {
      foundInPlatform.push({ drive: d, platform: matched });
    } else {
      missingInPlatform.push(d);
    }
  }

  console.log(`Matched now: ${foundInPlatform.length}`);
  console.log(`Missing now: ${missingInPlatform.length}`);
  console.log('Missing list:', missingInPlatform.map(m => m.A));

  // Hitung distribusi rombel di Drive
  const driveRombelCounts = {};
  for (const d of driveRows) {
    driveRombelCounts[d.D] = (driveRombelCounts[d.D] || 0) + 1;
  }

  const comparisonData = {
    totalDriveStudents: driveRows.length,
    totalPlatformStudents: platformStudents.length,
    matchedCount: foundInPlatform.length,
    missingInPlatformCount: missingInPlatform.length,
    missingInPlatformList: missingInPlatform,
    driveRombelCounts,
    liveRombelCounts
  };

  fs.writeFileSync('tws_student_rombel_comparison.json', JSON.stringify(comparisonData, null, 2));
  console.log('Updated tws_student_rombel_comparison.json successfully!');
}

refreshAudit().catch(console.error);

