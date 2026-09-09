// NOTE: Minimal HTML redirect stubs for GitHub Pages (no .htaccess). Pattern matches gallery.html.

const SITE = 'https://formaa.no';

/**
 * @param {{ targetPath: string, title?: string }} options
 * @returns {string}
 */
export function renderLegacyRedirectStubHtml({ targetPath, title = 'Formaa' }) {
  const canonical = `${SITE}${targetPath}`;
  return `<!doctype html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="robots" content="noindex,nofollow" />
    <link rel="canonical" href="${canonical}" />
    <meta http-equiv="refresh" content="0; url=${targetPath}" />
    <script>
      window.location.replace('${targetPath}');
    </script>
  </head>
  <body></body>
</html>
`;
}
