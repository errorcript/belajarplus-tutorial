const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function testInstitutions() {
  const apikey = 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U';
  const accounts = [
    { email: 'Fitrinoveiraa@gmail.com', password: 'Mevi2026^', name: 'Mevi' },
    { email: 'And.aliffiansyah@gmail.com', password: 'kerja98', name: 'Andrew' },
    { email: 'khansania.medtra@gmail.com', password: 'Khansa04', name: 'Khansania' }
  ];

  for (const acc of accounts) {
    const res = await fetch('https://rwmcfzsnkjkklytthmow.supabase.co/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'apikey': apikey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: acc.email, password: acc.password })
    });
    const data = await res.json();
    const token = data.access_token;

    // Panggil serverFn e35542c971d68586633ce35db94ff40095d3062c0d6693763dae07ac400ba23d
    const url = 'https://belajarplus.com/_serverFn/e35542c971d68586633ce35db94ff40095d3062c0d6693763dae07ac400ba23d?payload=%7B%22t%22%3A%7B%22t%22%3A10%2C%22i%22%3A0%2C%22p%22%3A%7B%22k%22%3A%5B%22data%22%5D%2C%22v%22%3A%5B%7B%22t%22%3A10%2C%22i%22%3A1%2C%22p%22%3A%7B%22k%22%3A%5B%22include%22%5D%2C%22v%22%3A%5B%7B%22t%22%3A2%2C%22s%22%3A1%7D%5D%7D%2C%22o%22%3A0%7D%5D%7D%2C%22o%22%3A0%7D%2C%22f%22%3A127%2C%22m%22%3A%5B%5D%7D';
    const resp = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'x-tsr-serverfn': 'true'
      }
    });

    const text = await resp.text();
    console.log(`[${acc.name}] Status: ${resp.status}, Len: ${text.length}`);
    const hasRawalo = text.toLowerCase().includes('rawalo');
    console.log(`  Has Rawalo? ${hasRawalo}`);
    if (hasRawalo) {
      const idx = text.toLowerCase().indexOf('rawalo');
      console.log('  RAWALO SNIPPET:', text.slice(Math.max(0, idx - 150), idx + 250));
      fs.writeFileSync('rawalo_inst.txt', text);
      fs.writeFileSync('rawalo_trainer_token.txt', token);
      fs.writeFileSync('rawalo_trainer_name.txt', acc.name);
      return;
    }
  }
}

testInstitutions().catch(console.error);

