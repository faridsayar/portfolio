// NOTE: Shared title+text and process-strip markup for category landing pages.
// Edit CATEGORY_DELIVERY_STEPS and CATEGORY_PROCESS_LEAD for bulk copy updates per service slug.

/** NOTE: Process phase index (1–6) per category slug; null = no highlighted step. */
export const CATEGORY_PROCESS_PHASE = {
  markedsundersokelse: 1,
  brukerundersokelse: 1,
  konseptutvikling: 2,
  produktdesign: 3,
  industridesign: 3,
  '3d-modelering': 3,
  'cad-modelering': 6,
  visualisering: 4,
  prototyping: 5,
  validering: 6,
  'teknisk-tegning': 6,
  branding: null,
  design: null,
  redesign: null,
  emballasjedesign: null,
};

/** NOTE: Three delivery steps per service slug — "Hva du vil få" section (all regions). */
export const CATEGORY_DELIVERY_STEPS = {
  markedsundersokelse: [
    'Vi kartlegger marked, konkurrenter og muligheter som er relevante for produktidéen din.',
    'Vi analyserer trender, prising, kanaler og hvordan lignende produkter posisjoneres i markedet.',
    'Du får tydelig beslutningsgrunnlag — funn og anbefalinger du kan bruke overfor investorer, partnere eller Innovasjon Norge.',
  ],
  brukerundersokelse: [
    'Vi hjelper deg å definere målgruppe, brukerkontekst og hvor brukerne finnes.',
    'Vi tar kontakt med dem gjennom undersøkelser, intervjuer eller feltobservasjon.',
    'Vi samler innsikt og leverer data, personaer, scenarier og grunnlag for argumentasjon videre i prosessen.',
  ],
  konseptutvikling: [
    'Vi tar utgangspunkt i behov, innsikt og mål for produktet ditt.',
    'Vi utvikler skisser, idéforslag og raske visualiseringer av ulike retninger.',
    'Du får valgte konsepter med begrunnelse — et solid utgangspunkt før detaljert design og produksjon.',
  ],
  produktdesign: [
    'Vi definerer form, funksjon, ergonomi og materialvalg ut fra bruker og produksjon.',
    'Vi utvikler detaljerte skisser, 3D-modell og løsninger som kan realiseres i praksis.',
    'Du får produksjonsnært design med tydelige valg og grunnlag for visualisering, prototype og CAD.',
  ],
  industridesign: [
    'Vi avklarer brukskontekst, ergonomi og tekniske rammer for produktet.',
    'Vi utformer detaljerte løsninger med skisser, 3D-modell og mock-ups for testing.',
    'Du får et helhetlig industridesign som balanserer estetikk, funksjon og produksjon.',
  ],
  '3d-modelering': [
    'Vi bygger 3D-modell ut fra skisser, referanser eller eksisterende data.',
    'Vi utforsker volum, proporsjoner, detaljer og funksjonelle løsninger i modellen.',
    'Du får filer klare for visualisering, presentasjon, prototyping og videre CAD-arbeid.',
  ],
  'cad-modelering': [
    'Vi strukturerer modellen for produksjon med riktige toleranser og detaljnivå.',
    'Vi utvikler tekniske løsninger, samlinger og produksjonshensyn i CAD.',
    'Du får produksjonsklare filer og dokumentasjon leverandører kan jobbe videre med.',
  ],
  visualisering: [
    'Vi avklarer hva produktet skal kommunisere — og til hvem.',
    'Vi produserer bilder, animasjon eller video med produktet i kontekst.',
    'Du får presentasjonsmateriell klart for investorer, kunder, nettside og markedsføring.',
  ],
  prototyping: [
    'Vi planlegger hva som skal testes — ergonomi, funksjon, materialer eller formspråk.',
    'Vi bygger fysisk eller digital prototype for reell brukstesting.',
    'Du får konkrete funn og anbefalinger før du binder deg til produksjonsvalg.',
  ],
  validering: [
    'Vi gjennomgår design, spesifikasjoner og produksjonsforutsetninger sammen med deg.',
    'Vi kontrollerer CAD, toleranser, kostnader og teknisk dokumentasjon.',
    'Du får bekreftet at produktet er klart for produksjon — med tydelig risikobilde.',
  ],
  'teknisk-tegning': [
    'Vi strukturerer teknisk dokumentasjon ut fra ferdig design og produksjonsmetode.',
    'Vi utarbeider tegninger, mål, toleranser og spesifikasjoner for leverandør.',
    'Du får komplett teknisk grunnlag for produksjon, kvalitetssikring og innkjøp.',
  ],
  branding: [
    'Vi kartlegger posisjon, målgruppe og visuelt uttrykk som passer produktet.',
    'Vi utvikler identitet, grafikk og retningslinjer som henger sammen med designet.',
    'Du får merkevaregrunnlag som støtter lansering, emballasje og all ekstern kommunikasjon.',
  ],
  design: [
    'Vi avklarer behov, mål og rammer for produktet eller tjenesten din.',
    'Vi jobber tverrfaglig med konsept, formgiving, visualisering og teknisk forståelse.',
    'Du får helhetlig designleveranse — fra idé til løsning som kan realiseres og selges.',
  ],
  redesign: [
    'Vi analyserer dagens produkt, brukerfeedback og forbedringspotensial.',
    'Vi utvikler oppdatert design som løser svakheter uten å miste det som fungerer.',
    'Du får redesign med tydelig før/etter, begrunnelse og grunnlag for produksjon.',
  ],
  emballasjedesign: [
    'Vi kartlegger produkt, logistikk, butikkflate og merkevarekrav for emballasjen.',
    'Vi utformer struktur, grafikk og materialvalg som beskytter og selger.',
    'Du får produksjonsklart emballasjedesign med hensyn til kost, miljø og brukeropplevelse.',
  ],
};

