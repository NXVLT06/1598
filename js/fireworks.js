/* =========================================================
   fireworks.js — 3D Fireworks burst canvas animation
   ========================================================= */

(function () {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let fireworks = [];
  let animId = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function Firework(x, y, color) {
    this.x = x;
    this.y = y;
    this.particles = [];

    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 / 60) * i;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: color,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  }

  window.launchFireworks = function (durationMs = 4000) {
    resize();
    fireworks = [];
    const colors = ['#ff7597', '#f43f5e', '#ff4081', '#ffc0cb', '#ffcc00', '#00f2fe'];
    const startTime = Date.now();

    function addBurst() {
      const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      fireworks.push(new Firework(x, y, color));
    }

    addBurst();
    addBurst();

    let burstInterval = setInterval(() => {
      if (Date.now() - startTime < durationMs) {
        addBurst();
      } else {
        clearInterval(burstInterval);
      }
    }, 400);

    function render() {
      ctx.fillStyle = 'rgba(6, 4, 10, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireworks.forEach((fw, index) => {
        fw.particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; // Gravity
          p.alpha -= p.decay;

          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fill();
        });

        fw.particles = fw.particles.filter(p => p.alpha > 0);
      });

      fireworks = fireworks.filter(fw => fw.particles.length > 0);

      if (Date.now() - startTime < durationMs || fireworks.length > 0) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (animId) cancelAnimationFrame(animId);
    render();
  };
})();
