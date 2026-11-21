const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function main() {
  const apikey = 'sb_publishable_2Dp2ndaxCq-sDK-96n7HbA_M_kcQdTt';

  // 1. Coba login Mevi
  console.log('Login Mevi...');
  let res = await fetch('https://jpmfsldnzptdgfhvdqpb.supabase.co/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { 'apikey': apikey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'Fitrinoveiraa@gmail.com', password: 'Mevi2026^' })
  });
  let json = await res.json();
  let token = json.access_token;

  if (!token) {
    console.log('Login Mevi failed, trying Andrew...');
    res = await fetch('https://jpmfsldnzptdgfhvdqpb.supabase.co/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'apikey': apikey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'And.aliffiansyah@gmail.com', password: 'kerja98' })
    });
    json = await res.json();
    token = json.access_token;
  }

  if (!token) {
    console.error('Failed to get token for both trainers!');
    return;
  }

  console.log('Login success! Fetching institutions...');
  // Fetch institutions
  const instRes = await fetch('https://belajarplus.com/_serverFn/e35542c971d68586633ce35db94ff40095d3062c0d6693763dae07ac400ba23d', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-tsr-serverfn': 'true'
    }
  });

  const instText = await instRes.text();
  // Cari Rawalo
  console.log('Response inst len:', instText.length);
  const rawaloIdx = instText.toLowerCase().indexOf('rawalo');
  console.log('Rawalo index:', rawaloIdx);

  if (rawaloIdx === -1) {
    console.log('Rawalo not found in institutions!');
    // Coba print nama-nama sekolah yang ada
    const matches = [...instText.matchAll(/\{"t":1,"s":"([0-9a-fA-F-]{36})"\},[^{]*?\{"t":1,"s":"([^"]+)"\}/g)];
    console.log('Total schools found:', matches.length);
    matches.forEach(m => console.log(`- ${m[2]} (${m[1]})`));
    return;
  }

  const snippet = instText.slice(Math.max(0, rawaloIdx - 300), rawaloIdx + 300);
  console.log('Snippet around Rawalo:', snippet);

  // Ambil school ID Rawalo
  // Format seroval: id, name
  const uuidMatch = snippet.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g);
  console.log('Matched UUIDs:', uuidMatch);
}

main().catch(console.error);

