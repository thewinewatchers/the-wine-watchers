import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#170606] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8b56d]">
              The Wine Watchers
            </p>

            <h2 className="mt-3 font-serif text-2xl text-white">
              Grands vins, allocations et bouteilles de collection.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
              Sélection de grands crus, domaines prestigieux, primeurs et vins
              recherchés pour amateurs, collectionneurs et professionnels.
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-block rounded-full bg-[#8a1f1f] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#641313]"
            >
              Formulaire de contact
            </Link>
          </div>

          {/* NAVIGATION */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#d8b56d]">
              Navigation
            </p>

            <nav className="mt-4 grid gap-2 text-sm text-white/70">
              <Link href="/" className="transition hover:text-[#d8b56d]">
                Accueil
              </Link>

              <Link href="/boutique" className="transition hover:text-[#d8b56d]">
                Boutique
              </Link>

              <Link href="/offres" className="transition hover:text-[#d8b56d]">
                Offres du moment
              </Link>

              <Link
                href="/boutique/primeurs-2025"
                className="transition hover:text-[#d8b56d]"
              >
                Primeurs 2025
              </Link>

              <Link href="/a-propos" className="transition hover:text-[#d8b56d]">
                À propos
              </Link>

              <Link href="/contact" className="transition hover:text-[#d8b56d]">
                Contact
              </Link>
            </nav>
          </div>

          {/* INFORMATIONS LÉGALES */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#d8b56d]">
              Informations légales
            </p>

            <nav className="mt-4 grid gap-2 text-sm text-white/70">
              <Link
                href="/mentions-legales"
                className="transition hover:text-[#d8b56d]"
              >
                Mentions légales
              </Link>

              <Link
                href="/conditions-generales-de-vente"
                className="transition hover:text-[#d8b56d]"
              >
                Conditions générales de vente
              </Link>

              <Link
                href="/politique-de-confidentialite"
                className="transition hover:text-[#d8b56d]"
              >
                Politique de confidentialité
              </Link>

              <Link
                href="/politique-cookies"
                className="transition hover:text-[#d8b56d]"
              >
                Politique de cookies
              </Link>

              <Link
                href="/livraison"
                className="transition hover:text-[#d8b56d]"
              >
                Livraison & retours
              </Link>
            </nav>
          </div>

          {/* INFORMATIONS SOCIÉTÉ */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#d8b56d]">
              Informations société
            </p>

            <div className="mt-4 grid gap-2 text-sm leading-6 text-white/70">
              <p>
                <span className="text-white/70">Société : </span>
                <span className="text-white">The Wine Watchers SL</span>
              </p>

              <p>
                <span className="text-white/70">Adresse : </span>
                Riera Ginjolers,99 17480 Roses
              </p>

              <p>
                <span className="text-white/70">Email : </span>
                <a
                  href="mailto:contact@thewinewatchers.com"
                  className="transition hover:text-[#d8b56d]"
                >
                  contact@thewinewatchers.com
                </a>
              </p>

              <p>
                <span className="text-white/70">Téléphone : </span>
                <a
                  href="tel:+34972150878"
                  className="transition hover:text-[#d8b56d]"
                >
                  +34 972 15 08 78
                </a>
              </p>

              <p>
                <span className="text-white/70">Pays : </span>
                Espagne
              </p>
            </div>
          </div>
        </div>

        {/* MODES DE PAIEMENT */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-[#d8b56d]">
            Modes de paiement acceptés
          </p>

          <div className="mt-4 grid gap-4 text-sm text-white/70 md:grid-cols-2">
            <div>
              <p className="font-semibold text-white">
                Virement bancaire par CaixaBank
              </p>
              <p className="mt-1 leading-6">
                Paiement par virement bancaire sécurisé après validation de la
                commande.
              </p>
            </div>

            <div>
              <p className="font-semibold text-white">
                Paiements sécurisés SSL via Stripe
              </p>
              <p className="mt-1 leading-6">
                Cartes bancaires acceptées via Stripe, prestataire de paiement
                sécurisé.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md border border-white/20 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#170606]">
                  Visa
                </span>
                <span className="rounded-md border border-white/20 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#170606]">
                  Mastercard
                </span>
                <span className="rounded-md border border-white/20 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#170606]">
                  Amex
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-3 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
            <p>© 2026 The Wine Watchers SL. Tous droits réservés.</p>

            <Link href="/contact" className="transition hover:text-[#d8b56d]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}