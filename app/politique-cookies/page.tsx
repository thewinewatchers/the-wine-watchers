import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.thewinewatchers.com";

export const metadata: Metadata = {
  title: "Politique de cookies | The Wine Watchers",
  description:
    "Consultez la politique de cookies de The Wine Watchers SL et les informations relatives aux cookies techniques, à leur gestion et à leur utilisation sur le site.",
  alternates: {
    canonical: `${SITE_URL}/politique-cookies`,
  },
  openGraph: {
    title: "Politique de cookies | The Wine Watchers",
    description:
      "Informations relatives à l’utilisation des cookies et technologies similaires sur le site The Wine Watchers.",
    url: `${SITE_URL}/politique-cookies`,
    siteName: "The Wine Watchers",
    locale: "fr_FR",
    type: "website",
  },
};

export default function PolitiqueCookiesPage() {
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

          <h1 className="mt-8 font-serif text-5xl">Politique de cookies</h1>

          <p className="mt-6 max-w-3xl text-white/70">
            Informations relatives à l’utilisation des cookies et technologies
            similaires sur le site The Wine Watchers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10">
          <h2 className="font-serif text-3xl">Qu’est-ce qu’un cookie ?</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Un cookie est un petit fichier enregistré sur votre appareil lors
            de la consultation d’un site internet. Il permet notamment
            d’assurer le bon fonctionnement du site, de mémoriser certaines
            informations et d’améliorer l’expérience utilisateur.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Cookies strictement nécessaires
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            The Wine Watchers utilise uniquement des cookies techniques
            indispensables au fonctionnement du site, notamment pour :
          </p>

          <ul className="mt-4 list-disc pl-8 leading-8 text-[#6d5b50]">
            <li>la connexion et l’authentification des utilisateurs ;</li>
            <li>la gestion du panier et du processus de commande ;</li>
            <li>la sécurité du site et la prévention des fraudes ;</li>
            <li>le traitement des paiements sécurisés ;</li>
            <li>le bon fonctionnement général de la plateforme.</li>
          </ul>

          <h2 className="mt-10 font-serif text-3xl">
            Absence de cookies publicitaires
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            À ce jour, The Wine Watchers n’utilise aucun cookie publicitaire,
            de remarketing ou de profilage comportemental.
          </p>

          <h2 className="mt-10 font-serif text-3xl">
            Évolution future du site
          </h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Si des outils statistiques ou publicitaires nécessitant votre
            consentement venaient à être installés à l’avenir, un mécanisme de
            recueil du consentement conforme à la réglementation applicable sera
            mis en place avant leur activation.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Gestion des cookies</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Vous pouvez configurer votre navigateur afin de bloquer ou supprimer
            les cookies. Toutefois, certaines fonctionnalités essentielles du
            site pourraient alors ne plus fonctionner correctement.
          </p>

          <h2 className="mt-10 font-serif text-3xl">Contact</h2>
          <p className="mt-4 leading-8 text-[#6d5b50]">
            Pour toute question relative à l’utilisation des cookies, vous
            pouvez nous contacter via notre page de contact ou à l’adresse
            indiquée dans les mentions légales.
          </p>
        </div>
      </section>
    </main>
  );
}