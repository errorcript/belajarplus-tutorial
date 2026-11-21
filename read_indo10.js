const fs = require('fs');
const { execSync } = require('child_process');

execSync(`tar -xf "temp_docx_unzipped/SOAL SIMULASI/Soal_Bahasa_Indonesia_Kelas_10_Belajar_Plus.docx" -C .`);
if (fs.existsSync('word/document.xml')) {
  const xml = fs.readFileSync('word/document.xml', 'utf8');
  const text = xml.replace(/<w:p[^>]*>/g, '\n').replace(/<[^>]+>/g, '').trim();
  console.log('=== ISI SOAL BAHASA INDONESIA KELAS 10 ===');
  console.log(text);
} else {
  console.log('word/document.xml not found');
}

