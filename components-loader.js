// NOTE: Lightweight HTML component loader for static pages.
(function loadComponents() {
  const inlineComponents = {
    // NOTE: Inline fallback avoids fetch issues in local/file contexts.
    'side-nav': '<nav class="side-nav" aria-label="Navigasjon" data-mobile-nav></nav>',
    'article-layout': `<main>
  <article class="section section--white section--article-template" aria-label="Artikkel">
    <div class="section-inner" data-article-layout>
      <figure class="about-top-graphic">
        <img class="about-top-graphic__img" src="assets/images/Articles/usv.png" alt="" data-article-hero-image />
        <div class="about-top-graphic__overlay" aria-hidden="true">
          <nav class="breadcrumb about-top-graphic__breadcrumb" aria-label="Brødsmulesti">
            <a class="breadcrumb__link" href="/">Formaa</a>
            <span class="breadcrumb__sep" aria-hidden="true">/</span>
            <a class="breadcrumb__link" href="/innsikt.html">Innsikt</a>
            <span class="breadcrumb__sep" aria-hidden="true">/</span>
            <a class="breadcrumb__link" href="#" aria-current="page" data-article-breadcrumb-current>Artikkel</a>
          </nav>
        </div>
      </figure>
      <p class="section-kicker">Innsikt</p>
      <h1 class="section-title" data-article-title>Artikkel</h1>
      <div class="article-row__text" data-article-body></div>
      <nav class="article-nav-buttons" aria-label="Artikkelnavigasjon" data-article-nav>
        <a class="article-nav-button" href="/innsikt-design-for-crowdfunding.html" data-article-nav-prev>Forrige artikkel</a>
        <a class="article-nav-button" href="/innsikt-ux-er-ikke-produktdesign.html" data-article-nav-next>Neste artikkel</a>
      </nav>
    </div>
  </article>
  <section class="section section--white section--project-cta" aria-label="Neste steg">
    <div class="section-inner">
      <h2 class="section-title">Trenger du produkt utviklet?</h2>
      <p class="section-lead">
        Send en kort forespørsel, så vurderer vi muligheter, tidslinje og neste praktiske steg.
      </p>
    <a class="inquiry-cta" href="/#application-form">Gå til forespørselsskjema</a>
  </div>
</section>
</main>`,
    'site-footer': `<footer class="site-footer" aria-label="Bunntekst">
  <div class="site-footer__inner">
    <div class="site-footer__links" aria-label="Links">
      <p class="site-footer__links-title">Links</p>
      <div class="site-footer__links-list">
        <a class="site-footer__link" href="/advanced-project.html" data-footer-link="projects">Prosjekter</a>
        <a class="site-footer__link" href="/category/design/norge.html" data-footer-link="categories">Kategorier</a>
        <a class="site-footer__link" href="/innsikt.html" data-footer-link="insights">Innsikt</a>
        <a class="site-footer__link" href="/gallery.html" data-footer-link="gallery">Galleri</a>
        <a class="site-footer__link" href="/designstudio-oslo.html" data-footer-link="designstudio-oslo">Designstudio Oslo</a>
        <a class="site-footer__link" href="/oss.html" data-footer-link="about">Oss</a>
        <a class="site-footer__link" href="/#application-form" data-footer-link="application">Søknadsskjema</a>
        <a class="site-footer__link" href="/prisestimat.html" data-footer-link="pricing">Prisestimat</a>
      </div>
    </div>
    <p class="site-footer__text">
      © 2026 Formaa. Industridesign og produktdesign i Oslo. Alle rettigheter forbeholdt.
    </p>
  </div>
</footer>`,
    'project-cta': `<section class="section section--white section--project-cta" aria-label="Neste steg">
  <div class="section-inner">
    <h2 class="section-title">Trenger du produkt utviklet?</h2>
    <p class="section-lead">
      Send en kort forespørsel, så vurderer vi muligheter, tidslinje og neste praktiske steg.
    </p>
    <a class="inquiry-cta" href="/#application-form">Gå til forespørselsskjema</a>
  </div>
</section>`,
    'application-form': `<section
  class="section section--white section--timeline"
  id="application-form"
  aria-label="Send forespørsel"
>
  <div class="section-inner">
    <div class="section-head">
      <p class="section-kicker">Konsultasjon forespørsel</p>
      <h2 class="section-title">Gratis designkonsultasjon</h2>
      <p class="section-lead">
        Dra punktene langs linjen for å vekte prioriteringene (Dette er en grov oversikt og ikke
        forpliktende)
      </p>
    </div>
    <form class="inquiry-form" method="post" data-inquiry-form>
      <p class="inquiry-form__title">Mitt prosjekt</p>
      <input type="hidden" name="access_key" value="c21cafeb-72cf-4e8b-b66c-69384a07c888" />
      <input type="hidden" name="subject" value="Ny designkonsultasjon foresporsel" />
      <input type="hidden" name="from_name" value="Formaa nettside" />
      <input type="hidden" name="botcheck" value="" />
      <div class="timeline" data-timeline>
        <div class="timeline-anchors">
          <span class="timeline-anchor timeline-anchor--start">Konsultasjon</span>
          <span class="timeline-anchor timeline-anchor--time" data-timeframe-label>2 mnd prosjekt</span>
          <span class="timeline-anchor timeline-anchor--end">Ferdigstilling</span>
        </div>
        <div class="timeline-track-wrap">
          <span class="timeline-mobile-anchor timeline-mobile-anchor--end">Ferdigstilling</span>
          <span class="timeline-mobile-anchor timeline-mobile-anchor--start">Konsultasjon</span>
          <div class="timeline-labels" aria-hidden="true">
            <div class="timeline-handle-label" data-handle-label="0"></div>
            <div class="timeline-handle-label" data-handle-label="1"></div>
            <div class="timeline-handle-label" data-handle-label="2"></div>
            <div class="timeline-handle-label" data-handle-label="3"></div>
          </div>
          <div class="timeline-track" data-timeline-track aria-label="Tidslinje">
            <div class="timeline-segments" aria-hidden="true">
              <div class="timeline-segment" data-segment="0"></div>
              <div class="timeline-segment" data-segment="1"></div>
              <div class="timeline-segment" data-segment="2"></div>
              <div class="timeline-segment" data-segment="3"></div>
              <div class="timeline-segment" data-segment="4"></div>
            </div>
          </div>
          <div class="timeline-handles" aria-label="Juster grenser mellom faser">
            <div class="timeline-handle" data-handle="0" role="slider" tabindex="0"></div>
            <div class="timeline-handle" data-handle="1" role="slider" tabindex="0"></div>
            <div class="timeline-handle" data-handle="2" role="slider" tabindex="0"></div>
            <div class="timeline-handle" data-handle="3" role="slider" tabindex="0"></div>
          </div>
        </div>
        <div class="timeline-hidden" aria-hidden="true">
          <input type="hidden" name="phase_brukeranalyse" data-phase-input="0" />
          <input type="hidden" name="phase_konseptutvikling" data-phase-input="1" />
          <input type="hidden" name="phase_prototype" data-phase-input="2" />
          <input type="hidden" name="phase_validering" data-phase-input="3" />
          <input type="hidden" name="phase_ferdigstilling" data-phase-input="4" />
        </div>
      </div>
      <div class="inquiry-grid">
        <div class="field">
          <label class="field__label" for="full-name">Ditt navn</label>
          <input class="field__input" id="full-name" name="full_name" type="text" required autocomplete="name" placeholder="Kari Nordmann" />
        </div>
        <div class="field">
          <label class="field__label" for="email">Din e-post</label>
          <input class="field__input" id="email" name="email" type="email" required autocomplete="email" inputmode="email" pattern="^[^\\s@]+@[^\\s@]+\\.(com|no)$" placeholder="kari.nordmann@example.com" />
        </div>
        <div class="field">
          <label class="field__label" for="timeframe">Ca. tid vi har</label>
          <select class="field__input" id="timeframe" name="timeframe" required data-timeframe-select>
            <option value="1 mnd">1 mnd</option>
            <option value="2 mnd" selected>2 mnd</option>
            <option value="3 mnd">3 mnd</option>
            <option value="4 mnd">4 mnd</option>
            <option value="5 mnd">5 mnd</option>
            <option value="6+ mnd">6+ mnd</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label" for="budget">Ca. budsjett (ikke obligatorisk)</label>
          <input class="field__input" id="budget" name="budget" type="text" autocomplete="organization" placeholder="30 000 NOK" />
        </div>
      </div>
      <div class="field field--full">
        <label class="field__label" for="description">Beskrivelse – hva trenger du hjelp med</label>
        <textarea class="field__textarea" id="description" name="description" rows="6" required autocomplete="on" placeholder="F.eks. vi er et lite startup team som trenger hjelp med design og utvikling av vår geniale konsept."></textarea>
      </div>
      <div class="inquiry-footer">
        <button class="inquiry-cta" type="submit">Send forespørsel</button>
        <p class="inquiry-note" data-inquiry-status aria-live="polite"></p>
        <p class="inquiry-note">
          *Forespørselen er uforpliktende og er kun for orientering. Vi vil ta kontakt med deg
          snarest for å finne ut hvordan vi best kan hjelpe deg og ditt prosjekt, for å gi deg et
          konkret tilbud.
        </p>
      </div>
    </form>
  </div>
</section>`,
    'contact-section-home': `<section class="section section--white section--contact" aria-label="Ta kontakt">
  <div class="section-inner">
    <div class="section-head">
      <p class="section-kicker">Kontakt</p>
      <h2 class="section-title">Ta kontakt</h2>
      <p class="section-lead">
        Vi er åpne for prosjekter og oppdrag i alle størrelser og på tvers av bransjer, og ved større
        behov har vi tilgang til profesjonelle i nettverket vårt. Har du en idé til en collab eller et
        felles prosjekt, ønsker samarbeid, eller vil utvide nettverket ditt? Ta kontakt.
      </p>
    </div>

    <div class="contact-grid" itemscope itemtype="https://schema.org/ProfessionalService">
      <a
        class="contact-item contact-link"
        href="https://www.google.com/maps/search/?api=1&query=Oslo%2C+Helsfyr"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Apne kart for Oslo, Helsfyr"
      >
        <span class="contact-item__label">Lokasjon</span>
        <span class="contact-item__value" itemprop="areaServed">Oslo, Helsfyr</span>
      </a>
      <a class="contact-item contact-link" href="tel:+4746381887" itemprop="telephone">
        <span class="contact-item__label">Telefon</span>
        <span class="contact-item__value">+47 46 38 18 87</span>
      </a>
      <a class="contact-item contact-link" href="https://formaa.no/#application-form" itemprop="email">
        <span class="contact-item__label">E-post</span>
        <span class="contact-item__value">Send e-post</span>
      </a>
    </div>

    <div class="social-links" aria-label="Sosiale medier">
      <a class="social-link" href="#" aria-label="Telegram">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M21.75 4.2a1 1 0 0 0-1.02-.14L2.8 11.44a1 1 0 0 0 .08 1.87l4.28 1.56 1.7 5.2a1 1 0 0 0 1.78.28l2.38-3.14 3.9 2.87a1 1 0 0 0 1.58-.59l3.35-14.31a1 1 0 0 0-.5-.98ZM9.32 14.12l8.56-6.27-6.88 7.83-.95 1.26-.73-2.82Z"
          />
        </svg>
      </a>
      <a class="social-link" href="#" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6.94 8.5H3.56V20h3.38V8.5Zm.24-3.54A1.96 1.96 0 0 0 5.2 3a1.95 1.95 0 0 0-1.95 1.96c0 1.08.86 1.96 1.95 1.96 1.09 0 1.98-.88 1.98-1.96ZM20.44 13.3c0-3.08-1.64-4.52-3.83-4.52-1.77 0-2.56.97-3 1.65V8.5h-3.38V20h3.38v-6.4c0-.34.02-.68.13-.93.27-.68.88-1.39 1.9-1.39 1.35 0 1.9 1.03 1.9 2.55V20h3.38v-6.7Z"
          />
        </svg>
      </a>
      <a class="social-link" href="#" aria-label="Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm10.1 1.37a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"
          />
        </svg>
      </a>
      <a class="social-link" href="#" aria-label="X">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M18.9 3h2.98l-6.52 7.45L23 21h-5.95l-4.66-6.1L7.05 21H4.06l6.97-7.96L1 3h6.1l4.21 5.53L18.9 3Zm-1.04 16.2h1.65L6.2 4.72H4.42L17.86 19.2Z"
          />
        </svg>
      </a>
    </div>
  </div>
</section>`,
    'contact-section-compact': `<section class="section section--white section--contact" aria-label="Ta kontakt">
  <div class="section-inner">
    <div class="section-head">
      <p class="section-kicker">Kontakt</p>
      <h2 class="section-title">Ta kontakt</h2>
    </div>

    <div class="contact-grid" itemscope itemtype="https://schema.org/ProfessionalService">
      <a
        class="contact-item contact-link"
        href="https://www.google.com/maps/search/?api=1&query=Oslo%2C+Helsfyr"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Apne kart for Oslo, Helsfyr"
      >
        <span class="contact-item__label">Lokasjon</span>
        <span class="contact-item__value" itemprop="areaServed">Oslo, Helsfyr</span>
      </a>
      <a class="contact-item contact-link" href="tel:+4746381887" itemprop="telephone">
        <span class="contact-item__label">Telefon</span>
        <span class="contact-item__value">+47 46 38 18 87</span>
      </a>
      <a class="contact-item contact-link" href="https://formaa.no/#application-form" itemprop="email">
        <span class="contact-item__label">E-post</span>
        <span class="contact-item__value">Send e-post</span>
      </a>
    </div>

    <div class="social-links" aria-label="Sosiale medier">
      <a class="social-link" href="#" aria-label="Telegram">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M21.75 4.2a1 1 0 0 0-1.02-.14L2.8 11.44a1 1 0 0 0 .08 1.87l4.28 1.56 1.7 5.2a1 1 0 0 0 1.78.28l2.38-3.14 3.9 2.87a1 1 0 0 0 1.58-.59l3.35-14.31a1 1 0 0 0-.5-.98ZM9.32 14.12l8.56-6.27-6.88 7.83-.95 1.26-.73-2.82Z"
          />
        </svg>
      </a>
      <a class="social-link" href="#" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6.94 8.5H3.56V20h3.38V8.5Zm.24-3.54A1.96 1.96 0 0 0 5.2 3a1.95 1.95 0 0 0-1.95 1.96c0 1.08.86 1.96 1.95 1.96 1.09 0 1.98-.88 1.98-1.96ZM20.44 13.3c0-3.08-1.64-4.52-3.83-4.52-1.77 0-2.56.97-3 1.65V8.5h-3.38V20h3.38v-6.4c0-.34.02-.68.13-.93.27-.68.88-1.39 1.9-1.39 1.35 0 1.9 1.03 1.9 2.55V20h3.38v-6.7Z"
          />
        </svg>
      </a>
      <a class="social-link" href="#" aria-label="Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm10.1 1.37a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"
          />
        </svg>
      </a>
      <a class="social-link" href="#" aria-label="X">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M18.9 3h2.98l-6.52 7.45L23 21h-5.95l-4.66-6.1L7.05 21H4.06l6.97-7.96L1 3h6.1l4.21 5.53L18.9 3Zm-1.04 16.2h1.65L6.2 4.72H4.42L17.86 19.2Z"
          />
        </svg>
      </a>
    </div>
  </div>
</section>`,
  };

  async function renderPass() {
    const slots = Array.from(document.querySelectorAll('[data-component]'));
    if (slots.length === 0) return false;

    const tasks = slots.map(async (slot) => {
      const name = slot.getAttribute('data-component');
      if (!name) return;
      const fallbackMarkup = inlineComponents[name];
      try {
        // NOTE: Try root-relative first, then relative path fallback for local environments.
        let response = await fetch(`/components/${name}.html`, { cache: 'no-store' });
        if (!response.ok) {
          response = await fetch(`components/${name}.html`, { cache: 'no-store' });
        }
        if (!response.ok) throw new Error(`Component fetch failed: ${name}`);
        const markup = await response.text();
        slot.outerHTML = markup;
      } catch (_error) {
        if (fallbackMarkup) slot.outerHTML = fallbackMarkup;
      }
    });

    await Promise.all(tasks);
    return true;
  }

  (async () => {
    // NOTE: Multi-pass rendering enables component slots inside loaded components.
    for (let i = 0; i < 5; i += 1) {
      const didRender = await renderPass();
      if (!didRender) break;
    }
  })()
    .catch(() => {})
    .finally(() => {
      document.dispatchEvent(new CustomEvent('components:ready'));
    });
})();
