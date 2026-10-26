const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderTemplateScreenshots() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1920,1080'] });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  // 1. HTML untuk Sheet 1: BANK_SOAL_TEMPLATE
  const htmlBankSoal = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
      body { background: #f1f5f9; padding: 24px; color: #1e293b; }
      .excel-window { background: #ffffff; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); overflow: hidden; border: 1px solid #cbd5e1; }
      .excel-ribbon { background: #107c41; color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
      .excel-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
      .excel-badge { background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
      .sheet-tabs { background: #f8fafc; padding: 8px 16px; border-bottom: 2px solid #e2e8f0; display: flex; gap: 8px; font-size: 13px; font-weight: 600; }
      .tab { padding: 6px 16px; border-radius: 4px 4px 0 0; cursor: pointer; color: #64748b; }
      .tab.active { background: #ffffff; color: #107c41; border: 1px solid #e2e8f0; border-bottom: 2px solid #107c41; font-weight: 700; }
      .formula-bar { background: #f8fafc; padding: 8px 16px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px; font-size: 13px; }
      .name-box { background: white; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 3px; font-weight: 700; color: #334155; }
      .fx-icon { font-style: italic; font-weight: 900; color: #94a3b8; }
      .formula-input { color: #1e293b; font-family: 'Consolas', monospace; }
      .table-wrapper { overflow-x: auto; max-height: 800px; }
      table { border-collapse: collapse; width: 100%; font-size: 12px; }
      th, td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; vertical-align: top; }
      th { background: #f1f5f9; font-weight: 700; color: #475569; position: sticky; top: 0; z-index: 10; text-transform: uppercase; font-size: 11px; letter-spacing: 0.03em; }
      th.col-header { background: #e2e8f0; text-align: center; color: #64748b; font-weight: 800; padding: 6px; }
      tr.row-header th { background: #e2e8f0; width: 36px; text-align: center; color: #64748b; }
      .row-num { background: #f8fafc; text-align: center; font-weight: 700; color: #64748b; width: 36px; }
      tr:nth-child(even) td { background: #fdfdfd; }
      tr:hover td { background: #f0fdf4; }
      .pill { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
      .pill-mcq { background: #dbeafe; color: #1d4ed8; }
      .pill-mcma { background: #fef3c7; color: #b45309; }
      .pill-pgk { background: #e0e7ff; color: #4338ca; }
      .pill-match { background: #fce7f3; color: #be185d; }
      .pill-essay { background: #dcfce7; color: #15803d; }
      .pill-upload { background: #ffedd5; color: #c2410c; }
      .key-badge { background: #1e293b; color: #38bdf8; padding: 2px 8px; border-radius: 4px; font-family: 'Consolas', monospace; font-weight: 700; }
      .score-badge { background: #ecfdf5; color: #047857; font-weight: 800; text-align: center; padding: 3px 8px; border-radius: 4px; border: 1px solid #a7f3d0; }
      .code-text { font-family: 'Consolas', monospace; color: #0f172a; font-size: 11.5px; }
    </style>
  </head>
  <body>
    <div class="excel-window">
      <div class="excel-ribbon">
        <div class="excel-title">
          <span>📊 Excel Master Template: template_pembuatan_soal_guru_belajarplus.xlsx</span>
          <span class="excel-badge">Resmi BelajarPlus CBT / LJD 2026</span>
        </div>
        <div style="font-size: 12px; opacity: 0.9;">Format: Microsoft Excel (.xlsx)</div>
      </div>

      <div class="formula-bar">
        <div class="name-box">A1:N11</div>
        <span class="fx-icon">fx</span>
        <div class="formula-input">Table: BANK_SOAL_TEMPLATE (14 Kolom Standar Import Sistem CBT BelajarPlus)</div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-header">#</th>
              <th>nomor_soal</th>
              <th>tipe_soal</th>
              <th>capaian_pembelajaran</th>
              <th>stimulus_teks</th>
              <th>stimulus_media</th>
              <th>pertanyaan</th>
              <th>opsi_a</th>
              <th>opsi_b</th>
              <th>opsi_c</th>
              <th>opsi_d</th>
              <th>opsi_e</th>
              <th>kunci_jawaban</th>
              <th>bobot_skor</th>
              <th>rubrik_atau_pembahasan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="row-num">1</td>
              <td style="text-align:center; font-weight:bold;">1</td>
              <td><span class="pill pill-mcq">MCQ</span></td>
              <td>Biologi Sel</td>
              <td style="color:#94a3b8; font-style:italic;">[Kosong]</td>
              <td style="color:#94a3b8; font-style:italic;">[Kosong]</td>
              <td>Organel sel yang berperan sebagai tempat respirasi seluler untuk menghasilkan energi (ATP) adalah...</td>
              <td>Ribosom</td>
              <td>Mitokondria</td>
              <td>Badan Golgi</td>
              <td>Retikulum Endoplasma</td>
              <td>Lisosom</td>
              <td><span class="key-badge">B</span></td>
              <td><span class="score-badge">1</span></td>
              <td>Mitokondria adalah powerhouse of cell penghasil ATP.</td>
            </tr>
            <tr>
              <td class="row-num">2</td>
              <td style="text-align:center; font-weight:bold;">2</td>
              <td><span class="pill pill-mcq">MCQ</span></td>
              <td>Literasi Indonesia</td>
              <td>Kementerian Lingkungan Hidup mencatat timbulan sampah plastik mencapai 19% nasional...</td>
              <td style="color:#94a3b8; font-style:italic;">[Kosong]</td>
              <td>Gagasan pokok wacana di atas adalah...</td>
              <td>Kenaikan produksi plastik</td>
              <td>Peningkatan jumlah sampah plastik & solusinya</td>
              <td>Kegagalan proyek percontohan</td>
              <td>Larangan botol air mineral</td>
              <td>Penurunan konsumsi pasar</td>
              <td><span class="key-badge">B</span></td>
              <td><span class="score-badge">1</span></td>
              <td>Gagasan utama mencakup data timbulan dan solusi daur ulang.</td>
            </tr>
            <tr>
              <td class="row-num">3</td>
              <td style="text-align:center; font-weight:bold;">3</td>
              <td><span class="pill pill-mcma">MCMA</span></td>
              <td>Perubahan Fisika-Kimia</td>
              <td style="color:#94a3b8; font-style:italic;">[Kosong]</td>
              <td style="color:#94a3b8; font-style:italic;">[Kosong]</td>
              <td>Manakah yang merupakan perubahan fisika? (Pilih semua yang benar)</td>
              <td>Es batu mencair</td>
              <td>Besi berkarat</td>
              <td>Gula larut dalam teh</td>
              <td>Kertas dibakar abu</td>
              <td>Lilin meleleh</td>
              <td><span class="key-badge">A,C,E</span></td>
              <td><span class="score-badge">3</span></td>
              <td>Perubahan fisika tidak membentuk zat baru: A, C, dan E.</td>
            </tr>
            <tr>
              <td class="row-num">4</td>
              <td style="text-align:center; font-weight:bold;">4</td>
              <td><span class="pill pill-pgk">PGK</span></td>
              <td>Energi Terbarukan</td>
              <td>Pemerintah menargetkan bauran EBT mencapai 23% pada 2025 melalui PLTS Atap dan Biofuel...</td>
              <td style="color:#94a3b8; font-style:italic;">[Kosong]</td>
              <td>Tentukan status kebenaran dari setiap pernyataan berikut:</td>
              <td class="code-text" style="color:#1d4ed8;">Target EBT 23% di 2025; Biofuel bukan pilar EBT; PLTS Atap pilar utama</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td><span class="key-badge">B;S;B</span></td>
              <td><span class="score-badge">3</span></td>
              <td>Pernyataan 1: B (Benar); Pernyataan 2: S (Salah); Pernyataan 3: B (Benar).</td>
            </tr>
            <tr>
              <td class="row-num">5</td>
              <td style="text-align:center; font-weight:bold;">5</td>
              <td><span class="pill pill-match">MATCH</span></td>
              <td>Termodinamika Fisika</td>
              <td style="color:#94a3b8; font-style:italic;">[Kosong]</td>
              <td style="color:#94a3b8; font-style:italic;">[Kosong]</td>
              <td>Pasangkan proses termodinamika dengan kondisi fisisnya:</td>
              <td class="code-text">1. Isokhorik; 2. Isobarik; 3. Isotermik; 4. Adiabatik</td>
              <td class="code-text">A. Tekanan tetap; B. Volume tetap; C. Q=0; D. Suhu tetap</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td><span class="key-badge">1-B;2-A;3-D;4-C</span></td>
              <td><span class="score-badge">4</span></td>
              <td>Isokhorik = V konstan; Isobarik = P konstan; Isotermik = T konstan; Adiabatik = Q=0.</td>
            </tr>
            <tr>
              <td class="row-num">6</td>
              <td style="text-align:center; font-weight:bold;">6</td>
              <td><span class="pill pill-essay">ESSAY</span></td>
              <td>Ekologi & Siklus Air</td>
              <td>Alih fungsi hutan lindung di kawasan hulu DAS meningkat pesat 5 tahun terakhir...</td>
              <td style="color:#94a3b8; font-style:italic;">[Kosong]</td>
              <td>Jelaskan dampak deforestasi hulu terhadap siklus hidrologi dan risiko bencana hilir!</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="font-size:11px;">Infiltrasi air berkurang, limpasan permukaan tinggi, banjir di hilir.</td>
              <td><span class="score-badge">5</span></td>
              <td style="color:#059669; font-weight:600; font-size:11px;">infiltrasi berkurang | limpasan permukaan tinggi | banjir bandang hilir | kekeringan kemarau</td>
            </tr>
            <tr>
              <td class="row-num">7</td>
              <td style="text-align:center; font-weight:bold;">7</td>
              <td><span class="pill pill-upload">UPLOAD</span></td>
              <td>Praktikum Titrasi</td>
              <td>Percobaan titrasi asam asetat dengan larutan NaOH standar...</td>
              <td style="color:#94a3b8; font-style:italic;">[Kosong]</td>
              <td>Unggah laporan akhir praktikum lengkap grafik pH & tanda tangan! (PDF/Word &le; 10MB)</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="color:#94a3b8;">-</td>
              <td style="font-size:11px; font-weight:bold; color:#d97706;">[Manual Grading]</td>
              <td><span class="score-badge">10</span></td>
              <td style="font-size:11px;">Kelengkapan Prosedur (20%), Perhitungan (30%), Kurva Titrasi (30%), Tanda Tangan (20%).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="sheet-tabs">
        <div class="tab">PETUNJUK_FORMAT</div>
        <div class="tab active">BANK_SOAL_TEMPLATE</div>
      </div>
    </div>
  </body>
  </html>
  `;

  // Simpan temp html dan render
  const tempPath = path.resolve('temp_bank_soal_preview.html');
  fs.writeFileSync(tempPath, htmlBankSoal);
  await page.goto('file:///' + tempPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const previewAssetPath = path.resolve('assets/template_soal_excel_preview.png');
  await page.locator('.excel-window').screenshot({ path: previewAssetPath });
  console.log('Screenshot 1 berhasil dibuat di:', previewAssetPath);

  // 2. HTML untuk Sheet 2: PETUNJUK_FORMAT (Sintaks LaTeX & Aturan Delimiter)
  const htmlPetunjuk = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
      body { background: #f1f5f9; padding: 24px; color: #1e293b; }
      .excel-window { background: #ffffff; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); overflow: hidden; border: 1px solid #cbd5e1; }
      .excel-ribbon { background: #107c41; color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
      .excel-title { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
      .excel-badge { background: rgba(255,255,255,0.2); padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
      .sheet-tabs { background: #f8fafc; padding: 8px 16px; border-bottom: 2px solid #e2e8f0; display: flex; gap: 8px; font-size: 13px; font-weight: 600; }
      .tab { padding: 6px 16px; border-radius: 4px 4px 0 0; cursor: pointer; color: #64748b; }
      .tab.active { background: #ffffff; color: #107c41; border: 1px solid #e2e8f0; border-bottom: 2px solid #107c41; font-weight: 700; }
      .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 24px; }
      .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; }
      .card-title { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
      .code-table { width: 100%; border-collapse: collapse; font-size: 12px; }
      .code-table th, .code-table td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
      .code-table th { background: #e2e8f0; font-weight: 700; color: #334155; }
      .code-snippet { font-family: 'Consolas', monospace; background: #e2e8f0; color: #0f172a; padding: 2px 6px; border-radius: 3px; font-size: 11.5px; }
      .rule-item { margin-bottom: 10px; font-size: 12.5px; line-height: 1.5; color: #334155; }
      .rule-item strong { color: #0f172a; }
      .badge-ok { background: #dcfce7; color: #15803d; font-weight: 700; padding: 2px 6px; border-radius: 3px; font-size: 11px; }
    </style>
  </head>
  <body>
    <div class="excel-window">
      <div class="excel-ribbon">
        <div class="excel-title">
          <span>📋 Sheet Petunjuk: PETUNJUK_FORMAT (Aturan Sintaksis & LaTeX)</span>
          <span class="excel-badge">Panduan Format Baku BelajarPlus</span>
        </div>
        <div style="font-size: 12px; opacity: 0.9;">Sheet 1 / 2</div>
      </div>

      <div class="content-grid">
        <!-- Kolom Kiri: Aturan Delimiter Kunci Jawaban -->
        <div class="card">
          <div class="card-title">🎯 Aturan Karakter Pemisah Kunci Jawaban</div>
          <table class="code-table">
            <thead>
              <tr>
                <th>Tipe Soal</th>
                <th>Karakter Pemisah</th>
                <th>Contoh Penulisan Kunci</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>MCQ (Pilihan Ganda)</strong></td>
                <td>Tanpa pemisah</td>
                <td><span class="code-snippet">A</span> atau <span class="code-snippet">C</span></td>
              </tr>
              <tr>
                <td><strong>MCMA (Multi-Pilihan)</strong></td>
                <td>Koma murni <span class="code-snippet">,</span></td>
                <td><span class="code-snippet">A,C,E</span></td>
              </tr>
              <tr>
                <td><strong>PGK (Benar/Salah)</strong></td>
                <td>Titik koma <span class="code-snippet">;</span></td>
                <td><span class="code-snippet">B;S;B</span></td>
              </tr>
              <tr>
                <td><strong>MATCH (Menjodohkan)</strong></td>
                <td>Tanda hubung & titik koma</td>
                <td><span class="code-snippet">1-B;2-A;3-D;4-C</span></td>
              </tr>
              <tr>
                <td><strong>ESSAY (Koreksi AI)</strong></td>
                <td>Garis tegak <span class="code-snippet">|</span> (di rubrik)</td>
                <td><span class="code-snippet">klorofil | glukosa | ATP</span></td>
              </tr>
              <tr>
                <td><strong>UPLOAD (Berkas)</strong></td>
                <td>Teks khusus</td>
                <td><span class="code-snippet">[Manual Grading]</span></td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 16px;">
            <div class="card-title">⚠️ Aturan Integritas Data</div>
            <div class="rule-item">1. <strong>Bobot Skor Wajib Bilangan Bulat:</strong> Gunakan integer (1, 2, 3, 5, 10). Dilarang memasukkan desimal pecahan ganjil (seperti 0.33) agar tidak memicu deviasi pembulatan.</div>
            <div class="rule-item">2. <strong>Batas Ukuran Media Gambar:</strong> Gambar stimulus maksimal 2 MB format PNG/JPG.</div>
            <div class="rule-item">3. <strong>Batas Berkas Tugas Siswa:</strong> Pengunggahan tugas siswa (UPLOAD) maksimal 10 MB.</div>
          </div>
        </div>

        <!-- Kolom Kanan: Panduan Rumus LaTeX Matematika & Sains -->
        <div class="card">
          <div class="card-title">📐 Panduan Rumus Matematika & Sains (LaTeX)</div>
          <table class="code-table">
            <thead>
              <tr>
                <th>Formula</th>
                <th>Sintaks LaTeX di Template Excel</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Pecahan Aljabar</strong></td>
                <td><span class="code-snippet">$f(x) = \\frac{2x^2 + 5x}{x - 3}$</span></td>
                <td><span class="badge-ok">DIDUKUNG</span></td>
              </tr>
              <tr>
                <td><strong>Akar & Kuadrat</strong></td>
                <td><span class="code-snippet">$\\sqrt{x^2 + y^2} = r$</span></td>
                <td><span class="badge-ok">DIDUKUNG</span></td>
              </tr>
              <tr>
                <td><strong>Pangkat / Eksponen</strong></td>
                <td><span class="code-snippet">$E = m \\cdot c^2$</span></td>
                <td><span class="badge-ok">DIDUKUNG</span></td>
              </tr>
              <tr>
                <td><strong>Reaksi Kimia</strong></td>
                <td><span class="code-snippet">$\\text{2H}_2 + \\text{O}_2 \\rightarrow \\text{2H}_2\\text{O}$</span></td>
                <td><span class="badge-ok">DIDUKUNG</span></td>
              </tr>
              <tr>
                <td><strong>Kalkulus (Limit/Integral)</strong></td>
                <td><span class="code-snippet">$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$</span></td>
                <td><span class="badge-ok">DIDUKUNG</span></td>
              </tr>
              <tr>
                <td><strong>Derajat & Sudut</strong></td>
                <td><span class="code-snippet">$\\theta = 45^\\circ$</span></td>
                <td><span class="badge-ok">DIDUKUNG</span></td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px; font-size: 12px; color: #1e40af;">
            💡 <strong>Tips Guru:</strong> Selalu apit rumus dengan tanda dollar <span class="code-snippet">$...$</span> agar sistem CBT BelajarPlus otomatis memformat rumus menjadi notasi matematis cantik saat siswa mengerjakan ujian.
          </div>
        </div>
      </div>

      <div class="sheet-tabs">
        <div class="tab active">PETUNJUK_FORMAT</div>
        <div class="tab">BANK_SOAL_TEMPLATE</div>
      </div>
    </div>
  </body>
  </html>
  `;

  const tempPath2 = path.resolve('temp_petunjuk_preview.html');
  fs.writeFileSync(tempPath2, htmlPetunjuk);
  await page.goto('file:///' + tempPath2.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const petunjukAssetPath = path.resolve('assets/template_soal_petunjuk_preview.png');
  await page.locator('.excel-window').screenshot({ path: petunjukAssetPath });
  console.log('Screenshot 2 berhasil dibuat di:', petunjukAssetPath);

  // Hapus temp files
  try { fs.unlinkSync(tempPath); fs.unlinkSync(tempPath2); } catch (e) {}

  await browser.close();
}

renderTemplateScreenshots();
