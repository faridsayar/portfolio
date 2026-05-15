# Industridesign Portfolio (Norwegian Website)

This repository contains a static, Norwegian-focused portfolio website for industrial and product design services.

## Tech Stack

- HTML pages (landing, category/location pages, projects, insights, pricing, dedicated inquiry at `application-form.html`)
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
- `contact-section-home.html`
- `contact-section-compact.html`
- `site-footer.html`

`components-loader.js` supports multi-pass loading so components can contain nested `data-component` slots.

## Key UX Features

- Hero media with clip shuffle (`script.js`)
- Interactive inquiry timeline with 5 weighted phases
- Web3Forms-based inquiry submission (no local mail client popup)
- Project grid hydrated from `assets/data/projects-manifest.js` / `.json`
- Ideas grid strip hydrated from `assets/data/grid-media-manifest.js`
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
2. Verify old URLs were removed (avoid stale `404` entries; `/gallery` must not be listed).
3. Verify all new canonical routes are included once.
4. Run `pnpm generate:innsikt-indexes` and `pnpm generate:prosjekter-indexes` so folder routes match sitemap paths on GitHub Pages.
5. Ensure renamed category URLs are fully replaced in links (for example `produksjon` -> `teknisk-tegning`).
6. Deploy to production.
7. Re-submit `https://formaa.no/sitemap.xml` in Google Search Console.

### SEO / Indexing Maintenance Checklist

Use this checklist after structural updates (new pages, renamed slugs, new categories):

1. `sitemap.xml`
   - Add new public URLs.
   - Remove deprecated URLs.
   - Keep URL style consistent (extensionless public routes).
2. `robots.txt`
   - Keep `Allow: /` and one canonical sitemap declaration.
   - Keep retired routes blocked (for example `/gallery`, `/article-template`).
3. Page metadata
   - Keep one canonical URL per page.
   - Ensure `<title>`, `meta description`, OG/Twitter title+description match page intent.
   - Keep the site favicon aligned across all page heads. Current search favicon asset: `/assets/Favicon-google-search.svg`.
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
- **Inquiry page links:** use `/application-form.html` for CTA/contact links that should open the dedicated form page directly (instead of homepage hash links).
- **Category chips:** `div.service-tags` + `a.service-tag`, same markup as category pages; public URLs are extensionless (for example `/category/{tjeneste}/oslo`). Prefer root-absolute `href` values like `/category/design/norge` so links resolve correctly from any path; on-disk files remain `category/.../*.html` (see `.htaccess`).
- **Insights articles:** `shared-article.js` renders `blocks` as `<p>` / `<h2>`; embed full `<a class="internal-text-link" href="...">` strings in JSON where needed.
- **Sitemap:** Adding or changing internal links does not change public URLs; update `sitemap.xml` only when routes (paths) change.

## EN intent landings

English service pages live under `en/` (for example `/en/product-rendering`). They are **not** translations of Norwegian category pages: separate copy, keywords, structure, and CTAs for international search intent.

- Files: `en/product-rendering.html`, `en/cad-modeling.html`, `en/product-animation.html`
- Styles: `styles/en-landing.css` + shared `styles/base.css` only (no `script.js`, no hero video)
- Forms: `en/en-landing.js` + inline Web3Forms on each page
- Do **not** add EN links to `side-nav` or `site-footer`; use contextual cross-links in page copy and matching links on related `category/*/norge.html` pages
- Do **not** use `hreflang` between NO category URLs and EN landings
- Add new `/en/*` routes to `sitemap.xml` when published

## SEO Conventions

- Keep Norwegian copy and metadata as primary.
- Maintain one primary `h1` per page.
- Keep canonical and OG URL aligned with final page URL.
- Preserve robots directive (`index,follow,max-image-preview:large`) on indexable pages; `article-template.html` is `noindex` and omitted from `sitemap.xml` (layout shell only).
- Keep contact links form-based to avoid exposing a raw email in page markup.
- Keep the active brand social profiles aligned across visible social buttons and structured data `sameAs` links. Current X profile: `https://x.com/FormaaDesignAS`.

Structured data currently used:

- `index.html`: company/service JSON-LD
- `innsikt.html`: blog listing JSON-LD
- `innsikt-*.html`: article JSON-LD
- `prisestimat.html`: `WebPage` + `BreadcrumbList` JSON-LD
- `application-form.html`: `WebPage` + `BreadcrumbList` JSON-LD (canonical `/application-form`, design samtale kontaktform)
- `en/*.html`: `Service` + `WebPage` + `BreadcrumbList` JSON-LD (`inLanguage: en`)

## Ideas grid media workflow

- Source folder for grid assets: `assets/images/grid`.
- Runtime data file: `assets/data/grid-media-manifest.js` (homepage ideas strip, category ideas strip, and `script.js` fallback loader).
- When new grid assets are added, append them to `assets/data/grid-media-manifest.js` and bump the manifest query string where it is loaded (`index.html`, category pages via `script.js`).
- If GIF files are added to `assets/images/grid`, convert them to MP4 before publishing and ensure the `.mp4` file is included in the manifest.
- The standalone `/gallery` page is retired (`gallery.html` redirects to `/`; omit from `sitemap.xml`).

## URL Canonicalization

- `.htaccess` (Apache) canonicalizes HTTP → HTTPS, 301s `www.formaa.no` to apex `https://formaa.no`, strips `.html` from URLs, maps `/prosjekter/{slug}` and `/innsikt/{slug}` to the legacy `prosjekt-*.html` / `innsikt-*.html` files, 301s legacy `prosjekt-*.html` / `innsikt-*.html` to `/prosjekter/{slug}` / `/innsikt/{slug}` (before the generic `.html` strip), and includes explicit 301s for friendly top-level routes such as `/designstudio-oslo` and `/application-form` (plus Search Console legacy paths: duplicate `/innsikt/innsikt-*`, bad `/category/.../index`, `produksjon` → `teknisk-tegning`, etc.). If you deploy on a host that ignores `.htaccess`, replicate these rules in that platform’s redirect config.
- Homepage: `/index.html` → `/` (301).
- Public routes are extensionless (for example `/prosjekter`, `/innsikt`, `/application-form`); legacy flat filenames redirect into those namespaces. Retired `/gallery` and `/gallery.html` redirect to `/`.

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
