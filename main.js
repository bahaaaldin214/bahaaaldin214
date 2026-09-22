(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.getElementById("nav");
  const hero = document.querySelector(".hero");

  function syncNav() {
    if (!nav || !hero) return;
    const past = window.scrollY > hero.offsetHeight - 48;
    nav.classList.toggle("is-solid", past);
  }

  function wireAccordion(listSel, btnSel, openClass) {
    document.querySelectorAll(listSel).forEach((li) => {
      const btn = li.querySelector(btnSel);
      if (!btn) return;
      btn.addEventListener("click", () => {
        const open = li.classList.contains(openClass);
        document.querySelectorAll(listSel + "." + openClass).forEach((other) => {
          other.classList.remove(openClass);
          other.querySelector(btnSel)?.setAttribute("aria-expanded", "false");
        });
        if (!open) {
          li.classList.add(openClass);
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  wireAccordion(".rail > li", ".rail-btn", "is-open");

  const revealSel = ".meet-photo, .polaroid, .rail > li, .project";
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(revealSel).forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(revealSel).forEach((el) => el.classList.add("is-in"));
  }

  // —— Plexus network (hidden for now; remove .is-hidden on #bg-canvas to show) ——
  const canvas = document.getElementById("bg-canvas");
  if (canvas && !reduce && !canvas.classList.contains("is-hidden")) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 90;
    const maxDistance = 160;
    const dot = "rgba(180, 35, 46, 0.75)";
    const line = (a) => `rgba(180, 35, 46, ${a})`;

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    class Particle {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.vx = Math.random() * 0.7 - 0.35;
        this.vy = Math.random() * 0.7 - 0.35;
        this.radius = 2.5 + Math.random() * 1.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot;
        ctx.fill();
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = line(0.55 * (1 - distance / maxDistance));
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animatePlexus() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connect();
      requestAnimationFrame(animatePlexus);
    }

    sizeCanvas();
    init();
    animatePlexus();
    window.addEventListener("resize", () => {
      sizeCanvas();
      init();
    });
  } else if (canvas) {
    canvas.remove();
  }

  function mapRange(v, a, b, c, d) {
    const t = Math.max(0, Math.min(1, (v - a) / (b - a || 1)));
    return c + (d - c) * t;
  }

  const DAMP = 0.1;
  let target = window.scrollY;
  let smooth = target;
  const ken = document.querySelector("[data-ken]");
  const floatEl = document.querySelector("[data-float]");

  function frame() {
    smooth += (target - smooth) * DAMP;
    const y = smooth;

    if (ken && hero) {
      const p = mapRange(y, 0, hero.offsetHeight * 0.9, 0, 1);
      const scale = 1.06 - p * 0.04;
      const ty = p * 24;
      ken.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
    }

    if (floatEl) {
      const r = floatEl.getBoundingClientRect();
      const mid = r.top + r.height / 2 - window.innerHeight / 2;
      const lift = mapRange(mid, -400, 400, 18, -18);
      floatEl.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0)`;
    }

    syncNav();
    requestAnimationFrame(frame);
  }

  window.addEventListener(
    "scroll",
    () => {
      target = window.scrollY;
    },
    { passive: true }
  );

  syncNav();
  if (!reduce) requestAnimationFrame(frame);
  else window.addEventListener("scroll", syncNav, { passive: true });
})();
