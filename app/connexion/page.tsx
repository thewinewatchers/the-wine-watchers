"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function ConnexionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = useMemo(() => {
    return searchParams.get("redirect") || "/boutique";
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConnexion = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage("Identifiants incorrects ou compte introuvable.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-16 text-[#24110d]">
      <section className="mx-auto max-w-xl rounded-[2rem] border border-[#e1d1bd] bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
          The Wine Watchers
        </p>

        <h1 className="mt-4 font-serif text-4xl text-black">Connexion</h1>

        <p className="mt-4 text-sm leading-6 text-neutral-700">
          Connectez-vous à votre compte client pour finaliser votre commande.
        </p>

        <form onSubmit={handleConnexion} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium">Adresse email</label>

            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#e1d1bd] bg-white px-4 py-3 outline-none focus:border-[#8a6a2f]"
              placeholder="email@exemple.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mot de passe</label>

            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#e1d1bd] bg-white px-4 py-3 outline-none focus:border-[#8a6a2f]"
              placeholder="Votre mot de passe"
            />
          </div>

          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8a6a2f] disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-8 border-t border-neutral-200 pt-6 text-sm text-neutral-700">
          Pas encore de compte ?{" "}
          <a
            href={`/inscription?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-[#8a6a2f] hover:text-black"
          >
            Créer un compte
          </a>
        </div>
      </section>
    </main>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionContent />
    </Suspense>
  );
}