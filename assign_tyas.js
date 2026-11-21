const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function assignTyas() {
  const token = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const schoolId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';
  const rombels = JSON.parse(fs.readFileSync('tws_platform_rombels.json', 'utf8'));
  const r12_4 = rombels.find(r => r.displayName.includes('12-4'));

  // 1. Cari studentId Tyas via cand serverFn
  const candPayload = {
    t: {
      t: 10, i: 0,
      p: {
        k: ['data'],
        v: [{
          t: 10, i: 1,
          p: { k: ['rombelId', 'q'], v: [{ t: 1, s: r12_4.id }, { t: 1, s: 'Tyas' }] },
          o: 0
        }]
      },
      o: 0
    },
    f: 127, m: []
  };

  const candRes = await fetch('https://belajarplus.com/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': schoolId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(candPayload)
  });

  const candText = await candRes.text();
  console.log('Cand text snippet:', candText.slice(0, 500));

  // Extract studentId dari JSON seroval
  const obj = JSON.parse(candText);
  const candList = obj.p?.v?.[0]?.a || [];
  console.log('Candidates count:', candList.length);
  let studentId = null;
  for (const item of candList) {
    const k = item.p?.k || [];
    const v = item.p?.v || [];
    const nameIdx = k.indexOf('name');
    const idIdx = k.indexOf('id');
    const name = v[nameIdx]?.s;
    const id = v[idIdx]?.s;
    console.log('Candidate item:', name, id);
    if (name?.toLowerCase().includes('tyas')) {
      studentId = id;
      break;
    }
  }

  if (!studentId) {
    console.error('Candidate Tyas not found!');
    return;
  }
  console.log('Found Tyas studentId:', studentId);

  // 2. Add to rombel 12-4
  const addPayload = {
    t: {
      t: 10, i: 0,
      p: {
        k: ['data'],
        v: [{
          t: 10, i: 1,
          p: {
            k: ['rombelId', 'studentIds'],
            v: [
              { t: 1, s: r12_4.id },
              { t: 9, i: 2, a: [{ t: 1, s: studentId }] }
            ]
          },
          o: 0
        }]
      },
      o: 0
    },
    f: 127, m: []
  };

  const addRes = await fetch('https://belajarplus.com/_serverFn/337a3c1afccf4d21720d2417c45550a065b920ed76dc347564097da6421cecdd', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': schoolId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(addPayload)
  });

  const addText = await addRes.text();
  console.log('Add response:', addText);
}

assignTyas().catch(console.error);

