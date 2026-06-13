export const metadata = {
  title: "Paiement confirmé – The Wine Watchers",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaiementSuccesPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea] px-4 py-16 text-[#1f1a17]">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f]">
          Paiement sécurisé
        </p>

        <h1 className="mt-4 text-3xl font-serif text-black md:text-5xl">
          Paiement confirmé
        </h1>

        <p className="mt-6 text-neutral-700">
          Merci pour votre commande. Votre paiement par carte bancaire a bien
          été pris en compte.
        </p>

        <p className="mt-4 text-neutral-700">
          Vous recevrez prochainement une confirmation par email avec le détail
          de votre commande.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/mon-compte"
            className="rounded-full bg-black px-6 py-3 text-center text-sm uppercase tracking-[0.2em] text-white hover:bg-[#8a6a2f]"
          >
            Voir mon compte
          </a>

          <a
            href="/boutique"
            className="rounded-full border border-black px-6 py-3 text-center text-sm uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white"
          >
            Retour à la boutique
          </a>
        </div>
      </div>
    </main>
  );
}