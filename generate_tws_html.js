const fs = require('fs');

const audit = JSON.parse(fs.readFileSync('tws_audit_results.json', 'utf8'));
const extra = JSON.parse(fs.readFileSync('tws_extra_login_results.json', 'utf8'));
const comparison = JSON.parse(fs.readFileSync('tws_student_rombel_comparison.json', 'utf8'));
const unplaced = JSON.parse(fs.readFileSync('tws_unplaced_students.json', 'utf8'));

// 1. DATA PTK
const totalDrive = audit.totalDriveTeachers;
const totalLive = audit.totalLivePlatformStaff;
const successCount = audit.successLogins;
const failedCount = audit.failedLogins;
const inPlatformCount = audit.inPlatformCount;
const notInPlatformCount = audit.notInPlatformCount;

const teacherRowsHtml = audit.results.map((r) => {
  const isSuccess = r.loginStatus === 'SUCCESS';
  const loginBadge = isSuccess
    ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">✅ BISA LOGIN</span>`
    : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">❌ GAGAL</span>`;

  const platformBadge = r.inPlatform
    ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800">Aktif di Platform</span>`
    : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800">Belum Ada</span>`;

  const category = isSuccess ? 'success' : (r.inPlatform ? 'failed-in-platform' : 'not-in-platform');

  return `
    <tr class="hover:bg-slate-50 transition border-b border-slate-200 text-xs sm:text-sm teacher-row" data-cat="${category}" data-search="${r.name.toLowerCase()} ${r.email.toLowerCase()}">
      <td class="p-2.5 sm:p-3 text-slate-500 font-mono text-center">${r.no}</td>
      <td class="p-2.5 sm:p-3">
        <div class="font-bold text-slate-800">${r.name}</div>
        <div class="text-[11px] text-slate-500 font-mono break-all">${r.email}</div>
      </td>
      <td class="p-2.5 sm:p-3 font-mono text-[11px] text-slate-700 bg-slate-50 rounded">
        <code>${r.password || '-'}</code>
      </td>
      <td class="p-2.5 sm:p-3 text-center">${platformBadge}</td>
      <td class="p-2.5 sm:p-3 text-center">${loginBadge}</td>
      <td class="p-2.5 sm:p-3 text-[11px] text-slate-600 max-w-xs break-words">${r.loginMessage}</td>
    </tr>
  `;
}).join('\n');

const extraRowsHtml = extra.map((e, idx) => `
  <tr class="hover:bg-slate-50 transition border-b border-slate-200 text-xs sm:text-sm">
    <td class="p-2.5 sm:p-3 text-slate-500 font-mono text-center">${idx + 1}</td>
    <td class="p-2.5 sm:p-3 font-semibold text-slate-800">${e.name}</td>
    <td class="p-2.5 sm:p-3 font-mono text-[11px] text-slate-600 break-all">${e.email}</td>
    <td class="p-2.5 sm:p-3 text-center"><span class="px-2 py-0.5 text-[11px] rounded bg-blue-100 text-blue-800 font-medium">Aktif</span></td>
    <td class="p-2.5 sm:p-3 text-center"><span class="px-2 py-0.5 text-[11px] rounded bg-amber-100 text-amber-800 font-bold">❌ ${e.status}</span></td>
    <td class="p-2.5 sm:p-3 text-[11px] text-slate-500">Akun domain @belajarplus.com (internal sekolah)</td>
  </tr>
`).join('\n');

// 2. DATA SISWA & ROMBEL TERBARU
const missingStudentsHtml = comparison.missingInPlatformList.map((s, idx) => `
  <tr class="hover:bg-slate-50 transition border-b border-slate-200 text-xs sm:text-sm student-missing-row" data-search="${s.A.toLowerCase()} ${s.B.toLowerCase()} ${s.D.toLowerCase()}">
    <td class="p-2.5 sm:p-3 text-slate-500 font-mono text-center">${idx + 1}</td>
    <td class="p-2.5 sm:p-3 font-bold text-slate-800">${s.A}</td>
    <td class="p-2.5 sm:p-3 font-mono text-[11px] text-slate-600 break-all">${s.B}</td>
    <td class="p-2.5 sm:p-3 font-mono text-[11px] text-slate-700 bg-slate-50"><code>${s.C}</code></td>
    <td class="p-2.5 sm:p-3 text-center"><span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">${s.D}</span></td>
    <td class="p-2.5 sm:p-3 text-center"><span class="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">Belum Ada di Platform</span></td>
  </tr>
`).join('\n');

