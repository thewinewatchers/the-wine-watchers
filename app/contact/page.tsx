"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

const CONTACT_EMAIL = "contact@thewinewatchers.com";
const CONTACT_PHONE = "+34 972 15 08 78";
const CONTACT_ADDRESS = "Riera Ginjolers,99 17480 Roses";

const inputClass =
  "w-full min-w-0 rounded border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#8a1f1f] focus:outline-none focus:ring-2 focus:ring-[#8a1f1f]/10";

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [vinRecherche, setVinRecherche] = useState("");
  const [quantite, setQuantite] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function envoyerDemande(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) return;

    setSending(true);
    setFeedback("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          email,
          telephone,
          vinRecherche,
          quantite,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result?.error ||
            "Une erreur est survenue lors de l’envoi de votre demande."
        );
        return;
      }

      setFeedback(
        "Votre demande a bien été envoyée. Nous reviendrons vers vous rapidement."
      );

      setNom("");
      setEmail("");
      setTelephone("");
      setVinRecherche("");
      setQuantite("");
      setMessage("");
    } catch {
      setErrorMessage(
        "Impossible d’envoyer la demande pour le moment. Merci de réessayer."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <nav
          aria-label="Fil d’Ariane"
          className="flex flex-wrap items-center gap-2 text-sm text-stone-500"
        >
          <Link href="/" className="hover:text-[#8a1f1f]">
            Accueil
          </Link>

          <span aria-hidden="true">/</span>
          <span aria-current="page">Contact</span>
        </nav>

        <header className="mt-6 border-b border-stone-200 pb-6">
          <h1 className="font-serif text-3xl md:text-4xl">
            Contact et recherche personnalisée
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            Vous recherchez un château, un domaine, un millésime ou une
            allocation spécifique ? Complétez le formulaire et envoyez-nous
            votre demande.
          </p>
        </header>

        <div className="grid items-start gap-8 py-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <section aria-labelledby="contact-details-title">
            <h2
              id="contact-details-title"
              className="font-serif text-2xl"
            >
              Une demande spécifique ?
            </h2>

            <p className="mt-3 text-sm leading-7 text-stone-600">
              Indiquez le vin recherché, le millésime souhaité, le format,
              la quantité et toute information utile. Nous reviendrons vers
              vous avec les disponibilités possibles.
            </p>

            <dl className="mt-5 space-y-5 border-t border-stone-200 pt-5">
              <div>
                <dt className="text-xs font-medium text-stone-500">
                  Email
                </dt>

                <dd className="mt-1 text-sm">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="break-words text-[#8a1f1f] underline-offset-4 hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-stone-500">
                  Téléphone
                </dt>

                <dd className="mt-1 text-sm">
                  <a
                    href="tel:+34972150878"
                    className="text-[#8a1f1f] underline-offset-4 hover:underline"
                  >
                    {CONTACT_PHONE}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-stone-500">
                  Adresse
                </dt>

                <dd className="mt-1 text-sm leading-6 text-stone-600">
                  {CONTACT_ADDRESS}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-stone-500">
                  Spécialités
                </dt>

                <dd className="mt-1 text-sm leading-6 text-stone-600">
                  Bordeaux, Bourgogne, Rhône, Italie, Espagne, USA et
                  Primeurs.
                </dd>
              </div>
            </dl>

            <Link
              href="/boutique"
              className="mt-6 inline-block text-sm font-medium text-[#8a1f1f] hover:underline"
            >
              Découvrir nos vins →
            </Link>
          </section>

          <section
            aria-labelledby="contact-form-title"
            className="min-w-0 rounded-lg border border-stone-200 p-5 md:p-6"
          >
            <h2
              id="contact-form-title"
              className="font-serif text-2xl"
            >
              Votre demande
            </h2>

            <p className="mt-2 text-xs text-stone-500">
              Les champs marqués d’un astérisque sont obligatoires.
            </p>

            <form
              onSubmit={envoyerDemande}
              aria-labelledby="contact-form-title"
              aria-busy={sending}
              className="mt-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid min-w-0 gap-2">
                  <span className="text-sm font-medium">Nom *</span>
                  <input
                    name="nom"
                    value={nom}
                    onChange={(event) => setNom(event.target.value)}
                    type="text"
                    autoComplete="name"
                    required
                    className={inputClass}
                    placeholder="Votre nom"
                  />
                </label>

                <label className="grid min-w-0 gap-2">
                  <span className="text-sm font-medium">Email *</span>
                  <input
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    autoComplete="email"
                    required
                    className={inputClass}
                    placeholder="votre@email.com"
                  />
                </label>

                <label className="grid min-w-0 gap-2 sm:col-span-2">
                  <span className="text-sm font-medium">Téléphone</span>
                  <input
                    name="telephone"
                    value={telephone}
                    onChange={(event) => setTelephone(event.target.value)}
                    type="tel"
                    autoComplete="tel"
                    className={inputClass}
                    placeholder="Votre numéro de téléphone"
                  />
                </label>

                <label className="grid min-w-0 gap-2">
                  <span className="text-sm font-medium">Vin recherché</span>
                  <input
                    name="vinRecherche"
                    value={vinRecherche}
                    onChange={(event) =>
                      setVinRecherche(event.target.value)
                    }
                    type="text"
                    className={inputClass}
                    placeholder="Ex : Château Lafite Rothschild 2018"
                  />
                </label>

                <label className="grid min-w-0 gap-2">
                  <span className="text-sm font-medium">
                    Quantité souhaitée
                  </span>
                  <input
                    name="quantite"
                    value={quantite}
                    onChange={(event) => setQuantite(event.target.value)}
                    type="text"
                    className={inputClass}
                    placeholder="Ex : 1 bouteille, caisse de 6…"
                  />
                </label>

                <label className="grid min-w-0 gap-2 sm:col-span-2">
                  <span className="text-sm font-medium">Message *</span>
                  <textarea
                    name="message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={5}
                    required
                    className={`${inputClass} resize-y`}
                    placeholder="Indiquez le millésime, le format, la quantité, le délai souhaité ou toute information utile."
                  />
                </label>
              </div>

              {feedback && (
                <div
                  role="status"
                  className="mt-4 rounded border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-800"
                >
                  {feedback}
                </div>
              )}

              {errorMessage && (
                <div
                  role="alert"
                  className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800"
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="mt-5 rounded bg-[#8a1f1f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#641313] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Envoi en cours…" : "Envoyer la demande"}
              </button>

              <p className="mt-3 text-xs leading-6 text-stone-500">
                Votre demande sera envoyée directement à The Wine Watchers.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}