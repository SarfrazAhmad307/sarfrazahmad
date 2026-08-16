/* ============================================================
   SARFRAZ AHMAD — PORTFOLIO JAVASCRIPT
   ============================================================ */

/* ── LOADER ──────────────────────────────── */
(function () {
  const loader   = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  let pct = 0;

  const tick = setInterval(() => {
    pct += Math.random() * 18;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      setTimeout(() => loader.classList.add('hidden'), 300);
    }
    progress.style.width = pct + '%';
  }, 60);
})();

/* ── CUSTOM CURSOR ───────────────────────── */
(function () {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let cx = 0, cy = 0, cfx = 0, cfy = 0;

  document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

  (function raf() {
    cursor.style.transform   = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    cfx += (cx - cfx) * 0.1;
    cfy += (cy - cfy) * 0.1;
    follower.style.transform = `translate(${cfx}px,${cfy}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  })();
})();

/* ── NAV SCROLL ──────────────────────────── */
(function () {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
})();

/* ── HAMBURGER ───────────────────────────── */
(function () {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const links      = mobileMenu.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
})();

/* ── TYPED TEXT ──────────────────────────── */
(function () {
  const roles = [
    'NLP Researcher',
    'Data Scientist',
    'LLM Engineer',
    'AI Researcher',
    'Full-Stack Developer',
  ];

  const el = document.getElementById('typedText');
  if (!el) return;

  let ri = 0, ci = 0, deleting = false;

  function type() {
    const current = roles[ri];
    if (deleting) {
      el.textContent = current.substring(0, ci--);
      if (ci < 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 400); return; }
      setTimeout(type, 50);
    } else {
      el.textContent = current.substring(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(type, 1800); return; }
      setTimeout(type, 90);
    }
  }

  setTimeout(type, 1400);
})();

/* ── PARTICLE CANVAS ─────────────────────── */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = canvas.closest('.hero').offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('DOMContentLoaded', resize);

  document.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  const COUNT = 80;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Mouse attraction
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x += dx * 0.01;
        p.y += dy * 0.01;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,217,192,0.5)';
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,217,192,${0.15 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── AOS INIT ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
});

/* ── COUNTER ANIMATION ───────────────────── */
(function () {
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3); // cubic ease-out
      el.textContent = Math.round(target * ease);
      if (pct < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.about-stats').forEach(el => observer.observe(el));
})();

/* ── TECH CLOUD HOVER GLOW ───────────────── */
(function () {
  document.querySelectorAll('.tc-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      const hue = Math.floor(Math.random() * 60) - 30; // slight hue shift
      tag.style.setProperty('--accent', `hsl(${174 + hue},100%,43%)`);
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.removeProperty('--accent');
    });
  });
})();

/* ── PROJECT FILTER ──────────────────────── */
(function () {
  const buttons  = document.querySelectorAll('.filter-btn');
  const cards    = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ── BACK TO TOP ─────────────────────────── */
(function () {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── CONTACT FORM ────────────────────────── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('.btn-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();

/* ── ACTIVE NAV LINK ON SCROLL ───────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--accent)' : '';
    });
  });
})();

/* ── SMOOTH REVEAL for hero ──────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 200);
});
