import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grands Vins | Académie The Wine Watchers",
  description:
    "Découvrez les vins mythiques qui ont marqué l’histoire : leur origine, leur identité et leur place parmi les plus grandes références.",
  alternates: {
    canonical: "/academie/grands-vins",
  },
};

const vins = [
  "Romanée-Conti",
  "La Tâche",
  "Richebourg",
  "Montrachet",
  "Corton-Charlemagne",
  "Château Lafite Rothschild",
  "Château Margaux",
  "Château Latour",
  "Pétrus",
  "Le Pin",
  "Sassicaia",
  "Masseto",
  "Pingus",
  "Vega Sicilia Único",
  "Opus One",
  "Cristal",
  "Salon",
  "La Turque",
  "La Mouline",
  "La Landonne",
];

export default function GrandsVinsPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea]">
      <section className="bg-[#1c0f0b] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            Académie
          </p>

          <h1 className="mt-5 font-serif text-5xl">
            Les Grands Vins
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Les cuvées mythiques qui incarnent l’excellence, la rareté et
            l’expression la plus aboutie de leur terroir.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {vins.map((vin) => (
            <div
              key={vin}
              className="rounded-3xl border border-[#e4d5c4] bg-white p-6 shadow-sm"
            >
              <h2 className="font-serif text-2xl text-[#24110d]">
                {vin}
              </h2>

              <p className="mt-3 text-[#6b5a50]">
                Dossier complet prochainement.
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