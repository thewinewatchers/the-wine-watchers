import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const SITE_URL = "https://www.thewinewatchers.com";

const appellations: Record<
  string,
  {
    name: string;
    title: string;
    description: string;
    intro: string;
    boutiqueHref: string;
    boutiqueLabel: string;
  }
> = {
  pauillac: {
    name: "Pauillac",
    title: "Vins de Pauillac – Grands Crus Classés",
    description:
      "Découvrez notre sélection de vins de Pauillac : grands crus classés, primeurs, millésimes rares et châteaux emblématiques du Médoc.",
    intro:
      "Pauillac est l’une des appellations les plus prestigieuses du Médoc. Elle rassemble certains des plus grands noms de Bordeaux, réputés pour leur puissance, leur profondeur et leur immense potentiel de garde.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  margaux: {
    name: "Margaux",
    title: "Vins de Margaux – Élégance du Médoc",
    description:
      "Sélection de vins de Margaux : grands crus classés, primeurs et millésimes recherchés disponibles chez The Wine Watchers.",
    intro:
      "Margaux est une appellation emblématique du Médoc, connue pour l’élégance, la finesse et la complexité de ses vins.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  pomerol: {
    name: "Pomerol",
    title: "Vins de Pomerol – Grands vins rares",
    description:
      "Découvrez notre sélection de vins de Pomerol : Petrus, Le Pin, Vieux Château Certan, La Conseillante et autres grands vins rares.",
    intro:
      "Pomerol est une appellation mythique de la rive droite bordelaise. Réputée pour ses grands merlots, elle produit des vins profonds, veloutés et rares.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  "saint-emilion": {
    name: "Saint-Émilion",
    title: "Vins de Saint-Émilion – Grands Crus Classés",
    description:
      "Achetez des vins de Saint-Émilion : grands crus classés, millésimes recherchés et références prestigieuses de la rive droite.",
    intro:
      "Saint-Émilion est l’une des appellations les plus célèbres de Bordeaux. Ses vins allient richesse, élégance et profondeur.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  "saint-julien": {
    name: "Saint-Julien",
    title: "Vins de Saint-Julien – Grands Crus du Médoc",
    description:
      "Sélection de vins de Saint-Julien : grands crus classés, primeurs et millésimes recherchés du Médoc.",
    intro:
      "Saint-Julien est réputée pour l’équilibre exceptionnel de ses vins. Située au cœur du Médoc, l’appellation offre des crus structurés, élégants et réguliers.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  "saint-estephe": {
    name: "Saint-Estèphe",
    title: "Vins de Saint-Estèphe – Grands vins de garde",
    description:
      "Découvrez les vins de Saint-Estèphe : grands crus classés, primeurs et millésimes recherchés disponibles à l’achat.",
    intro:
      "Saint-Estèphe produit des vins puissants, profonds et structurés. L’appellation est particulièrement appréciée pour ses grands vins de garde.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  "pessac-leognan": {
    name: "Pessac-Léognan",
    title: "Vins de Pessac-Léognan – Grands Crus de Graves",
    description:
      "Découvrez notre sélection de vins de Pessac-Léognan : grands crus classés, vins rouges et blancs de Bordeaux, primeurs et millésimes recherchés.",
    intro:
      "Pessac-Léognan est l’une des grandes appellations de Bordeaux, réputée pour ses vins rouges élégants et ses grands vins blancs secs.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  sauternes: {
    name: "Sauternes",
    title: "Vins de Sauternes – Grands vins liquoreux de Bordeaux",
    description:
      "Découvrez notre sélection de vins de Sauternes : grands liquoreux de Bordeaux, millésimes rares et châteaux emblématiques.",
    intro:
      "Sauternes est l’appellation emblématique des grands vins liquoreux de Bordeaux.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  meursault: {
    name: "Meursault",
    title: "Vins de Meursault – Grands blancs de Bourgogne",
    description:
      "Sélection de vins de Meursault : grands blancs de Bourgogne, domaines réputés et millésimes recherchés.",
    intro:
      "Meursault est une appellation majeure de la Côte de Beaune, mondialement connue pour ses grands vins blancs.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "cote-de-nuits": {
    name: "Côte de Nuits",
    title: "Vins de Côte de Nuits – Grands rouges de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Côte de Nuits : grands crus, premiers crus, domaines prestigieux et millésimes recherchés.",
    intro:
      "La Côte de Nuits concentre certains des plus grands terroirs de Bourgogne. Elle est mondialement réputée pour ses grands vins rouges, profonds, complexes et taillés pour la garde.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "cote-de-beaune": {
    name: "Côte de Beaune",
    title: "Vins de Côte de Beaune – Grands blancs et rouges de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Côte de Beaune : grands blancs, rouges élégants, domaines réputés et millésimes recherchés.",
    intro:
      "La Côte de Beaune est l’un des grands secteurs de Bourgogne. Elle est particulièrement célèbre pour ses grands vins blancs, tout en offrant également des rouges élégants et raffinés.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  chablis: {
    name: "Chablis",
    title: "Vins de Chablis – Grands blancs de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Chablis : grands blancs de Bourgogne, domaines réputés, premiers crus, grands crus et millésimes recherchés.",
    intro:
      "Chablis est une appellation emblématique du nord de la Bourgogne, réputée pour ses grands vins blancs issus du Chardonnay, marqués par la fraîcheur, la précision et la minéralité.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "puligny-montrachet": {
    name: "Puligny-Montrachet",
    title: "Vins de Puligny-Montrachet – Grands blancs de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Puligny-Montrachet : grands blancs de Bourgogne, domaines prestigieux, premiers crus, grands crus et millésimes recherchés.",
    intro:
      "Puligny-Montrachet est l’une des appellations les plus prestigieuses de la Côte de Beaune. Elle est reconnue pour ses grands vins blancs d’une grande finesse, alliant tension, élégance et profondeur.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "vosne-romanee": {
    name: "Vosne-Romanée",
    title: "Vins de Vosne-Romanée – Grands rouges de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Vosne-Romanée, appellation mythique de la Côte de Nuits.",
    intro:
      "Vosne-Romanée est l’un des villages les plus prestigieux de Bourgogne.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "gevrey-chambertin": {
    name: "Gevrey-Chambertin",
    title: "Vins de Gevrey-Chambertin – Côte de Nuits",
    description:
      "Sélection de vins de Gevrey-Chambertin : grands crus, premiers crus et domaines prestigieux.",
    intro:
      "Gevrey-Chambertin est une appellation incontournable de la Côte de Nuits.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "chambolle-musigny": {
    name: "Chambolle-Musigny",
    title: "Vins de Chambolle-Musigny – Élégance bourguignonne",
    description:
      "Découvrez les vins de Chambolle-Musigny, grands rouges de Bourgogne réputés pour leur finesse.",
    intro: "Chambolle-Musigny incarne la finesse et l’élégance bourguignonnes.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
};

type AppellationWine = {
  id: string;
  slug?: string | null;
  name?: string | null;
  producer?: string | null;
  vintage?: string | number | null;
  price?: string | number | null;
  image?: string | null;
  appellation?: string | null;
  region?: string | null;
  category?: string | null;
  classification?: string | null;
  bottle_size?: string | null;
  packaging?: string | null;
  hidden_from_site?: boolean | null;
};

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

function categoryToSlug(value?: string | null) {
  if (!value) return "";

  const normalized = slugify(value);

  if (normalized.includes("italie")) return "italie";
  if (normalized.includes("bourgogne")) return "bourgogne";
  if (normalized.includes("bordeaux")) return "bordeaux";
  if (normalized.includes("rhone")) return "rhone";
  if (normalized.includes("espagne")) return "espagne";
  if (normalized.includes("primeur")) return "primeurs-2025";

  return normalized;
}

function getWineHref(wine: AppellationWine) {
  return `/boutique/vin/${wine.slug || wine.id}`;
}

function getAbsoluteWineUrl(wine: AppellationWine) {
  return `${SITE_URL}${getWineHref(wine)}`;
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const appellation = appellations[slug];

  if (!appellation) {
    return {
      title: "Appellation introuvable | The Wine Watchers",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${appellation.title} | The Wine Watchers`,
    description: appellation.description,
    alternates: {
      canonical: `${SITE_URL}/appellation/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AppellationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const appellation = appellations[slug];

  if (!appellation) {
    notFound();
  }

  const { data: wines, error } = await supabase
    .from("wines")
    .select(
      "id, slug, name, producer, vintage, price, image, appellation, region, category, classification, bottle_size, packaging, hidden_from_site",
    )
    .eq("appellation", appellation.name)
    .neq("hidden_from_site", true)
    .order("name", { ascending: true })
    .order("vintage", { ascending: false });

  const visibleWines = ((wines || []) as AppellationWine[]).filter(
    (wine) => wine.hidden_from_site !== true,
  );

  const producers = Array.from(
    new Set(visibleWines.map((wine) => wine.producer).filter(Boolean)),
  ) as string[];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Vins de ${appellation.name}`,
    description: appellation.description,
    url: `${SITE_URL}/appellation/${slug}`,
    numberOfItems: visibleWines.length,
    itemListElement: visibleWines.map((wine, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getAbsoluteWineUrl(wine),
      name: wine.name || `${appellation.name} ${wine.vintage || ""}`.trim(),
    })),
  };

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />

      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="transition hover:text-[#8B1E2D]">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/boutique" className="transition hover:text-[#8B1E2D]">
            Boutique
          </Link>
          <span>/</span>
          <Link
            href={appellation.boutiqueHref}
            className="transition hover:text-[#8B1E2D]"
          >
            {appellation.boutiqueHref.includes("bourgogne")
              ? "Bourgogne"
              : "Bordeaux"}
          </Link>
          <span>/</span>
          <span className="font-medium text-[#3b1f1f]">{appellation.name}</span>
        </div>

        <div className="mb-10 rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href={appellation.boutiqueHref}
              className="inline-flex rounded-full border border-[#8B1E2D] px-5 py-2 text-sm font-semibold text-[#8B1E2D] transition hover:bg-[#8B1E2D] hover:text-white"
            >
              ← {appellation.boutiqueLabel}
            </Link>
          </div>

          <p className="mb-2 text-sm uppercase tracking-[0.25em] text-gray-500">
            Appellation
          </p>

          <h1 className="mb-3 font-serif text-4xl text-[#3b1f1f] md:text-6xl">
            {appellation.name}
          </h1>

          <p className="mb-6 text-lg font-medium text-gray-700">
            {visibleWines.length} vin(s) disponible(s)
          </p>

          <p className="max-w-4xl text-lg leading-relaxed text-gray-700">
            {appellation.intro}
          </p>

          {error && (
            <p className="mt-4 text-red-600">
              Erreur Supabase : {error.message}
            </p>
          )}
        </div>

        {producers.length > 0 && (
          <div
            id="producteurs"
            className="mb-10 scroll-mt-24 rounded-[2rem] border border-[#e1d1bd] bg-white p-8 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
              Producteurs liés
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {producers.map((producer) => (
                <Link
                  key={producer}
                  href={`/producteur/${slugify(producer)}`}
                  className="rounded-full border border-[#d8b56d]/50 bg-[#fffaf3] px-5 py-2 text-sm text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
                >
                  {producer}
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
            Vins de {appellation.name}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d5b50]">
            Découvrez les vins actuellement disponibles dans cette appellation.
            Comparez les domaines, les millésimes et les caractéristiques de
            chaque cuvée avant de consulter sa fiche détaillée.
          </p>
        </div>

        {visibleWines.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-600 shadow-sm">
            Aucun vin disponible actuellement pour cette appellation.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleWines.map((wine) => {
              const regionValue = wine.region || wine.category;
              const regionSlug = categoryToSlug(regionValue);

              return (
                <article
                  key={wine.id}
                  className="group overflow-hidden rounded-[1.7rem] border border-[#dfcfb8] bg-[#fffaf3] shadow-sm transition hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl"
                >
                  <Link href={getWineHref(wine)} className="block">
                    <div className="flex h-[245px] items-center justify-center bg-[#efe3d2] p-6">
                      {wine.image ? (
                        <img
                          src={wine.image}
                          alt={`Bouteille de ${wine.name || "vin"} - ${appellation.name}`}
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
                    {wine.producer && (
                      <Link
                        href={`/producteur/${slugify(wine.producer)}`}
                        className="mb-3 block rounded-full bg-[#24110d]/90 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-[#d8b56d] transition hover:bg-[#8a1f1f]"
                      >
                        {wine.producer}
                      </Link>
                    )}

                    <Link href={getWineHref(wine)} className="block">
                      <h3 className="min-h-[64px] font-serif text-sm leading-tight text-[#24110d] group-hover:text-[#8a1f1f]">
                        {wine.name}
                      </h3>
                    </Link>

                    <div className="mt-3 space-y-1 text-sm text-[#6d5b50]">
                      {wine.vintage && <p>Millésime {wine.vintage}</p>}
                      {wine.classification && <p>{wine.classification}</p>}
                      {wine.bottle_size && (
                        <p>Flaconnage : {wine.bottle_size}</p>
                      )}
                      {wine.packaging && <p>Caissage : {wine.packaging}</p>}

                      {regionValue && regionSlug && (
                        <Link
                          href={appellation.boutiqueHref}
                          className="inline-block underline underline-offset-4 transition hover:text-[#8a1f1f]"
                        >
                          {regionValue}
                        </Link>
                      )}
                    </div>

                    <p className="mt-4 font-serif text-2xl text-[#8a1f1f]">
                      {formatPrice(wine.price)}
                    </p>

                    <Link
                      href={getWineHref(wine)}
                      className="mt-5 inline-flex w-full justify-center rounded-full bg-[#8a1f1f] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#641313]"
                    >
                      Voir le vin
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
