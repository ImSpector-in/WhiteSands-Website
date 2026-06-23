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

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "out");
const ZIP_NAME = "white-sands-site.zip";

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

// 4 — zip the contents of out/ (entries land at the zip root).
// Use tar/bsdtar (built into Windows 10/11, macOS and Linux): it writes
// spec-compliant forward-slash paths, so the zip extracts cleanly on any host.
// PowerShell 5.1's Compress-Archive writes backslashes, which break on Linux.
const zipPath = path.join(ROOT, ZIP_NAME);
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
run(`tar -a -c -f "${ZIP_NAME}" -C out .`);

// 5 — find the previous release and list changed files since then
let prevTag = "";
try {
  prevTag = capture("gh release list --limit 1 --json tagName --jq \".[0].tagName\"");
} catch {
  /* gh not ready or no releases yet */
}
let changed = "_First release — no previous build to diff against._";
if (prevTag) {
  const diff = capture(`git diff --name-only ${prevTag} HEAD`);
  changed = diff
    ? diff.split("\n").map((f) => `- \`${f}\``).join("\n")
    : `_No source files changed since ${prevTag}._`;
}

// Tag this build by date + short commit so releases are unique and traceable.
const sha = capture("git rev-parse --short HEAD");
const tag = `build-${new Date().toISOString().slice(0, 10)}-${sha}`;
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
