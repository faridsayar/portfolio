// NOTE: Homepage news ticker — edit HOME_NEWS_MESSAGES below to add or update announcements.
(function homeNewsTicker() {
  const INTERVAL_MS = 6000;

  // KAPASITET (grønn merknad): maks 102 tegn per melding uten lenke, maks 96 tegn med lenkeikon — 3 linjer @ 21rem boks (se styles/home.css).
  // NOTE: Manual message list — optional href shows link icon; published is ISO date (yyyy-mm-dd).
  const HOME_NEWS_MESSAGES = [
    {
      text: 'Gratis skisse- og idéworkshop 19. august — meld deg på. Begrenset antall plasser.',
      href: 'https://formaa.no/arrangement',
      published: '2026-06-25',
    },
    {
      text: 'Vi har deltatt i interessant Webinar fra Siemens om TIA Selection Tool, SIVA og norsk industri.',
      href: 'https://www.siemens.com/no-no/',
      published: '2026-06-25',
    },
    {
      text: 'Vi søker en som ønsker praktisk erfaring innen B2B-markedsføring, lead-generering og forretningsutvikling.',
      href: '/karriere',
      published: '2026-06-17',
    },
    {
      text: 'Formaa har deltatt i Ground Control #5, Space for Founder på Mesh Oslo 24. juni.',
      href: 'https://www.spaceport-norway.com/ground-control/ground-control-5',
      published: '2026-06-24',
    },
    {
      text: 'Nye samarbeidsavtaler med Fjelderberg Tech og Maketronics, erfarne elektronikingeniører og tilgang til produksjonsutstyr!',
      href: 'https://formaa.no/tjenester-prosess',
      published: '2026-06-16',
    },
    {
      text: 'Ferdigstilt OBSEED-prosjekt med komponentvlg, CAD-model og produksjonsklarhet.',
      href: 'https://formaa.no/advanced-project.html?seoSlug=obseed-custom-8-string-guitar',
      published: '2026-05-15',
    },
  ];

  function formatNorwegianPublishDate(isoDate) {
    const match = String(isoDate).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return '';
    const [, yyyy, mm, dd] = match;
    return `${dd}.${mm}.${yyyy}`;
  }

  function isExternalHref(href) {
    return /^https?:\/\//i.test(href);
  }

  function renderMessageItem(message) {
    const dateText = formatNorwegianPublishDate(message.published);
    const linkMarkup = message.href
      ? `<a class="home-news-ticker__link" href="${message.href}"${
          isExternalHref(message.href) ? ' target="_blank" rel="noopener noreferrer"' : ''
        } aria-label="Les mer">
          <img class="home-news-ticker__link-icon" src="/assets/small-arrow-right.svg" alt="" width="12" height="12" aria-hidden="true" />
        </a>`
      : '';

    return `<li class="home-news-ticker__item">
      <div class="home-news-ticker__message">
        <p class="home-news-ticker__text">${message.text}</p>
        ${linkMarkup}
      </div>
      ${dateText ? `<time class="home-news-ticker__date" datetime="${String(message.published).slice(0, 10)}">${dateText}</time>` : ''}
    </li>`;
  }

  function initTickerRoot(root) {
    if (!root || root.dataset.homeNewsReady === 'true') return;

    const viewport = root.querySelector('[data-home-news-viewport]');
    const track = root.querySelector('[data-home-news-track]');
    if (!viewport || !track || HOME_NEWS_MESSAGES.length === 0) return;

    track.innerHTML = HOME_NEWS_MESSAGES.map(renderMessageItem).join('');
    root.dataset.homeNewsReady = 'true';

    const items = [...track.querySelectorAll('.home-news-ticker__item')];
    if (items.length === 0) return;

    let index = 0;
    let timerId = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setActive(nextIndex) {
      index = (nextIndex + items.length) % items.length;
      const activeItem = items[index];
      const offset = activeItem.offsetTop;
      track.style.transform = `translateY(${-offset}px)`;
    }

    function startTimer() {
      if (timerId) clearInterval(timerId);
      if (items.length < 2 || reducedMotion) return;
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

    const onResize = () => {
      setActive(index);
    };

    window.addEventListener('resize', onResize, { passive: true });
    root.addEventListener('mouseenter', stopTimer);
    root.addEventListener('mouseleave', startTimer);
    root.addEventListener('focusin', stopTimer);
    root.addEventListener('focusout', startTimer);

    if (reducedMotion) {
      track.style.transition = 'none';
    }
  }

  function initAllHomeNewsTickers() {
    document.querySelectorAll('[data-home-news-ticker]').forEach(initTickerRoot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllHomeNewsTickers);
  } else {
    initAllHomeNewsTickers();
  }

  document.addEventListener('components:ready', initAllHomeNewsTickers);
})();
