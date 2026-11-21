const fs = require('fs');
const cp = require('child_process');

async function checkSavedSchedules() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';

  // ServerFn query jadwal rombel
  // Di jadwal_bundle.js: m({ data: { rombelId: W, semesterId: R } })
  // Di import index-BBcvfogD.js: Vo as ne (serverFn ne)
  // Mari kita cari ID serverFn ne di index_bundle.js
  const indexCode = fs.readFileSync('index_bundle.js', 'utf8');
  const match = indexCode.match(/,\s*([a-zA-Z0-9_$]+)\s+as\s+ne\s*[,}]/);
  console.log('ne original:', match ? match[1] : 'none');

  if (match) {
    const fnMatch = indexCode.match(new RegExp(`\\b${match[1]}\\s*=\\s*l\\(\\{[^}]+handler\\(s\\(\`([^\`]+)\`\\)\\)`));
    console.log('Query jadwal serverFn ID:', fnMatch ? fnMatch[1] : 'none');
  }
}

checkSavedSchedules().catch(console.error);

