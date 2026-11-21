const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function checkAcademicYear() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const res = await fetch('https://rwmcfzsnkjkklytthmow.supabase.co/rest/v1/academic_years?select=*&school_id=eq.' + schoolId, {
    headers: {
      'apikey': 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U',
      'Authorization': 'Bearer ' + token
    }
  });

  const data = await res.json();
  console.log('Academic years for SMAN 11 Purworejo:');
  console.log(JSON.stringify(data, null, 2));

  fs.writeFileSync('ay_purworejo11.json', JSON.stringify(data, null, 2));
}

checkAcademicYear().catch(console.error);

