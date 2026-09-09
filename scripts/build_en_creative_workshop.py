#!/usr/bin/env python3
"""One-off builder: formaa-skaperverksted.html → en/creative-workshop.html"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "formaa-skaperverksted.html"
OUT = ROOT / "en" / "creative-workshop.html"

REPLACEMENTS = [
    ('lang="no"', 'lang="en"'),
    (
        "<title>Aktivitet barnekurs i Oslo – kreativt kurs for barn 5–9 år | Formaa</title>",
        "<title>Children's creative course in Oslo – ages 5–9 | Formaa</title>",
    ),
    (
        'content="Aktivitet barnekurs i Oslo øst (Trosterud): kreativt kurs for barn 5–9 år. Bygg og tegn i små grupper, 90 min × 8 uker. Meld interesse — uforpliktende."',
        'content="Formaa Creative Workshop in Oslo east (Trosterud): creative course for children aged 5–9. Build and draw in small groups, 90 min × 8 weeks. Register interest — no obligation."',
    ),
    (
        'content="Formaa-Skaperverksted, kreativt verksted, barn, håndverk, design, Oslo, Trosterud, Formaa, kommer snart"',
        'content="Formaa Creative Workshop, creative workshop, children, craft, design, Oslo, Trosterud, Formaa, coming soon"',
    ),
    ('property="og:locale" content="nb_NO"', 'property="og:locale" content="en_US"'),
    ('property="og:locale:alternate" content="en_US"', 'property="og:locale:alternate" content="nb_NO"'),
    (
        'content="Aktivitet barnekurs i Oslo – kreativt kurs for barn 5–9 år | Formaa"',
        'content="Children\'s creative course in Oslo – ages 5–9 | Formaa"',
    ),
    ('content="https://formaa.no/formaa-skaperverksted"', 'content="https://formaa.no/en/creative-workshop"'),
    ('content="Formaa-Skaperverksted — kreativt verksted for barn"', 'content="Formaa Creative Workshop — creative workshop for children"'),
    ('href="https://formaa.no/formaa-skaperverksted"', 'href="https://formaa.no/en/creative-workshop"'),
    ('href="styles/base.css?v=22"', 'href="/styles/base.css?v=45"'),
    ('src="assets/', 'src="/assets/'),
    ('href="/oss"', 'href="/en/about"'),
    ('href="/prosjekter"', 'href="/en/projects"'),
    ('href="/formaa-skaperverksted"', 'href="/en/creative-workshop"'),
    ('href="/application-form"', 'href="/en/contact"'),
    ('aria-label="Navigasjon"', 'aria-label="Navigation"'),
    ('aria-label="Brødsmulesti"', 'aria-label="Breadcrumb"'),
    ('aria-label="Formaa-Skaperverksted"', 'aria-label="Formaa Creative Workshop"'),
    ('>Formaa-Skaperverksted<', '>Formaa Creative Workshop<'),
    ('>Formaa - Skaperverksted<', '>Formaa Creative Workshop<'),
    (
        '>Kreativt barnekurs i Oslo for barn 5-9 år<',
        '>Creative Hands-On Courses for Kids (Ages 5–9) in Oslo<',
    ),
    (
        'Et unikt verksted for barn 5–9 år. Lær å bygge, utforske og skape med egne hender.',
        'A unique space for kids aged 5–9 to build, explore, and create with their hands.',
    ),
    ('>Meld interesse<', '>Register interest<'),
    ('aria-label="Om verkstedet"', 'aria-label="About the workshop"'),
    ('>For de små<', '>For the little ones<'),
    ('>Barnekurs i Oslo øst for barn 5–9 år<', '>Creative Kids\' Workshop in East Oslo (Ages 5–9)<'),
    ('aria-label="For foreldre"', 'aria-label="For parents"'),
    ('>For foreldre<', '>For parents<'),
    ('>Barnekurs i Trosterud — sted, pris og opplegg<', '>Kids\' Workshop in Trosterud — Location, Pricing & Details<'),
    ('aria-label="Hvorfor Formaa"', 'aria-label="Why Formaa"'),
    ('>Hvorfor Formaa?<', '>Why Formaa?<'),
    ('>Fra ekte produktstudio til barnas verksted<', '>From a Real Design Studio to a Kids\' Workshop<'),
    ('>Les om teamet<', '>Meet the team<'),
    ('>prosjektene våre<', '>our projects<'),
    ('aria-label="Hvem lærer bort"', 'aria-label="Who teaches"'),
    ('>Instruktører<', '>Instructors<'),
    ('>Hvem lærer bort?<', '>Who Teaches the Workshops?<'),
    ('aria-label="Kursinnhold"', 'aria-label="Course content"'),
    ('>Filosofi<', '>Our Philosophy<'),
    ('>Der barn blir skapere<', '>Where kids become makers<'),
    ('>Hva barna lærer: bygge, tegne og skape<', '>What Kids Learn: Building, Drawing & Creating<'),
    ('>Materialer vi utforsker<', '>Materials We Explore<'),
    ('>Små hender. Store idéer.<', '>Small hands. Big ideas.<'),
    ('>Verktøy<', '>Tools<'),
    ('>Ombruk og kreativitet<', '>Creativity &amp; Upcycling<'),
    ('>Vi bygger nysgjerrighet.<', '>We build curiosity.<'),
    ('>Bygge og tegne med barn — eksempler<', '>Building &amp; Drawing with Kids: Example Projects<'),
    ('>En typisk kursdag på barnekurset<', '>A Typical Session<'),
    ('>Velkommen (10 minutter)<', '>Welcome &amp; Inspiration (10 mins)<'),
    ('>Utforskning (15 minutter)<', '>Exploration (15 mins)<'),
    ('>Skapetid (50 minutter)<', '>Making Time (50 mins)<'),
    ('>Deling (10 minutter)<', '>Show &amp; Tell (10 mins)<'),
    ('>Rydding og liten premie (5 minutter)<', '>Wrap-Up &amp; Reward (5 mins)<'),
    ('>Trygghet<', '>Safety First<'),
    ('aria-label="Vanlige spørsmål for foreldre"', 'aria-label="Frequently asked questions for parents"'),
    ('>Vanlige spørsmål om barnekurs hos Formaa<', '>Frequently Asked Questions<'),
    ('aria-label="Bli blant de første"', 'aria-label="Be among the first"'),
    ('>Venteliste<', '>Waiting list<'),
    ('>Bli blant de første<', '>Be Among the First<'),
    ('aria-label="Meld interesse"', 'aria-label="Register interest"'),
    ('>Din e-post<', '>Your email<'),
    ('>Barnets alder<', '>Child\'s age<'),
    ('>Velg alder<', '>Select age<'),
    ('>Bydel<', '>District<'),
    ('>Velg bydel<', '>Select district<'),
    ('>Hvilke dager passer best?<', '>Which days work best?<'),
    ('>Velg dag<', '>Select day<'),
    ('>Antall barn du vurderer<', '>Number of children you are considering<'),
    ('>Valgfritt<', '>Optional<'),
    ('>Hva liker barnet å lage?<', '>What does your child like to make?<'),
    (
        '>Hva savner dere av kreative aktiviteter for barn i dag?<',
        '>What creative activities for children are you missing today?<',
    ),
    ('value="5 år"', 'value="5 years"'),
    ('>5 år<', '>5 years<'),
    ('value="6 år"', 'value="6 years"'),
    ('>6 år<', '>6 years<'),
    ('value="7 år"', 'value="7 years"'),
    ('>7 år<', '>7 years<'),
    ('value="8 år"', 'value="8 years"'),
    ('>8 år<', '>8 years<'),
    ('value="9 år"', 'value="9 years"'),
    ('>9 år<', '>9 years<'),
    ('value="Annet / utenfor Oslo"', 'value="Other / outside Oslo"'),
    ('>Annet / utenfor Oslo<', '>Other / outside Oslo<'),
    ('value="Mandag"', 'value="Monday"'),
    ('>Mandag<', '>Monday<'),
    ('value="Tirsdag"', 'value="Tuesday"'),
    ('>Tirsdag<', '>Tuesday<'),
    ('value="Onsdag"', 'value="Wednesday"'),
    ('>Onsdag<', '>Wednesday<'),
    ('value="Torsdag"', 'value="Thursday"'),
    ('>Torsdag<', '>Thursday<'),
    ('value="Fredag"', 'value="Friday"'),
    ('>Fredag<', '>Friday<'),
    ('value="Lørdag"', 'value="Saturday"'),
    ('>Lørdag<', '>Saturday<'),
    ('value="Søndag"', 'value="Sunday"'),
    ('>Søndag<', '>Sunday<'),
    ('value="Flere dager / fleksibel"', 'value="Several days / flexible"'),
    ('>Flere dager / fleksibel<', '>Several days / flexible<'),
    ('value="1 barn"', 'value="1 child"'),
    ('>1 barn<', '>1 child<'),
    ('value="2 barn"', 'value="2 children"'),
    ('>2 barn<', '>2 children<'),
    ('value="3 eller flere barn"', 'value="3 or more children"'),
    ('>3 eller flere barn<', '>3 or more children<'),
    ('placeholder="forelder@example.no"', 'placeholder="parent@example.com"'),
    ('pattern="^[^\\s@]+@[^\\s@]+\\.(com|no)$"', 'pattern="^[^\\s@]+@[^\\s@]+\\.(com|no)$"'),
    ('value="Interesse Formaa-Skaperverksted"', 'value="Interest Formaa Creative Workshop"'),
    ('value="Formaa nettside"', 'value="Formaa website"'),
    ('value="Formaa-Skaperverksted (kommer snart)"', 'value="Formaa Creative Workshop (coming soon)"'),
    ('components-loader.js?v=5', '/components-loader.js?v=5'),
    ('shared-nav.js?v=2', '/shared-nav.js?v=3'),
    ('script.js?v=13', '/script.js?v=17'),
]

LONG_REPLACEMENTS = {
    """    <meta
      name="description:en"
      content="Formaa-Skaperverksted in Oslo, Trosterud — creative workshop for children aged 5–9. Weekly craft, art and design course — register interest, coming soon."
    />
