# Industridesign Portfolio (Norwegian Website)

This repository contains a static, Norwegian-focused portfolio website for industrial and product design services.

## Tech Stack

- HTML pages (landing, category/location pages, projects, insights, pricing, services/process at `tjenester-prosess.html`, dedicated inquiry at `application-form.html`)
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
- `application-form.html` (design consultation inquiry + timeline; public URL `/application-form`)
- `article-layout.html`
- `project-cta.html`
- `contact-section-compact.html`
- `privacy-trust-section.html` (personvern og konfidensialitet block)
- `partner-logos-section.html` (Samarbeidspartnere logo strip)
- `cooperation-partners.html` (partner cards on Om oss)
- `hero-process-flow.html` (process strip under homepage hero)
- `site-footer.html`

`components-loader.js` supports multi-pass loading so components can contain nested `data-component` slots.

## Key UX Features

- Hero media with clip shuffle (`script.js`)
- Interactive inquiry timeline with 5 weighted phases
- Web3Forms-based inquiry submission (no local mail client popup)
- Project grid hydrated from `assets/data/projects-manifest.js` / `.json`
- Ideas grid strip hydrated from `assets/data/grid-strip-media-manifest.js` (`assets/images/grid-strip/` only)
- Article cards + shared article layout utilities
- WebP-first image references for improved payload and paint performance

## Search Indexing

Search engines and AI crawlers use root discovery files:

- `sitemap.xml` — one entry per public route (106 URLs; includes `/tjenester-prosess`)
- `robots.txt` — crawl policy + explicit rules for AI bots (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, etc.)
- `llms.txt` — LLM discovery: site scope, important URLs, policies
- `ai.txt` — short AI crawler companion (topics, key hubs, links to `llms.txt` and sitemap)

Regenerate crawler files with `pnpm generate:crawler-files` (reads hub lists from `scripts/lib/public-routes.mjs`).

### Publish workflow

Before commit or deploy, run the full sequence:

```bash
corepack pnpm publish:prepare
```

This runs, in order: `generate:sitemap` → `generate:crawler-files` → `sync:meta-descriptions` → `generate:schema-markup` → `generate:innsikt-indexes` → `generate:prosjekter-indexes` → `format`.

Or step by step:

1. Regenerate `sitemap.xml` with `pnpm generate:sitemap` (auto-discovers `innsikt-*.html` stubs, category pages, and static hubs from `scripts/lib/public-routes.mjs`).
2. Regenerate `robots.txt`, `llms.txt`, and `ai.txt` with `pnpm generate:crawler-files`.
3. Run `pnpm sync:meta-descriptions` so `meta description` / OG / Twitter text match each page’s visible copy (`section-lead`, hero, article JSON). Homepage uses curated SERP copy (see **SEO Conventions**).
4. Run `pnpm generate:innsikt-indexes` and `pnpm generate:prosjekter-indexes` so folder routes match sitemap paths on GitHub Pages.
5. Run `pnpm generate:schema-markup` after title/description or FAQ changes.
6. Verify old URLs were removed (avoid stale `404` entries; `/gallery` must not be listed).
7. Verify all new canonical routes are included once in `sitemap.xml`.
8. Deploy to production.
9. Re-submit `https://formaa.no/sitemap.xml` in Google Search Console.

### SEO / Indexing Maintenance Checklist

Use this checklist after structural updates (new pages, renamed slugs, new categories):

1. `sitemap.xml`
   - Add new public URLs.
   - Remove deprecated URLs.
   - Keep URL style consistent (extensionless public routes).
2. `robots.txt`, `llms.txt`, `ai.txt`
   - Regenerate with `pnpm generate:crawler-files` after hub/route changes.
   - Keep retired routes blocked in `robots.txt` (for example `/gallery`, `/article-template`).
3. Page metadata
   - Keep one canonical URL per page.
   - Ensure `<title>`, `meta description`, OG/Twitter title+description match page intent.
   - **Do not rewrite visible page copy for SEO** — adapt meta to match existing text on the page.
   - Keep the site favicon aligned across all page heads. Current assets: `/assets/square-favicon.svg` (primary) and `/assets/square-favicon-fallback.png` (PNG fallback for Google Search).
4. Structured data
   - Keep JSON-LD valid and aligned with canonical URL.
   - After SEO or route changes, run `corepack pnpm generate:schema-markup` (writes `@graph` JSON-LD on indexable HTML; updates `assets/data/project-schema-by-slug.js`).
5. Internal linking
   - Add relevant contextual links with existing shared classes (see **Internal linking** below).
   - Avoid over-linking repeated terms in the same paragraph.
6. Final validation
   - Run `corepack pnpm publish:prepare` (or at minimum `corepack pnpm format`).
   - Spot-check key pages in browser and re-submit sitemap if needed.

