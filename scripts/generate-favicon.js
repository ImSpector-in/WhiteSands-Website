/**
 * Generates app/favicon.ico from the White Sands logo.
 *
 * Next.js App Router serves app/favicon.ico as the site favicon, and the static
 * build (scripts/build-static.js) copies it verbatim into out/. So regenerating
 * this one file is all it takes to update the browser-tab icon everywhere.
 *
 * Run once whenever the logo changes:  node scripts/generate-favicon.js
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const pngToIcoModule = require("png-to-ico");
const pngToIco = pngToIcoModule.default || pngToIcoModule;

const ROOT = path.join(__dirname, "..");
const LOGO = path.join(ROOT, "public", "assets", "logo", "WhiteSandsLogo_clear.gif");
const OUT_ICO = path.join(ROOT, "app", "favicon.ico");

// Standard favicon sizes. The logo is near-square (202x195) with transparency,
// so "contain" onto a transparent square keeps its aspect without cropping.
const SIZES = [16, 32, 48, 64];

(async () => {
  const pngBuffers = await Promise.all(
    SIZES.map((s) =>
      sharp(LOGO)
        .resize(s, s, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer(),
    ),
  );
  const ico = await pngToIco(pngBuffers);
  fs.writeFileSync(OUT_ICO, ico);
  console.log(`favicon: wrote ${SIZES.join("/")}px -> ${path.relative(ROOT, OUT_ICO)} (${ico.length} bytes)`);
})().catch((e) => {
  console.error("favicon generation failed:", e.message);
  process.exit(1);
});
