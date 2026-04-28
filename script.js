/* ========================================
   YAHYA.DEV — Portfolio Script
   ======================================== */

'use strict';

/* -------- LOADER -------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    // Trigger hero entrance
    document.querySelectorAll('#hero [data-aos]').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 2000);
});

/* -------- NAVBAR: STICKY + SCROLL -------- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* -------- ACTIVE NAV LINK ON SCROLL -------- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const highlightNav = () => {
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
};
window.addEventListener('scroll', highlightNav);

/* -------- TYPING ANIMATION -------- */
const typingEl = document.getElementById('typing');
const phrases = [
  'Front-End Developer',
  'UI Craftsman',
  'Performance Optimizer',
  'Clean Code Writer',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeLoop() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typingEl.textContent = current.slice(0, charIndex--);
    typingTimeout = setTimeout(typeLoop, 60);
  } else {
    typingEl.textContent = current.slice(0, charIndex++);
    typingTimeout = setTimeout(typeLoop, charIndex > current.length ? 1800 : 80);
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
setTimeout(typeLoop, 2500);

/* -------- SCROLL REVEAL (custom AOS) -------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children of grids
      const siblings = entry.target.parentElement.querySelectorAll('[data-aos]');
      let delay = 0;
      siblings.forEach(sib => {
        if (!sib.classList.contains('visible')) {
          setTimeout(() => sib.classList.add('visible'), delay);
          delay += 100;
        }
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));

/* -------- COUNTER ANIMATION -------- */
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
  const duration = 2000;
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

/* -------- SKILL BARS -------- */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const width = bar.dataset.width;
        bar.style.width = width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillSection = document.getElementById('skills');
if (skillSection) skillObserver.observe(skillSection);

/* -------- BACK TO TOP -------- */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* -------- CONTACT FORM -------- */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill in all required fields.';
      formStatus.style.color = '#f87171';
      return;
    }

    // Build mailto link (no backend needed)
    const subject = encodeURIComponent(contactForm.subject.value || `Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:yehiaadel515@gmail.com?subject=${subject}&body=${body}`;

    formStatus.textContent = '✓ Opening your email client...';
    formStatus.style.color = '#22c55e';

    setTimeout(() => {
      contactForm.reset();
      formStatus.textContent = '';
    }, 3000);
  });
}

/* -------- SMOOTH HOVER CARD TILT (subtle) -------- */
document.querySelectorAll('.service-card, .project-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* -------- LOGO FALLBACK -------- */
// If loge.jpeg doesn't exist, show text logo
const logoImg = document.querySelector('.logo-img');
const logoFallback = document.querySelector('.logo-fallback');
if (logoImg) {
  logoImg.addEventListener('error', () => {
    logoImg.style.display = 'none';
    if (logoFallback) logoFallback.style.display = 'block';
  });
}
