import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comparatifs | Académie The Wine Watchers",
  description:
    "Découvrez nos comparatifs entre grands vins, domaines, appellations et millésimes.",
  alternates: {
    canonical: "/academie/comparatifs",
  },
};

const comparatifs = [
  "Pétrus ou Le Pin",
  "Lafite Rothschild ou Mouton Rothschild",
  "Château Margaux ou Château Palmer",
  "La Tâche ou Romanée-Conti",
  "Richebourg ou Romanée-Saint-Vivant",
  "Meursault ou Puligny-Montrachet",
  "Pingus ou Vega Sicilia Único",
  "Sassicaia ou Masseto",
  "Cristal ou Salon",
  "La Mouline, La Turque ou La Landonne",
  "Bordeaux 2019 ou Bordeaux 2020",
  "Bourgogne 2018 ou Bourgogne 2019",
];

export default function ComparatifsPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea]">
      <section className="bg-[#1c0f0b] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            Académie
          </p>

          <h1 className="mt-5 font-serif text-5xl">
            Les Comparatifs
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Des analyses précises pour comprendre les différences de style,
            de terroir, de garde et de personnalité entre les grandes
            références.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {comparatifs.map((comparatif) => (
            <div
              key={comparatif}
              className="rounded-3xl border border-[#e4d5c4] bg-white p-6 shadow-sm"
            >
              <h2 className="font-serif text-2xl text-[#24110d]">
                {comparatif}
              </h2>

              <p className="mt-3 text-[#6b5a50]">
                Comparatif complet prochainement.
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