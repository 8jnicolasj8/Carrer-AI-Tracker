/*
 * Career AI Tracker - landing behaviour.
 *
 * - Applies the translations from i18n.js to every [data-i18n] element.
 * - Remembers the language and defaults to the browser language.
 * - Wires the values from config.js (repo links, download button, version).
 * - Mobile menu and scroll reveal, both honouring prefers-reduced-motion.
 *
 * Classic script (no modules) so the page also works from file://.
 */
(function () {
  "use strict";

  var CONFIG = window.APP_CONFIG || {};
  var DICT = window.I18N || { en: {}, es: {} };
  var REPO_URL =
    CONFIG.REPO_URL || "https://github.com/your-username/career-ai-tracker";
  var RELEASE_AVAILABLE = CONFIG.RELEASE_AVAILABLE === true;
  var VERSION = CONFIG.VERSION || "Beta 0.1 (in development)";
  var STORAGE_KEY = "cat-lang";
  var currentLang = "en";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function t(key) {
    var table = DICT[currentLang] || {};
    if (typeof table[key] === "string") return table[key];
    if (DICT.en && typeof DICT.en[key] === "string") return DICT.en[key];
    return "";
  }

  function stripFragment(url) {
    return String(url).replace(/#.*$/, "");
  }

  /* --- Links driven by config.js ---------------------------------------- */
  function applyConfig() {
    var hrefs = {
      repo: REPO_URL,
      issues: REPO_URL + "/issues",
      license: stripFragment(REPO_URL) + "/blob/main/LICENSE",
      releases: stripFragment(REPO_URL) + "/releases/latest"
    };

    document.querySelectorAll("[data-link]").forEach(function (el) {
      var target = el.getAttribute("data-link");
      if (hrefs[target]) el.setAttribute("href", hrefs[target]);
      if (el.getAttribute("target") === null && /^https?:/.test(hrefs[target] || "")) {
        el.setAttribute("rel", "noopener");
      }
    });

    document.querySelectorAll('[data-cta="primary"]').forEach(function (el) {
      var label = el.querySelector("[data-cta-label]");
      if (RELEASE_AVAILABLE) {
        if (label) label.textContent = t("hero.ctaPrimary");
        el.setAttribute("href", hrefs.releases);
      } else {
        if (label) label.textContent = t("hero.ctaPrimarySoon");
        el.setAttribute("href", hrefs.repo);
      }
    });

    var versionEl = document.getElementById("app-version");
    if (versionEl) versionEl.textContent = VERSION;
  }

  /* --- Translations ------------------------------------------------------ */
  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n"));
      if (value) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n-alt"));
      if (value) el.setAttribute("alt", value);
    });
    document
      .querySelectorAll("[data-i18n-aria-label]")
      .forEach(function (el) {
        var value = t(el.getAttribute("data-i18n-aria-label"));
        if (value) el.setAttribute("aria-label", value);
      });

    var title = t("meta.title");
    if (title) document.title = title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && t("meta.description"))
      desc.setAttribute("content", t("meta.description"));
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) ogTitle.setAttribute("content", title);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && t("meta.description"))
      ogDesc.setAttribute("content", t("meta.description"));

    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute(
        "aria-pressed",
        btn.getAttribute("data-lang") === currentLang ? "true" : "false"
      );
    });
  }

  /* --- Link alternates ---------------------------------------------------- */
  // The page lives on one URL and switches language in the client, so the
  // hreflang targets are resolved against the current location at runtime:
  // the deployment URL is not known when the file is written.
  function applyAlternates() {
    var links = document.querySelectorAll('link[rel="alternate"][hreflang]');
    if (!links.length) return;
    try {
      var here = new URL(window.location.href);
      Array.prototype.forEach.call(links, function (link) {
        var lang = link.getAttribute("hreflang");
        var target = new URL(here.href);
        target.search = lang === "x-default" ? "" : "?lang=" + lang;
        target.hash = "";
        link.setAttribute("href", target.href);
      });
    } catch (e) {
      /* leave the static values in place */
    }
  }

  function setLanguage(lang, persist) {
    currentLang = lang === "es" ? "es" : "en";
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, currentLang);
      } catch (e) {
        /* storage may be unavailable (private mode); ignore */
      }
    }
    applyTranslations();
    applyConfig();
    applyAlternates();
    // Keep the URL shareable (?lang=es). Guarded so file:// and sandboxed
    // contexts (where replaceState throws) keep working.
    try {
      if (window.history && window.history.replaceState) {
        var u = new URL(window.location.href);
        u.searchParams.set("lang", currentLang);
        window.history.replaceState(null, "", u.pathname + u.search + u.hash);
      }
    } catch (e) {
      /* ignore: the page works fine without this */
    }
  }

  function initialLanguage() {
    // 1) explicit ?lang= in the URL (used by the hreflang alternates)
    try {
      var fromUrl = new URLSearchParams(window.location.search).get("lang");
      if (fromUrl === "en" || fromUrl === "es") return fromUrl;
    } catch (e) {
      /* URLSearchParams unavailable: fall through */
    }
    // 2) remembered choice
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      stored = null;
    }
    if (stored === "en" || stored === "es") return stored;
    // 3) browser language
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("es") === 0 ? "es" : "en";
  }

  /* --- Mobile menu ------------------------------------------------------- */
  function initMenu() {
    var toggle = document.getElementById("nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --- Scroll reveal ----------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
    // Safety net: never leave content hidden if the observer does not fire.
    window.setTimeout(function () {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }, 2000);
  }

  /* --- Boot -------------------------------------------------------------- */
  function init() {
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLanguage(btn.getAttribute("data-lang"), true);
      });
    });

    setLanguage(initialLanguage(), false);
    initMenu();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
