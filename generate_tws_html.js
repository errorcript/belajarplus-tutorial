const fs = require('fs');

const audit = JSON.parse(fs.readFileSync('tws_audit_results.json', 'utf8'));
const extra = JSON.parse(fs.readFileSync('tws_extra_login_results.json', 'utf8'));

// Gabungkan dan petakan data untuk visualisasi HTML
const totalDrive = audit.totalDriveTeachers;
const totalLive = audit.totalLivePlatformStaff;
const successCount = audit.successLogins;
const failedCount = audit.failedLogins;
const inPlatformCount = audit.inPlatformCount;
const notInPlatformCount = audit.notInPlatformCount;

const rowsHtml = audit.results.map((r, i) => {
  const isSuccess = r.loginStatus === 'SUCCESS';
  const loginBadge = isSuccess
    ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">✅ BISA LOGIN</span>`
    : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">❌ GAGAL</span>`;

  const platformBadge = r.inPlatform
    ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Aktif di Platform</span>`
    : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Belum Ada di Platform</span>`;

  const category = isSuccess ? 'success' : (r.inPlatform ? 'failed-in-platform' : 'not-in-platform');

  return `
    <tr class="hover:bg-slate-50 transition border-b border-slate-200 text-sm teacher-row" data-cat="${category}" data-search="${r.name.toLowerCase()} ${r.email.toLowerCase()}">
      <td class="p-3 text-slate-500 font-mono text-center">${r.no}</td>
      <td class="p-3">
        <div class="font-bold text-slate-800">${r.name}</div>
        <div class="text-xs text-slate-500 font-mono">${r.email}</div>
      </td>
      <td class="p-3 font-mono text-xs text-slate-700 bg-slate-50 rounded">
        <code>${r.password || '-'}</code>
      </td>
      <td class="p-3 text-center">${platformBadge}</td>
      <td class="p-3 text-center">${loginBadge}</td>
      <td class="p-3 text-xs text-slate-600 max-w-xs break-words">${r.loginMessage}</td>
    </tr>
  `;
}).join('\n');

