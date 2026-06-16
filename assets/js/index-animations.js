/* ═══════════════════════════════════════════════════════════
   YAHYA.DEV — INDEX ANIMATIONS
   ScrollTrigger · Pinned sections · Magnetic · 3D depth
═══════════════════════════════════════════════════════════ */
'use strict';

/* ══════════════════════════════
   SCROLL TO TOP
══════════════════════════════ */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  const circle = btn.querySelector('.st-progress');
  const circumference = 126;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = scrolled / total;
    const offset   = circumference - pct * circumference;

    if (circle) circle.style.strokeDashoffset = offset;
    btn.classList.toggle('visible', scrolled > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Hero entrance is now handled purely via CSS animations
   (see .hero-tag, .hero-title, etc. in index-sections.css)
   — guarantees visibility even if GSAP/CDN fails to load. */

/* ══════════════════════════════
   TERMINAL TYPING EFFECT
══════════════════════════════ */
function initTerminalTyping() {
  const lines = document.querySelectorAll('.t-line[data-type]');
  if (!lines.length) return;

  lines.forEach((line, i) => {
    const text    = line.dataset.type || '';
    const delay   = parseFloat(line.dataset.delay || 0) * 1000;
    const origHTML = line.innerHTML;

    line.innerHTML = '';
    line.style.visibility = 'hidden';

    setTimeout(() => {
      line.style.visibility = 'visible';
      let idx = 0;
      // If line has child elements, just reveal — too complex for char typing
      if (origHTML.includes('<')) {
        line.innerHTML = origHTML;
        return;
      }
      const tick = setInterval(() => {
        line.textContent = text.slice(0, idx++);
        if (idx > text.length) clearInterval(tick);
      }, 30);
    }, delay);
  });
}

/* ══════════════════════════════
   SCROLL TRIGGER SECTIONS
══════════════════════════════ */
function initScrollAnimations() {
  function tryGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(tryGSAP, 100); return;
    }
    gsap.registerPlugin(ScrollTrigger);

    /* ── About — terminal slides in ── */
    const terminal = document.querySelector('.about-terminal');
    if (terminal) {
      gsap.fromTo(terminal,
        { opacity:0, x:-60, rotateY:-8 },
        {
          opacity:1, x:0, rotateY:0,
          duration:1, ease:'power3.out',
          transformPerspective:1000,
          scrollTrigger: { trigger:terminal, start:'top 80%' }
        }
      );
    }
    const xpCard = document.querySelector('.about-xp-card');
    if (xpCard) {
      gsap.fromTo(xpCard,
        { opacity:0, x:-40 },
        {
          opacity:1, x:0, duration:0.8, ease:'power3.out', delay:0.15,
          scrollTrigger: { trigger:xpCard, start:'top 85%' }
        }
      );
    }

    /* ── About text — stagger lines ── */
    const aboutPs = document.querySelectorAll('.about-text p, .about-quote');
    if (aboutPs.length) {
      gsap.fromTo(aboutPs,
        { opacity:0, y:24 },
        {
          opacity:1, y:0, duration:0.65,
          stagger:0.12, ease:'power2.out',
          scrollTrigger: { trigger:aboutPs[0], start:'top 80%' }
        }
      );
    }

    /* ── Skills — cascade from top-left ── */
    const skillCats = document.querySelectorAll('.skill-category');
    if (skillCats.length) {
      gsap.fromTo(skillCats,
        { opacity:0, y:50, scale:0.96 },
        {
          opacity:1, y:0, scale:1,
          duration:0.7, stagger:{ amount:0.4, from:'start' },
          ease:'power3.out',
          scrollTrigger: { trigger:skillCats[0], start:'top 80%' }
        }
      );
    }

    /* ── Projects — alternating left/right ── */
    const projCards = document.querySelectorAll('.project-card');
    projCards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity:0, y:60, x: i%2===0 ? -20 : 20 },
        {
          opacity:1, y:0, x:0,
          duration:0.75, ease:'power3.out',
          delay: (i%2) * 0.1,
          scrollTrigger: { trigger:card, start:'top 82%' }
        }
      );
    });

    /* ── Course cards — wave ── */
    const courseCards = document.querySelectorAll('.course-card');
    if (courseCards.length) {
      gsap.fromTo(courseCards,
        { opacity:0, y:48, scale:0.97 },
        {
          opacity:1, y:0, scale:1,
          duration:0.65, stagger:0.08, ease:'power3.out',
          scrollTrigger: { trigger:courseCards[0], start:'top 83%' }
        }
      );
    }

    /* ── Contact links — slide from left ── */
    const contactLinks = document.querySelectorAll('.contact-link');
    if (contactLinks.length) {
      gsap.fromTo(contactLinks,
        { opacity:0, x:-32 },
        {
          opacity:1, x:0,
          duration:0.6, stagger:0.1, ease:'power3.out',
          scrollTrigger: { trigger:contactLinks[0], start:'top 80%' }
        }
      );
    }

    /* ── Section headers ── */
    document.querySelectorAll('.section-label, .display-md').forEach(el => {
      gsap.fromTo(el,
        { opacity:0, y:28 },
        {
          opacity:1, y:0, duration:0.8, ease:'power3.out',
          scrollTrigger: { trigger:el, start:'top 88%' }
        }
      );
    });

    /* ── Dividers draw ── */
    document.querySelectorAll('.divider').forEach(el => {
      gsap.fromTo(el,
        { scaleX:0, transformOrigin:'left center' },
        {
          scaleX:1, duration:0.9, ease:'power3.out',
          scrollTrigger: { trigger:el, start:'top 90%' }
        }
      );
    });

    /* ── Hero aurora subtle drift on scroll ── */
    const heroAurora = document.querySelector('.hero-aurora');
    if (heroAurora) {
      gsap.to(heroAurora, {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero', start: 'top top',
          end: 'bottom top', scrub: 1.5
        }
      });
    }

    /* ── Stats card 3D tilt on scroll ── */
    const statsCard = document.querySelector('.hero-dash');
    if (statsCard) {
      gsap.to(statsCard, {
        rotateX:4, rotateY:-3,
        transformPerspective:800,
        ease:'none',
        scrollTrigger: {
          trigger:'#hero', start:'top top',
          end:'40% top', scrub:true
        }
      });
    }

    /* ── Tech marquee fade on scroll ── */
    const marquee = document.querySelector('.tech-marquee-section');
    if (marquee) {
      gsap.fromTo(marquee,
        { opacity:0, y:20 },
        { opacity:1, y:0, duration:0.8, ease:'power2.out',
          scrollTrigger: { trigger:marquee, start:'top 95%' }
        }
      );
    }
  }
  tryGSAP();
}

