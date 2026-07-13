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

const sectionStyle = {
  marginTop: 54,
};

const headingStyle = {
  fontSize: "clamp(28px, 4vw, 40px)",
  lineHeight: 1.2,
  margin: "0 0 20px",
  color: "#fffaf3",
};

const paragraphStyle = {
  fontSize: "clamp(17px, 2vw, 20px)",
  lineHeight: 1.85,
  color: "#e8dccb",
  margin: "0 0 22px",
};

const textLinkStyle = {
  color: "#e2c17f",
  textDecoration: "underline",
  textUnderlineOffset: 4,
};

export default function APropos() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(124, 62, 76, 0.26), transparent 38%), linear-gradient(135deg, #16080b, #2b0f16)",
        padding: "80px 24px 100px",
        fontFamily: "Georgia, serif",
        color: "#fffaf3",
      }}
    >
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

      <article
        style={{
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <header
          style={{
            paddingBottom: 42,
            borderBottom: "1px solid rgba(214, 179, 106, 0.28)",
          }}
        >
          <p
            style={{
              letterSpacing: 6,
              color: "#d6b36a",
              fontSize: 14,
              fontWeight: 700,
              margin: 0,
            }}
          >
            THE WINE WATCHERS SL
          </p>

          <h1
            style={{
              fontSize: "clamp(46px, 8vw, 72px)",
              lineHeight: 1.05,
              margin: "22px 0 26px",
              fontWeight: 500,
            }}
          >
            À propos de The Wine Watchers
          </h1>

          <p
            style={{
              fontSize: "clamp(20px, 3vw, 25px)",
              lineHeight: 1.65,
              color: "#eadfce",
              maxWidth: 850,
              margin: 0,
            }}
          >
            Une passion pour les grands vins, au service des amateurs,
            collectionneurs et professionnels les plus exigeants.
          </p>
        </header>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            Une société espagnole dédiée aux grands vins
          </h2>

          <p style={paragraphStyle}>
            The Wine Watchers SL est une société espagnole établie à Roses, sur
            la Costa Brava, dans la province de Girona. Depuis sa création,
            notre ambition est simple : proposer aux amateurs, collectionneurs
            et professionnels une sélection rigoureuse des plus grands vins du
            monde, en privilégiant l’authenticité, la qualité et la pérennité
            de chaque bouteille.
          </p>

          <p style={paragraphStyle}>
            Le vin d’exception est bien plus qu’un produit de consommation. Il
            est l’expression d’un terroir, d’un climat, d’un savoir-faire
            transmis de génération en génération et d’une histoire qui se
            construit au fil des millésimes. C’est cette conviction qui guide
            chacune de nos sélections.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>
            Une sélection construite autour des plus grands terroirs
          </h2>

          <p style={paragraphStyle}>
            Notre catalogue est volontairement centré sur les domaines et les
            appellations qui font référence à l’échelle internationale.
          </p>

          <p style={paragraphStyle}>
            <Link href="/boutique/bordeaux" style={textLinkStyle}>
              Bordeaux
            </Link>{" "}
            occupe naturellement une place majeure avec les Premiers Grands
            Crus Classés, les grandes propriétés de la rive droite et les plus
            belles signatures de Pomerol, Saint-Émilion, Pauillac, Margaux,
            Saint-Julien, Saint-Estèphe ou Pessac-Léognan.
          </p>

          <p style={paragraphStyle}>
            <Link href="/boutique/bourgogne" style={textLinkStyle}>
              La Bourgogne
            </Link>{" "}
            constitue également l’un des piliers de notre sélection. Les grands
            climats de la Côte de Nuits, de la Côte de Beaune et de Chablis
            côtoient les domaines les plus prestigieux, dont les cuvées
            figurent parmi les vins les plus recherchés au monde.
          </p>

          <p style={paragraphStyle}>
            Notre sélection s’étend également à la{" "}
            <Link href="/boutique/rhone" style={textLinkStyle}>
              Vallée du Rhône
            </Link>
            , à{" "}
            <Link href="/boutique/italie" style={textLinkStyle}>
              l’Italie
            </Link>
            , à{" "}
            <Link href="/boutique/espagne" style={textLinkStyle}>
              l’Espagne
            </Link>{" "}
            ainsi qu’à quelques grands domaines internationaux dont la
            réputation dépasse largement leurs frontières.
          </p>

          <p style={paragraphStyle}>
            Chaque vin proposé répond à une exigence commune : représenter
            fidèlement son terroir et offrir un véritable potentiel de garde ou
            de dégustation.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Une expertise tournée vers les grands crus</h2>

          <p style={paragraphStyle}>
            Nous accordons une attention particulière aux propriétés dont la
            régularité qualitative est reconnue depuis plusieurs décennies.
          </p>

          <p style={paragraphStyle}>
            Au-delà de la réputation d’un domaine, nous analysons également
            chaque millésime afin de proposer des vins présentant un réel
            intérêt pour l’amateur comme pour le collectionneur. Cette approche
            permet d’offrir une sélection cohérente, composée aussi bien de
            grands classiques que de cuvées plus confidentielles.
          </p>

          <p style={paragraphStyle}>
            Notre objectif n’est pas de proposer le plus grand nombre de
            références, mais de sélectionner celles qui méritent véritablement
            leur place au sein de notre catalogue.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Primeurs et grands millésimes</h2>

          <p style={paragraphStyle}>
            Les campagnes de Bordeaux Primeurs constituent un rendez-vous
            incontournable pour de nombreux passionnés. The Wine Watchers
            accompagne cette actualité en proposant une sélection de vins
            disponibles en souscription, permettant d’acquérir certains des
            plus grands crus dès leur mise en marché.
          </p>

          <p style={paragraphStyle}>
            Parallèlement, notre catalogue rassemble des millésimes récents,
            des vins prêts à boire ainsi que des bouteilles plus anciennes
            destinées aux amateurs souhaitant enrichir leur cave ou compléter
            une collection.
          </p>

          <p style={paragraphStyle}>
            Retrouvez notre sélection consacrée aux{" "}
            <Link href="/boutique/primeurs-2025" style={textLinkStyle}>
              Bordeaux Primeurs 2025
            </Link>
            .
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Authenticité, provenance et traçabilité</h2>

          <p style={paragraphStyle}>
            La confiance constitue l’un des fondements de notre activité.
          </p>

          <p style={paragraphStyle}>
            Nous accordons une importance particulière à l’origine des vins
            proposés, à leur état de conservation et à la qualité des
            informations présentées sur chaque fiche produit. Chaque référence
            fait l’objet d’une présentation détaillée permettant de mieux
            comprendre son histoire, son terroir et son style.
          </p>

          <p style={paragraphStyle}>
            Notre objectif est de permettre à chaque client d’acheter en toute
            confiance, avec une information claire, transparente et fiable.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Une clientèle européenne et internationale</h2>

          <p style={paragraphStyle}>
            Implantée en Espagne, The Wine Watchers SL s’adresse à une clientèle
            européenne composée de particuliers, de collectionneurs, de
            restaurateurs et de professionnels du vin.
          </p>

          <p style={paragraphStyle}>
            Grâce à une organisation adaptée et à une logistique spécialisée,
            nous proposons des solutions d’expédition répondant aux exigences
            du transport des grands vins, tout en veillant au respect des
            conditions nécessaires à leur bonne conservation.
          </p>

          <p style={paragraphStyle}>
            Les informations relatives aux destinations desservies et aux
            conditions d’expédition sont disponibles sur notre page{" "}
            <Link href="/livraison" style={textLinkStyle}>
              Livraison
            </Link>
            .
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Une expérience fondée sur la connaissance</h2>

          <p style={paragraphStyle}>
            Au-delà de la vente de vins, The Wine Watchers développe une
            bibliothèque de contenus consacrés aux domaines, aux appellations,
            aux grands terroirs et aux millésimes.
          </p>

          <p style={paragraphStyle}>
            Chaque fiche producteur, chaque présentation d’appellation et
            chaque article publié sur notre site ont pour vocation d’apporter
            un éclairage utile aux passionnés comme aux acheteurs souhaitant
            approfondir leurs connaissances.
          </p>

          <p style={paragraphStyle}>
            Nous sommes convaincus qu’un grand vin mérite d’être présenté avec
            le même soin que celui apporté à son élaboration.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Notre engagement</h2>

          <p style={paragraphStyle}>
            Notre engagement est de proposer une sélection exigeante de grands
            vins, accompagnée d’une information de qualité, d’un service
            attentif et d’une relation de confiance durable avec chacun de nos
            clients.
          </p>

          <p style={paragraphStyle}>
            Installée à Roses, en Catalogne, The Wine Watchers SL poursuit un
            objectif simple : devenir une référence européenne pour tous ceux
            qui recherchent les plus grands vins avec le même niveau d’exigence
            que celui des propriétés qui les produisent.
          </p>
        </section>

        <footer
          style={{
            marginTop: 70,
            paddingTop: 42,
            borderTop: "1px solid rgba(214, 179, 106, 0.28)",
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          <Link
            href="/boutique"
            style={{
              display: "inline-block",
              padding: "15px 30px",
              borderRadius: 999,
              background: "#d6b36a",
              color: "#1f1a17",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Découvrir la boutique
          </Link>

          <Link
            href="/contact"
            style={{
              display: "inline-block",
              padding: "14px 30px",
              borderRadius: 999,
              border: "1px solid rgba(214, 179, 106, 0.65)",
              color: "#fffaf3",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Nous contacter
          </Link>
        </footer>
      </article>
    </main>
  );
}