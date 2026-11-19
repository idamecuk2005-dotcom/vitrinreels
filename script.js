/* =========================================================
   Vitrin Reels — script.js
   Mobil menü, SSS akordeonu ve hafif scroll animasyonları.
   ========================================================= */

(function () {
  "use strict";

  /* ---- Mobil menü ---- */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const toggleLabel = toggle.querySelector(".sr-only");

  function setMenu(open, returnFocus) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    toggleLabel.textContent = open ? "Menüyü kapat" : "Menüyü aç";
    if (!open && returnFocus) toggle.focus();
  }

  toggle.addEventListener("click", function () {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setMenu(open);
    if (open) {
      const first = nav.querySelector("a");
      if (first) first.focus();
    }
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false, true);
  });

  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !header.contains(e.target)) setMenu(false);
  });

  window.matchMedia("(min-width: 900px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---- SSS akordeonu ---- */
  document.querySelectorAll(".acc-trigger").forEach(function (btn) {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    panel.inert = true;

    btn.addEventListener("click", function () {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-open", open);
      panel.inert = !open;
    });
  });

  /* ---- Scroll animasyonları ---- */
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach(function (el) {
    const siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList.contains("reveal");
    });
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--d", (i * 0.08).toFixed(2) + "s");
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
