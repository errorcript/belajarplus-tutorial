const fs = require('fs');

const indexCode = fs.readFileSync('index_bundle.js', 'utf8');

// Cari export Bo as, Lo as
const boMatch = indexCode.match(/\b([a-zA-Z0-9_$]+)\s+as\s+Bo\b/);
const loMatch = indexCode.match(/\b([a-zA-Z0-9_$]+)\s+as\s+Lo\b/);
console.log('Bo original:', boMatch ? boMatch[1] : 'not found');
console.log('Lo original:', loMatch ? loMatch[1] : 'not found');

if (boMatch && loMatch) {
  const findDef = (name) => {
    const r = new RegExp(`\\b${name}\\s*=\\s*([^,;]+)`);
    const m = indexCode.match(r);
    console.log(`Def for ${name}:`, m ? m[0].slice(0, 100) : 'not found');
  };
  findDef(boMatch[1]);
  findDef(loMatch[1]);
}

