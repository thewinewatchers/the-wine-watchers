import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides | Académie The Wine Watchers",
  description:
    "Découvrez nos guides consacrés à l’achat, la conservation, le service et la constitution d’une cave de grands vins.",
  alternates: {
    canonical: "/academie/guides",
  },
};

const guides = [
  "Comment constituer une cave de grands vins",
  "Comment conserver une bouteille de vin",
  "À quelle température servir un grand vin",
  "Quand ouvrir une bouteille ancienne",
  "Comment décanter un grand vin",
  "Comment lire une étiquette de vin",
  "Comment reconnaître un grand millésime",
  "Comment acheter un vin de garde",
  "Comment choisir un vin pour un cadeau",
  "Comment assurer une cave à vin",
  "Comment vendre une bouteille de collection",
  "Comment vérifier l’authenticité d’une bouteille",
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea]">
      <section className="bg-[#1c0f0b] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            Académie
          </p>

          <h1 className="mt-5 font-serif text-5xl">
            Les Guides
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
            Des conseils pratiques pour acheter, conserver, servir et
            apprécier les grands vins dans les meilleures conditions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <div
              key={guide}
              className="rounded-3xl border border-[#e4d5c4] bg-white p-6 shadow-sm"
            >
              <h2 className="font-serif text-2xl text-[#24110d]">
                {guide}
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