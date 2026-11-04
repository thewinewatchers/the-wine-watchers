import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.thewinewatchers.com";

export const metadata: Metadata = {
  title: "À propos de The Wine Watchers SL",
  description:
    "Découvrez The Wine Watchers SL, société espagnole basée à Roses, spécialisée dans la sélection de grands vins, crus rares et millésimes d’exception.",
  alternates: {
    canonical: "/a-propos",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/a-propos`,
    title: "À propos de The Wine Watchers SL",
    description:
      "The Wine Watchers SL est une société espagnole basée à Roses, spécialisée dans la sélection de grands vins et crus rares.",
    siteName: "The Wine Watchers",
    locale: "fr_FR",
  },
};

const aboutPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/a-propos#aboutpage`,
  url: `${SITE_URL}/a-propos`,
  name: "À propos de The Wine Watchers SL",
  description:
    "Présentation officielle de The Wine Watchers SL, société espagnole basée à Roses et spécialisée dans la sélection de grands vins.",
  inLanguage: "fr-FR",
  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },
  about: {
    "@id": `${SITE_URL}/#organization`,
  },
  mainEntity: {
    "@id": `${SITE_URL}/#organization`,
  },
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
};

const sectionClass = "border-b border-stone-200 py-6";
const headingClass = "mb-4 font-serif text-2xl text-stone-900";
const paragraphClass = "mb-4 text-sm leading-7 text-stone-600";
const linkClass = "text-[#8a1f1f] underline underline-offset-4";

