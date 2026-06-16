/* ═══════════════════════════════════════════════════════════
   YAHYA.DEV — CORE JS
   Cursor · Scroll · Reveal · Utils · Lang · Theme · Preloader
═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════
   PRELOADER
══════════════════════════════ */
function initPreloader() {
  const loader = document.getElementById('preloader');
  if (!loader) return;

  const fill  = loader.querySelector('.preloader-bar-fill');
  const count = loader.querySelector('.preloader-count');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      }, 300);
    }
    if (fill)  fill.style.width  = progress + '%';
    if (count) count.textContent = Math.floor(progress) + '%';
  }, 60);
}

/* ══════════════════════════════
   CUSTOM CURSOR
══════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  let isTouch = false;

  // Detect touch → hide cursor
  window.addEventListener('touchstart', () => {
    isTouch = true;
    dot.style.display  = 'none';
    ring.style.display = 'none';
  }, { once: true });

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  // Hover state on interactive elements
  const interactiveSelector = 'a, button, [data-hover], input, textarea, select, label';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // RAF loop — dot only
  (function animateCursor() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    requestAnimationFrame(animateCursor);
  })();
}

/* ══════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ══════════════════════════════
   NAVBAR
══════════════════════════════ */
function initNavbar() {
  const nav  = document.getElementById('navbar');
  const ham  = document.getElementById('hamburger');
  const mob  = document.getElementById('mobileMenu');
  const logo = document.querySelector('.nav-logo');

  if (!nav) return;

  // Scroll → scrolled class
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger
  if (ham && mob) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      mob.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open);
      mob.setAttribute('aria-hidden', !open);
    });
  }

  // Close mobile menu on link click
  mob && mob.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham && ham.classList.remove('open');
      mob.classList.remove('open');
    });
  });

  // Logo popup — click on image opens profile card, text navigates home
  if (logo) {
    const logoImgWrap = logo.querySelector('.nav-logo-img-wrap');

    // Only image area triggers popup
    if (logoImgWrap) {
      logoImgWrap.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = logo.classList.toggle('active');
        logo.setAttribute('aria-expanded', String(isOpen));
      });
    }

    // Keyboard support
    logo.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = logo.classList.toggle('active');
        logo.setAttribute('aria-expanded', String(isOpen));
      }
    });

    // Click outside → close
    document.addEventListener('click', e => {
      if (!logo.contains(e.target)) {
        logo.classList.remove('active');
        logo.setAttribute('aria-expanded', 'false');
      }
    });

    // Escape → close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        logo.classList.remove('active');
        logo.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active nav link on scroll
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"], .nav-link[data-section]');

  if (sections.length && navLinks.length) {
    const setActive = () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      navLinks.forEach(a => {
        const href = a.getAttribute('href') || '';
        a.classList.toggle('active', href === '#' + current);
      });
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }
}

/* ══════════════════════════════
   SCROLL REVEAL
══════════════════════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════
   SKILL BARS
══════════════════════════════ */
function initSkillBars() {
  const categories = document.querySelectorAll('.skill-category, [data-skills]');
  if (!categories.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = (bar.dataset.width || 0) + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  categories.forEach(el => observer.observe(el));
}

/* ══════════════════════════════
   COUNTER ANIMATION
══════════════════════════════ */
function animateCounter(el, target, suffix = '', duration = 1800) {
  const start = performance.now();
  el.textContent = '0' + suffix;
  el.classList.add('counting');

  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out-expo
    const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current  = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else {
      el.textContent = target + suffix;
      setTimeout(() => el.classList.remove('counting'), 100);
    }
  };
  requestAnimationFrame(update);
}

