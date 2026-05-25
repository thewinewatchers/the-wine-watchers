"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(Boolean(data.user));
    }

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setOpen(false);
    window.location.href = "/boutique";
  };

  const showLoggedOutLinks = isLoggedIn === false;
  const showLoggedInLinks = isLoggedIn === true;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-serif tracking-wide text-neutral-900">
          The Wine Watchers
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="rounded border border-neutral-300 px-3 py-2 text-sm md:hidden"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-6 text-sm uppercase tracking-wide text-neutral-700 md:flex">
          <Link href="/" className="transition hover:text-[#8B1E2D]">Accueil</Link>
          <Link href="/boutique" className="transition hover:text-[#8B1E2D]">Boutique</Link>

          {showLoggedOutLinks && (
            <>
              <Link href="/connexion" className="transition hover:text-[#8B1E2D]">Connexion</Link>
              <Link href="/inscription" className="transition hover:text-[#8B1E2D]">Inscription</Link>
            </>
          )}

          {showLoggedInLinks && (
            <Link href="/mon-compte" className="transition hover:text-[#8B1E2D]">Mon compte</Link>
          )}

          <Link href="/a-propos" className="transition hover:text-[#8B1E2D]">À propos</Link>

          <Link
            href="/panier"
            className="rounded-full border border-[#8B1E2D] px-4 py-2 text-[#8B1E2D] transition hover:bg-[#8B1E2D] hover:text-white"
          >
            Voir le panier
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-[#8B1E2D] px-4 py-2 text-white transition hover:bg-black"
          >
            Se déconnecter
          </button>
        </nav>
      </div>

      {open && (
        <nav className="border-t border-neutral-200 bg-white px-6 py-4 text-sm uppercase tracking-wide text-neutral-700 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setOpen(false)}>Accueil</Link>
            <Link href="/boutique" onClick={() => setOpen(false)}>Boutique</Link>

            {showLoggedOutLinks && (
              <>
                <Link href="/connexion" onClick={() => setOpen(false)}>Connexion</Link>
                <Link href="/inscription" onClick={() => setOpen(false)}>Inscription</Link>
              </>
            )}

            {showLoggedInLinks && (
              <Link href="/mon-compte" onClick={() => setOpen(false)}>Mon compte</Link>
            )}

            <Link href="/a-propos" onClick={() => setOpen(false)}>À propos</Link>

            <Link
              href="/panier"
              onClick={() => setOpen(false)}
              className="rounded-full border border-[#8B1E2D] px-4 py-2 text-center text-[#8B1E2D]"
            >
              Voir le panier
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-[#8B1E2D] px-4 py-2 text-center text-white transition hover:bg-black"
            >
              Se déconnecter
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}