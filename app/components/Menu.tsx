"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ArticlePanier = {
  nom: string;
  prix: number;
  quantite: number;
  image?: string;
  slug?: string;
};

export default function Menu() {
  const pathname = usePathname();
  const [nombreArticles, setNombreArticles] = useState(0);

  function mettreAJourCompteur() {
    try {
      const panierSauvegarde = localStorage.getItem("panier");

      if (!panierSauvegarde) {
        setNombreArticles(0);
        return;
      }

      const panier: ArticlePanier[] = JSON.parse(panierSauvegarde);

      const total = panier.reduce((somme, article) => {
        return somme + Number(article.quantite || 0);
      }, 0);

      setNombreArticles(total);
    } catch {
      setNombreArticles(0);
    }
  }

  useEffect(() => {
    mettreAJourCompteur();

    window.addEventListener("storage", mettreAJourCompteur);
    window.addEventListener("panier-modifie", mettreAJourCompteur);
    window.addEventListener("focus", mettreAJourCompteur);
    window.addEventListener("click", mettreAJourCompteur);

    const interval = window.setInterval(mettreAJourCompteur, 300);

    return () => {
      window.removeEventListener("storage", mettreAJourCompteur);
      window.removeEventListener("panier-modifie", mettreAJourCompteur);
      window.removeEventListener("focus", mettreAJourCompteur);
      window.removeEventListener("click", mettreAJourCompteur);
      window.clearInterval(interval);
    };
  }, [pathname]);

  return (
    <nav
      style={{
        padding: "20px 40px",
        background: "#1f1a17",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Georgia, serif",
        gap: 25,
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#d6b36a",
          textDecoration: "none",
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
        The Wine Watchers
      </Link>

      <div
        style={{
          display: "flex",
          gap: 25,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={linkStyle}>
          Accueil
        </Link>

        <Link href="/a-propos" style={linkStyle}>
          À propos
        </Link>

        <Link href="/boutique" style={linkStyle}>
          Boutique
        </Link>

        <Link
          href="/panier"
          style={{
            color: "#d6b36a",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Panier ({nombreArticles})
        </Link>

        <Link href="/livraison" style={linkStyle}>
          Livraison
        </Link>

        <Link href="/contact" style={linkStyle}>
          Contact
        </Link>
      </div>
    </nav>
  );
}

const linkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
};