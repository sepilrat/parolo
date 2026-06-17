/* ============================================================
   SISTEMAS HIDRÁULICOS — main.js
   Vanilla JS, sin dependencias externas
   ============================================================ */

'use strict';

/* ── Navbar: efecto al scroll ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Burger / Drawer mobile ── */
const burger = document.querySelector('.burger');
const drawer = document.querySelector('.drawer');

if (burger && drawer) {
  const toggle = (force) => {
    const open = typeof force === 'boolean' ? force : !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => toggle());

  // Cerrar al hacer click en cualquier link del drawer
  drawer.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => toggle(false))
  );

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggle(false);
  });
}

/* ── Scroll Reveal ── */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ── Contadores animados ── */
function animateCount(el, target, duration = 1500) {
  const startTime = performance.now();
  const run = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

const statsSection = document.querySelector('.hero__stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          animateCount(el, parseInt(el.dataset.count, 10));
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statsObserver.observe(statsSection);
}

/* ── Smooth scroll para links internos ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id     = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Formulario de contacto (Formspree) ──
   Registrate en formspree.io y reemplazá ACTION en index.html
   ────────────────────────────────────────────────────────── */
const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form && status) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn      = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.disabled    = true;
    btn.textContent = 'Enviando...';
    status.textContent = '';
    status.className   = 'form-status';

    try {
      const response = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        status.textContent = '✓ Mensaje enviado. Te respondemos en el día.';
        status.className   = 'form-status form-status--ok';
        form.reset();
      } else {
        throw new Error('Error del servidor');
      }
    } catch {
      status.textContent = '✕ No se pudo enviar. Escribinos por WhatsApp.';
      status.className   = 'form-status form-status--err';
    } finally {
      btn.disabled    = false;
      btn.textContent = original;
    }
  });
}

/* ── Año dinámico en el footer ── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
