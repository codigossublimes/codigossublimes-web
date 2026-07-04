/* ============================================================
   ARQUITECTURA DE LA PERCEPCIÓN™ — JavaScript principal
   Vanilla JS puro · Sin dependencias propietarias
   ============================================================ */

(function () {
  'use strict';

  // Detectar preferencia de movimiento reducido
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Detectar mobile
  var isMobile = window.innerWidth <= 900;

  /* ============================================================
     1. AOS INIT (Animate On Scroll)
     ============================================================ */
  if (window.AOS) {
    window.AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 80,
      disable: prefersReducedMotion
    });
  }

  /* ============================================================
     2. NAVBAR SCROLL + 9. ACTIVE NAV (Intersection Observer)
     ============================================================ */
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = [];

  // Recolectar secciones que corresponden a los links del navbar
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      var section = document.querySelector(href);
      if (section) {
        sections.push({ link: link, section: section, id: href.substring(1) });
      }
    }
  });

  // Navbar scrolled
  var handleNavbarScroll = function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Active nav por Intersection Observer
  if (sections.length > 0 && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (l) {
            l.classList.remove('nav-active');
          });
          var activeLink = document.querySelector('.nav-links a[href="#' + id + '"]');
          if (activeLink) activeLink.classList.add('nav-active');
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(function (s) {
      navObserver.observe(s.section);
    });
  }

  /* ============================================================
     3. SMOOTH SCROLL para links internos (#seccion)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#' || href.length <= 1) return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = 70; // altura del navbar
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  /* ============================================================
     4. HAMBURGER MENU MOBILE
     ============================================================ */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isActive = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active', isActive);
      navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Cerrar al hacer click en cualquier enlace
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     5. PARTÍCULAS DORADAS (particles.js)
     ============================================================ */
  if (window.particlesJS && document.getElementById('particles-js')) {
    var particleCount = isMobile ? 30 : 80;

    window.particlesJS('particles-js', {
      particles: {
        number: {
          value: particleCount,
          density: { enable: true, value_area: 900 }
        },
        color: { value: '#D4AF37' },
        shape: { type: 'circle' },
        opacity: {
          value: 0.5,
          random: true,
          anim: { enable: !prefersReducedMotion, speed: 0.4, opacity_min: 0.1, sync: false }
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: !prefersReducedMotion, speed: 1.5, size_min: 2, sync: false }
        },
        line_linked: {
          enable: true,
          distance: 140,
          color: '#D4AF37',
          opacity: 0.1,
          width: 1
        },
        move: {
          enable: !prefersReducedMotion,
          speed: 0.7,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out'
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: !isMobile && !prefersReducedMotion, mode: 'grab' },
          onclick: { enable: false },
          resize: true
        },
        modes: {
          grab: { distance: 160, line_linked: { opacity: 0.4 } }
        }
      },
      retina_detect: true
    });
  }

  /* ============================================================
     6. TABS (Ecosistema + Planes)
     ============================================================ */
  var allTabs = document.querySelectorAll('.tab');

  allTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var ecoTarget = tab.getAttribute('data-tab');
      var planTarget = tab.getAttribute('data-plan');

      if (ecoTarget) {
        // Tabs de ecosistema
        document.querySelectorAll('.tab[data-tab]').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(function (tc) {
          if (tc.id && tc.id.startsWith('tab-')) tc.classList.remove('active');
        });
        var ecoContent = document.getElementById('tab-' + ecoTarget);
        if (ecoContent) ecoContent.classList.add('active');
      } else if (planTarget) {
        // Tabs de planes
        document.querySelectorAll('.plan-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        document.querySelectorAll('.plan-content').forEach(function (tc) { tc.classList.remove('active'); });
        var planContent = document.getElementById('plan-' + planTarget);
        if (planContent) planContent.classList.add('active');
      }
    });
  });

  /* ============================================================
     7. CONTADORES ANIMADOS (números de impacto)
     ============================================================ */
  var counters = document.querySelectorAll('.number-value');
  var countersStarted = false;

  var animateCounters = function () {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'), 10);
      var suffix = counter.getAttribute('data-suffix') || '';

      if (prefersReducedMotion) {
        counter.textContent = target.toLocaleString() + suffix;
        return;
      }

      var duration = 2000;
      var startTime = performance.now();

      var update = function (now) {
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        var current = Math.floor(eased * target);
        counter.textContent = current.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(update);
    });
  };

  var numbersSection = document.querySelector('.trajectory-numbers');
  if (numbersSection && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(numbersSection);
  } else if (numbersSection) {
    // Fallback: animar al cargar
    animateCounters();
  }

  /* ============================================================
     8. TOGGLE TEMA: cosmos ↔ mármol claro
     ============================================================ */
  var themeToggle = document.getElementById('themeToggle');
  var body = document.body;

  // Restaurar tema guardado
  var savedTheme = localStorage.getItem('ap-theme');
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = body.getAttribute('data-theme');
      var next = current === 'cosmos' ? 'light' : 'cosmos';
      body.setAttribute('data-theme', next);
      localStorage.setItem('ap-theme', next);
    });
  }

  /* ============================================================
     9. FORM VALIDATION (formulario de contacto)
     ============================================================ */
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validación básica
      var name = contactForm.querySelector('#cf-name');
      var email = contactForm.querySelector('#cf-email');
      var interest = contactForm.querySelector('#cf-interest');
      var message = contactForm.querySelector('#cf-message');
      var valid = true;

      [name, email, interest, message].forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#ff6b6b';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      // Validar formato de email
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.style.borderColor = '#ff6b6b';
        valid = false;
      }

      if (!valid) return;

      // Simulación de envío exitoso
      contactForm.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      }
    });

    // Limpiar borde rojo al corregir
    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  /* ============================================================
     10. MOBILE OPTIMIZATION (prefers-reduced-motion)
     ============================================================ */
  if (prefersReducedMotion) {
    // Deshabilitar animaciones CSS pesadas
    var style = document.createElement('style');
    style.textContent = [
      '.sacred-geometry { animation: none !important; }',
      '.phone-mockup { animation: none !important; }',
      '.scroll-indicator span { animation: none !important; }',
      '.anim-fade-up { animation: none !important; opacity: 1 !important; transform: none !important; }',
      '* { transition-duration: 0.01ms !important; }'
    ].join('\n');
    document.head.appendChild(style);
  }

})();
