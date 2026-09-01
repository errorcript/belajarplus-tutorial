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
    siswa: 'AKUN SISWA / PELAJAR (10 LANGKAH OPERASIONAL LENGKAP)',
    guru: 'AKUN GURU / PENGAJAR (6 LANGKAH MANAJEMEN PEMBELAJARAN)',
    kepsek: 'AKUN KEPALA SEKOLAH & ADMIN (6 LANGKAH MANAJEMEN EKOSISTEM)'
  };

  const targetContainer = document.getElementById(`steps-${role}`);
  if (!targetContainer) {
    alert('Konten panduan tidak ditemukan!');
    return;
  }

  const triggerBtn = event ? event.currentTarget : null;
  const originalText = triggerBtn ? triggerBtn.innerHTML : '';
  if (triggerBtn) {
    triggerBtn.innerHTML = '⏳ Memproses Berkas PDF...';
    triggerBtn.disabled = true;
  }

  // Dedicated offscreen container for html2canvas capture to prevent blank pages and scroll offsets
  const pdfWrapper = document.createElement('div');
  pdfWrapper.style.position = 'absolute';
  pdfWrapper.style.left = '-9999px';
  pdfWrapper.style.top = '0px';
  pdfWrapper.style.width = '700px';
  pdfWrapper.style.padding = '20px';
  pdfWrapper.style.background = '#ffffff';
  pdfWrapper.style.color = '#0f172a';
  pdfWrapper.style.fontFamily = "'Inter', Arial, sans-serif";
  pdfWrapper.style.boxSizing = 'border-box';

  // Kop Header
  let pdfHTML = `
    <div style="border-bottom: 3px double #1e3a8a; padding-bottom: 12px; margin-bottom: 24px; text-align: left;">
      <div style="font-size: 10px; font-weight: 800; color: #2563eb; letter-spacing: 1.5px; text-transform: uppercase;">DOKUMEN RESMI PANDUAN PENGGUNAAN</div>
      <h1 style="font-size: 19px; font-weight: 900; color: #1e3a8a; margin: 4px 0 2px 0;">PERPUSTAKAAN DIGITAL BELAJARPLUS ID</h1>
      <div style="font-size: 12px; font-weight: 700; color: #334155; text-transform: uppercase;">${roleTitles[role] || 'PANDUAN OPERASIONAL'}</div>
      <div style="font-size: 9.5px; color: #64748b; margin-top: 6px;">
        Dokumen Modul Resmi Sekolah • Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  `;

  // Parse each step item into clean block elements
  const steps = targetContainer.querySelectorAll('.step');
  steps.forEach((step, idx) => {
    const stepNum = step.querySelector('.step-number')?.innerText || (idx + 1);
    const stepTitle = step.querySelector('.step-header h3')?.innerText || '';
    const stepTag = step.querySelector('.step-tag')?.innerText || '';
    const stepParagraph = step.querySelector('p')?.innerText || '';
    
    // List items
    const listItems = step.querySelectorAll('.step-list li');
    let listHTML = '';
    if (listItems.length > 0) {
      listHTML += `<ul style="margin: 8px 0; padding-left: 20px; font-size: 11px; color: #334155; line-height: 1.6;">`;
      listItems.forEach(li => {
        listHTML += `<li style="margin-bottom: 4px;">${li.innerHTML}</li>`;
      });
      listHTML += `</ul>`;
    }

    // Step note
    const stepNote = step.querySelector('.step-note')?.innerHTML || '';
    let noteHTML = '';
    if (stepNote) {
      noteHTML = `
        <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 8px 12px; margin-top: 8px; font-size: 10.5px; color: #1e40af; border-radius: 4px;">
          ${stepNote}
        </div>
      `;
    }

    // Screenshot Image
    const stepImgSrc = step.querySelector('.screenshot-img')?.src || '';
    let imgHTML = '';
    if (stepImgSrc) {
      imgHTML = `
        <div style="margin-top: 10px; text-align: center;">
          <img src="${stepImgSrc}" style="max-width: 320px; height: auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.08);" />
        </div>
      `;
    }

    // Clean A4 step card block
    pdfHTML += `
      <div style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 20px; padding: 14px 16px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fafafa;">
        <div style="margin-bottom: 6px;">
          <span style="display: inline-block; background: #1e3a8a; color: #ffffff; font-weight: 800; font-size: 10.5px; padding: 2px 8px; border-radius: 4px; margin-right: 8px;">LANGKAH ${stepNum}</span>
          <span style="font-size: 14px; font-weight: 800; color: #0f172a;">${stepTitle}</span>
          ${stepTag ? `<span style="font-size: 9.5px; background: #e2e8f0; color: #475569; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: 600;">${stepTag}</span>` : ''}
        </div>
        <div style="font-size: 11px; color: #334155; line-height: 1.5; margin-bottom: 6px;">
          ${stepParagraph}
        </div>
        ${listHTML}
        ${noteHTML}
        ${imgHTML}
      </div>
    `;
  });

  // Footer
  pdfHTML += `
    <div style="margin-top: 24px; border-top: 1px solid #cbd5e1; padding-top: 10px; text-align: center; font-size: 9.5px; color: #64748b;">
      © ${new Date().getFullYear()} BelajarPlus.id — Hak Cipta Dilindungi. Modul Resmi Operasional Perpustakaan Digital Sekolah.
    </div>
  `;

  pdfWrapper.innerHTML = pdfHTML;
  document.body.appendChild(pdfWrapper);

  const opt = {
    margin:       [10, 8, 12, 8],
    filename:     `Panduan_BelajarPlus_${role.toUpperCase()}_Resmi.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: 0, scrollX: 0 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['css', 'legacy'] }
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(pdfWrapper).save().then(() => {
      if (document.body.contains(pdfWrapper)) {
        document.body.removeChild(pdfWrapper);
      }
      if (triggerBtn) {
        triggerBtn.innerHTML = originalText;
        triggerBtn.disabled = false;
      }
    }).catch(err => {
      console.error('PDF generation error:', err);
      if (document.body.contains(pdfWrapper)) {
        document.body.removeChild(pdfWrapper);
      }
      if (triggerBtn) {
        triggerBtn.innerHTML = originalText;
        triggerBtn.disabled = false;
      }
      window.print();
    });
  } else {
    if (document.body.contains(pdfWrapper)) {
      document.body.removeChild(pdfWrapper);
    }
    if (triggerBtn) {
      triggerBtn.innerHTML = originalText;
      triggerBtn.disabled = false;
    }
    window.print();
  }
}





