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
    .map(([year, count]) => ({ year, count }))
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
  return year === "2025"
    ? "Millésime 2025 · Primeurs"
    : `Millésime ${year}`;
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
    <main className="min-h-screen bg-white text-stone-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <nav
          aria-label="Fil d’Ariane"
          className="flex flex-wrap items-center gap-2 text-sm text-stone-500"
        >
          <Link href="/" className="hover:text-[#8a1f1f]">
            Accueil
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Millésimes</span>
        </nav>

        <header className="mt-6 border-b border-stone-200 pb-6">
          <h1 className="font-serif text-3xl md:text-4xl">
            Grands vins par millésime
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            Explorez notre sélection de grands vins classés par année et
            retrouvez les bouteilles disponibles parmi les plus prestigieux
            domaines de Bordeaux, Bourgogne, Rhône, Italie, Espagne et des
            grandes régions viticoles du monde.
          </p>

          <p className="mt-4 text-sm text-stone-500">
            {vintages.length} millésime{vintages.length > 1 ? "s" : ""}
            {" · "}
            {totalWines} vin{totalWines > 1 ? "s" : ""} disponible
            {totalWines > 1 ? "s" : ""}
          </p>
        </header>

        <div className="py-6">
          {vintageGroups.length === 0 ? (
            <div className="rounded-lg border border-stone-200 p-6">
              <h2 className="font-serif text-2xl">
                Aucun millésime disponible
              </h2>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                Les vins actuellement visibles dans le catalogue ne disposent
                pas encore d’un millésime exploitable.
              </p>

              <Link
                href="/boutique"
                className="mt-4 inline-block text-sm text-[#8a1f1f] hover:underline"
              >
                Voir le catalogue →
              </Link>
            </div>
          ) : (
            <div className="space-y-7">
              {vintageGroups.map((group) => (
                <section key={group.label}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-serif text-2xl">{group.label}</h2>

                    <p className="text-xs text-stone-500">
                      {group.items.length} année
                      {group.items.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {group.items.map((vintage) => (
                      <Link
                        key={vintage.year}
                        href={`/millesime/${vintage.year}`}
                        className="group rounded-lg border border-stone-200 p-4 transition-colors hover:border-[#8a1f1f] hover:bg-stone-50"
                      >
                        <h3 className="font-serif text-xl text-[#591c24]">
                          {getVintageLabel(vintage.year)}
                        </h3>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-xs text-stone-500">
                            {getWineCountLabel(vintage.count)}
                          </span>

                          <span
                            aria-hidden="true"
                            className="text-stone-400 group-hover:text-[#8a1f1f]"
                          >
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <section className="mt-3 border-t border-stone-200 pt-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#8a1f1f]">
            Comprendre les millésimes
          </p>

          <h2 className="mt-3 font-serif text-2xl">
            Chaque année révèle une expression différente du terroir
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            Le millésime traduit les conditions climatiques d’une année,
            mais aussi les choix du domaine, le terroir et la maturité des
            raisins. Parcourir les vins par année permet de comparer les
            styles, les régions, les producteurs et les potentiels de garde.
          </p>

          <Link
            href="/boutique"
            className="mt-5 inline-block rounded bg-[#8a1f1f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#641313]"
          >
            Explorer tous les vins
          </Link>
        </section>
      </div>
    </main>
  );
}