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

function formatPrice(price?: string | number | null) {
  if (!price) return "Prix sur demande";

  const value =
    typeof price === "number"
      ? price
      : Number(
          price
            .toString()
            .replace(/[€\s]/g, "")
            .replace(/\./g, "")
            .replace(",", "."),
        );

  if (Number.isNaN(value) || value <= 0) return "Prix sur demande";

  return (
    value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € HT"
  );
}

function parsePrice(price?: string | number | null) {
  if (price === undefined || price === null || price === "") return 0;
  if (typeof price === "number") return price;

  const cleaned = price
    .toString()
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const value = Number(cleaned);
  return Number.isNaN(value) ? 0 : value;
}

function getDiscountInfo(
  priceValue?: string | number | null,
  compareAtPriceValue?: string | number | null,
) {
  const price = parsePrice(priceValue);
  const compareAtPrice = parsePrice(compareAtPriceValue);

  if (price <= 0 || compareAtPrice <= price) return null;

  const saving = compareAtPrice - price;
  const percent = Math.round((saving / compareAtPrice) * 100);

  return { saving, percent };
}

function getWineImage(wine: Wine) {
  return wine.image || "";
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
  category?: string | null,
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
    (name) => slugify(name) === requestedSlug,
  );

  if (exactProducer) {
    return exactProducer;
  }

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

  return undefined;
}

