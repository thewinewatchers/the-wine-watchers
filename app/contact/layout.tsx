import type { Metadata } from "next";

const SITE_URL = "https://www.thewinewatchers.com";

export const metadata: Metadata = {
  title: "Contact & recherche personnalisée | The Wine Watchers",
  description:
    "Contactez The Wine Watchers pour une recherche personnalisée de grands vins, millésimes rares, allocations et bouteilles de collection.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact & recherche personnalisée | The Wine Watchers",
    description:
      "Contactez The Wine Watchers pour une recherche personnalisée de grands vins, millésimes rares, allocations et bouteilles de collection.",
    url: `${SITE_URL}/contact`,
    siteName: "The Wine Watchers",
    locale: "fr_FR",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}