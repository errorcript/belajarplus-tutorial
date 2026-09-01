// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// === SCROLL ANIMATIONS ===
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.step, .card, .feature-card, .tip-card, .page-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

// === FAQ ACCORDION ===
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// === BOOK READER DEMO ===
const chapters = [
  {
    title: 'Bab 1 — Pengantar Antropologi',
    pages: [
      `<h2>Pengantar Antropologi</h2>
       <p><span class="highlight">Antropologi</span> adalah ilmu yang mempelajari manusia secara holistik — mencakup aspek biologis, budaya, bahasa, dan sosial dari kehidupan manusia di seluruh dunia.</p>
       <p>Ilmu ini berasal dari kata Yunani <em>anthropos</em> (manusia) dan <em>logos</em> (ilmu). Secara umum, antropologi dibagi menjadi dua cabang besar: <strong>Antropologi Fisik</strong> dan <strong>Antropologi Budaya</strong>.</p>
       <p>Dalam bab ini kita akan membahas sejarah perkembangan antropologi sebagai ilmu pengetahuan modern, mulai dari abad ke-19 hingga era kontemporer.</p>`,
      `<h2>Sejarah Perkembangan Antropologi</h2>
       <p>Antropologi berkembang pesat pada abad ke-19 sejalan dengan ekspansi kolonialisme Eropa. Para penjelajah dan misionaris membawa laporan tentang masyarakat-masyarakat yang dianggap "primitif".</p>
       <p>Tokoh-tokoh penting seperti <span class="highlight">Edward Tylor</span> (1832–1917) mendefinisikan kebudayaan sebagai "keseluruhan kompleks yang mencakup pengetahuan, kepercayaan, seni, moral, hukum, adat-istiadat..."</p>`,
    ]
  },
  {
    title: 'Bab 2 — Manusia & Kebudayaan',
    pages: [
      `<h2>Manusia sebagai Makhluk Berbudaya</h2>
       <p>Manusia adalah satu-satunya makhluk hidup yang mampu menciptakan, mewariskan, dan mengembangkan <span class="highlight">kebudayaan</span> secara sistematis dari generasi ke generasi.</p>
       <p>Kebudayaan tidak diwariskan secara biologis, melainkan dipelajari melalui proses yang disebut <strong>enkulturasi</strong> — proses seseorang belajar kebudayaan kelompoknya.</p>`,
      `<h2>Unsur-Unsur Kebudayaan</h2>
       <p>Menurut <span class="highlight">Clyde Kluckhohn</span>, ada 7 unsur kebudayaan yang bersifat universal (cultural universals):</p>
       <p>1. Bahasa &nbsp; 2. Sistem pengetahuan &nbsp; 3. Organisasi sosial &nbsp; 4. Sistem peralatan hidup dan teknologi &nbsp; 5. Sistem mata pencaharian &nbsp; 6. Sistem religi &nbsp; 7. Kesenian</p>`,
    ]
  },
  {
    title: 'Bab 3 — Sistem Kepercayaan',
    pages: [
      `<h2>Sistem Kepercayaan dalam Antropologi</h2>
       <p>Setiap masyarakat memiliki sistem kepercayaan yang menjadi landasan pandangan hidupnya. <span class="highlight">Religi</span> dalam pengertian antropologis tidak hanya mencakup agama formal, tetapi juga kepercayaan-kepercayaan lokal.</p>
       <p>Edward Tylor mengajukan konsep <strong>animisme</strong> sebagai bentuk religi paling awal — kepercayaan bahwa segala sesuatu di alam memiliki jiwa (<em>anima</em>).</p>`,
    ]
  },
  {
    title: 'Bab 4 — Dinamika Kebudayaan',
    pages: [
      `<h2>Perubahan dan Dinamika Budaya</h2>
       <p>Kebudayaan tidak bersifat statis. Ia selalu berubah seiring perkembangan zaman. Proses perubahan budaya dapat terjadi melalui <span class="highlight">difusi</span>, <span class="highlight">akulturasi</span>, maupun <span class="highlight">asimilasi</span>.</p>
       <p><strong>Difusi</strong> adalah penyebaran unsur kebudayaan dari satu tempat ke tempat lain melalui perpindahan manusia, perdagangan, atau media.</p>`,
    ]
  },
  {
    title: 'Bab 5 — Antropologi Terapan',
    pages: [
      `<h2>Antropologi dalam Kehidupan Modern</h2>
       <p><span class="highlight">Antropologi terapan</span> merupakan penggunaan teori dan metode antropologi untuk memecahkan masalah-masalah praktis dalam masyarakat modern.</p>
       <p>Bidang terapan meliputi: antropologi medis, antropologi pembangunan, antropologi forensik, dan antropologi bisnis (yang membantu perusahaan memahami perilaku konsumen).</p>`,
    ]
  },
];

