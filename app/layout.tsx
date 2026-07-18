import type { Metadata } from "next";
import "./globals.css";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_URL = "https://www.thewinewatchers.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "The Wine Watchers",
    template: "%s | The Wine Watchers",
  },

  description:
    "Sélection de grands vins de Bordeaux, Bourgogne, Vallée du Rhône, Italie, Espagne et primeurs.",

  applicationName: "The Wine Watchers",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/favicon-tww.png",
    shortcut: "/favicon-tww.png",
    apple: "/favicon-tww.png",
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "The Wine Watchers",
    title: "The Wine Watchers",
    description:
      "Sélection de grands vins de Bordeaux, Bourgogne, Vallée du Rhône, Italie, Espagne et primeurs.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Menu />
        {children}
        <Footer />
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}