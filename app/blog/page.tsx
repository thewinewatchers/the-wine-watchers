import Link from "next/link";
import { blogPosts } from "./blogPosts";

export const metadata = {
  title: "Blog Vin | The Wine Watchers",
  description:
    "Actualités, analyses, primeurs, appellations, millésimes et grands vins.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#f8f3eb] px-6 py-16 text-neutral-900">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#8B1E2D]">
            Journal
          </p>

          <h1 className="font-serif text-4xl font-semibold md:text-5xl">
            Blog The Wine Watchers
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-neutral-700">
            Analyses, primeurs, grands millésimes, appellations et conseils pour
            mieux comprendre l'univers des grands vins.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="flex min-h-[280px] flex-col rounded-2xl border border-[#e7d8c5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#8B1E2D]">
                {post.category}
              </p>

              <h2 className="mb-4 font-serif text-xl font-semibold leading-snug text-neutral-950">
                {post.title}
              </h2>

              <p className="mb-6 flex-1 text-sm leading-7 text-neutral-700">
                {post.description}
              </p>

              <div className="mt-auto flex items-center justify-between gap-4">
                <p className="text-xs text-neutral-500">{post.date}</p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex rounded-full bg-[#8B1E2D] px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
                >
                  Lire l'article
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}