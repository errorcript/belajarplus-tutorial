const fs = require('fs');
const html = fs.readFileSync('tws.html', 'utf8');

const stats = [];
const statRegex = /<div class="text-2xl sm:text-3xl font-extrabold[^>]*>([\s\S]*?)<\/div>\s*<span class="text-\[11px\][^>]*>([\s\S]*?)<\/span>/g;
let m;
while ((m = statRegex.exec(html)) !== null) {
  stats.push({ value: m[1].replace(/<[^>]+>/g, '').trim(), label: m[2].replace(/<[^>]+>/g, '').trim() });
}
console.log('Stats on tws.html:\n', stats);

const guruRows = (html.match(/guru-row/g) || []).length;
console.log('Guru rows in main table:', guruRows);

// Cek apakah ada tabel ekstra guru
const extraRows = (html.match(/Akun domain @belajarplus\.com/g) || []).length;
console.log('Extra guru domain @belajarplus.com rows:', extraRows);

