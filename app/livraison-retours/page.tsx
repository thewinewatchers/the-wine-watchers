import Link from "next/link";

export default function LivraisonRetoursPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#24110d]">
      <section className="bg-[#170606] px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm uppercase tracking-[0.25em] text-[#d8b56d]">
            ← Retour accueil
          </Link>

          <h1 className="mt-8 font-serif text-5xl">Livraison & retours</h1>

          <p className="mt-6 max-w-3xl text-white/70">
            Informations relatives aux expéditions, livraisons et retours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10">
          <h2 className="font-serif text-3xl">Livraison</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les modalités de livraison sont confirmées au moment de la commande,
            selon la destination, le volume, le conditionnement et la nature des
            bouteilles.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Délais</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les délais de livraison varient selon la disponibilité des vins, le
            lieu de stockage, le transporteur et la destination.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Transport</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les expéditions peuvent être organisées avec des transporteurs
            adaptés au transport de vins et bouteilles de valeur.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Retours</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les conditions de retour sont étudiées selon la nature de la commande,
            l’état des bouteilles, le transport et les dispositions légales
            applicables.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Réclamation</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Toute réclamation relative à une livraison doit être signalée dès
            réception, accompagnée de photos si nécessaire.
          </p>
        </div>
      </section>
    </main>
  );
}