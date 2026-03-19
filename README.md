# Industridesign Portfolio (Norwegian Website)

This repository contains a static, Norwegian-focused portfolio website for industrial design and product design services.

The site is optimized around:

- Norwegian content and SEO metadata
- A conversion-focused hero section
- Service and feature sections
- Interactive project-priority timeline in the inquiry form
- Project gallery with automatic expansion to 20 items

## Tech Stack

- HTML (`index.html`, plus simple secondary pages)
- CSS (`styles.css`)
- Vanilla JavaScript (`script.js`)
- Static assets in `assets/`

No build step is required for runtime.

## Main Pages

- `index.html` - Main landing page (hero, services, features, inquiry timeline, project grid)
- `oss.html` - Placeholder/info page with aligned SEO metadata
- `prosjekter.html` - Placeholder/info page with aligned SEO metadata
- `tips.html` - Placeholder/info page with aligned SEO metadata
- `bli-med.html` - Placeholder/info page with aligned SEO metadata

## Current UX and Features

### Hero Section

- Full-screen video background (`assets/images/test-animation.mp4`)
- Dark gradient overlay for text contrast
- Custom white triangle logo in hero
- CTA button linking to inquiry section (`#application-form`)

### Service Section ("Dette gjør vi")

- 6 service cards
- `Produktdesign` card visually highlighted with primary border color

### Features Section ("Fordeler")

- Banner image
- 4 feature points with icon assets from `assets/icons/`
- Primary color emphasis on key phrase: `ekte brukerbehov`

### Inquiry Form + Timeline

- Interactive timeline with 6 phases:
  - Brukeranalyse
  - Konseptutvikling
  - Prototype
  - Finjustering
  - Validering
  - Ferdigstilling
- 5 draggable handles (mouse/pointer + keyboard arrow support)
- Segment percentages always constrained and normalized to sum to 100%
- Summary percentages auto-updated
- Hidden inputs populated with phase percentages for submission integration

### Projects Grid

- Starts with local real projects in markup
- JavaScript fills up to 20 tiles total
- Uses available real image pool first, then neutral placeholders

## SEO and Metadata

All HTML pages are aligned to Norwegian industrial/product design intent:

- `lang="no"`
- optimized title and description tags
- keyword tags
- Open Graph tags
- Twitter card tags
- canonical URLs
- shared favicon references

`index.html` also contains JSON-LD structured data for service discoverability.

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
├── index.html
├── oss.html
├── prosjekter.html
├── tips.html
├── bli-med.html
├── styles.css
├── script.js
├── favicon-triangle.svg
├── assets/
│   ├── images/
│   └── icons/
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
- Reuse existing color variables in `:root` and avoid introducing ad-hoc design tokens.
- Keep timeline phases and their color mapping in sync between:
  - segment colors
  - summary label/value colors
  - hidden input order
- Prefer updating existing components/sections rather than adding parallel variants.
