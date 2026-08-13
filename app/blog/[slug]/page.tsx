import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "../blogPosts";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const articleLinks: Record<
  string,
  {
    internal: { label: string; href: string }[];
    external: { label: string; href: string }[];
  }
> = {
  "primeurs-bordeaux-2025": {
    internal: [
      {
        label: "Découvrir notre sélection Primeurs 2025",
        href: "/boutique/primeurs-2025",
      },
      {
        label: "Voir les vins de Bordeaux",
        href: "/boutique/bordeaux",
      },
      {
        label: "Explorer l’appellation Pauillac",
        href: "/appellation/pauillac",
      },
      {
        label: "Explorer l’appellation Margaux",
        href: "/appellation/margaux",
      },
      {
        label: "Explorer l’appellation Saint-Julien",
        href: "/appellation/saint-julien",
      },
      {
        label: "Explorer l’appellation Saint-Estèphe",
        href: "/appellation/saint-estephe",
      },
      {
        label: "Explorer l’appellation Pomerol",
        href: "/appellation/pomerol",
      },
      {
        label: "Explorer l’appellation Saint-Émilion",
        href: "/appellation/saint-emilion",
      },
      {
        label: "Explorer l’appellation Pessac-Léognan",
        href: "/appellation/pessac-leognan",
      },
    ],
    external: [
      {
        label: "Site officiel des Vins de Bordeaux",
        href: "https://www.bordeaux.com/",
      },
      {
        label: "Le négoce et les Primeurs à Bordeaux",
        href: "https://www.bordeaux.com/fr/metiers/negoce/",
      },
    ],
  },

  "comment-constituer-une-cave-de-grands-vins": {
    internal: [
      {
        label: "Découvrir la boutique The Wine Watchers",
        href: "/boutique",
      },
      {
        label: "Voir les vins de Bordeaux",
        href: "/boutique/bordeaux",
      },
      {
        label: "Voir les vins de Bourgogne",
        href: "/boutique/bourgogne",
      },
      {
        label: "Voir les vins du Rhône",
        href: "/boutique/rhone",
      },
      {
        label: "Voir les vins d’Italie",
        href: "/boutique/italie",
      },
      {
        label: "Voir les vins d’Espagne",
        href: "/boutique/espagne",
      },
      {
        label: "Voir les vins des USA",
        href: "/boutique/usa",
      },
      {
        label: "Voir les Champagnes",
        href: "/boutique/champagne",
      },
    ],
    external: [
      {
        label: "Site officiel des Vins de Bordeaux",
        href: "https://www.bordeaux.com/",
      },
    ],
  },

  "grands-millesimes-pauillac": {
    internal: [
      {
        label: "Explorer l’appellation Pauillac",
        href: "/appellation/pauillac",
      },
      {
        label: "Voir les vins de Bordeaux",
        href: "/boutique/bordeaux",
      },
      {
        label: "Découvrir Château Lafite Rothschild",
        href: "/producteur/chateau-lafite-rothschild",
      },
      {
        label: "Découvrir Château Mouton Rothschild",
        href: "/producteur/chateau-mouton-rothschild",
      },
      {
        label: "Découvrir Château Latour",
        href: "/producteur/chateau-latour",
      },
      {
        label: "Découvrir Château Lynch-Bages",
        href: "/producteur/chateau-lynch-bages",
      },
      {
        label: "Découvrir Château Pichon Baron",
        href: "/producteur/chateau-pichon-baron",
      },
      {
        label: "Lire l’article sur Château Lafite Rothschild",
        href: "/blog/chateau-lafite-rothschild-histoire-et-terroir",
      },
    ],
    external: [
      {
        label: "Fiche officielle INAO de l’appellation Pauillac",
        href: "https://www.inao.gouv.fr/produit/pauillac-24316",
      },
      {
        label: "Conseil des Grands Crus Classés en 1855",
        href: "https://gcc-1855.fr/",
      },
    ],
  },

  "chateau-lafite-rothschild-histoire-et-terroir": {
    internal: [
      {
        label: "Découvrir Château Lafite Rothschild",
        href: "/producteur/chateau-lafite-rothschild",
      },
      {
        label: "Explorer l’appellation Pauillac",
        href: "/appellation/pauillac",
      },
      {
        label: "Voir les vins de Bordeaux",
        href: "/boutique/bordeaux",
      },
      {
        label: "Lire l’article sur les grands millésimes de Pauillac",
        href: "/blog/grands-millesimes-pauillac",
      },
    ],
    external: [
      {
        label: "Site officiel de Château Lafite Rothschild",
        href: "https://www.lafite.com/domaines/chateau-lafite-rothschild/",
      },
      {
        label: "Conseil des Grands Crus Classés en 1855",
        href: "https://gcc-1855.fr/",
      },
    ],
  },

  "romanee-conti-un-domaine-legendaire": {
    internal: [
      {
        label: "Découvrir le Domaine de la Romanée-Conti",
        href: "/producteur/domaine-de-la-romanee-conti",
      },
      {
        label: "Voir les vins de Bourgogne",
        href: "/boutique/bourgogne",
      },
      {
        label: "Explorer Vosne-Romanée",
        href: "/appellation/vosne-romanee",
      },
      {
        label: "Explorer La Tâche",
        href: "/appellation/la-tache",
      },
      {
        label: "Explorer Richebourg",
        href: "/appellation/richebourg",
      },
      {
        label: "Explorer Romanée-Saint-Vivant",
        href: "/appellation/romanee-saint-vivant",
      },
      {
        label: "Explorer Échezeaux",
        href: "/appellation/echezeaux",
      },
      {
        label: "Explorer Grands-Échezeaux",
        href: "/appellation/grands-echezeaux",
      },
    ],
    external: [
      {
        label: "Site officiel du Domaine de la Romanée-Conti",
        href: "https://www.romanee-conti.fr/",
      },
    ],
  },
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((article) => article.slug === slug);

  if (!post) return {};

  return {
    title: `${post.title} | The Wine Watchers`,
    description: post.description,
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((article) => article.slug === slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const links = articleLinks[post.slug];

  return (
    <main className="min-h-screen bg-[#f8f3eb] text-neutral-900">
      <section className="bg-[#170606] px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/blog"
            className="mb-10 inline-flex text-sm text-[#d8b56d] transition hover:text-white"
          >
            ← Retour au blog
          </Link>

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            {post.category}
          </p>

          <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">
            {post.title}
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-200">
            {post.description}
          </p>

          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-[#d8b56d]">
            {post.date}
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 overflow-hidden rounded-3xl border border-[#d8b56d]/40 bg-[#2a0d0d] shadow-lg">
            <div className="flex min-h-[260px] items-center justify-center bg-[radial-gradient(circle_at_top_left,#8B1E2D,transparent_35%),linear-gradient(135deg,#170606,#2a0d0d,#5b111b)] px-8 text-center">
              <div>
                <p className="mb-4 text-sm uppercase tracking-[0.4em] text-[#d8b56d]">
                  The Wine Watchers
                </p>
                <p className="font-serif text-3xl text-white md:text-5xl">
                  Journal des grands vins
                </p>
              </div>
            </div>
          </div>

          <article className="rounded-3xl border border-[#e7d8c5] bg-white p-8 shadow-sm md:p-14">
            <h2 className="mb-8 font-serif text-3xl font-semibold text-neutral-950 md:text-4xl">
              {post.title}
            </h2>

            <div className="space-y-7 text-base leading-8 text-neutral-800 md:text-lg">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {links && (
              <section className="mt-12 rounded-2xl border border-[#e7d8c5] bg-[#f8f3eb] p-6">
                <h3 className="mb-5 font-serif text-2xl font-semibold text-neutral-950">
                  Pour aller plus loin
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#8B1E2D]">
                      Sur The Wine Watchers
                    </h4>

                    <ul className="space-y-3 text-sm leading-6">
                      {links.internal.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="font-medium text-neutral-800 underline decoration-[#8B1E2D]/40 underline-offset-4 transition hover:text-[#8B1E2D]"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#8B1E2D]">
                      Sources utiles
                    </h4>

                    <ul className="space-y-3 text-sm leading-6">
                      {links.external.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-neutral-800 underline decoration-[#8B1E2D]/40 underline-offset-4 transition hover:text-[#8B1E2D]"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            <div className="mt-12 border-t border-[#e7d8c5] pt-8">
              <Link
                href="/blog"
                className="inline-flex rounded-full border border-[#8B1E2D] px-5 py-2 text-sm font-semibold text-[#8B1E2D] transition hover:bg-[#8B1E2D] hover:text-white"
              >
                ← Retour au blog
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}