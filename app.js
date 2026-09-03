// === BELAJARPLUS TUTORIAL ENGINE ===
(function() {
// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// === SCROLL PROGRESS BAR & BACK TO TOP ===
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  const progBar = document.getElementById('scrollProgressBar');
  if (progBar) progBar.style.width = scrollPct + '%';

  const backBtn = document.getElementById('btnBackToTop');
  if (backBtn) {
    if (scrollTop > 450) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }
}, { passive: true });

// === SCROLL ANIMATIONS WITH APPLE/LINEAR CUBIC-BEZIER PHYSICS ===
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.step, .card, .feature-card, .tip-card, .page-card, .admin-stat-card').forEach((el, idx) => {
  el.classList.add('reveal-on-scroll');
  observer.observe(el);
});

// === FAQ ACCORDION ===
window.toggleFaq = function(btn) {
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

window.nextPage = function() {
  if (currentPage < getTotalPages() - 1) {
    currentPage++;
  } else if (currentChapter < chapters.length - 1) {
    currentChapter++;
    currentPage = 0;
  }
  renderPage();
}

window.prevPage = function() {
  if (currentPage > 0) {
    currentPage--;
  } else if (currentChapter > 0) {
    currentChapter--;
    currentPage = chapters[currentChapter].pages.length - 1;
  }
  renderPage();
}

window.goToChapter = function(idx, el) {
  currentChapter = idx;
  currentPage = 0;
  renderPage();
}

window.toggleToc = function() {
  tocVisible = !tocVisible;
  document.getElementById('readerToc').classList.toggle('hidden', !tocVisible);
}

window.zoomIn = function() {
  if (currentFontSize < 1.5) { currentFontSize = Math.round((currentFontSize + 0.1) * 10) / 10; }
  document.getElementById('pageContent').style.fontSize = currentFontSize + 'rem';
}

window.zoomOut = function() {
  if (currentFontSize > 0.7) { currentFontSize = Math.round((currentFontSize - 0.1) * 10) / 10; }
  document.getElementById('pageContent').style.fontSize = currentFontSize + 'rem';
}

window.toggleFullscreen = function() {
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
window.updateProgress = function() {
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
window.switchRole = function(role, btn) {
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
  // Target ALL images in document except modal preview images and playlist thumbnails
  const images = document.querySelectorAll('img:not(#modalImg):not(#vpsImage):not(.playlist-thumb)');
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
  const targetImg = e.target.closest('img:not(#modalImg):not(#vpsImage):not(.playlist-thumb)');
  if (targetImg && !targetImg._zoomHandler) {
    e.stopPropagation();
    openImageModal(targetImg.src, targetImg.alt || 'Gambar BelajarPlus');
  }
});

window.openImageModal = function(src, captionText) {
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

window.closeImageModal = function(e) {
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

// Helper to convert images inside container to Base64 Data URIs to prevent html2canvas blank page bug
async function preparePdfImages(container) {
  const imgs = container.querySelectorAll('img');
  const promises = Array.from(imgs).map(img => {
    return new Promise((resolve) => {
      if (!img.src) return resolve();
      const tempImg = new Image();
      tempImg.crossOrigin = 'anonymous';
      tempImg.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = tempImg.naturalWidth || 600;
          canvas.height = tempImg.naturalHeight || 400;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(tempImg, 0, 0);
          img.src = canvas.toDataURL('image/png');
        } catch (e) {
          console.warn('Canvas dataURL fallback:', e);
        }
        resolve();
      };
      tempImg.onerror = () => resolve();
      tempImg.src = img.src;
    });
  });
  await Promise.all(promises);
}

// === PDF GENERATION FOR OFFICIAL FORMAL MODULE (A4) ===
window.downloadRolePDF = async function(role) {
  if (window.isGeneratingPDF) return;
  window.isGeneratingPDF = true;

  const roleTitles = {
    siswa: 'AKUN SISWA / PELAJAR (12 LANGKAH OPERASIONAL LENGKAP)',
    guru: 'AKUN GURU / PENGAJAR (6 LANGKAH MANAJEMEN PEMBELAJARAN)',
    kepsek: 'AKUN KEPALA SEKOLAH & ADMIN (6 LANGKAH MANAJEMEN EKOSISTEM)'
  };

  const targetContainer = document.getElementById(`steps-${role}`);
  if (!targetContainer) {
    alert('Konten panduan tidak ditemukan!');
    window.isGeneratingPDF = false;
    return;
  }

  const currentEvt = (typeof event !== 'undefined') ? event : (window.event || null);
  const triggerBtn = (currentEvt && currentEvt.currentTarget) ? currentEvt.currentTarget : null;
  const originalText = triggerBtn ? triggerBtn.innerHTML : '';
  if (triggerBtn) {
    triggerBtn.innerHTML = '⏳ Memproses Berkas PDF...';
    triggerBtn.disabled = true;
  }

  // Scroll to top temporarily to ensure html2canvas captures 100% full coordinates without scroll crop
  const savedScrollY = window.scrollY || window.pageYOffset || 0;
  window.scrollTo(0, 0);

  // Dedicated container at top of document for clean html2canvas capture
  const pdfWrapper = document.createElement('div');
  pdfWrapper.id = 'pdfRenderContainer';
  pdfWrapper.style.position = 'relative';
  pdfWrapper.style.margin = '0 auto';
  pdfWrapper.style.width = '700px';
  pdfWrapper.style.zIndex = '99999999';
  pdfWrapper.style.background = '#ffffff';
  pdfWrapper.style.color = '#0f172a';
  pdfWrapper.style.fontFamily = "'Inter', Arial, sans-serif";
  pdfWrapper.style.padding = '24px';
  pdfWrapper.style.boxSizing = 'border-box';
  pdfWrapper.style.opacity = '1';
  pdfWrapper.style.visibility = 'visible';

  // Kop Header
  let pdfHTML = `
    <table style="width: 100%; border-bottom: 3px double #1e3a8a; padding-bottom: 12px; margin-bottom: 24px; background: #ffffff; border-collapse: collapse; table-layout: fixed;">
      <tr>
        <td style="vertical-align: middle; text-align: left;">
          <div style="font-size: 10px; font-weight: 800; color: #2563eb; letter-spacing: 1.5px; text-transform: uppercase;">DOKUMEN RESMI PANDUAN PENGGUNAAN</div>
          <h1 style="font-size: 18px; font-weight: 900; color: #1e3a8a; margin: 3px 0 2px 0;">PERPUSTAKAAN DIGITAL BELAJARPLUS ID</h1>
          <div style="font-size: 11px; font-weight: 700; color: #334155; text-transform: uppercase;">${roleTitles[role] || 'PANDUAN OPERASIONAL'}</div>
          <div style="font-size: 9.5px; color: #64748b; margin-top: 4px;">
            Dokumen Modul Resmi Sekolah • Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </td>
        <td style="vertical-align: middle; text-align: right; width: 140px; padding-right: 6px;">
          <img src="assets/belajar-plus-logo.png" style="width: 120px; height: auto; display: block; margin-left: auto;" />
        </td>
      </tr>
    </table>
  `;

  // Parse each step item into clean block elements
  const steps = targetContainer.querySelectorAll('.step');
  steps.forEach((step, idx) => {
    const stepNum = step.querySelector('.step-number')?.innerText || (idx + 1);
    const stepTitle = step.querySelector('.step-header h3')?.innerText || '';
    const stepTag = step.querySelector('.step-tag')?.innerText || '';
    const stepContent = step.querySelector('.step-content');

    // ── Step header row ──
    const headerHTML = `
      <div style="margin-bottom: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
        <span style="display: inline-block; background: #1e3a8a; color: #ffffff; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 4px; margin-right: 8px;">LANGKAH ${stepNum}</span>
        <span style="font-size: 15px; font-weight: 800; color: #0f172a;">${stepTitle}</span>
        ${stepTag ? `<span style="font-size: 10px; background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 4px; margin-left: 6px; font-weight: 600;">${stepTag}</span>` : ''}
      </div>
    `;

    // ── Intro paragraph (first <p> in step-content) ──
    const introP = stepContent ? stepContent.querySelector('p')?.innerText || '' : '';
    const introHTML = introP ? `<div style="font-size: 12px; color: #334155; line-height: 1.7; margin-bottom: 8px;">${introP}</div>` : '';

    // ── List items from step-content ──
    const listItems = stepContent ? Array.from(stepContent.querySelectorAll('.step-list li')) : [];
    let listHTML = '';
    if (listItems.length > 0) {
      listHTML = `<ul style="margin: 6px 0 8px 0; padding-left: 20px; font-size: 11.5px; color: #334155; line-height: 1.7;">`;
      listItems.forEach(li => {
        listHTML += `<li style="margin-bottom: 5px;">${li.innerHTML}</li>`;
      });
      listHTML += `</ul>`;
    }

    // ── Step note ──
    const stepNote = stepContent ? stepContent.querySelector('.step-note')?.innerHTML || '' : '';
    const noteHTML = stepNote ? `
      <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 8px 12px; margin-top: 8px; font-size: 11px; color: #1e40af; border-radius: 4px;">
        ${stepNote}
      </div>` : '';

    // ── Check if step has pdf-group sub-sections ──
    const pdfGroups = Array.from(step.querySelectorAll('.pdf-group'));

    if (pdfGroups.length > 0) {
      // === MULTI-GROUP STEP (e.g. Step 11): render header+intro once, then each group as [text→images] ===
      pdfHTML += `
        <div style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 22px; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; background: #ffffff;">
          ${headerHTML}
          ${introHTML}
          ${listHTML}
          ${noteHTML}
        </div>
      `;

      pdfGroups.forEach(group => {
        const label = group.getAttribute('data-pdf-label') || '';
        const groupTextEl = group.querySelector('.pdf-group-text');
        const groupText = groupTextEl ? groupTextEl.innerHTML : '';

        // Collect images from this group only
        const groupImgs = Array.from(group.querySelectorAll('.pdf-img, img'));
        const uniqueSrcs = Array.from(new Set(groupImgs.map(img => img.src).filter(Boolean)));
        let groupImgHTML = '';
        if (uniqueSrcs.length > 0) {
          // Render 2 images side-by-side if pair, else stacked
          if (uniqueSrcs.length === 2) {
            groupImgHTML = `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
                <img src="${uniqueSrcs[0]}" style="width: 100%; height: auto; border-radius: 6px; border: 1px solid #cbd5e1;" />
                <img src="${uniqueSrcs[1]}" style="width: 100%; height: auto; border-radius: 6px; border: 1px solid #cbd5e1;" />
              </div>`;
          } else {
            groupImgHTML = `<div style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">`;
            uniqueSrcs.forEach(src => {
              groupImgHTML += `<img src="${src}" style="max-width: 100%; height: auto; border-radius: 6px; border: 1px solid #cbd5e1;" />`;
            });
            groupImgHTML += `</div>`;
          }
        }

        pdfHTML += `
          <div style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 14px; padding: 14px 16px; border: 1px solid #e2e8f0; border-left: 3px solid #3b82f6; border-radius: 8px; background: #f8fafc;">
            <div style="font-size: 11.5px; color: #334155; line-height: 1.7; margin-bottom: 6px;">${groupText}</div>
            ${groupImgHTML}
          </div>
        `;
      });

    } else {
      // === NORMAL STEP: render as single block [text → image] ===
      // Images from .step-visual or .screenshot-img (exclude pdf-img to avoid duplicates)
      const stepImgs = Array.from(step.querySelectorAll('.step-visual img, .screenshot-img:not(.pdf-img)'));
      const uniqueSrcs = Array.from(new Set(stepImgs.map(img => img.src).filter(Boolean)));

      let imgHTML = '';
      if (uniqueSrcs.length > 0) {
        if (uniqueSrcs.length === 2) {
          imgHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
              <img src="${uniqueSrcs[0]}" style="width: 100%; height: auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.08);" />
              <img src="${uniqueSrcs[1]}" style="width: 100%; height: auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.08);" />
            </div>`;
        } else {
          imgHTML = `<div style="margin-top: 10px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px;">`;
          uniqueSrcs.forEach(src => {
            imgHTML += `<img src="${src}" style="max-width: 460px; width: 100%; height: auto; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.08);" />`;
          });
          imgHTML += `</div>`;
        }
      }

      pdfHTML += `
        <div style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 22px; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; background: #ffffff;">
          ${headerHTML}
          ${introHTML}
          ${listHTML}
          ${noteHTML}
          ${imgHTML}
        </div>
      `;
    }
  });

  // Footer
  pdfHTML += `
    <div style="margin-top: 24px; border-top: 1px solid #cbd5e1; padding-top: 12px; text-align: center; font-size: 10px; color: #64748b; background: #ffffff;">
      © ${new Date().getFullYear()} BelajarPlus.id — Hak Cipta Dilindungi. Modul Resmi Operasional Perpustakaan Digital Sekolah.
    </div>
  `;

  pdfWrapper.innerHTML = pdfHTML;
  document.body.insertBefore(pdfWrapper, document.body.firstChild);

  // Pre-load all images into Base64 to guarantee html2canvas never outputs blank rectangles
  await preparePdfImages(pdfWrapper);

  const opt = {
    margin:       [6, 6, 8, 6],
    filename:     `Panduan_BelajarPlus_${role.toUpperCase()}_Resmi.pdf`,
    image:        { type: 'jpeg', quality: 1.0 },
    html2canvas:  { scale: 3, useCORS: true, logging: false, scrollY: 0, scrollX: 0 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['css', 'legacy'] }
  };

  const cleanup = () => {
    window.isGeneratingPDF = false;
    if (document.body.contains(pdfWrapper)) {
      document.body.removeChild(pdfWrapper);
    }
    if (triggerBtn) {
      triggerBtn.innerHTML = originalText;
      triggerBtn.disabled = false;
    }
    window.scrollTo(0, savedScrollY);
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(pdfWrapper).save().then(cleanup).catch(err => {
      console.error('PDF generation error:', err);
      cleanup();
      window.print();
    });
  } else {
    cleanup();
    window.print();
  }
};

// === INTERACTIVE VIDEO TUTORIAL & INDONESIAN VOICEOVER ENGINE ===
const videoTutorialData = {
  siswa: {
    roleTitle: 'Video Panduan Akun Siswa — Panduan Runtut 12 Langkah',
    roleSub: 'Lengkap dengan Voiceover AI Bahasa Indonesia & Subtitle Teks Berjalan Interaktif',
    steps: [
      {
        title: 'Pendaftaran & Aktivasi Akun Siswa',
        image: 'assets/register_siswa.png',
        narration: 'Langkah pertama: Buka portal registrasi belajarplus.id/auth dan pilih tab Daftar. Tentukan peran sebagai Siswa. Jika sekolahmu mitra BelajarPlus, masukkan Kode Sekolah SKL-XXXXX dari admin sekolah agar otomatis mengaitkan akun ke kuota buku gratis. Jika mendaftar mandiri, pilih opsi Umum. Pilih Jenjang pendidikan, Kelas 10 sampai 12, dan Rombel. Masukkan Kode Kelas Guru BLJ-XXXXXX jika ada. Pastikan email yang didaftarkan aktif, lalu buka kotak masuk email kamu untuk melakukan Verifikasi Email.',
        subtitle: 'Langkah 1: Buka portal registrasi belajarplus.id/auth, pilih tab "Daftar", dan tentukan peran Siswa. Masukkan Kode Sekolah (SKL-XXXXX) dari admin sekolah atau opsi Umum. Pilih Jenjang (SD/SMP/SMA/SMK), Kelas (10, 11, 12), Rombel, serta masukkan Kode Kelas Guru (BLJ-XXXXXX). Pastikan email aktif, lalu cek kotak masuk untuk Verifikasi Email.'
      },
      {
        title: 'Login ke Akun Siswa',
        image: 'assets/login.png',
        narration: 'Langkah kedua: Setelah akun terverifikasi melalui email, buka halaman login di belajarplus.id/auth. Masukkan alamat email terdaftar dan kata sandi kamu, lalu klik tombol Masuk untuk masuk ke dashboard utama Pembelajaran Saya. Simpan kredensial kamu dengan aman.',
        subtitle: 'Langkah 2: Setelah verifikasi email berhasil, login di portal belajarplus.id/auth menggunakan email terdaftar dan password kamu. Masuk ke halaman utama Pembelajaran Saya.'
      },
      {
        title: 'Cari & Filter Koleksi Buku Digital',
        image: 'assets/search_filter.png',
        narration: 'Langkah ketiga: Klik menu Perpustakaan pada navigasi atas. Temukan buku pelajaran yang kamu butuhkan dengan cepat menggunakan kolom pencarian, atau manfaatkan filter multi-dimensi pada sidebar kiri untuk menyaring buku berdasarkan Jenjang Kelas 10, 11, 12, serta Mata Pelajaran spesifik seperti Antropologi, Biologi, dan Matematika.',
        subtitle: 'Langkah 3: Buka menu Perpustakaan di navbar atas. Gunakan kolom pencarian cepat atau saring buku lewat filter sidebar berdasarkan Jenjang (Kelas 10–12), Mata Pelajaran (Biologi, Matematika, Antropologi), dan Kategori.'
      },
      {
        title: 'Pinjam Buku Digital Sekolah',
        image: 'assets/book_detail.png',
        narration: 'Langkah keempat: Klik kartu buku yang kamu pilih untuk membuka detail peminjaman. Perhatikan indikator ketersediaan stok buku digital sekolahmu. Jika statusnya Tersedia, klik tombol Pinjam Buku. Peminjaman ini gratis 100% dan berlaku untuk durasi peminjaman otomatis sebelum kembali ke rak digital.',
        subtitle: 'Langkah 4: Klik pada kartu buku yang diinginkan untuk melihat detail. Periksa indikator ketersediaan stok digital sekolah, lalu klik "Pinjam Buku" secara gratis.'
      },
      {
        title: 'Membaca via Interactive Book Reader',
        image: 'assets/book_reader.png',
        narration: 'Langkah kelima: Setelah meminjam buku, klik tombol Baca untuk membuka Interactive Book Reader langsung di browser. Nikmati fitur navigasi modern: gunakan panel Daftar Isi untuk melompat langsung ke Bab pelajaran, sesuaikan ukuran huruf dengan tombol A plus dan A minus, serta aktifkan Mode Fullscreen untuk pengalaman membaca yang lebih fokus.',
        subtitle: 'Langkah 5: Klik tombol "Baca" untuk membuka reader digital BelajarPlus. Gunakan Daftar Isi untuk melompat antar Bab, tombol A+ dan A− untuk Zoom Teks, serta Mode Fullscreen (⛶) untuk membaca fokus.'
      },
      {
        title: 'Akses Tugas & Kuis Kelas Saya',
        image: 'assets/class_assignment.png',
        narration: 'Langkah keenam: Akses ruang kelas kamu melalui menu Kelas Saya, lalu pilih tab Penugasan. Di sini kamu dapat melihat daftar soal latihan, kuis harian, maupun Tryout TKA yang diberikan oleh guru pengajar. Periksa tenggat waktu pengumpulan dan baca instruksi khusus sebelum mulai mengerjakan.',
        subtitle: 'Langkah 6: Buka menu "Kelas Saya", lalu pilih tab "Penugasan" untuk melihat daftar latihan, kuis harian, atau Tryout TKA yang ditugaskan oleh guru pengajar lengkap dengan tenggat waktu.'
      },
      {
        title: 'Isi & Kirim Lembar Jawab Digital (LJD)',
        image: 'assets/assignment_result.png',
        narration: 'Langkah ketujuh: Kerjakan soal pada tampilan Lembar Jawab Digital atau LJD. Pilih opsi jawaban yang tepat untuk setiap nomor soal. Perhatikan hitungan mundur timer ujian serta indikator sistem pengawas kejujuran anti-cheat. Setelah selesai, klik Kirim Lembar Jawaban untuk melihat persentase skor dan rekapitulasi nilai kamu secara real-time.',
        subtitle: 'Langkah 7: Pada layar Lembar Jawab Digital (LJD), pilih opsi jawaban untuk tiap nomor soal. Perhatikan timer ujian dan fitur pemantau kejujuran anti-cheat. Klik "Kirim Lembar Jawaban" untuk melihat hasil real-time.'
      },
      {
        title: 'Kelola Rak "Buku Saya"',
        image: 'assets/my_books.png',
        narration: 'Langkah kedelapan: Buka menu Buku Saya untuk memantau semua buku digital yang sedang aktif kamu pinjam. Kamu bisa melihat sisa durasi peminjaman dan mengembalikan buku yang sudah selesai dibaca agar salinan digital tersebut dapat dipinjam oleh teman sekelasmu.',
        subtitle: 'Langkah 8: Buka menu "Buku Saya" di navigasi atas untuk melihat daftar buku yang sedang aktif dipinjam, sisa durasi masa pinjam, dan mengembalikan buku tepat waktu.'
      },
      {
        title: 'Pembelian Buku Tambahan di Toko',
        image: 'assets/shop.png',
        narration: 'Langkah kesembilan: Apabila kamu memerlukan buku referensi pribadi yang ingin dimiliki secara permanen tanpa batas waktu peminjaman, kamu dapat membelinya melalui menu Toko BelajarPlus. Riwayat dan status transaksi dapat dipantau di menu Pesanan.',
        subtitle: 'Langkah 9: Jika membutuhkan buku referensi pribadi permanen di luar perpustakaan sekolah, beli melalui menu "Toko" dan pantau status transaksi di menu "Pesanan".'
      },
      {
        title: 'Pengaturan Profil Siswa',
        image: 'assets/profile.png',
        narration: 'Langkah kesepuluh: Masuk ke menu Profil untuk memeriksa dan memperbarui informasi akun kamu. Pastikan nomor WhatsApp yang terdaftar aktif agar kamu otomatis menerima notifikasi penugasan baru dari guru pengajar. Kamu juga dapat memperbarui kata sandi secara berkala demi keamanan akun.',
        subtitle: 'Langkah 10: Masuk ke menu "Profil" untuk memperbarui data diri, nomor WhatsApp terhubung agar menerima notifikasi penugasan dari guru, serta mengganti kata sandi akun.'
      },
      {
        title: 'Kelas & Aturan Lembar Jawab Digital (LJD)',
        image: 'assets/assignment_list.png',
        narration: 'Langkah kesebelas: Akses menu Kelas Saya untuk masuk ke ruang kelas spesifik gurumu. Di sana terdapat tiga tab utama: Pengumuman Kelas, Sumber Belajar, dan Aktivitas Belajar. Saat menekan tombol Mulai Ujian, layar akan terkunci pada mode Lembar Jawab Digital. Jangan berpindah tab atau menekan Back selama ujian berlangsung karena sistem anti-cheat akan men-submit jawabanmu secara otomatis.',
        subtitle: 'Langkah 11: Buka "Kelas Saya" untuk akses ruang kelas. Kerjakan LJD dari tab Aktivitas Belajar. Jangan pindah tab atau tekan Back saat ujian karena sistem anti-cheat aktif memantau.'
      },
      {
        title: 'Beli Buku di Toko & Pembayaran Transfer Manual',
        image: 'assets/detail_pesanan_transfer.png',
        narration: 'Langkah kedua belas: Jika butuh buku tambahan atau paket tryout, beli langsung lewat menu Toko. Pilih varian Digital atau Cetak lalu selesaikan Checkout. Pembayaran menggunakan Transfer Bank Manual. Wajib cantumkan Nomor Pesanan pada berita transfer, lalu unggah foto bukti struk pembayaran agar pesanan segera diverifikasi admin dan buku otomatis muncul di menu Buku Saya.',
        subtitle: 'Langkah 12: Beli buku di Toko, transfer manual, cantumkan Nomor Pesanan, dan unggah foto bukti struk agar buku segera diaktifkan admin.'
      }
    ]
  },
  guru: {
    roleTitle: 'Video Panduan Akun Guru / Pengajar — 6 Langkah Kelola Pembelajaran',
    roleSub: 'Langkah pengelolaan kelas, penugasan LJD, dan penilaian siswa',
    steps: [
      {
        title: 'Pendaftaran & Verifikasi Akun Guru',
        image: 'assets/register_guru.png',
        narration: 'Langkah pertama: Akses portal pendaftaran di belajarplus.id/auth, pilih tab Daftar, dan pilih peran Guru atau Pengajar. Masukkan Kode Sekolah Mitra SKL-XXXXX dari admin sekolah serta nomor WhatsApp aktif kamu untuk verifikasi akun pengajar.',
        subtitle: 'Langkah 1: Buka registrasi belajarplus.id/auth, pilih tab "Daftar", dan tentukan peran Guru/Pengajar. Masukkan Kode Sekolah Mitra (SKL-XXXXX) dan nomor WhatsApp aktif.'
      },
      {
        title: 'Akses & Kelola Ruang Kelas Saya',
        image: 'assets/admin_dashboard.png',
        narration: 'Langkah kedua: Masuk ke menu Kelas Saya di dashboard pengajar. Di sini kamu dapat membuat ruang kelas baru, menentukan jenjang serta mata pelajaran, dan membagikan Kode Kelas BLJ-XXXXXX kepada para siswa agar mereka dapat bergabung.',
        subtitle: 'Langkah 2: Buka menu "Kelas Saya" untuk menambah kelas baru, memilih jenjang dan mata pelajaran, serta membagikan Kode Kelas (BLJ-XXXXXX) kepada siswa.'
      },
      {
        title: 'Tautkan Buku Teks Acuan Sekolah',
        image: 'assets/admin_koleksi.png',
        narration: 'Langkah ketiga: Tautkan buku teks pelajaran dari koleksi e-library sekolah ke dalam ruang kelas kamu. Hal ini memudahkan siswa mengakses referensi materi yang wajib dipinjam dan dibaca sebelum mengerjakan soal latihan.',
        subtitle: 'Langkah 3: Pilih judul buku teks pelajaran dari katalog koleksi digital sekolah untuk ditautkan sebagai bahan acuan utama penugasan siswa.'
      },
      {
        title: 'Penyusunan Penugasan & Kuis LJD',
        image: 'assets/class_assignment.png',
        narration: 'Langkah keempat: Buat penugasan baru berupa Lembar Jawab Digital atau LJD. Atur jumlah soal, bobot nilai, tentukan tenggat waktu pengumpulan, serta aktifkan fitur proteksi anti-cheat untuk memantau aktivitas fokus tab siswa saat ujian berlangsung.',
        subtitle: 'Langkah 4: Buat penugasan Lembar Jawab Digital (LJD), atur bobot soal, tentukan deadline pengumpulan, dan aktifkan fitur pengawas kejujuran anti-cheat tab focus.'
      },
      {
        title: 'Monitoring Real-time & Transkrip Nilai',
        image: 'assets/assignment_result.png',
        narration: 'Langkah kelima: Pantau pengerjaan tugas siswa secara real-time. Sistem BelajarPlus secara otomatis menghitung skor, menampilkan rekapitulasi nilai, serta menyediakan analisis ketercapaian KKM dan materi yang perlu diremediasi.',
        subtitle: 'Langkah 5: Pantau status pengerjaan kuis siswa secara real-time. Tinjau rekapitulasi nilai otomatis, grafik ketuntasan KKM kelas, dan analisis jawaban.'
      },
      {
        title: 'Ekspor Laporan Evaluasi Pembelajaran',
        image: 'assets/admin_dashboard.png',
        narration: 'Langkah keenam: Ekspor rekapitulasi nilai dan laporan evaluasi belajar siswa ke dalam format CSV atau Excel dengan satu kali klik. Berkas ini siap digunakan untuk pengisian nilai rapor semester maupun pelaporan dinas.',
        subtitle: 'Langkah 6: Unduh rekapitulasi nilai kelas dan laporan analisis kompetensi siswa dalam format CSV atau Excel untuk berkas evaluasi rapor.'
      }
    ]
  },
  kepsek: {
    roleTitle: 'Video Panduan Kepala Sekolah & Admin — 6 Langkah Manajemen Ekosistem',
    roleSub: 'Manajemen ekosistem digital, lisensi stok buku, dan laporan dinas',
    steps: [
      {
        title: 'Registrasi Instansi & Aktivasi Kode Sekolah',
        image: 'assets/register_guru.png',
        narration: 'Langkah pertama: Registrasikan instansi sekolah kamu pada portal BelajarPlus untuk mengaktifkan Kode Sekolah Mitra resmi. Kode ini akan digunakan oleh seluruh guru dan siswa saat mendaftar agar terhubung ke ekosistem e-library sekolah.',
        subtitle: 'Langkah 1: Daftarkan instansi sekolah ke portal BelajarPlus untuk mengaktifkan Kode Sekolah Mitra (SKL-XXXXX) resmi bagi seluruh civitas sekolah.'
      },
      {
        title: 'Monitoring Executive Dashboard',
        image: 'assets/admin_dashboard.png',
        narration: 'Langkah kedua: Akses Dashboard Eksekutif di portal admin sekolah /admin. Pantau indikator utama perpustakaan digital secara real-time, meliputi grafik intensitas membaca siswa, total eksemplar terpinjam, keaktifan penugasan kelas, dan ringkasan pengguna.',
        subtitle: 'Langkah 2: Pantau statistik grafik minat baca siswa, total eksemplar buku terpinjam, keaktifan kelas, dan ringkasan aktivitas pengguna di /admin.'
      },
      {
        title: 'Manajemen Koleksi & Lisensi Buku Digital',
        image: 'assets/admin_koleksi.png',
        narration: 'Langkah ketiga: Kelola koleksi e-library melalui menu Koleksi dan Lisensi. Admin dapat menambahkan judul buku teks kurikulum terbaru, mengatur jumlah lisensi salinan digital yang dapat dipinjam bersamaan, serta memantau masa aktif lisensi.',
        subtitle: 'Langkah 3: Buka menu "Koleksi & Lisensi" untuk mengatur kuota eksemplar buku digital, memantau masa aktif lisensi, dan menambah judul buku baru.'
      },
      {
        title: 'Pengelolaan Data Pengguna & Rombel',
        image: 'assets/admin_kelas.png',
        narration: 'Langkah keempat: Akses menu Siswa dan Guru untuk mengelola akun pengguna sekolah. Admin dapat mengimpor data pengajar dan peserta didik secara massal via CSV, membagikan rombel kelas, serta membantu reset password akun.',
        subtitle: 'Langkah 4: Impor data siswa dan guru secara kolektif via CSV, kelola pembagian rombel per jenjang kelas, serta lakukan reset password jika diperlukan.'
      },
      {
        title: 'Pengadaan Buku via Portal Toko Penerbit',
        image: 'assets/admin_toko.png',
        narration: 'Langkah kelima: Gunakan fitur Toko dan Kemitraan Penerbit untuk mengajukan pengadaan judul buku teks pelajaran atau buku bacaan pengayaan terbaru secara langsung dari penerbit resmi demi memperluas koleksi e-library sekolah.',
        subtitle: 'Langkah 5: Lakukan pengadaan buku teks dan pengayaan tambahan langsung dari portal penerbit resmi mitra BelajarPlus untuk memperkaya e-library.'
      },
      {
        title: 'Audit Keamanan & Laporan Akreditasi',
        image: 'assets/admin_dashboard.png',
        narration: 'Langkah keenam: Pantau sistem keamanan platform melalui menu Aktivitas Mencurigakan untuk mendeteksi anomali penggunaan akun. Unduh laporan rekapitulasi kinerja perpustakaan digital secara berkala sebagai dokumen pendukung akreditasi sekolah dan dinas pendidikan.',
        subtitle: 'Langkah 6: Pantau log aktivitas anomali pada menu Aktivasi Mencurigakan, serta unduh laporan evaluasi perpustakaan digital resmi untuk berkas akreditasi sekolah.'
      }
    ]
  }
};

let currentVideoRole = 'siswa';
let currentVideoStepIndex = 0;
let isVideoPlaying = false;
let isSubtitlesOn = true;
let isAudioVOOn = true;
let videoTimer = null;
let currentSpeechUtterance = null;

window.openVideoPlayer = function(role) {
  console.log('openVideoPlayer called for:', role);
  currentVideoRole = role || 'siswa';
  currentVideoStepIndex = 0;
  isVideoPlaying = true; // Auto-play video & narration on open!

  const roleData = videoTutorialData[currentVideoRole] || videoTutorialData['siswa'];
  
  const titleElem = document.getElementById('videoRoleTitle');
  const subElem = document.getElementById('videoRoleSub');
  if (titleElem) titleElem.textContent = roleData.roleTitle;
  if (subElem) subElem.textContent = roleData.roleSub;

  const playBtn = document.getElementById('vpcPlayBtn');
  if (playBtn) playBtn.innerHTML = '⏸️ Jeda Video';

  const modal = document.getElementById('videoModal');
  if (modal) {
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.setProperty('opacity', '1', 'important');
    modal.style.setProperty('visibility', 'visible', 'important');
    modal.style.setProperty('pointer-events', 'auto', 'important');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  loadVideoStep(0);
}

window.closeVideoModal = function(e) {
  if (e && e.target && e.target.classList.contains('video-modal-container')) return;
  stopVideoPlay();
  const modal = document.getElementById('videoModal');
  if (modal) {
    modal.style.setProperty('display', 'none', 'important');
    modal.style.setProperty('opacity', '0', 'important');
    modal.style.setProperty('visibility', 'hidden', 'important');
    modal.style.setProperty('pointer-events', 'none', 'important');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Global Event Delegation Fail-safe for Video and PDF buttons
window.loadVideoStep = function(index) {
  const roleData = videoTutorialData[currentVideoRole];
  if (!roleData || !roleData.steps[index]) return;

  currentVideoStepIndex = index;
  const step = roleData.steps[index];
  const total = roleData.steps.length;

  document.getElementById('vpsStepBadge').textContent = `LANGKAH ${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  document.getElementById('vpsImage').src = step.image;
  document.getElementById('vpsSubtitleText').textContent = `"${step.subtitle}"`;
  document.getElementById('vpcStepIndicator').textContent = `Langkah ${index + 1} dari ${total}: ${step.title}`;
  
  const pct = ((index + 1) / total) * 100;
  document.getElementById('vpcProgressFill').style.width = `${pct}%`;

  if (isAudioVOOn && isVideoPlaying) {
    speakNarration(step.narration);
  }

  // Update standalone video.html playlist UI if it exists
  if (typeof renderPlaylist === 'function') {
    renderPlaylist();
  }
}

let ttsAudioPlayer = null;

window.speakNarration = function(text) {
  if (ttsAudioPlayer) {
    ttsAudioPlayer.pause();
    ttsAudioPlayer = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (typeof responsiveVoice !== 'undefined' && responsiveVoice.speak) {
    responsiveVoice.cancel();
  }
  if (videoTimer) {
    clearTimeout(videoTimer);
    videoTimer = null;
  }

  if (!isAudioVOOn || !isVideoPlaying) return;

  // Clean text for natural Indonesian speech reading
  const cleanText = text
    .replace(/BLJ-[A-Z0-9]+/g, 'B L J')
    .replace(/SKL-[A-Z0-9]+/g, 'S K L')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\//g, ' atau ')
    .replace(/-/g, ' ');

  const shortText = cleanText.substring(0, 190);

  // Strategy 1: ResponsiveVoice API (Crystal clear native Indonesian Female Cloud Voice)
  if (typeof responsiveVoice !== 'undefined' && responsiveVoice.speak) {
    responsiveVoice.speak(shortText, "Indonesian Female", {
      rate: 0.92,
      pitch: 1.0,
      onend: function() {
        if (isVideoPlaying) {
          videoTimer = setTimeout(() => {
            nextVideoStep();
          }, 1200);
        }
      },
      onerror: function() {
        fallbackWebSpeech(shortText);
      }
    });
    return;
  }

  // Strategy 2: Google TTS Audio Fallback
  const encodedText = encodeURIComponent(shortText);
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=id&client=tw-ob`;

  try {
    ttsAudioPlayer = new Audio(ttsUrl);
    ttsAudioPlayer.playbackRate = 1.0;
    
    ttsAudioPlayer.onended = () => {
      if (isVideoPlaying) {
        videoTimer = setTimeout(() => {
          nextVideoStep();
        }, 1200);
      }
    };

    ttsAudioPlayer.onerror = () => {
      fallbackWebSpeech(shortText);
    };

    const playPromise = ttsAudioPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        fallbackWebSpeech(shortText);
      });
    }
  } catch (err) {
    fallbackWebSpeech(shortText);
  }
}

function fallbackWebSpeech(text) {
  if (!('speechSynthesis' in window)) return;

  const speakAction = () => {
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(v => 
      v.lang === 'id-ID' || 
      v.lang === 'id_ID' || 
      v.lang.toLowerCase().startsWith('id') || 
      v.name.toLowerCase().includes('indonesi') ||
      v.name.toLowerCase().includes('gadis') ||
      v.name.toLowerCase().includes('andika')
    );

    // CRITICAL FIX: ONLY speak if an Indonesian voice is installed on device OS!
    // NEVER allow falling back to English voice synthesizer!
    if (!indonesianVoice) {
      console.warn('No native Indonesian voice pack on OS. Skipping WebSpeech English accent fallback.');
      if (isVideoPlaying) {
        videoTimer = setTimeout(() => {
          nextVideoStep();
        }, 5000);
      }
      return;
    }

    currentSpeechUtterance = new SpeechSynthesisUtterance(text);
    currentSpeechUtterance.lang = 'id-ID';
    currentSpeechUtterance.rate = 0.93;
    currentSpeechUtterance.pitch = 1.0;
    currentSpeechUtterance.voice = indonesianVoice;

    currentSpeechUtterance.onend = () => {
      if (isVideoPlaying) {
        videoTimer = setTimeout(() => {
          nextVideoStep();
        }, 1500);
      }
    };

    window.speechSynthesis.speak(currentSpeechUtterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = speakAction;
  }
  speakAction();
}

window.toggleVideoPlay = function() {
  const playBtn = document.getElementById('vpcPlayBtn');
  if (isVideoPlaying) {
    stopVideoPlay();
    if (playBtn) playBtn.innerHTML = '▶️ Putar Video &amp; VO';
  } else {
    isVideoPlaying = true;
    if (playBtn) playBtn.innerHTML = '⏸️ Jeda Video';
    const roleData = videoTutorialData[currentVideoRole];
    if (roleData && roleData.steps[currentVideoStepIndex]) {
      speakNarration(roleData.steps[currentVideoStepIndex].narration);
    }
  }
}

window.stopVideoPlay = function() {
  isVideoPlaying = false;
  if (videoTimer) clearTimeout(videoTimer);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  const playBtn = document.getElementById('vpcPlayBtn');
  if (playBtn) playBtn.innerHTML = '▶️ Putar Video &amp; VO';
}

window.nextVideoStep = function() {
  const roleData = videoTutorialData[currentVideoRole];
  if (!roleData) return;

  if (currentVideoStepIndex < roleData.steps.length - 1) {
    loadVideoStep(currentVideoStepIndex + 1);
  } else {
    stopVideoPlay();
    alert('🎉 Video tutorial selesai diputar!');
  }
}

window.prevVideoStep = function() {
  if (currentVideoStepIndex > 0) {
    loadVideoStep(currentVideoStepIndex - 1);
  }
}

window.toggleSubtitles = function() {
  isSubtitlesOn = !isSubtitlesOn;
  const box = document.getElementById('vpsSubtitleBox');
  const btn = document.getElementById('vpcSubToggle');
  if (box) box.style.display = isSubtitlesOn ? 'flex' : 'none';
  if (btn) btn.innerHTML = isSubtitlesOn ? '💬 CC: ON' : '💬 CC: OFF';
}

window.toggleAudioVO = function() {
  isAudioVOOn = !isAudioVOOn;
  const btn = document.getElementById('vpcAudioToggle');
  if (!isAudioVOOn) {
    if (typeof ttsAudioPlayer !== 'undefined' && ttsAudioPlayer) ttsAudioPlayer.pause();
    if (typeof responsiveVoice !== 'undefined') responsiveVoice.cancel();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
  if (btn) btn.innerHTML = isAudioVOOn ? '🔊 VO: ON' : '🔇 VO: OFF';
}

window.toggleVideoFullscreen = function() {
  const container = document.getElementById('videoModalContainer') || document.getElementById('videoModal');
  const btn = document.getElementById('vpcFsToggle');

  const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);

  if (!isFS) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    }
    container.classList.add('is-fullscreen');
    if (btn) btn.innerHTML = '🗗 Keluar Fullscreen';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    container.classList.remove('is-fullscreen');
    if (btn) btn.innerHTML = '⛶ Fullscreen';
  }
}

document.addEventListener('fullscreenchange', handleFsChange);
document.addEventListener('webkitfullscreenchange', handleFsChange);
document.addEventListener('mozfullscreenchange', handleFsChange);
document.addEventListener('MSFullscreenChange', handleFsChange);

function handleFsChange() {
  const container = document.getElementById('videoModalContainer') || document.getElementById('videoModal');
  const btn = document.getElementById('vpcFsToggle');
  const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  
  if (container) {
    container.classList.toggle('is-fullscreen', isFS);
  }
  if (btn) {
    btn.innerHTML = isFS ? '🗗 Keluar Fullscreen' : '⛶ Fullscreen';
  }
}

window.downloadVideoMP4 = function(role) {
  const roleName = role || currentVideoRole || 'siswa';
  generateDynamicVideoDownload(roleName);
};

window.downloadCurrentVideoMP4 = function() {
  downloadVideoMP4(currentVideoRole);
};

async function generateDynamicVideoDownload(role) {
  const roleData = videoTutorialData[role];
  if (!roleData || !roleData.steps || roleData.steps.length === 0) return;

  // 1. Show Progress Modal Overlay
  let progressModal = document.getElementById('videoExportModal');
  if (!progressModal) {
    progressModal = document.createElement('div');
    progressModal.id = 'videoExportModal';
    progressModal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.95); z-index: 1000000;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #ffffff; font-family: 'Inter', sans-serif; text-align: center; padding: 2rem;
    `;
    document.body.appendChild(progressModal);
  }
  progressModal.style.display = 'flex';
  progressModal.innerHTML = `
    <div style="background: #1e293b; border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 2.5rem; max-width: 500px; width: 90%; box-shadow: 0 25px 50px rgba(0,0,0,0.8);">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🎥</div>
      <h3 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: #38bdf8;">Merekam Video Presentation (${role.toUpperCase()})</h3>
      <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.2rem;" id="veStatus">Memproses slide tutorial 1 / ${roleData.steps.length}...</p>
      <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; margin-bottom: 1.2rem;">
        <div id="veProgressBar" style="width: 5%; height: 100%; background: linear-gradient(90deg, #3b82f6, #ec4899); transition: width 0.2s;"></div>
      </div>
      <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 0.8rem 1rem; text-align: left; font-size: 0.8rem; color: #cbd5e1;">
        <strong style="color: #38bdf8;">💡 Catatan Perekaman Browser:</strong>
        <ul style="margin: 0.4rem 0 0 1.2rem; padding: 0;">
          <li>Video hasil download berisi <strong>Visual HD 1280x720 + Subtitle CC Kuning</strong>.</li>
          <li>Untuk mendengar <strong>Suara Voiceover Indonesia Live (ResponsiveVoice)</strong>, putar langsung di Player Interaktif Web!</li>
        </ul>
      </div>
    </div>
  `;

  // 2. Offscreen Canvas & Audio Stream Setup
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  const loadImage = (src) => new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  // Setup MediaRecorder & Web Audio Stream
  let recordedChunks = [];
  let canvasStream = canvas.captureStream(30);

  let audioCtx = null;
  let audioDest = null;
  let stream = canvasStream;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      audioDest = audioCtx.createMediaStreamDestination();
      stream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDest.stream.getAudioTracks()
      ]);
    }
  } catch (e) {
    console.warn('AudioContext stream mixing fallback:', e);
  }
  
  let mimeType = 'video/webm';
  if (typeof MediaRecorder !== 'undefined') {
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
      mimeType = 'video/mp4;codecs=h264';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
    }
  }

  let mediaRecorder;
  try {
    mediaRecorder = new MediaRecorder(stream, { mimeType });
  } catch (e) {
    mediaRecorder = new MediaRecorder(stream);
  }

  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: mimeType });
    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const fileName = `Tutorial_BelajarPlus_${role.toUpperCase()}.${ext}`;
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);

    progressModal.style.display = 'none';
  };

  mediaRecorder.start();

  // 3. Render steps into canvas (6 seconds per slide = 60s total HD tutorial video)
  const logoImg = await loadImage('assets/belajar-plus-logo.png');

  for (let i = 0; i < roleData.steps.length; i++) {
    const step = roleData.steps[i];
    const pct = Math.round(((i + 1) / roleData.steps.length) * 100);
    const statusEl = document.getElementById('veStatus');
    const barEl = document.getElementById('veProgressBar');
    if (statusEl) statusEl.innerText = `Merekam slide ${i + 1} dari ${roleData.steps.length}: ${step.title}`;
    if (barEl) barEl.style.width = `${pct}%`;

    const img = await loadImage(step.image);

    // Generate subtle audio harmonic ping for step change on Web Audio stream
    if (audioCtx && audioDest) {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 note
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioDest);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {}
    }

    // 150 frames at 30fps = 5.0 seconds per slide (50 seconds total video duration)
    const frameCount = 150;
    const fullSubText = step.subtitle || step.narration || '';

    // Simulated mouse cursor target positions for app interaction recording feel
    const cursorStartX = 150 + Math.random() * 100;
    const cursorStartY = 550;
    const cursorTargetX = 640 + (i % 3 - 1) * 150;
    const cursorTargetY = 320 + (i % 2) * 80;

    for (let frame = 0; frame < frameCount; frame++) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1280, 720);

      // Header Banner
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 1280, 70);
      if (logoImg) {
        ctx.drawImage(logoImg, 24, 15, 140, 40);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.fillText(`— Interactive Simulation (${roleData.roleTitle})`, 180, 43);
      } else {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillText(`🎬 BelajarPlus Interactive Simulation — ${roleData.roleTitle}`, 30, 44);
      }

      // Step Badge
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillText(`LANGKAH ${String(i + 1).padStart(2, '0')} / ${String(roleData.steps.length).padStart(2, '0')} : ${step.title}`, 30, 110);

      // Draw Screenshot Image
      if (img) {
        const maxImgW = 1000;
        const maxImgH = 460;
        let imgW = img.width;
        let imgH = img.height;
        const scale = Math.min(maxImgW / imgW, maxImgH / imgH);
        imgW = imgW * scale;
        imgH = imgH * scale;
        const imgX = (1280 - imgW) / 2;
        const imgY = 130 + (maxImgH - imgH) / 2;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 20;
        ctx.drawImage(img, imgX, imgY, imgW, imgH);
        ctx.restore();
      }

      // Simulated Smooth Mouse Cursor Pointer Animation
      const progress = frame / frameCount;
      const easeProgress = Math.sin((progress * Math.PI) / 2); // Easing curve
      const currentCursorX = cursorStartX + (cursorTargetX - cursorStartX) * easeProgress;
      const currentCursorY = cursorStartY + (cursorTargetY - cursorStartY) * easeProgress;

      // Draw Click Ripple Animation at 60-80% progress
      if (progress >= 0.6 && progress <= 0.85) {
        const rippleRadius = (progress - 0.6) * 120;
        const rippleAlpha = 1 - (progress - 0.6) / 0.25;
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(rippleAlpha, 0)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cursorTargetX, cursorTargetY, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Mouse Cursor Pointer Icon
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(currentCursorX, currentCursorY);
      ctx.lineTo(currentCursorX + 14, currentCursorY + 28);
      ctx.lineTo(currentCursorX + 20, currentCursorY + 20);
      ctx.lineTo(currentCursorX + 28, currentCursorY + 32);
      ctx.lineTo(currentCursorX + 32, currentCursorY + 28);
      ctx.lineTo(currentCursorX + 24, currentCursorY + 16);
      ctx.lineTo(currentCursorX + 32, currentCursorY + 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Subtitle Box Container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(60, 610, 1160, 85, 12);
      } else {
        ctx.rect(60, 610, 1160, 85);
      }
      ctx.fill();
      ctx.stroke();

      // Subtitle Badge
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(80, 625, 90, 24, 6);
      } else {
        ctx.rect(80, 625, 90, 24);
      }
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('💬 SUBTITLE', 88, 641);

      // Typewriter Subtitle Text Effect ("Ketik 1 per 1")
      const charsToShow = Math.min(Math.floor((frame / (frameCount * 0.75)) * fullSubText.length), fullSubText.length);
      let typedSub = fullSubText.substring(0, charsToShow);
      if (charsToShow < fullSubText.length && Math.floor(frame / 6) % 2 === 0) {
        typedSub += ' ▌'; // Blinking typewriter cursor
      }

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 15px Inter, sans-serif';
      const displaySub = typedSub.length > 105 ? typedSub.substring(0, 105) + '...' : typedSub;
      ctx.fillText(`"${displaySub}"`, 185, 641);

      await new Promise((r) => setTimeout(r, 15));
    }
  }

  setTimeout(() => {
    mediaRecorder.stop();
  }, 500);
}







})();