/** NOTE: Process section lead per service slug — what it is, process role, why it matters. */
export const CATEGORY_PROCESS_LEAD = {
  markedsundersokelse:
    'Markedsundersøkelse er en viktig del av analysearbeidet og en nøkkelaktivitet for suksess — et fundament for bevis og begrunnelse av konseptet ditt overfor investorer eller Innovasjon Norge, for eksempel. Med markedsundersøkelse kan du finne reelle behov og svare på dem med et ekte produkt.',
  brukerundersokelse:
    'Brukerundersøkelse er en sentral del av analysefasen og gir grunnlaget for alle gode produktbeslutninger. Ved å forstå hvem som skal bruke produktet, i hvilken kontekst og med hvilke behov, unngår du å utvikle noe ingen faktisk trenger — og du styrker argumentasjonen når konseptet skal presenteres for partnere eller investorer.',
  konseptutvikling:
    'Konseptutvikling er hjertet av fase to i produktutviklingsprosessen — der idéer blir til konkrete løsningsforslag. Her utforsker vi skisser, retninger og raske visualiseringer slik at du kan velge kurs før du investerer tungt i detaljert utforming, modellering og produksjon.',
  produktdesign:
    'Produktdesign er en kjerneaktivitet i formgivingsfasen, der form, ergonomi, materialvalg og funksjon møtes i et helhetlig uttrykk. God produktdesign gjør at ideen ikke bare ser riktig ut, men også kan produseres, brukes og selges — med færre kostbare overraskelser senere i løpet.',
  industridesign:
    'Industridesign binder estetikk, ergonomi og teknisk forståelse sammen i formgivingsfasen. Det handler om å utforme produkter som fungerer for brukeren, kan fremstilles effektivt og står sterkt i markedet — fra detaljerte skisser og 3D-modell til mock-ups som avslører svakheter tidlig.',
  '3d-modelering':
    '3D-modellering er et viktig verktøy i formgivingsfasen for å utforske volum, proporsjoner og funksjon før produksjon. En god modell gjør det lettere å kommunisere ideen internt, teste varianter raskt og bygge et solid grunnlag for visualisering, prototyping og senere CAD-arbeid.',
  'cad-modelering':
    'CAD-modelering hører til valideringsfasen — der designet gjøres presist nok for produksjon. Med riktig CAD får du endelig modell, toleranser, detaljer og teknisk kvalitet på plass, slik at leverandører kan prise, produsere og kvalitetssikre uten misforståelser.',
  visualisering:
    'Visualisering er en egen fase i produktutviklingen der produktet presenteres med bilder, animasjon og kontekst — før eller parallelt med fysisk prototype. Sterk visualisering hjelper deg å selge inn ideen til investorer, kunder og partnere, og gir et tydelig bilde av hvordan produktet faktisk vil oppleves i bruk.',
  prototyping:
    'Prototyping er fasen der du tester produktet fysisk — ergonomi, form, funksjoner, materialer og bruksituasjoner. En prototype avdekker det som skjerm og modell ikke kan vise, og gir deg konkret grunnlag for å justere designet før du binder deg til dyre produksjonsvalg.',
  validering:
    'Validering er siste hovedfase før produksjon, der valg bekreftes og designet gjøres produksjonsklart. Her kontrolleres CAD-modell, toleranser, kostnader og teknisk dokumentasjon — slik at du går videre med trygghet, ikke gjetning, når produktet skal ut i serie.',
  'teknisk-tegning':
    'Teknisk tegning er en del av valideringsfasen og broen mellom ferdig design og reell produksjon. Tydelige tegninger og spesifikasjoner sikrer at fabrikk, leverandør og kvalitetskontroll forstår nøyaktig hva som skal lages — og reduserer risiko for feil, forsinkelser og unødvendige kostnader.',
  branding:
    'Branding løper ofte parallelt med produktutviklingen og gir produktet en tydelig identitet i markedet. God merkevarebygging støtter ikke bare markedsføring, men også produktbeslutninger — form, materialer, emballasje og kommunikasjon henger sammen når brukeren skal forstå hva produktet står for.',
  design:
    'Design er mer enn utseende — det er den røde tråden gjennom hele produktutviklingsprosessen, fra analyse og konsept til formgiving, visualisering og produksjon. Med helhetlig designarbeid sikrer du at produktet løser et reelt behov, kan realiseres og fremstår troverdig overfor brukere og investorer.',
  redesign:
    'Redesign handler om å forbedre det som allerede finnes — ikke starte fra null. I en moden produktutviklingsprosess kan redesign styrke brukeropplevelse, oppdatere formspråk og gjøre produksjon eller logistikk mer effektiv, samtidig som du beholder det som faktisk fungerer i markedet i dag.',
  emballasjedesign:
    'Emballasjedesign er ofte undervurdert, men avgjørende for hvordan produktet oppleves fra lager til butikkhylla. God emballasje beskytter produktet, kommuniserer merkevaren og påvirker både kostnader og bærekraft — og bør derfor tenkes inn tidlig, ikke som en ettertanke rett før lansering.',
};

