/* ═══════════════════════════════════════════════════════════
   YAHYA.DEV — GSAP INIT
   ScrollTrigger · Magnetic · Parallax · Section Reveals
═══════════════════════════════════════════════════════════ */

'use strict';

function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(initGSAP, 100);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── Smooth scroll momentum ── */
  gsap.to(window, { duration: 0 }); // init

  /* ══════════════════════════
     SECTION PARALLAX
  ══════════════════════════ */
  // Hero bg parallax
  const heroBgImg = document.querySelector('.hero-bg img');
  if (heroBgImg) {
    gsap.to(heroBgImg, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // About bg parallax
  const aboutBgImg = document.querySelector('.about-bg img');
  if (aboutBgImg) {
    gsap.to(aboutBgImg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Skills bg parallax
  const skillsBgImg = document.querySelector('.skills-bg img');
  if (skillsBgImg) {
    gsap.to(skillsBgImg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '#skills',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Contact bg parallax
  const contactBgImg = document.querySelector('.contact-bg img');
  if (contactBgImg) {
    gsap.to(contactBgImg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ══════════════════════════
     SECTION ENTRANCE ANIMATIONS
  ══════════════════════════ */

  // Stats bar — stagger
  const statsItems = document.querySelectorAll('.stats-bar .stats-bar-item, .stat-item');
  if (statsItems.length) {
    gsap.fromTo(statsItems,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: statsItems[0].closest('section, div') || statsItems[0],
          start: 'top 80%',
        },
      }
    );
  }

  // About visual — slide from left
  const aboutVisual = document.querySelector('.about-visual');
  if (aboutVisual) {
    gsap.fromTo(aboutVisual,
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutVisual,
          start: 'top 75%',
        },
      }
    );
  }

  // Skills categories — stagger
  const skillCats = document.querySelectorAll('.skill-category');
  if (skillCats.length) {
    gsap.fromTo(skillCats,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: skillCats[0],
          start: 'top 80%',
        },
      }
    );
  }

  // Project cards — stagger
  const projectCards = document.querySelectorAll('.project-card, .p-card');
  if (projectCards.length) {
    gsap.fromTo(projectCards,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: projectCards[0],
          start: 'top 80%',
        },
      }
    );
  }

  // Course cards — stagger
  const courseCards = document.querySelectorAll('.course-card, .c-card');
  if (courseCards.length) {
    gsap.fromTo(courseCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: courseCards[0],
          start: 'top 85%',
        },
      }
    );
  }

  // Roadmap steps
  const roadmapSteps = document.querySelectorAll('.roadmap-step');
  if (roadmapSteps.length) {
    gsap.fromTo(roadmapSteps,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: roadmapSteps[0],
          start: 'top 80%',
        },
      }
    );
  }

  // CTA strip
  const ctaStrip = document.querySelector('.cta-strip-inner, .cta-strip');
  if (ctaStrip) {
    gsap.fromTo(ctaStrip,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaStrip,
          start: 'top 85%',
        },
      }
    );
  }

  /* ══════════════════════════
     MAGNETIC BUTTONS
  ══════════════════════════ */
  document.querySelectorAll('.btn-primary, .btn-outline, [data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.35;
      const dy     = (e.clientY - cy) * 0.35;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ══════════════════════════
     NAV LINKS HOVER LINE
  ══════════════════════════ */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link.querySelector('::after') || link, {
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });

  /* ══════════════════════════
     SCROLL-TRIGGERED TEXT REVEAL
  ══════════════════════════ */
  document.querySelectorAll('[data-gsap-text]').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      }
    );
  });

  /* ══════════════════════════
     HORIZONTAL LINE DRAW
  ══════════════════════════ */
  document.querySelectorAll('.divider').forEach(el => {
    gsap.fromTo(el,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
      }
    );
  });

  /* ══════════════════════════
     CONTACT LINKS STAGGER
  ══════════════════════════ */
  const contactLinks = document.querySelectorAll('.contact-link');
  if (contactLinks.length) {
    gsap.fromTo(contactLinks,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contactLinks[0],
          start: 'top 80%',
        },
      }
    );
  }

  /* ══════════════════════════
     PAGE HERO ENTRANCE (projects/courses)
  ══════════════════════════ */
  const phTag   = document.getElementById('phTag');
  const phTitle = document.getElementById('phTitle');
  const phSub   = document.getElementById('phSub');

  if (phTag && phTitle && phSub) {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(phTag,   { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to(phTitle, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
      .to(phSub,   { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');
  }

  /* ══════════════════════════
     FLOATING ELEMENTS
  ══════════════════════════ */
  document.querySelectorAll('[data-float]').forEach((el, i) => {
    gsap.to(el, {
      y: '-=12',
      duration: 2.5 + i * 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.3,
    });
  });

  /* ══════════════════════════
     HERO STATS CARD TILT
  ══════════════════════════ */
  const statsCard = document.querySelector('.hero-stats-card');
  if (statsCard) {
    document.addEventListener('mousemove', e => {
      const rect = statsCard.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx   = ((e.clientY - cy) / window.innerHeight) * 6;
      const ry   = ((e.clientX - cx) / window.innerWidth)  * -6;
      gsap.to(statsCard, {
        rotateX: rx, rotateY: ry,
        transformPerspective: 1000,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
    statsCard.addEventListener('mouseleave', () => {
      gsap.to(statsCard, {
        rotateX: 0, rotateY: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  }
}

/* ── Wait for DOM ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGSAP);
} else {
  initGSAP();
}
