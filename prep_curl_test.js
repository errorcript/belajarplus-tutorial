const fs = require('fs');

const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b'; // Semester 1 2026/2027

const rows = [
  {
    row: 2,
    rombel: 'Kelas 10-1',
    dayOfWeek: 1, // Senin
    start: '07:45',
    end: '08:30',
    subject: 'BAHASA INDONESIA',
    activity: '',
    teacher: 'ERY EKA PRATIWI'
  }
];

const serovalRows = rows.map((r, idx) => ({
  t: 10,
  i: idx + 3,
  p: {
    k: ['row', 'rombel', 'dayOfWeek', 'start', 'end', 'subject', 'activity', 'teacher'],
    v: [
      { t: 0, s: r.row },
      { t: 1, s: r.rombel },
      { t: 0, s: r.dayOfWeek },
      { t: 1, s: r.start },
      { t: 1, s: r.end },
      { t: 1, s: r.subject },
      { t: 1, s: r.activity },
      { t: 1, s: r.teacher }
    ]
  },
  o: 0
}));

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
            k: ['semesterId', 'rows'],
            v: [
              { t: 1, s: semesterId },
              {
                t: 9,
                i: 2,
                a: serovalRows,
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

fs.writeFileSync('test_payload_curl.json', JSON.stringify(payload));
console.log('Saved test_payload_curl.json');

