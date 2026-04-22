// NOTE: Lightweight HTML component loader for static pages.
(function loadComponents() {
  const inlineComponents = {
    // NOTE: Inline fallback avoids fetch issues in local/file contexts.
    'side-nav': '<nav class="side-nav" aria-label="Navigasjon" data-mobile-nav></nav>',
    'article-layout': `<main>
  <article class="section section--white section--article-template" aria-label="Artikkel">
    <div class="section-inner" data-article-layout>
      <figure class="about-top-graphic">
        <img class="about-top-graphic__img" src="assets/images/USV.png" alt="" data-article-hero-image />
        <div class="about-top-graphic__overlay" aria-hidden="true"></div>
        <nav class="breadcrumb about-top-graphic__breadcrumb" aria-label="Brødsmulesti">
          <a class="breadcrumb__link" href="index.html">Formaa</a>
          <span class="breadcrumb__sep" aria-hidden="true">/</span>
          <a class="breadcrumb__link" href="innsikt.html">Innsikt</a>
          <span class="breadcrumb__sep" aria-hidden="true">/</span>
          <a class="breadcrumb__link" href="#" aria-current="page" data-article-breadcrumb-current>Artikkel</a>
        </nav>
      </figure>
      <p class="section-kicker">Innsikt</p>
      <h1 class="section-title" data-article-title>Artikkel</h1>
      <div class="article-row__text" data-article-body></div>
    </div>
  </article>
  <section class="section section--white section--project-cta" aria-label="Neste steg">
    <div class="section-inner">
      <h2 class="section-title">Trenger du produkt utviklet?</h2>
      <p class="section-lead">
        Send en kort forespørsel, så vurderer vi muligheter, tidslinje og neste praktiske steg.
      </p>
      <a class="inquiry-cta" href="index.html#application-form">Gå til forespørselsskjema</a>
    </div>
  </section>
</main>`,
  };

  const slots = Array.from(document.querySelectorAll('[data-component]'));
  if (slots.length === 0) {
    document.dispatchEvent(new CustomEvent('components:ready'));
    return;
  }

  const tasks = slots.map(async (slot) => {
    const name = slot.getAttribute('data-component');
    if (!name) return;
    const fallbackMarkup = inlineComponents[name];
    try {
      const response = await fetch(`components/${name}.html`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Component fetch failed: ${name}`);
      const markup = await response.text();
      slot.outerHTML = markup;
    } catch (_error) {
      if (fallbackMarkup) slot.outerHTML = fallbackMarkup;
    }
  });

  Promise.all(tasks)
    .catch(() => {})
    .finally(() => {
      document.dispatchEvent(new CustomEvent('components:ready'));
    });
})();
