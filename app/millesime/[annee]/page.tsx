import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://www.thewinewatchers.com";

type Props = {
  params: Promise<{
    annee: string;
  }>;
};

type Wine = {
  id: string;
  slug: string | null;
  name: string | null;
  producer: string | null;
  region: string | null;
  appellation: string | null;
  classification: string | null;
  vintage: string | number | null;
  price: string | number | null;
  compare_at_price: string | number | null;
  image: string | null;
  bottle_size: string | null;
  packaging: string | null;
  hidden_from_site: boolean | null;
};

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont manquantes."
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeVintage(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;

  const normalizedValue = String(value).trim();

  if (!/^\d{4}$/.test(normalizedValue)) return null;

  return normalizedValue;
}

function parsePrice(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const rawValue = String(value).trim();

  if (!rawValue) return null;

  const cleanedValue = rawValue
    .replace(/[€\s]/g, "")
    .replace(",", ".");

  const parsedValue = Number(cleanedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function formatPrice(value: string | number | null | undefined) {
  const parsedPrice = parsePrice(value);

  if (parsedPrice === null) return null;

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsedPrice);
}

function getWineName(wine: Wine) {
  return wine.name?.trim() || "Grand vin";
}

function getWineImage(wine: Wine) {
  return wine.image?.trim() || "/images/wine-placeholder.jpg";
}

function getWineUrl(wine: Wine) {
  return `/boutique/vin/${wine.slug?.trim() || wine.id}`;
}

function getVintageIntroduction(year: string) {
  const introductions: Record<
    string,
    {
      title: string;
      text: string;
    }
  > = {
    "2025": {
      title: "Le millésime 2025 et les grands vins en primeur",
      text:
        "Le millésime 2025 rassemble une sélection de grands vins proposés en primeur. Cette période permet de découvrir les cuvées avant leur mise en bouteille et leur livraison définitive. Chaque domaine exprime son terroir selon les conditions de l’année, avec des profils qui continueront à évoluer au cours de l’élevage.",
    },

    "2022": {
      title: "Un millésime solaire, concentré et remarquable",
      text:
        "Le millésime 2022 se distingue par sa maturité, sa concentration et la profondeur de nombreux vins. Malgré des conditions climatiques exigeantes, les grands terroirs ont produit des cuvées équilibrées, riches et précises. À Bordeaux comme en Bourgogne et dans la vallée du Rhône, les meilleurs vins présentent un potentiel de garde important.",
    },

    "2021": {
      title: "Un millésime de fraîcheur et de précision",
      text:
        "Le millésime 2021 présente souvent des profils plus classiques, portés par la fraîcheur, la finesse aromatique et l’expression du terroir. Les réussites sont particulièrement intéressantes chez les domaines ayant effectué une sélection rigoureuse et parfaitement maîtrisé les conditions climatiques de l’année.",
    },

    "2020": {
      title: "Un millésime structuré et harmonieux",
      text:
        "Le millésime 2020 associe maturité, structure et équilibre. De nombreux grands vins révèlent une belle densité, des tanins précis et une expression aromatique profonde. Il compte parmi les années recherchées pour leur potentiel de vieillissement et leur régularité dans plusieurs grandes régions viticoles.",
    },

    "2019": {
      title: "Un grand millésime d’équilibre et d’élégance",
      text:
        "Le millésime 2019 est reconnu pour son équilibre entre maturité, fraîcheur et précision. Les grands vins possèdent souvent une matière généreuse, des tanins raffinés et une belle intensité aromatique. Cette année offre de nombreuses références capables d’évoluer favorablement en cave.",
    },

    "2018": {
      title: "Un millésime généreux et puissant",
      text:
        "Le millésime 2018 se caractérise par la richesse, la maturité du fruit et la puissance. Dans les meilleurs terroirs, les vins conservent néanmoins une fraîcheur suffisante pour équilibrer leur concentration. Il s’agit d’une année particulièrement intéressante pour les amateurs de styles opulents et structurés.",
    },

    "2016": {
      title: "Un millésime de référence",
      text:
        "Le millésime 2016 est apprécié pour son équilibre, sa profondeur et son potentiel de garde. Les grands vins combinent une maturité parfaitement maîtrisée, une fraîcheur remarquable et des tanins de grande qualité. Cette harmonie en fait une année recherchée par les amateurs et les collectionneurs.",
    },

    "2015": {
      title: "Un millésime mûr, expressif et séduisant",
      text:
        "Le millésime 2015 offre des vins généreux, expressifs et souvent accessibles dès leur jeunesse, tout en conservant un potentiel de garde important. Les meilleurs domaines ont produit des cuvées riches en fruit, dotées de tanins soyeux et d’une belle complexité.",
    },
  };

  return (
    introductions[year] ?? {
      title: `Les grands vins du millésime ${year}`,
      text:
        `Le millésime ${year} permet de découvrir l’expression des grands terroirs et le style propre à chaque domaine au cours de cette année. Les conditions climatiques, la maturité des raisins, les choix de vinification et l’élevage ont façonné des vins aux personnalités variées, destinés aussi bien à la dégustation qu’à la garde.`,
    }
  );
}

async function getWinesByVintage(year: string): Promise<Wine[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("wines")
    .select(
      `
        id,
        slug,
        name,
        producer,
        region,
        appellation,
        classification,
        vintage,
        price,
        compare_at_price,
        image,
        bottle_size,
        packaging,
        hidden_from_site
      `
    )
    .eq("vintage", year)
    .order("region", { ascending: true })
    .order("producer", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error(
      `Erreur Supabase pour le millésime ${year} :`,
      error.message
    );

    return [];
  }

  return ((data ?? []) as Wine[]).filter(
    (wine) =>
      wine.hidden_from_site !== true &&
      normalizeVintage(wine.vintage) === year
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { annee } = await params;
  const year = normalizeVintage(annee);

  if (!year) {
    return {
      title: "Millésime introuvable | The Wine Watchers",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Vins du millésime ${year} | The Wine Watchers`,
    description:
      `Découvrez les grands vins du millésime ${year} disponibles chez The Wine Watchers : Bordeaux, Bourgogne, Rhône, Italie, Espagne et grands vins du monde.`,
    alternates: {
      canonical: `${SITE_URL}/millesime/${year}`,
    },
    openGraph: {
      title: `Vins du millésime ${year} | The Wine Watchers`,
      description:
        `Explorez notre sélection de grands vins du millésime ${year} et les bouteilles actuellement disponibles dans notre catalogue.`,
      url: `${SITE_URL}/millesime/${year}`,
      siteName: "The Wine Watchers",
      type: "website",
    },
  };
}

export default async function MillesimePage({ params }: Props) {
  const { annee } = await params;
  const year = normalizeVintage(annee);

  if (!year) {
    notFound();
  }

  const wines = await getWinesByVintage(year);

  if (wines.length === 0) {
    notFound();
  }

  const introduction = getVintageIntroduction(year);

  const regions = Array.from(
    new Set(
      wines
        .map((wine) => wine.region?.trim())
        .filter((region): region is string => Boolean(region))
    )
  );

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Vins du millésime ${year}`,
    numberOfItems: wines.length,
    itemListElement: wines.map((wine, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${getWineName(wine)} ${year}`,
      url: `${SITE_URL}${getWineUrl(wine)}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Millésimes",
        item: `${SITE_URL}/millesimes`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: year,
        item: `${SITE_URL}/millesime/${year}`,
      },
    ],
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #16080b 0%, #241015 48%, #12070a 100%)",
        color: "#ffffff",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <section
        style={{
          padding: "86px 24px 70px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background:
            "radial-gradient(circle at top, rgba(140,82,96,0.23), transparent 50%)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1180px",
            margin: "0 auto",
          }}
        >
          <nav
            aria-label="Fil d’Ariane"
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "30px",
              color: "rgba(255,255,255,0.64)",
              fontSize: "14px",
            }}
          >
            <Link
              href="/"
              style={{
                color: "rgba(255,255,255,0.72)",
                textDecoration: "none",
              }}
            >
              Accueil
            </Link>

            <span>/</span>

            <Link
              href="/millesimes"
              style={{
                color: "rgba(255,255,255,0.72)",
                textDecoration: "none",
              }}
            >
              Millésimes
            </Link>

            <span>/</span>

            <span style={{ color: "#ffffff" }}>{year}</span>
          </nav>

          <p
            style={{
              margin: "0 0 14px",
              color: "#d8b7bf",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Sélection par année
          </p>

          <h1
            style={{
              margin: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(48px, 9vw, 92px)",
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: "-0.04em",
            }}
          >
            Millésime {year}
          </h1>

          <p
            style={{
              margin: "26px 0 0",
              maxWidth: "780px",
              color: "rgba(255,255,255,0.76)",
              fontSize: "18px",
              lineHeight: 1.8,
            }}
          >
            {introduction.text}
          </p>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                padding: "11px 17px",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.04)",
                fontSize: "14px",
              }}
            >
              {wines.length} vin{wines.length > 1 ? "s" : ""} disponible
              {wines.length > 1 ? "s" : ""}
            </div>

            <div
              style={{
                padding: "11px 17px",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.04)",
                fontSize: "14px",
              }}
            >
              {regions.length} région{regions.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "68px 24px 96px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1180px",
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "34px" }}>
            <p
              style={{
                margin: "0 0 10px",
                color: "#c99ca7",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              Notre sélection
            </p>

            <h2
              style={{
                margin: 0,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(30px, 4vw, 46px)",
                fontWeight: 500,
              }}
            >
              Les vins du millésime {year}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "22px",
            }}
          >
            {wines.map((wine) => {
              const currentPrice = formatPrice(wine.price);
              const comparePrice = formatPrice(wine.compare_at_price);

              return (
                <article
                  key={wine.id}
                  style={{
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "22px",
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))",
                    boxShadow: "0 18px 48px rgba(0,0,0,0.18)",
                  }}
                >
                  <Link
                    href={getWineUrl(wine)}
                    style={{
                      display: "block",
                      color: "#ffffff",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        height: "320px",
                        padding: "24px",
                        background:
                          "linear-gradient(145deg, #f2eee8, #ded7ce)",
                      }}
                    >
                      <img
                        src={getWineImage(wine)}
                        alt={`${getWineName(wine)} ${year}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    </div>

                    <div style={{ padding: "22px" }}>
                      <p
                        style={{
                          margin: 0,
                          color: "#d4aab4",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        {wine.appellation?.trim() ||
                          wine.region?.trim() ||
                          `Millésime ${year}`}
                      </p>

                      <h3
                        style={{
                          margin: "11px 0 0",
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: "23px",
                          lineHeight: 1.25,
                          fontWeight: 500,
                        }}
                      >
                        {getWineName(wine)}
                      </h3>

                      {wine.producer?.trim() &&
                        wine.producer.trim() !== getWineName(wine) && (
                          <p
                            style={{
                              margin: "9px 0 0",
                              color: "rgba(255,255,255,0.62)",
                              fontSize: "14px",
                            }}
                          >
                            {wine.producer.trim()}
                          </p>
                        )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "space-between",
                          gap: "16px",
                          marginTop: "22px",
                        }}
                      >
                        <div>
                          {comparePrice && (
                            <div
                              style={{
                                marginBottom: "4px",
                                color: "rgba(255,255,255,0.46)",
                                fontSize: "13px",
                                textDecoration: "line-through",
                              }}
                            >
                              {comparePrice}
                            </div>
                          )}

                          {currentPrice ? (
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: 700,
                              }}
                            >
                              {currentPrice} HT
                            </div>
                          ) : (
                            <div
                              style={{
                                color: "rgba(255,255,255,0.6)",
                                fontSize: "14px",
                              }}
                            >
                              Prix sur demande
                            </div>
                          )}
                        </div>

                        <span
                          aria-hidden="true"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "40px",
                            height: "40px",
                            flexShrink: 0,
                            border: "1px solid rgba(255,255,255,0.16)",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.05)",
                            fontSize: "18px",
                          }}
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          <section
            style={{
              marginTop: "76px",
              padding: "38px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "26px",
              background: "rgba(255,255,255,0.035)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                color: "#c99ca7",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              À propos de cette année
            </p>

            <h2
              style={{
                margin: 0,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 500,
              }}
            >
              {introduction.title}
            </h2>

            <p
              style={{
                margin: "20px 0 0",
                maxWidth: "850px",
                color: "rgba(255,255,255,0.7)",
                fontSize: "16px",
                lineHeight: 1.85,
              }}
            >
              La qualité d’un millésime ne se résume jamais à une note globale.
              Le terroir, le travail du domaine, la sélection des raisins et
              l’élevage restent déterminants. Cette page réunit exclusivement
              les vins actuellement disponibles dans le catalogue The Wine
              Watchers pour le millésime {year}.
            </p>

            <Link
              href="/millesimes"
              style={{
                display: "inline-flex",
                marginTop: "26px",
                padding: "13px 22px",
                borderRadius: "999px",
                background: "#ffffff",
                color: "#1c0b0f",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Voir tous les millésimes
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}