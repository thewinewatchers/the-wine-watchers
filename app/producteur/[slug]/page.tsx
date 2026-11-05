import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { PRODUCER_EDITORIAL_LIBRARY } from "@/lib/producer-editorial";

type Wine = {
  id: string;
  slug: string | null;
  name: string | null;
  producer: string | null;
  appellation: string | null;
  region: string | null;
  category: string | null;
  vintage: string | number | null;
  price: string | number | null;
  compare_at_price: string | number | null;
  image: string | null;
  classification: string | null;
  bottle_size: string | null;
  packaging: string | null;
  rating: string | number | null;
  hidden_from_site?: boolean | null;
};

type WineGroup = {
  title: string;
  wines: Wine[];
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://www.thewinewatchers.com";

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

function parsePrice(price?: string | number | null) {
  if (price === undefined || price === null || price === "") return 0;

  if (typeof price === "number") {
    return Number.isFinite(price) ? price : 0;
  }

  const raw = String(price).replace(/[€\s]/g, "");
  const cleaned = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;

  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

function formatPrice(price?: string | number | null) {
  const value = parsePrice(price);

  if (value <= 0) return "Prix sur demande";

  return (
    value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € HT"
  );
}

function getDiscountInfo(
  priceValue?: string | number | null,
  compareAtPriceValue?: string | number | null
) {
  const price = parsePrice(priceValue);
  const compareAtPrice = parsePrice(compareAtPriceValue);

  if (price <= 0 || compareAtPrice <= price) return null;

  const saving = compareAtPrice - price;
  const percent = Math.round((saving / compareAtPrice) * 100);

  return { saving, percent };
}

function getWineImage(wine: Wine) {
  const image = String(wine.image || "").trim();

  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;

  return `/${image.replace(/\\/g, "/").replace(/^\/+/, "")}`;
}

function getWineUrl(wine: Wine) {
  return `/boutique/vin/${wine.slug || wine.id}`;
}

function getAbsoluteWineUrl(wine: Wine) {
  return SITE_URL + getWineUrl(wine);
}

function getBoutiqueRegionUrl(region: string) {
  const normalizedRegion = slugify(region);

  const spanishRegions = [
    "castille-et-leon",
    "castille-leon",
    "castilla-y-leon",
    "ribera-del-duero",
    "rioja",
    "priorat",
  ];

  const italianRegions = [
    "toscane",
    "toscana",
    "bolgheri",
    "piemont",
    "piedmont",
    "italie",
    "italia",
  ];

  const usaRegions = [
    "napa-valley",
    "napa",
    "californie",
    "california",
    "etats-unis",
    "etats-unis-d-amerique",
    "usa",
    "united-states",
  ];

  if (spanishRegions.includes(normalizedRegion)) {
    return "/boutique/espagne";
  }

  if (italianRegions.includes(normalizedRegion)) {
    return "/boutique/italie";
  }

  if (usaRegions.includes(normalizedRegion)) {
    return "/boutique/usa";
  }

  return "/boutique/" + normalizedRegion;
}

function getAppellationUrl(
  appellation: string,
  region?: string | null,
  category?: string | null
) {
  const geographicValue = slugify(region || category || "");

  const spanishRegions = [
    "castille-et-leon",
    "castille-leon",
    "castilla-y-leon",
    "ribera-del-duero",
    "rioja",
    "priorat",
    "espagne",
    "spain",
  ];

  const italianRegions = [
    "toscane",
    "toscana",
    "bolgheri",
    "piemont",
    "piedmont",
    "italie",
    "italia",
  ];

  const usaRegions = [
    "napa-valley",
    "napa",
    "californie",
    "california",
    "etats-unis",
    "etats-unis-d-amerique",
    "usa",
    "united-states",
  ];

  if (spanishRegions.includes(geographicValue)) {
    return "/boutique/espagne";
  }

  if (italianRegions.includes(geographicValue)) {
    return "/boutique/italie";
  }

  if (usaRegions.includes(geographicValue)) {
    return "/boutique/usa";
  }

  const appellationSlug = slugify(appellation);

  if (
    appellationSlug === "aoc-champagne" ||
    appellationSlug === "champagne"
  ) {
    return "/appellation/champagne";
  }

  if (
    appellationSlug === "chablis" ||
    appellationSlug === "chablis-1er-cru" ||
    appellationSlug === "chablis-premier-cru" ||
    appellationSlug === "chablis-grand-cru"
  ) {
    return "/appellation/chablis";
  }

  if (
    appellationSlug === "cote-rotie" ||
    appellationSlug === "cotes-rotie"
  ) {
    return "/appellation/cote-rotie";
  }

  return "/appellation/" + appellationSlug;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolveProducer(producers: string[], requestedSlug: string) {
  const exactProducer = producers.find(
    (name) => slugify(name) === requestedSlug
  );

  if (exactProducer) return exactProducer;

  if (requestedSlug === "opus-one") {
    return producers.find((name) => {
      const producerSlug = slugify(name);

      return (
        producerSlug.startsWith("opus-one-") ||
        producerSlug.endsWith("-opus-one") ||
        producerSlug.includes("opus-one")
      );
    });
  }

  if (requestedSlug === "armand-rousseau") {
    return producers.find((name) => {
      const producerSlug = slugify(name);

      return (
        producerSlug === "domaine-armand-rousseau" ||
        producerSlug.endsWith("-armand-rousseau") ||
        producerSlug.includes("armand-rousseau")
      );
    });
  }

  return undefined;
}

function wineBelongsToProducerPage(
  wine: Wine,
  producer: string,
  requestedSlug: string
) {
  if (requestedSlug === "dominio-de-pingus") {
    const searchableValue = slugify(
      [wine.producer, wine.name, wine.slug].filter(Boolean).join(" ")
    );

    return (
      searchableValue.includes("pingus") ||
      searchableValue === "psi" ||
      searchableValue.startsWith("psi-") ||
      searchableValue.includes("-psi-") ||
      searchableValue.endsWith("-psi")
    );
  }

  return wine.producer === producer;
}

function getWineGroupTitle(wine: Wine) {
  const originalName = String(wine.name || "Vin sans nom").trim();
  const producerName = String(wine.producer || "").trim();
  const vintage = String(wine.vintage || "").trim();

  const producerSlug = slugify(producerName);
  const wineNameSlug = slugify(originalName);
  const wineSlug = slugify(String(wine.slug || ""));

  if (producerSlug.includes("romanee-conti")) {
    const drcTitle = originalName
      .replace(/\s+(?:19|20)\d{2}(?:\s+DRC)?$/i, "")
      .replace(/\s+DRC$/i, "")
      .replace(/\s+/g, " ")
      .trim();

    return drcTitle || originalName;
  }

  if (
    producerSlug.includes("opus-one") ||
    wineNameSlug.startsWith("opus-one")
  ) {
    return "Opus One";
  }

  if (
    producerSlug.includes("tenuta-san-guido") ||
    wineNameSlug.includes("sassicaia")
  ) {
    return "Tenuta San Guido";
  }

  if (
    producerSlug.includes("dominio-de-pingus") ||
    producerSlug.includes("dominio-pingus") ||
    wineNameSlug.includes("pingus") ||
    wineNameSlug === "psi" ||
    wineNameSlug.startsWith("psi-") ||
    wineSlug === "psi" ||
    wineSlug.startsWith("psi-")
  ) {
    const searchableWineData = slugify(
      [
        wine.name,
        wine.slug,
        wine.image,
        wine.appellation,
        wine.region,
        wine.category,
      ]
        .filter(Boolean)
        .join(" ")
    );

    const isPsi =
      wineNameSlug === "psi" ||
      wineNameSlug.startsWith("psi-") ||
      wineSlug === "psi" ||
      wineSlug.startsWith("psi-") ||
      searchableWineData === "psi" ||
      searchableWineData.startsWith("psi-") ||
      searchableWineData.includes("-psi-") ||
      searchableWineData.endsWith("-psi");

    if (isPsi) return "PSI";

    const isFlorDePingus =
      searchableWineData.includes("flor-de-pingus") ||
      searchableWineData.startsWith("flor-") ||
      searchableWineData.includes("-flor-");

    if (isFlorDePingus) return "Flor de Pingus";

    return "Pingus";
  }

  if (vintage) {
    const titleBeforeVintage = originalName
      .replace(
        new RegExp(
          "\\s+" + escapeRegExp(vintage) + "(?:\\s*[–—-]\\s*.*)?$",
          "i"
        ),
        ""
      )
      .trim();

    if (titleBeforeVintage) return titleBeforeVintage;
  }

  const titleWithoutYear = originalName
    .replace(/\s+(?:19|20)\d{2}(?:\s*[–—-]\s*.*)?$/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return titleWithoutYear || originalName;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const { data } = await supabase
    .from("wines")
    .select("producer");

  const producers = Array.from(
    new Set((data || []).map((wine) => wine.producer).filter(Boolean))
  ) as string[];

  const producer = resolveProducer(producers, slug);

  if (!producer) {
    return {
      title: "Producteur introuvable – The Wine Watchers",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const editorialContent = PRODUCER_EDITORIAL_LIBRARY[slug];

  const title = editorialContent
    ? `${producer} – Histoire, terroir et vins | The Wine Watchers`
    : `${producer} – Vins disponibles | The Wine Watchers`;

  const description = editorialContent
    ? editorialContent.introduction
    : `Découvrez les vins disponibles de ${producer} chez The Wine Watchers : grands crus, millésimes recherchés et bouteilles de collection.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/producteur/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/producteur/${slug}`,
      siteName: "The Wine Watchers",
      locale: "fr_FR",
      type: "website",
    },
  };
}
export default async function ProducteurPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: producerData } = await supabase
    .from("wines")
    .select("producer");

  const producers = Array.from(
    new Set(
      (producerData || [])
        .map((wine) => wine.producer)
        .filter(Boolean)
    )
  ) as string[];

  const producer = resolveProducer(producers, slug);

  if (!producer) {
    notFound();
  }

  const { data: wines } = await supabase
    .from("wines")
    .select(
      "id, slug, name, producer, appellation, region, category, vintage, price, compare_at_price, image, classification, bottle_size, packaging, rating, hidden_from_site"
    )
    .or("hidden_from_site.is.null,hidden_from_site.eq.false")
    .order("name", { ascending: true })
    .order("vintage", { ascending: false });

  const visibleWines = ((wines || []) as Wine[]).filter(
    (wine) =>
      wine.hidden_from_site !== true &&
      wineBelongsToProducerPage(wine, producer, slug)
  );

  const appellations = Array.from(
    new Set(
      visibleWines.map((wine) => wine.appellation).filter(Boolean)
    )
  ) as string[];

  const regions = Array.from(
    new Set(
      visibleWines
        .map((wine) => wine.region || wine.category)
        .filter(Boolean)
    )
  ) as string[];

  const wineGroupMap = visibleWines.reduce<Map<string, WineGroup>>(
    (map, wine) => {
      const title = getWineGroupTitle(wine);
      const key = slugify(title);

      if (!map.has(key)) {
        map.set(key, {
          title,
          wines: [],
        });
      }

      map.get(key)!.wines.push(wine);
      return map;
    },
    new Map<string, WineGroup>()
  );

  const wineGroups: WineGroup[] = Array.from(wineGroupMap.values())
    .sort((a, b) => a.title.localeCompare(b.title, "fr"))
    .map((group): WineGroup => ({
      ...group,
      wines: [...group.wines].sort((a, b) => {
        const vintageA = Number(a.vintage || 0);
        const vintageB = Number(b.vintage || 0);

        if (vintageA !== vintageB) return vintageB - vintageA;

        return String(a.name || "").localeCompare(
          String(b.name || ""),
          "fr"
        );
      }),
    }));

  const editorialContent = PRODUCER_EDITORIAL_LIBRARY[slug];

  const producerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Winery",
    "@id": `${SITE_URL}/producteur/${slug}#winery`,
    name: producer,
    url: `${SITE_URL}/producteur/${slug}`,
    ...(editorialContent?.introduction
      ? { description: editorialContent.introduction }
      : {}),
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Vins de ${producer}`,
    description:
      `Sélection de vins disponibles de ${producer} chez The Wine Watchers.`,
    url: `${SITE_URL}/producteur/${slug}`,
    numberOfItems: visibleWines.length,
    itemListElement: visibleWines.map((wine, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getAbsoluteWineUrl(wine),
      name:
        wine.name ||
        `${producer} ${wine.vintage || ""}`.trim(),
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
        name: "Boutique",
        item: `${SITE_URL}/boutique`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: producer,
        item: `${SITE_URL}/producteur/${slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white text-stone-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(producerJsonLd).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

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
          className="flex flex-wrap items-center gap-2 text-xs leading-6 text-stone-500"
        >
          <Link href="/" className="hover:text-[#8a1f1f]">
            Accueil
          </Link>

          <span aria-hidden="true">/</span>

          <Link
            href="/boutique"
            className="hover:text-[#8a1f1f]"
          >
            Boutique
          </Link>

          <span aria-hidden="true">/</span>
          <span aria-current="page">{producer}</span>
        </nav>

        <header className="mt-6 border-b border-stone-200 pb-6">
          <p className="text-xs font-medium text-[#8a1f1f]">
            Producteur
          </p>

          <h1 className="mt-2 font-serif text-3xl md:text-4xl">
            {producer}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            Découvrez les vins disponibles de {producer} chez The Wine
            Watchers : grands crus, millésimes recherchés, appellations
            prestigieuses et références de collection.
          </p>

          {regions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {regions.map((region) => (
                <Link
                  key={region}
                  href={getBoutiqueRegionUrl(region)}
                  className="text-sm text-[#8a1f1f] hover:underline"
                >
                  Voir les vins de {region} →
                </Link>
              ))}
            </div>
          )}
        </header>

        {appellations.length > 0 && (
          <nav
            aria-label="Appellations du producteur"
            className="border-b border-stone-200 py-4"
          >
            <p className="mb-2 text-xs font-medium text-stone-500">
              Appellations liées
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {appellations.map((appellation) => (
                <Link
                  key={appellation}
                  href={getAppellationUrl(
                    appellation,
                    visibleWines[0]?.region,
                    visibleWines[0]?.category
                  )}
                  className="text-sm text-[#8a1f1f] hover:underline"
                >
                  {appellation}
                </Link>
              ))}
            </div>
          </nav>
        )}

        {editorialContent && (
          <article className="border-b border-stone-200 py-6">
            <p className="text-xs font-medium text-[#8a1f1f]">
              {editorialContent.eyebrow}
            </p>

            <h2 className="mt-3 font-serif text-2xl">
              {editorialContent.title}
            </h2>

            <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-600">
              {editorialContent.introduction}
            </p>

            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-[#8a1f1f]">
                Histoire, terroir et style du domaine
              </summary>

              <div className="mt-5 grid items-start gap-6 md:grid-cols-2">
                {editorialContent.sections.map((section) => (
                  <section key={section.title}>
                    <h3 className="font-serif text-xl leading-snug">
                      {section.title}
                    </h3>

                    <div className="mt-3 space-y-3 text-sm leading-7 text-stone-600">
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={`${section.title}-${index}`}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {editorialContent.conclusion && (
                <p className="mt-5 border-t border-stone-100 pt-4 text-sm leading-7 text-stone-600">
                  {editorialContent.conclusion}
                </p>
              )}
            </details>
          </article>
        )}

        <section
          aria-labelledby="producer-wines-title"
          className="py-6"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2
              id="producer-wines-title"
              className="font-serif text-2xl"
            >
              Vins de {producer}
            </h2>

            <p className="text-xs text-stone-500">
              {visibleWines.length} référence
              {visibleWines.length > 1 ? "s" : ""}
            </p>
          </div>

          <p className="mb-6 max-w-3xl text-sm leading-7 text-stone-600">
            Retrouvez l’ensemble des vins actuellement disponibles de ce
            producteur. Consultez les différents millésimes, comparez les
            appellations et accédez en un clic à la fiche détaillée de
            chaque vin.
          </p>

          {visibleWines.length === 0 ? (
            <p className="rounded-lg border border-stone-200 p-5 text-sm text-stone-600">
              Aucun vin disponible actuellement pour ce producteur.
            </p>
          ) : (
            <div className="space-y-7">
              {wineGroups.map((wineGroup) => (
                <section key={wineGroup.title}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <h3 className="font-serif text-xl">
                      {wineGroup.title}
                    </h3>

                    <p className="text-xs text-stone-500">
                      {wineGroup.wines.length} référence
                      {wineGroup.wines.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {wineGroup.wines.map((wine) => {
                      const image = getWineImage(wine);
                      const discountInfo = getDiscountInfo(
                        wine.price,
                        wine.compare_at_price
                      );
                      const wineUrl = getWineUrl(wine);

                      const name = wine.name || "Grand vin";
                      const vintage = String(wine.vintage || "");
                      const displayName =
                        vintage && !name.includes(vintage)
                          ? `${name} ${vintage}`
                          : name;

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
                            {discountInfo && (
                              <span className="absolute left-3 top-3 z-10 rounded bg-[#8a1f1f] px-2 py-1 text-xs font-semibold text-white">
                                −{discountInfo.percent} %
                              </span>
                            )}

                            {wine.rating && (
                              <span className="absolute right-3 top-3 z-10 rounded bg-stone-100 px-2 py-1 text-xs text-stone-700">
                                {wine.rating}
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
                            {wine.appellation ? (
                              <Link
                                href={getAppellationUrl(
                                  wine.appellation,
                                  wine.region,
                                  wine.category
                                )}
                                className="text-xs text-stone-500 hover:text-[#8a1f1f]"
                              >
                                {wine.appellation}
                              </Link>
                            ) : (
                              <p className="text-xs text-stone-500">
                                {wine.region || "Grand vin"}
                              </p>
                            )}

                            <Link
                              href={wineUrl}
                              className="mt-2 hover:text-[#8a1f1f]"
                            >
                              <h4 className="font-serif text-lg leading-snug">
                                {displayName}
                              </h4>
                            </Link>

                            <p className="mt-1 text-xs text-stone-500">
                              {wine.producer || producer}
                            </p>

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
                              {discountInfo && (
                                <p className="text-xs text-stone-400 line-through">
                                  {formatPrice(wine.compare_at_price)}
                                </p>
                              )}

                              <p className="text-lg font-semibold text-[#8a1f1f]">
                                {formatPrice(wine.price)}
                              </p>

                              <Link
                                href={wineUrl}
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
                </section>
              ))}
            </div>
          )}
        </section>

        {(regions.length > 0 || appellations.length > 0) && (
          <section className="border-t border-stone-200 py-6">
            <h2 className="font-serif text-xl">
              Poursuivre la découverte
            </h2>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {regions.map((region) => (
                <Link
                  key={`explore-region-${region}`}
                  href={getBoutiqueRegionUrl(region)}
                  className="text-[#8a1f1f] hover:underline"
                >
                  Voir tous les vins de {region}
                </Link>
              ))}

              {appellations.map((appellation) => (
                <Link
                  key={`explore-appellation-${appellation}`}
                  href={getAppellationUrl(
                    appellation,
                    visibleWines[0]?.region,
                    visibleWines[0]?.category
                  )}
                  className="text-[#8a1f1f] hover:underline"
                >
                  Voir tous les vins de l’appellation {appellation}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="border-t border-stone-200 pt-5">
          <Link
            href="/boutique"
            className="text-sm font-medium text-[#8a1f1f] hover:underline"
          >
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </main>
  );
}