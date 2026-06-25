// NOTE: Renders cooperation partner cards (name + description) from company-partners-manifest.js.
(function cooperationPartners() {
  const LOGO_BASE = '/assets/company-logos/';

  function resolveLogoSrc(logo) {
    if (!logo) return '';
    if (/^https?:\/\//i.test(logo)) return logo;
    return logo.startsWith('/') ? logo : `${LOGO_BASE}${logo}`;
  }

  function renderCooperationPartners() {
    const root = document.querySelector('[data-cooperation-partners]');
    const manifest = window.__COMPANY_PARTNERS_MANIFEST;
    const partners = (manifest?.partners || []).filter((partner) => partner.description?.trim());
    if (!root || partners.length === 0) return;

    root.replaceChildren();

    partners.forEach((partner) => {
      const card = document.createElement('article');
      card.className = 'cooperation-card';

      const head = document.createElement('header');
      head.className = 'cooperation-card__head';

      const logoSrc = resolveLogoSrc(partner.logo);
      if (logoSrc) {
        const logo = document.createElement('img');
        logo.className = partner.invertLogo
          ? 'cooperation-card__logo cooperation-card__logo--inverted-source'
          : 'cooperation-card__logo';
        logo.src = logoSrc;
        logo.alt = '';
        logo.width = 72;
        logo.height = 72;
        logo.loading = 'lazy';
        logo.decoding = 'async';
        head.append(logo);
      }

      const title = document.createElement('h3');
      title.className = 'cooperation-card__name';
      if (partner.url) {
        const link = document.createElement('a');
        link.className = 'internal-text-link';
        link.href = partner.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = partner.name;
        title.append(link);
      } else {
        title.textContent = partner.name;
      }
      head.append(title);
      card.append(head);

      const text = document.createElement('p');
      text.className = 'cooperation-card__text';
      text.textContent = partner.description;
      card.append(text);

      root.append(card);
    });
  }

  function init() {
    renderCooperationPartners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('components:ready', init);
})();