function initCounters() {
  // Target every element that has data-count OR is a .stat-num with a numeric value
  const allCounters = new Set();

  document.querySelectorAll('[data-count]').forEach(el => allCounters.add(el));

  document.querySelectorAll('.stat-num, .stats-bar-num, .about-exp-num, .logo-popup-stat-num').forEach(el => {
    const text   = el.textContent.trim();
    const num    = parseInt(text, 10);
    if (!isNaN(num) && num > 0) {
      const suffix = text.replace(/[0-9]/g, '');
      el.dataset.count  = num;
      el.dataset.suffix = suffix;
      allCounters.add(el);
    }
  });

  if (!allCounters.size) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      if (!isNaN(target)) animateCounter(el, target, suffix);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  allCounters.forEach(el => observer.observe(el));
}

/* ══════════════════════════════
   TYPED TEXT
══════════════════════════════ */
function initTyped(el, strings, opts = {}) {
  if (!el) return;

  const defaults = {
    typeSpeed: 60,
    backSpeed: 35,
    backDelay: 2200,
    loop: true,
    cursor: true,
  };
  const config = { ...defaults, ...opts };

  // Wait for Typed.js if loaded via CDN
  function tryInit() {
    if (typeof Typed !== 'undefined') {
      new Typed(el, {
        strings,
        typeSpeed:  config.typeSpeed,
        backSpeed:  config.backSpeed,
        backDelay:  config.backDelay,
        loop:       config.loop,
        cursorChar: '_',
      });
    } else {
      setTimeout(tryInit, 100);
    }
  }
  tryInit();
}

/* ══════════════════════════════
   LANGUAGE TOGGLE (EN / AR)
══════════════════════════════ */
function initLangToggle() {
  const stored = localStorage.getItem('ya-lang') || 'en';
  applyLang(stored, false);

  document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.lang || 'en';
      applyLang(current === 'en' ? 'ar' : 'en', true);
    });
  });

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyLang(btn.dataset.langBtn, true);
    });
  });
}

function applyLang(lang, save = true) {
  const isAr = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr';

  if (save) localStorage.setItem('ya-lang', lang);

  // Update all translatable elements
  document.querySelectorAll('[data-en][data-ar]').forEach(el => {
    el.textContent = isAr ? el.dataset.ar : el.dataset.en;
  });

  // Placeholder translations
  document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]').forEach(el => {
    el.placeholder = isAr ? el.dataset.arPlaceholder : el.dataset.enPlaceholder;
  });

  // Update lang buttons state
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.langBtn === lang);
  });

  // Update toggle text
  document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
    btn.textContent = isAr ? 'EN' : 'AR';
  });
}

/* ══════════════════════════════
   THEME TOGGLE (Dark / Light)
══════════════════════════════ */
function initThemeToggle() {
  const stored = localStorage.getItem('ya-theme') || 'dark';
  applyTheme(stored, false);

  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
}

function applyTheme(theme, save = true) {
  document.documentElement.dataset.theme = theme;
  if (save) localStorage.setItem('ya-theme', theme);

  const icon = document.querySelector('[data-theme-icon]');
  if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
}

/* ══════════════════════════════
   PARALLAX BG IMAGES
══════════════════════════════ */
function initParallax() {
  const targets = document.querySelectorAll('[data-parallax]');
  if (!targets.length) return;

  const update = () => {
    targets.forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || 0.3;
      const rect   = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const img    = el.querySelector('img, .parallax-inner');
      if (img) img.style.transform = `translateY(${center * speed}px)`;
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

/* ══════════════════════════════
   TILT EFFECT
══════════════════════════════ */
function initTilt() {
  function tryTilt() {
    if (typeof VanillaTilt === 'undefined') { setTimeout(tryTilt, 100); return; }
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 6,
      speed: 400,
      glare: true,
      'max-glare': 0.08,
      scale: 1.02,
    });
  }
  tryTilt();
}

/* ══════════════════════════════
   SMOOTH PAGE TRANSITIONS
══════════════════════════════ */
function initPageTransitions() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Exit animation on internal link click
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only internal, non-hash, non-blank links
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel')) return;
    if (link.getAttribute('target') === '_blank') return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('enter');
      setTimeout(() => {
        window.location.href = href;
      }, 380);
    });
  });

  // Entry animation
  overlay.classList.add('exit');
}

