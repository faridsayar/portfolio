# Company partner logos

Drop logo files here and list them in `assets/data/company-partners.json`.

## Add a partner

1. Paste the logo file in this folder (for example `acme.png`).
2. Add an entry in `assets/data/company-partners.json`:

```json
{
  "name": "Acme",
  "url": "https://www.acme.example",
  "source": "acme.png",
  "logo": "acme-logo.webp"
}
```

3. Run:

```bash
corepack pnpm process:company-logos
```

This grayscales each logo, normalizes height (see `logoHeight` in `company-partners.json`, currently `72px`), and writes the `.webp` file used on the site.

4. Add `<div data-component="partner-logos-section"></div>` on any page and load:

- `assets/data/company-partners-manifest.js`
- `shared-partner-logos.js`
