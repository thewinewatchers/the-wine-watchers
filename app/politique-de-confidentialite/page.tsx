import Link from "next/link";

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#24110d]">
      <section className="bg-[#170606] px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm uppercase tracking-[0.25em] text-[#d8b56d]">
            ← Retour accueil
          </Link>

          <h1 className="mt-8 font-serif text-5xl">
            Politique de confidentialité
          </h1>

          <p className="mt-6 max-w-3xl text-white/70">
            Informations relatives au traitement des données personnelles.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10">
          <h2 className="font-serif text-3xl">Données collectées</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les données transmises via le formulaire de contact peuvent inclure
            votre nom, email, téléphone et le contenu de votre demande.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Utilisation des données</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Ces données sont utilisées uniquement pour répondre à vos demandes,
            préparer une offre ou assurer le suivi commercial demandé.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Conservation</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les données sont conservées pendant la durée nécessaire au traitement
            de votre demande et au suivi de la relation commerciale.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Vos droits</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Vous pouvez demander l’accès, la rectification ou la suppression de
            vos données personnelles en contactant The Wine Watchers SL.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Contact</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Pour toute question relative à vos données personnelles, vous pouvez
            nous contacter via la page contact.
          </p>
        </div>
      </section>
    </main>
  );
}