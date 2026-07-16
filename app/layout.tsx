import type { Metadata } from "next";
import "./globals.css";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";

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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "OnlineStore"],
      "@id": `${SITE_URL}/#organization`,

      name: "The Wine Watchers",
      legalName: "THE WINE WATCHERS SL",

      url: SITE_URL,

      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/favicon-tww.png`,
        contentUrl: `${SITE_URL}/favicon-tww.png`,
        caption: "The Wine Watchers",
      },

      image: {
        "@id": `${SITE_URL}/#logo`,
      },

      description:
        "The Wine Watchers SL est une société espagnole basée à Roses, dans la province de Girona, spécialisée dans la sélection et la commercialisation de grands vins.",

      taxID: "B55053219",
      vatID: "ESB55053219",

      identifier: {
        "@type": "PropertyValue",
        propertyID: "NIF",
        value: "B55053219",
      },

      address: {
        "@type": "PostalAddress",
        streetAddress: "Riera Ginjolers, 99",
        postalCode: "17480",
        addressLocality: "Roses",
        addressRegion: "Girona",
        addressCountry: {
          "@type": "Country",
          name: "España",
          identifier: "ES",
        },
      },

      location: {
        "@type": "Place",
        name: "The Wine Watchers SL",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Riera Ginjolers, 99",
          postalCode: "17480",
          addressLocality: "Roses",
          addressRegion: "Girona",
          addressCountry: "ES",
        },
      },

      telephone: "+34972150878",
      email: "contact@thewinewatchers.com",

      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+34972150878",
          email: "contact@thewinewatchers.com",
          contactType: "customer service",
          availableLanguage: ["fr", "es"],
          areaServed: ["ES", "FR", "BE", "LU", "DE", "IT", "CH"],
        },
      ],

      areaServed: [
        {
          "@type": "Country",
          name: "España",
        },
        {
          "@type": "AdministrativeArea",
          name: "European Union",
        },
      ],

      currenciesAccepted: "EUR",

      foundingLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Roses",
          addressRegion: "Girona",
          addressCountry: "ES",
        },
      },

      knowsAbout: [
        "Grands vins",
        "Vins de Bordeaux",
        "Vins de Bourgogne",
        "Vins de la Vallée du Rhône",
        "Vins italiens",
        "Vins espagnols",
        "Bordeaux Primeurs",
      ],
    },

    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,

      url: SITE_URL,
      name: "The Wine Watchers",
      alternateName: "The Wine Watchers SL",

      description:
        "Boutique en ligne espagnole spécialisée dans les grands vins.",

      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },

      inLanguage: "fr-FR",
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
          id="structured-data-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        <Menu />

        {children}

        <Footer />

        <CookieBanner />
      </body>
    </html>
  );
}