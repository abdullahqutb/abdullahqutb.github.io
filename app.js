'use strict';

// ─── Flower definitions ───────────────────────────────────────────────────────
// Each entry: { x, y } as viewport fractions, size in px, delay in s, palette
// palette = 5 [lightColor, darkColor] pairs, one per layer (outer → inner)
const FLOWERS = [
  {
    x: 0.06, y: 0.07, size: 340, delay: 0.0,
    palette: [
      ['#ffe6ef', '#ffbdd5'],
      ['#ffccdb', '#ff96b6'],
      ['#ffaec6', '#f06a9a'],
      ['#f07a9c', '#cc4a74'],
      ['#dc6082', '#aa3858'],
    ],
  },
  {
    x: 0.91, y: 0.06, size: 255, delay: 0.38,
    palette: [
      ['#ffdde7', '#ffb5cc'],
      ['#ffbfd0', '#ff8cb4'],
      ['#ffa6c0', '#e86a9a'],
      ['#e87898', '#c0507a'],
      ['#d06080', '#a03858'],
    ],
  },
  {
    x: 0.87, y: 0.87, size: 305, delay: 0.68,
    palette: [
      ['#ffe2ec', '#ffbacc'],
      ['#ffc8d8', '#ff92b8'],
      ['#ffaeca', '#e86c9c'],
      ['#e87c9e', '#c0507c'],
      ['#d06888', '#a03e60'],
    ],
  },
  {
    x: 0.09, y: 0.89, size: 210, delay: 0.95,
    palette: [
      ['#ffe8f0', '#ffc8dc'],
      ['#ffd0e2', '#ffa0c0'],
      ['#ffb8d0', '#f07098'],
      ['#f08098', '#cc4e70'],
      ['#dc6080', '#aa3858'],
    ],
  },
  {
    x: 0.68, y: 0.52, size: 230, delay: 1.18,
    palette: [
      ['#ffdde8', '#ffb5ca'],
      ['#ffc3d4', '#ff90b0'],
      ['#ffacc4', '#e86898'],
      ['#e87a98', '#c05075'],
      ['#d06080', '#a03858'],
    ],
  },
];

// Layer config: [petalCount, widthRatio, heightRatio, angularOffset]
// Layers ordered outer → inner
const LAYERS = [
  [14, 0.262, 0.422, 0],
  [12, 0.228, 0.375, 13],
  [10, 0.196, 0.328,  7],
  [8,  0.162, 0.272, 20],
  [6,  0.130, 0.215,  4],
];

// ─── Build flowers ────────────────────────────────────────────────────────────
const scene = document.getElementById('scene');

function buildFlower(cfg) {
  const wrap = document.createElement('div');
  wrap.className = 'flower-wrap';
  wrap.style.left = (cfg.x * 100) + 'vw';
  wrap.style.top  = (cfg.y * 100) + 'vh';
  wrap.dataset.depth = String(0.35 + Math.random() * 0.75);

  // Glow orb
  const orbSz = cfg.size * 1.75;
  const orb = document.createElement('div');
  orb.className = 'glow-orb';
  orb.style.cssText =
    `width:${orbSz}px;height:${orbSz}px;` +
    `left:${-orbSz / 2}px;top:${-orbSz / 2}px;` +
    `background:radial-gradient(circle,rgba(255,145,190,0.20),transparent 66%);` +
    `animation-delay:${cfg.delay}s;` +
    `animation-duration:${8 + Math.random() * 4}s;`;
  wrap.appendChild(orb);

  const flower = document.createElement('div');
  flower.className = 'flower';
  wrap.appendChild(flower);

  LAYERS.forEach(([count, wR, hR, rotOff], li) => {
    const [cA, cB] = cfg.palette[li];
    const w  = cfg.size * wR;
    const h  = cfg.size * hR;
    // Inner layers bloom slightly after outer — feels natural
    const bloomDur   = 0.95 + li * 0.11;
    const bloomDelay = cfg.delay + li * 0.20;
    const swayDur    = 3.6 + li * 0.45 + Math.random() * 1.2;
    const swayDelay  = bloomDelay + bloomDur;

    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i + rotOff;

      // Wrapper only rotates — never animated
      const ring = document.createElement('div');
      ring.className = 'petal-ring';
      ring.style.setProperty('--ring-angle', angle + 'deg');

      // Petal handles scale animation (no rotation conflict)
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.cssText =
        `width:${w}px;height:${h}px;` +
        `left:${-w / 2}px;top:${-h}px;` +
        `background:radial-gradient(ellipse at 42% 26%,${cA},${cB});` +
        `animation:` +
          `petalOpen   ${bloomDur}s  cubic-bezier(0.34,1.52,0.64,1) ${bloomDelay + i * (0.09 / count)}s both,` +
          `petalBreath ${swayDur}s   ease-in-out                     ${swayDelay}s infinite;`;

      ring.appendChild(petal);
      flower.appendChild(ring);
    }
  });

  // Stamen center
  const cs = cfg.size * 0.074;
  const center = document.createElement('div');
  center.className = 'flower-center';
  center.style.cssText =
    `width:${cs}px;height:${cs}px;` +
    `left:${-cs / 2}px;top:${-cs / 2}px;` +
    `background:radial-gradient(circle at 38% 34%,#fffde4,#f5c050);` +
    `box-shadow:0 0 ${cs * 0.9}px rgba(255,210,90,0.75),0 0 ${cs * 2}px rgba(255,170,60,0.35);` +
    `animation:centerPop 0.55s ease-out ${cfg.delay + 1.3}s both;`;
  flower.appendChild(center);

  scene.appendChild(wrap);
}

