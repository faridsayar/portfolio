/**
 * Single Page Portfolio JavaScript
 * Focused behavior: timeline + project grid hydration.
 */

class SinglePagePortfolio {
  constructor() {
    this.setupMobileSideNavToggle();
    this.setupHeroVideoShuffle();
    this.setupTimeline();
    this.setupProjectsGrid();
    this.setupProjectTemplateGalleries();
    this.setupProjectPageNavVerticalAlign();
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
      { src: 'assets/images/shuffle-images/me-drawing.mp4', key: 'me-drawing' },
      { src: 'assets/images/shuffle-images/3d-printer-working.mp4', key: '3d-printer-working' },
    ];

    let currentClipIndex = 0;
    let shuffleTimer = null;
    let isShuffling = false;

    const clipDurationByKey = {
      'me-drawing': 3000,
      '3d-printer-working': 2000,
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

  // NOTE: Projects grid hydration to 20 items.
  setupProjectsGrid() {
    const grid = document.querySelector('[data-projects-grid]');
    const sentinel = document.querySelector('[data-projects-sentinel]');
    if (!grid || !sentinel) return;

    const baseCards = Array.from(grid.querySelectorAll('.project-tile'));
    if (baseCards.length === 0) return;

    const source = baseCards.map((card, index) => {
      const img = card.querySelector('.project-thumb__img');
      const title = card.querySelector('.project-title');
      const desc = card.querySelector('.project-desc');
      return {
        href: card.getAttribute('href') || 'prosjekter.html',
        imgSrc: img?.getAttribute('src') || '',
        imgAlt: img?.getAttribute('alt') || '',
        title: title?.textContent?.trim() || `Prosjekt ${index + 1}`,
        desc: desc?.textContent?.trim() || 'Prosjektbeskrivelse',
      };
    });

    // NOTE: Use all currently provided local project images before falling back to placeholders.
    const providedImagePool = [
      'assets/images/USV.png',
      'assets/images/H2O.jpg',
      'assets/images/itac.jpg',
      'assets/images/Proton.png',
      'assets/images/Drone2.jpeg',
      'assets/images/Memorium.jpg',
      'assets/images/Bike.jpg',
      'assets/images/Closet-anim.gif',
      'assets/images/Kalash.jpg',
      'assets/images/serviett.jpg',
      'assets/images/ak-background-image.jpg',
    ];

    // NOTE: Keep this limited while the portfolio content is in progress.
    const maxItems = 12;
    let nextIndex = baseCards.length;

    function createCard(item, visualIndex, usePlaceholder = false) {
      const card = document.createElement('a');
      card.className = 'project-tile';
      card.href = item.href;
      card.setAttribute('aria-label', `Se prosjekt ${visualIndex + 1}`);
      if (usePlaceholder) {
        card.innerHTML = `
          <div class="project-thumb project-thumb--placeholder" aria-hidden="true"></div>
          <div class="project-meta">
            <h3 class="project-title">${item.title}</h3>
            <p class="project-desc">${item.desc}</p>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="project-thumb" aria-hidden="true">
            <img class="project-thumb__img" src="${item.imgSrc}" alt="${item.imgAlt}" loading="lazy" />
          </div>
          <div class="project-meta">
            <h3 class="project-title">${item.title}</h3>
            <p class="project-desc">${item.desc}</p>
          </div>
        `;
      }
      return card;
    }

    function titleFromPath(path, fallbackIndex) {
      const file = path.split('/').pop() || '';
      const withoutExt = file.replace(/\.[^.]+$/, '');
      const normalized = withoutExt.replace(/[-_]+/g, ' ').trim();
      if (!normalized) return `Prosjekt ${fallbackIndex + 1}`;
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    }

    // Render all project cards up to maxItems immediately.
    const fragment = document.createDocumentFragment();
    const usedSources = new Set(source.map((item) => item.imgSrc));
    const additionalRealImages = providedImagePool.filter((src) => !usedSources.has(src));

    // First append all available real images from the provided pool.
    for (const imgSrc of additionalRealImages) {
      if (nextIndex >= maxItems) break;
      const seed = source[nextIndex % source.length];
      fragment.appendChild(
        createCard(
          {
            ...seed,
            imgSrc,
            title: titleFromPath(imgSrc, nextIndex),
          },
          nextIndex,
          false
        )
      );
      nextIndex += 1;
    }

    // Fill remaining slots with neutral placeholders.
    while (nextIndex < maxItems) {
      const item = source[nextIndex % source.length];
      fragment.appendChild(createCard(item, nextIndex, true));
      nextIndex += 1;
    }
    grid.appendChild(fragment);

    // Keep sentinel hidden/unused when all items are pre-rendered.
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
