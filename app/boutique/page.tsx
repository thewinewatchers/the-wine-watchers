import Link from "next/link";

const categories = [
  {
    title: "Bordeaux",
    slug: "bordeaux",
    image: "/images/boutique-hero.png",
    text: "Premiers Grands Crus Classés, Médoc, Pomerol, Saint-Émilion et grandes signatures bordelaises.",
  },
  {
    title: "Bourgogne",
    slug: "bourgogne",
    image: "/images/romanee-conti-caisse.png",
    text: "Domaines recherchés, grands crus, premiers crus et appellations de collection.",
  },
  {
    title: "Primeurs 2025",
    slug: "primeurs-2025",
    image: "/images/boutique-hero.png",
    text: "Campagne Bordeaux Primeurs 2025, allocations, sorties et disponibilités.",
  },
  {
    title: "Italie",
    slug: "italie",
    image: "/images/boutique-hero.png",
    text: "Super Toscans, Piémont, Bolgheri et grandes cuvées italiennes.",
  },
  {
    title: "Espagne",
    slug: "espagne",
    image: "/images/boutique-hero.png",
    text: "Rioja, Ribera del Duero, Priorat et grandes références espagnoles.",
  },
  {
    title: "Rhône",
    slug: "rhone",
    image: "/images/boutique-hero.png",
    text: "Hermitage, Côte-Rôtie, Châteauneuf-du-Pape et grandes Syrah.",
  },
  {
    title: "États-Unis",
    slug: "usa",
    image: "/images/boutique-hero.png",
    text: "Napa Valley, grandes cuvées californiennes et domaines emblématiques comme Opus One.",
  },
];

export default function BoutiquePage() {
  return (
    <main className="min-h-screen bg-[#120706] text-[#f8efe3]">
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,181,109,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(116,19,22,0.45),transparent_38%),linear-gradient(135deg,#180605,#2a0b0b_45%,#090202)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.95fr_1.05fr] md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.42em] text-[#d8b56d]">
              The Wine Watchers
            </p>

            <h1 className="mt-7 font-serif text-5xl font-semibold leading-tight md:text-7xl">
              Une maison dédiée aux grands vins.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-9 text-white/72">
              Bordeaux, Bourgogne, Primeurs, domaines rares et bouteilles de
              collection sélectionnés avec exigence.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/boutique/bordeaux"
                className="rounded-full bg-[#d8b56d] px-9 py-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#160604] transition hover:bg-white"
              >
                Explorer la boutique
              </Link>

              <Link
                href="/boutique/primeurs-2025"
                className="rounded-full border border-[#d8b56d]/50 px-9 py-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#d8b56d] transition hover:bg-[#d8b56d] hover:text-[#160604]"
              >
                Primeurs 2025
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[3rem] bg-[#d8b56d]/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/5 p-3 shadow-2xl">
              <img
                src="/images/boutique-hero.png"
                alt="Sélection de grands vins The Wine Watchers"
                className="h-[420px] w-full rounded-[2rem] object-cover md:h-[540px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f1e8] px-6 py-18 text-[#24110d] md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#8a6a2f]">
              Sélections
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              Choisissez votre univers.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/boutique/${category.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-[#dfceb7] bg-[#fffaf3] shadow-sm transition hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#160604]/85 via-[#160604]/20 to-transparent" />

                  <h3 className="absolute bottom-6 left-6 font-serif text-4xl text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="p-7">
                  <p className="min-h-20 text-sm leading-7 text-[#6d5b50]">
                    {category.text}
                  </p>

                  <span className="mt-6 inline-block text-sm font-semibold uppercase tracking-[0.16em] text-[#8a1f1f]">
                    Voir la sélection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf3] px-6 py-16 text-[#24110d]">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-[#dfceb7] bg-[#120706] p-8 text-white md:p-12">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
                Service
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight">
                Vous recherchez une bouteille précise ?
              </h2>

              <p className="mt-5 text-base leading-8 text-white/70">
                Château, domaine, format, millésime ou allocation spécifique :
                nous pouvons vous accompagner dans votre recherche.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Recherche sur demande",
                "Grands domaines",
                "Provenance suivie",
                "Paiement sécurisé",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm font-semibold text-white"
                >
                  {item}
                </div>
              ))}

              <Link
                href="/contact"
                className="rounded-2xl bg-[#d8b56d] p-5 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#160604] transition hover:bg-white sm:col-span-2"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}