// Distribusi Rombel Drive
const rombelList = Object.entries(comparison.driveRombelCounts).sort((a, b) => a[0].localeCompare(b[0]));
const rombelCardsHtml = rombelList.map(([rombel, count]) => {
  const isK11_1 = rombel === 'Kelas 11-1';
  const badge = isK11_1 
    ? `<span class="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">36 Siswa Belum Masuk</span>` 
    : `<span class="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-semibold">Tersinkron</span>`;

  return `
    <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
      <div>
        <div class="font-bold text-xs text-slate-800">${rombel}</div>
        <div class="text-[11px] text-slate-500">${count} siswa</div>
      </div>
      <div>${badge}</div>
    </div>
  `;
}).join('\n');

// Unplaced Students
const unplacedHtml = unplaced.map((u, i) => `
  <tr class="hover:bg-slate-50 border-b border-slate-200 text-xs sm:text-sm">
    <td class="p-2 text-center text-slate-500 font-mono">${i + 1}</td>
    <td class="p-2 font-semibold text-slate-800">${u.name}</td>
    <td class="p-2 font-mono text-[11px] text-slate-600 break-all">${u.email}</td>
    <td class="p-2 text-center"><span class="px-2 py-0.5 rounded text-[11px] font-bold ${u.status === 'suspended' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}">${u.status}</span></td>
    <td class="p-2 text-xs text-slate-500">${u.status === 'suspended' ? 'Akun Ditangguhkan (bukan siswa aktif)' : 'Akun pengujian trainer'}</td>
  </tr>
`).join('\n');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Laporan Audit SMAN 1 Tawangsari - BelajarPlus</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .tab-active { border-bottom: 3px solid #2563eb; color: #1d4ed8; font-weight: 700; }
  </style>
</head>
<body class="bg-slate-100 text-slate-900 min-h-screen pb-20">
  
  <!-- Header Bar -->
  <header class="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-md sticky top-0 z-30 px-4 py-3 sm:px-6">
    <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
      <div>
        <div class="flex items-center gap-2">
          <span class="bg-amber-400 text-blue-950 text-[11px] font-black uppercase px-2 py-0.5 rounded shadow-sm">Audit Live</span>
          <h1 class="text-base sm:text-xl font-bold tracking-tight">SMAN 1 TAWANGSARI</h1>
        </div>
        <p class="text-xs text-blue-200 mt-0.5">Sinkronisasi Data Google Drive (Terbaru 10 Nov) vs Platform BelajarPlus</p>
      </div>
      <div class="text-right text-xs text-blue-200">
        <div>Update: <span class="font-semibold text-white">${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</span></div>
        <div class="text-[11px] text-blue-300">NPSN: 20330968 · TA 2026/2027</div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="max-w-6xl mx-auto flex gap-6 mt-3 border-t border-blue-600/40 pt-2 text-xs sm:text-sm">
      <button onclick="switchTab('siswa')" id="tabBtn-siswa" class="pb-1.5 font-bold text-white border-b-2 border-white transition flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        Audit Rombel & Siswa Terbaru (10 Nov)
      </button>
      <button onclick="switchTab('guru')" id="tabBtn-guru" class="pb-1.5 font-semibold text-blue-200 hover:text-white transition flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path></svg>
        Audit Akun PTK & Hasil Login (74 Guru)
      </button>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-3 sm:px-6 mt-4 space-y-5">

    <!-- ========================================== -->
    <!-- TAB 1: AUDIT ROMBEL & SISWA TERBARU       -->
    <!-- ========================================== -->
    <section id="section-siswa" class="space-y-4">

      <!-- KPI Summary Cards Siswa -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-slate-500 uppercase">Siswa di Drive Terbaru</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">${comparison.totalDriveStudents} <span class="text-xs font-normal text-slate-500">Siswa</span></div>
          <div class="text-[11px] text-slate-400 mt-1">File 10 Nov 2026 (30 Rombel)</div>
        </div>

        <div class="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-blue-600 uppercase">Live di Platform</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">${comparison.totalPlatformStudents} <span class="text-xs font-normal text-slate-500">Siswa</span></div>
          <div class="text-[11px] text-blue-500 mt-1">1.038 di rombel + 6 unplaced</div>
        </div>

        <div class="bg-emerald-50 rounded-xl p-3.5 sm:p-4 shadow-sm border border-emerald-200 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-emerald-700 uppercase">Cocok & Terdaftar</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">${comparison.matchedCount} <span class="text-xs font-normal text-emerald-600">Siswa</span></div>
          <div class="text-[11px] text-emerald-600 mt-1">95.6% data sudah live</div>
        </div>

        <div class="bg-rose-50 rounded-xl p-3.5 sm:p-4 shadow-sm border border-rose-200 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-rose-700 uppercase">Belum Masuk Platform</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-rose-800 mt-1">${comparison.missingInPlatformCount} <span class="text-xs font-normal text-rose-600">Siswa</span></div>
          <div class="text-[11px] text-rose-600 mt-1">36 siswa K11-1 + 11 siswa lain</div>
        </div>
      </div>

      <!-- Alert Temuan Rombel & Siswa -->
      <div class="bg-amber-50 rounded-xl p-4 border border-amber-300 shadow-sm text-xs sm:text-sm text-amber-950">
        <div class="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5 text-sm">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          Temuan Utama Sinkronisasi Rombel & Siswa (Update Terbaru):
        </div>
        <ul class="space-y-1 list-disc list-inside text-amber-900">
          <li><strong>Struktur 30 Rombel Sudah Terbentuk 100%:</strong> Di platform sudah ada 30 rombel resmi (Kelas 10-1 s/d 10-10, Kelas 11-1 s/d 11-10, Kelas 12-1 s/d 12-10).</li>
          <li><strong>Rombel Kelas 11-1 Belum Masuk Siswanya:</strong> Di file update terbaru, <strong>Kelas 11-1 memiliki 36 siswa</strong> (Zivanna Yuwa Griselda, Kavienda Yudi, dkk). Seluruh 36 siswa ini belum diimpor ke platform.</li>
          <li><strong>11 Siswa Tambahan di Kelas Lain:</strong> Terdapat siswa baru di Kelas 10-10 (2 siswa), Kelas 10-4 (1 siswa), Kelas 10-5 (1 siswa), Kelas 11-10 (4 siswa), Kelas 12-1 (2 siswa), dan Kelas 12-4 (1 siswa).</li>
          <li><strong>Status 6 Siswa Unplaced di Platform:</strong> 5 siswa berstatus <em>suspended</em> (bukan siswa aktif sekolah) dan 1 akun testing trainer (<em>siswaedukaloka@gmail.com</em>). Semua siswa aktif 1.038 sudah terpasang di rombel.</li>
        </ul>
      </div>

      <!-- Breakdown 30 Rombel Drive -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 class="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide mb-3 flex items-center justify-between">
          <span>Struktur & Kuota 30 Rombel (Data Terbaru Google Drive)</span>
          <span class="text-xs font-normal text-slate-500">Total: 1.063 Siswa</span>
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          ${rombelCardsHtml}
        </div>
      </div>

      <!-- Tabel 47 Siswa Belum Masuk Platform -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div class="font-bold text-sm text-slate-800">Daftar 47 Siswa di Berkas Terbaru yang Belum Terdaftar di Platform</div>
            <div class="text-xs text-slate-500">Prioritas untuk diimpor agar rombel 11-1 dan kelas lainnya lengkap</div>
          </div>
          <div class="relative w-full sm:w-64">
            <input type="text" id="searchMissingInput" placeholder="Cari siswa atau rombel..." class="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
        <div class="overflow-x-auto max-h-[500px]">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-slate-100 z-10">
              <tr class="text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                <th class="p-2.5 sm:p-3 text-center w-12">No</th>
                <th class="p-2.5 sm:p-3">Nama Siswa</th>
                <th class="p-2.5 sm:p-3">Email Akun</th>
                <th class="p-2.5 sm:p-3">Password Default</th>
                <th class="p-2.5 sm:p-3 text-center">Rombel Target</th>
                <th class="p-2.5 sm:p-3 text-center">Status Platform</th>
              </tr>
            </thead>
            <tbody id="missingTableBody">
              ${missingStudentsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detail 6 Siswa Unplaced -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs sm:text-sm text-slate-700">
          6 Akun Siswa Belum Ditempatkan di Rombel (Data Platform Live)
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                <th class="p-2 text-center w-12">No</th>
                <th class="p-2">Nama</th>
                <th class="p-2">Email</th>
                <th class="p-2 text-center">Status Akun</th>
                <th class="p-2">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${unplacedHtml}
            </tbody>
          </table>
        </div>
      </div>

    </section>

    <!-- ========================================== -->
    <!-- TAB 2: AUDIT AKUN PTK & LOGIN             -->
    <!-- ========================================== -->
    <section id="section-guru" class="space-y-4 hidden">

      <!-- KPI Summary Cards Guru -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-slate-500 uppercase">Total di Drive</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">${totalDrive} <span class="text-xs font-normal text-slate-500">Guru</span></div>
          <div class="text-[11px] text-slate-400 mt-1">Berkas resmi master excel</div>
        </div>

        <div class="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-blue-600 uppercase">Live di Platform</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">${totalLive} <span class="text-xs font-normal text-slate-500">PTK</span></div>
          <div class="text-[11px] text-blue-500 mt-1">${inPlatformCount} dari Drive + 14 akun internal</div>
        </div>

        <div class="bg-emerald-50 rounded-xl p-3.5 sm:p-4 shadow-sm border border-emerald-200 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-emerald-700 uppercase">✅ BISA LOGIN</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">${successCount} <span class="text-xs font-normal text-emerald-600">Akun</span></div>
          <div class="text-[11px] text-emerald-600 mt-1">Password drive match 100%</div>
        </div>

        <div class="bg-rose-50 rounded-xl p-3.5 sm:p-4 shadow-sm border border-rose-200 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-rose-700 uppercase">❌ GAGAL LOGIN</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-rose-800 mt-1">${failedCount} <span class="text-xs font-normal text-rose-600">Akun</span></div>
          <div class="text-[11px] text-rose-600 mt-1">${notInPlatformCount} belum ada + 6 pass beda</div>
        </div>
      </div>

      <!-- Filter Controls Guru -->
      <div class="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div class="flex-1 relative">
          <input type="text" id="teacherSearchInput" placeholder="Cari nama guru atau email..." class="w-full text-xs sm:text-sm pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <div class="flex flex-wrap gap-1.5 text-xs font-semibold">
          <button onclick="filterTeacherCategory('all')" id="tbtn-all" class="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-800 text-white">Semua (${totalDrive})</button>
          <button onclick="filterTeacherCategory('success')" id="tbtn-success" class="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-emerald-700 hover:bg-emerald-50">Bisa Login (${successCount})</button>
          <button onclick="filterTeacherCategory('failed-in-platform')" id="tbtn-failed-in-platform" class="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-rose-700 hover:bg-rose-50">Password Beda (6)</button>
          <button onclick="filterTeacherCategory('not-in-platform')" id="tbtn-not-in-platform" class="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-amber-700 hover:bg-amber-50">Belum di Platform (${notInPlatformCount})</button>
        </div>
      </div>

      <!-- Tabel 74 Guru Drive -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs sm:text-sm text-slate-700 flex items-center justify-between">
          <span>Daftar 74 Akun Guru di Drive (Hasil Uji Login 1-per-1)</span>
          <span class="text-xs font-normal text-slate-500" id="teacherRowCount">Menampilkan ${totalDrive} data</span>
        </div>
        <div class="overflow-x-auto max-h-[500px]">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 bg-slate-100 z-10">
              <tr class="text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                <th class="p-2.5 sm:p-3 text-center w-12">No</th>
                <th class="p-2.5 sm:p-3">Nama Lengkap & Email</th>
                <th class="p-2.5 sm:p-3">Password Master</th>
                <th class="p-2.5 sm:p-3 text-center">Status Platform</th>
                <th class="p-2.5 sm:p-3 text-center">Hasil Login</th>
                <th class="p-2.5 sm:p-3">Keterangan</th>
              </tr>
            </thead>
            <tbody id="teacherTableBody">
              ${teacherRowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabel 14 Akun Internal BelajarPlus -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs sm:text-sm text-slate-700">
          Daftar 14 Akun Guru Tambahan di Platform (Domain @belajarplus.com)
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                <th class="p-2.5 sm:p-3 text-center w-12">No</th>
                <th class="p-2.5 sm:p-3">Nama di Platform</th>
                <th class="p-2.5 sm:p-3">Email @belajarplus.com</th>
                <th class="p-2.5 sm:p-3 text-center">Status Platform</th>
                <th class="p-2.5 sm:p-3 text-center">Hasil Login</th>
                <th class="p-2.5 sm:p-3">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${extraRowsHtml}
            </tbody>
          </table>
        </div>
      </div>

    </section>

  </main>

  <script>
    // Tab switching
    function switchTab(tab) {
      if (tab === 'siswa') {
        document.getElementById('section-siswa').classList.remove('hidden');
        document.getElementById('section-guru').classList.add('hidden');
        document.getElementById('tabBtn-siswa').className = 'pb-1.5 font-bold text-white border-b-2 border-white transition flex items-center gap-1.5';
        document.getElementById('tabBtn-guru').className = 'pb-1.5 font-semibold text-blue-200 hover:text-white transition flex items-center gap-1.5';
      } else {
        document.getElementById('section-siswa').classList.add('hidden');
        document.getElementById('section-guru').classList.remove('hidden');
        document.getElementById('tabBtn-guru').className = 'pb-1.5 font-bold text-white border-b-2 border-white transition flex items-center gap-1.5';
        document.getElementById('tabBtn-siswa').className = 'pb-1.5 font-semibold text-blue-200 hover:text-white transition flex items-center gap-1.5';
      }
    }

    // Teacher filters
    let currentTeacherCategory = 'all';
    function filterTeacherCategory(cat) {
      currentTeacherCategory = cat;
      ['all', 'success', 'failed-in-platform', 'not-in-platform'].forEach(c => {
        const btn = document.getElementById('tbtn-' + c);
        if (c === cat) {
          btn.className = 'px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-800 text-white font-bold';
        } else {
          btn.className = 'px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold';
        }
      });
      applyTeacherFilters();
    }

    function applyTeacherFilters() {
      const q = (document.getElementById('teacherSearchInput').value || '').toLowerCase().trim();
      const rows = document.querySelectorAll('.teacher-row');
      let visible = 0;
      rows.forEach(r => {
        const cat = r.getAttribute('data-cat');
        const search = r.getAttribute('data-search');
        const matchCat = (currentTeacherCategory === 'all') || (cat === currentTeacherCategory);
        const matchSearch = !q || search.includes(q);
        if (matchCat && matchSearch) {
          r.style.display = '';
          visible++;
        } else {
          r.style.display = 'none';
        }
      });
      document.getElementById('teacherRowCount').innerText = 'Menampilkan ' + visible + ' data';
    }
    document.getElementById('teacherSearchInput').addEventListener('input', applyTeacherFilters);

    // Missing student search
    document.getElementById('searchMissingInput').addEventListener('input', function(e) {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.student-missing-row').forEach(r => {
        const search = r.getAttribute('data-search');
        if (!q || search.includes(q)) {
          r.style.display = '';
        } else {
          r.style.display = 'none';
        }
      });
    });
  </script>
</body>
</html>`;

fs.writeFileSync('tws.html', htmlContent);
console.log('Successfully updated tws.html with dual tab and student-rombel audit!');
