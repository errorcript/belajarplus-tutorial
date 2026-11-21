const fs = require('fs');

const namesToAdd = [
  'Bahasa Inggris Tingkat Lanjut',
  'Matematika Tingkat Lanjut',
  'Sejarah Tingkat Lanjut',
  'Pendidikan Agama Kristen dan Budi Pekerti'
];

// Seroval payload: { data: { names: [ ... ] } }
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
            k: ['names'],
            v: [
              {
                t: 9,
                i: 2,
                a: namesToAdd.map((n, idx) => ({ t: 1, s: n })),
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

fs.writeFileSync('temp_add_names.json', JSON.stringify(payload));
console.log('Saved temp_add_names.json');

