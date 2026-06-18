import Link from "next/link";

export default function PolitiqueConfidentialitePage() {
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

          <h1 className="mt-8 font-serif text-5xl">
            Politique de confidentialité
          </h1>

          <p className="mt-6 max-w-3xl text-white/70">
            Informations relatives au traitement des données personnelles sur le
            site The Wine Watchers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10">
          <h2 className="font-serif text-3xl">Responsable du traitement</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Le responsable du traitement des données personnelles collectées sur
            le site est The Wine Watchers SL, société établie en Espagne.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Données collectées</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Dans le cadre de l’utilisation du site, The Wine Watchers peut
            collecter les informations suivantes :
          </p>

          <ul className="mt-4 list-disc pl-8 leading-8 text-[#6d5b50]">
            <li>nom et prénom ;</li>
            <li>adresse email ;</li>
            <li>numéro de téléphone ;</li>
            <li>adresse de facturation et de livraison ;</li>
            <li>nom de société et numéro de TVA, le cas échéant ;</li>
            <li>informations relatives aux commandes ;</li>
            <li>messages transmis via le formulaire de contact ;</li>
            <li>données nécessaires à la création et à la gestion du compte client.</li>
          </ul>

          <h2 className="mt-10 font-serif text-3xl">Finalités du traitement</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les données personnelles sont utilisées uniquement pour les finalités
            suivantes :
          </p>

          <ul className="mt-4 list-disc pl-8 leading-8 text-[#6d5b50]">
            <li>création et gestion du compte client ;</li>
            <li>traitement des commandes ;</li>
            <li>édition des devis, confirmations de commande et factures ;</li>
            <li>gestion du paiement ;</li>
            <li>organisation du retrait ou de la livraison ;</li>
            <li>suivi de la relation commerciale ;</li>
            <li>réponse aux demandes envoyées via le formulaire de contact ;</li>
            <li>respect des obligations légales, fiscales et comptables.</li>
          </ul>

          <h2 className="mt-10 font-serif text-3xl">Paiement sécurisé</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les paiements par carte bancaire sont traités par Stripe, prestataire
            de paiement sécurisé. The Wine Watchers ne stocke pas les données
            complètes de carte bancaire des clients. Les informations strictement
            nécessaires au paiement sont traitées par Stripe conformément à ses
            propres règles de sécurité et de confidentialité.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Emails transactionnels</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers peut utiliser l’adresse email du client pour
            envoyer des messages nécessaires à l’exécution de la commande,
            notamment les confirmations de commande, informations de paiement,
            échanges relatifs à la livraison, devis ou factures.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Cookies</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Le site utilise des cookies strictement nécessaires au bon
            fonctionnement du service, notamment pour la connexion, le panier, la
            commande, la sécurité et le paiement. Aucun cookie publicitaire ou de
            profilage n’est utilisé à ce jour.
          </p>

          <p className="mt-4 leading-8 text-[#6d5b50]">
            Pour plus d’informations, vous pouvez consulter notre{" "}
            <Link
              href="/politique-cookies"
              className="font-semibold text-[#8a1f1f] underline-offset-4 hover:underline"
            >
              Politique de cookies
            </Link>
            .
          </p>

          <h2 className="mt-10 font-serif text-3xl">Destinataires des données</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les données personnelles sont destinées à The Wine Watchers et, si
            nécessaire, à ses prestataires techniques, prestataires de paiement,
            transporteurs, partenaires logistiques, conseils comptables ou
            juridiques, uniquement dans la limite nécessaire à l’exécution du
            service ou au respect des obligations légales.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Conservation des données</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les données sont conservées pendant la durée nécessaire au traitement
            de la relation commerciale, à l’exécution des commandes et au respect
            des obligations légales, fiscales et comptables applicables.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Sécurité</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers met en œuvre des mesures techniques et
            organisationnelles raisonnables afin de protéger les données
            personnelles contre l’accès non autorisé, la perte, l’altération ou
            la divulgation.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Vos droits</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Conformément à la réglementation applicable, vous pouvez demander
            l’accès à vos données personnelles, leur rectification, leur
            suppression, la limitation du traitement ou vous opposer à certains
            traitements lorsque cela est légalement possible.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Contact</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Pour toute question relative à vos données personnelles, vous pouvez
            contacter The Wine Watchers SL à l’adresse suivante :
          </p>

          <p className="mt-4 leading-8 text-[#6d5b50]">
            <strong>Email :</strong>{" "}
            <a
              href="mailto:contact@thewinewatchers.com"
              className="font-semibold text-[#8a1f1f] underline-offset-4 hover:underline"
            >
              contact@thewinewatchers.com
            </a>
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Modification de la politique
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers se réserve le droit de modifier la présente
            politique de confidentialité afin de tenir compte de l’évolution du
            site, des services proposés ou de la réglementation applicable.
          </p>
        </div>
      </section>
    </main>
  );
}