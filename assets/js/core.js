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
        initHeroEntrance();
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
    // Only internal, non-hash links
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel')) return;

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

/* ══════════════════════════════
   HERO ENTRANCE (called after preloader)
══════════════════════════════ */
function initHeroEntrance() {
  function tryGSAP() {
    if (typeof gsap === 'undefined') { setTimeout(tryGSAP, 100); return; }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('#hero-tag',   { opacity: 1, y: 0, duration: 0.7, delay: 0.1 })
      .to('#hero-title', { opacity: 1, y: 0, duration: 0.9 }, '-=0.4')
      .to('#hero-role',  { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to('#hero-desc',  { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
      .to('#hero-cta',   { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
      .to('#hero-stats', { opacity: 1, y: 0, duration: 0.7 }, '-=0.3');
  }
  tryGSAP();
}

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
