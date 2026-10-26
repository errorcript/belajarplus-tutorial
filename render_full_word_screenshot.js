const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderFullRealisticWordScreenshot() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1920,1350'] });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1350 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  const htmlWordFull = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Word Template Preview</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Calibri', 'Segoe UI', sans-serif; }
      body { background: #d0d7de; display: flex; justify-content: center; padding: 0; color: #1e293b; }
      
      .word-app { width: 100%; max-width: 1550px; background: #2b579a; box-shadow: 0 15px 40px rgba(0,0,0,0.25); display: flex; flex-direction: column; }
      
      /* Title Bar */
      .word-titlebar { height: 40px; background: #2b579a; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 16px; font-size: 13px; font-weight: 600; }
      .quick-actions { display: flex; align-items: center; gap: 14px; }
      .icon-btn { font-size: 14px; cursor: pointer; opacity: 0.9; }
      .doc-name { font-weight: 700; letter-spacing: 0.02em; display: flex; align-items: center; gap: 8px; }
      .saved-badge { background: rgba(255,255,255,0.2); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 500; }
      
      /* Ribbon Menu Tabs */
      .ribbon-tabs { background: #2b579a; padding: 0 12px; display: flex; gap: 4px; font-size: 13px; font-weight: 500; color: white; border-bottom: 1px solid rgba(255,255,255,0.15); }
      .r-tab { padding: 8px 14px; cursor: pointer; opacity: 0.9; border-radius: 4px 4px 0 0; }
      .r-tab.active { background: #ffffff; color: #2b579a; font-weight: 700; opacity: 1; }
      
      /* Ribbon Toolbar */
      .ribbon-panel { background: #ffffff; border-bottom: 1px solid #cbd5e1; padding: 8px 16px; display: flex; gap: 20px; align-items: center; font-size: 12px; color: #475569; }
      .ribbon-group { display: flex; gap: 8px; align-items: center; border-right: 1px solid #e2e8f0; padding-right: 16px; }
      .r-btn { border: 1px solid #e2e8f0; background: #f8fafc; padding: 5px 10px; border-radius: 4px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; color: #334155; }
      .font-select { border: 1px solid #cbd5e1; padding: 4px 8px; border-radius: 4px; font-weight: 600; color: #1e293b; background: white; width: 130px; font-size: 12px; }
      .size-select { border: 1px solid #cbd5e1; padding: 4px 6px; border-radius: 4px; font-weight: 600; color: #1e293b; background: white; width: 45px; text-align: center; font-size: 12px; }
      
      /* Workspace Canvas */
      .canvas-area { background: #e2e8f0; padding: 30px 20px; display: flex; flex-direction: column; align-items: center; overflow-y: auto; }
      
      /* Ruler */
      .ruler { width: 920px; height: 18px; background: #ffffff; border: 1px solid #cbd5e1; margin-bottom: 15px; border-radius: 2px; display: flex; align-items: center; justify-content: space-between; padding: 0 50px; font-size: 10px; color: #64748b; font-family: monospace; }
      
      /* A4 Page */
      .a4-page { width: 920px; background: #ffffff; padding: 55px 65px; box-shadow: 0 4px 25px rgba(0,0,0,0.18); border: 1px solid #cbd5e1; min-height: 1250px; }
      
      /* Header Kop */
      .kop-wrapper { text-align: center; border-bottom: 3.5px double #0f172a; padding-bottom: 14px; margin-bottom: 22px; }
      .kop-instansi { font-size: 13px; font-weight: 800; color: #334155; letter-spacing: 0.05em; text-transform: uppercase; }
      .kop-platform { font-size: 20px; font-weight: 900; color: #2b579a; margin: 4px 0; letter-spacing: 0.02em; }
      .kop-desc { font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; }
      
      /* Meta Table */
      .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12.5px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; }
      .meta-table td { padding: 8px 12px; border: 1px solid #e2e8f0; }
      .meta-table .label { font-weight: 700; color: #475569; width: 160px; background: #f1f5f9; }
      
      /* Section Header */
      .section-bar { background: #2b579a; color: white; padding: 7px 12px; font-size: 12.5px; font-weight: 800; border-radius: 4px; margin: 18px 0 12px 0; text-transform: uppercase; letter-spacing: 0.03em; }
      
      /* Question Items */
      .q-block { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px; margin-bottom: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.03); }
      .q-meta-line { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 6px; margin-bottom: 8px; font-size: 12px; }
      .q-badge { font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 4px; }
      .b-mcq { background: #dbeafe; color: #1e40af; }
      .b-mcma { background: #fef3c7; color: #b45309; }
      .b-pgk { background: #e0e7ff; color: #4338ca; }
      .b-match { background: #fce7f3; color: #be185d; }
      .b-essay { background: #dcfce7; color: #15803d; }
      .b-upload { background: #ffedd5; color: #c2410c; }
      
      .q-text { font-size: 13.5px; font-weight: 600; color: #0f172a; line-height: 1.55; margin-bottom: 8px; }
      .stimulus-box { background: #f8fafc; border-left: 3px solid #2b579a; padding: 8px 12px; font-size: 12.5px; color: #334155; margin-bottom: 8px; font-style: italic; line-height: 1.5; }
      
      .opt-container { margin-left: 14px; font-size: 13px; line-height: 1.6; color: #334155; margin-bottom: 8px; }
      .opt-key { font-weight: 800; color: #15803d; background: #dcfce7; padding: 1px 6px; border-radius: 3px; }
      
      .kunci-footer { background: #f1f5f9; padding: 6px 10px; border-radius: 4px; font-size: 11.5px; display: flex; justify-content: space-between; align-items: center; font-family: 'Segoe UI', sans-serif; }
      .kunci-tag { font-family: 'Consolas', monospace; font-weight: 800; color: #1e293b; background: #e2e8f0; padding: 2px 7px; border-radius: 3px; }
      .rubrik-tag { font-family: 'Consolas', monospace; color: #047857; font-weight: 700; }
      .latex-badge { font-family: 'Consolas', monospace; background: #fee2e2; color: #991b1b; padding: 1px 5px; border-radius: 3px; font-weight: 700; }
      
      /* Status Bar */
      .word-statusbar { height: 26px; background: #2b579a; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 16px; font-size: 11px; opacity: 0.95; }
    </style>
  </head>
  <body>
    <div class="word-app">
      <!-- Title Bar -->
      <div class="word-titlebar">
        <div class="quick-actions">
          <span class="icon-btn">💾</span>
          <span class="icon-btn">↩️</span>
          <span class="icon-btn">↪️</span>
          <div class="doc-name">
            <span>template_pembuatan_soal_guru_belajarplus.docx - Word</span>
            <span class="saved-badge">Disimpan ke OneDrive / Komputer</span>
          </div>
        </div>
        <div style="font-size: 12px; display:flex; gap:16px;">
          <span>👤 Henri Susilo (Guru Mapel)</span>
          <span>➖ 🗖 ✖</span>
        </div>
      </div>

      <!-- Ribbon Tabs -->
      <div class="ribbon-tabs">
        <div class="r-tab">File</div>
        <div class="r-tab active">Beranda</div>
        <div class="r-tab">Sisipkan</div>
        <div class="r-tab">Tata Letak</div>
        <div class="r-tab">Referensi</div>
        <div class="r-tab">Tinjau</div>
        <div class="r-tab">Tampilan</div>
      </div>

      <!-- Ribbon Toolbar Buttons -->
      <div class="ribbon-panel">
        <div class="ribbon-group">
          <span class="r-btn">📋 Tempel</span>
        </div>
        <div class="ribbon-group">
          <select class="font-select"><option>Calibri</option><option>Times New Roman</option><option>Arial</option></select>
          <select class="size-select"><option>11</option><option>12</option></select>
          <span class="r-btn"><b>B</b></span>
          <span class="r-btn"><i>I</i></span>
          <span class="r-btn"><u>U</u></span>
          <span class="r-btn" style="color:#b91c1c;">abc</span>
        </div>
        <div class="ribbon-group">
          <span class="r-btn">• Paragraf</span>
          <span class="r-btn">1. Nomor</span>
          <span class="r-btn">≡ Rata Kiri</span>
          <span class="r-btn">☲ Rata Kanan Kiri</span>
        </div>
        <div style="margin-left: auto; color: #15803d; font-weight: 700; display:flex; align-items:center; gap:6px;">
          <span>✓ Format Resmi Terverifikasi Impor LJD BelajarPlus</span>
        </div>
      </div>

      <!-- Canvas Area -->
      <div class="canvas-area">
        <!-- Ruler -->
        <div class="ruler">
          <span>|···1···|···2···|···3···|···4···|···5···|···6···|···7···|···8···|···9···|···10···|···11···|···12···|···13···|···14···|···15···|</span>
        </div>

        <!-- Sheet Page A4 -->
        <div class="a4-page">
          <div class="kop-wrapper">
            <div class="kop-instansi">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</div>
            <div class="kop-platform">PLATFORM CBT & LEMBAR JAWAB DIGITAL (LJD) BELAJARPLUS</div>
            <div class="kop-desc">NASKAH PENYUSUNAN BUTIR SOAL ASESMEN KURIKULUM MERDEKA</div>
          </div>

          <!-- Metadata -->
          <table class="meta-table">
            <tr>
              <td class="label">Satuan Pendidikan</td>
              <td>SMA / MA Mitra BelajarPlus Jawa Tengah</td>
              <td class="label">Mata Pelajaran</td>
              <td>Biologi & Ilmu Pengetahuan Alam</td>
            </tr>
            <tr>
              <td class="label">Kelas / Fase</td>
              <td>Kelas X (Fase E) / Kelas XI (Fase F)</td>
              <td class="label">Alokasi Waktu</td>
              <td>90 Menit (Proteksi FSM Anti-Cheat 3x)</td>
            </tr>
            <tr>
              <td class="label">Bentuk Asesmen</td>
              <td>Latihan Soal Mandiri / Kuis Bab / STS / SAS</td>
              <td class="label">Penyusun / Guru</td>
              <td>Guru Mata Pelajaran Sekolah</td>
            </tr>
          </table>

          <div class="section-bar">I. FORMAT BUTIR SOAL LENGKAP 6 TIPE RESPON STANDAR CBT / LJD</div>

          <!-- Soal 1: MCQ -->
          <div class="q-block">
            <div class="q-meta-line">
              <span style="font-weight:700;">BUTIR NOMOR 1</span>
              <div>
                <span class="q-badge b-mcq">TIPE: MCQ (PILIHAN GANDA TUNGGAL)</span>
                <span style="font-size:11px; font-weight:700; color:#64748b; margin-left:8px;">Bobot: 1 Poin</span>
              </div>
            </div>
            <div class="q-text">Organel sel yang berperan sebagai tempat respirasi seluler aerob untuk menghasilkan adenosin trifosfat (ATP) adalah...</div>
            <div class="opt-container">
              A. Ribosom<br/>
              B. Mitokondria &nbsp;<span class="opt-key">[KUNCI BENAR]</span><br/>
              C. Badan Golgi<br/>
              D. Retikulum Endoplasma Kasar<br/>
              E. Lisosom
            </div>
            <div class="kunci-row">
              <span>Kunci Jawaban: <span class="kunci-tag">B</span></span>
              <span style="color:#64748b;">Mekanisme: Auto-Scoring Instan (100% Bebas Kredit AI)</span>
            </div>
          </div>

          <!-- Soal 2: MCMA Formula -->
          <div class="q-block">
            <div class="q-meta-line">
              <span style="font-weight:700;">BUTIR NOMOR 2</span>
              <div>
                <span class="q-badge b-mcma">TIPE: MCMA (PILIHAN KOMPLEKS AKM)</span>
                <span style="font-size:11px; font-weight:700; color:#64748b; margin-left:8px;">Bobot: 3 Poin</span>
              </div>
            </div>
            <div class="q-text">
              Perhatikan fungsi persamaan kuadrat gerak vertikal: <span class="latex-badge">$h(t) = -5t^2 + 20t + 25$</span>. Manakah pernyataan yang bernilai benar? <i>(Pilih semua yang benar)</i>
            </div>
            <div class="opt-container">
              [X] A. Ketinggian mula-mula saat t = 0 adalah 25 meter &nbsp;<span class="opt-key">[KUNCI]</span><br/>
              [ ] B. Benda mencapai tanah kembali setelah t = 10 sekon<br/>
              [X] C. Waktu untuk mencapai ketinggian maksimum adalah t = 2 sekon &nbsp;<span class="opt-key">[KUNCI]</span><br/>
              [X] D. Ketinggian puncak maksimum yang dicapai benda adalah 45 meter &nbsp;<span class="opt-key">[KUNCI]</span>
            </div>
            <div class="kunci-row">
              <span>Format Kunci Delimiter Impor: <span class="kunci-tag">A,C,D</span></span>
              <span style="color:#64748b;">Mekanisme: Penilaian Proporsional Kotak Centang Multi-Respon</span>
            </div>
          </div>

          <!-- Soal 3: PGK Matriks -->
          <div class="q-block">
            <div class="q-meta-line">
              <span style="font-weight:700;">BUTIR NOMOR 3</span>
              <div>
                <span class="q-badge b-pgk">TIPE: PGK (BENAR / SALAH MATRIKS)</span>
                <span style="font-size:11px; font-weight:700; color:#64748b; margin-left:8px;">Bobot: 3 Poin</span>
              </div>
            </div>
            <div class="stimulus-box">
              Stimulus Wacana: Pemerintah menargetkan bauran Energi Baru Terbarukan (EBT) nasional mencapai 23% pada tahun 2025 melalui akselerasi PLTS Atap dan Biofuel.
            </div>
            <div class="q-text">Tentukan status kebenaran dari setiap baris pernyataan berikut berdasarkan wacana:</div>
            <div class="opt-container">
              • Pernyataan 1: Target bauran EBT sebesar 23% ditargetkan tahun 2025 &rarr; <b>[BENAR]</b><br/>
              • Pernyataan 2: Biofuel tidak termasuk pilar akselerasi dekarbonisasi nasional &rarr; <b>[SALAH]</b><br/>
              • Pernyataan 3: PLTS Atap merupakan tumpuan utama peningkatan EBT nasional &rarr; <b>[BENAR]</b>
            </div>
            <div class="kunci-row">
              <span>Format Kunci Delimiter Impor: <span class="kunci-tag">B;S;B</span></span>
              <span style="color:#64748b;">Mekanisme: Skoring Matriks Biner per Baris Pernyataan</span>
            </div>
          </div>

          <!-- Soal 4: MATCH -->
          <div class="q-block">
            <div class="q-meta-line">
              <span style="font-weight:700;">BUTIR NOMOR 4</span>
              <div>
                <span class="q-badge b-match">TIPE: MATCH (MENJODOHKAN)</span>
                <span style="font-size:11px; font-weight:700; color:#64748b; margin-left:8px;">Bobot: 4 Poin</span>
              </div>
            </div>
            <div class="q-text">Pasangkan proses termodinamika gas ideal berikut dengan ciri kondisi fisisnya:</div>
            <div class="opt-container">
              <b>Premis Kiri:</b> 1. Isokhorik &nbsp;|&nbsp; 2. Isobarik &nbsp;|&nbsp; 3. Isotermik &nbsp;|&nbsp; 4. Adiabatik<br/>
              <b>Konsep Kanan:</b> A. Tekanan tetap &nbsp;|&nbsp; B. Volume tetap (W=0) &nbsp;|&nbsp; C. Q=0 &nbsp;|&nbsp; D. Suhu tetap
            </div>
            <div class="kunci-row">
              <span>Format Pasangan Kunci Impor: <span class="kunci-tag">1-B;2-A;3-D;4-C</span></span>
              <span style="color:#64748b;">Mekanisme: Pencocokan Pasangan Garis / Dropdown</span>
            </div>
          </div>

          <!-- Soal 5: ESSAY AI -->
          <div class="q-block">
            <div class="q-meta-line">
              <span style="font-weight:700;">BUTIR NOMOR 5</span>
              <div>
                <span class="q-badge b-essay">TIPE: ESSAY (KOREKSI SEMANTIK AI)</span>
                <span style="font-size:11px; font-weight:700; color:#64748b; margin-left:8px;">Bobot: 5 Poin</span>
              </div>
            </div>
            <div class="q-text">Jelaskan dampak alih fungsi hutan lindung di kawasan hulu DAS terhadap siklus hidrologi dan risiko bencana di hilir!</div>
            <div style="font-size:12px; background:#ecfdf5; border:1px solid #a7f3d0; padding:8px 12px; border-radius:4px; margin-bottom:8px;">
              <b>Rubrik Kata Kunci AI:</b> <span class="rubrik-tag">infiltrasi air berkurang | limpasan permukaan tinggi | banjir bandang hilir | erosi tanah | kekeringan kemarau</span>
            </div>
            <div class="kunci-row">
              <span>Kunci Acuan Guru: Infiltrasi air turun, limpasan permukaan naik memicu banjir dan kekeringan sumur.</span>
              <span style="color:#059669; font-weight:700;">Human-in-the-Loop Veto Guru</span>
            </div>
          </div>

          <!-- Soal 6: UPLOAD -->
          <div class="q-block">
            <div class="q-meta-line">
              <span style="font-weight:700;">BUTIR NOMOR 6</span>
              <div>
                <span class="q-badge b-upload">TIPE: UPLOAD (PRAKTIKUM & LKPD)</span>
                <span style="font-size:11px; font-weight:700; color:#64748b; margin-left:8px;">Bobot: 10 Poin</span>
              </div>
            </div>
            <div class="q-text">Unggah laporan praktikum titrasi asam-basa lengkap grafik pH dan foto lembar kerja bertanda tangan! (Format PDF/DOCX &le; 10 MB)</div>
            <div class="kunci-row">
              <span>Format Kunci: <span class="kunci-tag">[Manual Grading oleh Guru]</span></span>
              <span style="color:#d97706; font-weight:700;">Koreksi Manual via /admin/submissions</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Status Bar -->
      <div class="word-statusbar">
        <div style="display:flex; gap:16px;">
          <span>Halaman 1 dari 1</span>
          <span>482 kata</span>
          <span>Bahasa Indonesia</span>
        </div>
        <div style="display:flex; gap:16px; align-items:center;">
          <span>Tata Letak Cetak</span>
          <span>100% ────●───</span>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  const tempPath = path.resolve('temp_full_word_preview.html');
  fs.writeFileSync(tempPath, htmlWordFull);
  await page.goto('file:///' + tempPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(600);

  const previewAssetPath = path.resolve('assets/template_soal_word_doc_preview.png');
  await page.locator('.word-app').screenshot({ path: previewAssetPath });
  console.log('Full Word Screenshot HD berhasil diperbarui di:', previewAssetPath);

  try { fs.unlinkSync(tempPath); } catch (e) {}
  await browser.close();
}

renderFullRealisticWordScreenshot();