""": "",
    """            Formaa-Skaperverksted er et kreativt barnekurs i Oslo (Trosterud) for barn 5–9 år,
            utviklet av Formaa AS. Kurset varer 90 minutter, én gang i uken i 8 uker — planlagt
            oppstart i <strong>Trosterud, Oslo</strong>. Eksakt dato og adresse deles med de som
            melder interesse.""": """            Formaa Creative Workshop is an engaging hands-on program in Trosterud, Oslo, designed for
            children aged 5–9 and created by Formaa AS. Sessions run for 90 minutes once a week for 8
            weeks. The exact date and location will be shared directly with those who register their
            interest.""",
    """            Målet er å gi barn muligheten til å utforske, skape og bygge med egne hender. Gjennom
            kunst, håndverk, design og enkle konstruksjoner lærer barna å utvikle idéer, løse
            problemer og oppleve gleden ved å skape noe selv.""": """            Our mission is to give children space to explore, build, and create with their hands.
            Through art, crafts, design, and simple construction projects, kids learn to develop ideas,
            solve problems, and experience the joy of making.""",
    """            Vi ønsker å inspirere en ny generasjon skapere — barn som tør å prøve, utforske og finne
            egne løsninger, samtidig som de lærer praktiske egenskaper.""": """            We aim to inspire a new generation of makers — children who dare to experiment, explore,
            and find unique solutions while building practical skills.""",
    """            Et kreativt alternativ i nærmiljøet for familier på Trosterud, Furuset, Lindeberg og
            resten av Oslo øst — ikke bare skjermtid og organisert idrett.""": """            A creative local alternative for families in Trosterud, Furuset, Lindeberg, and across
            East Oslo — a fresh break from screen time and organized sports.""",
    """            <li><strong>Sted:</strong> Trosterud, Oslo — nærmere adresse ved oppstart</li>""": """            <li><strong>Location:</strong> Trosterud, Oslo — full address shared upon launch</li>""",
    """            <li>
              <strong>Oppstart:</strong> planlagt i september — eksakt dato sendes til de som melder
              interesse
            </li>""": """            <li>
              <strong>Start Date:</strong> Planned for September — exact date sent to those who
              register interest
            </li>""",
    """            <li><strong>Alder:</strong> 5–9 år</li>""": """            <li><strong>Age Group:</strong> 5–9 years old</li>""",
    """            <li><strong>Opplegg:</strong> 90 minutter · 1 gang per uke · 8 uker</li>""": """            <li><strong>Format:</strong> 90-minute weekly sessions for 8 weeks</li>""",
    """            <li>
              <strong>Gruppestørrelse:</strong> maks 10 barn per gruppe — små grupper og god
              oppfølging
            </li>""": """            <li>
              <strong>Group Size:</strong> Max 10 kids per group — small groups for personal
              guidance
            </li>""",
    """            <li>
              <strong>Pris (ca.):</strong> ca. 2 990 kr for 8 uker — materialer inkludert. Endelig
              pris bekreftes ved oppstart.
            </li>""": """            <li>
              <strong>Price:</strong> Approx. NOK 2,990 for 8 weeks (materials included). Final price
              confirmed at launch.
            </li>""",
    """            <li>
              <strong>Praktisk:</strong> arbeidsklær anbefales; vi stiller med materialer og verktøy
            </li>""": """            <li>
              <strong>Good to Know:</strong> Wear workshop-friendly clothes; all materials and tools
              are provided
            </li>""",
    """          <h3 class="article-row__title">Hva får barnet med seg?</h3>""": """          <h3 class="article-row__title">What Will Your Child Bring Home?</h3>""",
    """            <li>et ferdig prosjekt og flere ferdige verk å vise frem i løpet av kurset</li>""": """            <li>Completed projects and crafts created throughout the course</li>""",
    """            <li>egen skissebok for idéer og tegninger og klistremerker</li>""": """            <li>Their own sketchbook for ideas and drawings, plus stickers</li>""",
    """            <li>dagens klistremerke og mestringsglede</li>""": """            <li>A daily sticker and a proud sense of achievement</li>""",
    """            <li>mer tro på egne idéer — og lyst til å fortsette å bygge hjemme</li>""": """            <li>Greater confidence in their ideas — and motivation to keep creating at home</li>""",
    """          <h3 class="article-row__title">Hva får du som forelder?</h3>""": """          <h3 class="article-row__title">What Do Parents Get?</h3>""",
    """            <li>et trygt verkstedmiljø med tydelig voksenoppsyn</li>""": """            <li>A safe, welcoming environment with dedicated supervision</li>""",
    """            <li>aktivitet som utvikler konsentrasjon, finmotorikk og problemløsning</li>""": """            <li>Activities that build focus, fine motor skills, and problem-solving abilities</li>""",
    """            <li>noe konkret å snakke om etter kurset — «se hva jeg lagde»</li>""": """            <li>Meaningful conversations after class — "Look what I made!"</li>""",
}

NAV_SHELL = """    <nav class="side-nav" aria-label="Navigation" data-mobile-nav></nav>
"""

FOOTER_SHELL = """    <div data-component="privacy-trust-section-en" data-hide-privacy-faq-link></div>
    <div data-component="site-footer-en"></div>
