/* ============================================================
   ARQUITECTURA DE LA PERCEPCIÓN™ — JavaScript principal
   Vanilla JS puro · Sin dependencias propietarias
   ============================================================ */

(function () {
  'use strict';
     // Botón flotante de WhatsApp en todas las páginas
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('.whatsapp-float')) {
      var waLink = document.createElement('a');
      waLink.className = 'whatsapp-float';
      waLink.href = 'https://wa.me/524433997759?text=' + encodeURIComponent('Hola, me gustaría conocer más sobre Arquitectura de Percepción');
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      waLink.setAttribute('aria-label', 'Escríbenos por WhatsApp');
      waLink.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 4.99L2 22l5.25-1.38c1.45.79 3.08 1.21 4.78 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.68 2 12.04 2zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.24-8.24zm-3.3 4.74c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.6.13.17 1.76 2.72 4.35 3.7 2.15.82 2.59.66 3.06.62.47-.04 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.1-.23-.17-.48-.29-.25-.13-1.5-.74-1.73-.82-.23-.08-.4-.13-.57.13-.17.25-.65.82-.8.99-.15.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.39-.79-1.9-.2-.5-.41-.43-.57-.44-.14-.01-.31-.01-.48-.01z"/></svg>';
      document.body.appendChild(waLink);
    }

     // Agrega "Terremoto App" al menú de navegación y al footer en todas las páginas
    var navLinks = document.querySelector('.nav-links');
    if (navLinks && !navLinks.querySelector('a[href="terremoto.html"]')) {
      var li = document.createElement('li');
      li.innerHTML = '<a href="terremoto.html">Terremoto App</a>';
      var frutos = navLinks.querySelector('a[href="frutos.html"]');
      if (frutos) {
        frutos.parentElement.insertAdjacentElement('afterend', li);
      } else {
        navLinks.appendChild(li);
      }
    }

    var footerLinks = document.querySelector('.footer-links');
    if (footerLinks && !footerLinks.querySelector('a[href="terremoto.html"]')) {
      var liFooter = document.createElement('li');
      liFooter.innerHTML = '<a href="terremoto.html">Terremoto App</a>';
      var frutosFooter = footerLinks.querySelector('a[href="frutos.html"]');
      if (frutosFooter) {
        frutosFooter.parentElement.insertAdjacentElement('afterend', liFooter);
      } else {
        footerLinks.appendChild(liFooter);
      }
    }
  });

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
