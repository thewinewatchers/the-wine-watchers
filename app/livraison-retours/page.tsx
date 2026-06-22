import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Livraison, retrait, retours et remboursements | The Wine Watchers",
  description:
    "Informations sur la livraison, le retrait, les retours, le droit de rétractation et les remboursements chez The Wine Watchers.",
};

const SITE_URL = "https://www.thewinewatchers.com";

export default function LivraisonPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MerchantReturnPolicy",
    name: "Politique de livraison, retours et remboursements The Wine Watchers",
    url: `${SITE_URL}/livraison`,
    applicableCountry: ["FR", "BE", "LU", "ES", "IT", "DE", "NL"],
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnShippingFees",
    refundType: "https://schema.org/FullRefund",
  };

  return (
    <main className="bg-[#f8f4ef] text-[#1f1713]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#8a6a3f]">
          Service client
        </p>

        <h1 className="mb-6 text-4xl font-serif text-[#2a120b] md:text-5xl">
          Livraison, retrait, retours et remboursements
        </h1>

        <p className="mb-10 max-w-3xl text-lg leading-8 text-neutral-700">
          Cette page présente les conditions applicables aux livraisons, retraits,
          retours et remboursements des commandes passées sur The Wine Watchers.
          Elle complète nos{" "}
          <Link href="/cgv" className="font-semibold underline">
            Conditions Générales de Vente
          </Link>
          .
        </p>

        <div className="space-y-8">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              1. Zones de livraison
            </h2>
            <p className="leading-7 text-neutral-700">
              The Wine Watchers organise la livraison des vins principalement en
              Espagne, France métropolitaine, Belgique, Luxembourg, Allemagne,
              Italie et Pays-Bas. D’autres destinations peuvent être étudiées sur
              demande, sous réserve de faisabilité logistique, douanière et
              réglementaire.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Les livraisons sont effectuées exclusivement à l’adresse indiquée
              lors de la commande et figurant sur la facture, sauf accord écrit
              préalable de The Wine Watchers.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              2. Délais de préparation et de livraison
            </h2>
            <p className="leading-7 text-neutral-700">
              Les commandes sont préparées après confirmation du paiement et
              vérification de la disponibilité effective des vins.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-neutral-700">
              <li>Préparation habituelle : 2 à 5 jours ouvrés après paiement.</li>
              <li>
                Livraison estimée : généralement 3 à 10 jours ouvrés selon la
                destination, le transporteur et la nature des vins.
              </li>
              <li>
                Vins rares, grands formats, caisses bois ou commandes importantes :
                délai confirmé individuellement.
              </li>
            </ul>
            <p className="mt-4 leading-7 text-neutral-700">
              Ces délais sont indicatifs. Ils peuvent varier en fonction des
              conditions de transport, des périodes de forte activité, des jours
              fériés, des contraintes climatiques ou des formalités administratives.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              3. Frais de livraison
            </h2>
            <p className="leading-7 text-neutral-700">
              Les frais de livraison dépendent de la destination, du volume, du
              poids, du conditionnement, de la valeur des vins et du mode de
              transport retenu.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Lorsque les frais ne peuvent pas être calculés automatiquement lors
              du checkout, ils sont confirmés au client avant expédition. Aucune
              expédition payante complémentaire n’est engagée sans information
              préalable du client.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              4. Retrait et stockage
            </h2>
            <p className="leading-7 text-neutral-700">
              Selon la nature de la commande, un retrait ou un maintien en
              stockage peut être proposé. Les modalités exactes sont confirmées
              individuellement par The Wine Watchers.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Les vins conservés en stockage peuvent être soumis aux frais prévus
              dans nos Conditions Générales de Vente.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              5. Réception des vins
            </h2>
            <p className="leading-7 text-neutral-700">
              Le client doit vérifier l’état apparent des colis au moment de la
              réception. En cas de colis abîmé, ouvert, mouillé, cassé ou présentant
              une anomalie visible, il est recommandé d’émettre des réserves
              précises auprès du transporteur et de contacter The Wine Watchers
              dans les plus brefs délais.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Toute réclamation doit être accompagnée, lorsque cela est possible,
              de photos du colis, des protections, des bouteilles et de l’étiquette
              de transport.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              6. Droit de rétractation
            </h2>
            <p className="leading-7 text-neutral-700">
              Pour les clients consommateurs, le délai légal de rétractation est
              de 14 jours à compter de la réception de la commande, sauf exception
              légale ou contractuelle applicable.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Pour exercer ce droit, le client doit contacter The Wine Watchers par
              email à{" "}
              <a
                href="mailto:contact@thewinewatchers.com"
                className="font-semibold underline"
              >
                contact@thewinewatchers.com
              </a>{" "}
              avant l’expiration du délai de 14 jours.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              7. Exceptions au retour
            </h2>
            <p className="leading-7 text-neutral-700">
              Certains produits ou situations peuvent être exclus du droit de
              rétractation ou soumis à des conditions particulières, notamment :
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-neutral-700">
              <li>les vins primeurs ;</li>
              <li>les vins commandés spécifiquement pour le client ;</li>
              <li>les produits personnalisés ou réservés sur demande particulière ;</li>
              <li>
                les vins dont le prix dépend de fluctuations du marché indépendantes
                de The Wine Watchers ;
              </li>
              <li>
                les bouteilles ouvertes, altérées, détériorées ou retournées dans
                un état incompatible avec une remise en vente.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              8. Conditions de retour
            </h2>
            <p className="leading-7 text-neutral-700">
              Tout retour doit être préalablement accepté par The Wine Watchers.
              Les vins doivent être retournés dans leur état d’origine, non ouverts,
              non consommés, correctement protégés et, lorsque cela s’applique,
              dans leur conditionnement d’origine.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Le client doit utiliser un mode de transport adapté à la valeur et à
              la fragilité des vins. Les risques liés au retour restent à la charge
              du client jusqu’à réception effective par The Wine Watchers ou son
              prestataire désigné.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              9. Frais de retour
            </h2>
            <p className="leading-7 text-neutral-700">
              En cas de rétractation ou de retour non lié à une erreur de The Wine
              Watchers, les frais de retour sont à la charge du client.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              En cas d’erreur imputable à The Wine Watchers ou de produit non
              conforme, les modalités de prise en charge sont communiquées au cas
              par cas après vérification du dossier.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              10. Remboursement
            </h2>
            <p className="leading-7 text-neutral-700">
              Après réception et contrôle des vins retournés, le remboursement est
              effectué dans un délai maximum de 14 jours lorsque les conditions du
              retour sont remplies.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              Le remboursement est réalisé via le moyen de paiement utilisé lors de
              la commande, sauf accord contraire. Les frais additionnels de
              transport, stockage, assurance ou services particuliers peuvent ne pas
              être remboursables lorsqu’ils ont déjà été engagés.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              11. Produits endommagés ou problème de livraison
            </h2>
            <p className="leading-7 text-neutral-700">
              En cas de dommage constaté à la livraison, le client doit contacter
              The Wine Watchers rapidement à l’adresse{" "}
              <a
                href="mailto:contact@thewinewatchers.com"
                className="font-semibold underline"
              >
                contact@thewinewatchers.com
              </a>
              , en joignant les photos utiles et une description précise du
              problème.
            </p>
            <p className="mt-4 leading-7 text-neutral-700">
              The Wine Watchers analysera la situation avec le transporteur ou le
              prestataire concerné afin de proposer une solution appropriée.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-serif text-[#2a120b]">
              12. Contact
            </h2>
            <p className="leading-7 text-neutral-700">
              Pour toute question relative à une livraison, un retrait, un retour
              ou un remboursement, vous pouvez nous contacter :
            </p>
            <div className="mt-4 rounded-xl bg-[#f8f4ef] p-5 text-neutral-700">
              <p>
                <strong>The Wine Watchers SL</strong>
              </p>
              <p>
                Email :{" "}
                <a
                  href="mailto:contact@thewinewatchers.com"
                  className="font-semibold underline"
                >
                  contact@thewinewatchers.com
                </a>
              </p>
              <p>Site : www.thewinewatchers.com</p>
            </div>
          </section>
        </div>

        <div className="mt-12 rounded-2xl border border-[#d6c3a5] bg-[#fffaf2] p-6">
          <h2 className="mb-3 text-xl font-serif text-[#2a120b]">
            Information importante
          </h2>
          <p className="leading-7 text-neutral-700">
            Cette page est destinée à présenter clairement nos règles de livraison,
            retour et remboursement. En cas de contradiction avec les Conditions
            Générales de Vente, les CGV prévalent dans la limite des dispositions
            légales applicables.
          </p>
        </div>
      </section>
    </main>
  );
}