// NOTE: Shared article template renderer; one layout reused across all article pages.
function renderSharedArticle() {
  const root = document.querySelector('[data-article-layout]');
  if (!root) return;

  const path = window.location.pathname.split('/').pop() || 'article-1.html';
  const key = path.replace('.html', '');

  const articles = {
    'article-1': {
      title: 'Hva er industridesign?',
      heroAlt: 'Industridesign eksempel',
      blocks: [
        {
          type: 'p',
          text: 'Industridesign er faget som gjør idéer til fysiske produkter du faktisk kan bruke i hverdagen. Her får du en enkel forklaring, uten fagord.',
        },
        { type: 'h2', text: 'Hva er industridesign egentlig?' },
        {
          type: 'p',
          text: 'Industridesign handler om hvordan et fysisk produkt ser ut, føles og fungerer. Målet er at produktet skal være enkelt å bruke, trygt og mulig å produsere.',
        },
        {
          type: 'p',
          text: 'Det er ikke bare utseende. Det er også ergonomi, materialvalg, kostnad, holdbarhet og brukeropplevelse i ekte brukssituasjoner.',
        },
        { type: 'h2', text: 'Hva gjør en industridesigner i praksis?' },
        {
          type: 'p',
          text: 'En industridesigner starter ofte med å forstå brukeren: hvem som skal bruke produktet, i hvilken situasjon, og hva som er vanskelig i dag.',
        },
        {
          type: 'p',
          text: 'Deretter oversettes dette til konkrete valg: størrelse, grep, knapper, materiale, vekt, styrke og hvordan produktet settes sammen.',
        },
      ],
    },
    'article-2': {
      title: 'UX er ikke produktdesign',
      heroAlt: 'Digital vs fysisk design',
      blocks: [
        {
          type: 'p',
          text: 'Mange tror produktdesign bare betyr app-design. Her forklarer vi forskjellen enkelt: digitalt produkt vs fysisk produkt.',
        },
        { type: 'h2', text: 'Hvordan skjedde det?' },
        {
          type: 'p',
          text: 'I tech-miljøer ble tittelen product designer brukt om UX/UI-roller. Derfor forbinder mange ordet produktdesign med skjerm, flyt og knapper.',
        },
        { type: 'h2', text: 'Men industridesign er fortsatt ekte produktdesign' },
        {
          type: 'p',
          text: 'Når produktet er fysisk, må noen tenke på form, ergonomi, materialer, produksjon, logistikk og holdbarhet. Dette er industridesign i praksis.',
        },
        { type: 'h2', text: 'Beste løsning: samarbeid' },
        {
          type: 'p',
          text: 'Digitale og fysiske produkter henger ofte sammen. Da får du best resultat når UX og industridesign jobber sammen.',
        },
      ],
    },
    'article-3': {
      title: 'Hvem trenger design, når og hvor mye?',
      heroAlt: 'Designfaser',
      blocks: [
        {
          type: 'p',
          text: 'Kort svar: nesten alle som lager produkter. Langt svar: det kommer an på fase, mål og budsjett.',
        },
        { type: 'h2', text: 'Hvilke typer selskaper trenger design?' },
        {
          type: 'p',
          text: 'Startups, små bedrifter og store selskaper trenger design for å redusere risiko og lage produkter som fungerer i markedet.',
        },
        { type: 'h2', text: 'I hvilke faser?' },
        {
          type: 'p',
          text: 'Tidlig fase: behov og konsept. Midtfase: form, funksjon og prototyper. Senfase: produksjonsklargjøring og forbedring.',
        },
        { type: 'h2', text: 'Hvor mye designer trenger du?' },
        {
          type: 'p',
          text: 'Noen prosjekter trenger noen timer i uka. Andre trenger fullt team i perioder. Start med tydelig mål, og skaler innsats etter fremdrift.',
        },
      ],
    },
    'article-4': {
      title: 'Hvordan design sparer penger i lengden',
      heroAlt: 'Langsiktig verdi av design',
      blocks: [
        {
          type: 'p',
          text: 'Design koster litt i starten, men sparer ofte mye senere. Her er hvorfor.',
        },
        { type: 'h2', text: 'Finner feil tidlig' },
        {
          type: 'p',
          text: 'Med skisser, prototyper og raske tester finner du problemer før produksjon. Endringer tidlig er billige. Endringer sent er dyre.',
        },
        { type: 'h2', text: 'Brukerfokus gir færre returer' },
        {
          type: 'p',
          text: 'Når produktet er laget for ekte bruk, får du færre klager, færre returer og mindre supportbehov.',
        },
        { type: 'h2', text: 'Bedre totaløkonomi' },
        {
          type: 'p',
          text: 'God design gir ofte høyere opplevd verdi, bedre marginer og lengre produktlevetid. På lang sikt er dette en investering.',
        },
      ],
    },
    'article-5': {
      title: 'Designprosessen i industridesign',
      heroAlt: 'Designprosess',
      blocks: [
        {
          type: 'p',
          text: 'Prosessen er enkel å forstå: lær først, bygg etterpå, test underveis.',
        },
        { type: 'h2', text: 'Fase 1: Innsikt og problemforståelse' },
        {
          type: 'p',
          text: 'Hva trenger brukeren egentlig? Denne fasen gir riktig retning før man bruker store ressurser.',
        },
        { type: 'h2', text: 'Fase 2: Konsept, skisser og prototyper' },
        {
          type: 'p',
          text: 'Her utforskes løsninger raskt. Du sammenligner ideer, lager enkle prototyper og tester hva som faktisk fungerer.',
        },
        { type: 'h2', text: 'Fase 3: Detaljering og produksjon' },
        {
          type: 'p',
          text: 'Til slutt justeres løsningen for produksjon. Da blir idéen konkret og klar for virkeligheten.',
        },
      ],
    },
    'article-6': {
      title: 'Hvorfor design er perfekt for crowdfunding',
      heroAlt: 'Crowdfunding og design',
      blocks: [
        {
          type: 'p',
          text: 'Hvis du ikke har investorer ennå, kan godt design bli din sterkeste fordel i en kampanje.',
        },
        { type: 'h2', text: 'Design bygger tillit raskt' },
        {
          type: 'p',
          text: 'Backere vurderer prosjektet på sekunder. Et tydelig og gjennomtenkt design signaliserer at idéen er seriøs og gjennomførbar.',
        },
        { type: 'h2', text: 'Visualisering gjør idéen konkret' },
        {
          type: 'p',
          text: 'Med god visualisering og troverdig prototype forstår folk raskere hva produktet er og hvorfor de bør støtte det.',
        },
        { type: 'h2', text: 'Bedre grunnlag etter kampanjen' },
        {
          type: 'p',
          text: 'God design i crowdfunding handler ikke bare om å samle penger, men også om å være klar for prototyping, produksjon og levering.',
        },
      ],
    },
  };

  const article = articles[key] || articles['article-1'];
  const titleEl = root.querySelector('[data-article-title]');
  const currentBreadcrumbEl = root.querySelector('[data-article-breadcrumb-current]');
  const heroImageEl = root.querySelector('[data-article-hero-image]');
  const bodyEl = root.querySelector('[data-article-body]');

  if (titleEl) titleEl.textContent = article.title;
  if (currentBreadcrumbEl) currentBreadcrumbEl.textContent = article.title;
  if (heroImageEl) {
    const getImage = window.getArticleImageForKey;
    heroImageEl.src =
      typeof getImage === 'function' ? getImage(key) : 'assets/images/Articles/USV.png';
    heroImageEl.alt = article.heroAlt;
  }
  if (bodyEl) {
    bodyEl.innerHTML = article.blocks
      .map((block) =>
        block.type === 'h2'
          ? `<h2 class="article-row__title">${block.text}</h2>`
          : `<p>${block.text}</p>`
      )
      .join('');
  }
}

renderSharedArticle();
document.addEventListener('components:ready', renderSharedArticle);