/* ══════════════════════════════
   CONTACT FORM
══════════════════════════════ */
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg   = document.getElementById('formError');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!submitBtn) return;

    const origText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.reset();
        if (successMsg) { successMsg.style.display = 'block'; }
        submitBtn.textContent = 'Sent ✓';
        setTimeout(() => {
          if (successMsg) { successMsg.style.display = 'none'; }
          submitBtn.textContent = origText;
          submitBtn.disabled = false;
        }, 5000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      if (errorMsg) { errorMsg.style.display = 'block'; }
      submitBtn.textContent = 'Try Again';
      submitBtn.disabled = false;
    }
  });
}

/* Hero entrance is now handled purely via CSS animations
   (see .hero-tag, .hero-title, etc. in index-sections.css)
   — guarantees visibility even if GSAP/CDN fails to load. */

/* ══════════════════════════════
   INIT ALL
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('no-scroll');

  initPreloader();
  initCursor();
  initScrollProgress();
  initNavbar();
  initReveal();
  initSkillBars();
  initCounters();
  initLangToggle();
  initThemeToggle();
  initParallax();
  initTilt();
  initPageTransitions();
  initContactForm();
});

/* ══════════════════════════════
   COMMAND PALETTE  Ctrl+K / ⌘K
══════════════════════════════ */
function initCommandPalette() {
  // Inject HTML
  const html = `
<div id="cmd-overlay" aria-hidden="true"></div>
<div id="cmd-palette" role="dialog" aria-modal="true" aria-label="Command palette" hidden>
  <div id="cmd-inner">
    <div id="cmd-search-wrap">
      <span id="cmd-icon">⌘</span>
      <input id="cmd-input" type="text" placeholder="Type a command or search..." autocomplete="off" spellcheck="false"/>
      <kbd id="cmd-esc">ESC</kbd>
    </div>
    <div id="cmd-results" role="listbox"></div>
    <div id="cmd-footer">
      <span><kbd>↑↓</kbd> Navigate</span>
      <span><kbd>↵</kbd> Select</span>
      <span><kbd>ESC</kbd> Close</span>
    </div>
  </div>
</div>`;

  document.body.insertAdjacentHTML('beforeend', html);

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
#cmd-overlay {
  position:fixed;inset:0;z-index:8000;
  background:rgba(2,2,8,0.7);
  backdrop-filter:blur(8px);
  opacity:0;transition:opacity .2s;pointer-events:none;
}
#cmd-overlay.open { opacity:1;pointer-events:all; }

#cmd-palette {
  position:fixed;top:20%;left:50%;
  transform:translateX(-50%) translateY(-12px) scale(0.97);
  width:min(600px,94vw);
  z-index:8001;
  background:rgba(10,10,22,0.97);
  border:1px solid rgba(99,102,241,0.22);
  border-radius:18px;
  overflow:hidden;
  box-shadow:0 32px 80px rgba(0,0,0,0.8),0 0 0 1px rgba(255,255,255,0.04);
  opacity:0;
  transition:opacity .22s var(--ease-out,ease),transform .22s var(--ease-spring,ease);
  pointer-events:none;
}
#cmd-palette.open {
  opacity:1;transform:translateX(-50%) translateY(0) scale(1);
  pointer-events:all;
}
#cmd-search-wrap {
  display:flex;align-items:center;gap:12px;
  padding:16px 20px;
  border-bottom:1px solid rgba(99,102,241,0.1);
}
#cmd-icon {
  font-size:1.1rem;color:rgba(99,102,241,0.7);
  flex-shrink:0;font-family:'JetBrains Mono',monospace;
}
#cmd-input {
  flex:1;background:transparent;border:none;outline:none;
  font-family:'DM Sans',sans-serif;font-size:1rem;
  color:#f1f5f9;caret-color:#06b6d4;
}
#cmd-input::placeholder { color:#475569; }
#cmd-esc {
  font-family:'JetBrains Mono',monospace;font-size:.62rem;
  padding:3px 8px;border-radius:5px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.08);
  color:#64748b;flex-shrink:0;
}
#cmd-results { max-height:320px;overflow-y:auto;padding:8px; }
#cmd-results::-webkit-scrollbar { width:3px; }
#cmd-results::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.4);border-radius:2px; }

