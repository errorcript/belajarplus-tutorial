const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

async function findClientRoutes() {
  // Ambil halaman utama belajarplus
  const res = await fetch('https://belajarplus.com');
  const html = await res.text();

  // Cari semua script .js
  const scriptMatches = html.match(/\/assets\/[a-zA-Z0-9_\-\.]+\.js/g) || [];
  console.log('Script bundles found:', scriptMatches);

  for (const s of scriptMatches) {
    try {
      const sRes = await fetch('https://belajarplus.com' + s);
      const js = await sRes.text();
      // Cari rute yang mengandung master-data atau jadwal atau schedule
      const routes = js.match(/\/master-data\/[a-zA-Z0-9_\-]+|\/admin\/[a-zA-Z0-9_\-]+/g) || [];
      const jadwalHits = js.match(/.{0,50}(?:jadwal|schedule).{0,50}/gi) || [];
      if (routes.length > 0 || jadwalHits.length > 0) {
        console.log(`\nIn bundle ${s}:`);
        console.log('Unique routes:', [...new Set(routes)].slice(0, 20));
        if (jadwalHits.length > 0) {
          console.log('Jadwal hits sample:', jadwalHits.slice(0, 10));
        }
      }
    } catch (e) {
      console.log('Error fetching script', s, e.message);
    }
  }
}

findClientRoutes().catch(console.error);

