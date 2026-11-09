
import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_URL = "https://www.thewinewatchers.com";

const description =
  "Sélection de grands vins de Bordeaux, Bourgogne, Vallée du Rhône, Italie, Espagne et primeurs.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "The Wine Watchers",
    template: "%s | The Wine Watchers",
  },

  description,

  applicationName: "The Wine Watchers",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/favicon-tww.png",
        type: "image/png",
      },
    ],
    shortcut: "/favicon-tww.png",
    apple: "/favicon-tww.png",
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "The Wine Watchers",
    title: "The Wine Watchers",
    description,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "The Wine Watchers",
      legalName: "The Wine Watchers SL",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon-tww.png`,
      description:
        "The Wine Watchers est une boutique en ligne spécialisée dans la sélection et la vente de grands vins de Bordeaux, Bourgogne, Vallée du Rhône, Italie, Espagne et des vins en primeur.",
      email: "contact@thewinewatchers.com",
      knowsAbout: [
        "Grands vins",
        "Vins de Bordeaux",
        "Vins de Bourgogne",
        "Vins de la Vallée du Rhône",
        "Grands vins italiens",
        "Grands vins espagnols",
        "Vins en primeur",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "The Wine Watchers",
      url: SITE_URL,
      description,
      inLanguage: "fr-FR",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />

        <Menu />
        {children}
        <Footer />
        <CookieBanner />

        <Analytics />
        <SpeedInsights />

        {/* Chat en direct The Wine Watchers - tawk.to */}
        <Script
          id="tawk-to"
          src="https://embed.tawk.to/6ace01779c70df34c4fb835b/1k4qbbeqs"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
