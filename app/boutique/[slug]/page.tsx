import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import BoutiqueClient from "../BoutiqueClient";

const SITE_URL = "https://www.thewinewatchers.com";

const categories = {
  bordeaux: {
    title: "Bordeaux",
    description:
      "Découvrez notre sélection de grands vins de Bordeaux, classés par appellations prestigieuses.",
    appellations: [
      "Pauillac",
      "Margaux",
      "Saint-Julien",
      "Saint-Estèphe",
      "Pomerol",
      "Saint-Émilion",
      "Pessac-Léognan",
      "Sauternes",
    ],
  },
  bourgogne: {
    title: "Bourgogne",
    description:
      "Grands crus, premiers crus et domaines emblématiques de Bourgogne. Filtrez la sélection par domaine, cru, classification ou millésime.",
    appellations: [
      "Côte de Nuits",
      "Côte de Beaune",
      "Chablis",
      "Meursault",
      "Puligny-Montrachet",
      "Gevrey-Chambertin",
      "Vosne-Romanée",
    ],
  },
  rhone: {
    title: "Rhône",
    description:
      "Les grandes appellations de la vallée du Rhône, du nord au sud.",
    appellations: [
      "Côte-Rôtie",
      "Hermitage",
      "Cornas",
      "Saint-Joseph",
      "Châteauneuf-du-Pape",
      "Gigondas",
    ],
  },
  italie: {
    title: "Grands vins d’Italie",
    description:
      "Les plus grandes références italiennes : Toscane, Piémont et Super Toscans.",
    appellations: [
      "Toscane",
      "Piémont",
      "Barolo",
      "Barbaresco",
      "Brunello di Montalcino",
      "Bolgheri",
      "Super Toscans",
    ],
  },
  espagne: {
    title: "Espagne",
    description:
      "Une sélection de grandes bouteilles espagnoles issues des régions les plus réputées.",
    appellations: [
      "Ribera del Duero",
      "Rioja",
      "Priorat",
      "Toro",
      "Rías Baixas",
    ],
  },
  usa: {
    title: "USA",
    description:
      "Les grandes icônes américaines, principalement issues de Napa Valley et Sonoma.",
    appellations: [
      "Napa Valley",
      "Sonoma",
      "Oakville",
      "Rutherford",
      "Stags Leap District",
    ],
  },
  champagne: {
    title: "Champagne",
    description:
      "Grandes maisons, cuvées de prestige, champagnes millésimés et vignerons d’exception.",
    appellations: [
      "Montagne de Reims",
      "Vallée de la Marne",
      "Côte des Blancs",
      "Côte des Bar",
      "Champagne",
    ],
  },
  "primeurs-2025": {
    title: "Primeurs 2025",
    description:
      "Sélection Bordeaux Primeurs 2025, sorties en cours et disponibilités à venir.",
    appellations: [
      "Pauillac Primeurs",
      "Margaux Primeurs",
      "Saint-Julien Primeurs",
      "Saint-Émilion Primeurs",
      "Pomerol Primeurs",
      "Pessac-Léognan Primeurs",
    ],
  },
};

const popularAppellations: Record<
  string,
  { name: string; href: string }[]
