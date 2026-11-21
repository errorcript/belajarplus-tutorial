const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function fetchAllRombelMembers() {
  const token = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const schoolId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';
  const rombels = JSON.parse(fs.readFileSync('tws_platform_rombels.json', 'utf8'));

  const allMembers = {};

  for (const r of rombels) {
    const payload = {
      t: {
        t: 10, i: 0,
        p: {
          k: ['data'],
          v: [{
            t: 10, i: 1,
            p: { k: ['rombelId'], v: [{ t: 1, s: r.id }] },
            o: 0
          }]
        },
        o: 0
      },
      f: 127, m: []
    };

    const res = await fetch('https://belajarplus.com/_serverFn/ddb25d03d56501b10734f908f4b7c19e66fc5c223c6627114c020066492cc67d', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'x-school-override': schoolId,
        'x-tsr-serverfn': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    let members = [];
    try {
      const obj = JSON.parse(text);
      const rawList = obj.p?.v?.[0]?.a || [];
      const parsed = rawList.map(item => {
        const k = item.p?.k || [];
        const v = item.p?.v || [];
        const resObj = {};
        k.forEach((key, idx) => {
          resObj[key] = v[idx]?.s;
        });
        return resObj;
      });
      members = parsed.filter(m => m.status === 'active');
    } catch (e) {
      console.error(`Error parsing ${r.displayName}:`, e.message);
    }

    allMembers[r.displayName] = {
      rombelId: r.id,
      count: members.length,
      members
    };
    console.log(r.displayName.padEnd(15) + ': ' + members.length + ' active members');
  }

  fs.writeFileSync('tws_all_rombel_active_members.json', JSON.stringify(allMembers, null, 2));
  console.log('Saved all active members to tws_all_rombel_active_members.json');
}

fetchAllRombelMembers().catch(console.error);
