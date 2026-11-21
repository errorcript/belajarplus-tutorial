const fs = require('fs');
const cp = require('child_process');

async function createSubject(name, code = null) {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  // 1. Buat subject dasar
  // Payload Seroval: { data: { id: null, name, code, description: null, active: true, sortOrder: null } }
  const createPayload = {
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
              k: ['id', 'name', 'code', 'description', 'active', 'sortOrder'],
              v: [
                { t: 2, s: 0 }, // null
                { t: 1, s: name },
                code ? { t: 1, s: code } : { t: 2, s: 0 },
                { t: 2, s: 0 },
                { t: 2, s: 2 }, // true
                { t: 2, s: 0 }
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

  fs.writeFileSync('temp_create_sub.json', JSON.stringify(createPayload));
  const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/01c73e6ebe5c66aed551efa411a2078555ea0387ea66b3eebbeca4dd35424a44" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/mapel" --data-binary "@temp_create_sub.json"`;
  
  const res = cp.execSync(cmd, { encoding: 'utf8' });
  console.log(`Create ${name} result:`, res);

  // Ambil ID dari hasil
  const idMatch = res.match(/"id","ok"\],"v":\[\{"t":1,"s":"([0-9a-f-]{36})"\}/);
  if (!idMatch) {
    console.error('Failed to get subject ID');
    return null;
  }
  const id = idMatch[1];
  console.log('Created ID:', id);

  // 2. Set level SMA (10, 11, 12)
  const levelPayload = {
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
                { t: 1, s: id },
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

  fs.writeFileSync('temp_level_sub.json', JSON.stringify(levelPayload));
  const cmd2 = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/b0245e0db9c91ad49fa13f58fe8cba3e698aa0840f1a802cf7e923c40538bf5f" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/mapel" --data-binary "@temp_level_sub.json"`;
  const res2 = cp.execSync(cmd2, { encoding: 'utf8' });
  console.log('Set level result:', res2);

  return id;
}

// Tambahkan mapel-mapel yang belum ada
async function addMissingSubjects() {
  const missing = [
    'Pendidikan Agama Kristen dan Budi Pekerti',
    'Bahasa Inggris Tingkat Lanjut',
    'Matematika Tingkat Lanjut',
    'Sejarah Tingkat Lanjut'
  ];

  for (const name of missing) {
    await createSubject(name);
  }
}

addMissingSubjects().catch(console.error);

