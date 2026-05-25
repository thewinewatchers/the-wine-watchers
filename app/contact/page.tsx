"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const CONTACT_EMAIL = "contact@thewinewatchers.com";
const CONTACT_PHONE = "+34 972 15 08 78";
const CONTACT_ADDRESS = "Riera Ginjolers,99 17480 Roses";

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
        setSending(false);
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
    <main className="min-h-screen bg-[#f7f1e8] text-[#24110d]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#170606] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,181,109,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(138,31,31,0.35),transparent_36%),linear-gradient(135deg,#2a0d0d,#100303)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <Link
            href="/boutique"
            className="mb-8 inline-block text-sm uppercase tracking-[0.25em] text-[#d8b56d] transition hover:text-white"
          >
            ← Retour boutique
          </Link>

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            The Wine Watchers
          </p>

          <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">
            Contact & recherche personnalisée
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            Vous recherchez un château, un domaine, un millésime ou une
            allocation spécifique ? Complétez le formulaire et envoyez-nous
            votre demande.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-24">
        {/* INFOS SOCIÉTÉ */}
        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            The Wine Watchers
          </p>

          <h2 className="mt-4 font-serif text-4xl text-[#24110d]">
            Une demande spécifique ?
          </h2>

          <p className="mt-6 text-base leading-8 text-[#6d5b50]">
            Indiquez le vin recherché, le millésime souhaité, le format, la
            quantité et toute information utile. Nous reviendrons vers vous avec
            les disponibilités possibles.
          </p>

          <div className="mt-8 space-y-6 border-t border-[#eadfce] pt-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#8a6a2f]">
                Email
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 inline-block font-serif text-2xl text-[#24110d] transition hover:text-[#8a1f1f]"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#8a6a2f]">
                Téléphone
              </p>

              <p className="mt-2 font-serif text-2xl text-[#24110d]">
                {CONTACT_PHONE}
              </p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#8a6a2f]">
                Adresse
              </p>

              <p className="mt-2 text-base leading-7 text-[#6d5b50]">
                {CONTACT_ADDRESS}
              </p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#8a6a2f]">
                Spécialités
              </p>

              <p className="mt-2 text-base leading-7 text-[#6d5b50]">
                Bordeaux, Bourgogne, Rhône, Italie, Espagne, USA et Primeurs.
              </p>
            </div>
          </div>
        </div>

        {/* FORMULAIRE */}
        <form
          onSubmit={envoyerDemande}
          className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            Formulaire
          </p>

          <h2 className="mt-4 font-serif text-4xl text-[#24110d]">
            Votre demande
          </h2>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="font-semibold">Nom *</span>
              <input
                value={nom}
                onChange={(event) => setNom(event.target.value)}
                type="text"
                required
                className="rounded-2xl border border-[#d8cbbb] bg-white px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
                placeholder="Votre nom"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-semibold">Email *</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                className="rounded-2xl border border-[#d8cbbb] bg-white px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
                placeholder="votre@email.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-semibold">Téléphone</span>
              <input
                value={telephone}
                onChange={(event) => setTelephone(event.target.value)}
                type="tel"
                className="rounded-2xl border border-[#d8cbbb] bg-white px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
                placeholder="Votre numéro de téléphone"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-semibold">Vin recherché</span>
              <input
                value={vinRecherche}
                onChange={(event) => setVinRecherche(event.target.value)}
                type="text"
                className="rounded-2xl border border-[#d8cbbb] bg-white px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
                placeholder="Ex : Château Lafite Rothschild 2018"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-semibold">Quantité souhaitée</span>
              <input
                value={quantite}
                onChange={(event) => setQuantite(event.target.value)}
                type="text"
                className="rounded-2xl border border-[#d8cbbb] bg-white px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
                placeholder="Ex : 1 bouteille, 3 bouteilles, caisse de 6..."
              />
            </label>

            <label className="grid gap-2">
              <span className="font-semibold">Message *</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                required
                className="resize-none rounded-2xl border border-[#d8cbbb] bg-white px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
                placeholder="Indiquez le millésime, le format, la quantité, le délai souhaité ou toute information utile."
              />
            </label>
          </div>

          {feedback && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800">
              {feedback}
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="mt-8 rounded-full bg-[#8a1f1f] px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#641313] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Envoi en cours..." : "Envoyer la demande"}
          </button>

          <p className="mt-5 text-sm leading-6 text-[#6d5b50]">
            Votre demande sera envoyée directement à The Wine Watchers.
          </p>
        </form>
      </section>
    </main>
  );
}