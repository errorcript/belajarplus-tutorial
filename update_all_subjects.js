const fs = require('fs');

async function updateAllSchoolSubjectsTo10_11_12() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  // Baca daftar mapel dari last_mapel_response.json
  const raw = fs.readFileSync('last_mapel_response.json', 'utf8');

  // Ekstrak semua subject id dan name
  // Format seroval:
  // id: "...", name: "..."
  const regex = /\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":2,"s":\d+\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g;
  const subjects = [];
  let m;
  while ((m = regex.exec(raw)) !== null) {
    subjects.push({ id: m[1], name: m[2] });
  }

  console.log(`Found ${subjects.length} subjects to update:`);
  console.log(subjects.map(s => s.name).join(', '));

  fs.writeFileSync('school_subjects_list.json', JSON.stringify(subjects, null, 2));

  // Update masing-masing subject dengan gradeCodes: ["10", "11", "12"]
  for (let idx = 0; idx < subjects.length; idx++) {
    const s = subjects[idx];
    const payload = {
      t: {
        t: 10,
        i: 0,
        p: {
          k: ['data'],
          v: [
            {
              t: 10,
              i: 1,
              p: {
                k: ['id', 'levelCode', 'gradeCodes'],
                v: [
                  { t: 1, s: s.id },
                  { t: 1, s: 'SMA' },
                  {
                    t: 9,
                    i: 2,
                    a: [
                      { t: 1, s: '10' },
                      { t: 1, s: '11' },
                      { t: 1, s: '12' }
                    ],
                    o: 0
                  }
                ]
              },
              o: 0
            }
          ]
        },
        o: 0
      },
      f: 127,
      m: []
    };

    fs.writeFileSync('temp_sub_payload.json', JSON.stringify(payload));

    // Gunakan child_process curl.exe -4
    const cp = require('child_process');
    const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/b0245e0db9c91ad49fa13f58fe8cba3e698aa0840f1a802cf7e923c40538bf5f" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/mapel" --data-binary "@temp_sub_payload.json"`;

    const output = cp.execSync(cmd, { encoding: 'utf8' });
    const isOk = output.includes('"ok":true') || output.includes('"ok":') || output.includes(s.id);
    console.log(`[${idx + 1}/${subjects.length}] ${s.name}: ${isOk ? 'OK' : 'FAIL - ' + output.slice(0, 100)}`);
  }

  console.log('All subjects updated to SMA (10, 11, 12)!');
}

updateAllSchoolSubjectsTo10_11_12().catch(console.error);

