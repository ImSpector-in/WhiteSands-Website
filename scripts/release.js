/**
 * One-shot release builder (Karl @ Kona Networks, request #3).
 *
 * Runs the full finish-line process so a deliverable is attached to the repo:
 *   1. npm install            — ensure deps are present
 *   2. npm run build          — next build + postbuild (relative paths, fonts, format)
 *   3. portability check      — fail if any built HTML still has absolute paths
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

// 1 + 2 — install and build
run("npm install");
run("npm run build");

// 3 — portability gate. No absolute /assets/ may remain in the built HTML or
// the JS chunks (a stray one would 404 over file://). /_next/ is intentionally
// left absolute inside JS (Turbopack invariant), so we only flag /assets/ there.
const htmlBad = fs
  .readdirSync(OUT_DIR)
  .filter((f) => f.endsWith(".html"))
  .filter((f) => /[^.]\/assets\/|[^.]\/_next\//.test(fs.readFileSync(path.join(OUT_DIR, f), "utf8")))
  .map((f) => `out/${f}`);

const chunksDir = path.join(OUT_DIR, "_next", "static", "chunks");
const jsBad = (fs.existsSync(chunksDir) ? fs.readdirSync(chunksDir) : [])
  .filter((f) => f.endsWith(".js"))
  .filter((f) => /[^.]\/assets\//.test(fs.readFileSync(path.join(chunksDir, f), "utf8")))
  .map((f) => `out/_next/static/chunks/${f}`);

const badFiles = [...htmlBad, ...jsBad];
if (badFiles.length) {
  console.error(`Absolute asset paths still present in: ${badFiles.join(", ")} — aborting.`);
  process.exit(1);
}
console.log("verified: built HTML + JS use relative asset paths.");

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
