// One-time/maintenance script: generates responsive WebP variants for the
// homepage hero images so the static export can serve a <picture> srcset
// (mobile/tablet/desktop) without needing a server-side image optimizer.
//
// Run with: node scripts/generate-hero-webp.js
// Re-run any time the source hero JPEGs in
// public/assets/images/new pictures/ are replaced.

const sharp = require("sharp");
const path = require("path");

const WIDTHS = [640, 1024, 1920];

const heroDir = path.join(__dirname, "..", "public", "assets", "images", "new pictures");

const sources = ["KohalaSide.jpg", "Kaunaoa.jpg", "MaunaKea1.jpg"];

(async () => {
  for (const file of sources) {
    const srcPath = path.join(heroDir, file);
    const base = path.basename(file, path.extname(file));

    for (const width of WIDTHS) {
      const outPath = path.join(heroDir, `${base}-${width}.webp`);
      await sharp(srcPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outPath);
      console.log(`Wrote ${outPath}`);
    }
  }
})();
