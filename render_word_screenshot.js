const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderDocxPreviewScreenshot() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1920,1080'] });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  const htmlWord = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Calibri', 'Segoe UI', -apple-system, sans-serif; }
      body { background: #e2e8f0; padding: 24px; color: #1e293b; }
      .word-window { background: #ffffff; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); overflow: hidden; border: 1px solid #cbd5e1; max-width: 1300px; margin: 0 auto; }
      .word-ribbon { background: #2b579a; color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
      .word-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
      .word-badge { background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
      .toolbar { background: #f3f4f6; border-bottom: 1px solid #d1d5db; padding: 8px 20px; display: flex; gap: 15px; font-size: 13px; color: #4b5563; }
      .doc-page { background: #ffffff; padding: 48px 64px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin: 20px auto; max-width: 960px; min-height: 800px; border: 1px solid #e5e7eb; }
      .doc-header-kop { text-align: center; border-bottom: 3px double #1e293b; padding-bottom: 14px; margin-bottom: 20px; }
      .kop-1 { font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
      .kop-2 { font-size: 18px; font-weight: 800; color: #2b579a; margin: 4px 0; }
      .kop-3 { font-size: 13px; font-weight: 700; color: #0f172a; }
      .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .meta-item { display: flex; gap: 6px; }
      .meta-label { font-weight: 700; color: #475569; min-width: 140px; }
      .section-heading { font-size: 14px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; margin: 20px 0 10px 0; border-left: 4px solid #2b579a; padding-left: 8px; }
      .question-card { background: #fdfdfd; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin-bottom: 14px; }
      .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .q-pill { font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; }
      .q-pill-mcq { background: #dbeafe; color: #1e40af; }
      .q-pill-mcma { background: #fef3c7; color: #b45309; }
      .q-pill-pgk { background: #e0e7ff; color: #4338ca; }
      .q-pill-essay { background: #dcfce7; color: #15803d; }
      .q-text { font-size: 13.5px; font-weight: 600; color: #0f172a; margin-bottom: 10px; line-height: 1.5; }
      .opt-list { font-size: 13px; color: #334155; margin-left: 15px; margin-bottom: 10px; line-height: 1.6; }
      .kunci-row { font-size: 12px; background: #f1f5f9; padding: 6px 12px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
      .kunci-badge { font-weight: 800; color: #15803d; background: #dcfce7; padding: 2px 8px; border-radius: 3px; font-family: monospace; }
      .latex-code { font-family: 'Consolas', monospace; color: #b91c1c; font-weight: 600; background: #fee2e2; padding: 1px 5px; border-radius: 3px; }
    </style>
  </head>
  <body>
    <div class="word-window">
      <div class="word-ribbon">
        <div class="word-title">
          <span>📄 Microsoft Word Template: template_pembuatan_soal_guru_belajarplus.docx</span>
          <span class="word-badge">Format Word Resmi Kurikulum Merdeka</span>
        </div>
        <div style="font-size: 12px; opacity: 0.9;">Ekstensi: .docx (Office Word)</div>
      </div>

      <div class="toolbar">
        <span>Beranda</span>
        <span style="font-weight:700; color:#2b579a; border-bottom:2px solid #2b579a;">Sisipkan</span>
        <span>Tata Letak</span>
        <span>Referensi</span>
        <span>Surat</span>
        <span>Tinjau</span>
        <span>Tampilan</span>
        <span style="margin-left:auto; color:#059669; font-weight:700;">✓ Format Siap Impor CBT BelajarPlus</span>
      </div>

      <div class="doc-page">
        <div class="doc-header-kop">
          <div class="kop-1">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</div>
          <div class="kop-2">PLATFORM CBT & LEMBAR JAWAB DIGITAL (LJD) BELAJARPLUS</div>
          <div class="kop-3">NASKAH PENYUSUNAN BUTIR SOAL & ASESMEN GURU TAHUN AJARAN 2026/2027</div>
        </div>

        <div class="meta-box">
          <div class="meta-item"><span class="meta-label">Satuan Pendidikan:</span><span>SMA Negeri Mitra BelajarPlus</span></div>
          <div class="meta-item"><span class="meta-label">Fase / Kelas:</span><span>Fase E / Kelas X</span></div>
          <div class="meta-item"><span class="meta-label">Mata Pelajaran:</span><span>Ilmu Pengetahuan Alam (Biologi / Fisika)</span></div>
          <div class="meta-item"><span class="meta-label">Alokasi Waktu:</span><span>90 Menit (Auto Anti-Cheat)</span></div>
          <div class="meta-item"><span class="meta-label">Bentuk Evaluasi:</span><span>Asesmen Sumatif Tengah Semester (STS)</span></div>
          <div class="meta-item"><span class="meta-label">Total Butir Soal:</span><span>30 Butir (6 Variasi Tipe Respon)</span></div>
        </div>

        <div class="section-heading">DAFTAR BUTIR SOAL & KUNCI JAWABAN STANDAR CBT</div>

        <!-- Butir 1 MCQ -->
        <div class="question-card">
          <div class="q-header">
            <span style="font-weight:700; font-size:13px; color:#1e293b;">SOAL NOMOR 1</span>
            <div><span class="q-pill q-pill-mcq">TIPE: MCQ (PILIHAN GANDA)</span> <span style="font-size:11px; font-weight:700; color:#64748b;">Bobot: 1 Poin</span></div>
          </div>
          <div class="q-text">Organel sel yang berfungsi sebagai tempat respirasi aerob untuk menghasilkan adenosin trifosfat (ATP) adalah...</div>
          <div class="opt-list">
            A. Ribosom<br/>
            B. Mitokondria <span style="color:#15803d; font-weight:700;">[KUNCI BENAR]</span><br/>
            C. Badan Golgi<br/>
            D. Retikulum Endoplasma Kasar<br/>
            E. Peroksisom
          </div>
          <div class="kunci-row">
            <span>Kunci Impor: <span class="kunci-badge">B</span></span>
            <span style="color:#64748b; font-size:11px;">Mekanisme: Auto-Scoring Instan Bebas Kredit AI</span>
          </div>
        </div>

        <!-- Butir 2 MCMA Formula -->
        <div class="question-card">
          <div class="q-header">
            <span style="font-weight:700; font-size:13px; color:#1e293b;">SOAL NOMOR 2</span>
            <div><span class="q-pill q-pill-mcma">TIPE: MCMA (PILIHAN KOMPLEKS AKM)</span> <span style="font-size:11px; font-weight:700; color:#64748b;">Bobot: 3 Poin</span></div>
          </div>
          <div class="q-text">
            Perhatikan fungsi persamaan kuadrat gerak benda berikut: <span class="latex-code">$h(t) = -5t^2 + 20t + 25$</span>. Manakah di antara pernyataan berikut yang benar? <i>(Pilih semua yang benar)</i>
          </div>
          <div class="opt-list">
            [X] A. Ketinggian mula-mula benda adalah 25 meter <span style="color:#15803d; font-weight:700;">[KUNCI]</span><br/>
            [ ] B. Benda mencapai titik tertinggi pada saat t = 4 sekon<br/>
            [X] C. Waktu yang diperlukan untuk mencapai tinggi maksimum adalah 2 sekon <span style="color:#15803d; font-weight:700;">[KUNCI]</span><br/>
            [X] D. Tinggi maksimum yang dicapai benda adalah 45 meter <span style="color:#15803d; font-weight:700;">[KUNCI]</span>
          </div>
          <div class="kunci-row">
            <span>Kunci Impor Delimiter: <span class="kunci-badge">A,C,D</span></span>
            <span style="color:#64748b; font-size:11px;">Mekanisme: Skoring Proporsional Kotak Centang</span>
          </div>
        </div>

        <!-- Butir 3 PGK Matriks -->
        <div class="question-card">
          <div class="q-header">
            <span style="font-weight:700; font-size:13px; color:#1e293b;">SOAL NOMOR 3</span>
            <div><span class="q-pill q-pill-pgk">TIPE: PGK (BENAR / SALAH MATRIKS)</span> <span style="font-size:11px; font-weight:700; color:#64748b;">Bobot: 3 Poin</span></div>
          </div>
          <div class="q-text">
            Stimulus: Pemerintah menargetkan bauran Energi Baru Terbarukan (EBT) nasional mencapai 23% pada tahun 2025 melalui akselerasi PLTS Atap dan Biofuel.<br/>
            Tentukan status kebenaran dari setiap pernyataan berikut:
          </div>
          <div class="opt-list">
            • Pernyataan 1: Target bauran EBT sebesar 23% ditargetkan tercapai tahun 2025 -> <b>[BENAR]</b><br/>
            • Pernyataan 2: Biofuel tidak termasuk pilar EBT nasional -> <b>[SALAH]</b><br/>
            • Pernyataan 3: PLTS Atap merupakan tumpuan utama peningkatan EBT -> <b>[BENAR]</b>
          </div>
          <div class="kunci-row">
            <span>Kunci Impor Delimiter: <span class="kunci-badge">B;S;B</span></span>
            <span style="color:#64748b; font-size:11px;">Mekanisme: Penilaian Biner per Baris Pernyataan</span>
          </div>
        </div>

        <!-- Butir 4 ESSAY AI -->
        <div class="question-card">
          <div class="q-header">
            <span style="font-weight:700; font-size:13px; color:#1e293b;">SOAL NOMOR 4</span>
            <div><span class="q-pill q-pill-essay">TIPE: ESSAY (KOREKSI SEMANTIK AI)</span> <span style="font-size:11px; font-weight:700; color:#64748b;">Bobot: 5 Poin</span></div>
          </div>
          <div class="q-text">Jelaskan dampak deforestasi hutan lindung di hulu DAS terhadap siklus hidrologi dan risiko bencana di kawasan hilir!</div>
          <div style="font-size:12.5px; background:#f0fdf4; border:1px solid #bbf7d0; padding:8px 12px; border-radius:4px; margin-bottom:8px;">
            <b>Rubrik Kata Kunci AI:</b> <span style="color:#047857; font-family:monospace;">infiltrasi air berkurang | limpasan permukaan tinggi | banjir bandang hilir | erosi tanah | kekeringan kemarau</span>
          </div>
          <div class="kunci-row">
            <span>Kunci Acuan: Infiltrasi air turun, limpasan permukaan naik memicu banjir dan kekeringan sumur.</span>
            <span style="color:#059669; font-weight:700; font-size:11px;">Otoritas Guru: Human-in-the-Loop Veto</span>
          </div>
        </div>

      </div>
    </div>
  </body>
  </html>
  `;

  const tempPath = path.resolve('temp_word_preview.html');
  fs.writeFileSync(tempPath, htmlWord);
  await page.goto('file:///' + tempPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const previewAssetPath = path.resolve('assets/template_soal_word_doc_preview.png');
  await page.locator('.word-window').screenshot({ path: previewAssetPath });
  console.log('Screenshot Word .docx berhasil dibuat di:', previewAssetPath);

  try { fs.unlinkSync(tempPath); } catch (e) {}

  await browser.close();
}

renderDocxPreviewScreenshot();
