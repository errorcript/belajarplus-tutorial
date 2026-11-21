const fs = require('fs');
const token = fs.readFileSync('henri_token.txt', 'utf8').trim();

// SchoolId Bandongan
const schoolId = 'f28b2496-92f6-474f-9d1d-71c087de37a0';

async function check() {
  // Let's call the server function for students or rombels
  // In check_xi_fa2.js we saw the rombels query:
  // _serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87
  // Let's fetch all rombels in Bandongan
  // TA Bandongan:
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

  const taMatches = [...taRes.matchAll(/"id"[^}]+?"([0-9a-fA-F-]+)"/g)].map(m => m[1]);
  const activeYearId = taMatches[0];
  console.log('Bandongan YearId:', activeYearId);

  const rombelRes = await fetch('https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-school-override': schoolId,
      'Content-Type': 'application/json',
      'x-tsr-serverfn': 'true'
    },
    body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: activeYearId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
  }).then(r => r.text());

  fs.writeFileSync('bandongan_rombels_raw.txt', rombelRes);
  console.log('Saved bandongan_rombels_raw.txt, length:', rombelRes.length);

  // Extract rombels with their ID and displayName
  // Rombels format: "displayName"..."id"
  const regex = /"displayName"[^}]+?"t":1,"s":"([^"]+)".*?"id"[^}]+?"t":1,"s":"([0-9a-fA-F-]+)"/g;
  // Let's parse all rombels
}

check().catch(console.error);