function wineBelongsToProducerPage(
  wine: Wine,
  producer: string,
  requestedSlug: string,
) {
  if (requestedSlug === "dominio-de-pingus") {
    const searchableValue = slugify(
      [wine.producer, wine.name, wine.slug]
        .filter(Boolean)
        .join(" "),
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
        .join(" "),
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

    if (isPsi) {
      return "PSI";
    }

    const isFlorDePingus =
      searchableWineData.includes("flor-de-pingus") ||
      searchableWineData.startsWith("flor-") ||
      searchableWineData.includes("-flor-");

    if (isFlorDePingus) {
      return "Flor de Pingus";
    }

    return "Pingus";
  }

  if (vintage) {
    const titleBeforeVintage = originalName
      .replace(
        new RegExp("\\s+" + escapeRegExp(vintage) + "(?:\\s*[–—-]\\s*.*)?$", "i"),
        "",
      )
      .trim();

    if (titleBeforeVintage) {
      return titleBeforeVintage;
    }
  }

  const titleWithoutYear = originalName
    .replace(/\s+(?:19|20)\d{2}(?:\s*[–—-]\s*.*)?$/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return titleWithoutYear || originalName;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data } = await supabase
    .from("wines")
    .select("producer")
    .or("hidden_from_site.is.null,hidden_from_site.eq.false");

  const producers = Array.from(
    new Set((data || []).map((wine) => wine.producer).filter(Boolean)),
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

  return {
    title: editorialContent
      ? producer + " – Histoire, terroir et vins | The Wine Watchers"
      : producer + " – Vins disponibles | The Wine Watchers",
    description: editorialContent
      ? editorialContent.introduction
      : "Découvrez les vins disponibles de " +
        producer +
        " chez The Wine Watchers : grands crus, millésimes recherchés et bouteilles de collection.",
    alternates: {
      canonical: SITE_URL + "/producteur/" + slug,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: editorialContent
        ? producer + " – Histoire, terroir et vins | The Wine Watchers"
        : producer + " – Vins disponibles | The Wine Watchers",
      description: editorialContent
        ? editorialContent.introduction
        : "Découvrez les vins disponibles de " +
          producer +
          " chez The Wine Watchers : grands crus, millésimes recherchés et bouteilles de collection.",
      url: SITE_URL + "/producteur/" + slug,
      siteName: "The Wine Watchers",
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default async function ProducteurPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: producerData } = await supabase
    .from("wines")
    .select("producer")
    .or("hidden_from_site.is.null,hidden_from_site.eq.false");

  const producers = Array.from(
    new Set((producerData || []).map((wine) => wine.producer).filter(Boolean)),
  ) as string[];

  const producer = resolveProducer(producers, slug);

  if (!producer) {
    notFound();
  }

  const { data: wines } = await supabase
    .from("wines")
    .select(
      "id, slug, name, producer, appellation, region, category, vintage, price, compare_at_price, image, classification, bottle_size, packaging, rating, hidden_from_site",
    )
    .or("hidden_from_site.is.null,hidden_from_site.eq.false")
    .order("name", { ascending: true })
    .order("vintage", { ascending: false });

  const visibleWines = ((wines || []) as Wine[]).filter(
    (wine) =>
      wine.hidden_from_site !== true &&
      wineBelongsToProducerPage(wine, producer, slug),
  );

  const appellations = Array.from(
    new Set(visibleWines.map((wine) => wine.appellation).filter(Boolean)),
  ) as string[];

  const regions = Array.from(
    new Set(
      visibleWines.map((wine) => wine.region || wine.category).filter(Boolean),
    ),
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
    new Map<string, WineGroup>(),
  );

  const wineGroups: WineGroup[] = Array.from(wineGroupMap.values())
    .sort((a, b) => a.title.localeCompare(b.title, "fr"))
    .map((group): WineGroup => ({
      ...group,
      wines: [...group.wines].sort((a, b) => {
        const vintageA = Number(a.vintage || 0);
        const vintageB = Number(b.vintage || 0);

        if (vintageA !== vintageB) return vintageB - vintageA;

        return String(a.name || "").localeCompare(String(b.name || ""), "fr");
      }),
    }));

  const editorialContent = PRODUCER_EDITORIAL_LIBRARY[slug];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vins de " + producer,
    description:
      "Sélection de vins disponibles de " + producer + " chez The Wine Watchers.",
    url: SITE_URL + "/producteur/" + slug,
    numberOfItems: visibleWines.length,
    itemListElement: visibleWines.map((wine, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getAbsoluteWineUrl(wine),
      name: wine.name || (producer + " " + (wine.vintage || "")).trim(),
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
        item: SITE_URL + "/boutique",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: producer,
        item: SITE_URL + "/producteur/" + slug,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#24110d]">
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

      <section className="bg-[#1c0f0b] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/boutique"
            className="text-sm uppercase tracking-[0.25em] text-[#d8b56d] hover:text-white"
          >
            ← Retour boutique
          </Link>

          <p className="mt-10 text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            Producteur
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight md:text-7xl">
            {producer}
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 md:text-lg">
            Découvrez les vins disponibles de {producer} chez The Wine Watchers
            : grands crus, millésimes recherchés, appellations prestigieuses et
            références de collection.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {regions.map((region) => (
              <Link
                key={region}
                href={getBoutiqueRegionUrl(region)}
                className="rounded-full border border-[#d8b56d]/50 px-5 py-2 text-sm text-[#d8b56d] transition hover:border-white hover:text-white"
              >
                Voir les vins {region}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        {appellations.length > 0 && (
          <div className="mb-10 rounded-[2rem] border border-[#e1d1bd] bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
              Appellations liées
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {appellations.map((appellation) => (
                <Link
                  key={appellation}
                  href={getAppellationUrl(
                    appellation,
                    visibleWines[0]?.region,
                    visibleWines[0]?.category,
                  )}
                  className="rounded-full border border-[#d8b56d]/50 bg-[#fffaf3] px-5 py-2 text-sm text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
                >
                  {appellation}
                </Link>
              ))}
            </div>
          </div>
        )}

        {editorialContent && (
          <article className="mb-14 overflow-hidden rounded-[2rem] border border-[#dfcfb8] bg-[#fffaf3] shadow-sm">
            <div className="border-b border-[#dfcfb8] bg-[#24110d] px-6 py-10 text-white md:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d8b56d]">
                {editorialContent.eyebrow}
              </p>

              <h2 className="mt-4 max-w-4xl font-serif text-3xl leading-tight md:text-5xl">
                {editorialContent.title}
              </h2>

              <p className="mt-6 max-w-4xl text-base leading-8 text-white/80 md:text-lg">
                {editorialContent.introduction}
              </p>
            </div>

            <div className="grid gap-10 px-6 py-10 md:px-10 lg:grid-cols-2">
              {editorialContent.sections.map((section) => (
                <section key={section.title}>
                  <h3 className="font-serif text-2xl leading-tight text-[#24110d]">
                    {section.title}
                  </h3>

                  <div className="mt-4 space-y-4 text-sm leading-7 text-[#6d5b50] md:text-base md:leading-8">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {editorialContent.conclusion && (
              <div className="border-t border-[#dfcfb8] bg-white px-6 py-8 md:px-10">
                <p className="max-w-5xl font-serif text-xl leading-9 text-[#6f1717] md:text-2xl">
                  {editorialContent.conclusion}
                </p>
              </div>
            )}
          </article>
        )}

        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            Sélection disponible
          </p>

          <h2 className="mt-3 font-serif text-4xl text-[#24110d]">
            Vins de {producer}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d5b50]">
            Retrouvez l’ensemble des vins actuellement disponibles de ce
            producteur. Consultez les différents millésimes, comparez les
            appellations et accédez en un clic à la fiche détaillée de chaque
            vin.
          </p>
        </div>

        {visibleWines.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-600 shadow-sm">
            Aucun vin disponible actuellement pour ce producteur.
          </div>
        ) : (
          <div className="space-y-6">
            {wineGroups.map((wineGroup) => (
              <section key={wineGroup.title}>
                <div className="mb-4 rounded-xl border border-[#d8c6ae] bg-[#fffaf3] px-5 py-2.5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8a6a2f]">
                        Vin
                      </p>

                      <h3 className="font-serif text-xl leading-tight text-[#24110d]">
                        {wineGroup.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#7d6b5e]">
                      {wineGroup.wines.length} millésime
                      {wineGroup.wines.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {wineGroup.wines.map((wine) => {
                    const image = getWineImage(wine);
                    const discountInfo = getDiscountInfo(
                      wine.price,
                      wine.compare_at_price,
                    );
                    const wineUrl = getWineUrl(wine);

                    return (
                      <article
                        key={wine.id}
                        className="group overflow-hidden rounded-[1.7rem] border border-[#dfcfb8] bg-[#fffaf3] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl"
                      >
                        <Link href={wineUrl} className="block">
                          <div className="relative flex h-[245px] items-center justify-center overflow-hidden bg-[#efe3d2] p-6">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(216,181,109,0.24),transparent_38%)]" />

                            {discountInfo && (
                              <div className="absolute left-4 top-4 z-20 rounded-full bg-[#8a1f1f] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
                                -{discountInfo.percent} %
                              </div>
                            )}

                            {wine.rating && (
                              <div className="absolute right-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#8a1f1f] shadow-sm">
                                {wine.rating}
                              </div>
                            )}

                            {image ? (
                              <img
                                src={image}
                                alt={
                                  "Bouteille de " +
                                  (wine.name || "vin") +
                                  " - " +
                                  producer
                                }
                                className="relative z-10 max-h-[205px] w-auto object-contain transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-[#cdbb9f] text-sm text-[#8a6a2f]">
                                Image non disponible
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="p-5">
                          <Link
                            href={wineUrl}
                            className="mb-3 block rounded-full bg-[#24110d]/90 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-[#d8b56d] transition hover:bg-[#8a1f1f]"
                          >
                            {wine.appellation || wine.region || "Grand vin"}
                          </Link>

                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            {wine.classification && (
                              <span className="rounded-full border border-[#dfcfb8] bg-white px-3 py-1 text-[11px] text-[#6d5b50]">
                                {wine.classification}
                              </span>
                            )}

                            {(wine.region || wine.category) && (
                              <span className="rounded-full border border-[#dfcfb8] bg-white px-3 py-1 text-[11px] text-[#6d5b50]">
                                {wine.region || wine.category}
                              </span>
                            )}

                            {wine.bottle_size && (
                              <span className="rounded-full border border-[#dfcfb8] bg-white px-3 py-1 text-[11px] text-[#6d5b50]">
                                {wine.bottle_size}
                              </span>
                            )}

                            {wine.packaging && (
                              <span className="rounded-full border border-[#dfcfb8] bg-white px-3 py-1 text-[11px] text-[#6d5b50]">
                                {wine.packaging}
                              </span>
                            )}
                          </div>

                          <Link href={wineUrl} className="block">
                            <h3 className="min-h-[64px] font-serif text-sm leading-tight text-[#24110d] transition group-hover:text-[#8a1f1f]">
                              {wine.name}
                            </h3>
                          </Link>

                          <p className="mt-3 truncate text-[11px] uppercase tracking-[0.18em] text-[#b08a43]">
                            {wine.producer || producer}
                          </p>

                          <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#eadfce] pt-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a6a2f]">
                                Prix
                              </p>

                              {discountInfo ? (
                                <div className="mt-1">
                                  <p className="text-sm text-[#9b8c7d] line-through">
                                    {formatPrice(wine.compare_at_price)}
                                  </p>

                                  <p className="font-serif text-2xl text-[#8a1f1f]">
                                    {formatPrice(wine.price)}
                                  </p>
                                </div>
                              ) : (
                                <p className="mt-1 font-serif text-2xl text-[#8a1f1f]">
                                  {formatPrice(wine.price)}
                                </p>
                              )}
                            </div>

                            <Link
                              href={wineUrl}
                              className="rounded-full bg-[#8a1f1f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#641313]"
                            >
                              Détails
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
    </main>
  );
}