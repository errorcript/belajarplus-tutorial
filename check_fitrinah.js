const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function checkFitrinah() {
  const token = fs.readFileSync('rawalo_trainer_token.txt', 'utf8').trim();
  const rawaloId = 'cd1a621e-b3b2-4e06-a53d-4fc7690b5d89';

  console.log('Fetching staff roster for SMA NEGERI 1 RAWALO...');
  const payload = {
    t: {
      t: 10,
      i: 0,
      p: {
        k: ['data'],
        v: [
          {
            t: 10,
            i: 1,
            p: {
              k: ['op', 'institutionId', 'kind'],
              v: [
                { t: 1, s: 'roster' },
                { t: 1, s: rawaloId },
                { t: 1, s: 'staff' }
              ]
            },
            o: 0
          }
        ]
      },
      o: 0
    },
    f: 127,
    m: []
  };

  const res = await fetch('https://belajarplus.com/_serverFn/338cb13c9aa10d5bf9bbbac6a7408ce8a833f425d9483d9693ddebf46a8c1efb', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': rawaloId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json',
      'accept': 'application/x-tss-framed, application/x-ndjson, application/json'
    },
    body: JSON.stringify(payload)
  });

  const raw = await res.text();
  console.log('Response status:', res.status, 'len:', raw.length);
  fs.writeFileSync('rawalo_staff_response.txt', raw);

  // Parse Seroval / JSON
  function findStaffString(val) {
    if (typeof val === 'string' && val.includes('kind') && val.includes('staff')) {
      return val;
    }
    if (typeof val === 'object' && val !== null) {
      for (const k of Object.keys(val)) {
        const r = findStaffString(val[k]);
        if (r) return r;
      }
    }
    return null;
  }

  let staffList = [];
  try {
    const data = JSON.parse(raw);
    let staffStr = findStaffString(data);
    if (staffStr) {
      if (staffStr.startsWith('[{\\"')) {
        staffStr = staffStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      staffList = JSON.parse(staffStr);
    }
  } catch (e) {
    console.error('Parse error:', e.message);
  }

  console.log(`Total staff in SMAN 1 Rawalo: ${staffList.length}`);
  fs.writeFileSync('rawalo_all_staff.json', JSON.stringify(staffList, null, 2));

  // Cari "fitrinah"
  const matches = staffList.filter(s => {
    const fn = (s.full_name || '').toLowerCase();
    const em = (s.email || '').toLowerCase();
    return fn.includes('fitrinah') || em.includes('fitrinah') || fn.includes('fitri') || em.includes('fitri');
  });

  console.log('\n=== HASIL PENCARIAN PTK FITRINAH DI SMAN 1 RAWALO ===');
  console.log(JSON.stringify(matches, null, 2));

  // Jika tidak ditemukan dengan fitri, coba cari semua staff
  if (matches.length === 0) {
    console.log('\nTidak ada yang mengandung fitrinah / fitri. Berikut sample 10 staff pertama:');
    staffList.slice(0, 10).forEach((s, idx) => console.log(`${idx + 1}. ${s.full_name} (${s.email})`));
  }
}

checkFitrinah().catch(console.error);

