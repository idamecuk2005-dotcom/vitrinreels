/* =========================================================
   Vitrin Reels — script.js
   ========================================================= */

// ---- Satış ayarları (buradan değiştirin) ----------------------------
// Satışı açmak için SATIS_ACIK değerini true yapın.
const SATIS_ACIK = false;

const SHOPIER_DENEME = "https://www.shopier.com/Hayalindekiyasamarzusu/52971820";
const SHOPIER_TEMEL  = "https://www.shopier.com/Hayalindekiyasamarzusu/52971841";
const SHOPIER_PLUS   = "https://www.shopier.com/Hayalindekiyasamarzusu/52971863";

const FORM_ISLETME = "https://docs.google.com/forms/d/e/1FAIpQLScoWsNWfD9kAxKCf1tmM8WIhDssrzNHuxrpCHWDrNPGf_NB4g/viewform";
// ---------------------------------------------------------------------

(function () {
  "use strict";

  /* ---- Satın al butonları ---- */
  const links = { deneme: SHOPIER_DENEME, temel: SHOPIER_TEMEL, plus: SHOPIER_PLUS };

  document.querySelectorAll(".buy-btn").forEach(function (btn) {
    const plan = btn.getAttribute("data-plan");
    const planName = btn.closest(".plan").querySelector("h3").textContent.trim();
    if (SATIS_ACIK && links[plan]) {
      btn.href = links[plan];
      btn.textContent = "Satın al";
      btn.setAttribute("aria-label", planName + " paketini satın al (yeni sekmede açılır)");
    } else {
      btn.href = FORM_ISLETME;
      btn.textContent = "Yakında";
      btn.setAttribute("aria-label", planName + ": satış yakında. İşletme başvuru formunu aç (yeni sekmede açılır)");
    }
    btn.target = "_blank";
    btn.rel = "noopener";
  });

  const status = document.querySelector("[data-sales-status]");
  if (status) status.hidden = SATIS_ACIK;

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

  window.matchMedia("(min-width: 860px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---- Header kaydırma gölgesi ---- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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
  // Aynı grup içindeki öğelere küçük gecikme ver
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

  /* ---- Vizör zaman kodu ---- */
  const tc = document.querySelector("[data-timecode]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (tc && !reduce) {
    let frames = 0;
    setInterval(function () {
      frames = (frames + 1) % (25 * 30); // 25 sn'de başa döner (Reels süresi)
      const s = Math.floor(frames / 30);
      const f = frames % 30;
      tc.textContent = "00:" + String(s).padStart(2, "0") + ":" + String(f).padStart(2, "0");
    }, 1000 / 30);
  }
})();
