import Link from "next/link";

type Wine = {
  id: string;
  slug?: string | null;
  name?: string | null;
  producer?: string | null;
  appellation?: string | null;
  vintage?: string | number | null;
  price?: string | number | null;
  compare_at_price?: string | number | null;
  image?: string | null;
};

const SITE_URL = "https://www.thewinewatchers.com";

function parsePrice(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return 0;
  if (typeof value === "number") return value;

  const cleaned = value
    .toString()
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatPrice(value?: string | number | null) {
  const price = parsePrice(value);
  if (price <= 0) return "Prix sur demande";

  return (
    price.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € HT"
  );
}

function getDiscountInfo(wine: Wine) {
  const price = parsePrice(wine.price);
  const compareAtPrice = parsePrice(wine.compare_at_price);

  if (price <= 0 || compareAtPrice <= price) return null;

  const saving = compareAtPrice - price;
  const percent = Math.round((saving / compareAtPrice) * 100);

  return { saving, percent };
}

async function getOfferWines() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) return [];

  const url =
    `${supabaseUrl}/rest/v1/wines?select=id,slug,name,producer,appellation,vintage,price,compare_at_price,image,hidden_from_site` +
    `&compare_at_price=not.is.null&order=created_at.desc&limit=100`;

  const response = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as (Wine & {
    hidden_from_site?: boolean | null;
  })[];

  return data
    .filter((wine) => wine.hidden_from_site !== true)
    .filter((wine) => getDiscountInfo(wine))
    .sort((a, b) => {
      const discountA = getDiscountInfo(a);
      const discountB = getDiscountInfo(b);
      return (discountB?.percent || 0) - (discountA?.percent || 0);
    });
}

export const metadata = {
  title: "Offres du moment – The Wine Watchers",
  description:
    "Découvrez les offres du moment The Wine Watchers : grands vins proposés dans des conditions tarifaires avantageuses.",
};

export default async function OffresPage() {
  const wines = await getOfferWines();

  return (
    <main className="min-h-screen bg-[#f8f4ee] text-[#24110d]">
      <section className="bg-[#170606] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="text-sm uppercase tracking-[0.25em] text-[#d8b56d] hover:text-white"
          >
            ← Retour accueil
          </Link>

          <p className="mt-10 text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            The Wine Watchers
          </p>

          <h1 className="mt-4 font-serif text-5xl md:text-7xl">
            Offres du moment
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 md:text-lg">
  Découvrez une sélection de grands vins proposés actuellement dans des
  conditions tarifaires particulièrement avantageuses. Cette sélection évolue
  au fil des disponibilités.
</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        {wines.length === 0 ? (
          <div className="rounded-[2rem] border border-[#e1d1bd] bg-white p-10 text-center shadow-sm">
            <h2 className="font-serif text-3xl">
              Aucune offre disponible actuellement
            </h2>
            <p className="mt-4 text-[#6d5b50]">
              De nouvelles opportunités seront ajoutées prochainement.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {wines.map((wine) => {
              const discount = getDiscountInfo(wine);
              const href = `/boutique/vin/${wine.slug || wine.id}`;
              const imageUrl = wine.image?.startsWith("http")
                ? wine.image
                : wine.image
                ? `${SITE_URL}${wine.image.startsWith("/") ? wine.image : `/${wine.image}`}`
                : "";

              return (
                <Link
                  key={wine.id}
                  href={href}
                  className="group overflow-hidden rounded-[1.7rem] border border-[#dfcfb8] bg-[#fffaf3] shadow-sm transition hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl"
                >
                  <div className="relative flex h-[245px] items-center justify-center bg-[#efe3d2] p-6">
                    {discount && (
                      <div className="absolute left-4 top-4 z-20 rounded-full bg-[#8a1f1f] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
                        -{discount.percent} %
                      </div>
                    )}

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={wine.name || "Vin"}
                        className="max-h-[205px] w-auto object-contain transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-sm text-[#8a6a2f]">
                        Image non disponible
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="mb-3 rounded-full bg-[#24110d]/90 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-[#d8b56d]">
                      {wine.appellation || "Grand vin"}
                    </p>

                    <h2 className="min-h-[64px] font-serif text-sm leading-tight text-[#24110d] group-hover:text-[#8a1f1f]">
                      {wine.name}
                      {wine.vintage &&
                      !String(wine.name || "").includes(String(wine.vintage))
                        ? ` ${wine.vintage}`
                        : ""}
                    </h2>

                    {wine.producer && (
                      <p className="mt-3 truncate text-[11px] uppercase tracking-[0.18em] text-[#b08a43]">
                        {wine.producer}
                      </p>
                    )}

                    <div className="mt-5 border-t border-[#eadfce] pt-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a6a2f]">
                        Prix
                      </p>

                      <p className="mt-1 text-sm text-[#9b8c7d] line-through">
                        {formatPrice(wine.compare_at_price)}
                      </p>

                      <p className="font-serif text-2xl text-[#8a1f1f]">
                        {formatPrice(wine.price)}
                      </p>

                      {discount && (
                        <p className="mt-1 whitespace-nowrap text-[11px] text-[#6d5b50]">
                          Vous économisez {formatPrice(discount.saving)} (-
                          {discount.percent}%)
                        </p>
                      )}

                      <span className="mt-4 inline-block rounded-full bg-[#8a1f1f] px-4 py-2.5 text-sm font-semibold text-white">
                        Découvrir
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}