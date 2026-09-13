/* =========================================================
   confetti.js — Vibrant celebration confetti explosion
   ========================================================= */

(function () {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animId = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createConfettiPiece() {
    const colors = ['#ff7597', '#f43f5e', '#ff4081', '#ffc0cb', '#ffcc00', '#00f2fe', '#4facfe'];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 8 + 4,
      d: Math.random() * 25 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    };
  }

  window.launchConfetti = function (durationMs = 4000) {
    resize();
    particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push(createConfettiPiece());
    }

    const startTime = Date.now();

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        if (p.y > canvas.height) {
          particles[i] = createConfettiPiece();
          particles[i].y = -10;
        }
      });

      if (Date.now() - startTime < durationMs) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (animId) cancelAnimationFrame(animId);
    render();
  };
})();
