import Link from "next/link";

const adminLinks = [
  {
    title: "Importer des vins",
    href: "/admin/import",
    description:
      "Ajouter ou mettre à jour le catalogue via fichier Excel / CSV.",
  },
  {
    title: "Commandes",
    href: "/admin/orders",
    description:
      "Consulter les commandes, devis PDF, factures PDF et paiements.",
  },
  {
    title: "Tarifs de livraison",
    href: "/admin/livraison",
    description:
      "Visualiser les frais de livraison par pays, poids et transporteur.",
  },
  {
    title: "Images",
    href: "/admin/images",
    description:
      "Gérer les images utilisées pour les fiches vins et la boutique.",
  },
  {
    title: "Paniers abandonnés",
    href: "/admin/abandoned-carts",
    description:
      "Suivre les paniers créés mais non transformés en commandes.",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
          The Wine Watchers
        </p>

        <h1 className="mt-4 text-4xl font-serif text-black md:text-6xl">
          Administration
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700">
          Tableau de bord administrateur pour gérer le catalogue, les commandes,
          les livraisons, les images et le suivi commercial.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {adminLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[2rem] border border-[#e6dcc8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#8a6a2f] hover:shadow-xl"
            >
              <h2 className="font-serif text-2xl text-black group-hover:text-[#8a1f1f]">
                {item.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-neutral-700">
                {item.description}
              </p>

              <span className="mt-6 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#8a6a2f]">
                Ouvrir →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}