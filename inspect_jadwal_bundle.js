const fs = require('fs');
const code = fs.readFileSync('jadwal_bundle.js', 'utf8');

console.log('Size:', code.length);

// Pretty print formatted snippet
// Find all strings in the code
const strRegex = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g;
const strings = [...code.matchAll(strRegex)].map(m => m[0]);
console.log('Total string literals:', strings.length);

// Filter interesting strings
const interesting = strings.filter(s => 
  s.includes('jadwal') || 
  s.includes('schedule') || 
  s.includes('rombel') || 
  s.includes('subject') || 
  s.includes('teacher') || 
  s.includes('api') || 
  s.includes('server') ||
  s.includes('insert') ||
  s.includes('delete') ||
  s.includes('update') ||
  s.includes('select') ||
  s.includes('from')
);
console.log('Interesting strings:', [...new Set(interesting)]);

// Let's also search for server functions (TanStack Start / Nitro / Vinxi serverFn IDs)
const serverFns = strings.filter(s => /^[a-zA-Z0-9_-]{30,}$/.test(s.slice(1, -1)));
console.log('Potential server function IDs:', serverFns);

