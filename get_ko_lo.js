const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

const koMatch = indexCode.match(/,\s*([a-zA-Z0-9_$]+)\s+as\s+Ko\s*[,}]/);
const loMatch = indexCode.match(/,\s*([a-zA-Z0-9_$]+)\s+as\s+Lo\s*[,}]/);
console.log('Ko local:', koMatch ? koMatch[1] : 'none');
console.log('Lo local:', loMatch ? loMatch[1] : 'none');

// Print serverFn for both
const printFn = (name) => {
  const r = new RegExp(`\\b${name}\\s*=\\s*l\\(\\{[^}]+handler\\(s\\(\`([^\`]+)\`\\)\\)`);
  const m = indexCode.match(r);
  console.log(`${name} serverFn:`, m ? m[1] : 'none');
};

printFn(koMatch[1]);
printFn(loMatch[1]);

