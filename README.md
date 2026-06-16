# White Sands Construction — Website

Marketing website for White Sands Construction, Inc. (Kamuela, HI).

## Stack

- Next.js 16 (App Router, static export)
- Tailwind CSS v4
- TypeScript

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

This generates a static site in the `out/` folder. Upload the **contents**
of `out/` to your web server's document root.

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