.cmd-group-label {
  font-family:'JetBrains Mono',monospace;font-size:.58rem;
  letter-spacing:.2em;text-transform:uppercase;
  color:#475569;padding:10px 12px 6px;
}
.cmd-item {
  display:flex;align-items:center;gap:14px;
  padding:11px 14px;border-radius:10px;
  cursor:none;transition:background .15s;
  border:1px solid transparent;
}
.cmd-item:hover, .cmd-item.selected {
  background:rgba(99,102,241,0.1);
  border-color:rgba(99,102,241,0.18);
}
.cmd-item-icon {
  width:34px;height:34px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  background:rgba(99,102,241,0.08);
  border:1px solid rgba(99,102,241,0.12);
  font-size:.9rem;flex-shrink:0;
}
.cmd-item-text { flex:1; }
.cmd-item-title {
  font-size:.88rem;font-weight:500;color:#f1f5f9;
  font-family:'DM Sans',sans-serif;
}
.cmd-item-desc {
  font-size:.72rem;color:#64748b;
  font-family:'JetBrains Mono',monospace;
  margin-top:1px;
}
.cmd-item-kbd {
  font-family:'JetBrains Mono',monospace;font-size:.6rem;
  padding:2px 7px;border-radius:4px;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  color:#64748b;flex-shrink:0;
}
#cmd-footer {
  display:flex;gap:20px;align-items:center;
  padding:10px 20px;
  border-top:1px solid rgba(99,102,241,0.08);
  background:rgba(99,102,241,0.03);
}
#cmd-footer span {
  display:flex;align-items:center;gap:6px;
  font-family:'JetBrains Mono',monospace;
  font-size:.6rem;color:#475569;
}
#cmd-footer kbd {
  padding:2px 6px;border-radius:4px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.08);
  color:#94a3b8;
}
  `;
  document.head.appendChild(style);

  // Commands
  const commands = [
    { group:'Navigate', icon:'🏠', title:'Go Home',         desc:'Back to homepage',          action:() => window.location.href='index.html' },
    { group:'Navigate', icon:'🚀', title:'View Projects',   desc:'All projects showcase',     action:() => window.location.href='projects.html' },
    { group:'Navigate', icon:'📚', title:'Browse Courses',  desc:'Free coding courses',       action:() => window.location.href='courses.html' },
    { group:'Navigate', icon:'✉', title:'Contact Me',      desc:'Get in touch',              action:() => { window.location.href='index.html#contact'; } },
    { group:'Navigate', icon:'⚡', title:'View Skills',     desc:'Technical arsenal',         action:() => { window.location.href='index.html#skills'; } },
    { group:'Social',   icon:'GH', title:'GitHub',          desc:'github.com/yehiahwary0-oss',action:() => window.open('https://github.com/yehiahwary0-oss','_blank') },
    { group:'Social',   icon:'IG', title:'Instagram',       desc:'@yahya_alsulami515',        action:() => window.open('https://www.instagram.com/yahya_alsulami515','_blank') },
    { group:'Social',   icon:'TK', title:'TikTok',          desc:'@yahya.dev8',               action:() => window.open('https://www.tiktok.com/@yahya.dev8','_blank') },
    { group:'Actions',  icon:'🌙', title:'Toggle Theme',    desc:'Switch dark / light mode',  action:() => { const t=document.documentElement.dataset.theme==='dark'?'light':'dark'; document.documentElement.dataset.theme=t; localStorage.setItem('ya-theme',t); } },
    { group:'Actions',  icon:'🌐', title:'Switch to Arabic', desc:'تبديل اللغة للعربية',       action:() => { if(typeof applyLang==='function') applyLang('ar'); } },
    { group:'Actions',  icon:'🔝', title:'Scroll to Top',   desc:'Back to the beginning',    action:() => window.scrollTo({top:0,behavior:'smooth'}) },
  ];

  const overlay   = document.getElementById('cmd-overlay');
  const palette   = document.getElementById('cmd-palette');
  const input     = document.getElementById('cmd-input');
  const results   = document.getElementById('cmd-results');
  let selectedIdx = 0;
  let filtered    = [...commands];

  function open() {
    overlay.classList.add('open');
    palette.removeAttribute('hidden');
    palette.classList.add('open');
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 50);
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    palette.classList.remove('open');
    setTimeout(() => { palette.setAttribute('hidden',''); }, 220);
    document.body.style.overflow = '';
  }

  function renderResults(query) {
    const q = query.toLowerCase().trim();
    filtered = commands.filter(c =>
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.group.toLowerCase().includes(q)
    );
    selectedIdx = 0;

    // Group by
    const groups = {};
    filtered.forEach(c => {
      if (!groups[c.group]) groups[c.group] = [];
      groups[c.group].push(c);
    });

    let html = '';
    let globalIdx = 0;
    Object.entries(groups).forEach(([group, items]) => {
      html += `<div class="cmd-group-label">${group}</div>`;
      items.forEach(item => {
        const idx = globalIdx++;
        html += `
