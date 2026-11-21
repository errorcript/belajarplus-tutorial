const fs = require('fs');

async function getRombelData() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const yearId = 'f3a97751-f264-4691-9d8b-8cde2eadd44e';

  // Seroval payload for yearId
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
              k: ['yearId'],
              v: [{ t: 1, s: yearId }]
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

  fs.writeFileSync('rombels_payload.json', JSON.stringify(payload));
}

getRombelData().catch(console.error);

