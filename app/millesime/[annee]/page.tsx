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

  const rawValue = String(value).trim().replace(/[€\s]/g, "");
  if (!rawValue) return null;

  const cleanedValue = rawValue.includes(",")
    ? rawValue.replace(/\./g, "").replace(",", ".")
    : rawValue;

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
  const image = wine.image?.trim() || "";

  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;

  return `/${image.replace(/\\/g, "/").replace(/^\/+/, "")}`;
}

function getWineUrl(wine: Wine) {
  return `/boutique/vin/${wine.slug?.trim() || wine.id}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProducerHref(producer?: string | null) {
  const producerSlug = slugify(String(producer || "").trim());

  if (!producerSlug) return "";

  if (producerSlug === "domaine-armand-rousseau") {
    return "/producteur/armand-rousseau";
  }

  if (producerSlug === "opus-one-winery" || producerSlug === "opus-one") {
    return "/producteur/opus-one";
  }

  return `/producteur/${producerSlug}`;
}

const DEDICATED_APPELLATION_SLUGS = new Set([
  "pauillac",
  "margaux",
  "saint-julien",
  "saint-estephe",
  "pomerol",
  "saint-emilion",
  "pessac-leognan",
  "sauternes",
  "cote-de-nuits",
  "cote-de-beaune",
  "chablis",
  "meursault",
  "puligny-montrachet",
  "gevrey-chambertin",
  "vosne-romanee",
  "chambolle-musigny",
  "cote-rotie",
  "hermitage",
  "cornas",
  "saint-joseph",
  "chateauneuf-du-pape",
  "gigondas",
  "toscane",
  "piemont",
  "barolo",
  "barbaresco",
  "brunello-di-montalcino",
  "bolgheri",
  "super-toscans",
  "ribera-del-duero",
  "rioja",
  "priorat",
  "toro",
  "rias-baixas",
  "napa-valley",
  "sonoma",
  "oakville",
  "rutherford",
  "stags-leap-district",
  "champagne",
  "montagne-de-reims",
  "vallee-de-la-marne",
  "cote-des-blancs",
  "cote-des-bar",
]);

function getAppellationHref(appellation?: string | null) {
  const appellationSlug = slugify(String(appellation || "").trim());

  if (!appellationSlug || !DEDICATED_APPELLATION_SLUGS.has(appellationSlug)) {
    return "";
  }

  return `/appellation/${appellationSlug}`;
}

function getRegionHref(region?: string | null) {
  const regionSlug = slugify(String(region || "").trim());

  if (!regionSlug) return "";

  const bordeauxRegions = new Set([
    "bordeaux", "pauillac", "margaux", "saint-julien",
    "saint-estephe", "pomerol", "saint-emilion",
    "pessac-leognan", "sauternes",
  ]);

  const bourgogneRegions = new Set([
    "bourgogne", "cote-de-nuits", "cote-de-beaune", "chablis",
    "gevrey-chambertin", "vosne-romanee", "chambolle-musigny",
    "meursault", "puligny-montrachet",
  ]);

  const rhoneRegions = new Set([
    "rhone", "vallee-du-rhone", "cote-rotie", "hermitage",
    "cornas", "saint-joseph", "chateauneuf-du-pape", "gigondas",
  ]);

  const spanishRegions = new Set([
    "espagne", "castille-et-leon", "castille-leon",
    "castilla-y-leon", "ribera-del-duero", "rioja",
    "priorat", "toro", "rias-baixas",
  ]);

  const italianRegions = new Set([
    "italie", "italia", "toscane", "toscana", "piemont",
    "piedmont", "barolo", "barbaresco", "bolgheri",
  ]);

  const usaRegions = new Set([
    "usa", "etats-unis", "etats-unis-d-amerique",
    "united-states", "californie", "california", "napa",
    "napa-valley", "sonoma", "oakville", "rutherford",
    "stags-leap-district",
  ]);

  const champagneRegions = new Set([
    "champagne", "montagne-de-reims", "vallee-de-la-marne",
    "cote-des-blancs", "cote-des-bar",
  ]);

  if (bordeauxRegions.has(regionSlug)) return "/boutique/bordeaux";
  if (bourgogneRegions.has(regionSlug)) return "/boutique/bourgogne";
  if (rhoneRegions.has(regionSlug)) return "/boutique/rhone";
  if (spanishRegions.has(regionSlug)) return "/boutique/espagne";
  if (italianRegions.has(regionSlug)) return "/boutique/italie";
  if (usaRegions.has(regionSlug)) return "/boutique/usa";
  if (champagneRegions.has(regionSlug)) return "/boutique/champagne";

  return "";
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
    <main className="min-h-screen bg-white text-stone-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(
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

          <Link
            href="/millesimes"
            className="hover:text-[#8a1f1f]"
          >
            Millésimes
          </Link>

          <span aria-hidden="true">/</span>
          <span aria-current="page">{year}</span>
        </nav>

        <header className="mt-6 border-b border-stone-200 pb-6">
          <h1 className="font-serif text-3xl md:text-4xl">
            Millésime {year}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            {introduction.text}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-500">
            <p>
              {wines.length} vin{wines.length > 1 ? "s" : ""} disponible
              {wines.length > 1 ? "s" : ""}
            </p>

            <p>
              {regions.length} région{regions.length > 1 ? "s" : ""}
            </p>
          </div>

          {regions.length > 0 && (
            <nav
              aria-label="Régions de ce millésime"
              className="mt-4 flex flex-wrap gap-x-5 gap-y-2"
            >
              {regions.map((region) => {
                const regionHref = getRegionHref(region);

                return regionHref ? (
                  <Link
                    key={region}
                    href={regionHref}
                    className="text-sm text-[#8a1f1f] hover:underline"
                  >
                    {region}
                  </Link>
                ) : (
                  <span
                    key={region}
                    className="text-sm text-stone-500"
                  >
                    {region}
                  </span>
                );
              })}
            </nav>
          )}
        </header>

        <section
          aria-labelledby="vintage-wines-title"
          className="py-6"
        >
          <h2
            id="vintage-wines-title"
            className="mb-5 font-serif text-2xl"
          >
            Les vins du millésime {year}
          </h2>

          <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wines.map((wine) => {
              const image = getWineImage(wine);
              const wineUrl = getWineUrl(wine);
              const name = getWineName(wine);

              const displayName = name.includes(year)
                ? name
                : `${name} ${year}`;

              const currentPrice = formatPrice(wine.price);
              const comparePrice = formatPrice(wine.compare_at_price);
              const priceValue = parsePrice(wine.price);
              const compareValue = parsePrice(wine.compare_at_price);

              const hasDiscount =
                priceValue !== null &&
                compareValue !== null &&
                priceValue > 0 &&
                compareValue > priceValue;

              const discountPercent = hasDiscount
                ? Math.round(
                    ((compareValue! - priceValue!) / compareValue!) * 100
                  )
                : 0;

              const appellationHref = getAppellationHref(
                wine.appellation
              );
              const producerHref = getProducerHref(wine.producer);
              const regionHref = getRegionHref(wine.region);

              return (
                <article
                  key={wine.id}
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-colors hover:border-[#8a1f1f]"
                >
                  <Link
                    href={wineUrl}
                    aria-label={displayName}
                    className="relative flex h-44 items-center justify-center p-3"
                  >
                    {hasDiscount && (
                      <span className="absolute left-3 top-3 z-10 rounded bg-[#8a1f1f] px-2 py-1 text-xs font-semibold text-white">
                        −{discountPercent} %
                      </span>
                    )}

                    {image ? (
                      <img
                        src={image}
                        alt={displayName}
                        loading="lazy"
                        className="max-h-40 w-auto max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-stone-400">
                        Photo à venir
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-4 pt-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
                      {wine.appellation?.trim() ? (
                        appellationHref ? (
                          <Link
                            href={appellationHref}
                            className="hover:text-[#8a1f1f]"
                          >
                            {wine.appellation.trim()}
                          </Link>
                        ) : (
                          <span>{wine.appellation.trim()}</span>
                        )
                      ) : wine.region?.trim() ? (
                        regionHref ? (
                          <Link
                            href={regionHref}
                            className="hover:text-[#8a1f1f]"
                          >
                            {wine.region.trim()}
                          </Link>
                        ) : (
                          <span>{wine.region.trim()}</span>
                        )
                      ) : (
                        <span>Millésime {year}</span>
                      )}

                      {wine.region?.trim() &&
                        wine.appellation?.trim() &&
                        regionHref && (
                          <>
                            <span aria-hidden="true">·</span>
                            <Link
                              href={regionHref}
                              className="hover:text-[#8a1f1f]"
                            >
                              {wine.region.trim()}
                            </Link>
                          </>
                        )}
                    </div>

                    <Link
                      href={wineUrl}
                      className="mt-2 hover:text-[#8a1f1f]"
                    >
                      <h3 className="font-serif text-lg leading-snug">
                        {displayName}
                      </h3>
                    </Link>

                    {wine.producer?.trim() &&
                      (producerHref ? (
                        <Link
                          href={producerHref}
                          className="mt-1 text-xs text-stone-500 hover:text-[#8a1f1f]"
                        >
                          {wine.producer.trim()}
                        </Link>
                      ) : (
                        <p className="mt-1 text-xs text-stone-500">
                          {wine.producer.trim()}
                        </p>
                      ))}

                    <p className="mt-3 text-xs leading-5 text-stone-600">
                      {[wine.bottle_size, wine.packaging]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    {wine.classification && (
                      <p className="text-xs leading-5 text-stone-500">
                        {wine.classification}
                      </p>
                    )}

                    <div className="mt-auto pt-4">
                      {hasDiscount && comparePrice && (
                        <p className="text-xs text-stone-400 line-through">
                          {comparePrice} HT
                        </p>
                      )}

                      <p className="text-lg font-semibold text-[#8a1f1f]">
                        {currentPrice
                          ? `${currentPrice} HT`
                          : "Prix sur demande"}
                      </p>

                      <Link
                        href={wineUrl}
                        aria-label={`Voir le vin : ${displayName}`}
                        className="mt-3 block rounded border border-[#8a1f1f] px-3 py-2 text-center text-sm font-medium text-[#8a1f1f] transition-colors hover:bg-[#8a1f1f] hover:text-white"
                      >
                        Voir le vin
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-4 text-xs leading-6 text-stone-500">
            Prix affichés hors taxes. TVA calculée lors de la finalisation
            de la commande.
          </p>
        </section>

        <section className="border-t border-stone-200 py-6">
          <p className="text-xs font-medium text-[#8a1f1f]">
            À propos de cette année
          </p>

          <h2 className="mt-3 font-serif text-2xl">
            {introduction.title}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            La qualité d’un millésime ne se résume jamais à une note
            globale. Le terroir, le travail du domaine, la sélection des
            raisins et l’élevage restent déterminants. Cette page réunit
            exclusivement les vins actuellement disponibles dans le
            catalogue The Wine Watchers pour le millésime {year}.
          </p>

          <Link
            href="/millesimes"
            className="mt-5 inline-block text-sm font-medium text-[#8a1f1f] hover:underline"
          >
            ← Voir tous les millésimes
          </Link>
        </section>
      </div>
    </main>
  );
}