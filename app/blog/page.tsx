import Link from "next/link";
import { blogPosts } from "./blogPosts";

export const metadata = {
  title: "Blog Vin | The Wine Watchers",
  description:
    "Actualités, analyses, primeurs, appellations, millésimes et grands vins.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <nav
          aria-label="Fil d’Ariane"
          className="flex flex-wrap items-center gap-2 text-sm text-stone-500"
        >
          <Link href="/" className="hover:text-[#8a1f1f]">
            Accueil
          </Link>

          <span aria-hidden="true">/</span>
          <span aria-current="page">Blog</span>
        </nav>

        <header className="mt-6 border-b border-stone-200 pb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#8a1f1f]">
            Journal
          </p>

          <h1 className="mt-3 font-serif text-3xl md:text-4xl">
            Blog The Wine Watchers
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            Analyses, primeurs, grands millésimes, appellations et conseils
            pour mieux comprendre l’univers des grands vins.
          </p>
        </header>

        <section aria-label="Articles du blog" className="py-6">
          <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col rounded-lg border border-stone-200 bg-white p-5 transition-colors hover:border-[#8a1f1f]"
              >
                <p className="text-xs font-medium text-[#8a1f1f]">
                  {post.category}
                </p>

                <h2 className="mt-3 font-serif text-xl leading-snug text-stone-900">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-[#8a1f1f]"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="mt-3 flex-1 text-sm leading-7 text-stone-600">
                  {post.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
                  <p className="text-xs text-stone-500">
                    {post.date}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    aria-label={`Lire l’article : ${post.title}`}
                    className="text-sm font-medium text-[#8a1f1f] underline-offset-4 hover:underline"
                  >
                    Lire l’article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-5 text-sm">
          <Link
            href="/boutique"
            className="font-medium text-[#8a1f1f] hover:underline"
          >
            Découvrir nos vins →
          </Link>

          <Link
            href="/contact"
            className="text-stone-600 hover:text-[#8a1f1f]"
          >
            Contacter notre équipe
          </Link>
        </div>
      </div>
    </main>
  );
}