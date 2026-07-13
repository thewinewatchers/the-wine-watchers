import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://www.thewinewatchers.com";

export const metadata: Metadata = {
  title: "Millésimes des grands vins | The Wine Watchers",
  description:
    "Découvrez les grands vins disponibles chez The Wine Watchers, classés par millésime : Bordeaux, Bourgogne, Rhône, Italie, Espagne et grands vins du monde.",
  alternates: {
    canonical: `${SITE_URL}/millesimes`,
  },
  openGraph: {
    title: "Millésimes des grands vins | The Wine Watchers",
    description:
      "Explorez notre sélection de grands vins par millésime et retrouvez les bouteilles disponibles dans notre catalogue.",
    url: `${SITE_URL}/millesimes`,
    siteName: "The Wine Watchers",
    type: "website",
  },
};

type WineRow = {
  id: string;
  vintage: string | number | null;
  hidden_from_site?: boolean | null;
};

type VintageItem = {
  year: string;
  count: number;
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

function normalizeVintage(value: string | number | null) {
  if (value === null || value === undefined) return null;

  const normalizedValue = String(value).trim();

  if (!/^\d{4}$/.test(normalizedValue)) return null;

  const year = Number(normalizedValue);
  const currentYear = new Date().getFullYear();

  if (year < 1800 || year > currentYear + 1) return null;

  return normalizedValue;
}

async function getAvailableVintages(): Promise<VintageItem[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("wines")
    .select("id, vintage, hidden_from_site")
    .order("vintage", { ascending: false });

  if (error) {
    console.error(
      "Erreur lors du chargement des millésimes :",
      error.message
    );

    return [];
  }

  const vintageCounts = new Map<string, number>();

  for (const wine of (data ?? []) as WineRow[]) {
    if (wine.hidden_from_site === true) continue;

    const year = normalizeVintage(wine.vintage);

    if (!year) continue;

    vintageCounts.set(year, (vintageCounts.get(year) ?? 0) + 1);
  }

  return Array.from(vintageCounts.entries())
    .map(([year, count]) => ({
      year,
      count,
    }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

function groupVintagesByDecade(vintages: VintageItem[]) {
  const groups = new Map<string, VintageItem[]>();

  for (const vintage of vintages) {
    const decadeStart = Math.floor(Number(vintage.year) / 10) * 10;
    const decadeLabel = `Années ${decadeStart}`;

    const existingGroup = groups.get(decadeLabel) ?? [];
    existingGroup.push(vintage);
    groups.set(decadeLabel, existingGroup);
  }

  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    items,
  }));
}

function getVintageLabel(year: string) {
  if (year === "2025") {
    return "Millésime 2025 · Primeurs";
  }

  return `Millésime ${year}`;
}

function getWineCountLabel(count: number) {
  return count === 1 ? "1 vin disponible" : `${count} vins disponibles`;
}

export default async function MillesimesPage() {
  const vintages = await getAvailableVintages();
  const vintageGroups = groupVintagesByDecade(vintages);

  const totalWines = vintages.reduce(
    (total, vintage) => total + vintage.count,
    0
  );

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Millésimes des grands vins",
    description:
      "Sélection de grands vins classés par millésime chez The Wine Watchers.",
    url: `${SITE_URL}/millesimes`,
    isPartOf: {
      "@type": "WebSite",
      name: "The Wine Watchers",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: vintages.length,
      itemListElement: vintages.map((vintage, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `Vins du millésime ${vintage.year}`,
        url: `${SITE_URL}/millesime/${vintage.year}`,
      })),
    },
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
          __html: JSON.stringify(collectionPageJsonLd),
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
          padding: "88px 24px 72px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background:
            "radial-gradient(circle at top, rgba(140, 82, 96, 0.22), transparent 48%)",
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
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "30px",
              color: "rgba(255,255,255,0.68)",
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

            <span aria-hidden="true">/</span>

            <span style={{ color: "#ffffff" }}>Millésimes</span>
          </nav>

          <div
            style={{
              maxWidth: "840px",
            }}
          >
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
              The Wine Watchers
            </p>

            <h1
              style={{
                margin: 0,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(42px, 7vw, 76px)",
                lineHeight: 1.02,
                fontWeight: 500,
                letterSpacing: "-0.03em",
              }}
            >
              Grands vins par millésime
            </h1>

            <p
              style={{
                margin: "28px 0 0",
                maxWidth: "760px",
                color: "rgba(255,255,255,0.76)",
                fontSize: "18px",
                lineHeight: 1.8,
              }}
            >
              Explorez notre sélection de grands vins classés par année et
              retrouvez les bouteilles disponibles parmi les plus prestigieux
              domaines de Bordeaux, Bourgogne, Rhône, Italie, Espagne et des
              grandes régions viticoles du monde.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginTop: "34px",
              }}
            >
              <div
                style={{
                  padding: "12px 18px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.86)",
                  fontSize: "14px",
                }}
              >
                {vintages.length} millésime
                {vintages.length > 1 ? "s" : ""}
              </div>

              <div
                style={{
                  padding: "12px 18px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.86)",
                  fontSize: "14px",
                }}
              >
                {totalWines} vin{totalWines > 1 ? "s" : ""} disponible
                {totalWines > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "70px 24px 96px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1180px",
            margin: "0 auto",
          }}
        >
          {vintageGroups.length === 0 ? (
            <div
              style={{
                padding: "48px 28px",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.035)",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "32px",
                  fontWeight: 500,
                }}
              >
                Aucun millésime disponible
              </h2>

              <p
                style={{
                  margin: "16px auto 0",
                  maxWidth: "620px",
                  color: "rgba(255,255,255,0.68)",
                  lineHeight: 1.7,
                }}
              >
                Les vins actuellement visibles dans le catalogue ne disposent
                pas encore d’un millésime exploitable.
              </p>

              <Link
                href="/boutique"
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
                Voir le catalogue
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "64px",
              }}
            >
              {vintageGroups.map((group) => (
                <section key={group.label}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      gap: "20px",
                      flexWrap: "wrap",
                      marginBottom: "24px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 8px",
                          color: "#c99ca7",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                        }}
                      >
                        Sélection par année
                      </p>

                      <h2
                        style={{
                          margin: 0,
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: "clamp(30px, 4vw, 46px)",
                          fontWeight: 500,
                        }}
                      >
                        {group.label}
                      </h2>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.58)",
                        fontSize: "14px",
                      }}
                    >
                      {group.items.length} année
                      {group.items.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(230px, 1fr))",
                      gap: "18px",
                    }}
                  >
                    {group.items.map((vintage) => (
                      <Link
                        key={vintage.year}
                        href={`/millesime/${vintage.year}`}
                        style={{
                          display: "block",
                          position: "relative",
                          minHeight: "210px",
                          padding: "26px",
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.11)",
                          borderRadius: "22px",
                          background:
                            "linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025))",
                          color: "#ffffff",
                          textDecoration: "none",
                          boxShadow: "0 18px 45px rgba(0,0,0,0.16)",
                        }}
                      >
                        <div
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            right: "-18px",
                            bottom: "-30px",
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontSize: "96px",
                            lineHeight: 1,
                            color: "rgba(255,255,255,0.035)",
                            pointerEvents: "none",
                          }}
                        >
                          {vintage.year}
                        </div>

                        <div
                          style={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            minHeight: "158px",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                margin: 0,
                                color: "#d4aab4",
                                fontSize: "12px",
                                fontWeight: 700,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                              }}
                            >
                              Découvrir
                            </p>

                            <h3
                              style={{
                                margin: "12px 0 0",
                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",
                                fontSize: "32px",
                                fontWeight: 500,
                                lineHeight: 1.15,
                              }}
                            >
                              {getVintageLabel(vintage.year)}
                            </h3>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "14px",
                              marginTop: "24px",
                            }}
                          >
                            <span
                              style={{
                                color: "rgba(255,255,255,0.66)",
                                fontSize: "14px",
                              }}
                            >
                              {getWineCountLabel(vintage.count)}
                            </span>

                            <span
                              aria-hidden="true"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "38px",
                                height: "38px",
                                border: "1px solid rgba(255,255,255,0.17)",
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.055)",
                                fontSize: "18px",
                              }}
                            >
                              →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          <section
            style={{
              marginTop: "76px",
              padding: "38px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "26px",
              background: "rgba(255,255,255,0.035)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "34px",
                alignItems: "center",
              }}
            >
              <div>
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
                  Comprendre les millésimes
                </p>

                <h2
                  style={{
                    margin: 0,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "clamp(28px, 4vw, 42px)",
                    fontWeight: 500,
                    lineHeight: 1.15,
                  }}
                >
                  Chaque année révèle une expression différente du terroir
                </h2>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "16px",
                    lineHeight: 1.8,
                  }}
                >
                  Le millésime traduit les conditions climatiques d’une année,
                  mais aussi les choix du domaine, le terroir et la maturité des
                  raisins. Parcourir les vins par année permet de comparer les
                  styles, les régions, les producteurs et les potentiels de
                  garde.
                </p>

                <Link
                  href="/boutique"
                  style={{
                    display: "inline-flex",
                    marginTop: "24px",
                    padding: "13px 22px",
                    borderRadius: "999px",
                    background: "#ffffff",
                    color: "#1c0b0f",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Explorer tous les vins
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}