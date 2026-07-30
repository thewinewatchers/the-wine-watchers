import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Millésimes | Académie The Wine Watchers",
  description:
    "Découvrez les grands millésimes, leurs caractéristiques, leur évolution et leur potentiel de garde.",
  alternates: {
    canonical: "/academie/millesimes",
  },
};

const millesimes = [
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2016",
  "2015",
  "2010",
  "2009",
  "2005",
  "2000",
  "1996",
  "1990",
  "1989",
  "1982",
];

export default function MillesimesPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea]">
      <section className="bg-[#1c0f0b] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            Académie
          </p>

          <h1 className="mt-5 font-serif text-5xl">
            Les Grands Millésimes
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Analyse des conditions climatiques, du style des vins, de leur
            évolution et de leur potentiel de garde.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {millesimes.map((millesime) => (
            <div
              key={millesime}
              className="rounded-3xl border border-[#e4d5c4] bg-white p-6 text-center shadow-sm"
            >
              <h2 className="font-serif text-4xl text-[#24110d]">
                {millesime}
              </h2>

              <p className="mt-3 text-[#6b5a50]">
                Analyse prochainement.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/academie"
            className="rounded-full border border-[#8B1E2D] px-6 py-3 text-[#8B1E2D] transition hover:bg-[#8B1E2D] hover:text-white"
          >
            ← Retour à l&apos;Académie
          </Link>
        </div>
      </section>
    </main>
  );
}