// NOTE: Homepage scroll-scrub hero — maps page scroll to Hero-Drill frame sequence (assembled → exploded).
(function initHomeHeroScrub() {
  const SCRUB_ROOT_SELECTOR = '[data-home-hero-scrub]';
  const FRAME_CANVAS_SELECTOR = '[data-home-hero-scrub-canvas]';
  const STAGE_SELECTOR = '.home-hero-scrub__stage';
  const SCRUB_END_SELECTOR = '#start .about-stats';
  const FRAME_SCALE_DESKTOP = 1.5;
  const FRAME_SCALE_MOBILE = FRAME_SCALE_DESKTOP * 0.75;
  const MOBILE_MQ = window.matchMedia('(max-width: 767px)');

  // NOTE: Frame range from assets/images/Hero-Drill/ — update when final sequence is exported.
  const FRAME_START = 107;
  const FRAME_END = 160;
  const FRAME_BASE_PATH = 'assets/images/Hero-Drill/';
  // NOTE: Layout size for cover-fit math — matches 2K sequence frames so 4K frame 0107 scales without a jump to 0108+.
  const FRAME_LAYOUT_WIDTH = 1920;
  const FRAME_LAYOUT_HEIGHT = 1080;
  const MIN_SCRUB_VIEWPORTS = 0.22;

  const root = document.querySelector(SCRUB_ROOT_SELECTOR);
  const stage = root?.querySelector(STAGE_SELECTOR);
  const canvas = root?.querySelector(FRAME_CANVAS_SELECTOR);
  if (!root || !stage || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const frameCount = FRAME_END - FRAME_START + 1;
  const framePaths = Array.from({ length: frameCount }, (_, index) => {
    const frameNumber = String(FRAME_START + index).padStart(4, '0');
    return `${FRAME_BASE_PATH}${frameNumber}.webp`;
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveDataOn = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  const shouldUseStaticFrame = prefersReducedMotion || saveDataOn;

  /** @type {(HTMLImageElement | null)[]} */
  const frameImages = new Array(frameCount).fill(null);
  let framesReady = false;
  let activeFrameIndex = -1;
  let scrubStartY = 0;
  let scrubDistance = 1;
  let tickScheduled = false;
  let stageWidth = 0;
  let stageHeight = 0;

  function clampFrameIndex(index) {
    return Math.max(0, Math.min(frameCount - 1, index));
  }

  function getFrameScale() {
    return MOBILE_MQ.matches ? FRAME_SCALE_MOBILE : FRAME_SCALE_DESKTOP;
  }

  function loadFrameImage(index) {
    const existing = frameImages[index];
    if (existing?.complete && existing.naturalWidth > 0) {
      return Promise.resolve(existing);
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        frameImages[index] = image;
        resolve(image);
      };
      image.onerror = () => reject(new Error(`Failed to load frame ${index}`));
      image.src = framePaths[index];
    });
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;

    stageWidth = width;
    stageHeight = height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  // NOTE: Match CSS object-fit: cover + scale + object-position: center top — drawn on canvas to avoid img src flicker.
  // Uses fixed layout dimensions so mixed resolutions (4K 0107 + 2K rest) share identical on-screen scale and crop.
  function paintFrame(index) {
    const frameIndex = clampFrameIndex(index);
    const image = frameImages[frameIndex];
    if (!image?.naturalWidth || !stageWidth || !stageHeight) return;
    if (frameIndex === activeFrameIndex) return;

    const coverScale = Math.max(stageWidth / FRAME_LAYOUT_WIDTH, stageHeight / FRAME_LAYOUT_HEIGHT);
    const drawScale = coverScale * getFrameScale();
    const drawWidth = FRAME_LAYOUT_WIDTH * drawScale;
    const drawHeight = FRAME_LAYOUT_HEIGHT * drawScale;
    const drawX = (stageWidth - drawWidth) / 2;
    const drawY = 0;

    ctx.clearRect(0, 0, stageWidth, stageHeight);
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    activeFrameIndex = frameIndex;
  }

  function repaintCurrentFrame() {
    const previousIndex = activeFrameIndex;
    activeFrameIndex = -1;
    paintFrame(previousIndex >= 0 ? previousIndex : 0);
  }

  async function preloadFrames() {
    await loadFrameImage(0);
    framesReady = true;
    paintFrame(0);

    if (shouldUseStaticFrame) return;

    await Promise.all(
      framePaths.map((_, index) => {
        if (index === 0) return Promise.resolve(null);
        return loadFrameImage(index).catch(() => null);
      })
    );
  }

  function measureScrubRange() {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    scrubStartY = root.getBoundingClientRect().top + window.scrollY;

    const scrubEndEl = root.querySelector(SCRUB_END_SELECTOR);
    if (scrubEndEl) {
      const scrubEndTop = scrubEndEl.getBoundingClientRect().top + window.scrollY;
      const scrubEndOffsetInScrub = scrubEndTop - scrubStartY;
      // NOTE: Finish sequence when about-stats reaches the bottom of the viewport.
      const scrollWhenNewsAppear = scrubEndOffsetInScrub - viewportHeight;
      const leadPx = Math.min(100, viewportHeight * 0.1);
      scrubDistance = Math.max(scrollWhenNewsAppear - leadPx, viewportHeight * MIN_SCRUB_VIEWPORTS);
    } else {
      scrubDistance = viewportHeight * 0.42;
    }
  }

  function getScrubProgress() {
    const scrolled = window.scrollY - scrubStartY;
    return Math.min(1, Math.max(0, scrolled / scrubDistance));
  }

  function updateScrubFrame() {
    if (!framesReady) return;

    const progress = getScrubProgress();
    const frameIndex = Math.round(progress * (frameCount - 1));
    paintFrame(frameIndex);
  }

  function scheduleScrubUpdate() {
    if (tickScheduled) return;
    tickScheduled = true;
    window.requestAnimationFrame(() => {
      tickScheduled = false;
      updateScrubFrame();
    });
  }

  function handleResize() {
    resizeCanvas();
    measureScrubRange();
    repaintCurrentFrame();
    scheduleScrubUpdate();
  }

  function bindScrubListeners() {
    window.addEventListener('scroll', scheduleScrubUpdate, { passive: true });
    window.addEventListener('resize', handleResize);

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(stage);
    }
  }

  async function boot() {
    resizeCanvas();
    measureScrubRange();
    await preloadFrames();
    bindScrubListeners();
    updateScrubFrame();

    document.addEventListener('components:ready', () => {
      measureScrubRange();
      scheduleScrubUpdate();
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        measureScrubRange();
        scheduleScrubUpdate();
      });
    }
  }

  boot();
})();
