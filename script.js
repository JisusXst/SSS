(() => {
  "use strict";

  const SECTIONS = ["home", "info", "help"];
  const views = Object.fromEntries(SECTIONS.map(id => [id, document.getElementById(id)]));
  const tabs = document.querySelectorAll(".nav-link");
  const triggers = document.querySelectorAll("[data-target]");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = null;

  function closeMenu() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function updateTabs(id) {
    tabs.forEach(tab => {
      const active = tab.dataset.target === id;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
  }

  function show(id, { updateHash = true, focusTab = false } = {}) {
    if (!SECTIONS.includes(id) || id === current) return;

    const previous = current ? views[current] : null;
    const next = views[id];
    current = id;

    const reveal = () => {
      if (previous) {
        previous.classList.remove("active", "leaving");
        previous.hidden = true;
      }
      next.hidden = false;
      next.classList.add("active");
      window.scrollTo({ top: 0 });
    };

    if (previous && !reduceMotion) {
      previous.classList.add("leaving");
      setTimeout(reveal, 220);
    } else {
      reveal();
    }

    updateTabs(id);
    closeMenu();
    document.title = (id === "home" ? "" : id[0].toUpperCase() + id.slice(1) + " · ") + "SSS — Santino Sostersich Studio";
    if (updateHash) history.pushState({ id }, "", "#" + id);
    if (focusTab) document.getElementById("tab-" + id).focus();
  }

  // Any element with data-target navigates
  triggers.forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      show(el.dataset.target);
    });
  });

  // Mobile menu
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Keyboard: arrows on tabs, 1/2/3 shortcuts, Escape closes mobile menu
  document.querySelector("[role='tablist']").addEventListener("keydown", e => {
    const i = SECTIONS.indexOf(current);
    if (e.key === "ArrowRight") show(SECTIONS[(i + 1) % SECTIONS.length], { focusTab: true });
    if (e.key === "ArrowLeft") show(SECTIONS[(i - 1 + SECTIONS.length) % SECTIONS.length], { focusTab: true });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
    const tag = (e.target.tagName || "").toLowerCase();
    if (e.altKey || e.ctrlKey || e.metaKey || ["input", "textarea", "select"].includes(tag)) return;
    const n = Number(e.key);
    if (n >= 1 && n <= SECTIONS.length) show(SECTIONS[n - 1]);
  });

  // Browser back/forward and direct links (#info, #help)
  window.addEventListener("popstate", () => {
    const id = location.hash.slice(1);
    show(SECTIONS.includes(id) ? id : "home", { updateHash: false });
  });

  // Hide logos that fail to load, keeping the name visible
  document.querySelectorAll(".card img").forEach(img => {
    img.addEventListener("error", () => { img.style.display = "none"; });
  });

  // Initial section
  const start = location.hash.slice(1);
  show(SECTIONS.includes(start) ? start : "home", { updateHash: false });
})();