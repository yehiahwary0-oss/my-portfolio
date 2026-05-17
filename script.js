/* ========================================
   YAHYA.DEV — Portfolio Script v2.0
   Yahya Al-sulami | Full-Stack Developer & UI/UX Architect
   ======================================== */

'use strict';

/* ========================================
   MOUSE GLOW TRACKING (desktop only)
   ======================================== */
const glowOrb1 = document.getElementById('glowOrb1');
const glowOrb2 = document.getElementById('glowOrb2');

if (glowOrb1 && glowOrb2 && window.innerWidth > 768) {
  let rafId;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        glowOrb1.style.left = targetX + 'px';
        glowOrb1.style.top = targetY + 'px';
        glowOrb2.style.left = (targetX - 60) + 'px';
        glowOrb2.style.top = (targetY + 40) + 'px';
        rafId = null;
      });
    }
  }, { passive: true });
}

/* ========================================
   LOADER
   ======================================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');

    // Hero entrance
    document.querySelectorAll('#hero [data-aos], .projects-hero [data-aos]').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 170);
    });
  }, 2000);
});

/* ========================================
   NAVBAR: STICKY + SCROLL
   ======================================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  const backToTop = document.getElementById('backToTop');
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });
}

if (navLinksEl) {
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksEl.classList.remove('open');
    });
  });
}

/* ========================================
   ACTIVE NAV LINK ON SCROLL
   ======================================== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const highlightNav = () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });

/* ========================================
   TYPING ANIMATION — UPDATED FOR FULL-STACK
   ======================================== */
const typingEl = document.getElementById('typing');
if (typingEl) {
  const phrases = [
    'Full-Stack Systems',
    'Laravel & PHP Back-End',
    'Database Architecture',
    'Cinematic UI Experiences',
    'Performance-Driven Apps',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = current.slice(0, charIndex--);
      typingTimeout = setTimeout(typeLoop, 50);
    } else {
      typingEl.textContent = current.slice(0, charIndex++);
      typingTimeout = setTimeout(typeLoop, charIndex > current.length ? 1800 : 72);
    }

    if (!isDeleting && charIndex > current.length) {
      isDeleting = true;
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(typeLoop, 1800);
      return;
    }
    if (isDeleting && charIndex < 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      charIndex = 0;
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(typeLoop, 400);
    }
  }
  setTimeout(typeLoop, 2700);
}

/* ========================================
   SCROLL REVEAL (custom AOS)
   ======================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      const siblings = parent ? parent.querySelectorAll('[data-aos]') : [];
      let delay = 0;
      siblings.forEach(sib => {
        if (!sib.classList.contains('visible')) {
          setTimeout(() => sib.classList.add('visible'), delay);
          delay += 85;
        }
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));

/* ========================================
   COUNTER ANIMATION
   ======================================== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const duration = 2200;
  const step = target / (duration / 16);
  let current = 0;
  const update = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current);
    if (current < target) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

/* ========================================
   SKILL BARS — 3-BLOCK SYSTEM
   ======================================== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        const width = bar.dataset.width;
        if (width) {
          setTimeout(() => {
            bar.style.width = width + '%';
          }, i * 80);
        }
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.skill-block').forEach(block => skillObserver.observe(block));

// Fallback for old skills section
const skillSection = document.getElementById('skills');
if (skillSection) {
  const legacyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const width = bar.dataset.width;
          if (width) bar.style.width = width + '%';
        });
        legacyObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  legacyObserver.observe(skillSection);
}

/* ========================================
   PROJECT FILTER SYSTEM
   ======================================== */
const filterBtns = document.querySelectorAll('.pg-filter-btn');
const projectCards = document.querySelectorAll('.pg-card[data-cat]');
const dividers = document.querySelectorAll('.pg-divider');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter cards with animation
    projectCards.forEach(card => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;

      if (show) {
        card.style.display = '';
        card.classList.remove('hidden');
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = '';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => {
          card.classList.add('hidden');
        }, 300);
      }
    });

    // Show/hide dividers based on filter
    dividers.forEach(divider => {
      divider.style.display = filter === 'all' ? '' : 'none';
    });
  });
});

/* ========================================
   BACK TO TOP
   ======================================== */
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========================================
   CONTACT FORM (FORMSPREE)
   ======================================== */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';
    submitBtn.disabled = true;
    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        formStatus.textContent = '✓ Brief received. I\'ll be in touch shortly.';
        formStatus.style.color = '#22c55e';
        contactForm.reset();
      } else {
        const data = await response.json();
        formStatus.textContent = data.errors
          ? data.errors.map(err => err.message).join(', ')
          : 'Something went wrong. Please try again.';
        formStatus.style.color = '#f87171';
      }
    } catch {
      formStatus.textContent = 'Network error. Please check your connection.';
      formStatus.style.color = '#f87171';
    } finally {
      submitBtn.innerHTML = originalBtnHTML;
      submitBtn.disabled = false;
      setTimeout(() => { formStatus.textContent = ''; }, 6000);
    }
  });
}

/* ========================================
   PREMIUM CARD TILT
   ======================================== */
const tiltCards = document.querySelectorAll(
  '.service-card, .why-card, .stat-card, .skill-block, .projects-cta-box'
);

if (window.innerWidth > 768) {
  tiltCards.forEach(card => {
    card.style.willChange = 'transform';
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-5px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ========================================
   PCTA THUMBNAIL LINKS
   ======================================== */
const schweppesThumb = document.querySelector('.schweppes-thumb');
if (schweppesThumb) {
  schweppesThumb.style.cursor = 'pointer';
  schweppesThumb.addEventListener('click', () => {
    window.open('https://yehiahwary0-oss.github.io/Schweppes/', '_blank');
  });
}
const vortexThumb = document.querySelector('.vortex-thumb');
if (vortexThumb) {
  vortexThumb.style.cursor = 'pointer';
  vortexThumb.addEventListener('click', () => {
    window.open('https://vortex-trader-y.vercel.app/', '_blank');
  });
}
const legacyThumb = document.querySelector('.legacy-thumb');
if (legacyThumb) {
  legacyThumb.style.cursor = 'pointer';
  legacyThumb.addEventListener('click', () => {
    window.location.href = 'projects.html';
  });
}

/* ========================================
   LOGO FALLBACK
   ======================================== */
const logoImg = document.querySelector('.logo-img');
const logoFallback = document.querySelector('.logo-fallback');
if (logoImg) {
  logoImg.addEventListener('error', () => {
    logoImg.style.display = 'none';
    if (logoFallback) logoFallback.style.display = 'block';
  });
}

/* ========================================
   PROJECTS PAGE: PARALLAX SUBTLE
   ======================================== */
if (document.querySelector('.projects-hero') && window.innerWidth > 768) {
  const heroGlow1 = document.querySelector('.projects-hero .glow-1');
  const heroGlow2 = document.querySelector('.projects-hero .glow-2');

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    if (heroGlow1) heroGlow1.style.transform = `translate(${x * 22}px, ${y * 22}px)`;
    if (heroGlow2) heroGlow2.style.transform = `translate(${-x * 16}px, ${-y * 16}px)`;
  }, { passive: true });
}
