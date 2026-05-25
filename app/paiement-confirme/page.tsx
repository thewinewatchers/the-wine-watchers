"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PaiementConfirmeContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-16 text-[#1f1a17]">
      <section className="mx-auto max-w-3xl rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm md:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
          The Wine Watchers
        </p>

        <h1 className="mt-4 text-4xl font-serif text-black">
          Paiement confirmé
        </h1>

        <p className="mt-5 text-base leading-7 text-neutral-700">
          Merci pour votre commande. Votre paiement par carte a bien été pris en
          compte.
        </p>

        {orderId && (
          <div className="mt-6 rounded-2xl bg-[#fffaf3] p-5 text-sm leading-7 text-neutral-700">
            <p>
              Numéro de commande :
              <br />
              <strong className="break-all text-black">{orderId}</strong>
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          {orderId && (
            <a
              href={`/api/orders/${orderId}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-black px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8a6a2f]"
            >
              Télécharger la facture
            </a>
          )}

          <Link
            href="/boutique"
            className="rounded-full border border-black px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white"
          >
            Retour boutique
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function PaiementConfirmePage() {
  return (
    <Suspense fallback={null}>
      <PaiementConfirmeContent />
    </Suspense>
  );
}