## Partner logos (`Samarbeidspartnere`)

- **Component:** `components/partner-logos-section.html` — slot: `<div data-component="partner-logos-section"></div>`
- **Data:** `assets/data/company-partners.json` → run `corepack pnpm generate:company-partners-manifest`
- **Assets:** `assets/company-logos/` — run `corepack pnpm process:company-logos` after adding a source file (grayscale + equal height `.webp`)
- **Scripts on page:** `company-partners-manifest.js` + `shared-partner-logos.js` (see `oss.html`)

## Internal linking

Use existing patterns only; do not invent new link colors or button styles.

- **Inline copy links:** `a.internal-text-link` (global style in `styles/base.css`: black, semibold). Use for words or phrases inside paragraphs on pages such as `index.html`, `prisestimat.html`, `oss.html`, and for HTML inside innsikt article JSON `blocks[].text`.
- **Inquiry page links:** use `/application-form` for CTA/contact links that should open the dedicated form page directly (instead of homepage hash links).
- **Category chips:** `div.service-tags` + `a.service-tag`, same markup as category pages; public URLs are extensionless (for example `/category/{tjeneste}/oslo`). Prefer root-absolute `href` values like `/category/design/norge` so links resolve correctly from any path; on-disk files remain `category/.../*.html` (see `.htaccess`).
- **Insights articles:** `shared-article.js` renders `blocks` as `<p>` / `<h2>`; embed full `<a class="internal-text-link" href="...">` strings in JSON where needed.
- **Sitemap:** Adding or changing internal links does not change public URLs; update `sitemap.xml` only when routes (paths) change.

### Link rebalancing (current strategy)

Category pages no longer cross-link to every other service via a “Velg kategori” chip grid. Instead:

- **Category pages:** cross-service grid replaced with a short user-value row (`Prosess` → `/tjenester-prosess`, `Innsikt` → `/innsikt`, `Om oss` → `/oss`). Inline body links in `section-lead` point to Innsikt articles or hub pages where relevant, not to other category URLs.
- **Homepage:** service tag row links to `/tjenester-prosess`, `/innsikt`, `/prosjekter`, `/oss` (not category hubs). FAQ and “For hvem” blocks link to Innsikt and `/tjenester-prosess` instead of category pages where appropriate.
- **Footer nav + footer SEO copy:** category links in `components/site-footer.html` are unchanged (intentional SEO anchor text).
- **Breadcrumbs + region switchers on category pages:** unchanged.
- **Homepage hashtag links:** unchanged.

## EN intent landings

English service pages live under `en/` (for example `/en/product-rendering`). They are **not** translations of Norwegian category pages: separate copy, keywords, structure, and CTAs for international search intent.

- **Layout (shared):** `components/en-landing-layout.html` — hero, form shell, footer; loaded via `components-loader.js`
- **Copy per page:** `assets/data/en-landing-pages.js` — title, lead, deliverables, turnaround, price, hero image, SEO blocks, crosslinks, JSON-LD
- **Thin HTML routes:** `en/{slug}.html` — only `<head>` SEO metadata + `data-en-landing-page="{slug}"` + layout slot
- **Hydration:** `en/en-landing-render.js` (after `components:ready`)
- Styles: `styles/en-landing.css` + `styles/base.css` only (no `script.js`, no hero video)
- Do **not** add EN links to `side-nav` or `site-footer`; use contextual cross-links in `crosslinksHtml` / NO category pages
- Do **not** use `hreflang` between NO category URLs and EN landings
- Add new `/en/*` routes to `sitemap.xml` when published

To add or edit a service: extend `EN_LANDING_PAGES` in `en-landing-pages.js`, add a thin `en/{slug}.html` with matching meta, and sitemap entry.

## SEO Conventions

- Keep Norwegian copy and metadata as primary.
- Maintain one primary `h1` per page.
- Keep canonical and OG URL aligned with final page URL.
- Preserve robots directive (`index,follow,max-image-preview:large`) on indexable pages; `article-template.html` is `noindex` and omitted from `sitemap.xml` (layout shell only).
- Keep contact links form-based to avoid exposing a raw email in page markup.
- Keep the active brand social profiles aligned across visible social buttons and structured data `sameAs` links. Current X profile: `https://x.com/FormaaDesignAS`.

### Meta copy rules