let currentChapter = 0;
let currentPage = 0;
let currentFontSize = 1;
let tocVisible = true;

function getTotalPages() {
  return chapters[currentChapter].pages.length;
}

function renderPage() {
  const ch = chapters[currentChapter];
  const pg = ch.pages[currentPage];
  document.getElementById('pageContent').innerHTML = pg;
  document.getElementById('readerTitle').textContent = `Antropologi 11 — ${ch.title.split('—')[0].trim()}`;
  const total = getTotalPages();
  document.getElementById('pageNum').textContent = `Hal ${currentPage + 1} / ${total}`;
  const globalPage = chapters.slice(0, currentChapter).reduce((s, c) => s + c.pages.length, 0) + currentPage + 1;
  const totalAll = chapters.reduce((s, c) => s + c.pages.length, 0);
  document.getElementById('progressFill').style.width = `${(globalPage / totalAll) * 100}%`;
  document.getElementById('btnPrev').disabled = currentChapter === 0 && currentPage === 0;
  document.getElementById('btnNext').disabled = currentChapter === chapters.length - 1 && currentPage === getTotalPages() - 1;
  document.querySelectorAll('.toc-item').forEach((el, i) => el.classList.toggle('active', i === currentChapter));
  document.getElementById('pageContent').style.fontSize = currentFontSize + 'rem';
}

function nextPage() {
  if (currentPage < getTotalPages() - 1) {
    currentPage++;
  } else if (currentChapter < chapters.length - 1) {
    currentChapter++;
    currentPage = 0;
  }
  renderPage();
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
  } else if (currentChapter > 0) {
    currentChapter--;
    currentPage = chapters[currentChapter].pages.length - 1;
  }
  renderPage();
}

function goToChapter(idx, el) {
  currentChapter = idx;
  currentPage = 0;
  renderPage();
}

function toggleToc() {
  tocVisible = !tocVisible;
  document.getElementById('readerToc').classList.toggle('hidden', !tocVisible);
}

function zoomIn() {
  if (currentFontSize < 1.5) { currentFontSize = Math.round((currentFontSize + 0.1) * 10) / 10; }
  document.getElementById('pageContent').style.fontSize = currentFontSize + 'rem';
}

function zoomOut() {
  if (currentFontSize > 0.7) { currentFontSize = Math.round((currentFontSize - 0.1) * 10) / 10; }
  document.getElementById('pageContent').style.fontSize = currentFontSize + 'rem';
}

function toggleFullscreen() {
  const page = document.getElementById('readerPage');
  if (!document.fullscreenElement) {
    page.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.();
  }
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextPage();
  if (e.key === 'ArrowLeft') prevPage();
});

renderPage();

// === PROGRESS CHECKLIST ===
function updateProgress() {
  const checkboxes = document.querySelectorAll('.cl-item input[type="checkbox"]');
  const checked = [...checkboxes].filter(c => c.checked).length;
  const total = checkboxes.length;
  document.getElementById('clProgressFill').style.width = `${(checked / total) * 100}%`;
  document.getElementById('clProgressLabel').textContent = `${checked} / ${total} selesai`;
}

// === MOBILE NAV TOGGLE ===
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });
}

// === DARK & LIGHT THEME TOGGLE ===
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    document.body.classList.add('light-mode');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
  });
}

// === ROLE SWITCHER ===
function switchRole(role, btn) {
  document.querySelectorAll('.role-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.role-steps-container').forEach(c => c.classList.remove('active'));
  const target = document.getElementById(`steps-${role}`);
  if (target) {
    target.classList.add('active');
  }
}

// === UNIVERSAL LIGHTBOX IMAGE MODAL (ALL IMAGES & MOBILE SUPPORT) ===
function initImageLightbox() {
  // Target ALL images in document except the lightbox modal image itself
  const images = document.querySelectorAll('img:not(#modalImg)');
  images.forEach(img => {
    img.style.cursor = 'zoom-in';
    
    // Desktop click & mobile touch
    const handleZoom = (e) => {
      e.stopPropagation();
      e.preventDefault();
      openImageModal(img.src, img.alt || 'Gambar BelajarPlus');
    };

    img.removeEventListener('click', img._zoomHandler);
    img._zoomHandler = handleZoom;
    img.addEventListener('click', handleZoom);
  });
}

