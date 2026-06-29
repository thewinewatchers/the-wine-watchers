import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#24110d]">
      <section className="bg-[#170606] px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="text-sm uppercase tracking-[0.25em] text-[#d8b56d]"
          >
            ← Retour accueil
          </Link>

          <h1 className="mt-8 font-serif text-5xl">Mentions légales</h1>

          <p className="mt-6 max-w-3xl text-white/70">
            Informations légales relatives au site The Wine Watchers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="space-y-10 rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10">
          <section>
            <h2 className="font-serif text-3xl">Éditeur du site</h2>

            <div className="mt-6 space-y-4 text-[#6d5b50]">
              <p><strong>Raison sociale :</strong> THE WINE WATCHERS SL</p>
              <p><strong>Forme juridique :</strong> Sociedad Limitada (SL)</p>
              <p><strong>NIF :</strong> B55053219</p>
              <p><strong>Capital social :</strong> 4 000,00 €</p>
              <p><strong>Date de constitution :</strong> 09/10/2009</p>
              <p><strong>Immatriculation :</strong> Registro Mercantil de Girona</p>
              <p>
                <strong>Données d&apos;immatriculation :</strong> Tome 2751,
                Livre 0, Folio 5, Section 8, Feuille GI-49090,
                Inscription 1 du 27/10/2009.
              </p>
              <p><strong>Adresse :</strong> Carrer Ginjolers, 99, 17480 Roses, Espagne</p>
              <p><strong>Email :</strong> contact@thewinewatchers.com</p>
              <p><strong>Téléphone :</strong> +34 972 15 08 78</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl">Activité</h2>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              THE WINE WATCHERS SL a pour activité l&apos;exportation et
              l&apos;importation de tous types de boissons alcoolisées,
              notamment les vins et spiritueux, ainsi que de produits
              alimentaires tels que la charcuterie, et la commercialisation en
              gros et au détail de tous produits connexes, tant par le biais
              d&apos;établissements permanents que par Internet.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">
              Responsable de la publication
            </h2>

            <div className="mt-6 space-y-4 text-[#6d5b50]">
              <p><strong>Administrateur :</strong> Catte, Franca-Emanuela</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl">Hébergement du site</h2>

            <div className="mt-6 space-y-4 text-[#6d5b50]">
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p>
                <strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina,
                CA 91723, États-Unis
              </p>
              <p><strong>Site web :</strong> https://vercel.com</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl">Prestataires techniques</h2>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              Le site utilise notamment Supabase pour certains services de base
              de données et d&apos;authentification, Stripe pour le traitement
              des paiements en ligne, Resend pour l&apos;envoi d&apos;emails
              transactionnels, et Vercel pour l&apos;hébergement et le
              déploiement.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">Responsabilité</h2>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              Les informations présentées sur ce site sont fournies à titre
              indicatif. THE WINE WATCHERS SL s&apos;efforce de maintenir les
              informations à jour, mais ne peut garantir l&apos;exactitude
              permanente des disponibilités, prix, millésimes, allocations,
              descriptions, visuels ou délais de livraison. Les offres sont
              valables sous réserve de disponibilité effective des produits.
            </p>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              THE WINE WATCHERS SL ne saurait être tenue responsable des erreurs,
              omissions, interruptions temporaires du site, indisponibilités
              techniques ou dommages indirects résultant de l&apos;utilisation du
              site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">Propriété intellectuelle</h2>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              Les textes, visuels, logos, éléments graphiques, photographies,
              contenus éditoriaux, fiches produits, éléments de design et plus
              généralement tous les contenus présents sur ce site sont protégés
              par les droits de propriété intellectuelle applicables.
            </p>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              Toute reproduction, représentation, modification, adaptation,
              extraction, réutilisation ou diffusion, totale ou partielle, sans
              autorisation préalable écrite de THE WINE WATCHERS SL est
              interdite.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">Liens hypertextes</h2>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              Le site peut contenir des liens vers des sites tiers. THE WINE
              WATCHERS SL n&apos;exerce aucun contrôle sur ces sites externes et
              ne saurait être tenue responsable de leur contenu, de leur
              fonctionnement ou de leurs pratiques en matière de protection des
              données.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">
              Protection des données personnelles
            </h2>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              Les traitements de données personnelles effectués via le site sont
              décrits dans la{" "}
              <Link
                href="/politique-confidentialite"
                className="font-semibold text-[#8a6a2f] underline"
              >
                Politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">Cookies</h2>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              L&apos;utilisation des cookies et autres traceurs est détaillée
              dans la{" "}
              <Link
                href="/politique-cookies"
                className="font-semibold text-[#8a6a2f] underline"
              >
                Politique cookies
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">Vente d&apos;alcool</h2>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              Conformément à la réglementation applicable, les boissons
              alcoolisées proposées sur ce site sont exclusivement destinées aux
              personnes ayant atteint l&apos;âge légal autorisant l&apos;achat et
              la consommation d&apos;alcool dans leur pays de résidence. En
              passant commande, le client déclare remplir cette condition et
              s&apos;engage à respecter l&apos;ensemble des dispositions légales
              applicables dans son pays.
            </p>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              THE WINE WATCHERS SL se réserve le droit de refuser ou
              d&apos;annuler toute commande lorsqu&apos;il existe un doute
              légitime quant au respect de cette obligation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">Droit applicable</h2>

            <p className="mt-4 leading-8 text-[#6d5b50]">
              Le présent site est édité par une société espagnole. Les présentes
              mentions légales sont soumises au droit espagnol, sans préjudice
              des dispositions impératives éventuellement applicables aux
              consommateurs.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}