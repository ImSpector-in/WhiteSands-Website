/**
 * build-static.js — port the Next.js export in `out/` to a STANDALONE static
 * site in `static/` with NO React, NO Next runtime, and NO hydration.
 *
 * Why this exists
 * ---------------
 * The hosted Next export hydrates fine but throws a single React #418 error
 * because the post-build pretty-printer changes whitespace and React rejects
 * the mismatch. Rather than fight React, we ship the *rendered* HTML as plain
 * static pages and re-add the interactive bits (hero carousel, mobile menu,
 * gallery filter + lightbox) with a small vanilla `site.js`. Same look, same
 * content, zero console errors, and it opens straight off disk (file://).
 *
 * What it does, per page (index/about/services/gallery/contact + 404):
 *   1. Strip every Next/React artifact: `/_next/` <script> tags, the script
 *      preload, the noModule fallback, all inline `self.__next_f` RSC payload
 *      blocks, the `<div hidden>` + `<!--$-->` hydration markers.
 *   2. Point the stylesheet at the local copy (`./css/style.css`) and the
 *      favicon at `./favicon.ico`; drop the `next-size-adjust` meta.
 *   3. Inject `<script src="./js/site.js" defer></script>` before </body>.
 *   4. (index only) tag the hero's active slide + tagline with ids so the
 *      vanilla carousel can drive them.
 *
 * Assets:
 *   - CSS is copied with every woff2 font inlined as a base64 data: URI, so the
 *     one stylesheet is fully self-contained (fonts work over file:// too).
 *   - `assets/` and the root favicon are copied verbatim.
 *
 * The result in `static/` stands alone — it does not depend on out/, _next, or
 * the React source. Re-run with: npm run build:static
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "out");
const DEST = path.join(ROOT, "static");
const MEDIA = path.join(OUT, "_next", "static", "media");
const CHUNKS = path.join(OUT, "_next", "static", "chunks");

const PAGES = ["index", "about", "services", "gallery", "contact", "404"];

// The stylesheet filename is a content hash Next.js regenerates on every build,
// so locate it dynamically rather than hardcoding it (a literal would crash the
// next time `npm run build` produces a different hash).
function findCss() {
  const css = fs.readdirSync(CHUNKS).filter((f) => f.endsWith(".css"));
  if (css.length !== 1) {
    console.error(`ABORT: expected exactly 1 CSS chunk, found ${css.length}: ${css.join(", ")}`);
    process.exit(1);
  }
  return path.join(CHUNKS, css[0]);
}

// ── helpers ────────────────────────────────────────────────────────────────
function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// Make the stylesheet fully self-contained (no separate font files, no file://
// CORS issues) by inlining every woff2 as a base64 data: URI.
//
// Note: the upstream `npm run build` (postbuild.js) may have ALREADY embedded
// the fonts. So we embed any remaining url(../media/..) refs, then report the
// final state: how many data: fonts the CSS ends up with, and whether any
// relative ../media/ ref survived (those would 404 — we ship no media/ folder).
function buildCss() {
  let css = fs.readFileSync(findCss(), "utf8");
  css = css.replace(/url\(\.\.\/media\/([^)]+\.woff2)\)/g, (m, file) => {
    const fontPath = path.join(MEDIA, file);
    if (!fs.existsSync(fontPath)) return m;
    const b64 = fs.readFileSync(fontPath).toString("base64");
    return `url(data:font/woff2;base64,${b64})`;
  });
  const inlined = (css.match(/data:font\/woff2;base64/g) || []).length;
  const leftover = (css.match(/url\(\.\.\/media\//g) || []).length;
  return { css, inlined, leftover };
}

// Strip all React/Next runtime out of one rendered page and relink local assets.
function transformHtml(html, page) {
  // 1 — script preload + every /_next/ <script> (async, noModule, and id="_R_")
  html = html.replace(/\s*<link rel="preload" as="script"[^>]*>/g, "");
  html = html.replace(/\s*<script[^>]*src="\/_next\/[^"]*"[^>]*><\/script>/g, "");

  // 2 — inline RSC payload blocks: <script> ... self.__next_f ... </script>
  html = html.replace(
    /\s*<script>(?:(?!<\/script>)[\s\S])*?__next_f[\s\S]*?<\/script>/g,
    "",
  );

  // 3 — hydration markers
  html = html.replace(/<div hidden="">\s*(?:<!--\$-->)?\s*(?:<!--\/\$-->)?\s*<\/div>/g, "");
  html = html.replace(/<!--\$-->/g, "");
  html = html.replace(/<!--\/\$-->/g, "");
  html = html.replace(/<!-- -->/g, ""); // empty text-join comments (e.g. "© 2026")

  // 4 — local stylesheet + favicon, drop Next-only attrs/meta
  html = html.replace(
    /href="\.\/_next\/static\/chunks\/[^"]+\.css"/g,
    'href="./css/style.css"',
  );
  html = html.replace(/\s*data-precedence="next"/g, "");
  html = html.replace(/href="\/favicon\.ico\?[^"]*"/g, 'href="./favicon.ico"');
  html = html.replace(/\s*<meta name="next-size-adjust"[^>]*>/g, "");

  // 5 — hero ids (index only) so the vanilla carousel can target the live slide
  if (page === "index") {
    html = html.replace(
      '<div class="absolute inset-0" aria-label="Kohala Coast resort project" style="opacity:1">',
      '<div id="hero-active" class="absolute inset-0 transition-opacity duration-700" aria-label="Kohala Coast resort project" style="opacity:1">',
    );
    html = html.replace(
      /(<p class="font-heading font-light[^"]*") style="opacity:1">Resort &amp; Commercial Work<\/p>/,
      '$1 id="hero-tagline" style="opacity:1;transition:opacity .4s">Resort &amp; Commercial Work</p>',
    );
    // These injections are literal-string matches against the rendered hero. If
    // the markup ever drifts they would silently no-op and the carousel would
    // go dead, so fail loudly instead.
    if (!html.includes('id="hero-active"') || !html.includes('id="hero-tagline"')) {
      console.error("ABORT: hero id injection missed — the hero markup changed. Update transformHtml().");
      process.exit(1);
    }
  }

  // 6 — load the vanilla behaviour script
  html = html.replace(
    "</body>",
    '  <script src="./js/site.js" defer></script>\n</body>',
  );

  return html;
}

// ── build ────────────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(OUT)) {
    console.error("out/ not found — run `npm run build` (next build) first.");
    process.exit(1);
  }

  rmrf(DEST);
  fs.mkdirSync(DEST, { recursive: true });
  fs.mkdirSync(path.join(DEST, "css"), { recursive: true });
  fs.mkdirSync(path.join(DEST, "js"), { recursive: true });

  // pages
  for (const page of PAGES) {
    const srcFile = path.join(OUT, `${page}.html`);
    if (!fs.existsSync(srcFile)) {
      console.warn(`(skip) ${page}.html not found in out/`);
      continue;
    }
    let html = transformHtml(fs.readFileSync(srcFile, "utf8"), page);

    // hard guard: nothing React/Next may survive into the static deliverable
    for (const banned of ["/_next/", "__next_f", "<!--$-->"]) {
      if (html.includes(banned)) {
        console.error(`ABORT: '${banned}' still present in ${page}.html after transform.`);
        process.exit(1);
      }
    }
    fs.writeFileSync(path.join(DEST, `${page}.html`), html, "utf8");
  }

  // css (self-contained, fonts inlined)
  const { css, inlined, leftover } = buildCss();
  fs.writeFileSync(path.join(DEST, "css", "style.css"), css, "utf8");
  if (leftover > 0) {
    console.error(`ABORT: ${leftover} unresolved url(../media/..) font ref(s) remain — they would 404.`);
    process.exit(1);
  }
  if (inlined === 0) {
    console.error("ABORT: stylesheet has no embedded fonts — the CSS font shape changed.");
    process.exit(1);
  }

  // js — site.js is hand-maintained in scripts/site.js; copy it in
  fs.copyFileSync(path.join(__dirname, "site.js"), path.join(DEST, "js", "site.js"));

  // assets + favicon + svgs
  copyDir(path.join(OUT, "assets"), path.join(DEST, "assets"));
  for (const f of fs.readdirSync(OUT)) {
    if (f === "favicon.ico" || f.endsWith(".svg")) {
      fs.copyFileSync(path.join(OUT, f), path.join(DEST, f));
    }
  }

  console.log(
    `static/: ${PAGES.length} pages, self-contained CSS (${inlined} embedded font refs), ` +
      `assets + css + js copied. Open static/index.html directly or host the folder.`,
  );
}

main();
