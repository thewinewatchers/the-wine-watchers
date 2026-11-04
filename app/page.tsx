import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./components/NewsletterForm";

type Wine = {
  id: string;
  slug?: string | null;
  name?: string | null;
  vintage?: string | number | null;
  price?: string | number | null;
  compare_at_price?: string | number | null;
  image?: string | null;
  hidden_from_site?: boolean | null;
};

const categories = [
  { title: "Bordeaux", slug: "bordeaux" },
  { title: "Bourgogne", slug: "bourgogne" },
  { title: "Rhône", slug: "rhone" },
  { title: "Champagne", slug: "champagne" },
  { title: "Italie", slug: "italie" },
  { title: "Espagne", slug: "espagne" },
  { title: "États-Unis", slug: "usa" },
  { title: "Primeurs 2025", slug: "primeurs-2025" },
];

function parsePrice(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return 0;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const raw = String(value).replace(/[€\s]/g, "");
  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
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

function getWineImage(image?: string | null) {
  const value = String(image || "").trim();

  if (!value) return "";

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `/${value.replace(/\\/g, "/").replace(/^\/+/, "")}`;
}

async function getOfferWines(): Promise<Wine[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) return [];

  const url =
    `${supabaseUrl}/rest/v1/wines?select=id,slug,name,vintage,price,compare_at_price,image,hidden_from_site` +
    `&or=(hidden_from_site.eq.false,hidden_from_site.is.null)` +
    `&compare_at_price=not.is.null&order=created_at.desc&limit=24`;

  try {
    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as Wine[];

    if (!Array.isArray(data)) return [];

    return data
      .filter((wine) => wine.hidden_from_site !== true)
      .filter((wine) => getDiscountInfo(wine))
      .sort((a, b) => {
        const discountA = getDiscountInfo(a);
        const discountB = getDiscountInfo(b);

        return (discountB?.percent || 0) - (discountA?.percent || 0);
      })
      .slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Home() {
  const offerWines = await getOfferWines();

  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <section className="grid items-center gap-6 border-b border-stone-200 pb-8 md:grid-cols-[1.3fr_0.7fr] md:gap-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#8a1f1f]">
              The Wine Watchers
            </p>

            <h1 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
              Grands vins et bouteilles de collection
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Bordeaux, Bourgogne, Champagne et grandes signatures du monde :
              découvrez notre sélection de vins rares et prestigieux.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/boutique"
                className="rounded bg-[#8a1f1f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#641313]"
              >
                Découvrir nos vins
              </Link>

              <Link
                href="/boutique/primeurs-2025"
                className="rounded border border-stone-300 px-5 py-3 text-sm font-medium text-[#8a1f1f] transition-colors hover:border-[#8a1f1f]"
              >
                Primeurs 2025
              </Link>
            </div>
          </div>

          <div className="relative hidden h-56 overflow-hidden rounded-lg md:block">
            <Image
              src="/images/accueil-sommelier.jpg"
              alt="Sommelier dégustant un grand vin — The Wine Watchers"
              fill
              priority
              sizes="(min-width: 768px) 380px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section aria-labelledby="regions-title" className="py-6">
          <h2
            id="regions-title"
            className="font-serif text-2xl text-stone-900"
          >
            Explorer nos vins
          </h2>

          <nav
            aria-label="Régions et Primeurs"
            className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/boutique/${category.slug}`}
                className="flex items-center justify-between gap-2 rounded border border-stone-200 px-4 py-3 text-sm font-medium text-[#591c24] transition-colors hover:border-[#8a1f1f] hover:bg-stone-50"
              >
                {category.title}

                <span aria-hidden="true" className="text-stone-400">
                  →
                </span>
              </Link>
            ))}
          </nav>
        </section>

        {offerWines.length > 0 && (
          <section
            aria-labelledby="offers-title"
            className="border-t border-stone-200 py-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                id="offers-title"
                className="font-serif text-2xl text-stone-900"
              >
                Nos offres du moment
              </h2>

              <Link
                href="/offres"
                prefetch={false}
                className="text-sm text-[#8a1f1f] hover:underline"
              >
                Toutes les offres →
              </Link>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {offerWines.map((wine) => {
                const discount = getDiscountInfo(wine);
                const href = `/boutique/vin/${wine.slug || wine.id}`;
                const name = wine.name || "Grand vin";
                const image = getWineImage(wine.image);

                const displayName =
                  wine.vintage &&
                  !name.includes(String(wine.vintage))
                    ? `${name} ${wine.vintage}`
                    : name;

                return (
                  <article
                    key={wine.id}
                    className="flex flex-col rounded-lg border border-stone-200 p-5"
                  >
                    <Link
                      href={href}
                      prefetch={false}
                      className="relative mb-4 flex h-44 items-center justify-center"
                      aria-label={displayName}
                    >
                      {image ? (
                        <Image
                          src={image}
                          alt={displayName}
                          fill
                          sizes="(max-width: 767px) 90vw, 320px"
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-sm text-stone-400">
                          Photo à venir
                        </span>
                      )}
                    </Link>

                    <div className="flex items-start justify-between gap-3">
                      <Link href={href} prefetch={false}>
                        <h3 className="font-serif text-xl leading-snug hover:text-[#8a1f1f]">
                          {displayName}
                        </h3>
                      </Link>

                      {discount && (
                        <span className="shrink-0 rounded bg-[#8a1f1f] px-2 py-1 text-xs font-semibold text-white">
                          −{discount.percent} %
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-5">
                      <p className="text-xs text-stone-400 line-through">
                        {formatPrice(wine.compare_at_price)}
                      </p>

                      <p className="mt-1 text-xl font-semibold text-[#8a1f1f]">
                        {formatPrice(wine.price)}
                      </p>

                      <Link
                        href={href}
                        prefetch={false}
                        className="mt-4 block rounded border border-[#8a1f1f] px-3 py-2 text-center text-sm font-medium text-[#8a1f1f] transition-colors hover:bg-[#8a1f1f] hover:text-white"
                      >
                        Voir le vin
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <p className="mt-3 text-xs leading-5 text-stone-500">
              Prix affichés hors taxes. TVA calculée lors de la finalisation
              de la commande.
            </p>
          </section>
        )}

        <section className="flex flex-col justify-between gap-4 border-t border-stone-200 py-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-xl">
              Vous recherchez une bouteille précise ?
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Château, domaine, millésime ou grand format : contactez notre
              équipe.
            </p>
          </div>

          <Link
            href="/contact"
            className="shrink-0 text-sm font-medium text-[#8a1f1f] hover:underline"
          >
            Nous contacter →
          </Link>
        </section>

        <section
          aria-labelledby="newsletter-title"
          className="mt-2 rounded-lg border border-stone-200 bg-stone-50 p-5 md:p-6"
        >
          <h2 id="newsletter-title" className="font-serif text-2xl">
            Nos allocations et nouvelles disponibilités
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            Recevez nos offres, nos arrivages et les nouvelles sorties
            Primeurs.
          </p>

          <NewsletterForm />
        </section>
      </div>
    </main>
  );
}