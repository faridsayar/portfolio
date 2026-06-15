/**
 * Single Page Portfolio JavaScript
 * Focused behavior: timeline + project grid hydration.
 */

// NOTE: Browser-only like/share state for project and article hero strips; counts persist locally and allow one like per session.
function getBrowserStorageValue(storage, key) {
  try {
    return storage?.getItem(key) ?? null;
  } catch (_error) {
    return null;
  }
}

function setBrowserStorageValue(storage, key, value) {
  try {
    storage?.setItem(key, value);
    return true;
  } catch (_error) {
    return false;
  }
}

function setLikeShareStatus(statusEl, message) {
  if (!statusEl) return;
  statusEl.textContent = message;
}

// NOTE: Seed a stable browser-local starting count so each project/article can show social proof before manual likes are added.
function readLikeShareCount(storageKey) {
  const storedValue = getBrowserStorageValue(window.localStorage, storageKey);
  const parsed = Number.parseInt(storedValue || '', 10);
  if (Number.isFinite(parsed) && parsed >= 80) return parsed;

  const seededCount = Math.floor(Math.random() * (250 - 80 + 1)) + 80;
  setBrowserStorageValue(window.localStorage, storageKey, String(seededCount));
  return seededCount;
}

async function shareLikeShareUrl({ title, url, statusEl }) {
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      setLikeShareStatus(statusEl, 'Siden ble delt.');
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      setLikeShareStatus(statusEl, 'Lenken er kopiert.');
      return;
    }

    window.prompt('Kopier lenken:', url);
    setLikeShareStatus(statusEl, 'Kopier lenken fra dialogen.');
  } catch (error) {
    if (error?.name === 'AbortError') {
      setLikeShareStatus(statusEl, 'Deling avbrutt.');
      return;
    }
    setLikeShareStatus(statusEl, 'Kunne ikke dele siden akkurat nå.');
  }
}

function initializeLikeShareStrip(strip, options) {
  if (!strip || strip.dataset.likeShareInitialized === 'true') return;

  const likeButton = strip.querySelector('[data-like-share-like]');
  const countEl = strip.querySelector('[data-like-share-count]');
  const shareButton = strip.querySelector('[data-like-share-share]');
  const statusEl = strip.querySelector('[data-like-share-status]');
  if (!likeButton || !countEl || !shareButton) return;

  const {
    storageKey,
    sessionKey,
    likeLabel,
    shareLabel,
    shareTitle,
    shareUrl,
    alreadyLikedMessage,
  } = options;
  let count = readLikeShareCount(storageKey);
  let likedThisSession = getBrowserStorageValue(window.sessionStorage, sessionKey) === '1';

  const render = () => {
    countEl.textContent = `${count} likes`;
    countEl.setAttribute('aria-label', `${count} likes`);
    likeButton.setAttribute('aria-pressed', likedThisSession ? 'true' : 'false');
  };

  if (likeLabel) likeButton.setAttribute('aria-label', likeLabel);
  if (shareLabel) shareButton.setAttribute('aria-label', shareLabel);

  likeButton.addEventListener('click', () => {
    if (likedThisSession) {
      setLikeShareStatus(
        statusEl,
        alreadyLikedMessage || 'Du har allerede registrert en like i denne økten.'
      );
      return;
    }

    count += 1;
    likedThisSession = true;
    setBrowserStorageValue(window.localStorage, storageKey, String(count));
    setBrowserStorageValue(window.sessionStorage, sessionKey, '1');
    render();
    setLikeShareStatus(statusEl, 'Takk! Liken er registrert.');
  });

  shareButton.addEventListener('click', async () => {
    await shareLikeShareUrl({ title: shareTitle, url: shareUrl, statusEl });
  });

  render();
  strip.dataset.likeShareInitialized = 'true';
}

class SinglePagePortfolio {
  constructor() {
    this.projectCatalogPromise = null;
    this.categoryFeatureBannerMarkupPromise = null;
    this.setupHeroVideoShuffle();
    this.setupCategoryHeroVideoShuffle();
    this.setupGlobalImageFallback();
    this.setupTimeline();
    this.setupInquiryFormMailto();
    this.setupPricingEstimator();
    this.setupPricingPackages();
    this.setupProjectPageNavVerticalAlign();
    this.initializeProjectViews();
    this.initializeCategoryPreFormViews();
    this.setupCategoryEnServiceTags();
    this.setupProsessImageGridColumns();
  }

  // NOTE: Tjenester Prosess page — split image grid into two independent columns on desktop (no shared row heights).
  setupProsessImageGridColumns() {
    const grid = document.querySelector('.prosess-image-grid');
    if (!grid) return;

    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const collectItems = () => {
      const directItems = [...grid.querySelectorAll(':scope > .prosess-image-grid__item')];
      if (directItems.length) return directItems;
      return [
        ...grid.querySelectorAll(
          ':scope > .prosess-image-grid__column > .prosess-image-grid__item'
        ),
      ];
    };

    const unwrapColumns = () => {
      const columns = [...grid.querySelectorAll(':scope > .prosess-image-grid__column')];
      if (!columns.length) return;

      const leftItems = [...(columns[0]?.children || [])];
      const rightItems = [...(columns[1]?.children || [])];
      const maxLength = Math.max(leftItems.length, rightItems.length);

      for (let index = 0; index < maxLength; index += 1) {
        if (leftItems[index]) grid.appendChild(leftItems[index]);
        if (rightItems[index]) grid.appendChild(rightItems[index]);
      }

      columns.forEach((column) => column.remove());
    };

    const wrapColumns = () => {
      const items = collectItems();
      if (!items.length) return;

      unwrapColumns();

      const columnLeft = document.createElement('div');
      const columnRight = document.createElement('div');
      columnLeft.className = 'prosess-image-grid__column';
      columnRight.className = 'prosess-image-grid__column';

      items.forEach((item, index) => {
        (index % 2 === 0 ? columnLeft : columnRight).appendChild(item);
      });

      grid.append(columnLeft, columnRight);
    };

    const syncLayout = () => {
      if (mediaQuery.matches) {
        wrapColumns();
        return;
      }
      unwrapColumns();
    };

    syncLayout();
    mediaQuery.addEventListener('change', syncLayout);
  }

  // NOTE: Appends English intent landing links to the shared “Velg kategori” tag row on category pages.
  setupCategoryEnServiceTags() {
    if (!window.location.pathname.includes('/category/')) return;

    const categoryTagsRow = document.querySelector('.service-tags[aria-label="Velg kategori"]');
    if (!categoryTagsRow || categoryTagsRow.dataset.enServiceTagsAdded === 'true') return;

    const enServiceTags = [
      { href: '/en/product-rendering', label: '3D Product Renders' },
      { href: '/en/cad-modeling', label: 'CAD modeling' },
      { href: '/en/product-animation', label: 'Product animation' },
    ];

    enServiceTags.forEach(({ href, label }) => {
      const link = document.createElement('a');
      link.className = 'service-tag';
      link.href = href;
      link.textContent = label;
      link.setAttribute('hreflang', 'en');
      categoryTagsRow.appendChild(link);
    });

    categoryTagsRow.dataset.enServiceTagsAdded = 'true';
  }

