const fs = require('fs');

if (fs.existsSync('master_academic_functions.js')) {
  const content = fs.readFileSync('master_academic_functions.js', 'utf8');
  console.log('Length:', content.length);
  // find server fn ids (64 hex characters)
  const matches = content.match(/[a-f0-9]{64}/g);
  console.log('ServerFn IDs found:', [...new Set(matches)]);
}

