"use client";

import { useState } from "react";
import Link from "next/link";

export default function DesinscriptionNewsletterPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUnsubscribe(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setMessage("Merci d’indiquer une adresse e-mail valide.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Erreur lors de la désinscription.");
      } else {
        setEmail("");
        setMessage("Votre désinscription a bien été prise en compte.");
      }
    } catch {
      setMessage("Erreur lors de la désinscription.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f8f4ee] px-6 py-16 text-[#24110d]">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#8a6a2f]">
          The Wine Watchers
        </p>

        <h1 className="font-serif text-4xl text-[#24110d]">
          Désinscription newsletter
        </h1>

        <p className="mt-5 leading-8 text-neutral-700">
          Indiquez votre adresse e-mail pour ne plus recevoir nos newsletters.
        </p>

        <form onSubmit={handleUnsubscribe} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-[#e1d1bd] px-4 py-3 outline-none focus:border-[#8a1f1f]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#8a1f1f] px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#641313] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Désinscription..." : "Se désinscrire"}
          </button>
        </form>

        {message ? (
          <p className="mt-5 text-sm font-medium text-[#8a1f1f]">{message}</p>
        ) : null}

        <Link
          href="/"
          className="mt-8 inline-block text-sm font-medium text-[#8a1f1f] hover:underline"
        >
          ← Retour à l’accueil
        </Link>
      </section>
    </main>
  );
}