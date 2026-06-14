import type { Metadata } from "next";
import "./globals.css";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "The Wine Watchers",
  description: "Sélection de grands vins, Bordeaux, Bourgogne et primeurs.",
  icons: {
    icon: "/favicon-tww.png",
    shortcut: "/favicon-tww.png",
    apple: "/favicon-tww.png",
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
      </body>
    </html>
  );
}