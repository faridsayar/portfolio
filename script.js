/**
 * Single Page Portfolio JavaScript
 * Focused behavior: timeline + project grid hydration.
 */

class SinglePagePortfolio {
  constructor() {
    this.projectCatalogPromise = null;
    this.setupMobileSideNavToggle();
    this.setupHeroVideoShuffle();
    this.setupTimeline();
    this.setupProjectPageNavVerticalAlign();
    this.initializeProjectViews();
  }

  // NOTE: Load generated folder manifest so project image lists stay automatic.
  async loadProjectCatalog() {
    if (this.projectCatalogPromise) return this.projectCatalogPromise;
    const normalizeProjects = (manifest) => {
      const projects = Array.isArray(manifest?.projects) ? manifest.projects : [];
      return projects.filter(
        (project) =>
          project &&
          typeof project.slug === 'string' &&
          typeof project.title === 'string' &&
          Array.isArray(project.images)
      );
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

  // NOTE: Mobile-only side navigation collapse/expand interaction.
  setupMobileSideNavToggle() {
    const nav = document.querySelector('[data-mobile-nav]');
    const toggle = document.querySelector('[data-mobile-nav-toggle]');
    if (!nav || !toggle) return;

    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Utvid meny');
    };

    const openMenu = () => {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Lukk meny');
    };

    toggle.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    // NOTE: Ensure menu is not left open when moving back to desktop layout.
    window.addEventListener(
      'resize',
      this.debounce(() => {
        if (window.innerWidth > 768) closeMenu();
      }, 120)
    );
  }

  // NOTE: Interactive timeline (process prioritization)
  setupHeroVideoShuffle() {
    const heroVideo = document.querySelector('[data-hero-video-shuffle]');
    if (!heroVideo) return;

    // NOTE: Hero background clip list from `assets/images/shuffle-images/`, shuffled in a fixed 2-second cadence.
    const clipSources = [
      { src: 'assets/images/shuffle-images/test-animation.mp4', key: 'test-animation' },
      { src: 'assets/images/shuffle-images/3d-printer-working.mp4', key: '3d-printer-working' },
      { src: 'assets/images/shuffle-images/proton-gif.mov', key: 'proton-gif' },
      { src: 'assets/images/shuffle-images/proton-gif2.mov', key: 'proton-gif2' },
      { src: 'assets/images/shuffle-images/me-drawing.mp4', key: 'me-drawing' },
    ];

    let currentClipIndex = 0;
    let shuffleTimer = null;
    let isShuffling = false;

    const clipDurationByKey = {
      'me-drawing': 1800,
      '3d-printer-working': 2000,
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
      if (clip.key === 'test-animation') {
        // NOTE: Let test-animation run for its full intrinsic duration when metadata is available.
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

    // NOTE: If metadata for test-animation arrives after initial load, reschedule to honor full duration.
    heroVideo.addEventListener('loadedmetadata', () => {
      if (!isShuffling) return;
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

    function pctFromPointer(clientX) {
      const rect = track.getBoundingClientRect();
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

      segments.forEach((seg, i) => {
        seg.style.width = `${percs[i]}%`;
      });

      handles.forEach((handle, i) => {
        handle.style.left = `${boundaries[i]}%`;
        setHandleAria(handle, i);
      });

      handleLabels.forEach((labelEl, i) => {
        labelEl.style.left = `${boundaries[i]}%`;
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
        updateBoundary(idx, pctFromPointer(e.clientX));
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
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          updateBoundary(idx, boundaries[idx] - step);
        }
        if (e.key === 'ArrowRight') {
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

  // NOTE: Rehydrates the single project template from `?project=<slug>` and wires prev/next routing.
  setupProjectDetailPage(catalog) {
    const root = document.querySelector('[data-project-page]');
    if (!root) return;
    if (catalog.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const requestedSlug = (params.get('project') || '').trim().toLowerCase();
    const currentIndex = Math.max(
      0,
      catalog.findIndex((project) => project.slug === requestedSlug)
    );
    const current = catalog[currentIndex];

    const titleEl = root.querySelector('[data-project-title]');
    const leadEl = root.querySelector('[data-project-lead]');
    const breadcrumbCurrentEl = root.querySelector('[data-project-breadcrumb-current]');
    const mainImage = root.querySelector('[data-project-main-image]');
    const captionEl = root.querySelector('[data-project-image-caption]');
    const thumbsContainer = root.querySelector('[data-project-thumbs]');
    // NOTE: Prev/next nav sits outside `[data-project-page]`, so query from document scope.
    const prevLink = document.querySelector('[data-project-nav-prev]');
    const nextLink = document.querySelector('[data-project-nav-next]');

    if (titleEl) titleEl.textContent = current.title;
    if (leadEl) leadEl.textContent = current.lead;
    if (breadcrumbCurrentEl) breadcrumbCurrentEl.textContent = current.title;
    document.title = `${current.title} | Industridesign og produktdesign`;

    const detailImages = current.images.length > 0 ? current.images : [catalog[0].images[0]];
    const firstImage = detailImages[0];

    if (mainImage && firstImage) {
      mainImage.src = firstImage;
      mainImage.alt = `${current.title} bilde 1`;
    }
    if (captionEl) captionEl.textContent = `Prosjektoversikt: ${current.title}.`;

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
            data-image-caption="${current.title} - bilde ${index + 1}."
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
      prevLink.href = `advanced-project.html?project=${encodeURIComponent(previousProject.slug)}`;
      prevLink.setAttribute('aria-label', `Forrige prosjekt: ${previousProject.title}`);
    }
    if (nextLink && nextProject) {
      nextLink.href = `advanced-project.html?project=${encodeURIComponent(nextProject.slug)}`;
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
      card.href = `advanced-project.html?project=${encodeURIComponent(project.slug)}`;
      card.setAttribute('aria-label', `Se ${project.title}`);
      card.innerHTML = `
        <div class="project-thumb" aria-hidden="true">
          <img class="project-thumb__img" src="${imgSrc}" alt="${project.title}" loading="lazy" />
        </div>
        <div class="project-meta">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.desc || `Prosjekt ${index + 1}`}</p>
        </div>
      `;
      fragment.appendChild(card);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);
    sentinel.style.display = 'none';
  }

  // NOTE: Reusable project galleries swap main image from local thumbnail rails; optional data-image-caption updates [data-project-image-caption] in the same gallery.
  setupProjectTemplateGalleries() {
    const galleries = Array.from(document.querySelectorAll('[data-project-gallery]'));
    if (galleries.length === 0) return;

    galleries.forEach((gallery) => {
      const mainImage = gallery.querySelector('[data-project-main-image]');
      const thumbs = Array.from(gallery.querySelectorAll('[data-project-thumb]'));
      const captionEl = gallery.querySelector('[data-project-image-caption]');
      if (!mainImage || thumbs.length === 0) return;

      function setActiveThumb(activeThumb) {
        thumbs.forEach((thumb) => {
          const isActive = thumb === activeThumb;
          thumb.classList.toggle('is-active', isActive);
          thumb.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      }

      function applyCaptionFromThumb(thumb) {
        if (!captionEl || thumb.dataset.imageCaption === undefined) return;
        captionEl.textContent = thumb.dataset.imageCaption;
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
          applyCaptionFromThumb(thumb);
        });
      });

      const initialThumb = thumbs.find((t) => t.classList.contains('is-active')) || thumbs[0];
      applyCaptionFromThumb(initialThumb);
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