const DEFAULT_PROCESS_LEAD =
  'Hele produktutviklingssyklusen kan beskrives i seks hovedfaser, hvor hver fase også er fordelt i noen mindre steg. Prosessen er ofte ikke lineær, men heller spiralformet: i dialog med kunden gjør vi flere iterasjoner, tilbyr variasjoner og utarbeider løsninger.';

const PROCESS_PHASES = [
  {
    number: 1,
    title: 'Analysering',
    text: `<a class="internal-text-link" href="/blogg/hvem-trenger-design">brukeranalyse</a>, markedsundersøkelse, feltundersøkelse, kartlegging, kravspesifikasjon`,
  },
  {
    number: 2,
    title: 'Konseptutvikling',
    text: `skisse, ideutvikling, <a class="internal-text-link" href="/blogg/fra-oppfinnelse-til-produksjon">konseptutvikling</a>, løsningsforslag, raske visualiseringer`,
  },
  {
    number: 3,
    title: 'Formgiving',
    text: `detaljerte skisser, 3D-modell, form utforsking, funksjonsanalyse, materialvalg, Mock-ups — se <a class="internal-text-link" href="/blogg/hva-er-industridesign">industridesign</a>`,
  },
  {
    number: 4,
    title: 'Visualisering',
    text: 'Kvalitet bilder, animasjon, bilder og video, bruk i kontekst og omgivelser',
  },
  {
    number: 5,
    title: 'Prototype',
    text: `Teste fysisk: ergonomi, form, funksjoner, materialer, formspråk, bruksituasjoner. Les <a class="internal-text-link" href="/blogg/hvordan-lage-prototype">hvordan lage prototype</a>`,
  },
  {
    number: 6,
    title: 'Validering',
    text: `Bekrefte og validere valg, endelig CAD-modell, toleranser, produksjonskalkulering, forberedelse for produksjon, tekniske tegninger. Se <a class="internal-text-link" href="/blogg/fra-oppfinnelse-til-produksjon">fra oppfinnelse til produksjon</a>`,
  },
];

