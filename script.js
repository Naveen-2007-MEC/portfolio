/* ════════════════════════════════════════════════════════
   NAVEEN P — PORTFOLIO JAVASCRIPT
   Handles: Loader, Cursor, Particles, Typing, Reveal,
            Skill Bars, Smooth Scroll, Nav, Contact Form
════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM READY ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initParticles();
  initTyping();
  initNavbar();
  initReveal();
  initSkillBars();
  initBackToTop();
  initContactForm();
  initSmoothScroll();
});

/* ══════════════════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════════════════ */
function initLoader() {
  document.body.classList.add('loading');
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
    }, 1600);
  });

  // Fallback
  setTimeout(() => {
    loader.classList.add('done');
    document.body.classList.remove('loading');
  }, 3000);
}

/* ══════════════════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth trailing cursor
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Scale on hover
  const interactive = document.querySelectorAll('a, button, input, textarea, .project-card, .service-card, .ach-card');
  interactive.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      trail.style.transform  = 'translate(-50%,-50%) scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      trail.style.transform  = 'translate(-50%,-50%) scale(1)';
    });
  });
}

/* ══════════════════════════════════════════════════════
   3. PARTICLE CANVAS
══════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animationId;

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.r  = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      const colors = ['99,102,241', '139,92,246', '6,182,212', '236,72,153'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  const COUNT = 80;
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animationId = requestAnimationFrame(animate);
  }
  animate();

  // Pause when hero not visible
  const hero = document.getElementById('home');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (!animationId) animate();
    } else {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }, { threshold: 0.1 });
  if (hero) observer.observe(hero);
}

/* ══════════════════════════════════════════════════════
   4. TYPING ANIMATION
══════════════════════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const roles = [
    'Java Developer',
    'Web Developer',
    'Problem Solver',
    'AI Enthusiast',
    'IoT Explorer',
    'Full Stack Learner',
  ];

  let roleIdx = 0, charIdx = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DELETE = 40, PAUSE = 2000;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; type(); }, PAUSE);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? SPEED_DELETE : SPEED_TYPE);
  }
  type();
}

/* ══════════════════════════════════════════════════════
   5. NAVBAR SCROLL & MOBILE MENU
══════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const links    = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll-based navbar style
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
    updateBackToTop();
  });

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      // Animate hamburger
      const spans = toggle.querySelectorAll('span');
      const isOpen = navLinks.classList.contains('open');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
      spans[1].style.opacity   = isOpen ? '0' : '1';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
  }

  // Close nav on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = toggle?.querySelectorAll('span');
      if (spans) { spans[0].style.transform = ''; spans[1].style.opacity = '1'; spans[2].style.transform = ''; }
    });
  });

  function updateActiveLink() {
    let current = 'home';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  }
}

/* ══════════════════════════════════════════════════════
   6. SCROLL REVEAL
══════════════════════════════════════════════════════ */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  // Stagger siblings
  elements.forEach((el, idx) => {
    const siblings = el.parentElement?.querySelectorAll('.reveal') || [];
    const pos = Array.from(siblings).indexOf(el);
    if (pos > 0 && pos < 6) el.dataset.delay = pos * 120;
    observer.observe(el);
  });
}

/* ══════════════════════════════════════════════════════
   7. SKILL BARS
══════════════════════════════════════════════════════ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width + '%';
        setTimeout(() => { fill.style.width = width; }, 300);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
}

/* ══════════════════════════════════════════════════════
   8. BACK TO TOP
══════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function updateBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

/* ══════════════════════════════════════════════════════
   9. CONTACT FORM
══════════════════════════════════════════════════════ */
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate form submission (replace with real backend/EmailJS)
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
      if (status) {
        status.textContent = '✅ Thanks for reaching out! I\'ll get back to you soon.';
        status.style.color = '#10b981';
      }
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        if (status) status.textContent = '';
      }, 4000);
    }, 1800);
  });

  // Floating label effect
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
}

/* ══════════════════════════════════════════════════════
   10. SMOOTH SCROLL
══════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ══════════════════════════════════════════════════════
   11. FLOATING ICON PARALLAX
══════════════════════════════════════════════════════ */
document.addEventListener('mousemove', (e) => {
  const icons = document.querySelectorAll('.fi');
  const xRatio = (e.clientX / window.innerWidth - 0.5) * 20;
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 20;

  icons.forEach((icon, i) => {
    const factor = (i % 3 + 1) * 0.3;
    icon.style.transform = `translateY(${yRatio * factor}px) translateX(${xRatio * factor}px)`;
  });
});

/* ══════════════════════════════════════════════════════
   12. CARD TILT EFFECT
══════════════════════════════════════════════════════ */
function applyTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height * 6).toFixed(2);
      const rotateY = ( x / rect.width  * 6).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

applyTilt('.project-card');
applyTilt('.service-card');
applyTilt('.ach-card');

/* ══════════════════════════════════════════════════════
   13. COUNTER ANIMATION (for stats)
══════════════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target) + '+';
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Observe badge numbers
const badgeNums = document.querySelectorAll('.badge-num');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const val = parseInt(el.textContent);
      if (!isNaN(val)) animateCounter(el, val);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.8 });
badgeNums.forEach(n => counterObs.observe(n));

/* ══════════════════════════════════════════════════════
   14. PROFILE CARD HOVER GLOW
══════════════════════════════════════════════════════ */
document.querySelectorAll('.profile-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 8px 40px rgba(99,102,241,0.25)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

/* ══════════════════════════════════════════════════════
   15. HERO AVATAR MOUSE TRACK (subtle)
══════════════════════════════════════════════════════ */
document.addEventListener('mousemove', (e) => {
  const avatar = document.getElementById('heroAvatar');
  if (!avatar) return;
  const rect = avatar.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / window.innerWidth;
  const dy = (e.clientY - cy) / window.innerHeight;
  avatar.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
});

/* ══════════════════════════════════════════════════════
   16. SCROLL PROGRESS BAR (optional enhancement)
══════════════════════════════════════════════════════ */
const progressBar = document.createElement('div');
progressBar.id = 'scrollProgress';
Object.assign(progressBar.style, {
  position: 'fixed', top: '0', left: '0', height: '3px',
  background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
  zIndex: '9999', width: '0%', transition: 'width 0.1s',
});
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight * 100).toFixed(1);
  progressBar.style.width = pct + '%';
});
