// NOTE: Homepage quote carousel — centers one card, shows neighbors partly visible, steps every 4s.
(function quotesCarousel() {
  const INTERVAL_MS = 4000;

  function initQuotesCarousel() {
    const root = document.querySelector('[data-quotes-carousel]');
    if (!root || root.dataset.quotesReady === 'true') return;

    const viewport = root.querySelector('.quotes-carousel__viewport');
    const track = root.querySelector('[data-quotes-track]');
    if (!viewport || !track) return;

    const cards = [...track.querySelectorAll('.quote-card')];
    if (cards.length === 0) return;

    root.dataset.quotesReady = 'true';

    let index = 0;
    let timerId = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setActive(nextIndex) {
      index = (nextIndex + cards.length) % cards.length;
      cards.forEach((card, cardIndex) => {
        card.classList.toggle('quote-card--active', cardIndex === index);
      });

      const activeCard = cards[index];
      const offset = activeCard.offsetLeft + activeCard.offsetWidth / 2 - viewport.clientWidth / 2;
      track.style.transform = `translateX(${-offset}px)`;
    }

    function startTimer() {
      if (timerId) clearInterval(timerId);
      if (cards.length < 2) return;
      timerId = setInterval(() => {
        setActive(index + 1);
      }, INTERVAL_MS);
    }

    function stopTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    setActive(0);
    startTimer();

    window.addEventListener(
      'resize',
      () => {
        setActive(index);
      },
      { passive: true }
    );

    root.addEventListener('mouseenter', stopTimer);
    root.addEventListener('mouseleave', startTimer);
    root.addEventListener('focusin', stopTimer);
    root.addEventListener('focusout', startTimer);

    if (reducedMotion) {
      stopTimer();
      track.style.transition = 'none';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuotesCarousel);
  } else {
    initQuotesCarousel();
  }
})();
