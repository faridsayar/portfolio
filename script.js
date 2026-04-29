/**
 * Single Page Portfolio JavaScript
 * Focused behavior: timeline + project grid hydration.
 */

class SinglePagePortfolio {
  constructor() {
    this.projectCatalogPromise = null;
    this.gridMediaCatalog = null;
    this.setupHeroVideoShuffle();
    this.setupCategoryHeroVideoShuffle();
    this.setupGlobalImageFallback();
    this.setupTimeline();
    this.setupInquiryFormMailto();
    this.setupPricingEstimator();
    this.setupProjectPageNavVerticalAlign();
    this.initializeProjectViews();
    this.initializeGridIdeasViews();
  }

  // NOTE: Per-project narrative copy for Problem / Løsning / Resultat block on project pages.
  getProjectNarratives() {
    return {
      undo: {
        problem:
          'Ørkener er ikke statiske, de vokser raskt ut sprer seg. Hvordan kan vi stoppe dem?',
        solution:
          'Prosjektet utviklet et produktkonsept som styrer luft- og fuktflyt nær roten for å støtte plantevekst i tørre miljøer.',
        outcome:
          'Løsningen gir et tydelig grunnlag for videre prototypeutvikling og visualiserte en skalerbar retning for desertifisering.',
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
          'Designet fokuserte på en modulær VTOL-droneplattform med effektiv områdedekning, som kombinerer enkel vertikal løfteevne med en mer aerodynamisk form for lengre turer.',
        outcome:
          'Prosjektet resulterte i et beslutningsklart konsept med visualiseringer som støtter videre utvikling og validering.',
      },
      proton: {
        problem:
          'Markedet for hodetelefoner er mettet, og det er en mangel på robust design uten at det ser teit ut.',
        solution:
          'Vi utviklet et urbant designuttrykk med robust form, klare linjer og detaljering som støtter både komfort og merkevareprofil.',
        outcome:
          'Resultatet ble et helhetlig konsept som styrker produktets posisjonering og gir et tydelig grunnlag for prototypefase.',
      },
      'eco-mate-closet': {
        problem:
          'Kildesortering hjemme oppleves ofte rotete og lite integrert i interiøret, noe som reduserer faktisk bruk.',
        solution:
          'Prosjektet utformet et minimalistisk sorteringsskap med tydelig struktur, enkel tilgang og minimalistisk utseende som passer designmæssigt til fleste rom.',
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
      // NOTE: Sykkel/Bike is intentionally disabled in frontend views without removing source data.
      const enabledProjects = validProjects.filter((project) => project.slug !== 'bike');
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

  loadGridMediaCatalog() {
    if (this.gridMediaCatalog) return this.gridMediaCatalog;
    const fromGlobal = Array.isArray(window.__GRID_MEDIA_MANIFEST?.items)
      ? window.__GRID_MEDIA_MANIFEST.items
      : [];
    const normalizedItems = fromGlobal
      .filter((item) => item && typeof item.src === 'string')
      .filter((item) => !item.src.toLowerCase().endsWith('.gif'))
      .map((item) => {
        const src = String(item.src);
        const normalizedType = String(item.type || '').toLowerCase();
        const isVideo = normalizedType === 'video' || /\.(mp4|mov|webm)$/i.test(src);
        return {
          src,
          type: isVideo ? 'video' : 'image',
          alt: item.name ? `Grid media: ${item.name}` : 'Grid media',
        };
      });

    const videos = normalizedItems.filter((item) => item.type === 'video');
    const images = normalizedItems.filter((item) => item.type === 'image');
    const alternatingItems = [];
    const maxLen = Math.max(videos.length, images.length);

    for (let i = 0; i < maxLen; i += 1) {
      if (videos[i]) alternatingItems.push(videos[i]);
      if (images[i]) alternatingItems.push(images[i]);
    }

    this.gridMediaCatalog = alternatingItems;
    return this.gridMediaCatalog;
  }

  createGridMediaElement(item, className) {
    if (item.type === 'video') {
      const video = document.createElement('video');
      video.className = className;
      video.src = item.src;
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', item.alt);
      return video;
    }
    const img = document.createElement('img');
    img.className = className;
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    return img;
  }

  initializeGridIdeasViews() {
    const mediaItems = this.loadGridMediaCatalog();
    this.setupIdeasStrip(mediaItems);
    this.setupGalleryPage(mediaItems);
  }

  setupIdeasStrip(mediaItems) {
    const strip = document.querySelector('[data-ideas-strip]');
    if (!strip) return;
    if (!Array.isArray(mediaItems) || mediaItems.length === 0) return;

    const fragment = document.createDocumentFragment();
    mediaItems.forEach((item) => {
      const cell = document.createElement('div');
      cell.className = 'ideas-strip__item';
      cell.appendChild(this.createGridMediaElement(item, 'ideas-strip__media'));
      fragment.appendChild(cell);
    });

    strip.innerHTML = '';
    strip.appendChild(fragment);
  }

  setupGalleryPage(mediaItems) {
    const page = document.querySelector('[data-gallery-page]');
    const grid = document.querySelector('[data-gallery-grid]');
    if (!page || !grid) return;
    if (!Array.isArray(mediaItems) || mediaItems.length === 0) return;

    const lightbox = document.querySelector('[data-gallery-lightbox]');
    const lightboxMedia = document.querySelector('[data-gallery-lightbox-media]');
    const closeBtn = document.querySelector('[data-gallery-close]');
    const prevBtn = document.querySelector('[data-gallery-prev]');
    const nextBtn = document.querySelector('[data-gallery-next]');
    if (!lightbox || !lightboxMedia || !closeBtn || !prevBtn || !nextBtn) return;

    let activeIndex = 0;

    const renderLightboxMedia = () => {
      const item = mediaItems[activeIndex];
      if (!item) return;
      lightboxMedia.innerHTML = '';
      lightboxMedia.appendChild(this.createGridMediaElement(item, 'gallery-lightbox__asset'));
    };

    const openLightbox = (index) => {
      activeIndex = index;
      renderLightboxMedia();
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxMedia.innerHTML = '';
    };

    const showPrev = () => {
      activeIndex = (activeIndex - 1 + mediaItems.length) % mediaItems.length;
      renderLightboxMedia();
    };

    const showNext = () => {
      activeIndex = (activeIndex + 1) % mediaItems.length;
      renderLightboxMedia();
    };

    const fragment = document.createDocumentFragment();
    mediaItems.forEach((item, index) => {
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'gallery-grid__item';
      trigger.setAttribute('aria-label', `Åpne media ${index + 1}`);
      trigger.appendChild(this.createGridMediaElement(item, 'gallery-grid__media'));
      trigger.addEventListener('click', () => openLightbox(index));
      fragment.appendChild(trigger);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
    });
  }

  // NOTE: Interactive timeline (process prioritization)
  setupHeroVideoShuffle() {
    const heroVideo = document.querySelector('[data-hero-video-shuffle]');
    if (!heroVideo) return;
    const skipHeavyHeroVideo =
      window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // NOTE: Keep a lightweight static hero on mobile/reduced-motion to improve first-load performance.
    if (skipHeavyHeroVideo) {
      heroVideo.pause();
      heroVideo.removeAttribute('src');
      heroVideo.load();
      return;
    }

    // NOTE: Hero background clip list from `assets/images/shuffle-images/`, shuffled in a fixed cadence.
    const clipSources = [
      { src: 'assets/images/shuffle-images/proton-gif.mov', key: 'proton-gif' },
      { src: 'assets/images/shuffle-images/proton-gif2.mov', key: 'proton-gif2' },
      { src: 'assets/images/shuffle-images/me-drawing.mp4', key: 'me-drawing' },
      { src: 'assets/images/shuffle-images/process.mp4', key: 'process' },
      { src: 'assets/images/shuffle-images/wall-sketches.mp4', key: 'wall-sketches' },
      { src: 'assets/images/shuffle-images/3d-printer-working.mp4', key: '3d-printer-working' },
      { src: 'assets/images/shuffle-images/test-animation.mp4', key: 'test-animation' },
      { src: 'assets/images/shuffle-images/validating.mp4', key: 'validating' },
    ];

    let currentClipIndex = 0;
    let shuffleTimer = null;
    let isShuffling = false;
    const useIntrinsicDurationKeys = new Set(['process', 'wall-sketches', 'validating']);

    const clipDurationByKey = {
      'me-drawing': 1800,
      process: 2000,
      'wall-sketches': 3000,
      '3d-printer-working': 2000,
      'test-animation': 3000,
      validating: 3000,
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
    const skipHeavyCategoryVideo =
      window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // NOTE: Disable decorative category hero video on mobile/reduced-motion to cut transfer and CPU usage.
    if (skipHeavyCategoryVideo) {
      categoryVideo.pause();
      categoryVideo.removeAttribute('src');
      categoryVideo.load();
      return;
    }

    const clipSources = [
      { src: '../../assets/images/shuffle-images/proton-gif.mov', key: 'proton-gif' },
      { src: '../../assets/images/shuffle-images/proton-gif2.mov', key: 'proton-gif2' },
    ];

    let currentClipIndex = 0;
    let shuffleTimer = null;
    let isShuffling = false;

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

    const scheduleNextClip = () => {
      clearShuffleTimer();
      if (!isShuffling) return;
      shuffleTimer = window.setTimeout(() => {
        currentClipIndex = (currentClipIndex + 1) % clipSources.length;
        setClip(currentClipIndex);
        scheduleNextClip();
      }, 2000);
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

  // NOTE: Rehydrates the single project template from `?project=<slug>` and wires prev/next routing.
  setupProjectDetailPage(catalog) {
    const root = document.querySelector('[data-project-page]');
    if (!root) return;
    if (catalog.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const querySlug = (params.get('project') || '').trim().toLowerCase();
    const pathName = window.location.pathname.split('/').pop() || '';
    const pathMatch = pathName.match(/^prosjekt-(.+)\.html$/);
    const pathSlug = pathMatch ? String(pathMatch[1]).trim().toLowerCase() : '';
    const requestedSlug = querySlug || pathSlug;
    const currentIndex = Math.max(
      0,
      catalog.findIndex((project) => project.slug === requestedSlug)
    );
    const current = catalog[currentIndex];

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

  // NOTE: Projects grid hydration to 20 items.
  setupProjectsGrid(catalog) {
    const grid = document.querySelector('[data-projects-grid]');
    const sentinel = document.querySelector('[data-projects-sentinel]');
    if (!grid || !sentinel) return;
    if (catalog.length === 0) return;

    const fragment = document.createDocumentFragment();
    catalog.forEach((project, index) => {
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
    const slugToSeoPath = {
      undo: 'prosjekt-undo-desertification.html',
      nomos: 'prosjekt-nomos-branding.html',
      proton: 'prosjekt-proton-headphones.html',
      nordic: 'prosjekt-nordic-restaurant-branding.html',
      monocopter: 'prosjekt-monocopter-drone.html',
      rafaels: 'prosjekt-rafaels-ren-melk.html',
      'eco-mate-closet': 'prosjekt-eco-mate-closet.html',
      h2o: 'prosjekt-h2o-bottle-pedometer.html',
    };
    return slugToSeoPath[slug] || `prosjekt-${encodeURIComponent(slug)}.html`;
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

// NOTE: Initialize page behaviors when DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  window.singlePagePortfolio = new SinglePagePortfolio();
});
