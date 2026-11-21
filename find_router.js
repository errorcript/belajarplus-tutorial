const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function findMainRoutes() {
  const res = await fetch('https://belajarplus.com');
  const html = await res.text();
  const scriptMatches = html.match(/\/assets\/[a-zA-Z0-9_\-\.]+\.js/g) || [];

  for (const s of scriptMatches) {
    try {
      const sRes = await fetch('https://belajarplus.com' + s);
      const js = await sRes.text();
      const paths = js.match(/path:\s*['"][^'"]+['"]/g) || [];
      if (paths.length > 5) {
        console.log('Router found in', s, 'total paths:', paths.length);
        const unique = [...new Set(paths.map(p => p.replace(/path:\s*['"]/, '').replace(/['"]$/, '')))].sort();
        console.log(unique);
        fs.writeFileSync('client_routes.json', JSON.stringify(unique, null, 2));
      }
    } catch (e) {
      console.log('Err:', e.message);
    }
  }
}

findMainRoutes().catch(console.error);

