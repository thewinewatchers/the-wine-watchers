"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Article = {
  nom: string;
  prix: number;
  quantite: number;
  image?: string;
  slug?: string;
};

export default function PanierClient() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const ajoutDejaEffectue = useRef(false);

  useEffect(() => {
    const panierSauvegarde = localStorage.getItem("panier");
    let panier: Article[] = panierSauvegarde
      ? JSON.parse(panierSauvegarde)
      : [];

    panier = panier.map((article) => ({
      nom: article.nom,
      prix: Number(article.prix) || 0,
      quantite: Number(article.quantite) || 1,
      image: article.image || "",
      slug: article.slug || "",
    }));

    const nom = searchParams.get("nom");
    const prix = searchParams.get("prix");
    const image = searchParams.get("image");
    const slug = searchParams.get("slug");

    if (nom && prix && !ajoutDejaEffectue.current) {
      ajoutDejaEffectue.current = true;

      const existant = panier.find((a) => a.nom === nom);

      if (existant) {
        existant.quantite += 1;

        if (image) existant.image = image;
        if (slug) existant.slug = slug;
      } else {
        panier.push({
          nom,
          prix: Number(prix),
          quantite: 1,
          image: image || "",
          slug: slug || "",
        });
      }

      localStorage.setItem("panier", JSON.stringify(panier));
      window.dispatchEvent(new Event("panier-modifie"));
      window.history.replaceState(null, "", "/panier");
    }

    setArticles(panier);
  }, [searchParams]);

  function sauvegarderPanier(nouveauPanier: Article[]) {
    localStorage.setItem("panier", JSON.stringify(nouveauPanier));
    setArticles(nouveauPanier);
    window.dispatchEvent(new Event("panier-modifie"));
  }

  function augmenterQuantite(nom: string) {
    const nouveauPanier = articles.map((article) =>
      article.nom === nom
        ? { ...article, quantite: article.quantite + 1 }
        : article
    );

    sauvegarderPanier(nouveauPanier);
  }

  function diminuerQuantite(nom: string) {
    const nouveauPanier = articles
      .map((article) =>
        article.nom === nom
          ? { ...article, quantite: article.quantite - 1 }
          : article
      )
      .filter((article) => article.quantite > 0);

    sauvegarderPanier(nouveauPanier);
  }

  function supprimerArticle(nom: string) {
    const nouveauPanier = articles.filter((article) => article.nom !== nom);
    sauvegarderPanier(nouveauPanier);
  }

  function viderPanier() {
    localStorage.removeItem("panier");
    setArticles([]);
    window.dispatchEvent(new Event("panier-modifie"));
  }

  const total = articles.reduce(
    (somme, article) => somme + article.prix * article.quantite,
    0
  );

  return (
    <main
      style={{
        padding: "70px 30px",
        background: "linear-gradient(135deg, #f4efe7, #fffaf3)",
        minHeight: "100vh",
        fontFamily: "Georgia, serif",
        color: "#1f1a17",
      }}
    >
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <p
          style={{
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#9b6a24",
            fontSize: 13,
            marginBottom: 10,
          }}
        >
          The Wine Watchers
        </p>

        <h1 style={{ fontSize: 52, margin: "0 0 30px" }}>Votre panier</h1>

        {articles.length === 0 ? (
          <div
            style={{
              background: "#fffaf3",
              padding: 30,
              borderRadius: 24,
              border: "1px solid #e5dccf",
            }}
          >
            <p style={{ fontSize: 20 }}>Votre panier est vide pour le moment.</p>

            <Link
              href="/boutique"
              style={{
                display: "inline-block",
                marginTop: 20,
                padding: "14px 24px",
                borderRadius: 999,
                background: "#1f1a17",
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Continuer mes achats
            </Link>
          </div>
        ) : (
          <>
            {articles.map((article) => (
              <div
                key={article.nom}
                style={{
                  background: "#fffaf3",
                  padding: 24,
                  marginTop: 18,
                  borderRadius: 28,
                  border: "1px solid #e5dccf",
                  color: "#1f1a17",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: 22,
                  alignItems: "center",
                }}
              >
                <Link
                  href={article.slug ? `/boutique/${article.slug}` : "/boutique"}
                  style={{
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 150,
                      borderRadius: 20,
                      overflow: "hidden",
                      background: "#efe4d5",
                    }}
                  >
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.nom}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9b6a24",
                          fontSize: 13,
                          textAlign: "center",
                          padding: 10,
                        }}
                      >
                        Image indisponible
                      </div>
                    )}
                  </div>
                </Link>

                <div style={{ display: "grid", gap: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2 style={{ margin: 0 }}>{article.nom}</h2>
                      <p style={{ marginBottom: 0 }}>
                        Prix : {article.prix.toLocaleString("fr-FR")} €
                      </p>
                    </div>

                    <p style={{ fontWeight: "bold", fontSize: 20, margin: 0 }}>
                      {(article.prix * article.quantite).toLocaleString(
                        "fr-FR"
                      )}{" "}
                      €
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => diminuerQuantite(article.nom)}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        border: "none",
                        background: "#e5dccf",
                        cursor: "pointer",
                        fontSize: 22,
                        fontWeight: "bold",
                      }}
                    >
                      -
                    </button>

                    <span style={{ fontSize: 18, minWidth: 90 }}>
                      Quantité : {article.quantite}
                    </span>

                    <button
                      onClick={() => augmenterQuantite(article.nom)}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        border: "none",
                        background: "#d6b36a",
                        cursor: "pointer",
                        fontSize: 22,
                        fontWeight: "bold",
                      }}
                    >
                      +
                    </button>

                    <button
                      onClick={() => supprimerArticle(article.nom)}
                      style={{
                        padding: "11px 18px",
                        borderRadius: 999,
                        background: "#8b0000",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 35,
                padding: 28,
                borderRadius: 28,
                background: "#1f1a17",
                color: "#fffaf3",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                Total : {total.toLocaleString("fr-FR")} €
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  marginTop: 25,
                }}
              >
                <Link
                  href="/boutique"
                  style={{
                    padding: "13px 22px",
                    borderRadius: 999,
                    background: "#fffaf3",
                    color: "#1f1a17",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Continuer mes achats
                </Link>

                <Link
                  href="/checkout"
                  style={{
                    padding: "13px 22px",
                    borderRadius: 999,
                    background: "#d6b36a",
                    color: "#1f1a17",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Commander
                </Link>

                <button
                  onClick={viderPanier}
                  style={{
                    padding: "13px 22px",
                    borderRadius: 999,
                    background: "#8b0000",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}