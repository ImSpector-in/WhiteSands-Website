@AGENTS.md

# White Sands Website — Project Instructions

## Project Overview
Building a professional website for **White Sands Construction Inc.**, a general contracting company based in **Hawaii**.

- **Stack:** Next.js 16 + Tailwind CSS v4 + TypeScript
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Hosting:** Vercel (GitHub auto-deploy)
- **Repo:** https://github.com/ImSpector-in/WhiteSands-Website.git
- **Style:** Clean & modern, inspired by castawayhawaii.com and hdcc.com

## Key Files
- `PROJECT_BRIEF.md` — All client info: colors, images, contact details, services
- `public/assets/` — Logo and all project photos
- `app/` — Next.js App Router pages
- `components/` — Reusable React components

## Pages
1. **Home** (`app/page.tsx`) — Hero carousel, stats, services preview, portfolio teaser, CTA
2. **About** (`app/about/page.tsx`) — Company story, why choose us
3. **Services** (`app/services/page.tsx`) — 6 service cards
4. **Gallery** (`app/gallery/page.tsx`) — Filterable photo grid (46 photos)
5. **Contact** (`app/contact/page.tsx`) — Contact info + Formspree form

## Brand Colors (Tailwind v4 — defined in app/globals.css @theme)
- `primary` → #2B6BAD (blue — nav, buttons, headings)
- `accent`  → #F5A623 (gold — CTAs, hover, highlights)
- `sand`    → #C9A87C (sandy tan — backgrounds)
- `frame`   → #7B4F2E (brown — decorative)
- `dark`    → #111111 (footer background)

## Fonts
- Headings: Montserrat (`font-heading`) — via next/font/google
- Body: Inter (`font-body`) — via next/font/google

## Contact Form
Formspree — replace `YOUR_FORM_ID` in `components/contact/ContactForm.tsx` with the real ID from formspree.io.

## Rules
- Always read `PROJECT_BRIEF.md` before making design or content decisions
- Use brand colors defined above — never invent new ones
- Mobile-first: every page must look good at 375px
- Keep components small and focused — one job per component
- Animations use Framer Motion `whileInView` with `viewport={{ once: true }}`
- Client components need `"use client"` — only add when required (state, effects, animations)
- Image paths in `public/` must be URL-encoded when filenames have spaces or parens
