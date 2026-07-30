import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grands Domaines | Académie The Wine Watchers",
  description:
    "Découvrez les domaines les plus prestigieux du monde du vin : leur histoire, leurs terroirs et leurs cuvées emblématiques.",
  alternates: {
    canonical: "/academie/domaines",
  },
};

const domaines = [
  "Domaine de la Romanée-Conti",
  "Domaine Coche-Dury",
  "Domaine François Raveneau",
  "Georges Roumier",
  "Jacques Selosse",
  "Salon",
  "Louis Roederer",
  "Château Lafite Rothschild",
  "Château Margaux",
  "Pétrus",
  "Dominio de Pingus",
  "Vega Sicilia",
  "Tenuta San Guido",
  "Masseto",
];

export default function DomainesPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea]">
      <section className="bg-[#1c0f0b] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="uppercase tracking-[0.35em] text-[#d8b56d] text-sm">
            Académie
          </p>

          <h1 className="mt-5 font-serif text-5xl">
            Les Grands Domaines
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Les domaines qui ont façonné l'histoire des grands vins. Leur
            philosophie, leurs terroirs et les cuvées qui les ont rendus
            célèbres.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {domaines.map((domaine) => (
            <div
              key={domaine}
              className="rounded-3xl border border-[#e4d5c4] bg-white p-6 shadow-sm"
            >
              <h2 className="font-serif text-2xl text-[#24110d]">
                {domaine}
              </h2>

              <p className="mt-3 text-[#6b5a50]">
                Article complet prochainement.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/academie"
            className="rounded-full border border-[#8B1E2D] px-6 py-3 text-[#8B1E2D] transition hover:bg-[#8B1E2D] hover:text-white"
          >
            ← Retour à l'Académie
          </Link>
        </div>
      </section>
    </main>
  );
}