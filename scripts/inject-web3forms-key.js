/**
 * Writes the PUBLIC Web3Forms access key into scripts/site.js.
 *
 * The static contact form (scripts/site.js) posts to Web3Forms from plain
 * client-side JS. Web3Forms access keys are public by design — they only allow
 * sending email to the form owner — so the key lives directly in that file,
 * which is the standard way Web3Forms is used on a static site (no server, no
 * build-time env needed for the deploy).
 *
 * This runs as the first step of `npm run build`, so a rotated key can never be
 * left un-stamped. It resolves the key from, in order:
 *
 *   1. NEXT_PUBLIC_WEB3FORMS_KEY in the environment (a shell var, or a CI/Vercel
 *      environment variable).
 *   2. .env.local — the local source of truth.
 *   3. The key already committed in scripts/site.js.
 *
 * Step 3 matters on CI: .env* is gitignored, so .env.local does NOT exist on
 * Vercel. The committed key IS the correct value there, so that is a normal
 * build, not an error. Only a build with no key from any source fails.
 *
 * Idempotent: re-run any time the key changes (rotation).
 *   node scripts/inject-web3forms-key.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ENV_FILE = path.join(ROOT, ".env.local");
const SITE_JS = path.join(ROOT, "scripts", "site.js");
const NAME = "NEXT_PUBLIC_WEB3FORMS_KEY";
const KEY_RE = /var WEB3FORMS_KEY = "([^"]*)";/;

// The key from the environment or .env.local, or null to keep what is committed.
function readKey() {
  const fromEnv = (process.env[NAME] || "").trim();
  if (fromEnv) return { key: fromEnv, source: "environment" };

  if (!fs.existsSync(ENV_FILE)) return null;

  const line = fs
    .readFileSync(ENV_FILE, "utf8")
    .split(/\r?\n/)
    .find((l) => l.trimStart().startsWith(NAME + "="));
  if (!line) return null;

  const value = line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
  return value ? { key: value, source: ".env.local" } : null;
}

const src = fs.readFileSync(SITE_JS, "utf8");
const match = src.match(KEY_RE);
if (!match) throw new Error("WEB3FORMS_KEY assignment not found in scripts/site.js");

const found = readKey();

if (!found) {
  // No env var and no .env.local — the expected CI case. Keep the committed key.
  if (!match[1]) {
    console.error(
      `web3forms: no ${NAME} in the environment, no .env.local, and scripts/site.js ` +
        "has no key. The contact form would be dead — set the key and rebuild.",
    );
    process.exit(1);
  }
  console.log(
    `web3forms: no ${NAME} and no .env.local; keeping the key committed in ` +
      `scripts/site.js (length ${match[1].length}, value not shown).`,
  );
  return;
}

// Function replacement so any $ in the key isn't treated as a backreference.
fs.writeFileSync(SITE_JS, src.replace(KEY_RE, () => 'var WEB3FORMS_KEY = "' + found.key + '";'));
console.log(
  `web3forms: wrote key from ${found.source} into scripts/site.js ` +
    `(length ${found.key.length}, value not shown).`,
);
