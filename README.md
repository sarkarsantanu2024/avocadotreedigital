# Avocado Tree Digital — Landing Page

Static landing page, split into standard files for deployment.

## Structure

```
atd-site/
├── index.html          Main page markup
├── css/
│   └── styles.css      All styles
├── js/
│   └── script.js       Interactions (hero H/A toggle, scroll nav,
│                        reveal-on-scroll, count-up stats, pricing gate)
└── assets/
    ├── hero-wheat.webp          Hero background
    ├── valueprop-treetrunk.webp Value Proposition background
    ├── advantage-mushroom.webp  Growth Advantage background
    ├── cta-lens.webp            Final CTA background
    ├── logo-white.webp          Logo for dark backgrounds (nav over hero, footer)
    └── logo-dark.webp           Logo for light backgrounds (nav on scroll)
```

## Deploying

Upload the whole `atd-site/` folder to any static host (Netlify, Vercel,
S3, Nginx, Apache, etc.). No build step required. `index.html` is the entry point.
All paths are relative, so it works from any subdirectory.

## External dependency

Fonts load from Google Fonts (Montserrat + Hanken Grotesk) via a `<link>`
in `index.html`. Requires internet access at page load. To self-host, download
the fonts, add `@font-face` rules to `css/styles.css`, and remove the Google
Fonts `<link>`.

## Before going live (developer TODO)

1. Pricing gate form (in js/script.js) currently unlocks pricing client-side
   only. Wire the submit handler to your CRM / marketing platform.
2. "Book a Strategy Call" buttons use mailto:. Replace hrefs with your real
   booking URL (e.g. Calendly/HubSpot).
3. "Trusted by" strip and testimonials use placeholder content. Swap in real
   client logos and approved quotes.

## Notes

- No framework, no bundler. Plain HTML/CSS/JS.
- Colours, fonts, and spacing are defined as CSS variables at the top of styles.css.
