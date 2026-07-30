import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "L’Académie The Wine Watchers",
  description:
    "Découvrez les grands domaines, appellations, millésimes, vins mythiques, comparatifs et guides de The Wine Watchers.",
  alternates: {
    canonical: "/academie",
  },
};

const sections = [
  {
    title: "Grands Domaines",
    description:
      "Histoire, terroirs, cuvées et identité des domaines les plus prestigieux.",
    href: "/academie/domaines",
  },
  {
    title: "Appellations",
    description:
      "Comprendre les grandes appellations, leurs terroirs et leurs styles.",
    href: "/academie/appellations",
  },
  {
    title: "Millésimes",
    description:
      "Le guide des grands millésimes et de leur potentiel de garde.",
    href: "/academie/millesimes",
  },
  {
    title: "Grands Vins",
    description:
      "Les cuvées mythiques qui ont marqué l’histoire du vin.",
    href: "/academie/grands-vins",
  },
  {
    title: "Comparatifs",
    description:
      "Des analyses précises pour mieux comprendre les grandes références.",
    href: "/academie/comparatifs",
  },
  {
    title: "Guides",
    description:
      "Conservation, service, achat et constitution d’une grande cave.",
    href: "/academie/guides",
  },
];

export default function AcademiePage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#24110d]">
      <section className="relative overflow-hidden bg-[#1c0f0b] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,181,109,0.22),transparent_42%),linear-gradient(135deg,#1c0f0b,#3a1712)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center lg:py-28">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            The Wine Watchers
          </p>

          <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
            L’Académie
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/75 md:text-lg">
            Une bibliothèque dédiée aux grands vins, aux domaines emblématiques,
            aux appellations, aux millésimes et à la culture du vin.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#8a6a2f] hover:shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-[#8a6a2f]">
                Académie
              </p>

              <h2 className="mt-5 font-serif text-3xl text-[#24110d] transition group-hover:text-[#8a1f1f]">
                {section.title}
              </h2>

              <p className="mt-4 text-base leading-7 text-[#6d5b50]">
                {section.description}
              </p>

              <p className="mt-7 text-sm font-semibold text-[#8a1f1f]">
                Découvrir →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}