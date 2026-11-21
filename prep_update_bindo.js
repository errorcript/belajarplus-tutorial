const fs = require('fs');

const subjectId = 'eeefd72c-d394-40d0-88e4-be791745cb61'; // BAHASA INDONESIA

// Seroval payload untuk { data: { id, levelCode: "SMA", gradeCodes: ["10", "11", "12"] } }
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
              { t: 1, s: subjectId },
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

fs.writeFileSync('test_update_bindo_levels.json', JSON.stringify(payload));
console.log('Saved test_update_bindo_levels.json');