- **Adapt meta to page text, not the other way around.** Change `<title>`, `meta description`, OG/Twitter, keywords, and JSON-LD descriptions — do not rewrite visible `section-lead`, hero, or footer copy for SEO.
- **Primary keywords site-wide:** `produktutvikling` and `3D-visualisering`. Secondary: industridesign, produktdesign, prototype, 3D-modellering, 3D-design, visualisering, designstudio **or** designbyrå.
- **Never use `designstudio` and `designbyrå` in the same sentence** in meta or schema — pick one per sentence/page context. `sync-meta-descriptions.mjs` enforces this when building descriptions from page copy.
- **Homepage SERP targets** (curated in `scripts/sync-meta-descriptions.mjs`, not auto-synced from hero):
  - Title: `Formaa: Produktutvikling og 3D-visualisering for startups i Norge`
  - Description: `Designbyrå som vil få ideen din til å ta form. Er du en gründer eller driver en startup? Vi hjelper deg med produktutvikling, 3D/CAD, visualisering og prototype.`
- Other hub and category pages: titles/descriptions generated from existing page copy via `pnpm sync:meta-descriptions`.

### Generator scripts

| Script                                    | Purpose                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `scripts/generate-sitemap.mjs`            | Writes `sitemap.xml` from routes + category/innsikt/prosjekt discovery    |
| `scripts/generate-crawler-files.mjs`      | Writes `robots.txt`, `llms.txt`, `ai.txt`                                 |
| `scripts/sync-meta-descriptions.mjs`      | Syncs description + titles from page copy (curated override for homepage) |
| `scripts/generate-schema-markup.mjs`      | Writes JSON-LD `@graph` on indexable HTML pages                           |
| `scripts/generate-innsikt-indexes.mjs`    | Writes `innsikt/{slug}/index.html` from root stubs                        |
| `scripts/generate-prosjekter-indexes.mjs` | Writes `prosjekter/{slug}/index.html` from root stubs                     |
| `scripts/lib/public-routes.mjs`           | Shared static hub routes for sitemap + crawler files                      |
| `scripts/lib/project-seo-slugs.mjs`       | Shared catalog ↔ SEO slug map for prosjekter URLs                         |

Structured data currently used (regenerate with `pnpm generate:schema-markup`):

- All indexable pages: single JSON-LD `@graph` with `WebSite`, entity-linked `Organization` (`https://formaa.no/#organization`), and page-type nodes
- `index.html`: `WebSite`, `LocalBusiness`, `ProfessionalService`, `Organization`, `WebPage`, `FAQPage`
- `tjenester-prosess.html`: `WebPage`, `BreadcrumbList`, `Service`
- Category pages: `BreadcrumbList`, `WebPage`, `Service`
- `innsikt*.html` / `innsikt/*/index.html`: `BlogPosting` (+ `HowTo` when the article has multiple `h2` steps)
- `prisestimat.html`: `WebPage`, `BreadcrumbList`, package `Service` offers
- `advanced-project.html`: hub `CollectionPage`; per-project `CreativeWork` injected via `assets/js/project-schema-inject.js` + `project-schema-by-slug.js`
- `en/*.html`: merged `@graph` via `en/en-landing-render.js` (`inLanguage: en`)
- Skipped: redirects (`prosjekt-*.html` stubs), `404.html`, `gallery.html`, `article-template.html`, `components/*`

### Target SEO phrases (page ownership)

Use one primary page per phrase cluster; link contextually from other pages. Do not repeat the same exact phrase on every page.

| Phrase cluster                                                            | Primary URL                                                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| produktutvikling, 3D-visualisering, produktutviklingsbyrå, startup        | `/` (homepage), `/tjenester-prosess`                                                        |
| hjelp med produktidé, utvikle produktidé, designe egen, lage eget produkt | `/innsikt/fra-oppfinnelse-til-produksjon`, `/category/konseptutvikling/norge`               |
| hvordan lage prototype, prototypeutvikling                                | `/category/prototyping/norge`, `/innsikt/hvordan-lage-prototype`                            |
| få produsert oppfinnelse                                                  | `/`, `/innsikt/fra-oppfinnelse-til-produksjon`                                              |
| hardware startup norge                                                    | `/`, `/innsikt/produktutvikling-hardware-startup`                                           |
| CAD designer, CAD-modelering                                              | `/category/cad-modelering/norge`, `/tjenester-prosess`                                      |
| tekniske tegninger                                                        | `/category/teknisk-tegning/norge`                                                           |
| 3D modellering, 3D-design, visualisering                                  | `/category/3d-modelering/norge`, `/category/visualisering/norge`                            |
| industridesign, produktdesign, designbyrå / designstudio                  | `/category/industridesign/norge`, `/category/produktdesign/norge`, `/category/design/norge` |
| prototype / produktutvikling pricing intent                               | `/prisestimat`                                                                              |

Homepage also has an FAQ block (`aria-label="Vanlige spørsmål om produktutvikling"`) targeting question-style queries with links to category and Innsikt pages.

### Innsikt articles