  // NOTE: Per-project narrative copy for Problem / Løsning / Resultat block on project pages.
  getProjectNarratives() {
    return {
      obseed: {
        problem:
          'Ferdigproduserte gitarer dekker sjelden behovet for åtte strenger, lav stemming og et uttrykk som matcher både spillestil og kropp — uten kompromiss på ergonomi og balanse.',
        solution:
          'Obseed ble utviklet som et skreddersydd konsept: kropp og halsgeometri tilpasset ekstra strenger, tydelig plassering av hardware, materialvalg og visuell identitet — fra skisse til produksjonsklare detaljer.',
        outcome:
          'Resultatet er et helhetlig CAD-modell for en custom 8-strengers gitar, klart for produksjon med CNC-maskin.',
      },
      undo: {
        problem:
          'Ørkener på jorden er ikke statiske, de vokser og sprer seg raskt. Ørkener endrer omgivelser og klima, og fører til økologiske og økonomiske problemer for millioner av mennesker. Hva kan gjøres for å hindre ørkenvekst?',
        solution:
          'Mange land bruker ulike metoder for å hindre ørkenvekst. Den mest effektive løsningen er å bruke planter, gi dem vann og hjelpe dem med å overleve i tørre omgivelser.',
        outcome:
          'Vår designløsning foreslår et produkt som kan hjelpe i denne kampen. Ved å etterligne frø som faller fra trær, har vi kommet til en løsning som kan droppes fra fly eller drone, på en måte som "bombing" av ørken. Selve formen er bygget av biokomposittplast som fordøyes av naturen etter hvert. Frøet "UNDO" inneholder vann, kompost med frø, mycelium og næring for planter, og er prefylt med vann - alt det nødvendige for å sikre overlevelse av planter i tørre omgivelser. Samtidig er Undo bygget slik at den ved fall utløser vinger som roterer objektet og bremser akselerasjonen. Når den treffer bakken, vil kjernen knekke den innvendige beskyttelsesskorpen og lage relativ skygge (beskyttelse mot direkte sollys) med vingene og den knekte skorpen. På den måten gir vi alt det nødvendige (for spesifikke planter i økosystemet) for å overleve, og som resultat forsterkes jorda og gir nytt grunnlag for beplantning.',
      },
      h2o: {
        problem:
          'Mange brukere glemmer både jevn hydrering og daglig aktivitetsnivå når data er spredt på flere produkter.',
        solution:
          'Vi kombinerte vannflaske og mekanisk skritteller i ett produkt med tydelig fysisk interaksjon og robust hverdagsbruk.',
        outcome:
          'Konseptet ga en enklere brukerreise og et sterkere produktgrunnlag for videre testing av funksjon, ergonomi og produksjon.',
      },
      monocopter: {
        problem:
          'Søkeoppdrag i store områder krever ofte tunge systemer med begrenset mobilitet og krevende logistikk.',
        solution:
          'Modulær VTOL-drone med effektiv områdedekning, som kombinerer enkel vertikal løfteevne med en mer aerodynamisk form for lengre energieffektive turer. Den enkle trekantformen gir mulighet til å sette flere droner i ett element og styre dem som ett objekt for enkelhet, før de splittes opp ved ankomst til målområde for mer effektiv områdedekning.',
        outcome:
          'Prosjektet resulterte i et beslutningsklart konsept med visualiseringer som støtter videre utvikling og validering.',
      },
      proton: {
        problem:
          'Markedet for hodetelefoner er mettet, og det er en mangel på robust design uten at det ser teit ut.',
        solution:
          'Vi har utviklet et urbant designuttrykk med robust form, klare linjer og detaljering som støtter både komfort og merkevareprofil. Hele profilen kan lages av en enkel metallplate, enten aluminium eller rustfritt stål. Elektronikken kan enkelt festes til profilen i spesiallagde hulrom.',
        outcome:
          'Resultatet ble et helhetlig konsept som styrker produktets posisjonering og gir et tydelig grunnlag for prototypefase.',
      },
      'eco-mate-closet': {
        problem:
          'Kildesortering hjemme oppleves ofte rotete og lite integrert i interiøret, noe som reduserer faktisk bruk. Samtidig er det lite tilbud i markedet av "alt i ett"-løsninger.',
        solution:
          'Vi har laget konsept av et minimalistisk sorteringsskap med tydelig struktur, enkel tilgang og et nøytralt utseende som passer de fleste interiør. To dører gir tilgang til hele skapet og til de mest brukte avfallsposene. I stedet for håndtak er det et hull i døren, slik at fingerspor ved skitne fingre settes igjen på innsiden av skapet. Skapet inneholder beholdere for tre hovedtyper avfall: mat, plast og rest, en større boks for papp og papir (som klarer å ta imot en pizzaboks!), en flaskesorteringsboks, og 4 små bokser for diverse avfall som brukeren kan definere selv. For eksempel batterier, farlig avfall, glass, metall eller pærer. I tillegg har skapet en hylle på toppen som kan brukes til småting, for eksempel rengjøringsmidler eller poseruller.',
        outcome:
          'Konseptet forbedret både funksjon og visuell kvalitet, og ga et konkret utgangspunkt for videre produksjonsforberedelse.',
      },
      nomos: {
        problem:
          'Bandet manglet en helhetlig visuell identitet som kunne fungere konsekvent på tvers av plakater, merch og digitale flater.',
        solution:
          'Vi utviklet et samlet branding-system med logo, typografi, fargebruk og anvendelser tilpasset musikkmiljø og promotering.',
        outcome:
          'Leveransen ga en tydeligere merkevareopplevelse og mer konsistent kommunikasjon i både salg, event og profilering.',
      },
      nordic: {
        problem:
          'Restauranten trengte et tydelig nordisk uttrykk som kunne løfte helhetsinntrykket uten å miste lokal relevans.',
        solution:
          'Designarbeidet etablerte en visuell identitet med nordisk tonalitet, strukturert typografi og fleksible brand-elementer.',
        outcome:
          'Prosjektet ga en mer gjenkjennelig profil og et praktisk designgrunnlag for videre bruk i menyer, interiør og kampanjer.',
      },
      rafaels: {
        problem:
          'Melkeprodusenten trengte en sterkere merkevare som kunne binde moderne og det autentiske uttrykket til produktet og merkevaren.',
        solution:
          'Vi utviklet en helhetlig brandpakke fra logo og visuell retning til emballasjeelementer og trykklare flater.',
        outcome:
          'Resultatet var en mer samlet markedsprofil som styrket produktpresentasjon og ga bedre grunnlag for kommersiell vekst.',
      },
      bike: {
        problem:
          'Tidlige sykkelkonsepter manglet en tydelig balanse mellom komponentdetaljer, helhetlig uttrykk og brukeropplevelse.',
        solution:
          'Prosjektet gjennomførte strukturerte detaljstudier av geometri, komponentintegrasjon og visuell sammenheng i produktet.',
        outcome:
          'Arbeidet ga bedre beslutningsgrunnlag for videre iterasjoner og en mer konsistent retning for design og funksjon.',
      },
    };
  }

  // NOTE: Global fallback for failed <img> loads; replaces broken images with a plain black rectangle.
  setupGlobalImageFallback() {
    const blackFallbackSvg =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='black'/%3E%3C/svg%3E";

    document.addEventListener(
      'error',
      (event) => {
        const target = event.target;
        if (!(target instanceof HTMLImageElement)) return;
        if (target.dataset.fallbackApplied === 'true') return;
        target.dataset.fallbackApplied = 'true';
        target.src = blackFallbackSvg;
      },
      true
    );
  }

