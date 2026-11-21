const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');
const crypto = require('crypto');

async function tryProvision() {
  const token = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const schoolId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';

  const students = [
    { email: 'tyasaulia28@gmail.com', name: 'TYAS AULIA MAHARANI', password: 'Sman1tws_siswa105', rombel: 'Kelas 12-4' },
    { email: 'cacha.cdr2011@gmail.com', name: 'Moria Calista Damasa Riyadi', password: 'Sman1tws_siswa101', rombel: 'Kelas 10-4' },
    { email: 'abidbahtiar50@gmail.com', name: 'Abid Bahtiar Putra Ramadan', password: 'Sman1tws_siswa103', rombel: 'Kelas 12-1' },
    { email: 'selvianaauzan28@gmail.com', name: 'SELVIANA AUZAN HAZHIYAH', password: 'Sman1tws_siswa104', rombel: 'Kelas 12-1' }
  ];

  for (const s of students) {
    console.log(`\n=== PROVISIONING: ${s.name} (${s.email}) ===`);
    const opId = crypto.randomUUID();

    // 1. Preview
    const previewRows = [{
      row: 1,
      email: s.email,
      name: s.name,
      password: s.password,
      operationId: opId
    }];

    const previewPayload = {
      t: {
        t: 10, i: 0,
        p: {
          k: ['data'],
          v: [{
            t: 10, i: 1,
            p: {
              k: ['institutionId', 'channel', 'rows', 'mode'],
              v: [
                { t: 1, s: schoolId },
                { t: 1, s: 'admin' },
                {
                  t: 9, i: 2,
                  a: [{
                    t: 10, i: 3,
                    p: {
                      k: ['row', 'email', 'name', 'password', 'operationId'],
                      v: [
                        { t: 0, s: 1 },
                        { t: 1, s: s.email },
                        { t: 1, s: s.name },
                        { t: 1, s: s.password },
                        { t: 1, s: opId }
                      ]
                    },
                    o: 0
                  }]
                },
                { t: 1, s: 'preview' }
              ]
            },
            o: 0
          }]
        },
        o: 0
      },
      f: 127, m: []
    };

    const prevRes = await fetch('https://belajarplus.com/_serverFn/9504974c76ed6f9869c7b103d7bd9625c81d11ca1599aa', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'x-school-override': schoolId,
        'x-tsr-serverfn': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(previewPayload)
    });

    const prevText = await prevRes.text();
    console.log('Preview Res Status:', prevRes.status);

    // Parse preview result
    let prevRow = null;
    try {
      const obj = JSON.parse(prevText);
      const rows = obj.p?.v?.[0]?.p?.v?.[0]?.a || [];
      const item = rows[0];
      const k = item.p?.k || [];
      const v = item.p?.v || [];
      prevRow = {};
      k.forEach((key, idx) => prevRow[key] = v[idx]?.s);
      console.log('Preview item:', prevRow);
    } catch (e) {
      console.error('Error parse preview:', e.message, prevText.slice(0, 300));
      continue;
    }

    if (!prevRow || (prevRow.status !== 'Siap' && !prevRow.draftToken)) {
      console.log(`Status bukan Siap: ${prevRow?.status} - ${prevRow?.note}`);
      continue;
    }

    // 2. Commit
    console.log('Committing with draftToken:', prevRow.draftToken);
    const commitPayload = {
      t: {
        t: 10, i: 0,
        p: {
          k: ['data'],
          v: [{
            t: 10, i: 1,
            p: {
              k: ['institutionId', 'channel', 'rows', 'mode'],
              v: [
                { t: 1, s: schoolId },
                { t: 1, s: 'admin' },
                {
                  t: 9, i: 2,
                  a: [{
                    t: 10, i: 3,
                    p: {
                      k: ['row', 'email', 'name', 'password', 'operationId', 'intent', 'draftToken'],
                      v: [
                        { t: 0, s: 1 },
                        { t: 1, s: s.email },
                        { t: 1, s: s.name },
                        { t: 1, s: s.password },
                        { t: 1, s: opId },
                        { t: 1, s: prevRow.intent || 'provision' },
                        { t: 1, s: prevRow.draftToken }
                      ]
                    },
                    o: 0
                  }]
                },
                { t: 1, s: 'commit' }
              ]
            },
            o: 0
          }]
        },
        o: 0
      },
      f: 127, m: []
    };

    const commitRes = await fetch('https://belajarplus.com/_serverFn/9504974c76ed6f9869c7b103d7bd9625c81d11ca1599aa', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'x-school-override': schoolId,
        'x-tsr-serverfn': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commitPayload)
    });

    const commitText = await commitRes.text();
    console.log('Commit Status:', commitRes.status);

    let commitRow = {};
    try {
      const obj = JSON.parse(commitText);
      const rows = obj.p?.v?.[0]?.p?.v?.[0]?.a || [];
      const item = rows[0];
      const k = item.p?.k || [];
      const v = item.p?.v || [];
      k.forEach((key, idx) => commitRow[key] = v[idx]?.s);
      console.log('Commit result:', commitRow);
    } catch (e) {
      console.error('Error parse commit:', e.message, commitText.slice(0, 300));
    }

    // 3. Retry jika resumable
    if (commitRow.resumable && commitRow.draftToken) {
      console.log('Attempting RETRY with new draftToken:', commitRow.draftToken);
      const retryPayload = {
        t: {
          t: 10, i: 0,
          p: {
            k: ['data'],
            v: [{
              t: 10, i: 1,
              p: {
                k: ['institutionId', 'channel', 'rows', 'mode'],
                v: [
                  { t: 1, s: schoolId },
                  { t: 1, s: 'admin' },
                  {
                    t: 9, i: 2,
                    a: [{
                      t: 10, i: 3,
                      p: {
                        k: ['row', 'email', 'name', 'password', 'operationId', 'intent', 'draftToken'],
                        v: [
                          { t: 0, s: 1 },
                          { t: 1, s: s.email },
                          { t: 1, s: s.name },
                          { t: 1, s: s.password },
                          { t: 1, s: opId },
                          { t: 1, s: commitRow.intent || 'provision' },
                          { t: 1, s: commitRow.draftToken }
                        ]
                      },
                      o: 0
                    }]
                  },
                  { t: 1, s: 'commit' }
                ]
              },
              o: 0
            }]
          },
          o: 0
        },
        f: 127, m: []
      };

      const retryRes = await fetch('https://belajarplus.com/_serverFn/9504974c76ed6f9869c7b103d7bd9625c81d11ca1599aa', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'x-school-override': schoolId,
          'x-tsr-serverfn': 'true',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(retryPayload)
      });
      const retryText = await retryRes.text();
      console.log('Retry response:', retryText);
    }

    await new Promise(r => setTimeout(r, 1000));
  }
}

tryProvision().catch(console.error);

