import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const appellations: Record<
  string,
  {
    name: string;
    title: string;
    description: string;
    intro: string;
  }
> = {
  pauillac: {
    name: "Pauillac",
    title: "Vins de Pauillac – Grands Crus Classés",
    description:
      "Découvrez notre sélection de vins de Pauillac : grands crus classés, primeurs, millésimes rares et châteaux emblématiques du Médoc.",
    intro:
      "Pauillac est l’une des appellations les plus prestigieuses du Médoc. Elle rassemble certains des plus grands noms de Bordeaux, réputés pour leur puissance, leur profondeur et leur immense potentiel de garde.",
  },
  margaux: {
    name: "Margaux",
    title: "Vins de Margaux – Élégance du Médoc",
    description:
      "Sélection de vins de Margaux : grands crus classés, primeurs et millésimes recherchés disponibles chez The Wine Watchers.",
    intro:
      "Margaux est une appellation emblématique du Médoc, connue pour l’élégance, la finesse et la complexité de ses vins.",
  },
  pomerol: {
    name: "Pomerol",
    title: "Vins de Pomerol – Grands vins rares",
    description:
      "Découvrez notre sélection de vins de Pomerol : Petrus, Le Pin, Vieux Château Certan, La Conseillante et autres grands vins rares.",
    intro:
      "Pomerol est une appellation mythique de la rive droite bordelaise. Réputée pour ses grands merlots, elle produit des vins profonds, veloutés et rares.",
  },
  "saint-emilion": {
    name: "Saint-Émilion",
    title: "Vins de Saint-Émilion – Grands Crus Classés",
    description:
      "Achetez des vins de Saint-Émilion : grands crus classés, millésimes recherchés et références prestigieuses de la rive droite.",
    intro:
      "Saint-Émilion est l’une des appellations les plus célèbres de Bordeaux. Ses vins allient richesse, élégance et profondeur.",
  },
  "saint-julien": {
    name: "Saint-Julien",
    title: "Vins de Saint-Julien – Grands Crus du Médoc",
    description:
      "Sélection de vins de Saint-Julien : grands crus classés, primeurs et millésimes recherchés du Médoc.",
    intro:
      "Saint-Julien est réputée pour l’équilibre exceptionnel de ses vins. Située au cœur du Médoc, l’appellation offre des crus structurés, élégants et réguliers.",
  },
  "saint-estephe": {
    name: "Saint-Estèphe",
    title: "Vins de Saint-Estèphe – Grands vins de garde",
    description:
      "Découvrez les vins de Saint-Estèphe : grands crus classés, primeurs et millésimes recherchés disponibles à l’achat.",
    intro:
      "Saint-Estèphe produit des vins puissants, profonds et structurés. L’appellation est particulièrement appréciée pour ses grands vins de garde.",
  },
  "pessac-leognan": {
    name: "Pessac-Léognan",
    title: "Vins de Pessac-Léognan – Grands Crus de Graves",
    description:
      "Découvrez notre sélection de vins de Pessac-Léognan : grands crus classés, vins rouges et blancs de Bordeaux, primeurs et millésimes recherchés.",
    intro:
      "Pessac-Léognan est l’une des grandes appellations de Bordeaux, réputée pour ses vins rouges élégants et ses grands vins blancs secs.",
  },
  sauternes: {
    name: "Sauternes",
    title: "Vins de Sauternes – Grands vins liquoreux de Bordeaux",
    description:
      "Découvrez notre sélection de vins de Sauternes : grands liquoreux de Bordeaux, millésimes rares et châteaux emblématiques.",
    intro:
      "Sauternes est l’appellation emblématique des grands vins liquoreux de Bordeaux.",
  },
  meursault: {
    name: "Meursault",
    title: "Vins de Meursault – Grands blancs de Bourgogne",
    description:
      "Sélection de vins de Meursault : grands blancs de Bourgogne, domaines réputés et millésimes recherchés.",
    intro:
      "Meursault est une appellation majeure de la Côte de Beaune, mondialement connue pour ses grands vins blancs.",
  },
  "vosne-romanee": {
    name: "Vosne-Romanée",
    title: "Vins de Vosne-Romanée – Grands rouges de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Vosne-Romanée, appellation mythique de la Côte de Nuits.",
    intro:
      "Vosne-Romanée est l’un des villages les plus prestigieux de Bourgogne.",
  },
  "gevrey-chambertin": {
    name: "Gevrey-Chambertin",
    title: "Vins de Gevrey-Chambertin – Côte de Nuits",
    description:
      "Sélection de vins de Gevrey-Chambertin : grands crus, premiers crus et domaines prestigieux.",
    intro:
      "Gevrey-Chambertin est une appellation incontournable de la Côte de Nuits.",
  },
  "chambolle-musigny": {
    name: "Chambolle-Musigny",
    title: "Vins de Chambolle-Musigny – Élégance bourguignonne",
    description:
      "Découvrez les vins de Chambolle-Musigny, grands rouges de Bourgogne réputés pour leur finesse.",
    intro:
      "Chambolle-Musigny incarne la finesse et l’élégance bourguignonnes.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const appellation = appellations[slug];

  if (!appellation) {
    return {
      title: "Appellation introuvable | The Wine Watchers",
    };
  }

  return {
    title: `${appellation.title} | The Wine Watchers`,
    description: appellation.description,
  };
}

export default async function AppellationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const appellation = appellations[slug];

  if (!appellation) {
    notFound();
  }

  const { data: wines, error } = await supabase
    .from("wines")
    .select(
      "id, name, vintage, price, image, appellation, classification, bottle_size, packaging, hidden_from_site"
    )
    .eq("appellation", appellation.name)
    .neq("hidden_from_site", true)
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-6 py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-2xl bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm uppercase tracking-[0.25em] text-gray-500">
            Appellation
          </p>

          <h1 className="mb-3 text-4xl font-serif text-[#3b1f1f]">
            {appellation.name}
          </h1>

          <p className="mb-6 text-lg font-medium text-gray-700">
            {wines?.length || 0} vin(s) disponible(s)
          </p>

          <p className="max-w-4xl text-lg leading-relaxed text-gray-700">
            {appellation.intro}
          </p>

          {error && (
            <p className="mt-4 text-red-600">
              Erreur Supabase : {error.message}
            </p>
          )}
        </div>

        {!wines || wines.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-600 shadow-sm">
            Aucun vin disponible actuellement pour cette appellation.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wines.map((wine) => (
              <Link
                key={wine.id}
                href={`/boutique/vin/${wine.id}`}
                className="block rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {wine.image && (
                  <img
                    src={wine.image}
                    alt={wine.name}
                    className="mb-4 h-56 w-full object-contain"
                  />
                )}

                <h2 className="text-xl font-serif text-[#3b1f1f]">
                  {wine.name}
                </h2>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  {wine.vintage && <p>Millésime : {wine.vintage}</p>}
                  {wine.classification && <p>{wine.classification}</p>}
                  {wine.bottle_size && <p>Flaconnage : {wine.bottle_size}</p>}
                  {wine.packaging && <p>Caissage : {wine.packaging}</p>}
                </div>

                <p className="mt-4 font-semibold text-[#3b1f1f]">
                  {wine.price
  ? Number(wine.price).toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    })
  : "Prix sur demande"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}