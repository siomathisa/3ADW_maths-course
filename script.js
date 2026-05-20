/* ─────────────────────────────────────────
   MATHS × CODE — script.js
   3D wireframe sphere · Tron grid · Particles · Card tilt
───────────────────────────────────────── */

(function () {

  /* ── CANVAS SETUP ─────────────────────── */

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, pts;
  let sphereAngle = 0;
  let gridOffset  = 0;
  let mouseNX = 0, mouseNY = 0; // normalized -0.5..0.5

  const FOV     = 700;
  const DEPTH   = 1600;
  const COUNT   = 36;
  const CONN    = 290;
  const SYMBOLS = ['∑','π','∞','∂','√','∇','∫','⊕','λ','φ','Δ','ℝ','ℂ','×','≡','∈','⟶','⊗'];

  document.addEventListener('mousemove', e => {
    mouseNX = e.clientX / window.innerWidth  - 0.5;
    mouseNY = e.clientY / window.innerHeight - 0.5;
  });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initPoints();
  }

  function initPoints() {
    pts = Array.from({ length: COUNT }, () => ({
      x:  (Math.random() - .5) * W * 2.6,
      y:  (Math.random() - .5) * H * 2.6,
      z:  Math.random() * DEPTH,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .22,
      vz: (Math.random() - .5) * .32,
      s:  SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      sz: 10 + Math.random() * 11,
    }));
  }

  /* ── HELPERS ──────────────────────────── */

  function proj(x3, y3, z3) {
    const s = FOV / (FOV + z3);
    return { x: W/2 + x3 * s, y: H/2 + y3 * s, s };
  }

  function rotY(xr, zr, t) {
    return {
      x: xr * Math.cos(t) - zr * Math.sin(t),
      z: xr * Math.sin(t) + zr * Math.cos(t),
    };
  }

  /* ── WIREFRAME SPHERE ─────────────────── */

  function drawSphere() {
    sphereAngle += 0.0022;
    const t  = sphereAngle;
    const px = mouseNX * 40; // parallax shift with mouse
    const py = mouseNY * 28;
    const R  = Math.min(W, H) * 0.44;
    const cx = W / 2 + px;
    const cy = H / 2 + py;

    const LATS = 9, LONS = 13, SEGS = 52;
    const D    = 680;

    function sProj(x3, y3, z3) {
      const s = D / (D + z3 + 80);
      return { sx: cx + x3 * s, sy: cy + y3 * s };
    }

    // Latitude rings
    for (let i = 1; i < LATS; i++) {
      const phi = (i / LATS) * Math.PI;
      const y3  = Math.cos(phi) * R;
      const lr  = Math.sin(phi) * R;

      ctx.beginPath();
      for (let j = 0; j <= SEGS; j++) {
        const lon    = (j / SEGS) * Math.PI * 2;
        const { x, z } = rotY(Math.cos(lon) * lr, Math.sin(lon) * lr, t);
        const { sx, sy } = sProj(x, y3, z);
        j === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      const a = 0.028 + Math.sin(phi) * 0.038;
      ctx.strokeStyle = `rgba(56,189,248,${a})`;
      ctx.lineWidth = 0.65;
      ctx.stroke();
    }

    // Longitude arcs
    for (let i = 0; i < LONS; i++) {
      const lon_base = (i / LONS) * Math.PI * 2;
      ctx.beginPath();
      for (let j = 0; j <= SEGS; j++) {
        const phi  = (j / SEGS) * Math.PI;
        const xr   = Math.sin(phi) * Math.cos(lon_base) * R;
        const y3   = Math.cos(phi) * R;
        const zr   = Math.sin(phi) * Math.sin(lon_base) * R;
        const { x, z } = rotY(xr, zr, t);
        const { sx, sy } = sProj(x, y3, z);
        j === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = `rgba(56,189,248,0.018)`;
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }

    // Equator highlight
    const phi_eq = Math.PI / 2;
    const lr_eq  = Math.sin(phi_eq) * R;
    ctx.beginPath();
    for (let j = 0; j <= SEGS; j++) {
      const lon    = (j / SEGS) * Math.PI * 2;
      const { x, z } = rotY(Math.cos(lon) * lr_eq, Math.sin(lon) * lr_eq, t);
      const { sx, sy } = sProj(x, 0, z);
      j === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = `rgba(56,189,248,0.075)`;
    ctx.lineWidth = 1.0;
    ctx.stroke();
  }

  /* ── TRON GRID ────────────────────────── */

  function drawGrid() {
    gridOffset = (gridOffset + 0.4) % 80;

    const FLOOR  = H * 0.68;
    const VPX    = W / 2;
    const H_LINES = 10;
    const V_LINES = 20;

    // Horizontal lines (animate toward viewer)
    for (let i = 0; i < H_LINES; i++) {
      const t = ((i / H_LINES) + gridOffset / 80) % 1;
      const y = FLOOR + (H - FLOOR) * Math.pow(t, 1.6);
      const spread = (y - FLOOR) / (H - FLOOR);
      const alpha  = spread * 0.055;
      ctx.beginPath();
      ctx.moveTo(VPX - spread * W * 0.88, y);
      ctx.lineTo(VPX + spread * W * 0.88, y);
      ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Vertical converging lines
    for (let i = 0; i <= V_LINES; i++) {
      const x_floor = VPX - W * 0.88 / 2 + (i / V_LINES) * W * 0.88;
      const centerDist = Math.abs((i / V_LINES) - 0.5) * 2;
      const alpha = 0.022 + (1 - centerDist) * 0.018;
      ctx.beginPath();
      ctx.moveTo(VPX, FLOOR);
      ctx.lineTo(x_floor, H);
      ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }

    // Horizon glow line
    ctx.beginPath();
    ctx.moveTo(0, FLOOR);
    ctx.lineTo(W, FLOOR);
    const horizGrad = ctx.createLinearGradient(0, 0, W, 0);
    horizGrad.addColorStop(0,   'transparent');
    horizGrad.addColorStop(0.2, 'rgba(56,189,248,0.05)');
    horizGrad.addColorStop(0.5, 'rgba(56,189,248,0.12)');
    horizGrad.addColorStop(0.8, 'rgba(56,189,248,0.05)');
    horizGrad.addColorStop(1,   'transparent');
    ctx.strokeStyle = horizGrad;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  /* ── PARTICLE FIELD ───────────────────── */

  function drawParticles() {
    // Connection lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        const d3 = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d3 > CONN) continue;
        const pa = proj(a.x, a.y, a.z);
        const pb = proj(b.x, b.y, b.z);
        if (pa.x < -20 || pa.x > W+20 || pb.x < -20 || pb.x > W+20) continue;
        const alpha = (1 - d3 / CONN) * 0.09 * Math.min(pa.s, pb.s);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    // Symbols
    for (const p of pts) {
      const { x: sx, y: sy, s: sc } = proj(p.x, p.y, p.z);
      if (sx < -70 || sx > W+70 || sy < -70 || sy > H+70) {
        p.x  = (Math.random()-.5)*W*2.6;
        p.y  = (Math.random()-.5)*H*2.6;
        p.z  = DEPTH;
        continue;
      }
      const alpha = Math.min(0.03 + sc * 0.09, 0.15);
      ctx.save();
      ctx.font = `${p.sz * sc}px 'DM Mono', monospace`;
      ctx.fillStyle = `rgba(56,189,248,${alpha})`;
      ctx.fillText(p.s, sx, sy);
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.z -= Math.abs(p.vz);
      if (p.z < 1) p.z = DEPTH;
    }
  }

  /* ── MAIN DRAW LOOP ───────────────────── */

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawSphere();
    drawParticles();
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();

  /* ── CARD TILT + SWEEP ─────────────────── */

  function initCards() {
    const cards = document.querySelectorAll('.card:not(.card-locked), .exo-row');

    cards.forEach(card => {
      let raf = null, isHovered = false;
      let tRX = 0, tRY = 0, cRX = 0, cRY = 0;

      function tick() {
        cRX += (tRX - cRX) * 0.11;
        cRY += (tRY - cRY) * 0.11;
        if (!isHovered) { tRX *= 0.78; tRY *= 0.78; }

        const tz = isHovered ? 12 : 0;
        card.style.transform =
          `perspective(900px) rotateX(${cRX}deg) rotateY(${cRY}deg) translateZ(${tz}px)`;

        const settled = !isHovered && Math.abs(cRX) < 0.04 && Math.abs(cRY) < 0.04;
        if (settled) {
          card.style.transform = '';
          raf = null;
        } else {
          raf = requestAnimationFrame(tick);
        }
      }

      card.addEventListener('mouseenter', () => {
        isHovered = true;
        card.classList.remove('is-scanning');
        void card.offsetWidth; // force reflow to restart animation
        card.classList.add('is-scanning');
        if (!raf) raf = requestAnimationFrame(tick);
      });

      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        tRY =  ((e.clientX - r.left)  / r.width  - 0.5) * 15;
        tRX = -((e.clientY - r.top)   / r.height - 0.5) * 15;
        if (!raf) raf = requestAnimationFrame(tick);
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        tRX = 0; tRY = 0;
        card.classList.remove('is-scanning');
        if (!raf) raf = requestAnimationFrame(tick);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCards);
  } else {
    initCards();
  }

  /* ── SPLASH ─────────────────────────────── */

  const splashEl  = document.getElementById('splash');
  const splashBtn = document.getElementById('splash-yes');
  const siteWrap  = document.querySelector('.site-wrap');

  if (splashEl && splashBtn && siteWrap) {
    siteWrap.style.opacity       = '0';
    siteWrap.style.pointerEvents = 'none';

    splashBtn.addEventListener('click', () => {
      splashBtn.textContent        = 'ENTERING…';
      splashBtn.style.pointerEvents = 'none';
      splashBtn.style.letterSpacing = '0.35em';

      setTimeout(() => {
        splashEl.classList.add('splash-exit');
      }, 160);

      setTimeout(() => {
        splashEl.remove();
        siteWrap.style.transition    = 'opacity 1.1s ease';
        siteWrap.style.opacity       = '1';
        siteWrap.style.pointerEvents = '';
      }, 1100);
    });
  }

})();
