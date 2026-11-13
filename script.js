(() => {
  "use strict";

  /* ================= i18n dictionaries ================= */
  const I18N = {
    en: {
      "nav.home": "Home", "nav.info": "Info", "nav.help": "Help",
      c1t: "What is SSS?",
      c1p: "SSS is the independent technology and creative studio of Santino Sostersich. It was created to turn ideas into <b>real digital solutions</b>, built with care from the very first line of code.",
      c2t: "What SSS does",
      c2p: "SSS creates websites, designs digital experiences, programs and develops projects, and sells <b>websites and digital solutions</b>.",
      c3t: "Creativity and experience",
      c3p: "Behind SSS is an inventor, creator and problem solver with experience across different fields. Curiosity and experimentation drive the work, along with the ability to <b>learn and adapt</b> to whatever a project needs.",
      c4t: "Opportunities and collaboration",
      c4p: "SSS is open to working with developers, professionals, clients and teams. Collaborative projects and <b>economic opportunities</b> are welcome, always based on contribution, work and merit.",
      c5t: "Passion for technology",
      c5p: "I love programming. Building software, solving problems, learning new technologies and exploring new ideas: turning a concept into a <b>real, useful project</b> is what keeps me going.",
      "info.title": "About the studio",
      "info.lead": "A closer look at SSS, its creator and the way it approaches development.",
      "info.t1": "The creator",
      "info.p1": "Santino Sostersich is the person behind SSS: an inventor and creator with a curious mind and experience in different areas.",
      "info.t2": "Interests",
      "info.p2": "Programming, experimentation, innovation and the constant pursuit of <b>new technologies</b>.",
      "info.t3": "Environment",
      "info.p3": "Work happens around <b>GitHub</b>, <b>Linux</b>, <b>Fedora</b>, <b>Ubuntu</b> and <b>Windows</b>.",
      "info.t4": "Approach",
      "info.p4": "Start from the problem, build something useful, and keep it simple, clear and well made.",
      "help.title": "Support is in progress",
      "help.lead": "We're working hard to build a better support experience. More information and assistance options will be available soon.",
      "help.wip": "WORK IN PROGRESS", "help.back": "Back to Home"
    },
    es: {
      "nav.home": "Inicio", "nav.info": "Info", "nav.help": "Ayuda",
      c1t: "¿Qué es SSS?",
      c1p: "SSS es el estudio independiente de tecnología y creatividad de Santino Sostersich. Nació para convertir ideas en <b>soluciones digitales reales</b>, hechas con cuidado desde la primera línea de código.",
      c2t: "Qué hace SSS",
      c2p: "SSS crea sitios web, diseña experiencias digitales, programa y desarrolla proyectos, y vende <b>sitios web y soluciones digitales</b>.",
      c3t: "Creatividad y experiencia",
      c3p: "Detrás de SSS hay un inventor, creador y resolutor de problemas con experiencia en distintas áreas. La curiosidad y la experimentación guían el trabajo, junto con la capacidad de <b>aprender y adaptarse</b> a lo que cada proyecto necesite.",
      c4t: "Oportunidades y colaboración",
      c4p: "SSS está abierto a trabajar con desarrolladores, profesionales, clientes y equipos. Los proyectos colaborativos y las <b>oportunidades económicas</b> son bienvenidos, siempre basados en el aporte, el trabajo y el mérito.",
      c5t: "Pasión por la tecnología",
      c5p: "Me apasiona programar. Crear software, resolver problemas, aprender nuevas tecnologías y explorar ideas nuevas: convertir un concepto en un <b>proyecto real y útil</b> es lo que me mueve.",
      "info.title": "Sobre el estudio",
      "info.lead": "Una mirada más cercana a SSS, su creador y su forma de encarar el desarrollo.",
      "info.t1": "El creador",
      "info.p1": "Santino Sostersich es la persona detrás de SSS: inventor y creador, con mente curiosa y experiencia en distintas áreas.",
      "info.t2": "Intereses",
      "info.p2": "Programación, experimentación, innovación y la búsqueda constante de <b>nuevas tecnologías</b>.",
      "info.t3": "Entorno",
      "info.p3": "El trabajo gira en torno a <b>GitHub</b>, <b>Linux</b>, <b>Fedora</b>, <b>Ubuntu</b> y <b>Windows</b>.",
      "info.t4": "Enfoque",
      "info.p4": "Partir del problema, construir algo útil y mantenerlo simple, claro y bien hecho.",
      "help.title": "El soporte está en progreso",
      "help.lead": "Estamos trabajando para ofrecer una mejor experiencia de soporte. Pronto habrá más información y opciones de asistencia.",
      "help.wip": "EN CONSTRUCCIÓN", "help.back": "Volver al inicio"
    }
  };

  /* ================= helpers ================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lite = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4;
  if (lite) document.body.classList.add("lite");

  const VIEWS = ["home", "info", "help"];
  const views = Object.fromEntries(VIEWS.map(id => [id, document.getElementById(id)]));
  const navLinks = $$(".nav a[data-view]");
  const nav = $("#nav");
  let view = "home";
  let lang = "en";

  /* ================= cubes: build faces once ================= */
  const addFaces = el => { for (let i = 0; i < 6; i++) { const f = document.createElement("div"); f.className = "face"; el.appendChild(f); } };
  $$(".cube.big").forEach(addFaces);

  // Floating background cubes: x (% of width), y (fraction of viewport), size, parallax depth, spin speed
  const FLOAT_DEFS = [
    { x: 8, y: 0.15, s: 90, d: 0.25, r: 0.05, c: "" },
    { x: 82, y: 0.3, s: 140, d: 0.4, r: 0.04, c: "cyan" },
    { x: 20, y: 0.7, s: 60, d: 0.15, r: 0.08, c: "gray" },
    { x: 70, y: 0.85, s: 80, d: 0.3, r: 0.06, c: "sun" },
    { x: 45, y: 0.1, s: 50, d: 0.12, r: 0.09, c: "gray", extra: true },
    { x: 92, y: 0.65, s: 56, d: 0.18, r: 0.07, c: "", extra: true },
    { x: 5, y: 0.95, s: 120, d: 0.35, r: 0.03, c: "cyan", extra: true },
    { x: 58, y: 0.5, s: 44, d: 0.1, r: 0.1, c: "sun", extra: true }
  ];
  const floaters = FLOAT_DEFS.map(def => {
    const el = document.createElement("div");
    el.className = "cube " + def.c + (def.extra ? " extra" : "");
    el.style.setProperty("--s", def.s + "px");
    el.style.left = def.x + "%";
    addFaces(el);
    $("#floaters").appendChild(el);
    return { ...def, el };
  });

  /* ================= i18n ================= */
  function setLang(next, save = true) {
    if (!I18N[next]) return;
    lang = next;
    document.documentElement.lang = next;
    $$("[data-i18n]").forEach(el => {
      const text = I18N[next][el.dataset.i18n];
      if (text !== undefined) el.innerHTML = text; // dictionaries are trusted, static strings
    });
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === next)));
    if (save) { try { localStorage.setItem("sss-lang", next); } catch (e) { /* storage unavailable */ } }
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  /* ================= view switching ================= */
  function showView(id, push = true) {
    if (!VIEWS.includes(id)) id = "home";
    if (id !== view) {
      views[view].hidden = true;
      views[id].hidden = false;
      view = id;
      scrollTo(0, 0);
      measure();
    }
    navLinks.forEach(a => {
      if (a.classList.contains("brand")) return;
      if (a.dataset.view === id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = (id === "home" ? "" : views[id].dataset.title + " · ") + "SSS — Santino Sostersich Studio";
    if (push && location.hash !== "#" + id) history.pushState(null, "", "#" + id);
    requestTick();
  }
  navLinks.concat($$(".btn[data-view]")).forEach(a => a.addEventListener("click", e => { e.preventDefault(); showView(a.dataset.view); }));
  addEventListener("popstate", () => showView(location.hash.slice(1), false));

  /* ================= scroll-driven animation (one rAF per frame) ================= */
  const heroInner = $("#heroInner");
  const story = $("#story");
  const steps = $$(".step");
  const bigCubes = steps.map(s => $(".cube.big", s));
  let storyTop = 0, storyRange = 1, vh = innerHeight, active = 0, ticking = false;

  function measure() {
    vh = innerHeight;
    if (view === "home") { storyTop = story.offsetTop; storyRange = Math.max(1, story.offsetHeight - vh); }
  }

  function frame() {
    ticking = false;
    const y = scrollY;

    // Background cubes: parallax with wrap-around so they never run out
    if (!reduce) {
      const span = vh + 400;
      for (const f of floaters) {
        const ty = (((f.y * vh - y * f.d) % span) + span) % span - 200;
        f.el.style.transform = `translate3d(0,${ty.toFixed(1)}px,${(f.d * 200 - 60).toFixed(0)}px) rotateX(${(y * f.r + 20).toFixed(1)}deg) rotateY(${(y * f.r * 1.4).toFixed(1)}deg)`;
      }
    }

    if (view !== "home") return;

    // SSS title fades as the visitor scrolls
    heroInner.style.setProperty("--fade", clamp(1 - y / (vh * 0.65), 0, 1).toFixed(3));

    // Which content cube is active, and its rotation
    const p = clamp((y - storyTop) / storyRange, 0, 1);
    const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
    if (idx !== active) { steps[active].classList.remove("on"); steps[idx].classList.add("on"); active = idx; }
    if (!reduce) bigCubes[idx].style.transform = `rotateX(${(-22 + Math.sin(p * 18) * 10).toFixed(1)}deg) rotateY(${(p * 900 + 25).toFixed(1)}deg)`;
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  addEventListener("scroll", requestTick, { passive: true });
  addEventListener("resize", () => { measure(); requestTick(); });

  /* ================= navigation reveal on interaction ================= */
  let hideTimer = 0, holding = false;
  function reveal() {
    nav.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { if (!holding) nav.classList.remove("show"); }, 4000);
  }
  // Ignore the synthetic mousemove some browsers fire right after load, so the menu starts hidden
  const loadedAt = performance.now();
  let lastX = -1, lastY = -1;
  function onInteract(e) {
    if (performance.now() - loadedAt < 900) return;
    if (e.type === "mousemove") {
      if (e.clientX === lastX && e.clientY === lastY) return;
      lastX = e.clientX; lastY = e.clientY;
    }
    reveal();
  }
  ["keydown", "mousemove", "pointerdown", "wheel", "touchstart", "scroll"].forEach(ev => addEventListener(ev, onInteract, { passive: true }));
  nav.addEventListener("pointerenter", () => { holding = true; reveal(); });
  nav.addEventListener("pointerleave", () => { holding = false; reveal(); });
  nav.addEventListener("focusin", () => { holding = true; reveal(); });
  nav.addEventListener("focusout", () => { holding = false; reveal(); });

  /* ================= init ================= */
  let saved = null;
  try { saved = localStorage.getItem("sss-lang"); } catch (e) { /* ignore */ }
  setLang(saved === "es" ? "es" : "en", false);
  const start = location.hash.slice(1);
  views.home.hidden = false;
  measure();
  showView(VIEWS.includes(start) ? start : "home", false);
  addEventListener("load", () => { measure(); requestTick(); });
})();