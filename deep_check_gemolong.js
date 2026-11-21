const fs = require('fs');
const token = fs.readFileSync('henri_token.txt', 'utf8').trim();

async function check() {
  // 1. Get all institutions for Henri
  const res = await fetch('https://belajarplus.com/_serverFn/05139976bbd3a0e1cb2c253b26c71be399ec6d6d4ae7d01314e3650ce85287f3', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-tsr-serverfn': 'true'
    },
    body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: [], v: [] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
  }).then(r => r.text());

  // Search for institutions
  const instMatches = [...res.matchAll(/\"id\":\"([0-9a-fA-F-]+)\"[^}]+?\"name\":\"([^\"]+)\"/g)];
  console.log(`Henri has ${instMatches.length} institutions.`);

  // Also search if any text mentions "anisca" in the whole response
  console.log('Mentions anisca in inst res?', res.toLowerCase().includes('anisca'));

  // Let's check SMAN 1 Gemolong specifically
  const gemolong = instMatches.find(m => m[2].toLowerCase().includes('gemolong'));
  if (gemolong) {
    const schoolId = gemolong[1];
    console.log(`SMAN 1 Gemolong ID: ${schoolId}`);

    // Get all academic years
    const taRes = await fetch('https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-school-override': schoolId,
        'Content-Type': 'application/json',
        'x-tsr-serverfn': 'true'
      },
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['schoolId'], v: [{ t: 1, s: schoolId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    }).then(r => r.text());

    console.log('Raw TA Response:', taRes);

    // Get ALL rombels for each year
    const taIdMatches = [...taRes.matchAll(/\"id\"[^}]+?\"([0-9a-fA-F-]+)\"/g)].map(m => m[1]);
    console.log('TA IDs found:', taIdMatches);

    for (const yearId of taIdMatches) {
      const rombelRes = await fetch('https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-school-override': schoolId,
          'Content-Type': 'application/json',
          'x-tsr-serverfn': 'true'
        },
        body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: yearId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
      }).then(r => r.text());

      console.log(`--- Rombel for Year ${yearId} (length: ${rombelRes.length}) ---`);
      if (rombelRes.toLowerCase().includes('anisca')) {
        console.log('>>> FOUND ANISCA IN ROMBEL RES!');
      }
      if (rombelRes.toLowerCase().includes('fa')) {
        console.log('>>> FOUND FA IN ROMBEL RES!');
      }
      // Print snippets
      console.log(rombelRes.slice(0, 1000));
      fs.writeFileSync(`rombel_${yearId}.txt`, rombelRes);
    }

    // Get ALL Teachers (PTK) in Gemolong to see if Anisca is there
    // serverFn for ptk / teachers
    // Let's check serverFn for teachers
  }
}

check().catch(console.error);

