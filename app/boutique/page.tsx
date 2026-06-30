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

const quickSearches = [
  { label: "Lafite Rothschild", href: "/boutique/bordeaux?search=lafite" },
  { label: "Château Margaux", href: "/boutique/bordeaux?search=margaux" },
  { label: "Pauillac", href: "/boutique/bordeaux?search=pauillac" },
  { label: "Pomerol", href: "/boutique/bordeaux?search=pomerol" },
  { label: "Romanée-Conti", href: "/boutique/bourgogne?search=romanee" },
  { label: "Sassicaia", href: "/boutique/italie?search=sassicaia" },
];

export default function BoutiquePage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#24110d]">
      <section className="bg-[#170606] px-6 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#d8b56d]">
              The Wine Watchers
            </p>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight md:text-6xl">
              Trouvez votre vin en quelques secondes.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
              Accès direct aux grands crus, primeurs, domaines recherchés et
              bouteilles disponibles par région, appellation ou producteur.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/boutique/bordeaux"
                className="rounded-full bg-[#d8b56d] px-7 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-[#170606] transition hover:bg-white"
              >
                Voir les vins
              </Link>

              <Link
                href="/boutique/primeurs-2025"
                className="rounded-full border border-white/25 px-7 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:border-[#d8b56d] hover:text-[#d8b56d]"
              >
                Primeurs 2025
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl">
            <img
              src="/images/boutique-hero.png"
              alt="Boutique de grands vins The Wine Watchers"
              className="h-72 w-full object-cover md:h-[420px]"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[#e2d2bd] bg-[#fffaf3] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6a2f]">
            Recherche rapide
          </p>

          <div className="flex flex-wrap gap-3">
            {quickSearches.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-[#d8c6aa] bg-white px-5 py-3 text-sm font-semibold text-[#24110d] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
            Boutique
          </p>

          <h2 className="mt-3 font-serif text-4xl text-[#24110d] md:text-5xl">
            Choisissez une région
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[#6d5b50]">
            Chaque entrée mène directement à la sélection correspondante, avec
            filtres, recherche et bouteilles disponibles.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/boutique/${category.slug}`}
              className="group rounded-[1.75rem] border border-[#e1d1bd] bg-[#fffaf3] p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-[#8a6a2f]">
                Accès direct
              </p>

              <h3 className="mt-4 font-serif text-3xl text-[#24110d] group-hover:text-[#8a1f1f]">
                {category.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#6d5b50]">
                {category.description}
              </p>

              <p className="mt-5 text-sm font-semibold text-[#8a6a2f]">
                {category.highlight}
              </p>

              <span className="mt-7 inline-block text-sm font-semibold uppercase tracking-[0.16em] text-[#24110d] group-hover:text-[#8a1f1f]">
                Voir la sélection →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#fffaf3] px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[#e1d1bd] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8a6a2f]">
              1
            </p>
            <h3 className="mt-3 font-serif text-2xl">Cherchez</h3>
            <p className="mt-3 text-sm leading-7 text-[#6d5b50]">
              Par région, appellation, producteur ou millésime.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#e1d1bd] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8a6a2f]">
              2
            </p>
            <h3 className="mt-3 font-serif text-2xl">Filtrez</h3>
            <p className="mt-3 text-sm leading-7 text-[#6d5b50]">
              Affinez rapidement la sélection selon votre recherche.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#e1d1bd] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8a6a2f]">
              3
            </p>
            <h3 className="mt-3 font-serif text-2xl">Commandez</h3>
            <p className="mt-3 text-sm leading-7 text-[#6d5b50]">
              Ajoutez vos bouteilles au panier ou contactez-nous.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#170606] px-6 py-18 text-white md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            Recherche spécifique
          </p>

          <h2 className="mt-4 font-serif text-4xl md:text-5xl">
            Vous recherchez un château, un domaine ou un millésime précis ?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70">
            Certaines bouteilles peuvent être disponibles sur demande ou en
            allocation limitée.
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