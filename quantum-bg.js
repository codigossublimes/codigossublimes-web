/**
 * Quantum Background — Arquitectura de la Percepción™
 * Canvas animado: partículas estelares, neuronas conectándose y átomos orbitando.
 * Fijo detrás del contenido. Respeta prefers-reduced-motion.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('quantum-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const GOLD = '212, 175, 55';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, dpr;
  let particles = [];
  let atoms = [];
  let mouseX = -9999, mouseY = -9999;
  let animId = null;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    const count = Math.min(90, Math.floor((W * H) / 18000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.5,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005
      });
    }
  }

  function initAtoms() {
    atoms = [];
    const atomCount = W < 768 ? 2 : 4;
    for (let i = 0; i < atomCount; i++) {
      atoms.push({
        x: Math.random() * W,
        y: Math.random() * H,
        rx: Math.random() * 40 + 50,
        ry: Math.random() * 20 + 20,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        electronAngle: Math.random() * Math.PI * 2,
        electronSpeed: Math.random() * 0.015 + 0.008,
        shells: Math.random() > 0.5 ? 3 : 2,
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.15 + 0.08
      });
    }
  }

  function drawParticle(p) {
    const alpha = (Math.sin(p.twinkle) * 0.3 + 0.5) * 0.6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + GOLD + ', ' + alpha + ')';
    ctx.fill();
  }

  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + GOLD + ', ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      // Mouse connection
      const mdx = particles[i].x - mouseX;
      const mdy = particles[i].y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 180) {
        const alpha = (1 - mdist / 180) * 0.2;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = 'rgba(' + GOLD + ', ' + alpha + ')';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  function drawAtom(atom) {
    ctx.save();
    ctx.translate(atom.x, atom.y);
    ctx.globalAlpha = atom.opacity;

    // Orbital shells
    for (let s = 0; s < atom.shells; s++) {
      const rot = atom.rotation + (s * Math.PI) / atom.shells;
      const rx = atom.rx + s * 8;
      const ry = atom.ry + s * 4;
      ctx.save();
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(' + GOLD + ', 0.25)';
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.restore();
    }

    // Nucleus
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + GOLD + ', 0.7)';
    ctx.fill();

    // Electrons on each shell
    for (let s = 0; s < atom.shells; s++) {
      const rot = atom.rotation + (s * Math.PI) / atom.shells;
      const rx = atom.rx + s * 8;
      const ry = atom.ry + s * 4;
      const angle = atom.electronAngle + (s * Math.PI * 0.7);
      const ex = Math.cos(angle) * rx;
      const ey = Math.sin(angle) * ry;
      const fx = ex * Math.cos(rot) - ey * Math.sin(rot);
      const fy = ex * Math.sin(rot) + ey * Math.cos(rot);

      // Electron glow
      ctx.beginPath();
      ctx.arc(fx, fy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + GOLD + ', 0.15)';
      ctx.fill();
      // Electron core
      ctx.beginPath();
      ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + GOLD + ', 0.9)';
      ctx.fill();
    }

    ctx.restore();
  }

  function update() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.twinkle += p.twinkleSpeed;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    }
    for (let i = 0; i < atoms.length; i++) {
      const a = atoms[i];
      a.rotation += a.rotSpeed;
      a.electronAngle += a.electronSpeed;
      a.x += a.driftX;
      a.y += a.driftY;
      if (a.x < -100) a.x = W + 100;
      if (a.x > W + 100) a.x = -100;
      if (a.y < -100) a.y = H + 100;
      if (a.y > H + 100) a.y = -100;
    }
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    for (let i = 0; i < particles.length; i++) drawParticle(particles[i]);
    for (let i = 0; i < atoms.length; i++) drawAtom(atoms[i]);
  }

  function animate() {
    update();
    render();
    animId = requestAnimationFrame(animate);
  }

  function start() {
    resize();
    initParticles();
    initAtoms();
    if (reduced) {
      render();
    } else {
      animate();
    }
  }

  // Mouse tracking
  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  window.addEventListener('mouseleave', function () {
    mouseX = -9999;
    mouseY = -9999;
  });

  // Resize debounce
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (animId) cancelAnimationFrame(animId);
      start();
    }, 250);
  });

  // Pause when tab hidden (performance)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    } else if (!reduced && !animId) {
      animate();
    }
  });

  // Init after load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