export default function APropos() {
  return (
    <main className="min-h-screen bg-white text-stone-800">
      <script
        id="structured-data-about-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageStructuredData).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <article className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <nav
          aria-label="Fil d’Ariane"
          className="flex flex-wrap items-center gap-2 text-sm text-stone-500"
        >
          <Link href="/" className="hover:text-[#8a1f1f]">
            Accueil
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">À propos</span>
        </nav>

        <header className="mt-6 border-b border-stone-200 pb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#8a1f1f]">
            The Wine Watchers SL
          </p>

          <h1 className="mt-3 font-serif text-3xl md:text-4xl">
            À propos de The Wine Watchers
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
            Une passion pour les grands vins, au service des amateurs,
            collectionneurs et professionnels les plus exigeants.
          </p>
        </header>

        <div className="max-w-4xl">
          <section className={sectionClass}>
            <h2 className={headingClass}>
              Une société espagnole dédiée aux grands vins
            </h2>

            <p className={paragraphClass}>
              The Wine Watchers SL est une société espagnole établie à Roses,
              sur la Costa Brava, dans la province de Girona. Depuis sa
              création, notre ambition est simple : proposer aux amateurs,
              collectionneurs et professionnels une sélection rigoureuse des
              plus grands vins du monde, en privilégiant l’authenticité, la
              qualité et la pérennité de chaque bouteille.
            </p>

            <p className={paragraphClass}>
              Le vin d’exception est bien plus qu’un produit de consommation.
              Il est l’expression d’un terroir, d’un climat, d’un savoir-faire
              transmis de génération en génération et d’une histoire qui se
              construit au fil des millésimes. C’est cette conviction qui
              guide chacune de nos sélections.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              Une sélection construite autour des plus grands terroirs
            </h2>

            <p className={paragraphClass}>
              Notre catalogue est volontairement centré sur les domaines et
              les appellations qui font référence à l’échelle internationale.
            </p>

            <p className={paragraphClass}>
              <Link href="/boutique/bordeaux" className={linkClass}>
                Bordeaux
              </Link>{" "}
              occupe naturellement une place majeure avec les Premiers Grands
              Crus Classés, les grandes propriétés de la rive droite et les
              plus belles signatures de Pomerol, Saint-Émilion, Pauillac,
              Margaux, Saint-Julien, Saint-Estèphe ou Pessac-Léognan.
            </p>

            <p className={paragraphClass}>
              <Link href="/boutique/bourgogne" className={linkClass}>
                La Bourgogne
              </Link>{" "}
              constitue également l’un des piliers de notre sélection. Les
              grands climats de la Côte de Nuits, de la Côte de Beaune et de
              Chablis côtoient les domaines les plus prestigieux, dont les
              cuvées figurent parmi les vins les plus recherchés au monde.
            </p>

            <p className={paragraphClass}>
              Notre sélection s’étend également à la{" "}
              <Link href="/boutique/rhone" className={linkClass}>
                Vallée du Rhône
              </Link>
              , à{" "}
              <Link href="/boutique/italie" className={linkClass}>
                l’Italie
              </Link>
              , à{" "}
              <Link href="/boutique/espagne" className={linkClass}>
                l’Espagne
              </Link>{" "}
              ainsi qu’à quelques grands domaines internationaux dont la
              réputation dépasse largement leurs frontières.
            </p>

            <p className={paragraphClass}>
              Chaque vin proposé répond à une exigence commune : représenter
              fidèlement son terroir et offrir un véritable potentiel de
              garde ou de dégustation.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              Une expertise tournée vers les grands crus
            </h2>

            <p className={paragraphClass}>
              Nous accordons une attention particulière aux propriétés dont
              la régularité qualitative est reconnue depuis plusieurs
              décennies.
            </p>

            <p className={paragraphClass}>
              Au-delà de la réputation d’un domaine, nous analysons également
              chaque millésime afin de proposer des vins présentant un réel
              intérêt pour l’amateur comme pour le collectionneur. Cette
              approche permet d’offrir une sélection cohérente, composée aussi
              bien de grands classiques que de cuvées plus confidentielles.
            </p>

            <p className={paragraphClass}>
              Notre objectif n’est pas de proposer le plus grand nombre de
              références, mais de sélectionner celles qui méritent
              véritablement leur place au sein de notre catalogue.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Primeurs et grands millésimes</h2>

            <p className={paragraphClass}>
              Les campagnes de Bordeaux Primeurs constituent un rendez-vous
              incontournable pour de nombreux passionnés. The Wine Watchers
              accompagne cette actualité en proposant une sélection de vins
              disponibles en souscription, permettant d’acquérir certains des
              plus grands crus dès leur mise en marché.
            </p>

            <p className={paragraphClass}>
              Parallèlement, notre catalogue rassemble des millésimes récents,
              des vins prêts à boire ainsi que des bouteilles plus anciennes
              destinées aux amateurs souhaitant enrichir leur cave ou
              compléter une collection.
            </p>

            <p className={paragraphClass}>
              Retrouvez notre sélection consacrée aux{" "}
              <Link href="/boutique/primeurs-2025" className={linkClass}>
                Bordeaux Primeurs 2025
              </Link>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              Authenticité, provenance et traçabilité
            </h2>

            <p className={paragraphClass}>
              La confiance constitue l’un des fondements de notre activité.
            </p>

            <p className={paragraphClass}>
              Nous accordons une importance particulière à l’origine des vins
              proposés, à leur état de conservation et à la qualité des
              informations présentées sur chaque fiche produit. Chaque
              référence fait l’objet d’une présentation détaillée permettant
              de mieux comprendre son histoire, son terroir et son style.
            </p>

            <p className={paragraphClass}>
              Notre objectif est de permettre à chaque client d’acheter en
              toute confiance, avec une information claire, transparente et
              fiable.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              Une clientèle européenne et internationale
            </h2>

            <p className={paragraphClass}>
              Implantée en Espagne, The Wine Watchers SL s’adresse à une
              clientèle européenne composée de particuliers, de
              collectionneurs, de restaurateurs et de professionnels du vin.
            </p>

            <p className={paragraphClass}>
              Grâce à une organisation adaptée et à une logistique
              spécialisée, nous proposons des solutions d’expédition répondant
              aux exigences du transport des grands vins, tout en veillant
              au respect des conditions nécessaires à leur bonne conservation.
            </p>

            <p className={paragraphClass}>
              Les informations relatives aux destinations desservies et aux
              conditions d’expédition sont disponibles sur notre page{" "}
              <Link href="/livraison" className={linkClass}>
                Livraison
              </Link>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              Une expérience fondée sur la connaissance
            </h2>

            <p className={paragraphClass}>
              Au-delà de la vente de vins, The Wine Watchers développe une
              bibliothèque de contenus consacrés aux domaines, aux
              appellations, aux grands terroirs et aux millésimes.
            </p>

            <p className={paragraphClass}>
              Chaque fiche producteur, chaque présentation d’appellation et
              chaque article publié sur notre site ont pour vocation
              d’apporter un éclairage utile aux passionnés comme aux
              acheteurs souhaitant approfondir leurs connaissances.
            </p>

            <p className={paragraphClass}>
              Nous sommes convaincus qu’un grand vin mérite d’être présenté
              avec le même soin que celui apporté à son élaboration.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Notre engagement</h2>

            <p className={paragraphClass}>
              Notre engagement est de proposer une sélection exigeante de
              grands vins, accompagnée d’une information de qualité, d’un
              service attentif et d’une relation de confiance durable avec
              chacun de nos clients.
            </p>

            <p className={paragraphClass}>
              Installée à Roses, en Catalogne, The Wine Watchers SL poursuit
              un objectif simple : devenir une référence européenne pour
              tous ceux qui recherchent les plus grands vins avec le même
              niveau d’exigence que celui des propriétés qui les produisent.
            </p>
          </section>
        </div>

        <footer className="flex flex-wrap gap-3 pt-6">
          <Link
            href="/boutique"
            className="rounded bg-[#8a1f1f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#641313]"
          >
            Découvrir la boutique
          </Link>

          <Link
            href="/contact"
            className="rounded border border-stone-300 px-5 py-3 text-sm font-medium text-[#8a1f1f] transition-colors hover:border-[#8a1f1f]"
          >
            Nous contacter
          </Link>
        </footer>
      </article>
    </main>
  );
}