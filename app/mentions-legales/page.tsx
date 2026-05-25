import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#24110d]">
      <section className="bg-[#170606] px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm uppercase tracking-[0.25em] text-[#d8b56d]">
            ← Retour accueil
          </Link>

          <h1 className="mt-8 font-serif text-5xl">Mentions légales</h1>

          <p className="mt-6 max-w-3xl text-white/70">
            Informations légales relatives au site The Wine Watchers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10">
          <h2 className="font-serif text-3xl">Éditeur du site</h2>

          <div className="mt-6 space-y-4 text-[#6d5b50]">
            <p><strong>Société :</strong> The Wine Watchers SL</p>
            <p><strong>Adresse :</strong> Carrer Ginjolers,99 17480 Roses</p>
            <p><strong>Email :</strong> contact@thewinewatchers.com</p>
            <p><strong>Téléphone :</strong> +34 972 15 08 78</p>
            <p><strong>Pays :</strong> Espagne</p>
          </div>

          <h2 className="mt-10 font-serif text-3xl">Responsabilité</h2>

          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les informations présentées sur ce site sont fournies à titre
            indicatif. The Wine Watchers SL s’efforce de maintenir les
            informations à jour, mais ne peut garantir l’exactitude permanente
            des disponibilités, prix, millésimes ou allocations.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Propriété intellectuelle</h2>

          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les textes, visuels, logos, éléments graphiques et contenus présents
            sur ce site sont protégés. Toute reproduction non autorisée est
            interdite.
          </p>
        </div>
      </section>
    </main>
  );
}