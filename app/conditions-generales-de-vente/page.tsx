import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.thewinewatchers.com";

export const metadata: Metadata = {
  title: "Conditions générales de vente | The Wine Watchers",
  description:
    "Consultez les Conditions Générales de Vente de The Wine Watchers SL applicables aux commandes de grands vins, primeurs, livraisons et services associés.",
  alternates: {
    canonical: `${SITE_URL}/conditions-generales-de-vente`,
  },
  openGraph: {
    title: "Conditions générales de vente | The Wine Watchers",
    description:
      "Conditions Générales de Vente de The Wine Watchers SL applicables aux commandes de grands vins, primeurs, livraisons et services associés.",
    url: `${SITE_URL}/conditions-generales-de-vente`,
    siteName: "The Wine Watchers",
    locale: "fr_FR",
    type: "website",
  },
};

export default function ConditionsGeneralesDeVentePage() {
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
            Conditions générales de vente
          </h1>

          <p className="mt-6 max-w-3xl text-white/70">
            Conditions applicables aux commandes effectuées auprès de The Wine
            Watchers SL.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10">
          <h2 className="font-serif text-3xl">Article 1 – Objet</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les présentes Conditions Générales de Vente définissent les
            conditions dans lesquelles The Wine Watchers SL propose à la vente
            des vins, grands crus, vins rares, vins en primeur et prestations de
            stockage ou services associés à destination de clients particuliers
            ou professionnels.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Toute commande implique l’acceptation pleine, entière et sans
            réserve des présentes CGV.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 2 – Identité du vendeur
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les ventes sont réalisées par The Wine Watchers SL, dont le siège
            social est situé 99 Riera Ginjolers, 17480 Roses, Espagne.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers SL est immatriculée au Registre du Commerce de
            Girona, Espagne, sous le numéro B55053219.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Téléphone : +34 972 15 08 78
            <br />
            Email : contact@thewinewatchers.com
            <br />
            Site internet : www.thewinewatchers.com
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 3 – Produits et disponibilité
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les vins proposés à la vente sont présentés sous réserve de
            disponibilité. Les photographies, descriptifs, notes de dégustation,
            conditionnements, caissages, flaconnages, millésimes, classements,
            appellations et informations figurant sur le site sont communiqués à
            titre indicatif.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers SL s’efforce d’assurer l’exactitude des
            informations publiées mais ne saurait garantir l’absence totale
            d’erreurs, omissions ou modifications provenant des producteurs,
            fournisseurs ou négociants.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les disponibilités affichées sur le site ne constituent pas un
            engagement ferme tant que la commande n’a pas été définitivement
            validée et confirmée.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 4 – Statut de courtier, broker et achats en primeur
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers SL agit en qualité de société de courtage et
            d’intermédiation dans le domaine des vins fins et grands crus.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            La société précise qu’elle ne bénéficie d’aucune allocation directe
            auprès des châteaux, domaines, producteurs ou propriétés viticoles
            référentes, notamment pour les vins commercialisés en primeur.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les vins proposés à la vente, y compris les vins en primeur, sont
            acquis auprès de négociants, courtiers, plateformes spécialisées ou
            autres fournisseurs opérant sur le marché des vins fins et grands
            crus.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Le client reconnaît que l’acquisition de vins par ces circuits
            comporte des risques inhérents au marché, incluant notamment les
            retards d’approvisionnement, les réductions de quantités, les
            annulations partielles ou totales d’allocations, les retards de mise
            à disposition, la défaillance financière ou commerciale d’un
            fournisseur ou l’impossibilité de livraison par un fournisseur tiers.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            En cas d’indisponibilité définitive d’un produit du fait d’un
            fournisseur tiers, The Wine Watchers SL pourra proposer un produit de
            remplacement, un avoir ou procéder au remboursement des sommes
            encaissées au titre des produits indisponibles. Aucune indemnité
            complémentaire, perte de chance, manque à gagner ou dommage indirect
            ne pourra être réclamé.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les vins achetés en primeur sont livrés après leur mise à
            disposition effective par les producteurs, châteaux, domaines ou
            fournisseurs concernés. Sauf indication contraire, les livraisons
            interviennent généralement à compter du 15 juin de l’année de
            libération des vins, sous réserve de leur réception complète.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Article 5 – Prix</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les prix affichés sur le site sont exprimés en euros hors taxes
            (HT), sauf indication contraire expresse.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les prix affichés ne comprennent pas les taxes applicables, les frais
            de transport, les frais de stockage, les frais administratifs, les
            frais bancaires éventuels ou tout autre frais accessoire pouvant être
            dû au titre de la commande.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 6 – TVA et fiscalité
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            La fiscalité applicable dépend notamment du statut du client, du
            lieu de résidence, du lieu de livraison, du régime douanier
            applicable et de la réglementation en vigueur au moment de la
            livraison des vins.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Pour les particuliers, la TVA applicable est calculée lors du
            processus de commande conformément à la réglementation en vigueur.
            Pour les professionnels bénéficiant d’un régime particulier de TVA
            ou d’une exonération légale, le client devra fournir tous
            justificatifs nécessaires préalablement à la validation de la
            commande.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Aucune livraison, aucun retrait, aucun transfert de propriété ni
            aucun changement d’affectation des vins ne pourra intervenir tant que
            les taxes, droits, TVA ou autres sommes légalement dues n’auront pas
            été intégralement acquittés.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Article 7 – Commandes</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Toute commande passée sur le site constitue une offre d’achat soumise
            à acceptation par The Wine Watchers SL. L’enregistrement d’une
            commande ne vaut pas acceptation définitive.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers SL se réserve le droit de refuser ou d’annuler
            toute commande en cas d’indisponibilité, d’erreur manifeste de prix,
            d’informations client incomplètes ou erronées, de suspicion de
            fraude, de comportement abusif ou de non-paiement d’une commande
            antérieure.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 8 – Vente d’alcool
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les produits commercialisés par The Wine Watchers SL contiennent de
            l’alcool. La vente d’alcool est strictement réservée aux personnes
            ayant atteint l’âge légal requis dans leur pays de résidence et dans
            le pays de destination des produits commandés.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            En validant une commande, le client déclare avoir l’âge légal requis
            pour acheter, détenir et consommer des boissons alcoolisées. The Wine
            Watchers SL se réserve le droit de refuser, suspendre ou annuler
            toute commande en cas de doute légitime concernant l’âge du client,
            l’identité du destinataire ou la légalité de la livraison.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 9 – Lutte contre le blanchiment de capitaux et financement
            du terrorisme
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Dans le cadre de ses obligations légales et de sa politique de
            conformité, The Wine Watchers SL se réserve le droit de procéder à
            toute vérification qu’elle estime nécessaire concernant l’identité du
            client, l’origine des fonds utilisés pour le paiement d’une commande
            ou la légitimité économique d’une opération.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Le client s’engage à fournir, à première demande, tout document ou
            justificatif raisonnablement nécessaire permettant de confirmer son
            identité, son adresse, son statut fiscal ou l’origine des fonds
            utilisés.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers SL pourra suspendre l’exécution d’une commande,
            refuser une opération, différer une livraison, un transfert de
            propriété ou une sortie de stock lorsqu’une vérification
            complémentaire est nécessaire ou qu’une opération présente un risque
            juridique, réglementaire ou réputationnel.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Article 10 – Paiement</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les paiements peuvent être effectués par carte bancaire via Stripe
            ou par virement bancaire selon les modalités proposées lors de la
            commande.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            En cas de paiement par virement bancaire, la commande pourra être
            suspendue jusqu’à réception effective des fonds. Les frais bancaires,
            frais de change ou frais de transfert demeurent à la charge
            exclusive du client.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 11 – Réserve de propriété
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les vins vendus par The Wine Watchers SL demeurent sa propriété
            exclusive jusqu’au paiement intégral de toutes les sommes dues par le
            client, incluant notamment le prix des vins, la TVA éventuellement
            applicable, les frais de stockage, les frais administratifs, les
            frais logistiques, les frais de transport, les frais accessoires et
            toute autre somme due au titre de la commande.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            La remise d’un certificat d’affectation, d’un certificat de
            détention ou de tout document équivalent ne constitue pas un
            transfert immédiat de propriété. Ces documents attestent uniquement
            de l’affectation ou de la réservation des vins au bénéfice du client.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 12 – Stockage et conservation des vins
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les vins peuvent être conservés dans des entrepôts partenaires,
            entrepôts sous douane ou autres installations logistiques
            sélectionnées par The Wine Watchers SL.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Des frais annuels de stockage sont applicables selon le tarif
            suivant : 30 € HT par caisse et par année de stockage, auxquels
            s’ajoute une redevance annuelle correspondant à 0,60 % HT de la
            valeur HT des vins stockés.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les frais de stockage, de conservation, de manutention ou de gestion
            administrative demeurent définitivement acquis à The Wine Watchers SL
            et ne sont en aucun cas remboursables.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Le client ne peut vendre, céder, transférer, nantir, donner en
            garantie ou disposer des vins stockés sans l’accord écrit préalable
            de The Wine Watchers SL.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Même en cas d’autorisation exceptionnelle, aucun transfert, aucune
            livraison, aucune sortie de stock, aucun changement d’affectation ou
            de propriétaire ne pourra intervenir tant que la TVA éventuellement
            due, les frais de stockage, les frais accessoires et l’ensemble des
            sommes dues à The Wine Watchers SL n’auront pas été intégralement
            acquittés.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 13 – Livraison et retrait
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les vins peuvent être retirés auprès de l’entrepôt désigné par The
            Wine Watchers SL ou expédiés à l’adresse indiquée sur la facture.
            Les livraisons sont exclusivement effectuées à l’adresse figurant sur
            la facture ou validée par écrit par The Wine Watchers SL.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les délais de livraison sont donnés à titre indicatif. Le client est
            tenu de vérifier l’état apparent des colis lors de leur réception et
            de formuler toute réserve auprès du transporteur dans les délais
            légaux applicables.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 14 – Droit de rétractation
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les clients particuliers disposent d’un délai légal de quatorze (14)
            jours à compter de la réception des produits pour exercer leur droit
            de rétractation lorsque celui-ci est applicable.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les produits retournés doivent être restitués complets, dans leur
            état d’origine, non ouverts, non altérés et dans leur conditionnement
            d’origine. Les frais de retour demeurent à la charge du client sauf
            disposition légale contraire.
          </p>

          <h3 className="mt-8 font-serif text-2xl">
            Exclusion du droit de rétractation pour les vins en primeur
          </h3>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les commandes de vins en primeur sont fermes et définitives dès leur
            validation par le client et leur acceptation par The Wine Watchers
            SL.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les vins en primeur faisant l’objet d’un approvisionnement
            spécifique et d’une affectation individualisée au bénéfice du client,
            The Wine Watchers SL engage immédiatement les démarches
            d’acquisition correspondantes auprès de ses fournisseurs dès
            validation de la commande.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            En conséquence, les commandes de vins en primeur ne peuvent être
            annulées par le client après leur validation. Le droit de
            rétractation n’est pas applicable aux commandes de vins en primeur,
            sauf disposition légale impérative contraire applicable au client
            concerné.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 15 – Responsabilité
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers SL s’engage à exécuter ses obligations avec
            diligence. Sa responsabilité ne pourra être engagée qu’en cas de
            faute prouvée lui étant directement imputable.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            La société ne pourra être tenue responsable des actes ou omissions de
            tiers, des défaillances de fournisseurs, des retards de transport,
            des événements de force majeure, des pertes indirectes, pertes
            d’exploitation, pertes de chance ou pertes financières indirectes.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 16 – Force majeure
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Aucune partie ne pourra être tenue responsable lorsqu’un manquement à
            ses obligations résulte d’un événement de force majeure, notamment
            catastrophe naturelle, incendie, inondation, conflit armé, acte de
            terrorisme, épidémie, pandémie, grève, blocage des transports,
            cyberattaque majeure, décision administrative ou tout événement
            échappant raisonnablement au contrôle des parties.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 17 – Données personnelles
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers SL collecte et traite certaines données
            personnelles dans le cadre de son activité commerciale et de
            l’exécution des commandes. Les modalités de traitement sont décrites
            dans la Politique de confidentialité disponible sur le site.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 18 – Réclamations et règlement amiable
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            En cas de difficulté relative à une commande, le client est invité à
            contacter préalablement The Wine Watchers SL afin de rechercher une
            solution amiable. Toute réclamation devra être adressée par écrit à
            l’adresse électronique ou postale figurant dans les présentes CGV.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Article 19 – Loi applicable et juridiction compétente
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Les présentes Conditions Générales de Vente sont soumises au droit
            espagnol.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Toutefois, lorsque le client agit en qualité de consommateur, il
            bénéficie également des dispositions impératives de protection qui
            lui sont accordées par la réglementation applicable dans son pays de
            résidence habituelle.
          </p>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Pour les litiges opposant The Wine Watchers SL à des professionnels,
            compétence expresse est attribuée aux juridictions du ressort de
            Girona, Espagne, sauf disposition légale impérative contraire.
          </p>
        </div>
      </section>
    </main>
  );
}