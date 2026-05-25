import Link from "next/link";

export default function ConditionsGeneralesDeVentePage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#24110d]">
      <section className="bg-[#170606] px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm uppercase tracking-[0.25em] text-[#d8b56d]">
            ← Retour accueil
          </Link>

          <h1 className="mt-8 font-serif text-5xl">
            Conditions générales de vente
          </h1>

          <p className="mt-6 max-w-3xl text-white/70">
            Conditions applicables aux commandes et demandes effectuées auprès
            de The Wine Watchers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10">
          <h2 className="font-serif text-3xl">Produits</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les vins proposés sont soumis à disponibilité. Les millésimes, prix,
            quantités et allocations peuvent évoluer.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Commandes</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Toute commande doit être confirmée par The Wine Watchers SL. Une
            demande envoyée via le site ne constitue pas une confirmation
            automatique de disponibilité ou de vente.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Prix</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les prix affichés sont indicatifs et peuvent être confirmés au moment
            de la commande, selon disponibilité, provenance, conditionnement et
            modalités de livraison.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Paiement</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les modalités de paiement sont communiquées lors de la confirmation
            de commande.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Âge légal</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            La vente d’alcool est réservée aux personnes ayant l’âge légal requis
            dans leur pays de résidence.
          </p>
        </div>
      </section>
    </main>
  );
}