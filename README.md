# Industridesign Portfolio (Norwegian Website)

This repository contains a static, Norwegian-focused portfolio website for industrial and product design services.

## Tech Stack

- HTML pages (landing, category/location pages, projects, insights, pricing)
- CSS split into shared base + page bundles
- Vanilla JavaScript (`script.js`, `shared-nav.js`, component + article helpers)
- Static assets in `assets/`

No runtime build step is required.

## CSS Structure

The project now uses a safe split strategy:

- `styles/base.css` - shared global styles (tokens, typography, nav/footer, reusable blocks)
- `styles/home.css` - homepage-specific style bundle
- `styles/article.css` - insights/article-specific style bundle
- `styles/pricing.css` - pricing page bundle
- `styles/category.css` - category/location page bundle

Keep selectors/class names stable when moving rules between bundles.

## Component System

Reusable partials live in `components/` and are loaded by `components-loader.js`.

Current shared components:

- `side-nav.html`
- `article-layout.html`
- `project-cta.html`
- `contact-section-home.html`
- `contact-section-compact.html`
- `site-footer.html`

`components-loader.js` supports multi-pass loading so components can contain nested `data-component` slots.

## Key UX Features

- Hero media with clip shuffle (`script.js`)
- Interactive inquiry timeline with 5 weighted phases
- Web3Forms-based inquiry submission (no local mail client popup)
- Project grid hydrated from `assets/data/projects-manifest.js` / `.json`
- Article cards + shared article layout utilities
- WebP-first image references for improved payload and paint performance

## Search Indexing

Search engines use root indexing files:

- `sitemap.xml`
- `robots.txt`

### Sitemap Workflow

Whenever public pages are added/removed/renamed:

1. Update (or regenerate) `sitemap.xml`.
2. Deploy to production.
3. Re-submit `https://formaa.no/sitemap.xml` in Google Search Console.

## SEO Conventions

- Keep Norwegian copy and metadata as primary.
- Maintain one primary `h1` per page.
- Keep canonical and OG URL aligned with final page URL.
- Preserve robots directive (`index,follow,max-image-preview:large`).
- Keep contact links form-based to avoid exposing a raw email in page markup.

Structured data currently used:

- `index.html`: company/service JSON-LD
- `innsikt.html`: blog listing JSON-LD
- `innsikt-*.html`: article JSON-LD
- `prisestimat.html`: `WebPage` + `BreadcrumbList` JSON-LD

## URL Canonicalization

- `.htaccess` is used to canonicalize homepage access:
  - `/index.html` -> `/` (301)

## Local Development

Run a static server from project root:

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080/`

## Formatting

This project uses Prettier via pnpm.

Before commit/publish, run:

```bash
corepack pnpm format
```
