/* ============================================
   PORTFOLIO JS - Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  window.addEventListener('load', () => {
    setTimeout(() => document.querySelector('.preloader')?.classList.add('hidden'), 600);
  });

  // --- Theme Toggle ---
  const themeBtn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  themeBtn?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeBtn.textContent = next === 'light' ? '🌙' : '☀️';
  });

  // --- Mobile Menu ---
  const menuBtn = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuBtn?.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  // --- Active Nav on Scroll ---
  const sections = document.querySelectorAll('.section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navItems.forEach(a => a.classList.remove('active'));
        document.querySelector(`.nav-links a[href="#${e.target.id}"]`)?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });
  sections.forEach(s => observerNav.observe(s));

  // --- Scroll Reveal ---
  const reveals = document.querySelectorAll('.reveal');
  const observerReveal = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); observerReveal.unobserve(e.target); } });
  }, { threshold: 0.15 });
  reveals.forEach(el => observerReveal.observe(el));

  // --- Animated Counters ---
  const counters = document.querySelectorAll('[data-count]');
  const observerCount = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current + suffix;
        }, 25);
        observerCount.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observerCount.observe(c));

  // --- Skill Bar Animation ---
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const observerSkill = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        observerSkill.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(b => observerSkill.observe(b));

  // --- Project Filters ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  // --- 3D Tilt Effect on Project Cards ---
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
      const rotateY = ((x - centerX) / centerX) * 5;

      // Remove translateY and scale for a simple tilt without jump/zoom
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'none'; // remove transition for instant follow
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease';
      // Reset transition to normal after it settles
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease'; // short transition when entering
    });
  });

  // --- Project Image Sliders ---
  document.querySelectorAll('.project-slider').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const dots = slider.querySelectorAll('.slider-dots .dot');
    const count = parseInt(slider.dataset.slides) || dots.length;
    let current = 0;
    function goTo(i) {
      current = i;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    }
    dots.forEach((dot, idx) => dot.addEventListener('click', (e) => { e.stopPropagation(); goTo(idx); }));
    setInterval(() => goTo((current + 1) % count), 3000);
  });

  // --- Scroll to Top ---
  const scrollBtn = document.querySelector('.scroll-top');
  window.addEventListener('scroll', () => {
    scrollBtn?.classList.toggle('visible', window.scrollY > 500);
  });
  scrollBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // --- Cursor Glow Effect ---
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  } else if (glow) { glow.style.display = 'none'; }

  // --- Navbar Scroll Effect ---
  window.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- Typing Effect ---
  const typed = document.getElementById('typedText');
  if (typed) {
    const words = ['Flutter Developer', 'Mobile Engineer', 'UI/UX Enthusiast', 'Problem Solver'];
    let wi = 0, ci = 0, deleting = false;
    function type() {
      const word = words[wi];
      typed.textContent = word.substring(0, ci);
      if (!deleting) {
        ci++;
        if (ci > word.length) { deleting = true; setTimeout(type, 1800); return; }
      } else {
        ci--;
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(type, deleting ? 40 : 80);
    }
    type();
  }

  // --- Simple Particles ---
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    function resize() { w = canvas.width = canvas.parentElement.offsetWidth; h = canvas.height = canvas.parentElement.offsetHeight; }
    resize(); window.addEventListener('resize', resize);
    for (let i = 0; i < 50; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2 + 0.5, dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4, o: Math.random() * 0.3 + 0.1 });
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,99,255,${p.o})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }
});
