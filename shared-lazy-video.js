// NOTE: Start homepage intro clips only when they approach the viewport.
(function initLazyVideos() {
  const VIDEO_SELECTOR = 'video[data-lazy-video]';
  const ROOT_MARGIN = '200px 0px';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function activateVideo(video) {
    if (video.dataset.lazyReady === 'true') {
      video.play().catch(() => {});
      return;
    }

    video.querySelectorAll('source[data-src]').forEach((source) => {
      source.src = source.getAttribute('data-src') || '';
    });
    video.load();
    video.dataset.lazyReady = 'true';
    video.play().catch(() => {});
  }

  function initializeLazyVideos() {
    const videos = document.querySelectorAll(VIDEO_SELECTOR);
    if (!videos.length || prefersReducedMotion()) return;

    if (!('IntersectionObserver' in window)) {
      videos.forEach((video) => activateVideo(video));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting) {
            activateVideo(video);
            return;
          }
          if (video.dataset.lazyReady === 'true') {
            video.pause();
          }
        });
      },
      { rootMargin: ROOT_MARGIN }
    );

    videos.forEach((video) => observer.observe(video));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLazyVideos);
  } else {
    initializeLazyVideos();
  }
})();
