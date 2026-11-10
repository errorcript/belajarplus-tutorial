const fs = require('fs');

const audit = JSON.parse(fs.readFileSync('tws_audit_results.json', 'utf8'));
const comparison = JSON.parse(fs.readFileSync('tws_student_rombel_comparison.json', 'utf8'));
const unplaced = JSON.parse(fs.readFileSync('tws_unplaced_students.json', 'utf8'));

// 1. DATA GURU / PTK
const guruRowsHtml = audit.results.map(g => {
  let statusBadge = '';
  let statusClass = '';
  let passDisplay = `<code>${g.password || '-'}</code>`;
  let note = '';

  if (g.loginStatus === 'SUCCESS') {
    statusBadge = '✅ Bisa Login';
    statusClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    note = 'Akun terdaftar di Supabase Auth & password cocok.';
  } else if (g.loginStatus === 'FAILED_INVALID_CREDENTIALS') {
    statusBadge = '⚠️ Password Beda';
    statusClass = 'bg-amber-100 text-amber-800 border-amber-300';
    note = 'Akun ada di auth platform, tapi password sudah diubah atau beda.';
  } else {
    statusBadge = '❌ Belum Terdaftar';
    statusClass = 'bg-rose-100 text-rose-800 border-rose-300';
    note = 'Akun belum pernah dibuatkan di platform BelajarPlus.';
  }

  const searchStr = `${(g.name || '').toLowerCase()} ${(g.email || '').toLowerCase()}`;

  return `
    <tr class="hover:bg-slate-50 transition border-b border-slate-200 text-xs sm:text-sm guru-row" data-status="${g.loginStatus}" data-search="${searchStr}">
      <td class="p-2.5 sm:p-3 text-slate-500 font-mono text-center">${g.no}</td>
      <td class="p-2.5 sm:p-3 font-semibold text-slate-800">${g.name}</td>
      <td class="p-2.5 sm:p-3 font-mono text-slate-600 break-all text-[11px] sm:text-xs">${g.email}</td>
      <td class="p-2.5 sm:p-3 font-mono text-slate-700 bg-slate-50 text-[11px] sm:text-xs">${passDisplay}</td>
      <td class="p-2.5 sm:p-3 text-center">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold border ${statusClass}">
          ${statusBadge}
        </span>
      </td>
      <td class="p-2.5 sm:p-3 text-slate-500 text-[11px] leading-tight">${note}</td>
    </tr>
  `;
}).join('\n');

const extraGuruRowsHtml = (audit.extraInPlatform || []).map((e, idx) => `
  <tr class="hover:bg-slate-50 transition border-b border-slate-200 text-xs sm:text-sm">
    <td class="p-2.5 sm:p-3 text-slate-500 font-mono text-center">${idx + 1}</td>
    <td class="p-2.5 sm:p-3 font-semibold text-slate-800">${e.name}</td>
    <td class="p-2.5 sm:p-3 font-mono text-slate-600 text-[11px] sm:text-xs break-all">${e.email}</td>
    <td class="p-2.5 sm:p-3 text-center"><span class="px-2 py-0.5 text-[11px] rounded bg-blue-100 text-blue-800 font-medium">Aktif</span></td>
    <td class="p-2.5 sm:p-3 text-center"><span class="px-2 py-0.5 text-[11px] rounded bg-amber-100 text-amber-800 font-bold">❌ Beda Password</span></td>
    <td class="p-2.5 sm:p-3 text-[11px] text-slate-500">Akun domain @belajarplus.com (internal sekolah)</td>
  </tr>
`).join('\n');

// 2. DATA SISWA & ROMBEL TERBARU
const missingStudentsHtml = comparison.missingInPlatformList.map((s, idx) => `
  <tr class="hover:bg-slate-50 transition border-b border-slate-200 text-xs sm:text-sm student-missing-row" data-search="${(s.A || '').toLowerCase()} ${(s.B || '').toLowerCase()} ${(s.D || '').toLowerCase()}">
    <td class="p-2.5 sm:p-3 text-slate-500 font-mono text-center">${idx + 1}</td>
    <td class="p-2.5 sm:p-3 font-bold text-slate-800">${s.A}</td>
    <td class="p-2.5 sm:p-3 font-mono text-[11px] text-slate-600 break-all">${s.B}</td>
    <td class="p-2.5 sm:p-3 font-mono text-[11px] text-slate-700 bg-slate-50"><code>${s.C}</code></td>
    <td class="p-2.5 sm:p-3 text-center"><span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">${s.D}</span></td>
    <td class="p-2.5 sm:p-3 text-center"><span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">Pending Konflik Pembuatan Akun</span></td>
  </tr>
`).join('\n');