"""

HREFLANG = """    <!-- NOTE: hreflang alternates (scripts/inject-hreflang.mjs) -->
    <link rel="alternate" hreflang="nb" href="https://formaa.no/formaa-skaperverksted" />
    <link rel="alternate" hreflang="en" href="https://formaa.no/en/creative-workshop" />
    <link rel="alternate" hreflang="x-default" href="https://formaa.no/formaa-skaperverksted" />
"""

JSON_LD = """    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": "https://formaa.no/#website",
            "name": "Formaa",
            "url": "https://formaa.no/",
            "publisher": { "@id": "https://formaa.no/#organization" },
            "inLanguage": ["nb-NO", "en"]
          },
          {
            "@type": "BreadcrumbList",
            "@id": "https://formaa.no/en/creative-workshop#breadcrumb",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Formaa AS",
                "item": "https://formaa.no/en/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Formaa Creative Workshop",
                "item": "https://formaa.no/en/creative-workshop"
              }
            ]
          },
          {
            "@type": "WebPage",
            "@id": "https://formaa.no/en/creative-workshop",
            "name": "Children's creative course in Oslo – ages 5–9 | Formaa",
            "url": "https://formaa.no/en/creative-workshop",
            "description": "Formaa Creative Workshop in Oslo east (Trosterud): creative course for children aged 5–9. Build and draw in small groups, 90 min × 8 weeks. Register interest — no obligation.",
            "inLanguage": "en",
            "isPartOf": { "@id": "https://formaa.no/#website" },
            "publisher": { "@id": "https://formaa.no/#organization" }
          },
          {
            "@type": "Course",
            "@id": "https://formaa.no/en/creative-workshop#course",
            "name": "Children's course in Oslo — Formaa Creative Workshop (creative activity for ages 5–9)",
            "description": "Formaa Creative Workshop in Oslo east (Trosterud): creative course for children aged 5–9. Build and draw in small groups, 90 min × 8 weeks. Register interest — no obligation.",
            "image": "https://formaa.no/assets/images/Skaperverksted/formaa-skaperverksted.webp",
            "provider": { "@id": "https://formaa.no/#organization" },
            "educationalLevel": "Primary",
            "audience": {
              "@type": "EducationalAudience",
              "audienceType": "children aged 5–9"
            },
            "inLanguage": "en",
            "url": "https://formaa.no/en/creative-workshop",
            "timeRequired": "PT1H30M",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "@id": "https://formaa.no/en/creative-workshop#course-instance",
              "courseMode": "Onsite",
              "courseWorkload": "PT1H30M",
              "location": {
                "@type": "Place",
                "name": "Trosterud, Oslo",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Oslo",
                  "addressCountry": "NO"
                }
              },
              "offers": {
                "@type": "Offer",
                "price": "2990",
                "priceCurrency": "NOK",
                "url": "https://formaa.no/en/creative-workshop",
                "availability": "https://schema.org/PreOrder"
              }
            }
          }
        ]
      }
    </script>
