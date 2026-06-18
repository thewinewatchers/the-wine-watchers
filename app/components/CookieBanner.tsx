"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("tww_cookie_notice_accepted");

    if (!consent) {
      setVisible(true);
    }
  }, []);

  function acceptCookies() {
    localStorage.setItem("tww_cookie_notice_accepted", "true");
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-[#d8b56d]/40 bg-[#170606] px-6 py-5 text-white shadow-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-4xl">
          <p className="text-sm leading-6 text-white/80">
            The Wine Watchers utilise uniquement des cookies nécessaires au bon
            fonctionnement du site : connexion, panier, commande, sécurité et
            paiement. Aucun cookie publicitaire ou statistique n’est utilisé à
            ce jour.
          </p>

          <Link
            href="/politique-cookies"
            className="mt-2 inline-block text-sm font-semibold text-[#d8b56d] underline-offset-4 hover:underline"
          >
            En savoir plus
          </Link>
        </div>

        <button
          type="button"
          onClick={acceptCookies}
          className="rounded-full bg-[#d8b56d] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#170606] transition hover:bg-[#f0cf85]"
        >
          J’ai compris
        </button>
      </div>
    </div>
  );
}