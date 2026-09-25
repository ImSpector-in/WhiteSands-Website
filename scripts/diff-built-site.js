/**
 * Diff the built site (the contents of out/) against the zip attached to the
 * previous GitHub release — Karl @ Kona Networks' request.
 *
 * release.js already lists the SOURCE files changed between release tags, but
 * that isn't what Karl reviews: one edit to a shared component rewrites several
 * rendered pages, and a source diff never shows that. This compares what was
 * actually shipped last time against what is about to ship.
 *
 * It does NOT extract the old zip. Every zip entry stores a CRC32 of its
 * contents, so comparing that against zlib.crc32() of the local file is an
 * exact content comparison for the price of reading the central directory.
 *
 * Never throws for an expected condition (no previous release, no zip asset,
 * gh not authenticated, unreadable archive). A release must not fail because
 * its notes could not be enriched — the caller gets { ok: false, reason }.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { execSync } = require("child_process");
const AdmZip = require("adm-zip");

// Zip paths are always forward-slashed and never start with "./".
const normalize = (p) => {
  const slashed = p.split(String.fromCharCode(92)).join("/");
  return slashed.startsWith("./") ? slashed.slice(2) : slashed;
};

const crcOf = (buf) => zlib.crc32(buf) >>> 0;

// Every file in a directory tree, as { "js/site.js": <crc32>, ... }.
function hashTree(dir, base = dir, acc = {}) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) hashTree(full, base, acc);
    else acc[normalize(path.relative(base, full))] = crcOf(fs.readFileSync(full));
  }
  return acc;
}

// The previous release's zip, as { path: crc32 }, read from its central
// directory. Directory entries carry no content and are skipped.
function hashReleaseZip(zipPath) {
  const entries = new AdmZip(zipPath).getEntries();
  const acc = {};
  for (const e of entries) {
    if (e.isDirectory) continue;
    acc[normalize(e.entryName)] = e.header.crc >>> 0;
  }
  return acc;
}

function diffBuiltSite({ prevTag, outDir, tmpDir, cwd }) {
  if (!prevTag) return { ok: false, reason: "no previous release to compare against" };

  // Download the previous release's zip asset into a scratch dir.
  fs.mkdirSync(tmpDir, { recursive: true });
  for (const f of fs.readdirSync(tmpDir)) fs.rmSync(path.join(tmpDir, f), { force: true });
  try {
    execSync(`gh release download ${prevTag} --pattern "*.zip" --dir "${tmpDir}" --clobber`, {
      cwd,
      stdio: "pipe",
    });
  } catch (e) {
    return { ok: false, reason: `could not download the zip attached to ${prevTag}` };
  }

  const zips = fs.readdirSync(tmpDir).filter((f) => f.toLowerCase().endsWith(".zip"));
  if (!zips.length) return { ok: false, reason: `${prevTag} has no zip asset attached` };

  let before;
  try {
    before = hashReleaseZip(path.join(tmpDir, zips[0]));
  } catch {
    return { ok: false, reason: `the zip attached to ${prevTag} could not be read` };
  }

  const after = hashTree(outDir);

  const added = Object.keys(after).filter((f) => !(f in before)).sort();
  const removed = Object.keys(before).filter((f) => !(f in after)).sort();
  const modified = Object.keys(after)
    .filter((f) => f in before && before[f] !== after[f])
    .sort();

  return { ok: true, prevTag, zipName: zips[0], added, modified, removed, total: Object.keys(after).length };
}

// Markdown for the release notes. Karl reads this to decide what to re-check
// before promoting, so the counts lead and unchanged builds say so explicitly.
// Markdown for the release notes. Karl reads this to decide what to re-check
// before promoting, so the counts lead and an unchanged build says so plainly.
function formatBuiltDiff(result) {
  if (!result.ok) return `_Site-file comparison unavailable — ${result.reason}._`;

  const { added, modified, removed, zipName, total } = result;
  if (!added.length && !modified.length && !removed.length) {
    return `_No site files changed since \`${zipName}\` — this build is byte-identical (${total} files)._`;
  }

  const summary = [
    added.length ? `${added.length} added` : null,
    modified.length ? `${modified.length} modified` : null,
    removed.length ? `${removed.length} removed` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const section = (label, files) =>
    `**${label} (${files.length})**\n\n${files.map((file) => `- \`${file}\``).join("\n")}`;

  const parts = [
    `Compared against \`${zipName}\` — ${summary} (${total} files in this build).`,
  ];
  if (added.length) parts.push(section("Added", added));
  if (modified.length) parts.push(section("Modified", modified));
  if (removed.length) parts.push(section("Removed", removed));
  return parts.join("\n\n");
}

module.exports = { diffBuiltSite, formatBuiltDiff, hashTree, hashReleaseZip };