function buildProcessPhaseCards(highlightPhase) {
  return PROCESS_PHASES.map((phase) => {
    const highlightClass = highlightPhase === phase.number ? ' prosess-phase-card--highlight' : '';
    return `              <article class="prosess-phase-card${highlightClass}">
                <span class="prosess-phase-card__number" aria-hidden="true">${phase.number}</span>
                <div class="prosess-phase-card__content">
                  <h3 class="prosess-phase-card__title">${phase.title}</h3>
                  <p class="prosess-phase-card__text">
                    ${phase.text}
                  </p>
                </div>
              </article>`;
  }).join('\n');
}

function buildDeliveryStepsList(steps) {
  const items = steps
    .map(
      (step, index) => `                <li class="category-delivery-steps__item">
                  <span class="category-delivery-steps__number" aria-hidden="true">${index + 1}</span>
                  <p class="category-delivery-steps__text">${step}</p>
                </li>`
    )
    .join('\n');

  return `              <ol class="category-delivery-steps" aria-label="Hva du vil få">
${items}
              </ol>`;
}

export function buildCategoryBodySection(serviceSlug) {
  const steps = CATEGORY_DELIVERY_STEPS[serviceSlug];
  if (!steps?.length) return '';

  return `          <!-- NOTE: Category delivery steps — per service slug; edit in scripts/lib/category-content-blocks.mjs -->
          <section class="section section--white category-body-copy" aria-label="Hva du vil få">
            <div class="section-inner">
              <h2 class="section-title">Hva du vil få</h2>
${buildDeliveryStepsList(steps)}
            </div>
          </section>`;
}

export function buildCategoryContextSection(serviceSlug) {
  const highlightPhase = CATEGORY_PROCESS_PHASE[serviceSlug] ?? null;
  const processLead = CATEGORY_PROCESS_LEAD[serviceSlug] || DEFAULT_PROCESS_LEAD;

  return `          <!-- NOTE: "Hva er det?" block — lead copy and phase strip per service slug; edit in scripts/lib/category-content-blocks.mjs -->
          <section class="section section--white category-context-section" aria-label="Hva er det?">
            <div class="section-inner">
              <h2 class="section-title">Hva er det?</h2>
              <p class="section-lead">
                ${processLead}
              </p>

              <div class="prosess-phase-strip" aria-label="Produktutviklingsfaser">
${buildProcessPhaseCards(highlightPhase)}
              </div>
            </div>
          </section>`;
}

export function buildCategoryContentBlocks(serviceSlug) {
  return `${buildCategoryContextSection(serviceSlug)}\n\n${buildCategoryBodySection(serviceSlug)}`;
}

export function parseCategoryServiceSlug(relPath) {
  const match = relPath.match(/^category\/([^/]+)\/[^/]+\.html$/);
  return match ? match[1] : null;
}
