const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function fetchLiveTwsStaff() {
  const token = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const twsId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';

  console.log('Fetching live staff roster for SMAN 1 Tawangsari...');
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
                { t: 1, s: twsId },
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
      'x-school-override': twsId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json',
      'accept': 'application/x-tss-framed, application/x-ndjson, application/json'
    },
    body: JSON.stringify(payload)
  });

  const raw = await res.text();
  console.log('Response status:', res.status, 'len:', raw.length);
  fs.writeFileSync('tws_live_staff_raw.txt', raw);

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

  console.log(`Total live staff in SMAN 1 Tawangsari: ${staffList.length}`);
  fs.writeFileSync('tws_live_staff.json', JSON.stringify(staffList, null, 2));

  staffList.slice(0, 10).forEach((s, idx) => {
    console.log(`${idx + 1}. [${s.full_name}] - ${s.email} - Roles: ${s.roles.join(',')} - Status: ${s.status}`);
  });
}

fetchLiveTwsStaff().catch(console.error);