/* ══════════════════════════════
   MAGNETIC ELEMENTS
══════════════════════════════ */
function initMagnetic() {
  function tryGSAP() {
    if (typeof gsap === 'undefined') { setTimeout(tryGSAP, 100); return; }

    const magnetEls = document.querySelectorAll(
      '.btn-primary, .btn-outline, .btn-ghost, [data-magnetic], .footer-social, .logo-popup-link'
    );

    magnetEls.forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) * 0.38;
        const dy   = (e.clientY - cy) * 0.38;
        gsap.to(el, { x:dx, y:dy, duration:0.35, ease:'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x:0, y:0, duration:0.6, ease:'elastic.out(1, 0.45)' });
      });
    });
  }
  tryGSAP();
}

/* ══════════════════════════════
   SKILL BAR FILL ON SCROLL
══════════════════════════════ */
function initSkillBarAnimations() {
  const categories = document.querySelectorAll('.skill-category');
  if (!categories.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = (bar.dataset.width || 0) + '%';
          bar.classList.add('animated');
        }, i * 120);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  categories.forEach(el => observer.observe(el));
}

/* ══════════════════════════════
   CURSOR GLOW FOLLOW
   (ambient glow follows mouse)
══════════════════════════════ */
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position:fixed;pointer-events:none;z-index:1;
    width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,
      rgba(99,102,241,0.04) 0%, transparent 65%);
    transform:translate(-50%,-50%);
    transition:opacity 0.3s;
    top:0;left:0;
  `;
  document.body.appendChild(glow);

  let gx = 0, gy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive:true });

  (function animGlow() {
    gx += (tx - gx) * 0.08;
    gy += (ty - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animGlow);
  })();
}

/* ══════════════════════════════
   ACTIVE NAV ON SCROLL (FIX)
══════════════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => {
          const href = a.getAttribute('href') || '';
          const match = href === '#' + id ||
                        href.endsWith('#' + id) ||
                        href === id + '.html';
          a.classList.toggle('active', match);
        });
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '-72px 0px -40% 0px',
  });

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════
   INIT ALL
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollTop();
  initScrollAnimations();
  initMagnetic();
  initSkillBarAnimations();
  initCursorGlow();
  initActiveNav();
  // Terminal typing only if terminal exists
  if (document.querySelector('.about-terminal')) {
    initTerminalTyping();
  }
});
