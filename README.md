# Industridesign Portfolio (Norwegian Website)

This repository contains a static, Norwegian-focused portfolio website for industrial design and product design services.

The site is optimized around:

- Norwegian content and SEO metadata
- A conversion-focused hero section
- Service and feature sections
- Interactive project-priority timeline in the inquiry form
- Project gallery driven by a shared project manifest
- Reusable HTML components loaded into `data-component` slots

## Tech Stack

- HTML (`index.html`, plus simple secondary pages)
- CSS (`styles.css`)
- Vanilla JavaScript (`script.js`, `shared-nav.js`, shared article utilities)
- Static assets in `assets/`

No build step is required for runtime.

## Main Pages

- `index.html` - Main landing page (hero, services, features, inquiry timeline, project grid)
- `oss.html` - Placeholder/info page with aligned SEO metadata
- `advanced-project.html` - Project listing page with aligned SEO metadata
- `innsikt.html` - Articles/insights page with aligned SEO metadata
- `bli-med.html` - Placeholder/info page with aligned SEO metadata
- `prisestimat.html` - Interactive pricing estimator page with range totals and SEO metadata

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

## Current UX and Features

### Hero Section

- Full-screen video background with clip shuffle (`script.js`)
- Dark overlay for text contrast
- CTA linking to inquiry section (`#application-form`)

### Inquiry Form + Timeline

- Interactive timeline with 5 phases:
  - Brukeranalyse
  - Konseptutvikling
  - Prototype
  - Validering
  - Ferdigstilling
- 4 draggable handles (mouse/pointer + keyboard arrow support)
- Segment percentages always constrained and normalized to sum to 100%
- Summary percentages auto-updated
- Hidden inputs populated with phase percentages for submission integration
- Form submit sends directly via Web3Forms (no local mail client popup)

## Search Indexing Files

<!-- NOTE: Search engines use these root files to discover and crawl the site. -->

- `sitemap.xml` - XML list of all public HTML pages that should be indexed
- `robots.txt` - crawler policy + sitemap location

### Sitemap Update Workflow

Whenever you add/remove/rename public pages:

1. Update `sitemap.xml` in the repository root.
2. Deploy changes to production.
3. Submit/re-submit `https://formaa.no/sitemap.xml` in Google Search Console.

### Projects Grid

- JavaScript hydrates cards from `assets/data/projects-manifest.js` / `.json`
- Shared detail template supports dynamic `?project=<slug>` rendering

## SEO and Metadata

All HTML pages are aligned to Norwegian-first industrial/product design intent:

- `lang="no"`
- optimized title and description tags
- keyword tags
- Open Graph tags
- Twitter card tags
- canonical URLs
- shared favicon references
- robots directive (`index,follow,max-image-preview:large`)
- locale hints (`og:locale`, `og:locale:alternate`)

Structured data:

- `index.html`: company/service JSON-LD
- `innsikt.html`: blog listing JSON-LD
- `innsikt-*.html`: article JSON-LD
- `prisestimat.html`: `WebPage` + `BreadcrumbList` JSON-LD

## Branding and Icons

- Favicon: `favicon-triangle.svg`
- Feature icons:
  - `assets/icons/produserbar-icon.svg`
  - `assets/icons/fremdrift-icon.svg`
  - `assets/icons/bedrift-icon.svg`
  - `assets/icons/brukerbehov-icon.svg`

## Directory Overview

```text
.
├── components/
│   ├── side-nav.html
│   ├── article-layout.html
│   ├── project-cta.html
│   ├── contact-section-home.html
│   ├── contact-section-compact.html
│   └── site-footer.html
├── index.html
├── oss.html
├── prosjekter.html
├── innsikt.html
├── bli-med.html
├── styles.css
├── script.js
├── shared-nav.js
├── components-loader.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── data/
└── README.md
```

## Local Development

Open `index.html` directly in your browser, or run a static file server.

Example:

```bash
python3 -m http.server 8080
```

Then visit:

- `http://localhost:8080/`

## Formatting

This project uses Prettier via pnpm.

Before commit/publish, run:

```bash
corepack pnpm format
```

## Notes for Future Changes

- Keep Norwegian copy and metadata consistent across all pages.
- Keep English support secondary (`description:en`, `og:locale:alternate`) instead of replacing NO-primary copy.
- Reuse existing color variables in `:root` and avoid introducing ad-hoc design tokens.
- Keep timeline phases and their color mapping in sync between:
  - segment colors
  - summary label/value colors
  - hidden input order
- Prefer updating existing components/sections in `components/` rather than duplicating markup in page files.