Source files are root stubs `innsikt-{slug}.html` with canonical `/innsikt/{slug}`. Run `pnpm generate:innsikt-indexes` to write `innsikt/{slug}/index.html` for static hosts. Add new stubs to `innsikt.html` grid and `article-image-map.js`.

| Slug                                | Source stub                                      | Topic                    |
| ----------------------------------- | ------------------------------------------------ | ------------------------ |
| `sok-stotte-innovasjon-norge`       | `innsikt-sok-stotte-innovasjon-norge.html`       | Innovasjon Norge søknad  |
| `hva-er-industridesign`             | `innsikt-hva-er-industridesign.html`             | Industridesign intro     |
| `ux-er-ikke-produktdesign`          | `innsikt-ux-er-ikke-produktdesign.html`          | UX vs produktdesign      |
| `hvem-trenger-design`               | `innsikt-hvem-trenger-design.html`               | Hvem trenger design      |
| `hvordan-design-sparer-penger`      | `innsikt-hvordan-design-sparer-penger.html`      | Design sparer penger     |
| `branding-og-produktdesign`         | `innsikt-branding-og-produktdesign.html`         | Branding + produktdesign |
| `design-for-crowdfunding`           | `innsikt-design-for-crowdfunding.html`           | Crowdfunding + design    |
| `hvordan-lage-prototype`            | `innsikt-hvordan-lage-prototype.html`            | Hvordan lage prototype   |
| `fra-oppfinnelse-til-produksjon`    | `innsikt-fra-oppfinnelse-til-produksjon.html`    | Oppfinnelse → produksjon |
| `produktutvikling-hardware-startup` | `innsikt-produktutvikling-hardware-startup.html` | Hardware startup Norge   |

Legacy flat URLs `innsikt-{slug}` and `innsikt-{slug}.html` 301 to `/innsikt/{slug}` via `.htaccess`.

## Ideas grid media workflow

- Source folder for grid assets: `assets/images/grid`.
- Runtime data file: `assets/data/grid-strip-media-manifest.js` (homepage ideas strip + category ideas strip via `script.js`).
- When new strip assets are added under `assets/images/grid-strip/`, append them to `grid-strip-media-manifest.js` and bump the manifest query string on `index.html` / in `script.js`.
- Category pages show one mp4 per region (`akershus`, `buskerud`, `norge`, `oslo`, `ostfold`); homepage shows all strip mp4s evenly interleaved with images.
- If GIF files are added to `assets/images/grid`, convert them to MP4 before publishing and ensure the `.mp4` file is included in the manifest.
- The standalone `/gallery` page is retired (`gallery.html` redirects to `/`; omit from `sitemap.xml`).

## URL Canonicalization

- `.htaccess` (Apache) canonicalizes HTTP → HTTPS, 301s `www.formaa.no` to apex `https://formaa.no`, strips `.html` from URLs, maps `/prosjekter/{slug}` and `/innsikt/{slug}` to the legacy `prosjekt-*.html` / `innsikt-*.html` files, 301s legacy `prosjekt-*.html` / `innsikt-*.html` to `/prosjekter/{slug}` / `/innsikt/{slug}` (before the generic `.html` strip), serves `/llms.txt` and `/ai.txt` directly, and includes explicit 301s for friendly top-level routes such as `/application-form`, `/tjenester-prosess`, retired `/gallery` and `/designstudio-oslo` → `/` (plus Search Console legacy paths: duplicate `/innsikt/innsikt-*`, bad `/category/.../index`, `produksjon` → `teknisk-tegning`, etc.). If you deploy on a host that ignores `.htaccess`, replicate these rules in that platform’s redirect config.
- **Innsikt routing:** public URL `/innsikt/{slug}` is served from root stub `innsikt-{slug}.html` (internal rewrite). Adding a new article = add `innsikt-{slug}.html` + run `generate:innsikt-indexes`; no `.htaccess` change needed unless the slug pattern changes.
- **Favicon:** `/assets/favicon.svg` and `/assets/Favicon-google-search.svg` redirect to `/assets/square-favicon.svg`. Pages link SVG + PNG fallback (`square-favicon-fallback.png`).
- Homepage: `/index.html` → `/` (301).
- Public routes are extensionless (for example `/prosjekter`, `/innsikt`, `/application-form`); legacy flat filenames redirect into those namespaces. Retired `/gallery` and `/gallery.html` redirect to `/`.

## Local Development

Run the static dev server from project root:

```bash
corepack pnpm dev
```

Then open `http://localhost:3000/` (uses `serve` on port 3000).

Alternative:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Formatting

This project uses Prettier via pnpm.

Before commit/publish, run:

```bash
corepack pnpm publish:prepare
```

Or formatting only:

```bash
corepack pnpm format
```
