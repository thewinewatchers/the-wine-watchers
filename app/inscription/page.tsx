"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function InscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = useMemo(() => {
    return searchParams.get("redirect") || "/boutique";
  }, [searchParams]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    if (password.length < 6) {
      setLoading(false);
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone,
          company_name: companyName || null,
          vat_number: vatNumber || null,
        },
      },
    });

    if (error) {
      setLoading(false);
      setErrorMessage(`Erreur d’inscription : ${error.message}`);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (loginError) {
      setMessage(
        "Compte créé. Vérifiez votre boîte email si Supabase demande une confirmation, puis connectez-vous."
      );
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-4 py-16 text-[#1f1a17]">
      <div className="mx-auto max-w-xl">
        <a
          href="/"
          className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
        >
          ← Retour accueil
        </a>

        <div className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm md:p-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            Espace client
          </p>

          <h1 className="mt-4 text-3xl font-serif text-black md:text-5xl">
            Créer un compte
          </h1>

          <p className="mt-4 text-sm leading-6 text-neutral-700">
            Créez votre compte The Wine Watchers pour finaliser votre commande.
          </p>

          <form onSubmit={handleSignup} className="mt-8 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Prénom *
                </label>

                <input
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#8a6a2f]"
                  placeholder="Prénom"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nom *
                </label>

                <input
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#8a6a2f]"
                  placeholder="Nom"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Téléphone
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#8a6a2f]"
                placeholder="+34..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Société</label>

              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#8a6a2f]"
                placeholder="Nom de société"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                N° TVA intracommunautaire
              </label>

              <input
                value={vatNumber}
                onChange={(event) => setVatNumber(event.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#8a6a2f]"
                placeholder="FR123456789"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Email *</label>

              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#8a6a2f]"
                placeholder="email@exemple.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Mot de passe *
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#8a6a2f]"
                placeholder="Minimum 6 caractères"
              />
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#8a6a2f] disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-8 border-t border-neutral-200 pt-6 text-sm text-neutral-700">
            Déjà un compte ?{" "}
            <a
              href={`/connexion?redirect=${encodeURIComponent(redirect)}`}
              className="font-semibold text-[#8a6a2f] hover:text-black"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={null}>
      <InscriptionContent />
    </Suspense>
  );
}