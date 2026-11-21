const fs = require('fs');

const code = fs.readFileSync('mapel_bundle.js', 'utf8');

console.log('--- Checking imports & mutations in mapel_bundle.js ---');
// Cari server function / mutation
const mutations = [...code.matchAll(/mutationFn:\s*([^,}]+)/g)];
console.log('Mutations:', mutations.map(m => m[0]));

// Print imports
console.log('First 500 chars:\n', code.slice(0, 500));

