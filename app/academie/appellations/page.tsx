import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Appellations | Académie The Wine Watchers",
  description:
    "Découvrez les grandes appellations viticoles, leurs terroirs, leurs cépages et leurs styles de vins.",
  alternates: {
    canonical: "/academie/appellations",
  },
};

const appellations = [
  "Pauillac",
  "Margaux",
  "Saint-Julien",
  "Saint-Estèphe",
  "Pomerol",
  "Saint-Émilion",
  "Pessac-Léognan",
  "Sauternes",
  "Gevrey-Chambertin",
  "Vosne-Romanée",
  "Chambolle-Musigny",
  "Meursault",
  "Puligny-Montrachet",
  "Chablis",
  "Côte-Rôtie",
  "Hermitage",
  "Champagne",
  "Ribera del Duero",
  "Bolgheri",
  "Napa Valley",
];

export default function AppellationsPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea]">
      <section className="bg-[#1c0f0b] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            Académie
          </p>

          <h1 className="mt-5 font-serif text-5xl">
            Les Grandes Appellations
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Comprendre les terroirs, les cépages, les classifications et les
            styles qui définissent les appellations les plus prestigieuses.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {appellations.map((appellation) => (
            <div
              key={appellation}
              className="rounded-3xl border border-[#e4d5c4] bg-white p-6 shadow-sm"
            >
              <h2 className="font-serif text-2xl text-[#24110d]">
                {appellation}
              </h2>

              <p className="mt-3 text-[#6b5a50]">
                Guide complet prochainement.
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