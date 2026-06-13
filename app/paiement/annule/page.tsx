export const metadata = {
  title: "Paiement annulé – The Wine Watchers",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaiementAnnulePage() {
  return (
    <main className="min-h-screen bg-[#f8f3ea] px-4 py-16 text-[#1f1a17]">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f]">
          Paiement sécurisé
        </p>

        <h1 className="mt-4 text-3xl font-serif text-black md:text-5xl">
          Paiement annulé
        </h1>

        <p className="mt-6 text-neutral-700">
          Le paiement n’a pas été finalisé. Aucun débit n’a été effectué.
        </p>

        <p className="mt-4 text-neutral-700">
          Vous pouvez revenir au checkout pour choisir un autre mode de paiement
          ou réessayer votre règlement par carte bancaire.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/checkout"
            className="rounded-full bg-black px-6 py-3 text-center text-sm uppercase tracking-[0.2em] text-white hover:bg-[#8a6a2f]"
          >
            Retour au paiement
          </a>

          <a
            href="/panier"
            className="rounded-full border border-black px-6 py-3 text-center text-sm uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white"
          >
            Retour au panier
          </a>
        </div>
      </div>
    </main>
  );
}