"""


def main():
    html = SRC.read_text(encoding="utf-8")

    for old, new in REPLACEMENTS:
        html = html.replace(old, new)

    for old, new in LONG_REPLACEMENTS.items():
        html = html.replace(old, new)

    # Replace static nav block
    nav_start = html.index("<!-- NOTE: BEGIN static side-nav")
    nav_end = html.index("<!-- NOTE: END static side-nav -->") + len("<!-- NOTE: END static side-nav -->")
    html = html[:nav_start] + NAV_SHELL + html[nav_end:]

    # Replace footer + JSON-LD
    footer_start = html.index("    <div data-component=\"privacy-trust-section\"></div>")
    script_loader = html.index("    <script src=\"/components-loader.js")
    html = html[:footer_start] + FOOTER_SHELL + "\n" + JSON_LD + "\n\n" + html[script_loader:]

    # Insert hreflang after canonical
    canonical = '    <link rel="canonical" href="https://formaa.no/en/creative-workshop" />\n'
    html = html.replace(canonical, canonical + "\n" + HREFLANG + "\n")

    # Remaining paragraph translations (bulk)
    more = [
        (
            "Formaa AS utvikler ekte produkter fra idé til prototype — med form, materialer og\n            verktøy hver dag. Skaperverkstedet er laget av industridesignere og produktutviklere,\n            tilpasset barn.",
            "At Formaa AS, we design and build real products from initial idea to prototype — working\n            hands-on with materials, forms, and tools every day. Our workshop was created by industrial\n            designers and product developers, then thoughtfully adapted for children.",
        ),
        (
            "Det betyr ikke et tilfeldig hobbytilbud, men et strukturert verksted der barna møter\n            samme type tenkning som brukes i profesjonell produktutvikling — i lekens og\n            nysgjerrighetens form.",
            "This isn't just a basic craft class. It's a structured workshop where kids experience the\n            same creative mindset used in professional design — fueled by play, curiosity, and\n            hands-on discovery.",
        ),
        (
            "Les om teamet</a> eller se\n            <a class=\"internal-text-link\" href=\"/en/projects\">our projects</a> for å forstå hvem\n            som står bak.",
            "Meet the team</a> or\n            <a class=\"internal-text-link\" href=\"/en/projects\">explore our projects</a> to see who's\n            behind the studio.",
        ),
        (
            "Verkstedet ledes av Formaa-teamet — industridesignere og produktutviklere med\n                erfaring fra skisser, modeller, prototyper og verkstedarbeid.",
            "Sessions are led by the Formaa team — industrial designers and product developers with\n                deep hands-on experience in sketching, prototyping, and physical production.",
        ),
        (
            "Vi kjenner materialer og verktøy fra profesjonell produktutvikling, og tilpasser\n                opplegget slik at barna får reelle oppgaver de kan mestre — med trygg veiledning\n                underveis.",
            "We bring real-world expertise with professional tools and materials, adapting each task\n                so children can tackle real challenges safely and with confidence.",
        ),
        (
            "Målet er ikke perfekte resultater, men at hvert barn tør å prøve, feile og prøve\n                igjen — akkurat som i et ekte designverksted.",
            "Our focus isn't on flawless results. We want every child to feel empowered to\n                experiment, learn from mistakes, and try again — exactly like in a real design studio.",
        ),
        ("Alle produkter rundt oss startet som en idé.", "Every product around us started as a simple idea."),
        (
            "Barn har en naturlig nysgjerrighet og fantasi. Når de får tilgang til materialer,\n            verktøy og frihet til å eksperimentere, utvikler de både kreativitet, praktiske\n            ferdigheter og tro på egne evner.",
            "Children possess a natural sense of curiosity and boundless imagination. When given the\n            right materials, tools, and the freedom to experiment, they develop creativity, practical\n            skills, and confidence in their own abilities.",
        ),
        (
            "Hos Formaa-Skaperverksted finnes det ikke bare riktige svar. Vi oppmuntrer barna til å\n            utforske, stille spørsmål og finne egne løsninger.",
            "At Formaa Creative Workshop, there are no single right answers. We empower children to\n            explore, ask questions, and discover their own unique solutions.",
        ),
        (
            "Tilpasset til alderen får barna erfaring med kreativ tenkning, idéutvikling og enkel\n            designprosess — gjennom lek og praktiske aktiviteter:",
            "Designed specifically for their age group, our workshops guide children through creative\n            thinking, idea development, and simple design processes — all through play and hands-on\n            making:",
        ),
        ("tegning og skisser", "<strong>Drawing &amp; Sketching:</strong> Expressing ideas on paper"),
        ("planlegging og problemløsning", "<strong>Planning &amp; Problem-Solving:</strong> Turning concepts into reality"),
        ("finmotorikk og konsentrasjon", "<strong>Fine Motor Skills &amp; Focus:</strong> Working precisely with tools"),
        ("samarbeid og tålmodighet", "<strong>Collaboration &amp; Patience:</strong> Sharing ideas and learning together"),
        ("skaperglede og mestring", "<strong>The Joy of Craft &amp; Mastery:</strong> Experiencing the pride of creating"),
        ("tre, papir, papp og leire", "Wood, paper, cardboard, and clay"),
        ("metall, tekstiler og silikon", "Metal, textiles, and silicone"),
        ("tau, snorer, skruer og spiker", "Rope, twine, screws, and nails"),
        ("kork, plast og resirkulerte materialer", "Cork, plastics, and recycled materials"),
        ("isopor og metallgjenstander", "Foam and found objects"),
        (
            "alt=\"Verktøy og materialer barna utforsker på Formaa-Skaperverksted\"",
            "alt=\"Tools and materials children explore at Formaa Creative Workshop\"",
        ),
        (
            "Vi gjør barna trygge på enkle verktøy gjennom veiledning og sikker bruk — og lærer dem å\n            bruke verktøy slik at de faktisk oppnår resultat.",
            "We guide children to use real tools safely and confidently, teaching them proper techniques\n            so they can bring their ideas to life.",
        ),
        ("hammer, skrutrekker og målebånd", "Hammers, screwdrivers, and tape measures"),
        ("sandpapir, pensler og lim", "Sandpaper, paintbrushes, and glue"),
        ("enkle håndbor, linjal og passer", "Hand drills, rulers, and compasses"),
        ("tommelstokk, skyvlære og skiftenøkkel", "Try squares, marking gauges, and wrenches"),
        ("bolter, muttere og små håndklemmer", "Bolts, nuts, and small clamps"),
        (
            "En viktig del av verkstedet er å lære barna at ting kan få nytt liv. Vi oppmuntrer barn\n            til å samle interessante materialer hjemme eller ute og hente dem til en konkret dag —\n            og hjelpe barnet å finne ny bruksmåte av objektet.",
            "An essential part of our workshop is showing children that everyday items can be given a\n            second life. We encourage kids to collect interesting materials at home or in nature and\n            bring them to special sessions — where we help turn those objects into brand-new\n            creations.",
        ),
        ("korker, pappesker og knapper", "Corks, cardboard boxes, and buttons"),
        ("små trestykker, kongler og steiner", "Wood scraps, pinecones, and stones"),
        ("stoffrester, gamle leker og bokser", "Fabric scraps, old toys, and containers"),
        ("syltetøyglass, ledninger, hjul og små mekaniske deler", "Glass jars, wire, wheels, and small mechanical parts"),
        ("bygge sin egen verktøykasse eller en liten bil", "Build a personalized toolbox or a small car"),
        ("lage båt av tre, fuglemater eller vindmølle", "Craft a wooden boat, bird feeder, or windmill"),
        ("bygge skattekiste, pil og bue eller fantasidyr", "Create a treasure chest, bow and arrow, or fantasy creature"),
        ("forme figurer i leire og bake dem", "Sculpt clay figures and bake them"),
        ("lage enkel fiskestang, et lite fly eller håndklokke av tre", "Assemble a simple fishing rod, airplane, or wooden clock"),
        ("bygge enkle mekaniske leker og eksperimentere med balanse og bevegelse", "Construct mechanical toys to experiment with balance and movement"),
        ("designe egne oppfinnelser over flere kursdager", "Design original inventions over multi-week projects"),
        (
            "Vi utforsker hva hvert barn liker og lærer å lage «prosjekt» gjennom flere kursdager —\n            med planlegging, tegning, materialer, mål og utføring, slik at barnet får glede av å\n            fortsette arbeidet etterpå og lærer om tidsperspektiv.",
            "We guide children through a complete \"project workflow\" — covering planning, sketching,\n            material selection, measuring, and execution. This teaches patience, long-term focus, and\n            the joy of seeing an idea through to the end.",
        ),
        ("Ingen kurs blir helt like. Barnas egne idéer får alltid plass.", "No two days are identical; every session leaves plenty of room for kids' own ideas."),
        (
            "Barna velger materialer, bygger, maler, former og eksperimenterer med egne løsninger.\n            Instruktøren veileder underveis.",
            "Kids choose materials, build, paint, sculpt, and solve challenges. The instructor\n            provides personalized guidance.",
        ),
        ("Alle får vise frem prosjektet sitt og fortelle om hvordan de tenkte.", "Children present their projects and share their creative thought process with the group."),
        (
            "Sikkerhet er grunnlaget for at barna kan utforske friere. Alle aktiviteter tilpasses\n            barnas alder, gjennomføres under oppsyn og med hensyn til barnas sikkerhet.",
            "Safety is our foundation — it gives children the freedom to explore with confidence. All\n            activities are tailored to age and skill levels under direct supervision.",
        ),
        ("verktøy introduseres gradvis — ingen barn tvinges til noe de ikke er klare for", "<strong>Gradual Tool Introduction:</strong> No child is rushed into using tools before they feel ready."),
        ("små grupper gir bedre oppfølging og tryggere bruk av verksted", "<strong>Small Group Sizes:</strong> Ensures personalized guidance and a controlled environment."),
        ("ingen farlige maskiner uten direkte veiledning", "<strong>Strict Supervision:</strong> No heavy or dangerous machinery is used without one-on-one oversight."),
        ("tydelige rutiner for rydding og oppbevaring av verktøy", "<strong>Clear Routines:</strong> Structured protocols for handling, cleaning, and storing tools safely."),
        (
            "Må barnet være «kreativt» fra før?",
            "Does my child need to be \"creative\" to join?",
        ),
        (
            "Nei. Nysgjerrighet er nok. Noen barn liker å tegne, andre vil bare bygge — begge\n                deler får plass. Verkstedet handler om å prøve, ikke om å være flink fra start.",
            "Not at all — curiosity is all they need! Some kids love to draw, while others just\n                want to build, and both are equally welcome. Our workshops are all about experimenting\n                and trying new things, not having pre-existing skills.",
        ),
        ("Hva skal barnet ha på seg?", "What should my child wear?"),
        (
            "Komfortable klær som tåler litt støv og lim — gjerne noe dere ikke er redde for får\n                flekker. Vi stiller med forkle og materialer.",
            "Comfortable clothes that can get a little messy! Choose something you don't mind\n                getting dusty or covered in glue. We provide aprons and all necessary protective gear.",
        ),
        (
            "Hva om barnet ikke liker å tegne, men liker å bygge?",
            "What if my child doesn't like drawing, but loves building?",
        ),
        (
            "Det er helt normalt. Skisseboka er et verktøy, ikke et krav — mange prosjekter\n                starter med bygging og materialer. Instruktøren tilpasser tempo og metode.",
            "That is completely normal! The sketchbook is just a tool, not a strict requirement —\n                many of our projects start directly with materials and building. Our instructors adapt\n                the pace and teaching methods to match every child's unique interests.",
        ),
        (
            "Kan søsken i ulike aldre melde interesse?",
            "Can I register interest for siblings of different ages?",
        ),
        (
            "Ja. Meld interesse for hvert barn, eller skriv i skjemaet hvor mange barn dere\n                vurderer. Vi planlegger grupper innenfor aldersspennet 5–9 år.",
            "Yes! You can fill out a separate form for each child or simply note in the form how\n                many children you are considering. Our groups are designed for the 5–9 age range.",
        ),
        ("Hva koster kurset?", "How much does the course cost?"),
        (
            "Ca. 2 990 kr for hele kurset (8 uker), materialer inkludert. Dette er et foreløpig\n                overslag — endelig pris bekreftes ved oppstart.",
            "Approximately NOK 2,990 for the full 8-week program, with all materials included. This\n                is a preliminary estimate, and the final price will be confirmed at launch.",
        ),
        (
            "Er det bindende å melde interesse?",
            "Is registering interest binding?",
        ),
        (
            "Nei. Du får tidlig info om oppstart, plass og pris i Trosterud — uten forpliktelse.\n                Meld interesse bare hvis du vil holde deg oppdatert.",
            "Not at all. You'll receive early updates regarding the start date, location, and final\n                pricing in Trosterud with zero obligation.",
        ),
        (
            "Får vi info før første kursdag?",
            "Will we receive details before the course begins?",
        ),
        (
            "Ja. De som melder interesse får beskjed først om dato, sted, pris og praktisk\n                informasjon når kurset er klart til oppstart.",
            "Absolutely. Everyone who registers interest will be the first to know the exact start\n                date, venue address, pricing, and practical details once launch dates are finalized.",
        ),
        ("Hvor i Oslo er verkstedet?", "Where in Oslo is the workshop located?"),
        (
            "Planlagt lokasjon er Trosterud — sentralt for familier på Oslo øst. Nærmere adresse\n                og praktisk info sendes til de som står på ventelisten.",
            "The course is planned for Trosterud, making it convenient for families across East Oslo\n                (including Furuset and Lindeberg). Full location details will be sent directly to those\n                on the waitlist.",
        ),
        (
            "Finnes det barnekurs i Oslo øst?",
            "Are there children's courses in east Oslo?",
        ),
        ("Ja. Planlagt på Trosterud, nær Furuset og Lindeberg.", "Yes. Planned in Trosterud, near Furuset and Lindeberg."),
        (
            "Er dette et tegnekurs eller et byggekurs?",
            "Is this a drawing or a building course?",
        ),
        (
            "Begge deler. Barna bygger og tegner; skisseboka er et verktøy, ikke et krav.",
            "It's both! Kids get to draw and build. The sketchbook is just one of many creative\n                tools, not a strict requirement.",
        ),
        ("Når starter kurset?", "When does the course start?"),
        (
            "Planlagt oppstart i september. Eksakt dato sendes til de som melder interesse.",
            "The planned launch is in September. Exact dates will be sent directly to everyone who\n                registers interest.",
        ),
        (
            "Meld interesse for å få tidlig info om oppstart og plass i Trosterud. Ca.-pris nå er 2\n            990 kr for 8 uker — endelig pris bekreftes ved oppstart. Ingen forpliktelse.",
            "Register interest to get early info about launch and a place in Trosterud. Approx. price is NOK 2,990 for 8 weeks — final price confirmed at launch. No obligation.",
        ),
        (
            "Vi samler interesse fra familier i området og tar kontakt når kurset er klart. Jo\n            tidligere du melder interesse, jo lettere er det å planlegge grupper og tidspunkt.",
            "We are currently gathering interest from local families in the area and will reach out\n            as soon as registration officially opens. The earlier you sign up, the better we can\n            tailor group sizes and schedules to fit everyone's needs.",
        ),
        (
            "Fyll inn skjemaet under — vi kontakter deg når kurset åpner i Trosterud. E-posten din\n            brukes bare til oppdateringer om Skaperverkstedet.",
            "Fill in the form below — we'll reach out as soon as registration opens in Trosterud.",
        ),
        (
            "*Alle aktiviteter tilpasses barnas alder, gjennomføres under oppsyn og med hensyn til\n            barnas sikkerhet.",
            "*All activities are age-adapted, fully supervised, and designed with your child's safety first.",
        ),
        (
            "placeholder=\"Fortell kort hva barnet liker å bygge, tegne eller skape\"",
            "placeholder=\"Briefly describe what your child likes to build, draw or make\"",
        ),
        (
            "placeholder=\"Del gjerne hva dere savner i nærmiljøet\"",
            "placeholder=\"Feel free to share what you miss in your neighbourhood\"",
        ),
        (
            "Meld interesse for tidlig info om oppstart, plass og pris i Trosterud — ingen\n                forpliktelse.",
            "Register interest for early info about launch, place and price in Trosterud — no\n                obligation.",
        ),
        (
            'alt="Barn som bygger og skaper på Formaa-Skaperverksted"',
            'alt="Children building and creating at Formaa Creative Workshop"',
        ),
        (
            'alt="Formaa-designer som veileder barn i verkstedet"',
            'alt="Formaa designer guiding children in the workshop"',
        ),
        ('href="/"', 'href="/en/"'),
    ]
    for old, new in more:
        html = html.replace(old, new)

    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
