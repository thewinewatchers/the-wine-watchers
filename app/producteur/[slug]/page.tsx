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
  const value = Number(price);
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
    .order("vintage", { ascending: false });

  const visibleWines = ((wines || []) as Wine[]).filter(
    (wine) => wine.hidden_from_site !== true
  );

  const appellations = Array.from(
    new Set(visibleWines.map((wine) => wine.appellation).filter(Boolean))
  ) as string[];

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#24110d]">
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
            grands crus, millésimes recherchés et références de collection.
          </p>
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

        <h2 className="font-serif text-4xl text-[#24110d]">
          Vins disponibles
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {visibleWines.map((wine) => (
            <Link
              key={wine.id}
              href={getWineUrl(wine)}
              className="group overflow-hidden rounded-[1.7rem] border border-[#dfcfb8] bg-[#fffaf3] shadow-sm transition hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl"
            >
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

              <div className="p-5">
                <p className="mb-3 rounded-full bg-[#24110d]/90 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-[#d8b56d]">
                  {wine.appellation || wine.region || "Grand vin"}
                </p>

                <h3 className="min-h-[64px] font-serif text-sm leading-tight text-[#24110d] group-hover:text-[#8a1f1f]">
                  {wine.name}
                </h3>

                {wine.vintage && (
                  <p className="mt-3 text-sm text-[#6d5b50]">
                    Millésime {wine.vintage}
                  </p>
                )}

                <p className="mt-4 font-serif text-2xl text-[#8a1f1f]">
                  {formatPrice(wine.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}