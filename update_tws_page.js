const fs = require('fs');

async function updateTwsData() {
  const finalRekap = JSON.parse(fs.readFileSync('tws_final_rekap_rombel.json', 'utf8'));

  // Update live counts di comparison
  const comp = JSON.parse(fs.readFileSync('tws_student_rombel_comparison.json', 'utf8'));
  comp.liveRombelCounts = {};
  comp.driveRombelCounts = {};

  finalRekap.forEach(r => {
    comp.liveRombelCounts[r.rombel] = r.live;
    comp.driveRombelCounts[r.rombel] = r.target;
  });

  // 4 siswa sisa
  comp.missingInPlatformCount = 4;
  comp.missingInPlatformList = [
    { A: 'Moria Calista Damasa Riyadi', B: 'cacha.cdr2011@gmail.com', C: 'Sman1taw_1413', D: 'Kelas 10-4' },
    { A: 'Abid Bahtiar Putra Ramadan', B: 'abidbahtiar50@gmail.com', C: 'sman1taw490', D: 'Kelas 12-1' },
    { A: 'SELVIANA AUZAN HAZHIYAH', B: 'selvianaauzan28@gmail.com', C: 'sman1taw898', D: 'Kelas 12-1' },
    { A: 'TYAS AULIA MAHARANI', B: 'tyasaulia28@gmail.com', C: 'sman1taw213', D: 'Kelas 12-4' }
  ];

  fs.writeFileSync('tws_student_rombel_comparison.json', JSON.stringify(comp, null, 2));
  console.log('Updated tws_student_rombel_comparison.json');

  // Jalankan generate_tws_html.js
  require('./generate_tws_html.js');
  console.log('Regenerated tws.html successfully.');
}

updateTwsData().catch(console.error);

