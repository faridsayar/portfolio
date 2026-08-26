// NOTE: Renders company partner logos from company-partners-manifest.js into partner-logos-section.
(function partnerLogosSection() {
  const LOGO_BASE = '/assets/company-logos/';

  function resolveLogoSrc(logo) {
    if (!logo) return '';
    if (/^https?:\/\//i.test(logo)) return logo;
    const path = logo.startsWith('/') ? logo : `${LOGO_BASE}${logo}`;
    return path;
  }

  function renderPartnerLogos() {
    const manifest = window.__COMPANY_PARTNERS_MANIFEST;
    const partners = manifest?.partners;
    if (!Array.isArray(partners) || partners.length === 0) return;

    const grids = document.querySelectorAll('[data-partner-logos-grid]');
    if (grids.length === 0) return;

    // NOTE: Locale from <html lang> so EN hubs get English aria labels.
    const isEnglish = document.documentElement.lang === 'en';
    const fallbackName = isEnglish ? 'Partner' : 'Samarbeidspartner';
    const newTabSuffix = isEnglish ? 'opens in a new tab' : 'åpnes i ny fane';

    const logoHeight = manifest.logoHeight || 72;
    document.documentElement.style.setProperty('--partner-logo-height', `${logoHeight}px`);

    grids.forEach((grid) => {
      grid.replaceChildren();

      partners.forEach((partner) => {
        const name = partner.name || fallbackName;
        const url = partner.url || '';
        const src = resolveLogoSrc(partner.logo);
        if (!src) return;

        const item = document.createElement('li');
        item.className = 'partner-logos__item';

        const img = document.createElement('img');
        img.className = partner.invertLogo
          ? 'partner-logos__img partner-logos__img--inverted-source'
          : 'partner-logos__img';
        img.src = src;
        img.alt = name;
        img.width = logoHeight;
        img.height = logoHeight;
        img.loading = 'lazy';
        img.decoding = 'async';

        if (url) {
          const link = document.createElement('a');
          link.className = 'partner-logos__link';
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.setAttribute('aria-label', `${name} (${newTabSuffix})`);
          link.append(img);
          item.append(link);
        } else {
          const mark = document.createElement('span');
          mark.className = 'partner-logos__mark';
          mark.append(img);
          item.append(mark);
        }

        grid.append(item);
      });
    });
  }

  function init() {
    renderPartnerLogos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('components:ready', init);
})();
