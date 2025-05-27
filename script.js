const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

window.addEventListener('resize', () => {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
});

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random() * 3 + 2;
    this.speedX = (Math.random() - 0.5) * 10;  // fast horizontal speed
    this.speedY = (Math.random() - 0.5) * 10;  // fast vertical speed
    this.alpha = 1;
    this.gravity = 0.08;
    this.decay = 0.02 + Math.random() * 0.02;
    this.glow = 25 + Math.random() * 30;  // very bright glow
    this.sparkleTimer = 0;
  }
    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= this.decay;
      this.sparkleTimer++;
  }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;

      // Glow effect
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.glow;

      // Particle body
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Sparkle effect (flickering bright spot)
      if (this.sparkleTimer % 3 === 0) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.x + (Math.random() - 0.5) * 3, this.y + (Math.random() - 0.5) * 3, this.radius / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  let particles = [];

  function createFirework(x, y) {
    const colors = ['#ff0040', '#ffbf00', '#00ffbf', '#0040ff', '#ff00bf', '#40ff00', '#ffffff', '#ff3300', '#33ff33'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 80 + Math.floor(Math.random() * 40);  // dense bursts
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  // Auto fireworks at random intervals & positions
  function autoFireworks() {
    if (particles.length < 200 && Math.random() < 0.08) {
      const x = Math.random() * (W * 0.8) + W * 0.1;
      const y = Math.random() * (H * 0.5) + H * 0.1;
      createFirework(x, y);
    }
  }

  // Click to launch fireworks
  window.addEventListener('click', e => {
    createFirework(e.clientX, e.clientY);
  });

  function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';  // faster fading trails
    ctx.fillRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) particles.splice(i, 1);
    }

    autoFireworks();
    requestAnimationFrame(animate);
  }

  animate();
