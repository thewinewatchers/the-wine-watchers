import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    title: "Bordeaux",
    slug: "bordeaux",
    image: "/images/Margaux.jpg",
    text: "Médoc, Pomerol, Saint-Émilion et grands crus classés.",
  },
  {
    title: "Bourgogne",
    slug: "bourgogne",
    image: "/images/Romanee.jpg",
    text: "Grands domaines, premiers crus et grands crus.",
  },
  {
    title: "Rhône",
    slug: "rhone",
    image: "/images/vin-rhone.jpg",
    text: "Côte-Rôtie, Hermitage et Châteauneuf-du-Pape.",
  },
  {
    title: "Champagne",
    slug: "champagne",
    image: "/images/champagne.jpg",
    text: "Grandes maisons et cuvées de prestige.",
  },
  {
    title: "Italie",
    slug: "italie",
    image: "/images/cave-vin-italie.jpg",
    text: "Piémont, Toscane et grandes signatures italiennes.",
  },
  {
    title: "Espagne",
    slug: "espagne",
    image: "/images/vin-rouge-jambon-espagne.jpg",
    text: "Rioja, Ribera del Duero et Priorat.",
  },
  {
    title: "États-Unis",
    slug: "usa",
    image: "/images/opus-one-caisse.png",
    text: "Napa Valley et grands vins californiens.",
  },
  {
    title: "Primeurs 2025",
    slug: "primeurs-2025",
    image: "/images/bordeaux-degustation-primeur.jpg",
    text: "Bordeaux en précommande. Livraison estimée en 2027.",
  },
];

export default function BoutiquePage() {
  return (
    <main className="min-h-screen bg-white text-[#292524]">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <nav
          aria-label="Fil d’Ariane"
          className="text-sm text-stone-500"
        >
          <Link
            href="/"
            className="transition hover:text-[#8a1f1f]"
          >
            Accueil
          </Link>

          <span aria-hidden="true" className="mx-2">
            /
          </span>

          <span aria-current="page">Boutique</span>
        </nav>

        <header className="mt-6 border-b border-stone-200 pb-6">
          <h1 className="font-serif text-3xl md:text-4xl">
            Nos vins
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Retrouvez notre sélection de grands vins par région et découvrez
            les Primeurs 2025.
          </p>
        </header>

        <section aria-labelledby="regions-title" className="py-7">
          <h2
            id="regions-title"
            className="mb-5 text-lg font-semibold"
          >
            Choisir une région
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/boutique/${category.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-colors hover:border-[#8a1f1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8a1f1f]"
              >
                <div className="relative h-36 overflow-hidden bg-stone-50">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 280px"
                    className={
                      category.slug === "usa"
                        ? "object-contain p-2"
                        : "object-cover"
                    }
                  />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-serif text-xl text-[#591c24]">
                      {category.title}
                    </h3>

                    <span
                      aria-hidden="true"
                      className="text-stone-400 transition-colors group-hover:text-[#8a1f1f]"
                    >
                      →
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {category.text}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-5 border-t border-stone-200 py-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/offres"
            className="text-sm font-semibold text-[#8a1f1f] underline-offset-4 hover:underline"
          >
            Découvrir nos offres du moment →
          </Link>

          <p className="text-sm leading-6 text-stone-600">
            Une bouteille précise ?{" "}
            <Link
              href="/contact"
              className="font-medium text-[#8a1f1f] underline underline-offset-4"
            >
              Contacte notre équipe
            </Link>
          </p>
        </div>

        <p className="text-xs leading-6 text-stone-500">
          Prix affichés hors taxes. TVA calculée lors de la finalisation de
          la commande.
        </p>
      </div>
    </main>
  );
}