"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const GOOGLE_ANALYTICS_ID = "G-BRTVEN2996";
const CONSENT_KEY = "tww_analytics_consent";

type AnalyticsConsent = "accepted" | "refused" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(
      CONSENT_KEY
    ) as AnalyticsConsent;

    setConsent(savedConsent);
    setVisible(savedConsent !== "accepted" && savedConsent !== "refused");
    setLoaded(true);
  }, []);

  function acceptCookies() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);

    window.setTimeout(() => {
      window.dispatchEvent(
        new Event("tww-analytics-consent-accepted")
      );
    }, 500);
  }

  function refuseCookies() {
    localStorage.setItem(CONSENT_KEY, "refused");
    setConsent("refused");
    setVisible(false);
  }

  if (!loaded) {
    return null;
  }

  return (
    <>
      {consent === "accepted" && (
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      )}

      {visible && (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-[#d8b56d]/40 bg-[#170606] px-6 py-5 text-white shadow-2xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-4xl">
              <p className="text-sm leading-6 text-white/80">
                The Wine Watchers utilise des cookies nécessaires au bon
                fonctionnement du site. Avec votre accord, nous utilisons
                également Google Analytics afin de mesurer l’audience et
                d’améliorer votre expérience. Vous pouvez accepter ou refuser
                ces cookies statistiques.
              </p>

              <Link
                href="/politique-cookies"
                className="mt-2 inline-block text-sm font-semibold text-[#d8b56d] underline-offset-4 hover:underline"
              >
                En savoir plus
              </Link>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refuseCookies}
                className="rounded-full border border-[#d8b56d] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#d8b56d] transition hover:bg-[#d8b56d]/10"
              >
                Refuser
              </button>

              <button
                type="button"
                onClick={acceptCookies}
                className="rounded-full bg-[#d8b56d] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#170606] transition hover:bg-[#f0cf85]"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}