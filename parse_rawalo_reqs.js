const fs = require('fs');

async function parseRequests() {
  const dns = require('dns');
  dns.setDefaultResultOrder('ipv4first');
  const token = fs.readFileSync('rawalo_trainer_token.txt', 'utf8').trim();
  const rawaloId = 'cd1a621e-b3b2-4e06-a53d-4fc7690b5d89';

  const reqPayload = {
    t: {
      t: 10, i: 0,
      p: {
        k: ['data'],
        v: [{
          t: 10, i: 1,
          p: {
            k: ['op', 'institutionId'],
            v: [{ t: 1, s: 'requests' }, { t: 1, s: rawaloId }]
          },
          o: 0
        }]
      },
      o: 0
    },
    f: 127, m: []
  };

  const reqRes = await fetch('https://belajarplus.com/_serverFn/2c8fda7d38060ceee84693206b8d6356ba330cde4a2b94fd8b37f6be650e6a07', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': rawaloId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqPayload)
  });

  const raw = await reqRes.text();
  const data = JSON.parse(raw);

  function findJsonString(val) {
    if (typeof val === 'string' && (val.startsWith('[{') || val.startsWith('[{\\"'))) return val;
    if (typeof val === 'object' && val !== null) {
      for (const k of Object.keys(val)) {
        const r = findJsonString(val[k]);
        if (r) return r;
      }
    }
    return null;
  }

  let str = findJsonString(data);
  if (str && str.startsWith('[{\\"')) {
    str = str.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  const list = JSON.parse(str || '[]');
  console.log('Total requests found in Rawalo:', list.length);
  fs.writeFileSync('rawalo_requests.json', JSON.stringify(list, null, 2));

  const fitriReqs = list.filter(r => {
    const fn = (r.full_name || '').toLowerCase();
    const em = (r.email || '').toLowerCase();
    return fn.includes('fitri') || em.includes('fitri');
  });

  console.log('Fitri matches in requests:', JSON.stringify(fitriReqs, null, 2));
}

parseRequests().catch(console.error);

