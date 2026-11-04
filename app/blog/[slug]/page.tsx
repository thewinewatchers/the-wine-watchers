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
  "vendanges-2026-bordeaux": {
    internal: [
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
      {
        label: "Lire notre analyse des Primeurs Bordeaux 2025",
        href: "/blog/primeurs-bordeaux-2025",
      },
    ],
    external: [
      {
        label: "Site officiel des Vins de Bordeaux",
        href: "https://www.bordeaux.com/",
      },
      {
        label: "Institut des Sciences de la Vigne et du Vin",
        href: "https://www.isvv.u-bordeaux.fr/",
      },
    ],
  },

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

  const contentBlocks = post.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith("## ")) {
        return {
          type: "heading" as const,
          text: line.replace(/^##\s+/, ""),
        };
      }

      return {
        type: "paragraph" as const,
        text: line,
      };
    });

  const links = articleLinks[post.slug];

  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <nav
          aria-label="Fil d’Ariane"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-6 text-stone-500"
        >
          <Link href="/" className="hover:text-[#8a1f1f]">
            Accueil
          </Link>

          <span aria-hidden="true">/</span>

          <Link href="/blog" className="hover:text-[#8a1f1f]">
            Blog
          </Link>

          <span aria-hidden="true">/</span>
          <span aria-current="page">{post.title}</span>
        </nav>

        <article className="mx-auto mt-6 max-w-4xl">
          <header className="border-b border-stone-200 pb-6">
            <p className="text-xs font-medium text-[#8a1f1f]">
              {post.category}
            </p>

            <h1 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
              {post.title}
            </h1>

            <p className="mt-4 text-base leading-7 text-stone-600">
              {post.description}
            </p>

            <p className="mt-4 text-xs text-stone-500">
              {post.date}
            </p>
          </header>

          <div className="py-6 text-base leading-8 text-stone-700">
            {contentBlocks.map((block, index) =>
              block.type === "heading" ? (
                <h2
                  key={index}
                  className="mb-4 mt-8 font-serif text-2xl leading-snug text-stone-900 first:mt-0"
                >
                  {block.text}
                </h2>
              ) : (
                <p key={index} className="mb-5 last:mb-0">
                  {block.text}
                </p>
              )
            )}
          </div>

          {links && (
            <section
              aria-labelledby="further-reading-title"
              className="border-t border-stone-200 py-6"
            >
              <h2
                id="further-reading-title"
                className="font-serif text-2xl text-stone-900"
              >
                Pour aller plus loin
              </h2>

              <div className="mt-5 grid items-start gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-stone-800">
                    Sur The Wine Watchers
                  </h3>

                  <ul className="space-y-2 text-sm leading-6">
                    {links.internal.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[#8a1f1f] underline-offset-4 hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-stone-800">
                    Sources utiles
                  </h3>

                  <ul className="space-y-2 text-sm leading-6">
                    {links.external.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8a1f1f] underline-offset-4 hover:underline"
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

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-5 text-sm">
            <Link
              href="/blog"
              className="font-medium text-[#8a1f1f] hover:underline"
            >
              ← Retour au blog
            </Link>

            <Link
              href="/boutique"
              className="text-[#8a1f1f] hover:underline"
            >
              Découvrir nos vins →
            </Link>
          </footer>
        </article>
      </div>
    </main>
  );
}