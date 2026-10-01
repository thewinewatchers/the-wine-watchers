import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import BoutiqueClient from "../BoutiqueClient";

const SITE_URL = "https://www.thewinewatchers.com";

export const metadata: Metadata = {
  title: "Bordeaux Primeurs 2025 | The Wine Watchers",
  description:
    "Découvrez notre sélection de Bordeaux Primeurs 2025 : grands châteaux, appellations prestigieuses, prix, conditionnements et disponibilités en primeur.",
  alternates: {
    canonical: `${SITE_URL}/boutique/primeurs-2025`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Bordeaux Primeurs 2025 | The Wine Watchers",
    description:
      "Découvrez notre sélection de Bordeaux Primeurs 2025 : grands châteaux, appellations prestigieuses, prix, conditionnements et disponibilités en primeur.",
    url: `${SITE_URL}/boutique/primeurs-2025`,
    siteName: "The Wine Watchers",
    locale: "fr_FR",
    type: "website",
  },
};

const primeursAppellations = [
  { name: "Pauillac", href: "/appellation/pauillac" },
  { name: "Margaux", href: "/appellation/margaux" },
  { name: "Saint-Julien", href: "/appellation/saint-julien" },
  { name: "Saint-Estèphe", href: "/appellation/saint-estephe" },
  { name: "Pomerol", href: "/appellation/pomerol" },
  { name: "Saint-Émilion", href: "/appellation/saint-emilion" },
  { name: "Pessac-Léognan", href: "/appellation/pessac-leognan" },
];

export default function Primeurs2025Page() {
  return (
    <main className="min-h-screen bg-[#f8f4ee]">
      <section className="relative overflow-hidden bg-[#210909] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%),linear-gradient(135deg,#2a0d0d,#120505)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Link
            href="/boutique"
            className="mb-8 inline-block text-sm uppercase tracking-[0.25em] text-[#d8b56d] transition hover:text-white"
          >
            ← Retour boutique
          </Link>

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            The Wine Watchers
          </p>

          <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">
            Bordeaux Primeurs 2025
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 md:text-lg">
            Découvrez notre sélection de Bordeaux Primeurs 2025, proposée selon
            les disponibilités et allocations. Retrouvez les grands vins du
            millésime 2025 avec leurs prix et conditionnements disponibles.
          </p>

          <p className="mt-4 max-w-3xl text-base leading-8 text-white/75 md:text-lg">
            Les vins sont proposés en primeur, avant leur mise en bouteille et
            leur livraison définitive, parmi les grandes propriétés de Pauillac,
            Margaux, Saint-Julien, Saint-Estèphe, Pomerol, Saint-Émilion et
            Pessac-Léognan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-2xl text-[#3b1f1f]">
            Appellations Bordeaux Primeurs 2025
          </h2>

          <div className="flex flex-wrap gap-3">
            {primeursAppellations.map((appellation) => (
              <Link
                key={appellation.name}
                href={appellation.href}
                className="rounded-full border border-[#d8b56d]/50 bg-[#f8f4ee] px-4 py-2 text-sm font-medium text-[#3b1f1f] transition hover:border-[#3b1f1f] hover:bg-[#3b1f1f] hover:text-white"
              >
                {appellation.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <BoutiqueClient
          slug="primeurs-2025"
          categoryTitle="Primeurs 2025"
          appellations={[]}
        />
      </Suspense>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-white p-8 shadow-sm md:p-10">
          <h2 className="font-serif text-3xl text-[#3b1f1f]">
            Acheter des Bordeaux Primeurs 2025
          </h2>

          <div className="mt-5 max-w-4xl space-y-4 text-base leading-8 text-[#5b4a43]">
            <p>
              L’achat en primeur permet de réserver un vin alors qu’il poursuit
              encore son élevage au château, avant sa mise en bouteille. Les
              références proposées par The Wine Watchers sont présentées avec
              leurs prix, conditionnements et disponibilités afin de faciliter
              la sélection des grands vins de Bordeaux du millésime 2025.
            </p>

            <p>
              Notre sélection réunit des propriétés issues des principales
              appellations bordelaises, notamment Pauillac, Margaux,
              Saint-Julien, Saint-Estèphe, Pomerol, Saint-Émilion et
              Pessac-Léognan. Les disponibilités peuvent évoluer selon les
              allocations et les quantités encore accessibles.
            </p>

            <p>
              Chaque fiche présente les informations propres au vin et au
              millésime ainsi que les conditionnements proposés. Les vins
              achetés en primeur seront livrés après leur élevage et leur mise
              en bouteille, selon le calendrier de disponibilité propre à
              chaque propriété.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}