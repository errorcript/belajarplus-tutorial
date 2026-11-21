const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function auditLiveVsTws() {
  const token = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const schoolId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';
  const yearId = '9383e733-a9c9-4401-901a-e9bc2f3547de'; // 2026/2027

  console.log('1. Fetching live rombels list...');
  const rPayload = {
    t: {
      t: 10, i: 0,
      p: {
        k: ['data'],
        v: [{
          t: 10, i: 1,
          p: { k: ['yearId'], v: [{ t: 1, s: yearId }] },
          o: 0
        }]
      },
      o: 0
    },
    f: 127, m: []
  };

  const rRes = await fetch('https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': schoolId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rPayload)
  });

  const rText = await rRes.text();
  const rombelItems = [...rText.matchAll(/\{"t":1,"s":"([0-9a-fA-F-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-fA-F-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

  const liveRombels = rombelItems.map(m => ({
    id: m[1],
    suffix: m[2],
    name: m[4],
    displayName: `${m[8]}-${m[2]}`
  }));

  console.log(`Live rombels found: ${liveRombels.length}`);

  console.log('\n2. Fetching active members per rombel...');
  const liveRombelCounts = {};
  for (const r of liveRombels) {
    const payload = {
      t: {
        t: 10, i: 0,
        p: {
          k: ['data'],
          v: [{
            t: 10, i: 1,
            p: { k: ['rombelId'], v: [{ t: 1, s: r.id }] },
            o: 0
          }]
        },
        o: 0
      },
      f: 127, m: []
    };

    const res = await fetch('https://belajarplus.com/_serverFn/ddb25d03d56501b10734f908f4b7c19e66fc5c223c6627114c020066492cc67d', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'x-school-override': schoolId,
        'x-tsr-serverfn': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    let count = 0;
    try {
      const obj = JSON.parse(text);
      const rawList = obj.p?.v?.[0]?.a || [];
      const active = rawList.filter(item => {
        const k = item.p?.k || [];
        const v = item.p?.v || [];
        const statusIdx = k.indexOf('status');
        return v[statusIdx]?.s === 'active';
      });
      count = active.length;
    } catch (e) {}

    liveRombelCounts[r.displayName] = count;
  }

  console.log('\n3. Fetching live PTK / Teachers...');
  const ptkPayload = {
    t: {
      t: 10, i: 0,
      p: {
        k: ['data'],
        v: [{
          t: 10, i: 1,
          p: {
            k: ['op', 'institutionId', 'kind'],
            v: [
              { t: 1, s: 'roster' },
              { t: 1, s: schoolId },
              { t: 1, s: 'teacher' }
            ]
          },
          o: 0
        }]
      },
      o: 0
    },
    f: 127, m: []
  };

  const ptkRes = await fetch('https://belajarplus.com/_serverFn/338cb13c9aa10d5bf9bbbac6a7408ce8a833f425d9483d9693ddebf46a8c1efb', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': schoolId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ptkPayload)
  });

  const ptkText = await ptkRes.text();
  let liveTeachers = [];
  try {
    const ptkObj = JSON.parse(ptkText);
    function findPtkStr(v) {
      if (typeof v === 'string' && v.includes('teacher')) return v;
      if (typeof v === 'object' && v) {
        for (const k of Object.keys(v)) {
          const r = findPtkStr(v[k]);
          if (r) return r;
        }
      }
    }
    let ptkStr = findPtkStr(ptkObj);
    if (ptkStr?.startsWith('[{\\"')) {
      ptkStr = ptkStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    liveTeachers = JSON.parse(ptkStr || '[]');
  } catch (e) {
    console.error('Error parse PTK:', e.message);
  }

  console.log(`Live PTK found: ${liveTeachers.length}`);

  // Simpan snapshot live
  fs.writeFileSync('tws_latest_live_snapshot.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    liveRombelCounts,
    liveTeachersCount: liveTeachers.length,
    liveTeachers: liveTeachers.map(t => ({ name: t.full_name, email: t.email, status: t.status }))
  }, null, 2));

  // 4. Bandingkan dengan data yang ada di tws.html
  console.log('\n4. Membaca data yang tertulis di tws.html...');
  const htmlContent = fs.readFileSync('tws.html', 'utf8');

  // Parse rombel counts yang ada di tws.html
  // Biasanya ada text seperti: "Platform Live: <b>36</b> · Target: 36 siswa" atau per card
  const cardRegex = /<div class="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">\s*([^\s<]+(?:\s+[^\s<]+)*)\s*(?:<span[^>]*>[^<]*<\/span>)?\s*<\/div>\s*<div class="text-\[11px\] text-slate-500 mt-0\.5">Platform Live:\s*<b>(\d+)<\/b>\s*·\s*Target:\s*(\d+)\s*siswa<\/div>/g;
  
  const twsHtmlRombels = {};
  let match;
  while ((match = cardRegex.exec(htmlContent)) !== null) {
    twsHtmlRombels[match[1].trim()] = {
      htmlLive: parseInt(match[2], 10),
      htmlTarget: parseInt(match[3], 10)
    };
  }

  console.log(`Rombels parsed from tws.html: ${Object.keys(twsHtmlRombels).length}`);

  // Perbandingan detail
  function getRombelKey(name) {
    const m = name.match(/Kelas\s+(\d+)[\-_](\d+)/);
    if (m) return parseInt(m[1]) * 100 + parseInt(m[2]);
    return 9999;
  }

  const allRombelKeys = Object.keys(liveRombelCounts).sort((a,b) => getRombelKey(a) - getRombelKey(b));

  console.log('\n=== PERBANDINGAN DATA ROMBEL: TWS WEB VS PLATFORM LIVE ===');
  console.log('Rombel'.padEnd(16) + ' | ' + 'TWS HTML Live'.padEnd(15) + ' | ' + 'Platform Live'.padEnd(15) + ' | ' + 'Status');
  console.log('-'.repeat(65));

  let matchedCount = 0;
  let mismatchedCount = 0;
  const diffs = [];

  allRombelKeys.forEach(k => {
    const htmlVal = twsHtmlRombels[k]?.htmlLive;
    const liveVal = liveRombelCounts[k];
    const isMatch = htmlVal === liveVal;
    if (isMatch) matchedCount++;
    else {
      mismatchedCount++;
      diffs.push({ rombel: k, htmlVal, liveVal });
    }
    const status = isMatch ? '✅ COCOK' : `❌ BEDA (HTML: ${htmlVal} vs Live: ${liveVal})`;
    console.log(k.padEnd(16) + ' | ' + (htmlVal !== undefined ? htmlVal.toString() : 'N/A').padEnd(15) + ' | ' + liveVal.toString().padEnd(15) + ' | ' + status);
  });

  console.log('-'.repeat(65));
  console.log(`Total Rombel: ${allRombelKeys.length} | Cocok: ${matchedCount} | Beda: ${mismatchedCount}`);

  // Cek ringkasan PTK
  console.log('\n=== PERBANDINGAN DATA PTK / GURU ===');
  console.log(`Live PTK di platform: ${liveTeachers.length}`);
  // Cek apakah di html ada angka PTK
  const ptkStatMatch = htmlContent.match(/(\d+)\s*<span[^>]*>Total Guru & Tendik<\/span>/) || htmlContent.match(/Total Guru[^\d]*(\d+)/i);
  console.log(`PTK di tws.html:`, ptkStatMatch ? ptkStatMatch[1] : 'Lihat tabel guru di halaman');

  fs.writeFileSync('tws_audit_comparison_report.json', JSON.stringify({
    matchedCount,
    mismatchedCount,
    diffs,
    liveRombelCounts,
    twsHtmlRombels,
    liveTeachersCount: liveTeachers.length
  }, null, 2));
}

auditLiveVsTws().catch(console.error);

