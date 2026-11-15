// Valentina Miranda · Portfolio — interacciones
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header con borde al hacer scroll + barra de lectura
  const header = document.querySelector(".header");
  const progress = document.querySelector(".progress");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menú en celular
  const menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll(".nav a").forEach((a) =>
      a.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Aparición de elementos al hacer scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // Menú activo según la sección visible (solo en la home)
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  if (navLinks.length && "IntersectionObserver" in window) {
    const map = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("active"));
            const link = map.get(e.target.id);
            if (link) link.classList.add("active");
          }
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));
  }

  // Palabra que va cambiando en el hero
  const rot = document.querySelector(".rotator");
  if (rot && !reduce) {
    const words = rot.dataset.words.split("|");
    let i = 0;
    setInterval(() => {
      rot.classList.add("out");
      setTimeout(() => {
        i = (i + 1) % words.length;
        rot.textContent = words[i];
        rot.classList.remove("out");
      }, 350);
    }, 2400);
  }

  // Experiencia: abrir / cerrar detalles
  document.querySelectorAll(".job-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const job = btn.closest(".job");
      const open = job.classList.toggle("open");
      btn.textContent = open ? "Cerrar" : "Ver detalles";
      btn.setAttribute("aria-expanded", open);
    });
  });

  // Galería de fotos
  const gallery = document.querySelector(".gallery");
  if (gallery) {
    const imgs = [...gallery.querySelectorAll("img")];
    const dots = [...gallery.querySelectorAll(".dots button")];
    let cur = 0;
    let timer;
    const show = (n) => {
      imgs[cur].classList.remove("on");
      dots[cur].classList.remove("on");
      cur = (n + imgs.length) % imgs.length;
      imgs[cur].classList.add("on");
      dots[cur].classList.add("on");
    };
    const start = () => {
      if (reduce) return;
      clearInterval(timer);
      timer = setInterval(() => show(cur + 1), 4200);
    };
    dots.forEach((d, n) => d.addEventListener("click", () => { show(n); start(); }));
    // deslizar con el dedo
    let x0 = null;
    gallery.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    gallery.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { show(cur + (dx < 0 ? 1 : -1)); start(); }
      x0 = null;
    });
    start();
  }

  // Contadores animados (página del TIF)
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const run = (el) => {
      const target = +el.dataset.count;
      const pre = el.dataset.prefix || "";
      const suf = el.dataset.suffix || "";
      if (reduce) { el.textContent = pre + target + suf; return; }
      const t0 = performance.now();
      const dur = 1600;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = pre + v + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } }),
      { threshold: 0.5 }
    );
    counters.forEach((c) => co.observe(c));
  }
})();