const extraRowsHtml = extra.map((e, idx) => {
  return `
    <tr class="hover:bg-slate-50 transition border-b border-slate-200 text-sm">
      <td class="p-3 text-slate-500 font-mono text-center">${idx + 1}</td>
      <td class="p-3 font-semibold text-slate-800">${e.name}</td>
      <td class="p-3 font-mono text-xs text-slate-600">${e.email}</td>
      <td class="p-3 text-center"><span class="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800 font-medium">Terdaftar di Platform</span></td>
      <td class="p-3 text-center"><span class="px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-800 font-bold">❌ ${e.status}</span></td>
      <td class="p-3 text-xs text-slate-500">Akun domain @belajarplus.com (dibuat langsung di platform)</td>
    </tr>
  `;
}).join('\n');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Audit Akun PTK - SMAN 1 Tawangsari</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body class="bg-slate-100 text-slate-900 min-h-screen pb-16">
  
  <!-- Header Bar -->
  <header class="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-md sticky top-0 z-30 px-4 py-3 sm:px-6">
    <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
      <div>
        <div class="flex items-center gap-2">
          <span class="bg-amber-400 text-blue-950 text-xs font-black uppercase px-2 py-0.5 rounded shadow-sm">Audit Live</span>
          <h1 class="text-lg sm:text-xl font-bold tracking-tight">SMAN 1 TAWANGSARI</h1>
        </div>
        <p class="text-xs text-blue-200 mt-0.5">Pemeriksaan Akun PTK di Google Drive vs Live Platform BelajarPlus</p>
      </div>
      <div class="text-right text-xs text-blue-200">
        <div>Update: <span class="font-semibold text-white">${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</span></div>
        <div class="text-[11px] text-blue-300">ID: a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21</div>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-3 sm:px-6 mt-5 space-y-5">

    <!-- KPI Summary Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div class="text-xs font-semibold text-slate-500 uppercase">Total di Drive</div>
        <div class="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">${totalDrive} <span class="text-xs font-normal text-slate-500">Guru</span></div>
        <div class="text-[11px] text-slate-400 mt-1">Berkas resmi master excel</div>
      </div>

      <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div class="text-xs font-semibold text-blue-600 uppercase">Live di Platform</div>
        <div class="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">${totalLive} <span class="text-xs font-normal text-slate-500">PTK</span></div>
        <div class="text-[11px] text-blue-500 mt-1">${inPlatformCount} dari Drive + 14 akun internal</div>
      </div>

      <div class="bg-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-200 flex flex-col justify-between">
        <div class="text-xs font-semibold text-emerald-700 uppercase flex items-center gap-1">
          <span>✅ BISA LOGIN</span>
        </div>
        <div class="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">${successCount} <span class="text-xs font-normal text-emerald-600">Akun</span></div>
        <div class="text-[11px] text-emerald-600 mt-1">Password drive match 100%</div>
      </div>

      <div class="bg-rose-50 rounded-xl p-4 shadow-sm border border-rose-200 flex flex-col justify-between">
        <div class="text-xs font-semibold text-rose-700 uppercase flex items-center gap-1">
          <span>❌ GAGAL LOGIN</span>
        </div>
        <div class="text-2xl sm:text-3xl font-extrabold text-rose-800 mt-1">${failedCount} <span class="text-xs font-normal text-rose-600">Akun</span></div>
        <div class="text-[11px] text-rose-600 mt-1">${notInPlatformCount} belum ada + 6 pass beda</div>
      </div>
    </div>

    <!-- Analisa Ringkas -->
    <div class="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200">
      <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 mb-2">
        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Temuan Penting Audit SMAN 1 Tawangsari
      </h2>
      <ul class="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc list-inside">
        <li><strong>35 Guru Sukses Login:</strong> Menggunakan email dan password persis yang tertera di berkas master Drive (<code>Sman1taw_xxxx</code>). Akun ini sudah aktif dan siap dipakai.</li>
        <li><strong>6 Akun Sudah di Platform tapi Gagal Login:</strong> Yaitu <em>Devita Aprilia Wijaya, Hartadi, SuKOSIH CAHYANI, Sumarwan, Suyadi,</em> dan <em>Wahidah Estiningrum</em>. Akun mereka sudah terdaftar di platform, namun password di database platform sudah diubah/berbeda dari password di excel drive.</li>
        <li><strong>33 Akun Belum Ada di Platform:</strong> Termasuk guru no 42 s/d 74 (seperti <em>Wiwin Setyowati, Yoga Prasetyo, Yuni Setyaningsih</em>, dll serta akun cadangan). Akun-akun ini belum pernah diimpor/dibuatkan di auth Supabase.</li>
        <li><strong>14 Akun Pengganti Internal (@belajarplus.com):</strong> Di platform terdapat 14 guru yang didaftarkan dengan email domain <code>@belajarplus.com</code> (bukan email asli google/belajar.id di drive).</li>
      </ul>
    </div>

    <!-- Filter & Search Controls -->
    <div class="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div class="flex-1 relative">
        <input type="text" id="searchInput" placeholder="Cari nama guru atau email..." class="w-full text-sm pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
      <div class="flex flex-wrap gap-1.5 text-xs font-semibold">
        <button onclick="filterCategory('all')" id="btn-all" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-800 text-white">Semua (${totalDrive})</button>
        <button onclick="filterCategory('success')" id="btn-success" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-emerald-700 hover:bg-emerald-50">Bisa Login (${successCount})</button>
        <button onclick="filterCategory('failed-in-platform')" id="btn-failed-in-platform" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-rose-700 hover:bg-rose-50">Gagal (Ada di Platform) (6)</button>
        <button onclick="filterCategory('not-in-platform')" id="btn-not-in-platform" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-amber-700 hover:bg-amber-50">Belum di Platform (${notInPlatformCount})</button>
      </div>
    </div>

    <!-- Tabel Data Guru 74 Akun Drive -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-700 flex items-center justify-between">
        <span>Daftar 74 Akun Guru di Drive (Hasil Uji Login 1-per-1)</span>
        <span class="text-xs font-normal text-slate-500" id="rowCount">Menampilkan ${totalDrive} data</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
              <th class="p-3 text-center w-12">No</th>
              <th class="p-3">Nama Lengkap & Email</th>
              <th class="p-3">Password Master</th>
              <th class="p-3 text-center">Status Platform</th>
              <th class="p-3 text-center">Hasil Login</th>
              <th class="p-3">Keterangan / Pesan Respon</th>
            </tr>
          </thead>
          <tbody id="teacherTableBody">
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabel 14 Akun @belajarplus.com di Platform -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-700">
        Daftar 14 Akun Guru Tambahan di Platform (Domain @belajarplus.com)
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
              <th class="p-3 text-center w-12">No</th>
              <th class="p-3">Nama di Platform</th>
              <th class="p-3">Email @belajarplus.com</th>
              <th class="p-3 text-center">Status Platform</th>
              <th class="p-3 text-center">Hasil Login</th>
              <th class="p-3">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${extraRowsHtml}
          </tbody>
        </table>
      </div>
    </div>

  </main>

  <script>
    let currentCategory = 'all';

    function filterCategory(cat) {
      currentCategory = cat;
      // update button styles
      ['all', 'success', 'failed-in-platform', 'not-in-platform'].forEach(c => {
        const btn = document.getElementById('btn-' + c);
        if (c === cat) {
          btn.className = 'px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-800 text-white font-bold';
        } else {
          btn.className = 'px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold';
        }
      });
      applyFilters();
    }

    function applyFilters() {
      const q = document.getElementById('searchInput').value.toLowerCase().trim();
      const rows = document.querySelectorAll('.teacher-row');
      let visible = 0;

      rows.forEach(r => {
        const cat = r.getAttribute('data-cat');
        const search = r.getAttribute('data-search');
        
        const matchCat = (currentCategory === 'all') || (cat === currentCategory);
        const matchSearch = !q || search.includes(q);

        if (matchCat && matchSearch) {
          r.style.display = '';
          visible++;
        } else {
          r.style.display = 'none';
        }
      });

      document.getElementById('rowCount').innerText = 'Menampilkan ' + visible + ' data';
    }

    document.getElementById('searchInput').addEventListener('input', applyFilters);
  </script>
</body>
</html>`;

fs.writeFileSync('tws.html', htmlContent);
console.log('Successfully generated tws.html!');
