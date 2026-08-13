import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

const popularAppellations: Record<string, { name: string; href: string }[]> = {
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
    { name: "Puligny-Montrachet", href: "/appellation/puligny-montrachet" },
    { name: "Vosne-Romanée", href: "/appellation/vosne-romanee" },
    { name: "Gevrey-Chambertin", href: "/appellation/gevrey-chambertin" },
    { name: "Chambolle-Musigny", href: "/appellation/chambolle-musigny" },
  ],
  rhone: [
    { name: "Côte-Rôtie", href: "/appellation/cote-rotie" },
    { name: "Hermitage", href: "/appellation/hermitage" },
    { name: "Cornas", href: "/appellation/cornas" },
    { name: "Saint-Joseph", href: "/appellation/saint-joseph" },
    { name: "Châteauneuf-du-Pape", href: "/appellation/chateauneuf-du-pape" },
    { name: "Gigondas", href: "/appellation/gigondas" },
  ],
  italie: [
    { name: "Toscane", href: "/appellation/toscana" },
    { name: "Piémont", href: "/appellation/piemont" },
    { name: "Barolo", href: "/appellation/barolo" },
    { name: "Barbaresco", href: "/appellation/barbaresco" },
    { name: "Brunello di Montalcino", href: "/appellation/brunello-di-montalcino" },
    { name: "Bolgheri", href: "/appellation/bolgheri" },
    { name: "Super Toscans", href: "/appellation/toscana-igt" },
  ],
  espagne: [
    { name: "Ribera del Duero", href: "/appellation/ribera-del-duero" },
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
    { name: "Stags Leap District", href: "/appellation/stags-leap-district" },
  ],
  champagne: [
    { name: "Champagne", href: "/appellation/champagne" },
    { name: "Montagne de Reims", href: "/appellation/montagne-de-reims" },
    { name: "Vallée de la Marne", href: "/appellation/vallee-de-la-marne" },
    { name: "Côte des Blancs", href: "/appellation/cote-des-blancs" },
    { name: "Côte des Bar", href: "/appellation/cote-des-bar" },
  ],
};

type CategoryKey = keyof typeof categories;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories[slug as CategoryKey];

  if (!category) {
    return {
      title: "Catégorie introuvable | The Wine Watchers",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

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
    },
  };
}

export default async function BoutiqueCategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as CategoryKey;
  const category = categories[slug];

  if (!category) {
    notFound();
  }

  const appellationsToShow = popularAppellations[slug] || [];

  return (
    <main className="min-h-screen bg-[#f8f4ee]">
      <section className="relative overflow-hidden bg-[#210909] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%),linear-gradient(135deg,#2a0d0d,#120505)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <Link
            href="/boutique"
            className="mb-8 inline-block text-sm uppercase tracking-[0.25em] text-[#d8b56d] transition hover:text-white"
          >
            ← Retour boutique
          </Link>

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            The Wine Watchers
          </p>

          <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">
            {category.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            {category.description}
          </p>
        </div>
      </section>

      {appellationsToShow.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-10">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-serif text-2xl text-[#3b1f1f]">
              Appellations populaires
            </h2>

            <div className="flex flex-wrap gap-3">
              {appellationsToShow.map((appellation) => (
                <Link
                  key={appellation.name}
                  href={appellation.href}
                  className="rounded-full border border-[#d8b56d]/50 bg-[#f8f4ee] px-4 py-2 text-sm font-medium text-[#3b1f1f] transition hover:border-[#3b1f1f] hover:bg-[#3b1f1f] hover:text-white"
                >
                  {appellation.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <BoutiqueClient
        slug={slug}
        categoryTitle={category.title}
        appellations={category.appellations}
      />
    </main>
  );
}