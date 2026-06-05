// NOTE: Lightweight HTML component loader for static pages.
(function loadComponents() {
  const inlineComponents = {
    // NOTE: Inline fallback avoids fetch issues in local/file contexts.
    'side-nav': '<nav class="side-nav" aria-label="Navigasjon" data-mobile-nav></nav>',
    'article-layout': `<main>
  <article class="section section--white section--article-template" aria-label="Artikkel">
    <div class="section-inner" data-article-layout>
      <figure class="about-top-graphic">
        <img class="about-top-graphic__img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='black'/%3E%3C/svg%3E" alt="" data-article-hero-image />
        <div class="about-top-graphic__overlay" aria-hidden="true">
          <nav class="breadcrumb about-top-graphic__breadcrumb" aria-label="Brødsmulesti">
            <a class="breadcrumb__link" href="/">Formaa</a>
            <span class="breadcrumb__sep" aria-hidden="true">/</span>
            <a class="breadcrumb__link" href="/innsikt">Innsikt</a>
            <span class="breadcrumb__sep" aria-hidden="true">/</span>
            <a class="breadcrumb__link" href="#" aria-current="page" data-article-breadcrumb-current>Artikkel</a>
          </nav>
        </div>
      </figure>
      <p class="section-kicker">Innsikt</p>
      <h1 class="section-title" data-article-title>Artikkel</h1>
      <div class="article-row__text" data-article-body></div>
      <!-- NOTE: Shared like/share strip stays tied to the article, not a specific image variant. -->
      <div class="like-share-strip-shell like-share-strip-shell--article" data-article-like-share>
        <div data-component="like-share-strip"></div>
      </div>
      <nav class="article-nav-buttons" aria-label="Artikkelnavigasjon" data-article-nav>
        <a class="article-nav-button" href="/innsikt/design-for-crowdfunding" data-article-nav-prev>Forrige artikkel</a>
        <a class="article-nav-button" href="/innsikt/ux-er-ikke-produktdesign" data-article-nav-next>Neste artikkel</a>
      </nav>
    </div>
  </article>
  <section class="section section--white section--project-cta" aria-label="Neste steg">
    <div class="section-inner">
      <h2 class="section-title">Trenger du hjelp med produktet ditt?</h2>
      <p class="section-lead">
        Send en kort forespørsel, så vurderer vi muligheter, tidslinje og neste praktiske steg.
      </p>
    <a class="inquiry-cta" href="/application-form">Gå til kontaktform</a>
  </div>
</section>
</main>
<div data-component="site-footer"></div>`,
    'site-footer': `<footer class="site-footer site-footer--expanded" aria-label="Bunntekst">
  <div class="site-footer__inner">
    <div class="site-footer__links" aria-label="Links">
      <p class="site-footer__links-title">Links</p>
      <div class="site-footer__links-list">
        <a class="site-footer__link" href="/prosjekter" data-footer-link="projects">Prosjekter</a>
        <a class="site-footer__link" href="/category/design/norge" data-footer-link="categories">Kategorier</a>
        <a class="site-footer__link" href="/innsikt" data-footer-link="insights">Innsikt</a>
        <a class="site-footer__link" href="/designstudio-oslo" data-footer-link="designstudio-oslo">Designstudio Oslo</a>
        <a class="site-footer__link" href="/oss" data-footer-link="about">Oss</a>
        <a class="site-footer__link" href="/application-form" data-footer-link="application">Kontaktform</a>
        <a class="site-footer__link" href="/prisestimat" data-footer-link="pricing">Prisestimat</a>
      </div>
    </div>
    <p class="site-footer__text">
      © 2026 Formaa AS. Industridesign og produktdesign i Oslo. Alle rettigheter forbeholdt. Org.nr. 937 772 505.
    </p>
  </div>
</footer>`,
    'project-cta': `<section class="section section--white section--project-cta" aria-label="Neste steg">
  <div class="section-inner">
    <h2 class="section-title">Trenger du hjelp med produktet ditt?</h2>
    <p class="section-lead">
      Send en kort forespørsel, så vurderer vi muligheter, tidslinje og neste praktiske steg.
    </p>
    <a class="inquiry-cta" href="/application-form">Gå til kontaktform</a>
  </div>
</section>`,
    'application-form': `<section
  class="section section--white section--timeline"
  id="application-form"
  aria-label="Send forespørsel"
>
  <div class="section-inner">
    <form class="inquiry-form" method="post" data-inquiry-form>
      <p class="inquiry-form__title">Kontaktform</p>
      <input type="hidden" name="access_key" value="c21cafeb-72cf-4e8b-b66c-69384a07c888" />
      <input type="hidden" name="subject" value="Ny design samtale foresporsel" />
      <input type="hidden" name="from_name" value="Formaa nettside" />
      <input type="hidden" name="botcheck" value="" />
      <!-- NOTE: Default timeframe for Web3Forms; visible select removed (matches components/application-form.html). -->
      <input type="hidden" name="timeframe" value="2 mnd" />
      <div class="timeline" data-timeline>
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
        <div class="timeline-caption-row">
          <span class="timeline-anchor timeline-anchor--start">Konsultasjon</span>
          <p class="inquiry-form__hint">Dra punktene langs linjen for å vekte prioriteringene (kun for orientering)</p>
          <span class="timeline-anchor timeline-anchor--end">Ferdigstilling</span>
          <span class="timeline-anchor timeline-anchor--time" data-timeframe-label>2 mnd prosjekt</span>
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
      </div>
      <div class="field field--full">
        <label class="field__label" for="description"
          >Beskrivelse
          <span class="field__label-hint">– hva trenger du hjelp med</span></label
        >
        <textarea class="field__textarea" id="description" name="description" rows="6" required autocomplete="on" placeholder="F.eks. vi er et lite startup team som trenger hjelp med design og utvikling av vår geniale konsept."></textarea>
      </div>
      <div class="inquiry-footer">
        <button class="inquiry-cta" type="submit">Send forespørsel</button>
        <p class="inquiry-note" data-inquiry-status aria-live="polite"></p>
        <p class="inquiry-note">
          *Forespørselen er uforpliktende. Vi vil svare deg snarest!
        </p>
      </div>
      <div class="section-head section-head--after-inquiry-cta">
        <h2 class="section-title">Design samtale</h2>
        <p class="section-lead">
          Det koster ingenting å starte dialogen med oss. Vi er åpne og direkte og vil være ærlige hvis
          vi ikke kan hjelpe deg. Produktutvikling inkluderer ulike faser og hver designprosjekt
          trenger individuell tilnærming. Hvordan vi fodeler fasene kan du
          <a class="internal-text-link" href="/innsikt/hva-er-industridesign">se her</a>
          .
        </p>
      </div>
    </form>
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
      <a class="contact-item contact-link" href="/application-form" itemprop="email">
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
      <a class="social-link" href="https://x.com/FormaaDesignAS" target="_blank" rel="noopener noreferrer" aria-label="X">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M18.9 3h2.98l-6.52 7.45L23 21h-5.95l-4.66-6.1L7.05 21H4.06l6.97-7.96L1 3h6.1l4.21 5.53L18.9 3Zm-1.04 16.2h1.65L6.2 4.72H4.42L17.86 19.2Z"
          />
        </svg>
      </a>
    </div>
  </div>
</section>`,
    'hero-process-flow': `<!-- NOTE: One-line process summary (Concept → 3D → CAD → Prototype → Production). -->
<div class="hero-process-flow" aria-label="Fra konsept til produksjon">
  <p class="hero-process-flow__text">
    <span class="hero-process-flow__step">Concept</span>
    <img class="hero-process-flow__arrow hero-process-flow__arrow--lead" src="/assets/small-arrow-right.svg" alt="" width="12" height="12" aria-hidden="true" />
    <span class="hero-process-flow__step">3D</span>
    <img class="hero-process-flow__arrow" src="/assets/small-arrow-right.svg" alt="" width="10" height="10" aria-hidden="true" />
    <span class="hero-process-flow__step">CAD</span>
    <img class="hero-process-flow__arrow" src="/assets/small-arrow-right.svg" alt="" width="10" height="10" aria-hidden="true" />
    <span class="hero-process-flow__step">Prototype</span>
    <img class="hero-process-flow__arrow" src="/assets/small-arrow-right.svg" alt="" width="10" height="10" aria-hidden="true" />
    <span class="hero-process-flow__step">Production</span>
  </p>
</div>`,
    'privacy-trust-section': `<!-- NOTE: Shared trust/privacy block (no cookies, confidentiality, portfolio consent) — same copy as homepage. -->
<section
  class="section section--white section--privacy-trust"
  aria-label="Personvern og konfidensialitet"
>
  <div class="section-inner">
    <div class="section-head">
      <p class="section-kicker">Personvern og konfidensialitet</p>
      <h2 class="section-title">Trygghet for idéer og forretningshemmeligheter</h2>
      <p class="section-lead">
        Formaa er et uavhengig designstudio. Vi bygger tillit gjennom tydelige rammer — ikke
        gjennom datainnsamling på nettsiden. Slik forholder vi oss til personvern, informasjon du
        deler og taushetsplikt i oppdrag.
      </p>
    </div>

    <div class="privacy-statement" aria-label="Våre personvern- og taushetsprinsipper">
      <article class="privacy-statement__item">
        <h3 class="privacy-statement__title">Ingen cookies eller sporing</h3>
        <p class="privacy-statement__text">
          Nettstedet bruker ikke informasjonskapsler (cookies), sporingsskript eller analyseverktøy
          som følger deg på tvers av sider. Du kan lese innholdet uten sporingsbannere eller
          samtykkevinduer.
        </p>
      </article>

      <article class="privacy-statement__item">
        <h3 class="privacy-statement__title">Ingen lagring eller deling av besøksdata</h3>
        <p class="privacy-statement__text">
          Vi samler ikke inn, lagrer ikke og selger ikke data om besøk på formaa.no, og vi deler
          ikke slik informasjon med tredjeparter. Opplysninger du sender via kontaktskjema brukes
          kun til å besvare henvendelsen — ikke til profilering eller markedsføring.
        </p>
      </article>

      <article class="privacy-statement__item">
        <h3 class="privacy-statement__title">Uavhengig designstudio</h3>
        <p class="privacy-statement__text">
          Vi er et selvstendig industridesign- og produktdesignstudio uten konsernstruktur som kan
          kreve deling av prosjektinformasjon på tvers av porteføljer. Dine oppdrag og beslutninger
          forblir hos oss og hos deg.
        </p>
      </article>

      <article class="privacy-statement__item">
        <h3 class="privacy-statement__title">Taushet etter norsk rett</h3>
        <p class="privacy-statement__text">
          Prosjektinformasjon, skisser og forretningshemmeligheter behandles med profesjonell taushet
          og i tråd med norsk rett, herunder reglene om forretningshemmeligheter og alminnelig
          taushetsplikt i oppdragsforhold. Skriftlig taushetsavtale kan avtales der prosjektet
          krever det.
        </p>
      </article>

      <article class="privacy-statement__item">
        <h3 class="privacy-statement__title">Varemerker og Forbrukerrådets regler</h3>
        <p class="privacy-statement__text">
          Vi følger gjeldende regler for varemerker, opphavsrett og rettigheter, og forholder oss
          til Forbrukerrådets retningslinjer og god forretningsskikk i markedsføring og
          kundeforhold.
        </p>
      </article>

      <article class="privacy-statement__item">
        <h3 class="privacy-statement__title">Portefølje kun etter ditt samtykke</h3>
        <p class="privacy-statement__text">
          Vi publiserer ikke ferdig arbeid, arbeid underveis eller annen prosjektrelatert
          informasjon — verken på nett eller i presentasjoner — med mindre du uttrykkelig
          godkjenner hva som kan vises, og når det kan publiseres som del av porteføljen vår.
        </p>
      </article>
    </div>
  </div>
</section>`,
    'cooperation-partners': `<!-- NOTE: Partner cooperation cards (name + description) — hydrated from company-partners-manifest.js on Om oss. -->
<div class="cooperation-partners" data-cooperation-partners aria-label="Samarbeidspartnere"></div>`,
    'partner-logos-section': `<!-- NOTE: Reusable partner logo strip — div.section (not nested section) for 4rem vertical margin; hydrated by shared-partner-logos.js. -->
<div
  class="section section--white section--partner-logos"
  aria-label="Samarbeidspartnere"
  data-partner-logos-section
>
  <div class="section-inner">
    <div class="section-head section-head--partner-logos">
      <h2 class="section-title">Samarbeidspartnere</h2>
    </div>
    <ul class="partner-logos" data-partner-logos-grid aria-label="Samarbeidspartnere"></ul>
  </div>
</div>`,
    'hva-du-far-section': `<!-- NOTE: “Hva du får” block — title, feature banner, and lead copy in one div.section (homepage). -->
<div class="section section--profesjonalisme" aria-label="Hva du får">
  <div class="section-inner">
    <h2 class="section-title">Hva du får</h2>
    <div class="feature-banner" aria-label="Fordeler">
      <div class="feature-points">
        <p class="feature-point">
          <img class="feature-icon" src="assets/icons/produserbar-icon.svg" alt="" width="64" height="64" aria-hidden="true" />
          <span class="feature-point__text">
            <strong>Design som faktisk kan produseres:</strong>
            <a class="feature-point__inline-link" href="/category/produktdesign/norge">Produktutvikling</a>
            med fokus på form og funksjon, materialvalg og produksjon, transport og resirkulering.
          </span>
        </p>
        <p class="feature-point">
          <img class="feature-icon" src="assets/icons/fremdrift-icon.svg" alt="" width="64" height="64" aria-hidden="true" />
          <span class="feature-point__text">
            <strong>Ingen unødvendig kompleksitet:</strong> Tydelige prosesser og raske
            <a class="feature-point__inline-link" href="/category/prototyping/norge">iterasjoner</a>
            som gjør ideer til konkrete resultater. Rask og direkte kommunikasjon.
          </span>
        </p>
        <p class="feature-point">
          <img class="feature-icon" src="assets/icons/bedrift-icon.svg" alt="" width="64" height="64" aria-hidden="true" />
          <span class="feature-point__text">
            <strong>Skapt verdi for bedriften garantert:</strong> Hver beslutning tar hensyn til kostnader, tid, produksjon, pakkning, marked og posisjonering.
          </span>
        </p>
        <p class="feature-point">
          <img class="feature-icon" src="assets/icons/brukerbehov-icon.svg" alt="" width="64" height="64" aria-hidden="true" />
          <span class="feature-point__text">
            <strong>Design basert på <span class="text-primary">ekte brukerbehov</span>:</strong>
            Grundig
            <a class="feature-point__inline-link" href="/category/brukerundersokelse/norge">research</a>
            av brukerne og brukernes mål, kontekst, bruksmåte, ergonomi og begrensninger.
          </span>
        </p>
      </div>
    </div>
    <p class="section-lead">
      Ferdidesignet produkt! Forståelig prosess som kombinerer
      <a class="internal-text-link" href="/category/brukerundersokelse/norge">brukerinnsikt</a>, produktstrategi,
      <a class="internal-text-link" href="/category/design/norge">design</a>
      og teknisk realisme. Vi snakker rett fram om det hele veien: hva som er realistisk, hva som koster tid og penger, og hvor det gir mening at vi bidrar. Sammen med dere bestemmer vi hva som passer for dere.
    </p>
  </div>
</div>`,
    'like-share-strip': `<!-- NOTE: Reusable like/share strip used below project and article hero media. -->
<div class="like-share-strip" data-like-share-strip>
  <div class="like-share-strip__cluster">
    <button class="like-share-strip__button" type="button" data-like-share-like aria-label="Lik denne siden" aria-pressed="false">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.5 21H6.75A2.75 2.75 0 0 1 4 18.25v-7.5A2.75 2.75 0 0 1 6.75 8h2.72a1.25 1.25 0 0 1 1.03.54l.2.28 2.07-4.69A2.44 2.44 0 0 1 15 2.7c1.4 0 2.53 1.17 2.47 2.57l-.17 3.73h1.61A3.1 3.1 0 0 1 22 12.29l-1.09 5.88A3.5 3.5 0 0 1 17.47 21H9.5Zm-2.75-11A.75.75 0 0 0 6 10.75v7.5c0 .41.34.75.75.75H9V10H6.75Zm4.25 9h6.47c.72 0 1.34-.51 1.47-1.22l1.09-5.88A1.1 1.1 0 0 0 18.91 11H16.3a1 1 0 0 1-1-1.05l.2-4.77a.47.47 0 0 0-.94-.16L12.03 10H11v9Z" />
      </svg>
    </button>
    <span class="like-share-strip__count" data-like-share-count>0</span>
  </div>
  <button class="like-share-strip__button like-share-strip__button--share" type="button" data-like-share-share aria-label="Del denne siden">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.5 15.5a3.46 3.46 0 0 0-2.37.94L9.28 13.3a3.7 3.7 0 0 0 0-2.6l5.85-3.14a3.5 3.5 0 1 0-.95-1.76L8.33 8.94a3.5 3.5 0 1 0 0 6.12l5.85 3.14a3.5 3.5 0 1 0 3.32-2.7Zm0-12a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM6.5 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm11 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
    </svg>
  </button>
  <span class="like-share-strip__status" data-like-share-status aria-live="polite"></span>
</div>`,
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
