const fs = require('fs');

async function searchServerFn() {
  const code = fs.readFileSync('jadwal_bundle.js', 'utf8');
  // Cari di mana te didefinisikan atau dipanggil
  // Di jadwal_bundle.js: import { ..., Ro as te, ... } from "./index-BBcvfogD.js";
  // mutationFn: e => i({ data: { semesterId: n, rows: e } })
  // di mana i = T(te)
  console.log('Searching for T(te) or te in jadwal_bundle.js...');
  const idx = code.indexOf('(te)');
  console.log('Snippet around (te):', code.slice(Math.max(0, idx - 100), Math.min(code.length, idx + 100)));
}

searchServerFn().catch(console.error);

