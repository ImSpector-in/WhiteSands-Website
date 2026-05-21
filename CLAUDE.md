# White Sands Website — Project Instructions

## Project Overview
Building a professional website for **White Sands**, a general contracting construction company based in **Hawaii**.

- **Tool:** Google Stitch (AI-generated UI) — exports HTML/CSS/JS
- **Stack:** Plain HTML/CSS/JS — no framework, no build step
- **Hosting:** Vercel (connected to GitHub repo, auto-deploys on push)
- **Repo:** https://github.com/ImSpector-in/WhiteSands-Website.git
- **Style:** Clean & modern
- **Status:** In progress

## Key Files
- `PROJECT_BRIEF.md` — All client info: colors, logo, images, contact details, services. **Read this first before building anything.**
- `assets/` — Logo files and images go here
- `index.html` — Main entry point (exported from Stitch)

## Pages to Build
1. **Home** — Hero section, headline, CTA
2. **About** — Company story, mission, team
3. **Services** — List of general contracting services
4. **Gallery** — Photo grid of past work
5. **Contact** — Contact form + phone/email/address

## Workflow
1. Client info and content lives in `PROJECT_BRIEF.md`
2. Design and generate UI in Google Stitch using that brief
3. Export Stitch output into this repo
4. Refine and customize code here
5. Commit and push to GitHub

## Rules for This Project
- Always read `PROJECT_BRIEF.md` before making any design or content decisions
- Use the exact brand colors defined in the brief — do not invent colors
- Use the real logo file from `assets/` — never use a placeholder if the real one is available
- Keep code clean and simple — this is a marketing site, not an app
- Mobile-first: every page must look good on phone screens
- No unnecessary JavaScript — prefer CSS for animations and layout

## What NOT to Do
- Do not add features not listed in the brief
- Do not use frameworks (React, Next.js, etc.) unless explicitly asked — Stitch output is plain HTML/CSS/JS
- Do not commit `node_modules` or any build artifacts
