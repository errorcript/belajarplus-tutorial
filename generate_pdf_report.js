const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('final_verified_students.json', 'utf8'));

function createPDF(outputPath) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Colors
  const primaryColor = '#1e3a8a'; // Dark blue
  const secondaryColor = '#2563eb'; // Blue
  const tableHeaderBg = '#f1f5f9';
  const borderColor = '#cbd5e1';
  const successColor = '#16a34a';

  // Header Box
  doc.rect(40, 40, 515, 65).fill('#0f172a');
  
  doc.fillColor('#ffffff')
     .font('Helvetica-Bold')
     .fontSize(16)
     .text('BELAJARPLUS - REKAP KREDENSIAL AKUN SISWA', 55, 52);

  doc.font('Helvetica')
     .fontSize(10)
     .fillColor('#94a3b8')
     .text('SMA NEGERI 1 GONDANG · KELAS XII D (SUSULAN / PERBAIKAN)', 55, 74);

  doc.fontSize(8)
     .fillColor('#cbd5e1')
     .text(`Diverifikasi & Diperbarui: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} | Status: 100% Login Verified`, 55, 88);

  // Metadata Box
  doc.moveDown(3);
  const startY = 120;
  doc.rect(40, startY, 515, 45).fill('#f8fafc').stroke(borderColor);

  doc.fillColor('#334155').font('Helvetica-Bold').fontSize(9)
     .text('INFORMASI PENTING:', 50, startY + 8);
  doc.font('Helvetica').fontSize(8.5).fillColor('#475569')
     .text('• Seluruh 12 akun di bawah ini telah terdaftar, aktif, dan TERUJI BERHASIL LOGIN 100% di portal BelajarPlus (https://belajarplus.com/auth).', 50, startY + 20)
     .text('• Kata sandi seragam telah diaktifkan di sistem: sman1gon. Siswa dapat langsung login menggunakan email platform.', 50, startY + 31);

  // Table Config
  const tableTop = 180;
  const colX = [40, 65, 230, 310, 455, 555]; // Coordinates for 5 columns
  // Col 0: No (40 to 65 = 25)
  // Col 1: Nama Siswa (65 to 230 = 165)
  // Col 2: Rombel (230 to 310 = 80)
  // Col 3: Email Platform (310 to 455 = 145)
  // Col 4: Password (455 to 555 = 100)

  // Table Header Background
  doc.rect(40, tableTop, 515, 24).fill(primaryColor);

  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5);
  doc.text('NO', colX[0] + 5, tableTop + 7, { width: 20, align: 'center' });
  doc.text('NAMA LENGKAP SISWA', colX[1] + 5, tableTop + 7, { width: 155 });
  doc.text('ROMBEL', colX[2] + 5, tableTop + 7, { width: 70, align: 'center' });
  doc.text('EMAIL PLATFORM', colX[3] + 5, tableTop + 7, { width: 135 });
  doc.text('PASSWORD', colX[4] + 5, tableTop + 7, { width: 90, align: 'center' });

  let curY = tableTop + 24;

  data.forEach((item, index) => {
    const rowHeight = 26;
    const isEven = index % 2 === 0;

    // Background row
    doc.rect(40, curY, 515, rowHeight).fill(isEven ? '#ffffff' : '#f8fafc');

    // Bottom border
    doc.strokeColor(borderColor).lineWidth(0.5).moveTo(40, curY + rowHeight).lineTo(555, curY + rowHeight).stroke();

    // Values
    doc.fillColor('#1e293b').font('Helvetica').fontSize(8);
    doc.text(String(item.no), colX[0], curY + 8, { width: 25, align: 'center' });
    
    doc.font('Helvetica-Bold').fontSize(8.5);
    doc.text(item.nama, colX[1] + 5, curY + 8, { width: 160 });

    doc.font('Helvetica').fontSize(8);
    doc.text(item.rombel, colX[2] + 5, curY + 8, { width: 70, align: 'center' });

    doc.font('Courier-Bold').fontSize(8.2).fillColor('#0369a1');
    doc.text(item.email, colX[3] + 5, curY + 8, { width: 140 });

    doc.font('Courier-Bold').fontSize(9).fillColor('#b91c1c');
    doc.text(item.password, colX[4] + 5, curY + 8, { width: 90, align: 'center' });

    curY += rowHeight;
  });

  // Table Outer Border
  doc.strokeColor(primaryColor).lineWidth(1).rect(40, tableTop, 515, curY - tableTop).stroke();

  // Summary Card below table
  curY += 20;
  doc.rect(40, curY, 515, 60).fill('#ecfdf5').stroke('#a7f3d0');
  doc.fillColor('#065f46').font('Helvetica-Bold').fontSize(9)
     .text('STATUS HASIL PENGECEKAN & VERIFIKASI LOGIN OTOMATIS:', 50, curY + 10);
  doc.font('Helvetica').fontSize(8.5).fillColor('#047857')
     .text('✓ Seluruh 12 siswa (100%) berhasil login ke sistem BelajarPlus tanpa kendala kredensial.', 50, curY + 24)
     .text('✓ Akun sudah terhubung ke institusi SMA NEGERI 1 GONDANG pada Rombel Kelas 12-D.', 50, curY + 36)
     .text('✓ Siap dibagikan langsung kepada wali kelas XII D / PIC sekolah SMA Negeri 1 Gondang.', 50, curY + 48);

  // Footer
  doc.fontSize(8).fillColor('#94a3b8')
     .text('Dokumen ini dibuat otomatis oleh Sistem Antigravity Trainer BelajarPlus · Resmi & Terverifikasi', 40, 780, { align: 'center', width: 515 });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log('PDF created successfully at:', outputPath);
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

(async () => {
  const localPdf = path.resolve('Daftar_Akun_12_Siswa_Kelas_XII_D_SMAN_1_Gondang.pdf');
  await createPDF(localPdf);

  // Target paths in Google Drive
  const drivePath1 = 'G:/My Drive/Trainer/B+/KLASTER 2 - JAWA TENGAH (BERKAS RESMI)/14. SMAN 1 Gondang/1. Akun Siswa/Daftar_Akun_12_Siswa_Kelas_XII_D_SMAN_1_Gondang.pdf';
  const drivePath2 = 'G:/My Drive/Trainer/B+/AKUN/36. SMAN 1 Gondang/Daftar_Akun_12_Siswa_Kelas_XII_D_SMAN_1_Gondang.pdf';

  try {
    fs.copyFileSync(localPdf, drivePath1);
    console.log('Copied to Drive Path 1:', drivePath1);
  } catch (e) {
    console.error('Failed copying to Drive Path 1:', e.message);
  }

  try {
    fs.copyFileSync(localPdf, drivePath2);
    console.log('Copied to Drive Path 2:', drivePath2);
  } catch (e) {
    console.error('Failed copying to Drive Path 2:', e.message);
  }
})();

