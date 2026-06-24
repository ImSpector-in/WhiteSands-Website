# White Sands Construction — Website

Marketing website for White Sands Construction, Inc. (Kamuela, HI).

**This is a static website** — the deployed/shipped site in `out/` is plain
HTML, CSS, and a little vanilla JavaScript, with **no React or framework at
runtime**. It opens correctly straight off disk (`out/index.html`) and hosts on
any plain web server (no Node.js required), with no hydration and no console
errors.

## What ships (the `out/` folder)

- Plain HTML pages (formatted/readable source)
- One self-contained CSS file (`css/style.css`, fonts embedded as data URIs)
- One vanilla-JS file (`js/site.js`) for the hero carousel, mobile menu, gallery
  filter + lightbox, and contact form
- `assets/` images, favicon, and an `.htaccess` for Apache hosts

## How it's built (tooling — not shipped to the site)

The HTML is authored as components and generated at build time, then the build
strips the framework back out so only static files ship:

- **Next.js 16** (App Router) + **Tailwind CSS v4** + **TypeScript** — used only
  as the **build-time renderer**; none of it runs on the live site.
- `scripts/postbuild.js` + `scripts/build-static.js` — convert the render into
  the React-free static site described above.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit http://localhost:3000

## Build for production

```bash
npm run build
```

This runs three steps in order and leaves the finished site in `out/`:

1. `next build` — renders the pages (static export)
2. `scripts/postbuild.js` — pretty-prints the HTML, rewrites paths to relative,
   embeds the fonts into the CSS
3. `scripts/build-static.js` — removes the React/Next runtime, drops in
   `js/site.js`, and swaps the result in as `out/`

The output is fully self-contained and portable:

- **Open it locally:** double-click `out/index.html` — it renders off disk
  (`file://`) with working heroes, no server needed. (Or `npx serve out`.)
- **Host it:** upload the **contents** of `out/` to your web server's document
  root. No Node.js required on the server.

To cut a versioned deliverable, `npm run release` builds, runs a portability
check, zips `out/`, and attaches it as a GitHub release with a list of changed
files (requires the `gh` CLI to be authenticated).

### Editing content

Page content lives in the React source (`app/`, `components/`) — that's what the
build renders from. Edit there, then `npm run build` to regenerate `out/`. Don't
hand-edit `out/`; it's overwritten on every build.

## Apache configuration

`public/.htaccess` is copied into `out/` automatically and handles:

- Clean URL routing (e.g. `/about` instead of `/about.html`)
- Gzip compression
- Browser caching for images, CSS, JS, and fonts

Make sure `mod_rewrite`, `mod_deflate`, `mod_expires`, and `mod_headers` are
enabled on the server.

## Contact form

The contact form submits to RSForm!Pro in Joomla. Replace `RSFORM_ID` in
`components/contact/ContactForm.tsx` with the form's ID (Joomla admin →
RSForm!Pro → the form). Joomla sends the email via its configured SMTP.

## Hero images

`scripts/generate-hero-webp.js` regenerates responsive WebP versions of the
homepage hero images. Run with `node scripts/generate-hero-webp.js` after
replacing the source JPEGs in `public/assets/images/new pictures/`.
