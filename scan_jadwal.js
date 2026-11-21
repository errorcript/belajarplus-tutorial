const fs = require('fs');
const code = fs.readFileSync('jadwal_bundle.js', 'utf8');

// Find all JSX / text inside
console.log('--- Checking for text and component names ---');
// Match text in JSX or object keys
const matches = code.match(/[A-Za-z0-9_\-\.]{4,}/g) || [];
const uniqueWords = [...new Set(matches)];

// Look for words related to import, export, excel, template, upload, jadwal, slot, lesson, schedule
const filterWords = uniqueWords.filter(w => /excel|template|import|export|upload|download|jadwal|schedule|lesson|time|jam|hari|rombel|kelas/i.test(w));
console.log('Relevant words found:', filterWords);

