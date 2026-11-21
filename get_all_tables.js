const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function getOpenApiSpec() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();

  const res = await fetch('https://rwmcfzsnkjkklytthmow.supabase.co/rest/v1/', {
    headers: {
      'apikey': 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U',
      'Authorization': `Bearer ${token}`
    }
  });

  const spec = await res.json();
  const paths = Object.keys(spec.paths || {});
  console.log('Total Tables/Paths found:', paths.length);
  console.log('List of Paths:');
  console.log(paths.join('\n'));

  fs.writeFileSync('all_supabase_tables.json', JSON.stringify(paths, null, 2));
}

getOpenApiSpec().catch(console.error);

