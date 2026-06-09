import Link from "next/link";

const categories = [
  {
    title: "Bordeaux",
    slug: "bordeaux",
    description:
      "Premiers Grands Crus Classés, crus classés du Médoc, grands Pomerol et Saint-Émilion.",
    highlight: "Pauillac · Margaux · Saint-Julien · Pomerol",
  },
  {
    title: "Bourgogne",
    slug: "bourgogne",
    description:
      "Grands crus, premiers crus et domaines recherchés de la Côte de Nuits et de la Côte de Beaune.",
    highlight: "Côte de Nuits · Côte de Beaune · Chablis",
  },
  {
    title: "Rhône",
    slug: "rhone",
    description:
      "Grandes appellations du Rhône nord et sud, des Syrah de légende aux grands Châteauneuf.",
    highlight: "Côte-Rôtie · Hermitage · Châteauneuf-du-Pape",
  },
  {
    title: "Grands vins d’Italie",
    slug: "italie",
    description:
      "Icônes italiennes, Super Toscans, grands vins du Piémont et références de collection.",
    highlight: "Toscane · Piémont · Barolo · Bolgheri",
  },
  {
    title: "Espagne",
    slug: "espagne",
    description:
      "Grandes bouteilles espagnoles issues des régions les plus reconnues.",
    highlight: "Ribera del Duero · Rioja · Priorat",
  },
  {
    title: "USA",
    slug: "usa",
    description:
      "Sélection de grandes références américaines, principalement Napa Valley et Sonoma.",
    highlight: "Napa Valley · Sonoma · Oakville",
  },
  {
    title: "Primeurs 2025",
    slug: "primeurs-2025",
    description:
      "Sélection Bordeaux Primeurs 2025, sorties en cours, allocations et disponibilités.",
    highlight: "Campagne Primeurs · Bordeaux 2025",
  },
];

export default function BoutiquePage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#24110d]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#170606] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,181,109,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(138,31,31,0.35),transparent_36%),linear-gradient(135deg,#2a0d0d,#100303)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-5xl">
            <p className="mb-5 text-sm uppercase tracking-[0.38em] text-[#d8b56d]">
              The Wine Watchers
            </p>

            <h1 className="font-serif text-5xl font-semibold leading-tight md:text-7xl">
              Boutique de grands vins
            </h1>

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl">
              <img
                src="/images/boutique-hero.png"
                alt="Boutique de grands vins The Wine Watchers"
                className="h-72 w-full object-cover md:h-96"
              />
            </div>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
              Une sélection soignée de grands crus, domaines prestigieux,
              bouteilles rares et références de collection, organisée par
              grandes régions viticoles.
            </p>

            <div className="mt-10">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#d8b56d]">
                Accès direct par région
              </p>

              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/boutique/${category.slug}`}
                    className="rounded-full border border-white/25 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition hover:border-[#d8b56d] hover:bg-[#d8b56d] hover:text-[#170606]"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* TRUST / INTRO */}
      <section className="border-b border-[#e2d2bd] bg-[#fffaf3]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8a6a2f]">
              Sélection
            </p>
            <p className="mt-3 font-serif text-2xl text-[#24110d]">
              Grands crus & domaines recherchés
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8a6a2f]">
              Provenance
            </p>
            <p className="mt-3 font-serif text-2xl text-[#24110d]">
              Bouteilles suivies avec exigence
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8a6a2f]">
              Service
            </p>
            <p className="mt-3 font-serif text-2xl text-[#24110d]">
              Accompagnement personnalisé
            </p>
          </div>
        </div>
      </section>

      {/* INTRO TEXT */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
              Cave de collection
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#24110d] md:text-5xl">
              Une boutique pensée comme une sélection privée.
            </h2>
          </div>

          <p className="text-base leading-8 text-[#6d5b50] md:text-lg">
            Chaque région regroupe ses appellations et ses domaines majeurs afin
            de conserver une navigation claire, élégante et adaptée à un
            catalogue de grands vins. Choisissez une région pour accéder à la
            sélection disponible.
          </p>
        </div>
      </section>

      {/* SELECTION PREMIUM */}
      <section id="selection" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
            Sélection
          </p>

          <h2 className="mt-3 font-serif text-4xl text-[#24110d] md:text-5xl">
            Une approche plus confidentielle du grand vin
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[#6d5b50] md:text-lg">
            The Wine Watchers accompagne les collectionneurs, amateurs et
            professionnels dans la recherche de grandes bouteilles, d’allocations
            limitées et de millésimes spécifiques.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/boutique/primeurs-2025"
            className="group rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-[#8a6a2f]">
              Campagne
            </p>

            <h3 className="mt-5 font-serif text-3xl text-[#24110d] group-hover:text-[#8a1f1f]">
              Primeurs 2025
            </h3>

            <p className="mt-5 text-sm leading-7 text-[#6d5b50]">
              Suivez les sorties, allocations et disponibilités autour de la
              campagne Bordeaux Primeurs 2025.
            </p>

            <span className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.16em] text-[#24110d] group-hover:text-[#8a1f1f]">
              Voir les primeurs →
            </span>
          </Link>

          <Link
            href="/contact"
            className="group rounded-[2rem] border border-[#e1d1bd] bg-[#24110d] p-8 text-white shadow-sm transition hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-[#d8b56d]">
              Sur demande
            </p>

            <h3 className="mt-5 font-serif text-3xl text-white">
              Recherche personnalisée
            </h3>

            <p className="mt-5 text-sm leading-7 text-white/70">
              Vous recherchez un château, un domaine, un format ou un millésime
              précis ? Nous pouvons vous accompagner dans votre demande.
            </p>

            <span className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.16em] text-[#d8b56d]">
              Nous contacter →
            </span>
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#170606] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            Recherche spécifique
          </p>

          <h2 className="mt-4 font-serif text-4xl md:text-5xl">
            Vous recherchez un château, un domaine ou un millésime précis ?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70">
            Certaines bouteilles peuvent être disponibles sur demande ou en
            allocation limitée. Contactez The Wine Watchers pour une recherche
            personnalisée.
          </p>

          <Link
            href="/contact"
            className="mt-9 inline-block rounded-full bg-[#d8b56d] px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#170606] transition hover:bg-white"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </main>
  );
}