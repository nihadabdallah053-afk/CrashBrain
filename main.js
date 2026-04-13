// ── Mobile menu toggle ──
function initNav() {
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!ham || !menu) return;
  ham.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  // Mobile dropdown toggle
  const dropdownToggles = menu.querySelectorAll('.mobile-dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = toggle.closest('.mobile-dropdown');
      dropdown.classList.toggle('open');
    });
  });
  // Close on regular link click (not dropdown toggle)
  menu.querySelectorAll('a:not(.mobile-dropdown-toggle)').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ── Active nav link ──
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
      // Also mark parent dropdown as active
      const dropdown = a.closest('.nav-dropdown, .mobile-dropdown');
      if (dropdown) {
        const toggleLink = dropdown.querySelector('a[href], .mobile-dropdown-toggle');
        if (toggleLink) toggleLink.classList.add('active');
      }
    } else {
      a.classList.remove('active');
    }
  });
}

// ── Scroll reveal ──
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fade-up');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => { el.style.opacity = '0'; io.observe(el); });
}

// ── Navbar scroll style ──
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60
      ? 'rgba(8,8,8,0.97)'
      : 'rgba(13,13,13,0.92)';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setActiveNav();
  initScrollReveal();
  initNavScroll();
});

// ── Reading progress bar ──
function initReadingProgress() {
  const bar = document.createElement('div');
  bar.id = 'reading-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docH > 0 ? (scrollTop / docH * 100) + '%' : '0%';
  });
}

// ── Back to top ──
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-top';
  btn.innerHTML = '↑';
  btn.title = 'Back to top';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── TOC active link on scroll ──
function initTocActive() {
  const toc = document.querySelector('.toc-nav');
  if (!toc) return;
  const links = toc.querySelectorAll('a[href^="#"]');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const link = toc.querySelector(`a[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => io.observe(s));
}

// ── Section dots ──
function initSectionDots() {
  const sections = document.querySelectorAll('section[id]');
  if (sections.length < 3) return;
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'section-dots';
  sections.forEach((sec, i) => {
    const dot = document.createElement('div');
    dot.className = 'sd';
    dot.title = sec.id;
    dot.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth' }));
    dotsWrap.appendChild(dot);
  });
  document.body.appendChild(dotsWrap);
  const dots = dotsWrap.querySelectorAll('.sd');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = Array.from(sections).indexOf(e.target);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgress();
  initBackToTop();
  initTocActive();
  initSectionDots();
});