> = {
  bordeaux: [
    { name: "Pauillac", href: "/appellation/pauillac" },
    { name: "Margaux", href: "/appellation/margaux" },
    { name: "Saint-Julien", href: "/appellation/saint-julien" },
    { name: "Saint-Estèphe", href: "/appellation/saint-estephe" },
    { name: "Saint-Émilion", href: "/appellation/saint-emilion" },
    { name: "Pomerol", href: "/appellation/pomerol" },
    { name: "Pessac-Léognan", href: "/appellation/pessac-leognan" },
    { name: "Sauternes", href: "/appellation/sauternes" },
  ],
  bourgogne: [
    { name: "Côte de Nuits", href: "/appellation/cote-de-nuits" },
    { name: "Côte de Beaune", href: "/appellation/cote-de-beaune" },
    { name: "Chablis", href: "/appellation/chablis" },
    { name: "Meursault", href: "/appellation/meursault" },
    {
      name: "Puligny-Montrachet",
      href: "/appellation/puligny-montrachet",
    },
    { name: "Vosne-Romanée", href: "/appellation/vosne-romanee" },
    {
      name: "Gevrey-Chambertin",
      href: "/appellation/gevrey-chambertin",
    },
    {
      name: "Chambolle-Musigny",
      href: "/appellation/chambolle-musigny",
    },
  ],
  rhone: [
    { name: "Côte-Rôtie", href: "/appellation/cote-rotie" },
    { name: "Hermitage", href: "/appellation/hermitage" },
    { name: "Cornas", href: "/appellation/cornas" },
    { name: "Saint-Joseph", href: "/appellation/saint-joseph" },
    {
      name: "Châteauneuf-du-Pape",
      href: "/appellation/chateauneuf-du-pape",
    },
    { name: "Gigondas", href: "/appellation/gigondas" },
  ],
  italie: [
    { name: "Toscane", href: "/appellation/toscana" },
    { name: "Piémont", href: "/appellation/piemont" },
    { name: "Barolo", href: "/appellation/barolo" },
    { name: "Barbaresco", href: "/appellation/barbaresco" },
    {
      name: "Brunello di Montalcino",
      href: "/appellation/brunello-di-montalcino",
    },
    { name: "Bolgheri", href: "/appellation/bolgheri" },
    { name: "Super Toscans", href: "/appellation/toscana-igt" },
  ],
  espagne: [
    {
      name: "Ribera del Duero",
      href: "/appellation/ribera-del-duero",
    },
    { name: "Rioja", href: "/appellation/rioja" },
    { name: "Priorat", href: "/appellation/priorat" },
    { name: "Toro", href: "/appellation/toro" },
    { name: "Rías Baixas", href: "/appellation/rias-baixas" },
  ],
  usa: [
    { name: "Napa Valley", href: "/appellation/napa-valley" },
    { name: "Sonoma", href: "/appellation/sonoma" },
    { name: "Oakville", href: "/appellation/oakville" },
    { name: "Rutherford", href: "/appellation/rutherford" },
    {
      name: "Stags Leap District",
      href: "/appellation/stags-leap-district",
    },
  ],
  champagne: [
    { name: "Champagne", href: "/appellation/champagne" },
    {
      name: "Montagne de Reims",
      href: "/appellation/montagne-de-reims",
    },
    {
      name: "Vallée de la Marne",
      href: "/appellation/vallee-de-la-marne",
    },
    {
      name: "Côte des Blancs",
      href: "/appellation/cote-des-blancs",
    },
    { name: "Côte des Bar", href: "/appellation/cote-des-bar" },
  ],
};

type CategoryKey = keyof typeof categories;