<div class="cmd-item${idx===0?' selected':''}" data-idx="${idx}" role="option" aria-selected="${idx===0}">
  <div class="cmd-item-icon">${item.icon}</div>
  <div class="cmd-item-text">
    <div class="cmd-item-title">${item.title}</div>
    <div class="cmd-item-desc">${item.desc}</div>
  </div>
</div>`;
      });
    });

    if (!html) html = '<div class="cmd-group-label" style="text-align:center;padding:24px">No results found</div>';
    results.innerHTML = html;

    results.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => execute(parseInt(el.dataset.idx)));
      el.addEventListener('mouseenter', () => {
        selectedIdx = parseInt(el.dataset.idx);
        updateSelected();
      });
    });
  }

  function updateSelected() {
    results.querySelectorAll('.cmd-item').forEach((el, i) => {
      el.classList.toggle('selected', i === selectedIdx);
      el.setAttribute('aria-selected', i === selectedIdx);
    });
    const sel = results.querySelector('.cmd-item.selected');
    if (sel) sel.scrollIntoView({ block:'nearest' });
  }

  function execute(idx) {
    if (filtered[idx]) { filtered[idx].action(); close(); }
  }

  input.addEventListener('input', e => renderResults(e.target.value));

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selectedIdx = Math.min(selectedIdx+1, filtered.length-1); updateSelected(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); selectedIdx = Math.max(selectedIdx-1, 0); updateSelected(); }
    if (e.key === 'Enter')     { execute(selectedIdx); }
    if (e.key === 'Escape')    { close(); }
  });

  overlay.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      palette.hasAttribute('hidden') ? open() : close();
    }
  });

  // Add trigger button to nav
  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    const btn = document.createElement('button');
    btn.id = 'cmd-trigger-btn';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Command palette (Ctrl+K)');
    btn.title = 'Command palette  Ctrl+K';
    btn.style.cssText = 'font-family:var(--font-mono);font-size:.62rem;letter-spacing:.05em;width:auto;padding:0 10px;border-radius:8px;gap:6px;display:flex;align-items:center;';
    btn.innerHTML = '<span style="opacity:.5">⌘</span><span>K</span>';
    btn.addEventListener('click', open);
    navActions.insertBefore(btn, navActions.firstChild);
  }
}

// Init command palette on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCommandPalette);
} else {
  initCommandPalette();
}
