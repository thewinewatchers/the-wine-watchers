"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getSearchTarget(search: string) {
  const normalizedSearch = normalizeSearch(search);

  if (
    normalizedSearch.includes("la tache") ||
    normalizedSearch.includes("tache") ||
    normalizedSearch.includes("richebourg") ||
    normalizedSearch.includes("romanee") ||
    normalizedSearch.includes("conti") ||
    normalizedSearch.includes("drc") ||
    normalizedSearch.includes("saint vivant") ||
    normalizedSearch.includes("romanee saint vivant") ||
    normalizedSearch.includes("rousseau") ||
    normalizedSearch.includes("dujac") ||
    normalizedSearch.includes("leroy") ||
    normalizedSearch.includes("gevrey") ||
    normalizedSearch.includes("chambertin") ||
    normalizedSearch.includes("vosne") ||
    normalizedSearch.includes("bourgogne")
  ) {
    return "bourgogne";
  }

  if (
    normalizedSearch.includes("sassicaia") ||
    normalizedSearch.includes("ornellaia") ||
    normalizedSearch.includes("masseto") ||
    normalizedSearch.includes("italie")
  ) {
    return "italie";
  }

  if (
    normalizedSearch.includes("vega") ||
    normalizedSearch.includes("pingus") ||
    normalizedSearch.includes("espagne")
  ) {
    return "espagne";
  }

  return "bordeaux";
}

export default function Menu() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");

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
    window.location.href = "/boutique/bordeaux";
  };

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanSearch = search.trim();

    if (!cleanSearch) return;

    const targetCategory = getSearchTarget(cleanSearch);

    router.push(
      `/boutique/${targetCategory}?search=${encodeURIComponent(cleanSearch)}`
    );

    setSearch("");
    setOpen(false);
  }

  const showLoggedOutLinks = isLoggedIn === false;
  const showLoggedInLinks = isLoggedIn === true;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-tww.jpg"
            alt="The Wine Watchers"
            width={120}
            height={120}
            priority
            className="h-12 w-auto object-contain"
          />
          <span className="hidden font-serif text-xl tracking-wide text-neutral-900 sm:inline">
            The Wine Watchers
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded border border-neutral-300 px-3 py-2 text-sm md:hidden"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-5 text-sm uppercase tracking-wide text-neutral-700 md:flex">
          <Link href="/" className="transition hover:text-[#8B1E2D]">
            Accueil
          </Link>

          <Link href="/boutique" className="transition hover:text-[#8B1E2D]">
            Boutique
          </Link>

          {showLoggedOutLinks && (
            <>
              <Link
                href="/connexion"
                className="transition hover:text-[#8B1E2D]"
              >
                Connexion
              </Link>

              <Link
                href="/inscription"
                className="transition hover:text-[#8B1E2D]"
              >
                Inscription
              </Link>
            </>
          )}

          {showLoggedInLinks && (
            <Link
              href="/mon-compte"
              className="transition hover:text-[#8B1E2D]"
            >
              Mon compte
            </Link>
          )}

          <Link href="/a-propos" className="transition hover:text-[#8B1E2D]">
            À propos
          </Link>

          <Link href="/blog" className="transition hover:text-[#8B1E2D]">
            Blog
          </Link>

          {showLoggedInLinks && (
            <Link
              href="/mon-compte#wishlist"
              className="transition hover:text-[#8B1E2D]"
            >
              Wishlist
            </Link>
          )}

          <Link
            href="/panier"
            className="rounded-full border border-[#8B1E2D] px-4 py-2 text-[#8B1E2D] transition hover:bg-[#8B1E2D] hover:text-white"
          >
            Panier
          </Link>

          {showLoggedInLinks && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-[#8B1E2D] px-4 py-2 text-white transition hover:bg-black"
            >
              Déconnexion
            </button>
          )}

          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Recherche..."
              className="w-48 rounded-full border border-[#8B1E2D] bg-white px-4 py-2 text-sm normal-case tracking-normal text-black outline-none placeholder:text-neutral-600 focus:border-black"
            />
          </form>
        </nav>
      </div>

      {open && (
        <nav className="border-t border-neutral-200 bg-white px-6 py-4 text-sm uppercase tracking-wide text-neutral-700 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setOpen(false)}>
              Accueil
            </Link>

            <Link href="/boutique" onClick={() => setOpen(false)}>
              Boutique
            </Link>

            {showLoggedOutLinks && (
              <>
                <Link href="/connexion" onClick={() => setOpen(false)}>
                  Connexion
                </Link>

                <Link href="/inscription" onClick={() => setOpen(false)}>
                  Inscription
                </Link>
              </>
            )}

            {showLoggedInLinks && (
              <Link href="/mon-compte" onClick={() => setOpen(false)}>
                Mon compte
              </Link>
            )}

            <Link href="/a-propos" onClick={() => setOpen(false)}>
              À propos
            </Link>

            <Link href="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>

            {showLoggedInLinks && (
              <Link
                href="/mon-compte#wishlist"
                onClick={() => setOpen(false)}
              >
                Wishlist
              </Link>
            )}

            <Link
              href="/panier"
              onClick={() => setOpen(false)}
              className="rounded-full border border-[#8B1E2D] px-4 py-2 text-center text-[#8B1E2D]"
            >
              Voir le panier
            </Link>

            {showLoggedInLinks && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-[#8B1E2D] px-4 py-2 text-center text-white transition hover:bg-black"
              >
                Se déconnecter
              </button>
            )}

            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Recherche..."
                className="w-full rounded-full border border-[#8B1E2D] bg-white px-4 py-3 text-sm normal-case tracking-normal text-black outline-none placeholder:text-neutral-600 focus:border-black"
              />
            </form>
          </div>
        </nav>
      )}
    </header>
  );
}