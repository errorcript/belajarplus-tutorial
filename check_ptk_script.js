const fs = require('fs');

// Cek file impor ptk atau script pendaftaran guru yang digunakan kemarin
const files = fs.readdirSync('.').filter(f => f.includes('ptk') || f.includes('teacher') || f.includes('guru'));
console.log('Related files:', files);

