/**
 * Writes the PUBLIC Web3Forms access key into scripts/site.js.
 *
 * The static contact form (scripts/site.js) posts to Web3Forms from plain
 * client-side JS. Web3Forms access keys are public by design — they only allow
 * sending email to the form owner — so the key lives directly in that file,
 * which is the standard way Web3Forms is used on a static site (no server, no
 * build-time env needed for the deploy). This keeps ONE source of truth
 * (NEXT_PUBLIC_WEB3FORMS_KEY in .env.local) and stamps it into site.js.
 *
 * Idempotent: re-run any time the key changes (rotation).
 *   node scripts/inject-web3forms-key.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ENV_FILE = path.join(ROOT, ".env.local");
const SITE_JS = path.join(ROOT, "scripts", "site.js");

function readKey() {
  if (!fs.existsSync(ENV_FILE)) throw new Error(".env.local not found");
  const line = fs
    .readFileSync(ENV_FILE, "utf8")
    .split(/\r?\n/)
    .find((l) => l.trimStart().startsWith("NEXT_PUBLIC_WEB3FORMS_KEY="));
  if (!line) throw new Error("NEXT_PUBLIC_WEB3FORMS_KEY not set in .env.local");
  const value = line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
  if (!value) throw new Error("NEXT_PUBLIC_WEB3FORMS_KEY is empty in .env.local");
  return value;
}

const key = readKey();
const src = fs.readFileSync(SITE_JS, "utf8");
const re = /var WEB3FORMS_KEY = "[^"]*";/;
if (!re.test(src)) throw new Error('WEB3FORMS_KEY assignment not found in scripts/site.js');
// Function replacement so any $ in the key isn't treated as a backreference.
const next = src.replace(re, () => 'var WEB3FORMS_KEY = "' + key + '";');
fs.writeFileSync(SITE_JS, next);
console.log(`web3forms: wrote key into scripts/site.js (length ${key.length}, value not shown)`);
