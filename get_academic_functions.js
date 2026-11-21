const https = require('https');
const fs = require('fs');

https.get('https://belajarplus.com/assets/master-academic.functions-DiWH2bvb.js', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    fs.writeFileSync('master_academic_functions.js', data);
    console.log('Saved master_academic_functions.js, size:', data.length);
    // Find server function calls
    const matches = data.match(/serverFn.*?[a-f0-9]{40,}|"[a-f0-9]{50,}"/g);
    console.log('Matches:', matches);
  });
}).on('error', console.error);

