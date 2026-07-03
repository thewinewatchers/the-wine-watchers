
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
  image: string | null;
  hidden_from_site?: boolean | null;
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
            .replace(",", ".")
        );

  if (Number.isNaN(value) || value <= 0) return "Prix sur demande";

  return (
    value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € HT"
  );
}

function getWineUrl(wine: Wine) {
  return `/boutique/vin/${wine.slug || wine.id}`;
}

function getAbsoluteWineUrl(wine: Wine) {
  return `${SITE_URL}${getWineUrl(wine)}`;
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
    .neq("hidden_from_site", true);

  const producers = Array.from(
    new Set((data || []).map((wine) => wine.producer).filter(Boolean))
  ) as string[];

  const producer = producers.find((name) => slugify(name) === slug);

  if (!producer) {
    return {
      title: "Producteur introuvable – The Wine Watchers",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${producer} – Vins disponibles | The Wine Watchers`,
    description: `Découvrez les vins disponibles de ${producer} chez The Wine Watchers : grands crus, millésimes recherchés et bouteilles de collection.`,
    alternates: {
      canonical: `${SITE_URL}/producteur/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
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
    .neq("hidden_from_site", true);

  const producers = Array.from(
    new Set((producerData || []).map((wine) => wine.producer).filter(Boolean))
  ) as string[];

  const producer = producers.find((name) => slugify(name) === slug);

  if (!producer) {
    notFound();
  }

  const { data: wines } = await supabase
    .from("wines")
    .select(
      "id, slug, name, producer, appellation, region, category, vintage, price, image, hidden_from_site"
    )
    .eq("producer", producer)
    .neq("hidden_from_site", true)
    .order("name", { ascending: true })
.order("vintage", { ascending: false });

  const visibleWines = ((wines || []) as Wine[]).filter(
    (wine) => wine.hidden_from_site !== true
  );

  const appellations = Array.from(
    new Set(visibleWines.map((wine) => wine.appellation).filter(Boolean))
  ) as string[];

  const regions = Array.from(
    new Set(visibleWines.map((wine) => wine.region || wine.category).filter(Boolean))
  ) as string[];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Vins de ${producer}`,
    description: `Sélection de vins disponibles de ${producer} chez The Wine Watchers.`,
    url: `${SITE_URL}/producteur/${slug}`,
    numberOfItems: visibleWines.length,
    itemListElement: visibleWines.map((wine, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getAbsoluteWineUrl(wine),
      name: wine.name || `${producer} ${wine.vintage || ""}`.trim(),
    })),
  };

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#24110d]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
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
            Découvrez les vins disponibles de {producer} chez The Wine Watchers :
            grands crus, millésimes recherchés, appellations prestigieuses et
            références de collection.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {regions.map((region) => (
              <Link
                key={region}
                href={`/boutique/${slugify(region)}`}
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
                  href={`/appellation/${slugify(appellation)}`}
                  className="rounded-full border border-[#d8b56d]/50 bg-[#fffaf3] px-5 py-2 text-sm text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
                >
                  {appellation}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            Sélection disponible
          </p>

          <h2 className="mt-3 font-serif text-4xl text-[#24110d]">
            Vins de {producer}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d5b50]">
            Retrouvez l’ensemble des vins actuellement disponibles de ce producteur.
Consultez les différents millésimes, comparez les appellations et
accédez en un clic à la fiche détaillée de chaque vin.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {visibleWines.map((wine) => (
            <article
              key={wine.id}
              className="group overflow-hidden rounded-[1.7rem] border border-[#dfcfb8] bg-[#fffaf3] shadow-sm transition hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl"
            >
              <Link href={getWineUrl(wine)} className="block">
                <div className="flex h-[245px] items-center justify-center bg-[#efe3d2] p-6">
                  {wine.image ? (
                    <img
                      src={wine.image}
                      alt={wine.name || producer}
                      className="max-h-[205px] w-auto object-contain transition group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-sm text-[#8a6a2f]">
                      Image non disponible
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-5">
                {wine.appellation ? (
                  <Link
                    href={`/appellation/${slugify(wine.appellation)}`}
                    className="mb-3 block rounded-full bg-[#24110d]/90 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-[#d8b56d] transition hover:bg-[#8a1f1f]"
                  >
                    {wine.appellation}
                  </Link>
                ) : (
                  <p className="mb-3 rounded-full bg-[#24110d]/90 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-[#d8b56d]">
                    {wine.region || "Grand vin"}
                  </p>
                )}

                <Link href={getWineUrl(wine)} className="block">
                  <h3 className="min-h-[64px] font-serif text-sm leading-tight text-[#24110d] group-hover:text-[#8a1f1f]">
                    {wine.name}
                  </h3>
                </Link>

                <div className="mt-3 space-y-1 text-sm text-[#6d5b50]">
                  {wine.vintage && <p>Millésime {wine.vintage}</p>}

                  {(wine.region || wine.category) && (
                    <Link
                      href={`/boutique/${slugify(wine.region || wine.category || "")}`}
                      className="inline-block underline underline-offset-4 transition hover:text-[#8a1f1f]"
                    >
                      {wine.region || wine.category}
                    </Link>
                  )}
                </div>

                <p className="mt-4 font-serif text-2xl text-[#8a1f1f]">
                  {formatPrice(wine.price)}
                </p>

                <Link
                  href={getWineUrl(wine)}
                  className="mt-5 inline-flex w-full justify-center rounded-full bg-[#8a1f1f] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#641313]"
                >
                  Voir le vin
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