  // NOTE: Load generated folder manifest so project image lists stay automatic.
  async loadProjectCatalog() {
    if (this.projectCatalogPromise) return this.projectCatalogPromise;
    const normalizeProjects = (manifest) => {
      // NOTE: Hardcoded project order shared by homepage grid and project detail prev/next navigation.
      const preferredOrder = [
        'obseed',
        'undo',
        'nomos',
        'proton',
        'nordic',
        'monocopter',
        'rafaels',
        'eco-mate-closet',
        'h2o',
      ];
      const orderRank = new Map(preferredOrder.map((slug, index) => [slug, index]));
      const projects = Array.isArray(manifest?.projects) ? manifest.projects : [];
      const validProjects = projects.filter(
        (project) =>
          project &&
          typeof project.slug === 'string' &&
          typeof project.title === 'string' &&
          Array.isArray(project.images)
      );
      // NOTE: Exclude unpublished catalog entries (see project-folders.json and scripts/lib/project-seo-slugs.mjs).
      const enabledProjects = validProjects.filter((project) => project.published !== false);
      return enabledProjects.sort((a, b) => {
        const aRank = orderRank.has(a.slug) ? orderRank.get(a.slug) : Number.MAX_SAFE_INTEGER;
        const bRank = orderRank.has(b.slug) ? orderRank.get(b.slug) : Number.MAX_SAFE_INTEGER;
        if (aRank !== bRank) return aRank - bRank;
        return a.title.localeCompare(b.title);
      });
    };

    const fromGlobal = normalizeProjects(window.__PROJECTS_MANIFEST);
    if (fromGlobal.length > 0) {
      this.projectCatalogPromise = Promise.resolve(fromGlobal);
      return this.projectCatalogPromise;
    }

    this.projectCatalogPromise = fetch('assets/data/projects-manifest.json', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`Manifest fetch failed: ${response.status}`);
        return response.json();
      })
      .then((manifest) => normalizeProjects(manifest))
      .catch(() => []);
    return this.projectCatalogPromise;
  }

  async initializeProjectViews() {
    const catalog = await this.loadProjectCatalog();
    this.setupProjectDetailPage(catalog);
    this.setupProjectsGrid(catalog);
    this.setupProjectTemplateGalleries();
  }

  async initializeCategoryPreFormViews() {
    await this.mountCategoryHeroProcessFlowComponent();
    await this.mountCategoryProjectsLink();
    await this.mountCategoryPreFormSections();
  }

  async loadHeroProcessFlowMarkup() {
    if (this.heroProcessFlowMarkupPromise) return this.heroProcessFlowMarkupPromise;
    const fallbackMarkup = `<div class="hero-process-flow" aria-label="Fra konsept til produksjon">
  <p class="hero-process-flow__text">
    <a class="hero-process-flow__step" href="/tjenester-prosess#prosess">Konsept</a>
    <img class="hero-process-flow__arrow hero-process-flow__arrow--lead" src="../../assets/small-arrow-right.svg" alt="" width="12" height="12" aria-hidden="true" />
    <a class="hero-process-flow__step" href="/tjenester-prosess#prosess">3D</a>
    <img class="hero-process-flow__arrow" src="../../assets/small-arrow-right.svg" alt="" width="10" height="10" aria-hidden="true" />
    <a class="hero-process-flow__step" href="/tjenester-prosess#prosess">CAD</a>
    <img class="hero-process-flow__arrow" src="../../assets/small-arrow-right.svg" alt="" width="10" height="10" aria-hidden="true" />
    <a class="hero-process-flow__step" href="/tjenester-prosess#prosess">Prototype</a>
    <img class="hero-process-flow__arrow" src="../../assets/small-arrow-right.svg" alt="" width="10" height="10" aria-hidden="true" />
    <a class="hero-process-flow__step" href="/tjenester-prosess#prosess">Produksjon</a>
  </p>
</div>`;
    this.heroProcessFlowMarkupPromise = (async () => {
      try {
        let response = await fetch('/components/hero-process-flow.html', { cache: 'no-store' });
        if (!response.ok) {
          response = await fetch('../../components/hero-process-flow.html', { cache: 'no-store' });
        }
        if (!response.ok) {
          response = await fetch('components/hero-process-flow.html', { cache: 'no-store' });
        }
        if (!response.ok) return fallbackMarkup;
        return await response.text();
      } catch (_error) {
        return fallbackMarkup;
      }
    })();
    return this.heroProcessFlowMarkupPromise;
  }

  async mountCategoryHeroProcessFlowComponent() {
    const pathname = window.location.pathname;
    const isCategoryPage = pathname.includes('/category/');
    const isApplicationFormPage = /application-form/i.test(pathname);
    if (!isCategoryPage && !isApplicationFormPage) return;
    const heroMedia = document.querySelector('.category-hero-media');
    if (!heroMedia) return;
    if (heroMedia.nextElementSibling?.classList?.contains('hero-process-flow')) return;

    const markup = await this.loadHeroProcessFlowMarkup();
    heroMedia.insertAdjacentHTML('afterend', markup);
  }

  async loadCategoryFeatureBannerMarkup() {
    if (this.categoryFeatureBannerMarkupPromise) return this.categoryFeatureBannerMarkupPromise;
    const fallbackMarkup = `<section class="section section--white section--features category-feature-banner-section" aria-label="Fordeler"><div class="section-inner"><div class="feature-banner" aria-label="Fordeler"></div></div></section>`;
    this.categoryFeatureBannerMarkupPromise = (async () => {
      try {
        let response = await fetch('/components/category-feature-banner.html', {
          cache: 'no-store',
        });
        if (!response.ok) {
          response = await fetch('../../components/category-feature-banner.html', {
            cache: 'no-store',
          });
        }
        if (!response.ok) {
          response = await fetch('components/category-feature-banner.html', { cache: 'no-store' });
        }
        if (!response.ok) return fallbackMarkup;
        return await response.text();
      } catch (_error) {
        return fallbackMarkup;
      }
    })();
    return this.categoryFeatureBannerMarkupPromise;
  }

  async loadCategoryProjectsLinkMarkup() {
    if (this.categoryProjectsLinkMarkupPromise) return this.categoryProjectsLinkMarkupPromise;
    const fallbackMarkup = `<nav class="category-inline-links" aria-label="Nyttige lenker"><p class="category-inline-links__item"><a class="category-projects-link" href="/prosjekter">Alle prosjekter<img class="category-projects-link__arrow" src="/assets/small-arrow-right.svg" alt="" width="12" height="12" aria-hidden="true" /></a></p><p class="category-inline-links__item"><a class="category-projects-link" href="/tjenester-prosess#prosess">Prosess<img class="category-projects-link__arrow" src="/assets/small-arrow-right.svg" alt="" width="12" height="12" aria-hidden="true" /></a></p><p class="category-inline-links__item"><a class="category-projects-link" href="/innsikt">Innsikt<img class="category-projects-link__arrow" src="/assets/small-arrow-right.svg" alt="" width="12" height="12" aria-hidden="true" /></a></p><p class="category-inline-links__item"><a class="category-projects-link" href="/oss">Bli kjent med oss<img class="category-projects-link__arrow" src="/assets/small-arrow-right.svg" alt="" width="12" height="12" aria-hidden="true" /></a></p><p class="category-inline-links__item"><a class="category-projects-link" href="/application-form">Kontakt oss<img class="category-projects-link__arrow" src="/assets/small-arrow-right.svg" alt="" width="12" height="12" aria-hidden="true" /></a></p><p class="category-inline-links__item"><a class="category-projects-link" href="/prisestimat">Prisoversikt<img class="category-projects-link__arrow" src="/assets/small-arrow-right.svg" alt="" width="12" height="12" aria-hidden="true" /></a></p></nav>`;
    this.categoryProjectsLinkMarkupPromise = (async () => {
      try {
        let response = await fetch('/components/category-projects-link.html', {
          cache: 'no-store',
        });
        if (!response.ok) {
          response = await fetch('../../components/category-projects-link.html', {
            cache: 'no-store',
          });
        }
        if (!response.ok) {
          response = await fetch('components/category-projects-link.html', { cache: 'no-store' });
        }
        if (!response.ok) return fallbackMarkup;
        return await response.text();
      } catch (_error) {
        return fallbackMarkup;
      }
    })();
    return this.categoryProjectsLinkMarkupPromise;
  }

  async mountCategoryProjectsLink() {
    const pathname = window.location.pathname;
    const isCategoryPage = pathname.includes('/category/');
    if (!isCategoryPage) return;

    const introSection = document.querySelector('section[aria-label="Formaa"] .section-inner');
    if (!introSection || introSection.querySelector('.category-inline-links')) return;

    const afterGridLeads = introSection.querySelectorAll('.section-lead--after-grid');
    const anchor =
      afterGridLeads.length > 0
        ? afterGridLeads[afterGridLeads.length - 1]
        : introSection.querySelector('.section-lead:last-of-type') ||
          introSection.querySelector('.section-title');
    if (!anchor) return;

    const markup = await this.loadCategoryProjectsLinkMarkup();
    anchor.insertAdjacentHTML('afterend', markup);
  }

  async mountCategoryPreFormSections() {
    const isCategoryPage = window.location.pathname.includes('/category/');
    if (!isCategoryPage) return;

    const applicationFormSection = document.querySelector('#application-form');
    if (!applicationFormSection || applicationFormSection.dataset.preFormBlocksMounted === 'true') {
      return;
    }

    const featureMarkup = await this.loadCategoryFeatureBannerMarkup();

    applicationFormSection.insertAdjacentHTML('beforebegin', featureMarkup);
    applicationFormSection.dataset.preFormBlocksMounted = 'true';
  }

  // NOTE: Skip multi-clip hero shuffle when Data Saver is on (Network Information API) or user prefers reduced motion; otherwise shuffle on every viewport size.
  shouldSkipHeavyVideoShuffle() {
    const saveDataOn = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
    if (saveDataOn) return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // NOTE: Interactive timeline (process prioritization)
  setupHeroVideoShuffle() {
    const heroVideo = document.querySelector('[data-hero-video-shuffle]');
    if (!heroVideo) return;

    // NOTE: Static hero (no clip cycling) when saving data or reduced motion; avoids large downloads in those modes.
    if (this.shouldSkipHeavyVideoShuffle()) {
      heroVideo.pause();
      heroVideo.removeAttribute('src');
      heroVideo.load();
      return;
    }

    // NOTE: Hero background clip list from `assets/images/shuffle-images/`, shuffled in a fixed cadence.
    const clipSources = [
      { src: 'assets/images/shuffle-images/proton-gif.mov', key: 'proton-gif' },
      { src: 'assets/images/shuffle-images/proton-gif2.mov', key: 'proton-gif2' },
      // NOTE: Lunar watch clip is inserted right after proton-gif2 in the hero shuffle order.
      { src: 'assets/images/shuffle-images/lunar-watch.mp4', key: 'lunar-watch' },
      { src: 'assets/images/shuffle-images/obseed.mp4', key: 'obseed' },
      { src: 'assets/images/shuffle-images/obseed-head.mp4', key: 'obseed-head' },
      { src: 'assets/images/shuffle-images/3d-printer-working.mp4', key: '3d-printer-working' },
      { src: 'assets/images/shuffle-images/test-animation.mp4', key: 'test-animation' },
      // NOTE: me-drawing is intentionally last in the hero shuffle sequence.
      { src: 'assets/images/shuffle-images/me-drawing.mp4', key: 'me-drawing' },
    ];

    let currentClipIndex = 0;
    let shuffleTimer = null;
    let isShuffling = false;
    // NOTE: Clips in this set advance after the file’s real duration (see loadedmetadata reschedule).
    const useIntrinsicDurationKeys = new Set(['obseed', 'obseed-head']);

    const clipDurationByKey = {
      'me-drawing': 1800,
      '3d-printer-working': 2000,
      'test-animation': 3000,
      'proton-gif': 2000,
      'proton-gif2': 2000,
    };

    const setClip = (index) => {
      const nextClip = clipSources[index];
      if (!nextClip) return;

      // NOTE: Expose current clip key so CSS can apply clip-specific framing (e.g. extra crop for me-drawing).
      heroVideo.dataset.heroVideoClip = nextClip.key;
      heroVideo.src = nextClip.src;
      heroVideo.currentTime = 0;
      heroVideo.play().catch(() => {});
    };

    const clearShuffleTimer = () => {
      if (!shuffleTimer) return;
      window.clearTimeout(shuffleTimer);
      shuffleTimer = null;
    };

    const getClipDurationMs = () => {
      const clip = clipSources[currentClipIndex];
      if (!clip) return 2000;
      if (useIntrinsicDurationKeys.has(clip.key)) {
        const seconds = Number(heroVideo.duration);
        return Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds * 1000) : 2000;
      }
      return clipDurationByKey[clip.key] ?? 2000;
    };

    const scheduleNextClip = () => {
      clearShuffleTimer();
      if (!isShuffling) return;
      shuffleTimer = window.setTimeout(() => {
        currentClipIndex = (currentClipIndex + 1) % clipSources.length;
        setClip(currentClipIndex);
        scheduleNextClip();
      }, getClipDurationMs());
    };

    const startShuffle = () => {
      if (isShuffling) return;
      isShuffling = true;
      scheduleNextClip();
    };

    const stopShuffle = () => {
      isShuffling = false;
      clearShuffleTimer();
    };

    setClip(currentClipIndex);
    startShuffle();

    // NOTE: When intrinsic-duration clips load metadata, reschedule so timing matches real clip length.
    heroVideo.addEventListener('loadedmetadata', () => {
      if (!isShuffling) return;
      const clip = clipSources[currentClipIndex];
      if (!clip || !useIntrinsicDurationKeys.has(clip.key)) return;
      scheduleNextClip();
    });

    // NOTE: Pause timer when tab is hidden to avoid unnecessary source swaps in the background.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopShuffle();
      } else {
        setClip(currentClipIndex);
        startShuffle();
      }
    });
  }

  // NOTE: Category pages use a dedicated two-clip proton shuffle banner.
  setupCategoryHeroVideoShuffle() {
    const categoryVideo = document.querySelector('[data-category-hero-video-shuffle]');
    if (!categoryVideo) return;
    const pathname = window.location.pathname.toLowerCase();
    const isPrototypingOrProduksjonCategory =
      pathname.includes('/category/prototyping/') ||
      pathname.includes('/category/teknisk-tegning/');

    // NOTE: Same gating as home hero: no shuffle under Data Saver or reduced motion.
    if (this.shouldSkipHeavyVideoShuffle()) {
      categoryVideo.pause();
      categoryVideo.removeAttribute('src');
      categoryVideo.load();
      return;
    }

    const clipSources = isPrototypingOrProduksjonCategory
      ? [
          {
            src: '../../assets/images/shuffle-images/3d-printer-working.mp4',
            key: '3d-printer-working',
          },
        ]
      : [
          { src: '../../assets/images/shuffle-images/proton-gif.mov', key: 'proton-gif' },
          { src: '../../assets/images/shuffle-images/proton-gif2.mov', key: 'proton-gif2' },
          // NOTE: Lunar watch clip is inserted right after proton-gif2 for category hero shuffle.
          { src: '../../assets/images/shuffle-images/lunar-watch.mp4', key: 'lunar-watch' },
          { src: '../../assets/images/shuffle-images/obseed.mp4', key: 'obseed' },
          { src: '../../assets/images/shuffle-images/obseed-head.mp4', key: 'obseed-head' },
        ];

    let currentClipIndex = 0;
    let shuffleTimer = null;
    let isShuffling = false;
    const useIntrinsicDurationKeys = new Set(['obseed', 'obseed-head']);

    const setClip = (index) => {
      const nextClip = clipSources[index];
      if (!nextClip) return;
      categoryVideo.dataset.categoryHeroVideoClip = nextClip.key;
      categoryVideo.src = nextClip.src;
      categoryVideo.currentTime = 0;
      categoryVideo.play().catch(() => {});
    };

    const clearShuffleTimer = () => {
      if (!shuffleTimer) return;
      window.clearTimeout(shuffleTimer);
      shuffleTimer = null;
    };

    const getClipDurationMs = () => {
      const clip = clipSources[currentClipIndex];
      if (!clip) return clipSources.length > 1 ? 2000 : 10000;
      if (useIntrinsicDurationKeys.has(clip.key)) {
        const seconds = Number(categoryVideo.duration);
        return Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds * 1000) : 2000;
      }
      return clipSources.length > 1 ? 2000 : 10000;
    };

    const scheduleNextClip = () => {
      clearShuffleTimer();
      if (!isShuffling) return;
      shuffleTimer = window.setTimeout(() => {
        currentClipIndex = (currentClipIndex + 1) % clipSources.length;
        setClip(currentClipIndex);
        scheduleNextClip();
      }, getClipDurationMs());
    };

    const startShuffle = () => {
      if (isShuffling) return;
      isShuffling = true;
      scheduleNextClip();
    };

    const stopShuffle = () => {
      isShuffling = false;
      clearShuffleTimer();
    };

    setClip(currentClipIndex);
    startShuffle();

    categoryVideo.addEventListener('loadedmetadata', () => {
      if (!isShuffling) return;
      const clip = clipSources[currentClipIndex];
      if (!clip || !useIntrinsicDurationKeys.has(clip.key)) return;
      scheduleNextClip();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopShuffle();
      } else {
        setClip(currentClipIndex);
        startShuffle();
      }
    });
  }

  // NOTE: Interactive timeline (process prioritization)
  setupTimeline() {
    const timeline = document.querySelector('[data-timeline]');
    if (!timeline) return;

    const track = timeline.querySelector('[data-timeline-track]');
    const segments = Array.from(timeline.querySelectorAll('[data-segment]'));
    const handles = Array.from(timeline.querySelectorAll('[data-handle]'));
    const handleLabels = Array.from(timeline.querySelectorAll('[data-handle-label]'));
    const summaryEl = timeline.querySelector('[data-timeline-summary]');
    const inputs = Array.from(timeline.querySelectorAll('[data-phase-input]'));
    const timeframeSelect = document.querySelector('[data-timeframe-select]');
    const timeframeLabel = timeline.querySelector('[data-timeframe-label]');

    if (!track || segments.length !== 5 || handles.length !== 4) return;

    const phases = [
      'Brukeranalyse',
      'Konseptutvikling',
      'Prototype',
      'Validering',
      'Ferdigstilling',
    ];

    const minGapPct = 3;
    let boundaries = Array.from({ length: 4 }, (_, i) => Math.round(((i + 1) * 100) / 5));
    let activeHandleIndex = null;
    let pointerId = null;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function computePhasePercents() {
      const b = boundaries;
      const p = [b[0], b[1] - b[0], b[2] - b[1], b[3] - b[2], 100 - b[3]];
      return p.map((x) => clamp(x, 0, 100));
    }

    function computeRoundedPercents(percs) {
      const rounded = percs.map((p) => Math.round(p));
      const sum = rounded.reduce((a, b) => a + b, 0);
      let diff = 100 - sum;
      if (diff === 0) return rounded;

      const order = percs
        .map((p, idx) => ({ idx, p }))
        .sort((a, b) => (diff > 0 ? b.p - a.p : a.p - b.p));

      for (let i = 0; i < Math.abs(diff); i++) {
        rounded[order[i % order.length].idx] += diff > 0 ? 1 : -1;
      }
      return rounded;
    }

    function ensureSummary() {
      if (!summaryEl) return;
      if (summaryEl.children.length === phases.length) return;
      summaryEl.innerHTML = '';
      phases.forEach((name, idx) => {
        const item = document.createElement('div');
        item.className = 'timeline-summary-item';
        item.dataset.phaseSummary = String(idx);
        item.innerHTML = `
          <span class="timeline-summary-item__name">${name}</span>
          <span class="timeline-summary-item__value">0%</span>
        `;
        summaryEl.appendChild(item);
      });
    }

    function isVerticalTimeline() {
      return window.matchMedia('(max-width: 768px)').matches;
    }

    function pctFromPointer(clientX, clientY) {
      const rect = track.getBoundingClientRect();
      if (isVerticalTimeline()) {
        const yFromBottom = clamp(rect.bottom - clientY, 0, rect.height);
        return rect.height === 0 ? 0 : (yFromBottom / rect.height) * 100;
      }
      const x = clamp(clientX - rect.left, 0, rect.width);
      return rect.width === 0 ? 0 : (x / rect.width) * 100;
    }

    function setHandleAria(handle, idx) {
      const min = idx === 0 ? minGapPct : boundaries[idx - 1] + minGapPct;
      const max = idx === boundaries.length - 1 ? 100 - minGapPct : boundaries[idx + 1] - minGapPct;
      handle.setAttribute('aria-label', `Grense for ${phases[idx]}`);
      handle.setAttribute('aria-valuemin', String(Math.round(min)));
      handle.setAttribute('aria-valuemax', String(Math.round(max)));
      handle.setAttribute('aria-valuenow', String(Math.round(boundaries[idx])));
    }

    function render() {
      const percs = computePhasePercents();
      const rounded = computeRoundedPercents(percs);
      const vertical = isVerticalTimeline();

      segments.forEach((seg, i) => {
        if (vertical) {
          seg.style.width = '100%';
          seg.style.height = `${percs[i]}%`;
          return;
        }
        seg.style.width = `${percs[i]}%`;
        seg.style.height = '100%';
      });

      handles.forEach((handle, i) => {
        if (vertical) {
          handle.style.left = '50%';
          handle.style.top = `${100 - boundaries[i]}%`;
        } else {
          handle.style.left = `${boundaries[i]}%`;
          handle.style.top = '50%';
        }
        setHandleAria(handle, i);
      });

      handleLabels.forEach((labelEl, i) => {
        if (vertical) {
          labelEl.style.top = `${100 - boundaries[i]}%`;
          labelEl.style.left = '';
        } else {
          labelEl.style.left = `${boundaries[i]}%`;
          labelEl.style.top = '0';
        }
        labelEl.textContent = `${phases[i]} ${rounded[i]}%`;
      });

      ensureSummary();
      if (summaryEl) {
        const items = Array.from(summaryEl.querySelectorAll('[data-phase-summary]'));
        items.forEach((item) => {
          const idx = Number(item.dataset.phaseSummary);
          const valueEl = item.querySelector('.timeline-summary-item__value');
          if (valueEl) valueEl.textContent = `${rounded[idx]}%`;
        });
      }

      inputs.forEach((inputEl) => {
        const idx = Number(inputEl.dataset.phaseInput);
        if (Number.isFinite(idx) && idx >= 0 && idx < rounded.length)
          inputEl.value = String(rounded[idx]);
      });

      if (timeframeLabel && timeframeSelect) {
        timeframeLabel.textContent = `${timeframeSelect.value} prosjekt`;
      }
    }

    function updateBoundary(idx, nextValue) {
      const min = idx === 0 ? minGapPct : boundaries[idx - 1] + minGapPct;
      const max = idx === boundaries.length - 1 ? 100 - minGapPct : boundaries[idx + 1] - minGapPct;
      boundaries[idx] = clamp(nextValue, min, max);
      render();
    }

    handles.forEach((handle, idx) => {
      handle.addEventListener('pointerdown', (e) => {
        activeHandleIndex = idx;
        pointerId = e.pointerId;
        handle.setPointerCapture(pointerId);
        e.preventDefault();
      });

      handle.addEventListener('pointermove', (e) => {
        if (activeHandleIndex !== idx) return;
        if (pointerId !== e.pointerId) return;
        updateBoundary(idx, pctFromPointer(e.clientX, e.clientY));
      });

      handle.addEventListener('pointerup', (e) => {
        if (pointerId !== e.pointerId) return;
        activeHandleIndex = null;
        pointerId = null;
      });

      handle.addEventListener('pointercancel', (e) => {
        if (pointerId !== e.pointerId) return;
        activeHandleIndex = null;
        pointerId = null;
      });

      handle.addEventListener('keydown', (e) => {
        const step = e.shiftKey ? 5 : 1;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          updateBoundary(idx, boundaries[idx] - step);
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          updateBoundary(idx, boundaries[idx] + step);
        }
      });
    });

    window.addEventListener(
      'resize',
      this.debounce(() => {
        render();
      }, 150)
    );

    render();

    if (timeframeSelect && timeframeLabel) {
      timeframeLabel.textContent = `${timeframeSelect.value} prosjekt`;
      timeframeSelect.addEventListener('change', () => {
        timeframeLabel.textContent = `${timeframeSelect.value} prosjekt`;
      });
    }
  }

  // NOTE: Sends inquiry form directly to Web3Forms so users do not need a local mail client.
  setupInquiryFormMailto() {
    const inquiryForm = document.querySelector('[data-inquiry-form]');
    if (!inquiryForm) return;
    const submitButton = inquiryForm.querySelector('button[type="submit"]');
    const statusEl = inquiryForm.querySelector('[data-inquiry-status]');
    const web3FormsEndpoint = 'https://api.web3forms.com/submit';
    const emailFormat = /^[^\s@]+@[^\s@]+\.(com|no)$/i;

    const setStatus = (message, state) => {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.dataset.state = state;
    };

    inquiryForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!inquiryForm.reportValidity()) return;

      const formData = new FormData(inquiryForm);
      const fullName = (formData.get('full_name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const description = (formData.get('description') || '').toString().trim();
      const accessKey = (formData.get('access_key') || '').toString().trim();

      if (!fullName || !email || !description) {
        setStatus('Vennligst fyll ut navn, e-post og beskrivelse.', 'error');
        return;
      }
      if (!emailFormat.test(email)) {
        setStatus('Skriv en gyldig e-postadresse som slutter med .com eller .no.', 'error');
        return;
      }
      if (!accessKey || accessKey.startsWith('REPLACE_WITH_')) {
        setStatus('Web3Forms-nokkel mangler. Legg inn access_key i skjemaet først.', 'error');
        return;
      }

      formData.set('full_name', fullName);
      formData.set('email', email);
      formData.set('description', description);
      formData.set('subject', `Ny foresporsel fra ${fullName}`);
      formData.set('replyto', email);
      setStatus('Sender forespørsel ...', 'loading');

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
      }

      try {
        const response = await fetch(web3FormsEndpoint, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Submission failed');
        }
        setStatus('Takk! Forespørselen er sendt. Vi svarer deg snart.', 'success');
        inquiryForm.reset();
      } catch (error) {
        setStatus('Kunne ikke sende skjemaet nå. Prøv igjen om litt.', 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
        }
      }
    });
  }

  // NOTE: Interactive pricing estimator for selecting multiple services and computing a live total.
  setupPricingEstimator() {
    const estimator = document.querySelector('[data-pricing-estimator]');
    if (!estimator) return;

    const cards = Array.from(estimator.querySelectorAll('[data-pricing-item]'));
    const summaryList = estimator.querySelector('[data-pricing-summary-list]');
    const totalEl = estimator.querySelector('[data-pricing-total]');
    if (cards.length === 0 || !summaryList || !totalEl) return;

    const selected = new Set();
    const formatKr = (value) => `${value.toLocaleString('nb-NO')} kr`;
    // NOTE: Each service can define a min-max price range via `data-pricing-min` and `data-pricing-max`.
    const getCardRange = (card) => {
      const minParsed = Number(card.dataset.pricingMin || 0);
      const maxParsed = Number(card.dataset.pricingMax || 0);
      const fallback = Number(card.dataset.pricingPrice || 0);
      if (
        Number.isFinite(minParsed) &&
        Number.isFinite(maxParsed) &&
        minParsed > 0 &&
        maxParsed > 0
      ) {
        return {
          min: Math.min(minParsed, maxParsed),
          max: Math.max(minParsed, maxParsed),
        };
      }
      if (Number.isFinite(fallback) && fallback > 0) {
        return { min: fallback, max: fallback };
      }
      return { min: 0, max: 0 };
    };
    const formatRange = (min, max) => `${formatKr(min)} - ${formatKr(max)}`;
    const getCardName = (card) => card.dataset.pricingItem || '';

    const render = () => {
      const selectedCards = cards.filter((card) => selected.has(getCardName(card)));
      if (selectedCards.length === 0) {
        summaryList.innerHTML =
          '<li class="pricing-estimator__summary-empty">Ingen tjenester valgt enda.</li>';
      } else {
        summaryList.innerHTML = selectedCards
          .map(
            (card) => `
              <li class="pricing-estimator__summary-item">
                <span class="pricing-estimator__summary-name">${getCardName(card)}</span>
                <span class="pricing-estimator__summary-price">${formatRange(getCardRange(card).min, getCardRange(card).max)}</span>
              </li>
            `
          )
          .join('');
      }

      const totals = selectedCards.reduce(
        (acc, card) => {
          const range = getCardRange(card);
          return {
            min: acc.min + range.min,
            max: acc.max + range.max,
          };
        },
        { min: 0, max: 0 }
      );
      totalEl.textContent = formatRange(totals.min, totals.max);
    };

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const item = getCardName(card);
        if (!item) return;
        if (selected.has(item)) {
          selected.delete(item);
          card.classList.remove('is-selected');
          card.setAttribute('aria-pressed', 'false');
        } else {
          selected.add(item);
          card.classList.add('is-selected');
          card.setAttribute('aria-pressed', 'true');
        }
        render();
      });
      card.setAttribute('aria-pressed', 'false');
    });

    render();
  }

  // NOTE: Fixed-price package cards on the pricing page expand inline and send a short package request through Web3Forms.
  setupPricingPackages() {
    const packageForms = Array.from(document.querySelectorAll('[data-pricing-package-form]'));
    if (packageForms.length === 0) return;

    const web3FormsEndpoint = 'https://api.web3forms.com/submit';

    packageForms.forEach((form) => {
      const cta = form.querySelector('[data-pricing-package-cta]');
      const panel = form.querySelector('[data-pricing-package-panel]');
      const emailInput = form.querySelector('[data-pricing-package-email]');
      const textarea = form.querySelector('[data-pricing-package-text]');
      const statusEl = form.querySelector('[data-pricing-package-status]');
      const accessKeyInput = form.querySelector('input[name="access_key"]');
      if (!cta || !panel || !emailInput || !textarea || !statusEl || !accessKeyInput) return;

      const packageTitle = (form.dataset.packageTitle || '').trim();
      const packagePrice = (form.dataset.packagePrice || '').trim();
      let isOpen = true;
      let isSending = false;
      let isSent = false;

      const setStatus = (message, state) => {
        statusEl.textContent = message;
        if (state) {
          statusEl.dataset.state = state;
        } else {
          delete statusEl.dataset.state;
        }
      };

      const render = () => {
        const hasValidEmail = emailInput.value.trim().length > 0 && emailInput.checkValidity();
        const hasText = textarea.value.trim().length > 0;
        const shouldDisable = isSent || !hasValidEmail || !hasText || isSending;

        panel.hidden = !isOpen;
        emailInput.disabled = isSending || isSent;
        textarea.disabled = isSending || isSent;
        cta.disabled = shouldDisable;
        cta.classList.toggle('is-inactive', shouldDisable);
        cta.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        cta.textContent = 'Forespørsel';
      };

      const sendPackageRequest = async () => {
        const email = emailInput.value.trim();
        const description = textarea.value.trim();
        const accessKey = accessKeyInput.value.trim();

        if (!email || !emailInput.checkValidity()) {
          setStatus('Skriv en gyldig e-postadresse først.', 'error');
          render();
          return;
        }

        if (!description) {
          setStatus('Skriv en kort beskrivelse først.', 'error');
          render();
          return;
        }

        if (!accessKey || accessKey.startsWith('REPLACE_WITH_')) {
          setStatus('Web3Forms-nokkel mangler. Legg inn access_key i pakken først.', 'error');
          render();
          return;
        }

        const formData = new FormData(form);
        const fullDescription = [
          `Pakke: ${packageTitle}`,
          packagePrice ? `Pris: ${packagePrice}` : '',
          `Side: ${window.location.href}`,
          '',
          'Beskrivelse:',
          description,
        ]
          .filter(Boolean)
          .join('\n');

        formData.set('subject', `Ny pakkeforesporsel: ${packageTitle}`);
        formData.set('email', email);
        formData.set('package_title', packageTitle);
        if (packagePrice) formData.set('package_price', packagePrice);
        formData.set('description', fullDescription);
        formData.set('replyto', email);

        isSending = true;
        setStatus('Sender forespørsel ...', 'loading');
        render();

        try {
          const response = await fetch(web3FormsEndpoint, {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (!response.ok || !result.success) {
            throw new Error(result.message || 'Submission failed');
          }

          isSending = false;
          isSent = true;
          form.reset();
          setStatus('Takk! Pakkeforespørselen er sendt. Vi svarer deg snart.', 'success');
          render();
        } catch (_error) {
          isSending = false;
          setStatus('Kunne ikke sende pakken nå. Prøv igjen om litt.', 'error');
          render();
        }
      };

      form.addEventListener('submit', (event) => {
        event.preventDefault();
      });

      cta.addEventListener('click', async () => {
        if (isSending || isSent || cta.disabled) return;
        await sendPackageRequest();
      });

      textarea.addEventListener('input', () => {
        if (statusEl.dataset.state !== 'success') {
          setStatus('', '');
        }
        render();
      });

      emailInput.addEventListener('input', () => {
        if (statusEl.dataset.state !== 'success') {
          setStatus('', '');
        }
        render();
      });

      render();
    });
  }

  // NOTE: Rehydrates the single project template from `?project=<slug>` and wires prev/next routing.
  setupProjectDetailPage(catalog) {
    const root = document.querySelector('[data-project-page]');
    if (!root) return;
    if (catalog.length === 0) return;

    const requestedSlug =
      window.FormaaProjectOpenGraph?.resolveCatalogSlug?.() ||
      (() => {
        const params = new URLSearchParams(window.location.search);
        return (params.get('project') || '').trim().toLowerCase();
      })();
    const currentIndex = Math.max(
      0,
      catalog.findIndex((project) => project.slug === requestedSlug)
    );
    const current = catalog[currentIndex];

    window.FormaaProjectOpenGraph?.applyFromProject?.(current);

    const titleEl = root.querySelector('[data-project-title]');
    const leadEl = root.querySelector('[data-project-lead]');
    const breadcrumbCurrentEl = root.querySelector('[data-project-breadcrumb-current]');
    const mainImage = root.querySelector('[data-project-main-image]');
    const thumbsContainer = root.querySelector('[data-project-thumbs]');
    const problemEl = root.querySelector('[data-project-problem]');
    const solutionEl = root.querySelector('[data-project-solution]');
    const outcomeEl = root.querySelector('[data-project-outcome]');
    // NOTE: Prev/next nav sits outside `[data-project-page]`, so query from document scope.
    const prevLink = document.querySelector('[data-project-nav-prev]');
    const nextLink = document.querySelector('[data-project-nav-next]');

    if (titleEl) titleEl.textContent = current.title;
    if (leadEl) leadEl.textContent = current.desc;
    if (breadcrumbCurrentEl) breadcrumbCurrentEl.textContent = current.title;
    document.title = `${current.title} | Industridesign og produktdesign`;

    const detailImages = current.images.length > 0 ? current.images : [catalog[0].images[0]];
    const firstImage = detailImages[0];

    if (mainImage && firstImage) {
      mainImage.src = firstImage;
      mainImage.alt = `${current.title} bilde 1`;
    }

    const narratives = this.getProjectNarratives();
    const fallbackText = `${current.title} ble utviklet med fokus på tydelig problemforståelse, praktisk løsning og et konkret resultat.`;
    const narrative = narratives[current.slug] || {
      problem: fallbackText,
      solution: fallbackText,
      outcome: fallbackText,
    };
    if (problemEl) problemEl.textContent = narrative.problem;
    if (solutionEl) solutionEl.textContent = narrative.solution;
    if (outcomeEl) outcomeEl.textContent = narrative.outcome;

    if (thumbsContainer) {
      thumbsContainer.innerHTML = detailImages
        .map(
          (src, index) => `
          <button
            class="project-template-thumb${index === 0 ? ' is-active' : ''}"
            type="button"
            data-project-thumb
            data-image-src="${src}"
            data-image-alt="${current.title} bilde ${index + 1}"
            aria-label="Vis bilde ${index + 1}"
          >
            <img src="${src}" alt="" aria-hidden="true" />
          </button>
        `
        )
        .join('');
    }

    // NOTE: Paginate thumbnail rail: 4 visible on desktop, 3 visible on mobile.
    this.setupProjectThumbRailPager(root);

    const previousProject = catalog[(currentIndex - 1 + catalog.length) % catalog.length];
    const nextProject = catalog[(currentIndex + 1) % catalog.length];

    if (prevLink && previousProject) {
      prevLink.href = this.getProjectSharePath(previousProject.slug);
      prevLink.setAttribute('aria-label', `Forrige prosjekt: ${previousProject.title}`);
    }
    if (nextLink && nextProject) {
      nextLink.href = this.getProjectSharePath(nextProject.slug);
      nextLink.setAttribute('aria-label', `Neste prosjekt: ${nextProject.title}`);
    }

    const likeShareStrip = root.querySelector('[data-project-like-share] [data-like-share-strip]');
    initializeLikeShareStrip(likeShareStrip, {
      storageKey: `formaa-like-count:project:${current.slug}`,
      sessionKey: `formaa-like-session:project:${current.slug}`,
      likeLabel: `Lik prosjektet ${current.title}`,
      shareLabel: `Del prosjektet ${current.title}`,
      shareTitle: current.title,
      shareUrl: new URL(this.getProjectSharePath(current.slug), window.location.href).href,
      alreadyLikedMessage: 'Du har allerede likt dette prosjektet i denne økten.',
    });
  }

  // NOTE: Thumbnail pager controls for project gallery rail (desktop up/down, mobile left/right).
  setupProjectThumbRailPager(root) {
    const thumbsContainer = root.querySelector('[data-project-thumbs]');
    const prevBtn = root.querySelector('[data-project-thumbs-prev]');
    const nextBtn = root.querySelector('[data-project-thumbs-next]');
    if (!thumbsContainer || !prevBtn || !nextBtn) return;

    const thumbs = Array.from(thumbsContainer.querySelectorAll('[data-project-thumb]'));
    if (thumbs.length === 0) return;

    const getPageSize = () => (window.innerWidth < 768 ? 3 : 4);
    let currentPage = 0;

    const getMaxPage = () => {
      const pageSize = getPageSize();
      return Math.max(0, Math.ceil(thumbs.length / pageSize) - 1);
    };

    const renderPager = () => {
      const pageSize = getPageSize();
      const maxPage = getMaxPage();
      if (currentPage > maxPage) currentPage = maxPage;
      const start = currentPage * pageSize;
      const end = start + pageSize;

      thumbs.forEach((thumb, index) => {
        thumb.style.display = index >= start && index < end ? '' : 'none';
      });

      const shouldDisablePrev = currentPage === 0;
      const shouldDisableNext = currentPage >= maxPage;
      prevBtn.classList.toggle('is-disabled', shouldDisablePrev);
      nextBtn.classList.toggle('is-disabled', shouldDisableNext);
      prevBtn.disabled = shouldDisablePrev;
      nextBtn.disabled = shouldDisableNext;
    };

    prevBtn.addEventListener('click', () => {
      if (currentPage === 0) return;
      currentPage -= 1;
      renderPager();
    });

    nextBtn.addEventListener('click', () => {
      const maxPage = getMaxPage();
      if (currentPage >= maxPage) return;
      currentPage += 1;
      renderPager();
    });

    window.addEventListener(
      'resize',
      this.debounce(() => {
        renderPager();
      }, 120)
    );

    renderPager();
  }

  // NOTE: Projects grid hydration; optional data-projects-limit caps tiles (homepage only).
  setupProjectsGrid(catalog) {
    const grid = document.querySelector('[data-projects-grid]');
    const sentinel = document.querySelector('[data-projects-sentinel]');
    if (!grid || !sentinel) return;
    if (catalog.length === 0) return;

    const limitAttr = grid.getAttribute('data-projects-limit');
    const limit = limitAttr ? Math.max(0, parseInt(limitAttr, 10) || 0) : catalog.length;
    const visibleCatalog = limit > 0 ? catalog.slice(0, limit) : catalog;

    const fragment = document.createDocumentFragment();
    visibleCatalog.forEach((project, index) => {
      // NOTE: Project card image is explicitly configured via `thumbnail` in project-folders.json.
      const imgSrc = project.thumbnail || project.images[0] || '';
      const card = document.createElement('a');
      card.className = 'project-tile';
      card.href = this.getProjectSharePath(project.slug);
      card.setAttribute('aria-label', `Se ${project.title}`);
      card.innerHTML = `
        <div class="project-thumb" aria-hidden="true">
          <img class="project-thumb__img" src="${imgSrc}" alt="${project.title}" loading="lazy" />
        </div>
        <div class="project-meta">
          <h3 class="project-title">${project.title}</h3>
        </div>
      `;
      fragment.appendChild(card);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);
    sentinel.style.display = 'none';
  }

  // NOTE: Stable per-project page URL used for both navigation and social sharing previews.
  getProjectSharePath(slug) {
    const prosjekterPathBySlug = {
      obseed: 'obseed-custom-8-string-guitar',
      undo: 'undo-desertification',
      h2o: 'h2o-bottle-pedometer',
      monocopter: 'monocopter-drone',
      proton: 'proton-headphones',
      'eco-mate-closet': 'eco-mate-closet',
      nomos: 'nomos-branding',
      nordic: 'nordic-restaurant-branding',
      rafaels: 'rafaels-ren-melk',
    };
    const prosjekterPath = prosjekterPathBySlug[slug];
    if (prosjekterPath) return `/prosjekter/${prosjekterPath}`;
    return `/prosjekter?project=${encodeURIComponent(slug)}`;
  }

  // NOTE: Reusable project galleries swap main image from local thumbnail rails.
  setupProjectTemplateGalleries() {
    const galleries = Array.from(document.querySelectorAll('[data-project-gallery]'));
    if (galleries.length === 0) return;

    galleries.forEach((gallery) => {
      const mainImage = gallery.querySelector('[data-project-main-image]');
      const thumbs = Array.from(gallery.querySelectorAll('[data-project-thumb]'));
      if (!mainImage || thumbs.length === 0) return;

      function setActiveThumb(activeThumb) {
        thumbs.forEach((thumb) => {
          const isActive = thumb === activeThumb;
          thumb.classList.toggle('is-active', isActive);
          thumb.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      }

      thumbs.forEach((thumb, index) => {
        if (!thumb.hasAttribute('aria-pressed')) {
          thumb.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
        }

        thumb.addEventListener('click', () => {
          const nextSrc = thumb.dataset.imageSrc;
          const nextAlt = thumb.dataset.imageAlt || 'Prosjektbilde';
          if (!nextSrc) return;
          mainImage.src = nextSrc;
          mainImage.alt = nextAlt;
          setActiveThumb(thumb);
        });
      });
    });
  }

  // NOTE: On hero template, pin prev/next to 90% down the hero image (viewport px); other pages use CSS `90%`.
  setupProjectPageNavVerticalAlign() {
    const stage = document.querySelector('.project-hero-stage');
    const projectNav = document.querySelector('.project-page-nav');
    if (!stage || !projectNav) {
      document.documentElement.style.removeProperty('--project-page-nav-anchor-y');
      return;
    }

    const sync = () => {
      if (window.innerWidth < 1024) {
        document.documentElement.style.removeProperty('--project-page-nav-anchor-y');
        return;
      }
      const r = stage.getBoundingClientRect();
      const y = r.top + r.height * 0.9;
      document.documentElement.style.setProperty('--project-page-nav-anchor-y', `${y}px`);
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', this.debounce(sync, 100));
  }

  // NOTE: Utility function for debouncing high-frequency events.
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// NOTE: Hash links to `#application-form` can resolve before component injection; re-scroll once that fragment exists.
function scrollToApplicationFormHashIfPresent() {
  if (window.location.hash !== '#application-form') return;
  const scrollToTarget = () => {
    const target = document.getElementById('application-form');
    if (!target) return;
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
  };
  scrollToTarget();
  requestAnimationFrame(() => {
    requestAnimationFrame(scrollToTarget);
  });
}

// NOTE: Open FAQ disclosure and scroll when URL hash is `#faq` (e.g. from privacy block link).
function openFaqDisclosureFromHashIfPresent() {
  if (window.location.hash !== '#faq') return;
  const scrollToFaq = () => {
    const disclosure = document.querySelector('[data-section-disclosure="faq"]');
    if (disclosure) disclosure.open = true;
    const target = document.getElementById('faq');
    if (!target) return;
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
  };
  scrollToFaq();
  requestAnimationFrame(() => {
    requestAnimationFrame(scrollToFaq);
  });
}

function initializeSectionDisclosures() {
  openFaqDisclosureFromHashIfPresent();
  window.addEventListener('hashchange', openFaqDisclosureFromHashIfPresent);
}

// NOTE: Initialize page behaviors when DOM is ready.
function initializePortfolioApp() {
  if (window.singlePagePortfolio) return;
  window.singlePagePortfolio = new SinglePagePortfolio();
  scrollToApplicationFormHashIfPresent();
  initializeSectionDisclosures();
}

document.addEventListener('components:ready', initializePortfolioApp, { once: true });

document.addEventListener('DOMContentLoaded', () => {
  // NOTE: If no dynamic components are present, initialize immediately on DOM ready.
  if (!document.querySelector('[data-component]')) initializePortfolioApp();
});