const categoryOgImages: Record<CategoryKey, string> = {
  bordeaux: "chateau-margaux.jpg",
  bourgogne: "romanee-conti.jpg",
  rhone: "rhone.jpg",
  italie: "cave-grands-vins.jpg",
  espagne: "espagne.jpg",
  usa: "opus-one.jpg",
  champagne: "champagne.jpg",
  "primeurs-2025": "primeurs-bordeaux.jpg",
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function isCategoryKey(slug: string): slug is CategoryKey {
  return Object.prototype.hasOwnProperty.call(categories, slug);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isCategoryKey(slug)) {
    return {
      title: "Catégorie introuvable | The Wine Watchers",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const category = categories[slug];
  const canonicalUrl = `${SITE_URL}/boutique/${slug}`;

  return {
    title: `${category.title} | The Wine Watchers`,
    description: category.description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${category.title} | The Wine Watchers`,
      description: category.description,
      url: canonicalUrl,
      siteName: "The Wine Watchers",
      locale: "fr_FR",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/images/og/${categoryOgImages[slug]}`,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${category.title} - The Wine Watchers`,
        },
      ],
    },
  };
}

type CategoryWineLink = {
  id: string;
  slug: string | null;
  name: string | null;
  category: string | null;
  vintage: string | number | null;
  packaging: string | null;
  bottle_size: string | null;
};

function normalizeCategory(value: string | null | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/-/g, " ")
    .trim();
}

async function getCategoryWineLinks(slug: CategoryKey): Promise<CategoryWineLink[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const accepted = new Set([
    normalizeCategory(slug),
    normalizeCategory(categories[slug].title),
  ]);
  const unique = new Map<string, CategoryWineLink>();
  const pageSize = 500;

  try {
    for (let start = 0; ; start += pageSize) {
      const response = await fetch(
        `${url}/rest/v1/wines?select=id,slug,name,category,vintage,packaging,bottle_size&or=(hidden_from_site.eq.false,hidden_from_site.is.null)&order=id.asc&offset=${start}&limit=${pageSize}`,
        {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
          cache: "no-store",
        }
      );
      if (!response.ok) throw new Error(`Supabase HTTP ${response.status}`);
      const batch = (await response.json()) as CategoryWineLink[];
      for (const wine of batch) {
        const wineSlug = wine.slug?.trim();
        if (!wineSlug || !wine.name?.trim()) continue;
        if (!accepted.has(normalizeCategory(wine.category))) continue;
        if (!unique.has(wineSlug)) unique.set(wineSlug, wine);
      }
      if (batch.length < pageSize) break;
    }
    return Array.from(unique.values()).sort((a, b) =>
      String(a.name).localeCompare(String(b.name), "fr") ||
      Number(b.vintage || 0) - Number(a.vintage || 0)
    );
  } catch (error) {
    console.error("Erreur de lecture des liens catalogue :", error);
    return [];
  }
}

export default async function BoutiqueCategoryPage({
  params,
}: PageProps) {
  const { slug } = await params;

  if (slug === "pauillac") {
    permanentRedirect("/appellation/pauillac");
  }

  if (!isCategoryKey(slug)) {
    notFound();
  }

  const category = categories[slug];
  const appellationsToShow = popularAppellations[slug] || [];
  const wineLinks = await getCategoryWineLinks(slug);

  return (
    <main className="min-h-screen bg-white text-stone-800">
      <header className="mx-auto max-w-7xl px-5 pb-5 pt-7 md:px-6">
        <nav
          aria-label="Fil d’Ariane"
          className="mb-4 text-sm text-stone-500"
        >
          <Link
            href="/boutique"
            className="transition hover:text-[#8a1f1f]"
          >
            Boutique
          </Link>

          <span aria-hidden="true" className="mx-2">
            /
          </span>

          <span aria-current="page">{category.title}</span>
        </nav>

        <h1 className="font-serif text-3xl text-stone-900 md:text-4xl">
          {category.title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-stone-600">
          {category.description}
        </p>

        {slug === "primeurs-2025" && (
          <p className="mt-2 text-sm leading-6 text-[#8a1f1f]">
            Vins en précommande. Livraison estimée au premier semestre 2027.
            Les frais de livraison seront facturés au moment de la livraison.
            Assurance transport comprise.
          </p>
        )}

        {appellationsToShow.length > 0 && (
          <nav
            aria-label="Appellations"
            className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-200 pt-4"
          >
            {appellationsToShow.map((appellation) => (
              <Link
                key={appellation.name}
                href={appellation.href}
                className="text-sm text-[#8a1f1f] underline-offset-4 hover:underline"
              >
                {appellation.name}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <BoutiqueClient
        slug={slug}
        categoryTitle={category.title}
        appellations={category.appellations}
      />

      {slug === "champagne" && (
        <section
          aria-label="Présentation de notre sélection de champagnes"
          className="mx-auto max-w-7xl px-5 py-8 md:px-6"
        >
          <details className="border-t border-stone-200 pt-5">
            <summary className="cursor-pointer font-serif text-xl text-[#8a1f1f]">
              En savoir plus sur nos champagnes
            </summary>

            <div className="mt-6 space-y-6 text-sm leading-7 text-stone-600">
              <h2 className="font-serif text-2xl text-stone-900">
                Les grands champagnes sélectionnés par The Wine Watchers
              </h2>

              <div>
                <h3 className="mb-2 font-serif text-xl text-stone-900">
                  Les grandes maisons de Champagne
                </h3>

                <p>
                  Le Champagne occupe une place singulière dans
                  l&apos;univers des grands vins. Derrière chaque cuvée se
                  trouvent une histoire, un savoir-faire et une recherche
                  constante d&apos;équilibre entre finesse, fraîcheur et
                  profondeur. Les grandes maisons champenoises ont construit
                  leur réputation sur la régularité de leur style, la
                  précision de leurs assemblages et leur capacité à élaborer
                  des vins d&apos;une remarquable longévité.
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-serif text-xl text-stone-900">
                  La diversité des terroirs champenois
                </h3>

                <p>
                  La personnalité des grands champagnes repose également sur
                  la diversité de leurs origines. La Montagne de Reims est
                  notamment réputée pour ses pinots noirs structurés, tandis
                  que la Côte des Blancs offre au chardonnay des conditions
                  privilégiées pour exprimer tension, élégance et minéralité.
                  La Vallée de la Marne et la Côte des Bar enrichissent cette
                  mosaïque de terroirs, chacun apportant sa propre
                  interprétation du vignoble champenois.
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-serif text-xl text-stone-900">
                  Champagnes millésimés et cuvées de prestige
                </h3>

                <p>
                  Les champagnes millésimés traduisent le caractère
                  d&apos;une année particulière. Élaborés à partir de raisins
                  récoltés au cours d&apos;un même millésime, ils révèlent
                  avec le temps une complexité aromatique et une profondeur
                  remarquables. Les cuvées de prestige représentent quant à
                  elles une expression particulièrement ambitieuse du
                  savoir-faire des maisons et des vignerons, associant
                  sélection rigoureuse, précision et potentiel
                  d&apos;évolution.
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-serif text-xl text-stone-900">
                  La sélection The Wine Watchers
                </h3>

                <p>
                  Chez The Wine Watchers, nous privilégions les champagnes
                  dont la personnalité, la qualité d&apos;élaboration et le
                  potentiel de garde justifient une place parmi les grandes
                  références du vignoble. Des cuvées emblématiques de la
                  Maison Salon aux champagnes de Louis Roederer, notre
                  sélection met en lumière des signatures reconnues pour
                  leur exigence et leur capacité à traverser les années avec
                  élégance.
                </p>
              </div>
            </div>
          </details>
        </section>
      )}
      {wineLinks.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-10 md:px-6">
          <details className="border-t border-stone-200 pt-5">
            <summary className="cursor-pointer font-serif text-xl text-[#8a1f1f]">
              Consulter toutes les fiches vins de cette sélection ({wineLinks.length})
            </summary>
            <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {wineLinks.map((wine) => (
                <li key={wine.slug}>
                  <Link
                    href={`/boutique/vin/${encodeURIComponent(wine.slug!.trim())}`}
                    prefetch={false}
                    className="block py-1 text-stone-700 hover:text-[#8a1f1f] hover:underline"
                  >
                    {wine.name}
                    {wine.vintage && !String(wine.name).includes(String(wine.vintage))
                      ? ` ${wine.vintage}` : ""}
                    {[wine.bottle_size, wine.packaging].filter(Boolean).length > 0
                      ? ` · ${[wine.bottle_size, wine.packaging].filter(Boolean).join(" · ")}` : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}
    </main>
  );
}
