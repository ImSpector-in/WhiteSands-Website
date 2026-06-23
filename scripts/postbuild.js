/**
 * Post-build processor for the static export in `out/`.
 *
 * Karl @ Kona Networks needs the build to be fully portable: you should be able
 * to open `out/index.html` straight off disk (file://) and have it render — and
 * to drop the folder on any host (even a sub-directory) without path breakage.
 *
 * A vanilla Next.js export blocks that in three ways, which this script fixes:
 *   1. Absolute paths (/_next/, /assets/, /about) point at the drive/host root,
 *      so they 404 over file://. We rewrite them to relative (./). Every page is
 *      exported flat at the root, so a single "./" prefix is correct everywhere.
 *   2. Self-hosted woff2 fonts are CORS-blocked over file:// (null origin) no
 *      matter the path. We inline them into the CSS as base64 data: URIs.
 *   3. The HTML ships as one minified line. We pretty-print it so the source is
 *      readable, per Karl's request.
 *
 * Paths are rewritten in .html, .js AND .css because next/image and the gallery
 * data live in JS chunks and React re-applies those paths on hydration — fixing
 * only the HTML would be silently undone in the browser.
 */
const fs = require("fs");
const path = require("path");
const beautify = require("js-beautify").html;

const OUT_DIR = path.join(__dirname, "..", "out");
const MEDIA_DIR = path.join(OUT_DIR, "_next", "static", "media");

// Clean-URL routes -> the actual flat file they map to, so links work off disk.
const ROUTES = {
  "/": "./index.html",
  "/about": "./about.html",
  "/services": "./services.html",
  "/gallery": "./gallery.html",
  "/contact": "./contact.html",
};

const BEAUTIFY_OPTS = {
  indent_size: 2,
  indent_char: " ",
  preserve_newlines: true,
  max_preserve_newlines: 1,
  wrap_line_length: 0,
  end_with_newline: true,
};

function walk(dir, onFile) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, onFile);
    else onFile(full);
  }
}

// Build a map of woff2 filename -> data: URI once, so we never re-read a font.
function buildFontMap() {
  const map = {};
  if (!fs.existsSync(MEDIA_DIR)) return map;
  for (const name of fs.readdirSync(MEDIA_DIR)) {
    if (!name.endsWith(".woff2")) continue;
    const b64 = fs.readFileSync(path.join(MEDIA_DIR, name)).toString("base64");
    map[name] = `data:font/woff2;base64,${b64}`;
  }
  return map;
}

function processCss(file, fontMap) {
  let css = fs.readFileSync(file, "utf8");
  let embedded = 0;
  // Inline every @font-face woff2 (relative ../media/ or absolute form) as a
  // data: URI. Next 16/Turbopack emits the relative ../media/ form today.
  css = css.replace(
    /url\((?:\.\.\/media\/|\/_next\/static\/media\/)([^)]+\.woff2)\)/g,
    (m, fontFile) => {
      if (!fontMap[fontFile]) return m;
      embedded++;
      return `url(${fontMap[fontFile]})`;
    },
  );
  fs.writeFileSync(file, css, "utf8");
  return embedded;
}

function processJs(file) {
  let js = fs.readFileSync(file, "utf8");
  // Asset paths -> relative, in any quote style ("...", '...', `...`).
  // The (?<!\.) lookbehind skips paths already relative (./assets/).
  // NOTE: deliberately do NOT touch "/_next/" here. The Turbopack runtime
  // derives its chunk base by asserting its own currentScript.src contains
  // "/_next/"; rewriting that literal breaks the check ("Invariant: Expected
  // document.currentScript src to contain '/_next/'"). The script tags are
  // already loaded relatively, so the runtime resolves the base correctly.
  js = js.replace(/(?<!\.)\/assets\//g, "./assets/");
  fs.writeFileSync(file, js, "utf8");
}

function processHtml(file) {
  let html = fs.readFileSync(file, "utf8");

  // Drop font preloads: fonts are now embedded in CSS, and these absolute,
  // crossorigin font preloads throw CORS errors over file:// for nothing.
  html = html.replace(/<link\b[^>]*\bas="font"[^>]*>/g, "");

  // Clean-URL nav links -> the real flat .html file (works off disk).
  // Must run before the global rewrite below, which only knows asset prefixes.
  html = html.replace(
    /(href=")(\/(?:about|services|gallery|contact)?)(")/g,
    (m, pre, route, post) => (ROUTES[route] ? pre + ROUTES[route] + post : m),
  );

  // Root-level static files (favicon, svgs) -> relative.
  html = html.replace(
    /="\/(favicon|file\.svg|globe\.svg|next\.svg|vercel\.svg|window\.svg)/g,
    '="./$1',
  );

  // Global asset/chunk path rewrite. Catches every context — src, srcSet,
  // inline styles (incl. &#x27;-encoded quotes), and the inline RSC hydration
  // payload — not just src/href attributes. The (?<!\.) lookbehind skips paths
  // already made relative (./assets/), so reruns/overlaps don't double-prefix.
  html = html.replace(/(?<!\.)\/assets\//g, "./assets/");
  html = html.replace(/(?<!\.)\/_next\//g, "./_next/");

  // Finally, pretty-print so "View Source" is readable (Karl's request #1).
  html = beautify(html, BEAUTIFY_OPTS);

  fs.writeFileSync(file, html, "utf8");
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("out/ not found — run `next build` first.");
    process.exit(1);
  }

  const fontMap = buildFontMap();
  let counts = { html: 0, js: 0, css: 0 };
  let fontsEmbedded = 0;

  walk(OUT_DIR, (file) => {
    if (file.endsWith(".css")) {
      fontsEmbedded += processCss(file, fontMap);
      counts.css++;
    } else if (file.endsWith(".js")) {
      processJs(file);
      counts.js++;
    } else if (file.endsWith(".html")) {
      processHtml(file);
      counts.html++;
    }
  });

  // Guard: if fonts exist on disk but none got inlined, the CSS url() shape
  // changed (e.g. a Next.js upgrade) and the file:// build would silently lose
  // its fonts to CORS. Fail loud rather than ship a broken deliverable.
  if (Object.keys(fontMap).length > 0 && fontsEmbedded === 0) {
    console.error(
      "postbuild: found woff2 fonts but embedded 0 — the CSS url() pattern " +
        "no longer matches. Fix the regex in processCss(). Aborting.",
    );
    process.exit(1);
  }

  console.log(
    `postbuild: embedded ${fontsEmbedded} font refs (${Object.keys(fontMap).length} unique files); ` +
      `processed ${counts.html} html, ${counts.js} js, ${counts.css} css files.`,
  );
}

main();
