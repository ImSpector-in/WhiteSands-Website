/*
 * site.js — all interactive behaviour for the static White Sands site.
 *
 * Plain vanilla JS, no framework. Every feature is guarded by an element
 * check, so this one file loads safely on every page and simply does nothing
 * where a feature isn't present. It drives the existing rendered markup — it
 * does not rebuild the DOM the way React did, so there is nothing to "hydrate"
 * and no mismatch error can occur.
 *
 *   1. Hero carousel      (home)        — autoplay + arrows + dots, crossfade
 *   2. Header             (every page)  — scroll shadow + mobile menu toggle
 *   3. Gallery            (gallery)     — category filter + lightbox
 *   4. Contact form       (contact)     — submit handler with status states
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    initHero();
    initHeader();
    initGallery();
    initContactForm();
  });

  /* ── 1. Hero carousel ─────────────────────────────────────────────────── */
  function initHero() {
    var active = document.getElementById("hero-active");
    var tagline = document.getElementById("hero-tagline");
    if (!active || !tagline) return;

    var slides = [
      { jpg: "./assets/images/new%20pictures/KohalaSide.jpg", alt: "Kohala Coast resort project", tagline: "Resort & Commercial Work" },
      { jpg: "./assets/images/new%20pictures/Kaunaoa.jpg",    alt: "Kaunaoa Bay — Mauna Kea", tagline: "Hawaii's Premier General Contractor" },
      { jpg: "./assets/images/new%20pictures/MaunaKea1.jpg",  alt: "Mauna Kea Beach Hotel",        tagline: "Fine Craftsmanship Since 1988" },
    ];
    var total = slides.length;
    var dots = Array.prototype.slice.call(
      document.querySelectorAll('button[aria-label^="Go to slide"]')
    );
    var prevBtn = document.querySelector('button[aria-label="Previous slide"]');
    var nextBtn = document.querySelector('button[aria-label="Next slide"]');

    // Two stacked layers crossfade cleanly with no flash-through. layerB is a
    // clone of the live hero layer; we alternate which one sits on top.
    var layerB = active.cloneNode(true);
    layerB.removeAttribute("id");
    layerB.style.opacity = "0";
    active.parentNode.insertBefore(layerB, active.nextSibling);
    var layers = [active, layerB];
    var front = 0;
    var current = 0;

    function webpSrcset(jpg) {
      var base = jpg.replace(/\.jpg$/, "");
      return base + "-640.webp 640w, " + base + "-1024.webp 1024w, " + base + "-1920.webp 1920w";
    }
    function paint(layer, slide) {
      var img = layer.querySelector("img");
      var source = layer.querySelector("source");
      if (source) source.setAttribute("srcset", webpSrcset(slide.jpg));
      if (img) { img.src = slide.jpg; img.alt = slide.alt; }
      layer.setAttribute("aria-label", slide.alt);
    }
    function setDots(i) {
      dots.forEach(function (d, idx) {
        d.classList.toggle("bg-accent", idx === i);
        d.classList.toggle("bg-white/40", idx !== i);
      });
    }

    function go(i) {
      i = (i + total) % total;
      if (i === current) return;
      var incoming = layers[front ^ 1];
      paint(incoming, slides[i]);
      incoming.style.zIndex = "2";
      layers[front].style.zIndex = "1";
      incoming.style.opacity = "0";
      void incoming.offsetWidth; // force reflow so the transition runs
      incoming.style.opacity = "1";
      front ^= 1;
      current = i;
      setDots(i);
      // crossfade the centred tagline alongside the image
      tagline.style.opacity = "0";
      window.setTimeout(function () {
        tagline.textContent = slides[i].tagline;
        tagline.style.opacity = "1";
      }, 200);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { go(current - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(current + 1); restart(); });
    dots.forEach(function (d, idx) {
      d.addEventListener("click", function () { go(idx); restart(); });
    });

    var timer = null;
    function restart() {
      if (reduceMotion) return;
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(function () { go(current + 1); }, 5500);
    }
    restart();
  }

  /* ── 2. Header: scroll shadow + mobile menu ───────────────────────────── */
  function initHeader() {
    var header = document.querySelector("header");
    if (!header) return;

    // Scroll shadow (mirrors the old scrollY > 80 behaviour).
    function onScroll() {
      var scrolled = window.scrollY > 80;
      header.classList.toggle("shadow-md", scrolled);
      header.classList.toggle("border-b", !scrolled);
      header.classList.toggle("border-gray-100", !scrolled);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mobile menu — the panel was rendered conditionally by React, so build it
    // here and toggle it with the existing hamburger button.
    var toggle = header.querySelector('button[aria-label="Toggle navigation"]');
    if (!toggle) return;

    var links = [
      { href: "./index.html",    label: "Home" },
      { href: "./about.html",    label: "About" },
      { href: "./services.html", label: "Services" },
      { href: "./gallery.html",  label: "Gallery" },
      { href: "./contact.html",  label: "Contact" },
    ];
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    var panel = document.createElement("div");
    panel.className = "md:hidden bg-white border-t border-gray-100 shadow-lg";
    panel.hidden = true;
    var nav = document.createElement("nav");
    nav.className = "flex flex-col py-4";
    nav.setAttribute("aria-label", "Mobile navigation");
    links.forEach(function (l) {
      var a = document.createElement("a");
      a.href = l.href;
      var isActive = l.href.indexOf(here) !== -1 && here !== "";
      a.className =
        "font-heading font-semibold text-sm uppercase tracking-widest px-6 py-4 transition-colors " +
        (isActive ? "text-primary" : "text-gray-700");
      a.textContent = l.label;
      nav.appendChild(a);
    });
    var quoteWrap = document.createElement("div");
    quoteWrap.className = "px-6 pt-2 pb-4";
    var quote = document.createElement("a");
    quote.href = "./contact.html";
    quote.className =
      "block w-full text-center font-heading font-semibold text-sm uppercase tracking-widest bg-accent text-dark px-5 py-3 rounded-full";
    quote.textContent = "Get a Quote";
    quoteWrap.appendChild(quote);
    nav.appendChild(quoteWrap);
    panel.appendChild(nav);
    header.appendChild(panel);

    var ICON_MENU = toggle.innerHTML;
    var ICON_X =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

    toggle.addEventListener("click", function () {
      var open = panel.hidden; // about to open
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = open ? ICON_X : ICON_MENU;
    });
  }

  /* ── 3. Gallery: filter + lightbox ────────────────────────────────────── */
  function initGallery() {
    var filterBar = document.querySelector('[aria-label="Filter projects"]');
    var grid = filterBar && filterBar.parentNode.querySelector(".grid");
    if (!filterBar || !grid) return;

    var buttons = Array.prototype.slice.call(filterBar.querySelectorAll("button"));
    var cards = Array.prototype.slice.call(grid.children);

    var ACTIVE = "border-primary text-primary bg-primary/5".split(" ");
    var IDLE = "border-gray-300 text-gray-500 hover:border-primary hover:text-primary".split(" ");

    function catOf(card) {
      var p = card.querySelectorAll("p");
      return p.length ? p[p.length - 1].textContent.trim() : "";
    }
    function nameOf(card) {
      var p = card.querySelector("p");
      return p ? p.textContent.trim() : "";
    }
    function imgSrcOf(card) {
      var img = card.querySelector("img");
      return img ? img.getAttribute("src") : "";
    }

    function applyFilter(label) {
      cards.forEach(function (card) {
        var cat = catOf(card);
        // Most filter buttons match the card's category label exactly. The one
        // exception is the "Healthcare" button, whose cards are labelled
        // "Hospital & Healthcare" — so also accept a label the category ends with.
        var show = label === "All Projects" || cat === label || cat.endsWith(label);
        card.hidden = !show;
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          ACTIVE.forEach(function (c) { b.classList.remove(c); });
          IDLE.forEach(function (c) { b.classList.add(c); });
        });
        IDLE.forEach(function (c) { btn.classList.remove(c); });
        ACTIVE.forEach(function (c) { btn.classList.add(c); });
        applyFilter(btn.textContent.trim());
        closeLightbox();
      });
    });

    /* Lightbox — built once, reused. */
    var lb = buildLightbox();
    document.body.appendChild(lb.root);
    var index = -1;

    function visibleCards() {
      return cards.filter(function (c) { return !c.hidden; });
    }
    function openAt(i) {
      var list = visibleCards();
      if (i < 0 || i >= list.length) return;
      index = i;
      var card = list[i];
      lb.img.src = imgSrcOf(card);
      lb.img.alt = nameOf(card);
      lb.name.textContent = nameOf(card);
      lb.cat.textContent = catOf(card);
      lb.counter.textContent = (i + 1) + " / " + list.length;
      lb.prev.style.display = i > 0 ? "" : "none";
      lb.next.style.display = i < list.length - 1 ? "" : "none";
      lb.root.hidden = false;
    }
    function closeLightbox() { lb.root.hidden = true; index = -1; }
    function step(delta) {
      var list = visibleCards();
      if (index < 0 || !list.length) return;
      var n = index + delta;
      if (n < 0) n = list.length - 1;
      if (n >= list.length) n = 0;
      openAt(n);
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        openAt(visibleCards().indexOf(card));
      });
    });
    lb.closeBtn.addEventListener("click", closeLightbox);
    lb.prev.addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    lb.next.addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    lb.root.addEventListener("click", function () { closeLightbox(); });
    lb.dialog.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("keydown", function (e) {
      if (lb.root.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  function buildLightbox() {
    var root = document.createElement("div");
    root.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/92";
    root.hidden = true;

    var closeBtn = iconBtn(
      "absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors",
      "Close",
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>'
    );
    var prev = iconBtn(
      "absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors",
      "Previous image",
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>'
    );
    var next = iconBtn(
      "absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors",
      "Next image",
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>'
    );

    var dialog = document.createElement("div");
    dialog.className = "relative mx-4 sm:mx-12 lg:mx-20 max-w-5xl w-full";
    var img = document.createElement("img");
    img.className = "w-full max-h-[82vh] object-contain rounded-lg";
    var caption = document.createElement("div");
    caption.className =
      "absolute bottom-0 left-0 right-0 rounded-b-lg px-5 py-4 bg-gradient-to-t from-black/80 to-transparent";
    var name = document.createElement("p");
    name.className = "font-heading font-bold text-sm uppercase tracking-wide text-white";
    var cat = document.createElement("p");
    cat.className = "text-accent text-[0.68rem] uppercase tracking-widest mt-1";
    caption.appendChild(name);
    caption.appendChild(cat);
    dialog.appendChild(img);
    dialog.appendChild(caption);

    var counter = document.createElement("p");
    counter.className = "absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs tabular-nums";

    root.appendChild(closeBtn);
    root.appendChild(prev);
    root.appendChild(next);
    root.appendChild(dialog);
    root.appendChild(counter);

    return { root: root, dialog: dialog, img: img, name: name, cat: cat, counter: counter, closeBtn: closeBtn, prev: prev, next: next };
  }

  function iconBtn(className, label, svg) {
    var b = document.createElement("button");
    b.className = className;
    b.setAttribute("aria-label", label);
    b.innerHTML = svg;
    return b;
  }

  /* ── 4. Contact form ──────────────────────────────────────────────────── */
  function initContactForm() {
    var form = document.querySelector("main form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      // Posts to RSForm!Pro in Joomla. Replace RSFORM_ID with the real form id
      // once the form exists in the Joomla admin.
      fetch("/index.php?option=com_rsform&task=submissions.submit&formId=RSFORM_ID", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) showSent();
          else showError(btn);
        })
        .catch(function () { showError(btn); });
    });

    function showSent() {
      var done = document.createElement("div");
      done.className = "bg-green-50 border border-green-200 rounded p-8 text-center";
      done.innerHTML =
        '<p class="font-heading font-bold text-green-800 text-lg uppercase tracking-wide mb-2">Message Sent!</p>' +
        '<p class="text-green-700 text-sm">Thank you — we’ll be in touch within one business day.</p>';
      form.parentNode.replaceChild(done, form);
    }
    function showError(btn) {
      if (btn) { btn.disabled = false; btn.textContent = "Send Message"; }
      if (form.querySelector(".form-error")) return;
      var err = document.createElement("p");
      err.className = "form-error text-red-600 text-sm mb-4";
      err.textContent = "Something went wrong — please try again or call us directly.";
      form.insertBefore(err, btn ? btn.parentNode === form ? btn : form.lastChild : form.lastChild);
    }
  }
})();