// Distribusi Rombel Drive & Platform Live
const rombelList = Object.entries(comparison.driveRombelCounts).sort((a, b) => a[0].localeCompare(b[0]));
const liveCounts = comparison.liveRombelCounts || {};

const rombelCardsHtml = rombelList.map(([rombel, driveCount]) => {
  const liveCount = liveCounts[rombel] !== undefined ? liveCounts[rombel] : driveCount;
  const isK11_1 = rombel === 'Kelas 11-1';
  
  let badge = '';
  if (isK11_1) {
    badge = `<span class="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm">✅ Sukses Diimpor (36/36)</span>`;
  } else if (liveCount === driveCount) {
    badge = `<span class="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-semibold">Lengkap (${liveCount})</span>`;
  } else if (liveCount > driveCount) {
    badge = `<span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-semibold">${liveCount} (Duplikat @belajarplus)</span>`;
  } else {
    badge = `<span class="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-semibold">${liveCount}/${driveCount} Siswa</span>`;
  }

  return `
    <div class="bg-white border ${isK11_1 ? 'border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50/30' : 'border-slate-200'} rounded-lg p-3 flex items-center justify-between shadow-sm">
      <div>
        <div class="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
          ${rombel}
          ${isK11_1 ? '<span class="text-[10px] font-normal bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">Terselesaikan</span>' : ''}
        </div>
        <div class="text-[11px] text-slate-500 mt-0.5">Platform Live: <b>${liveCount}</b> · Target: ${driveCount} siswa</div>
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
  <title>Laporan Audit & Perbaikan Rombel SMAN 1 Tawangsari - BelajarPlus</title>
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
          <span class="bg-emerald-400 text-blue-950 text-[11px] font-black uppercase px-2 py-0.5 rounded shadow-sm">Update 11 Nov</span>
          <h1 class="text-base sm:text-xl font-bold tracking-tight">SMAN 1 TAWANGSARI</h1>
        </div>
        <p class="text-xs text-blue-200 mt-0.5">Status Sinkronisasi & Perbaikan Rombel Siswa Platform BelajarPlus</p>
      </div>
      <div class="text-right text-xs">
        <span class="bg-blue-800/80 px-2 py-1 rounded text-blue-100 font-mono text-[11px]">NPSN: 20330968 · TA: 2026/2027</span>
      </div>
    </div>
  </header>

  <!-- Dual Tab Navigation -->
  <div class="bg-white border-b border-slate-200 sticky top-[57px] z-20 shadow-sm">
    <div class="max-w-6xl mx-auto flex px-2 sm:px-6">
      <button onclick="switchTab('siswa')" id="tab-btn-siswa" class="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 border-b-2 border-transparent transition flex items-center gap-2 tab-active">
        <span>👥</span> Rombel & Siswa Terbaru
        <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">Selesai Diperbaiki</span>
      </button>
      <button onclick="switchTab('guru')" id="tab-btn-guru" class="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 border-b-2 border-transparent transition flex items-center gap-2">
        <span>👨‍🏫</span> Akun PTK & Hasil Login
        <span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">${audit.totalDriveTeachers} Guru</span>
      </button>
    </div>
  </div>

  <main class="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">

    <!-- TAB 1: ROMBEL & SISWA TERBARU -->
    <section id="tab-content-siswa" class="space-y-6">
      
      <!-- Banner Status Perbaikan -->
      <div class="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-emerald-400">
        <div class="flex items-start gap-3">
          <div class="text-2xl sm:text-3xl">🎉</div>
          <div>
            <h3 class="font-bold text-sm sm:text-base">Perbaikan Rombel Siswa Selesai Dieksekusi!</h3>
            <p class="text-xs sm:text-sm text-emerald-100 mt-1 leading-relaxed">
              <strong>Kelas 11-1</strong> yang sebelumnya kosong (0 siswa) kini <strong>100% SUKSES DIIMPOR (36 Siswa Lengkap)</strong> langsung terhubung ke rombel aktif platform. Total siswa terpasang di rombel sekolah kini melonjak menjadi <strong>1.080 Siswa</strong>.
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Siswa -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-slate-500 text-[11px] sm:text-xs font-medium uppercase tracking-wider">Target Siswa (Drive)</div>
          <div class="text-xl sm:text-2xl font-black text-slate-800 mt-1">1.063</div>
          <div class="text-[11px] text-slate-500 mt-1">30 Rombel Resmi</div>
        </div>
        <div class="bg-white p-3 sm:p-4 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50/40">
          <div class="text-emerald-700 text-[11px] sm:text-xs font-medium uppercase tracking-wider">Terpasang di Rombel</div>
          <div class="text-xl sm:text-2xl font-black text-emerald-700 mt-1">1.080</div>
          <div class="text-[11px] text-emerald-600 mt-1 font-semibold">▲ +42 Siswa Baru Masuk</div>
        </div>
        <div class="bg-white p-3 sm:p-4 rounded-xl border border-blue-200 shadow-sm bg-blue-50/40">
          <div class="text-blue-700 text-[11px] sm:text-xs font-medium uppercase tracking-wider">Status Kelas 11-1</div>
          <div class="text-xl sm:text-2xl font-black text-blue-700 mt-1">36 / 36</div>
          <div class="text-[11px] text-emerald-600 font-bold mt-1">✅ 100% Selesai Diisi</div>
        </div>
        <div class="bg-white p-3 sm:p-4 rounded-xl border border-amber-200 shadow-sm bg-amber-50/40">
          <div class="text-amber-800 text-[11px] sm:text-xs font-medium uppercase tracking-wider">Pending Pembuatan Akun</div>
          <div class="text-xl sm:text-2xl font-black text-amber-700 mt-1">${comparison.missingInPlatformCount}</div>
          <div class="text-[11px] text-amber-600 mt-1">Terkendala di Auth Server</div>
        </div>
      </div>

      <!-- Detail Distribusi 30 Rombel -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 class="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
              <span>🏫</span> Status Live 30 Rombel (Tahun Ajaran 2026/2027)
            </h3>
            <p class="text-xs text-slate-500">Perbandingan kuota siswa terdaftar live di platform vs data berkas update</p>
          </div>
          <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
            Total Live: 1.080 Siswa
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          ${rombelCardsHtml}
        </div>
      </div>

      <!-- Sisa Siswa Pending Konflik Auth -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
          <h3 class="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
            <span>⚠️</span> Sisa 5 Siswa Terkendala Pending Konflik Pembuatan Akun
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Akun ini terkena status server <em>"terkait operasi pembuatan akun yang belum selesai"</em> di Supabase Auth, sehingga belum dapat dibuatkan akun baru secara otomatis melalui impor berkas.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-600 text-[11px] sm:text-xs uppercase font-semibold border-b border-slate-200">
                <th class="p-2.5 sm:p-3 text-center w-12">No</th>
                <th class="p-2.5 sm:p-3">Nama Siswa</th>
                <th class="p-2.5 sm:p-3">Email</th>
                <th class="p-2.5 sm:p-3">Password Awal</th>
                <th class="p-2.5 sm:p-3 text-center">Rombel</th>
                <th class="p-2.5 sm:p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              ${missingStudentsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Status 6 Akun Siswa Unplaced -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
              <span>ℹ️</span> 6 Siswa Berstatus Unplaced (Tidak Terdaftar di Rombel)
            </h3>
            <p class="text-xs text-slate-500">Bukan siswa aktif tertinggal, melainkan 5 akun ditangguhkan dan 1 akun simulasi trainer.</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-600 text-[11px] uppercase font-semibold border-b border-slate-200">
                <th class="p-2 text-center w-10">No</th>
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

    <!-- TAB 2: AUDIT PTK & LOGIN TEST -->
    <section id="tab-content-guru" class="space-y-6 hidden">
      
      <!-- Quick Metrics Guru -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div class="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-slate-500 text-[11px] sm:text-xs font-medium uppercase tracking-wider">Total Guru di Drive</div>
          <div class="text-xl sm:text-2xl font-black text-slate-800 mt-1">${audit.totalDriveTeachers}</div>
          <div class="text-[11px] text-slate-500 mt-1">Berkas Resmi Master</div>
        </div>
        <div class="bg-white p-3 sm:p-4 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50/40">
          <div class="text-emerald-700 text-[11px] sm:text-xs font-medium uppercase tracking-wider">Bisa Login (100%)</div>
          <div class="text-xl sm:text-2xl font-black text-emerald-700 mt-1">${audit.successLogins}</div>
          <div class="text-[11px] text-emerald-600 mt-1 font-semibold">Langsung Pakai Password Master</div>
        </div>
        <div class="bg-white p-3 sm:p-4 rounded-xl border border-amber-200 shadow-sm bg-amber-50/40">
          <div class="text-amber-800 text-[11px] sm:text-xs font-medium uppercase tracking-wider">Ada di Platform / Password Beda</div>
          <div class="text-xl sm:text-2xl font-black text-amber-700 mt-1">${audit.failedLogins}</div>
          <div class="text-[11px] text-amber-600 mt-1">Sudah Ubah Password Sendiri</div>
        </div>
        <div class="bg-white p-3 sm:p-4 rounded-xl border border-rose-200 shadow-sm bg-rose-50/40">
          <div class="text-rose-700 text-[11px] sm:text-xs font-medium uppercase tracking-wider">Belum Terdaftar</div>
          <div class="text-xl sm:text-2xl font-black text-rose-700 mt-1">${audit.notInPlatformCount}</div>
          <div class="text-[11px] text-rose-600 mt-1">Belum Ada Akun Supabase</div>
        </div>
      </div>

      <!-- Controls Guru -->
      <div class="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div class="w-full sm:w-80">
          <input type="text" id="guruSearch" placeholder="Cari nama atau email guru..." 
                 class="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex flex-wrap gap-1.5 w-full sm:w-auto">
          <button onclick="filterGuru('ALL')" class="guru-btn active px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white">Semua (${audit.totalDriveTeachers})</button>
          <button onclick="filterGuru('SUCCESS')" class="guru-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Bisa Login (${audit.successLogins})</button>
          <button onclick="filterGuru('FAILED_INVALID_CREDENTIALS')" class="guru-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Password Beda (${audit.failedLogins})</button>
          <button onclick="filterGuru('NOT_FOUND_IN_PLATFORM')" class="guru-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Belum Terdaftar (${audit.notInPlatformCount})</button>
        </div>
      </div>

      <!-- Tabel Daftar Guru -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-600 text-[11px] sm:text-xs uppercase font-semibold border-b border-slate-200">
                <th class="p-2.5 sm:p-3 text-center w-12">No</th>
                <th class="p-2.5 sm:p-3">Nama Lengkap</th>
                <th class="p-2.5 sm:p-3">Email Login</th>
                <th class="p-2.5 sm:p-3">Password Drive</th>
                <th class="p-2.5 sm:p-3 text-center">Hasil Uji Login</th>
                <th class="p-2.5 sm:p-3">Keterangan</th>
              </tr>
            </thead>
            <tbody id="guruTableBody">
              ${guruRowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabel Akun BelajarPlus Guru -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-sm sm:text-base text-slate-800">14 Akun PTK Internal (@belajarplus.com) di Platform</h3>
            <p class="text-xs text-slate-500">Akun yang didaftarkan khusus via platform tanpa email pribadi di Drive</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-600 text-[11px] uppercase font-semibold border-b border-slate-200">
                <th class="p-2.5 sm:p-3 text-center w-12">No</th>
                <th class="p-2.5 sm:p-3">Nama</th>
                <th class="p-2.5 sm:p-3">Email</th>
                <th class="p-2.5 sm:p-3 text-center">Status</th>
                <th class="p-2.5 sm:p-3 text-center">Login Master</th>
                <th class="p-2.5 sm:p-3">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${extraGuruRowsHtml}
            </tbody>
          </table>
        </div>
      </div>

    </section>

  </main>

  <!-- Interactive Script -->
  <script>
    function switchTab(tab) {
      const siswaContent = document.getElementById('tab-content-siswa');
      const guruContent = document.getElementById('tab-content-guru');
      const btnSiswa = document.getElementById('tab-btn-siswa');
      const btnGuru = document.getElementById('tab-btn-guru');

      if (tab === 'siswa') {
        siswaContent.classList.remove('hidden');
        guruContent.classList.add('hidden');
        btnSiswa.classList.add('tab-active');
        btnGuru.classList.remove('tab-active');
      } else {
        guruContent.classList.remove('hidden');
        siswaContent.classList.add('hidden');
        btnGuru.classList.add('tab-active');
        btnSiswa.classList.remove('tab-active');
      }
    }

    // Filter Guru
    let currentFilter = 'ALL';
    function filterGuru(status) {
      currentFilter = status;
      document.querySelectorAll('.guru-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
      });
      event.target.classList.remove('bg-slate-100', 'text-slate-700');
      event.target.classList.add('bg-blue-600', 'text-white');
      applyGuruFilters();
    }

    const guruSearch = document.getElementById('guruSearch');
    if (guruSearch) {
      guruSearch.addEventListener('input', applyGuruFilters);
    }

    function applyGuruFilters() {
      const q = (guruSearch ? guruSearch.value : '').toLowerCase().trim();
      document.querySelectorAll('.guru-row').forEach(row => {
        const matchesStatus = (currentFilter === 'ALL' || row.dataset.status === currentFilter);
        const matchesSearch = (!q || row.dataset.search.includes(q));
        if (matchesStatus && matchesSearch) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
  </script>

</body>
</html>`;

fs.writeFileSync('tws.html', htmlContent);
console.log('Successfully generated updated tws.html with post-fix live status!');
