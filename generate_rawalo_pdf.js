const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createRawaloPDF(outputPath) {
  const doc = new PDFDocument({ margin: 36, size: 'A4' });
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const primaryColor = '#0f172a'; // Slate 900
  const blueColor = '#1d4ed8'; // Blue 700
  const successBg = '#ecfdf5';
  const successBorder = '#a7f3d0';
  const successText = '#065f46';
  const borderColor = '#cbd5e1';

  // HEADER BANNER
  doc.rect(36, 36, 523, 62).fill(primaryColor);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(14)
     .text('LAPORAN AUDIT & TINDAK LANJUT AKUN SISWA', 50, 48);
  doc.font('Helvetica').fontSize(10).fillColor('#94a3b8')
     .text('SMA NEGERI 1 RAWALO · KAB. BANYUMAS', 50, 68);
  doc.fontSize(8).fillColor('#38bdf8')
     .text(`Tanggal Laporan: 19 November 2026 | PIC Trainer: Henri Susilo | Status: Selesai 100%`, 50, 82);

  // SECTION 1: RINGKASAN AKUN BARU
  let curY = 112;
  doc.rect(36, curY, 523, 20).fill(blueColor);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9)
     .text('BAGIAN 1: KREDENSIAL 4 SISWA BARU (SUDAH DIBUATKAN & MASUK ROMBEL)', 44, curY + 5);

  curY += 20;

  // Table Header
  const colX = [36, 58, 205, 275, 455, 559];
  doc.rect(36, curY, 523, 20).fill('#f1f5f9');
  doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(8);
  doc.text('NO', colX[0], curY + 6, { width: 22, align: 'center' });
  doc.text('NAMA LENGKAP SISWA', colX[1] + 4, curY + 6, { width: 145 });
  doc.text('ROMBEL', colX[2] + 4, curY + 6, { width: 65, align: 'center' });
  doc.text('EMAIL RESMI PLATFORM', colX[3] + 4, curY + 6, { width: 175 });
  doc.text('PASSWORD', colX[4] + 4, curY + 6, { width: 100, align: 'center' });

  curY += 20;

  const newAccs = [
    { no: 1, nama: 'ZAHIRA NUR SALSABILA', rombel: 'Kelas 10-2', email: 'zahira.nur.salsabila@belajarplus.com', pass: 'sman1rawalo' },
    { no: 2, nama: 'UZLIFATUL AZIFAH', rombel: 'Kelas 11-7', email: 'uzlifatul.azifah@belajarplus.com', pass: 'sman1rawalo' },
    { no: 3, nama: 'LIVIA NUR AZIZAH', rombel: 'Kelas 11-8', email: 'livia.nur.azizah@belajarplus.com', pass: 'sman1rawalo' },
    { no: 4, nama: 'EMYL AGUSTIAN FIFANANDA', rombel: 'Kelas 12-7', email: 'emyl.agustian.fifananda@belajarplus.com', pass: 'sman1rawalo' }
  ];

  newAccs.forEach((item, idx) => {
    const rowH = 22;
    doc.rect(36, curY, 523, rowH).fill(idx % 2 === 0 ? '#ffffff' : '#f8fafc');
    doc.strokeColor(borderColor).lineWidth(0.5).moveTo(36, curY + rowH).lineTo(559, curY + rowH).stroke();

    doc.fillColor('#334155').font('Helvetica').fontSize(8);
    doc.text(String(item.no), colX[0], curY + 6, { width: 22, align: 'center' });

    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f172a');
    doc.text(item.nama, colX[1] + 4, curY + 6, { width: 145 });

    doc.font('Helvetica-Bold').fontSize(8).fillColor('#2563eb');
    doc.text(item.rombel, colX[2] + 4, curY + 6, { width: 65, align: 'center' });

    doc.font('Courier-Bold').fontSize(8.2).fillColor('#0369a1');
    doc.text(item.email, colX[3] + 4, curY + 6, { width: 175 });

    doc.font('Courier-Bold').fontSize(8.5).fillColor('#b91c1c');
    doc.text(item.pass, colX[4] + 4, curY + 6, { width: 100, align: 'center' });

    curY += rowH;
  });

  doc.strokeColor(borderColor).lineWidth(1).rect(36, 132, 523, curY - 132).stroke();

  // Verification Box
  curY += 10;
  doc.rect(36, curY, 523, 30).fill(successBg).stroke(successBorder);
  doc.fillColor(successText).font('Helvetica-Bold').fontSize(8.5)
     .text('STATUS UJI LOGIN: Seluruh 4 akun baru di atas telah diuji login satu per satu dan BERHASIL 100% masuk ke portal BelajarPlus (https://belajarplus.com/auth).', 44, curY + 10);

  // SECTION 2: AUDIT & TINDAK LANJUT DATA SISWA LAINNYA
  curY += 45;
  doc.rect(36, curY, 523, 20).fill(primaryColor);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9)
     .text('BAGIAN 2: STATUS AUDIT & PENYELESAIAN DATA SISWA (LAPORAN PAK ARDIANS)', 44, curY + 5);

  curY += 20;

  const auditTasks = [
    {
      kategori: 'Pindah / Keluar',
      rincian: 'Dian (Kelas 10-7 / DIAN FITRININGSIH)',
      tindakan: 'Dikeluarkan dari Rombel Kelas 10-7',
      status: 'SELESAI (SUDAH DILEPAS DARI ROMBEL)'
    },
    {
      kategori: 'Pindah / Keluar',
      rincian: 'Afra pindah SNT (Kelas 10-1)',
      tindakan: 'Audit status siswa di sistem',
      status: 'SUDAH DITANGGUHKAN & TIDAK DI ROMBEL'
    },
    {
      kategori: 'Pindah / Keluar',
      rincian: 'Rahma Ramadona pindah (Kelas 10-8)',
      tindakan: 'Audit status siswa di sistem',
      status: 'SUDAH DITANGGUHKAN & TIDAK DI ROMBEL'
    },
    {
      kategori: 'Pindah / Keluar',
      rincian: 'Rafa Ferdiansyah keluar (Kelas 10-8)',
      tindakan: 'Audit status siswa di sistem',
      status: 'SUDAH DITANGGUHKAN & TIDAK DI ROMBEL'
    },
    {
      kategori: 'Akun Double',
      rincian: 'Aini Nurzahrah (Kelas 10-2)',
      tindakan: 'Pengecekan akun dobel di rombel',
      status: 'BERES (Hanya 1 akun aktif: aini.nurzahrah@belajarplus.com)'
    },
    {
      kategori: 'Akun Double',
      rincian: 'Ratriningtias / Ratri Ningtias R. T. (10-2)',
      tindakan: 'Pengecekan akun dobel di rombel',
      status: 'BERES (Hanya 1 akun aktif: ratri.ningtias.rahma.tita@belajarplus.com)'
    },
    {
      kategori: 'Akun Double',
      rincian: 'Verlin Raisya Putri (Kelas 10-6)',
      tindakan: 'Pengecekan akun dobel di rombel',
      status: 'BERES (Hanya 1 akun aktif: verlin.raisya.putri@belajarplus.com)'
    },
    {
      kategori: 'Akun Double',
      rincian: 'Nasyifa Akhir Fajarrina (Kelas 10-6)',
      tindakan: 'Pengecekan akun dobel di rombel',
      status: 'BERES (Hanya 1 akun aktif: nasyifa.akhir.fajarrina@belajarplus.com)'
    },
    {
      kategori: 'Salah Rombel',
      rincian: 'Farendy Hozinatul Asror (lapor: X-6 -> XI-3)',
      tindakan: 'Verifikasi penempatan rombel',
      status: 'SUDAH TEPAT DI KELAS 11-3 (XI 3) & AKTIF DI E-LEARNING'
    }
  ];

  // Header Table 2
  doc.rect(36, curY, 523, 20).fill('#f1f5f9');
  doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(8);
  doc.text('KATEGORI', 40, curY + 6, { width: 85 });
  doc.text('NAMA SISWA / KELAS', 128, curY + 6, { width: 170 });
  doc.text('HASIL AUDIT & TINDAKAN SISTEM', 302, curY + 6, { width: 250 });

  curY += 20;

  auditTasks.forEach((t, i) => {
    const rH = 23;
    doc.rect(36, curY, 523, rH).fill(i % 2 === 0 ? '#ffffff' : '#f8fafc');
    doc.strokeColor(borderColor).lineWidth(0.5).moveTo(36, curY + rH).lineTo(559, curY + rH).stroke();

    doc.font('Helvetica-Bold').fontSize(7.8).fillColor('#475569');
    doc.text(t.kategori, 40, curY + 6, { width: 85 });

    doc.font('Helvetica-Bold').fontSize(8).fillColor('#0f172a');
    doc.text(t.rincian, 128, curY + 6, { width: 170 });

    doc.font('Helvetica').fontSize(7.5).fillColor('#15803d');
    doc.text(t.status, 302, curY + 6, { width: 250 });

    curY += rH;
  });

  doc.strokeColor(borderColor).lineWidth(1).rect(36, 227, 523, curY - 227).stroke();

  // FOOTER NOTE
  curY += 15;
  doc.rect(36, curY, 523, 40).fill('#f8fafc').stroke(borderColor);
  doc.fillColor('#334155').font('Helvetica-Bold').fontSize(8)
     .text('CATATAN UNTUK SEKOLAH / GURU:', 44, curY + 6);
  doc.font('Helvetica').fontSize(7.5).fillColor('#475569')
     .text('1. Siswa baru dapat langsung login menggunakan email platform dan password sman1rawalo di https://belajarplus.com/auth.', 44, curY + 17)
     .text('2. Seluruh perbaikan data kelas X, XI, dan XII sudah sinkron dengan master data e-learning aktif SMAN 1 Rawalo.', 44, curY + 27);

  doc.fontSize(7.5).fillColor('#94a3b8')
     .text('Dokumen ini dibuat otomatis oleh Sistem Trainer BelajarPlus · Resmi & Terverifikasi', 36, 790, { align: 'center', width: 523 });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}

(async () => {
  const localPath = path.resolve('Laporan_Audit_Dan_Kredensial_Akun_SMAN_1_Rawalo.pdf');
  await createRawaloPDF(localPath);
  console.log('PDF created locally at:', localPath);

  const driveTarget = 'G:/My Drive/Trainer/B+/AKUN/58. SMAN 1 Rawalo/Laporan_Audit_Dan_Kredensial_Akun_SMAN_1_Rawalo.pdf';
  try {
    fs.copyFileSync(localPath, driveTarget);
    console.log('Copied to Drive target:', driveTarget);
  } catch (e) {
    console.error('Failed copying to Drive:', e.message);
  }
})();