// Global Event Delegation fallback for dynamically rendered images
document.addEventListener('click', (e) => {
  const targetImg = e.target.closest('img:not(#modalImg)');
  if (targetImg && !targetImg._zoomHandler) {
    e.stopPropagation();
    openImageModal(targetImg.src, targetImg.alt || 'Gambar BelajarPlus');
  }
});

function openImageModal(src, captionText) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  
  if (modal && modalImg) {
    modalImg.src = src;
    if (modalCaption) {
      modalCaption.textContent = captionText;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeImageModal(e) {
  if (e && e.target && e.target.id === 'modalImg') return;
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeImageModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initImageLightbox();
});

// === PDF GENERATION FOR OFFICIAL FORMAL MODULE (A4) ===
function downloadRolePDF(role) {
  const roleTitles = {
    siswa: 'Akun Siswa / Pelajar',
    guru: 'Akun Guru / Pengajar',
    kepsek: 'Akun Kepala Sekolah & Admin'
  };

  const targetContainer = document.getElementById(`steps-${role}`);
  if (!targetContainer) {
    alert('Konten panduan tidak ditemukan!');
    return;
  }

  const triggerBtn = event ? event.currentTarget : null;
  const originalText = triggerBtn ? triggerBtn.innerHTML : '';
  if (triggerBtn) {
    triggerBtn.innerHTML = '⏳ Menyiapkan Dokumen PDF...';
    triggerBtn.disabled = true;
  }

  // Create temporary div formatted as official school module paper
  const tempDiv = document.createElement('div');
  tempDiv.className = 'pdf-export-document';
  tempDiv.style.padding = '20px 25px';
  tempDiv.style.background = '#ffffff';
  tempDiv.style.color = '#0f172a';
  tempDiv.style.fontFamily = "'Inter', sans-serif";

  // Official Kop Header
  const kopHeader = `
    <div style="border-bottom: 3px double #1e3a8a; padding-bottom: 12px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 1px;">MODUL PANDUAN PENGGUNAAN RESMI</div>
        <h1 style="font-size: 18px; font-weight: 800; color: #1e3a8a; margin: 4px 0 0 0;">PERPUSTAKAAN DIGITAL BELAJARPLUS</h1>
        <h2 style="font-size: 13px; font-weight: 700; color: #334155; margin: 2px 0 0 0;">Panduan Operasional: ${roleTitles[role] || 'Panduan Penggunaan'}</h2>
      </div>
      <div style="text-align: right; font-size: 10px; color: #64748b;">
        <div style="font-weight: 700; color: #1e293b;">BelajarPlus ID</div>
        <div>Tgl Cetak: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
    </div>
  `;

  // Clone target steps container
  const clone = targetContainer.cloneNode(true);
  clone.style.display = 'block';

  // Remove interactive buttons inside clone
  const pdfBtns = clone.querySelectorAll('.btn-pdf-download');
  pdfBtns.forEach(b => b.remove());

  tempDiv.innerHTML = kopHeader + clone.innerHTML + `
    <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 12px; text-align: center; font-size: 10px; color: #64748b;">
      © ${new Date().getFullYear()} BelajarPlus.id — Dokumen Resmi Panduan Operasional Perpustakaan Digital Sekolah.
    </div>
  `;

  document.body.appendChild(tempDiv);

  const opt = {
    margin:       [8, 10, 10, 10],
    filename:     `Panduan_BelajarPlus_${role.toUpperCase()}_Resmi.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(tempDiv).save().then(() => {
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
      if (triggerBtn) {
        triggerBtn.innerHTML = originalText;
        triggerBtn.disabled = false;
      }
    }).catch(err => {
      console.error('PDF error:', err);
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
      if (triggerBtn) {
        triggerBtn.innerHTML = originalText;
        triggerBtn.disabled = false;
      }
      window.print();
    });
  } else {
    if (document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv);
    }
    if (triggerBtn) {
      triggerBtn.innerHTML = originalText;
      triggerBtn.disabled = false;
    }
    window.print();
  }
}




