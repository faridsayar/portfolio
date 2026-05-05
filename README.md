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
- Ideas/gallery grid hydrated from `assets/data/grid-media-manifest.js`
- Article cards + shared article layout utilities
- WebP-first image references for improved payload and paint performance

## Search Indexing

Search engines use root indexing files:

- `sitemap.xml`
- `robots.txt`
- `llms.txt` (LLM/discovery metadata file)

### Sitemap Workflow

Whenever public pages are added/removed/renamed:

1. Update (or regenerate) `sitemap.xml`.
2. Verify old URLs were removed (avoid stale `404` entries).
3. Verify all new canonical routes are included once.
4. Ensure renamed category URLs are fully replaced in links (for example `produksjon` -> `teknisk-tegning`).
5. Deploy to production.
6. Re-submit `https://formaa.no/sitemap.xml` in Google Search Console.

### SEO / Indexing Maintenance Checklist

Use this checklist after structural updates (new pages, renamed slugs, new categories):

1. `sitemap.xml`
   - Add new public URLs.
   - Remove deprecated URLs.
   - Keep URL style consistent (extensionless public routes).
2. `robots.txt`
   - Keep `Allow: /` and one canonical sitemap declaration.
3. Page metadata
   - Keep one canonical URL per page.
   - Ensure `<title>`, `meta description`, OG/Twitter title+description match page intent.
4. Structured data
   - Keep JSON-LD valid and aligned with canonical URL.
5. Internal linking
   - Add relevant contextual links with existing shared classes (see **Internal linking** below).
   - Avoid over-linking repeated terms in the same paragraph.
6. Final validation
   - Run `corepack pnpm format`.
   - Spot-check key pages in browser and re-submit sitemap if needed.

## Internal linking

Use existing patterns only; do not invent new link colors or button styles.

- **Inline copy links:** `a.internal-text-link` (global style in `styles/base.css`: black, semibold). Use for words or phrases inside paragraphs on pages such as `index.html`, `prisestimat.html`, `designstudio-oslo.html`, `oss.html`, and for HTML inside innsikt article JSON `blocks[].text`.
- **Category chips:** `div.service-tags` + `a.service-tag`, same markup as category pages; public URLs are extensionless (for example `/category/{tjeneste}/oslo`). Prefer root-absolute `href` values like `/category/design/norge` so links resolve correctly from any path; on-disk files remain `category/.../*.html` (see `.htaccess`).
- **Insights articles:** `shared-article.js` renders `blocks` as `<p>` / `<h2>`; embed full `<a class="internal-text-link" href="...">` strings in JSON where needed.
- **Sitemap:** Adding or changing internal links does not change public URLs; update `sitemap.xml` only when routes (paths) change.

## SEO Conventions

- Keep Norwegian copy and metadata as primary.
- Maintain one primary `h1` per page.
- Keep canonical and OG URL aligned with final page URL.
- Preserve robots directive (`index,follow,max-image-preview:large`) on indexable pages; `article-template.html` is `noindex` and omitted from `sitemap.xml` (layout shell only).
- Keep contact links form-based to avoid exposing a raw email in page markup.

Structured data currently used:

- `index.html`: company/service JSON-LD
- `innsikt.html`: blog listing JSON-LD
- `innsikt-*.html`: article JSON-LD
- `prisestimat.html`: `WebPage` + `BreadcrumbList` JSON-LD

## Ideas Gallery Media Workflow

- Source folder for gallery assets: `assets/images/grid`.
- Runtime data file: `assets/data/grid-media-manifest.js` (used by homepage strip + `gallery.html`).
- If GIF files are added to `assets/images/grid`, convert them to MP4 before publishing and ensure the `.mp4` file is included in the manifest.
- Gallery UI rules:
  - homepage strip: one-line, full-width, 16:9 thumbs, no gaps
  - `gallery.html`: edge-to-edge 3-column grid on desktop and mobile
  - fullscreen viewer includes prev/next triangle controls and close (`X`)

## URL Canonicalization

- `.htaccess` (Apache) canonicalizes HTTP → HTTPS, strips `.html` from URLs, maps `/prosjekter/{slug}` and `/innsikt/{slug}` to the legacy `prosjekt-*.html` / `innsikt-*.html` files, and includes 301s for Search Console legacy paths (duplicate `/innsikt/innsikt-*`, bad `/category/.../index`, `produksjon` → `teknisk-tegning`, etc.). If you deploy on a host that ignores `.htaccess`, replicate these rules in that platform’s redirect config.
- Homepage: `/index.html` → `/` (301).
- Public routes are extensionless (for example `/gallery`, `/prosjekter`, `/innsikt`); legacy flat filenames redirect into those namespaces.

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
