/**
 * One-shot release builder (Karl @ Kona Networks, request #3).
 *
 * Runs the full finish-line process so a deliverable is attached to the repo:
 *   1. npm install            — ensure deps are present
 *   2. npm run build          — render pages, then strip React → static site in out/
 *   3. portability check      — fail if out/ has any React/Next or absolute paths
 *   4. zip the contents of out/
 *   5. create a GitHub release with the zip attached, the notes listing every
 *      file changed since the previous release
 *
 * Requires the `gh` CLI to be authenticated against the repo.
 * Run with: npm run release
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "out");
// Build date stamps both the zip filename and the release tag, per Karl's
// request to include the build date in the zip name (e.g.
// white-sands-site-2026-06-28.zip). Use the project's Hawaiʻi local date so
// releases remain recognizable to the team even after UTC midnight.
const BUILD_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Pacific/Honolulu",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date()); // YYYY-MM-DD
const ZIP_NAME = `white-sands-site-${BUILD_DATE}.zip`;

const run = (cmd) => {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: ROOT });
};
const capture = (cmd) => execSync(cmd, { cwd: ROOT }).toString().trim();

// 1 + 2 — install, then build. `npm run build` ends by converting out/ into the
// React-free static site (next build → postbuild → build-static), so out/ is the
// finished deliverable.
run("npm install");
run("npm run build");

// 3 — portability gate on out/. The whole point is that it opens off disk and
// hosts anywhere, so NOTHING React/Next may survive and the one stylesheet must
// be self-contained:
//   - no `/_next/` references at all (the React runtime is gone)
//   - no absolute `/assets/` paths (a stray one would 404 over file://)
//   - no leftover `url(../media/..)` font refs in the CSS (we ship no media/)
const htmlFiles = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".html"));
const htmlBad = htmlFiles
  .filter((f) => {
    const s = fs.readFileSync(path.join(OUT_DIR, f), "utf8");
    return s.includes("/_next/") || /[^.]\/assets\//.test(s);
  })
  .map((f) => `out/${f}`);

const cssPath = path.join(OUT_DIR, "css", "style.css");
const cssBad =
  fs.existsSync(cssPath) && /url\(\.\.\/media\//.test(fs.readFileSync(cssPath, "utf8"))
    ? ["out/css/style.css (unresolved ../media/ fonts)"]
    : [];

const badFiles = [...htmlBad, ...cssBad];
if (badFiles.length) {
  console.error(`Portability check failed in: ${badFiles.join(", ")} — aborting.`);
  process.exit(1);
}
console.log("verified: out/ is React-free with relative paths + embedded fonts.");

// 4 — zip the CONTENTS of out/ into a REAL ZIP archive.
// The old `tar -a -c -f x.zip` produced a *tar* archive with a .zip extension
// (the GNU tar on this machine can't write the zip format at all), which Karl
// couldn't open as a zip. `archiver` writes a spec-compliant zip with
// forward-slash paths that extracts cleanly on Windows, macOS and Linux.
//
// Each top-level entry of out/ is added at the zip ROOT by name (never "."), so
// there's no single-period wrapper folder — the Windows Explorer issue Karl hit.
function zipOut(outDir, zipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", () => resolve(archive.pointer()));
    output.on("error", reject); // e.g. zip file locked (Defender/OneDrive), disk full
    archive.on("warning", (err) => (err.code === "ENOENT" ? console.warn(err) : reject(err)));
    archive.on("error", reject);
    archive.pipe(output);
    for (const entry of fs.readdirSync(outDir)) {
      const full = path.join(outDir, entry);
      if (fs.statSync(full).isDirectory()) archive.directory(full, entry);
      else archive.file(full, { name: entry });
    }
    archive.finalize();
  });
}

(async () => {
  const oldZips = fs.readdirSync(ROOT).filter((f) => /^white-sands-site.*\.zip$/.test(f));
  for (const z of oldZips) fs.unlinkSync(path.join(ROOT, z));
  const bytes = await zipOut(OUT_DIR, path.join(ROOT, ZIP_NAME));
  console.log(`zipped out/ -> ${ZIP_NAME} (${(bytes / 1048576).toFixed(1)} MB, real ZIP)`);

  // 5 — find the previous release and list changed files since then
  let prevTag = "";
  try {
    prevTag = capture("gh release list --limit 1 --json tagName --jq \".[0].tagName\"");
  } catch {
    /* gh not ready or no releases yet */
  }
  let changed = "_First release — no previous build to diff against._";
  if (prevTag) {
    // The release tag may not exist locally (it lives on GitHub). Its name ends
    // in the commit short-sha (build-YYYY-MM-DD-<sha>), which IS in local
    // history, so diff against whichever ref resolves. Fall back if neither does.
    const prevSha = prevTag.split("-").pop();
    let ref = null;
    for (const candidate of [prevTag, prevSha]) {
      try {
        capture(`git rev-parse --verify --quiet "${candidate}^{commit}"`);
        ref = candidate;
        break;
      } catch {
        /* not a resolvable ref locally — try the next */
      }
    }
    if (ref) {
      try {
        const diff = capture(`git diff --name-only ${ref} HEAD`);
        changed = diff
          ? diff.split("\n").map((f) => `- \`${f}\``).join("\n")
          : `_No source files changed since ${prevTag}._`;
      } catch {
        changed = `_Could not compute file diff against ${prevTag}._`;
      }
    } else {
      changed = `_Previous release ${prevTag} not found in local history — diff skipped._`;
    }
  }

  // Tag this build by date + short commit so releases are unique and traceable.
  const sha = capture("git rev-parse --short HEAD");
  const tag = `build-${BUILD_DATE}-${sha}`;
  const notesPath = path.join(ROOT, "RELEASE_NOTES.tmp.md");
  fs.writeFileSync(
    notesPath,
    `Static build of the White Sands site (contents of \`out/\`).\n\n` +
      `Open \`index.html\` directly in a browser (file://) or drop the folder on any host — ` +
      `all paths are relative and fonts are embedded.\n\n` +
      `## Files changed since ${prevTag || "the start"}\n\n${changed}\n`,
  );

  try {
    run(`gh release create ${tag} "${ZIP_NAME}" --title "Site build ${tag}" --notes-file "${notesPath}"`);
  } finally {
    if (fs.existsSync(notesPath)) fs.unlinkSync(notesPath);
  }
  console.log(`\nRelease ${tag} created with ${ZIP_NAME} attached.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
