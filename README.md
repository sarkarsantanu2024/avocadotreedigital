# Avocado Tree Digital — Landing Page

Static landing page, split into standard files for deployment.

## Structure

```
index.html          Main page markup
css/
└── styles.css      All styles
js/
└── script.js       Interactions (hero H/A toggle, scroll nav,
                     reveal-on-scroll, count-up stats, pricing gate)
assets/images/
├── hero-wheat.webp          Hero background
├── valueprop-treetrunk.webp Value Proposition background
├── advantage-mushroom.webp  Growth Advantage background
├── cta-lens.webp            Final CTA background
├── logo-white.webp          Logo for dark backgrounds (nav over hero, footer)
└── logo-dark.webp           Logo for light backgrounds (nav on scroll)
```

> Note: The `raw/` folder contains a separate website and is kept in the repository for reference. It is not part of the static landing page deployment described above.

## Deploying

Upload the whole `atd-site/` folder to any static host (Netlify, Vercel,
S3, Nginx, Apache, etc.). No build step required. `index.html` is the entry point.
All paths are relative, so it works from any subdirectory.

## External dependency

Fonts load from Google Fonts (Montserrat + Hanken Grotesk) via a `<link>`
in `index.html`. Requires internet access at page load. To self-host, download
the fonts, add `@font-face` rules to `css/styles.css`, and remove the Google
Fonts `<link>`.

## Backend setup

This repo now includes a serverless API route at `api/form-submit.js`.
The front-end form posts to `/api/form-submit` and saves leads into Neon.

### Required environment variables

Create a `.env` file from `.env.example`, and set:

- `NEON_HOST`
- `NEON_PORT`
- `NEON_DB`
- `NEON_USER`
- `NEON_PASSWORD`

### Deployment for Vercel

1. Install dependencies:
   `npm install`
2. Deploy to Vercel.
3. Configure the same Neon environment variables in Vercel.

### Local testing

1. Install dependencies: `npm install`
2. Run locally: `npx vercel dev`
3. Open the page and submit the pricing gate form.

## Before going live (developer TODO)

1. Booking links use mailto:. Replace hrefs with your real booking URL
   (e.g. Calendly/HubSpot).
2. "Trusted by" strip and testimonials use placeholder content. Swap in real
   client logos and approved quotes.

## Notes

- No framework, no bundler. Plain HTML/CSS/JS.
- Colours, fonts, and spacing are defined as CSS variables at the top of styles.css.