FLOWERS.forEach(buildFlower);

// ─── Parallax on pointer / touch ──────────────────────────────────────────────
const wraps = Array.from(document.querySelectorAll('.flower-wrap'));

function applyParallax(rx, ry) {
  wraps.forEach(w => {
    const d  = parseFloat(w.dataset.depth);
    const tx = rx * d * 18;
    const ty = ry * d * 15;
    w.style.transform = `translate(${tx}px,${ty}px)`;
  });
}

document.addEventListener('mousemove', e => {
  applyParallax(
    (e.clientX / window.innerWidth  - 0.5) * 2,
    (e.clientY / window.innerHeight - 0.5) * 2,
  );
});

document.addEventListener('touchmove', e => {
  if (!e.touches[0]) return;
  applyParallax(
    (e.touches[0].clientX / window.innerWidth  - 0.5) * 2,
    (e.touches[0].clientY / window.innerHeight - 0.5) * 2,
  );
}, { passive: true });

// ─── Falling petals canvas ────────────────────────────────────────────────────
const canvas = document.getElementById('petals');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// RGB triplets for petal fill
const PETAL_RGB = [
  [255, 185, 210],
  [255, 152, 188],
  [240, 122, 165],
  [255, 215, 230],
  [218, 108, 148],
  [255, 240, 248],
];

class Petal {
  constructor(scatter) { this.reset(scatter); }

  reset(scatter = false) {
    this.x     = Math.random() * canvas.width;
    this.y     = scatter ? Math.random() * canvas.height : -28 - Math.random() * 240;
    this.size  = 5 + Math.random() * 20;
    this.vy    = 0.32 + Math.random() * 1.1;
    this.vx    = (Math.random() - 0.5) * 0.55;
    this.rot   = Math.random() * Math.PI * 2;
    this.rotV  = (Math.random() - 0.5) * 0.044;
    this.phase = Math.random() * Math.PI * 2;
    this.phV   = 0.011 + Math.random() * 0.024;
    this.amp   = 0.45 + Math.random() * 1.7;
    this.alpha = 0.22 + Math.random() * 0.52;
    const c = PETAL_RGB[Math.floor(Math.random() * PETAL_RGB.length)];
    this.r = c[0]; this.g = c[1]; this.b = c[2];
  }

  step() {
    this.phase += this.phV;
    this.x  += this.vx + Math.sin(this.phase) * this.amp;
    this.y  += this.vy;
    this.rot += this.rotV;
    if (this.y > canvas.height + 45 || this.x < -70 || this.x > canvas.width + 70) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.alpha;

    // Petal body
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.37, this.size * 0.61, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
    ctx.fill();

    // Gloss highlight
    ctx.beginPath();
    ctx.ellipse(
      -this.size * 0.07, -this.size * 0.17,
      this.size * 0.13,  this.size * 0.23,
      -0.3, 0, Math.PI * 2,
    );
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.fill();

    ctx.restore();
  }
}

const petals = Array.from({ length: 72 }, () => new Petal(true));

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach(p => { p.step(); p.draw(); });
  requestAnimationFrame(loop);
}

// Let flowers start blooming first, then rain begins
setTimeout(() => requestAnimationFrame(loop), 900);
