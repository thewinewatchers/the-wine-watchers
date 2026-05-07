"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Article = {
  nom: string;
  prix: number;
  quantite: number;
  image?: string;
  slug?: string;
};

export default function Checkout() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [commandeValidee, setCommandeValidee] = useState(false);

  useEffect(() => {
    const panierSauvegarde = localStorage.getItem("panier");
    const panier: Article[] = panierSauvegarde
      ? JSON.parse(panierSauvegarde)
      : [];

    const panierNettoye = panier.map((article) => ({
      nom: article.nom,
      prix: Number(article.prix) || 0,
      quantite: Number(article.quantite) || 1,
      image: article.image || "",
      slug: article.slug || "",
    }));

    setArticles(panierNettoye);
  }, []);

  const total = articles.reduce(
    (somme, article) => somme + article.prix * article.quantite,
    0
  );

  function validerCommande(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    localStorage.removeItem("panier");
    window.dispatchEvent(new Event("panier-modifie"));

    setArticles([]);
    setCommandeValidee(true);
  }

  if (commandeValidee) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #16080b, #2b0f16)",
          padding: "80px 30px",
          fontFamily: "Georgia, serif",
          color: "#fffaf3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <section
          style={{
            maxWidth: 720,
            background: "rgba(255, 250, 243, 0.08)",
            border: "1px solid rgba(214, 179, 106, 0.35)",
            borderRadius: 36,
            padding: 45,
          }}
        >
          <p
            style={{
              letterSpacing: 5,
              color: "#d6b36a",
              textTransform: "uppercase",
              fontSize: 13,
            }}
          >
            Commande confirmée
          </p>

          <h1 style={{ fontSize: 52, margin: "16px 0" }}>
            Merci pour votre commande
          </h1>

          <p style={{ color: "#e8dccb", fontSize: 19, lineHeight: 1.7 }}>
            Votre demande a bien été enregistrée. Un conseiller The Wine
            Watchers vous contactera prochainement pour finaliser le paiement
            sécurisé et organiser la livraison.
          </p>

          <Link
            href="/boutique"
            style={{
              display: "inline-block",
              marginTop: 30,
              padding: "14px 26px",
              borderRadius: 999,
              background: "#d6b36a",
              color: "#1f1a17",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Retour à la boutique
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f4efe7, #fffaf3)",
        padding: "70px 30px",
        fontFamily: "Georgia, serif",
        color: "#1f1a17",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p
          style={{
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#9b6a24",
            fontSize: 13,
            marginBottom: 10,
          }}
        >
          Paiement sécurisé
        </p>

        <h1 style={{ fontSize: 54, margin: "0 0 35px" }}>
          Finaliser votre commande
        </h1>

        {articles.length === 0 ? (
          <section
            style={{
              background: "#fffaf3",
              border: "1px solid #e5dccf",
              borderRadius: 28,
              padding: 32,
            }}
          >
            <p style={{ fontSize: 20 }}>Votre panier est vide.</p>

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
              Retour à la boutique
            </Link>
          </section>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 35,
              alignItems: "start",
            }}
          >
            <form
              onSubmit={validerCommande}
              style={{
                background: "#fffaf3",
                border: "1px solid #e5dccf",
                borderRadius: 30,
                padding: 30,
                display: "grid",
                gap: 18,
              }}
            >
              <h2 style={{ marginTop: 0 }}>Informations client</h2>

              <input
                required
                type="text"
                placeholder="Nom complet"
                style={inputStyle}
              />

              <input
                required
                type="email"
                placeholder="Adresse email"
                style={inputStyle}
              />

              <input
                required
                type="tel"
                placeholder="Téléphone"
                style={inputStyle}
              />

              <h2 style={{ marginTop: 20 }}>Adresse de livraison</h2>

              <input
                required
                type="text"
                placeholder="Adresse"
                style={inputStyle}
              />

              <input
                required
                type="text"
                placeholder="Ville"
                style={inputStyle}
              />

              <input
                required
                type="text"
                placeholder="Code postal"
                style={inputStyle}
              />

              <select required style={inputStyle} defaultValue="">
                <option value="" disabled>
                  Pays
                </option>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Espagne">Espagne</option>
              </select>

              <textarea
                placeholder="Instructions de livraison particulières"
                rows={4}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />

              <button
                type="submit"
                style={{
                  marginTop: 15,
                  padding: "16px 26px",
                  borderRadius: 999,
                  background: "#1f1a17",
                  color: "white",
                  border: "none",
                  fontSize: 17,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Valider la commande
              </button>
            </form>

            <aside
              style={{
                background: "#1f1a17",
                color: "#fffaf3",
                borderRadius: 30,
                padding: 30,
                position: "sticky",
                top: 30,
              }}
            >
              <h2 style={{ marginTop: 0 }}>Récapitulatif</h2>

              <div style={{ display: "grid", gap: 18, marginTop: 25 }}>
                {articles.map((article) => (
                  <div
                    key={article.nom}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "76px 1fr",
                      gap: 16,
                      borderBottom: "1px solid rgba(255,250,243,0.18)",
                      paddingBottom: 16,
                      alignItems: "center",
                    }}
                  >
                    <Link
                      href={
                        article.slug ? `/boutique/${article.slug}` : "/boutique"
                      }
                      style={{
                        display: "block",
                        textDecoration: "none",
                      }}
                    >
                      <div
                        style={{
                          width: 76,
                          height: 96,
                          borderRadius: 16,
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
                              fontSize: 11,
                              textAlign: "center",
                              padding: 8,
                            }}
                          >
                            Image
                          </div>
                        )}
                      </div>
                    </Link>

                    <div>
                      <h3 style={{ margin: "0 0 6px" }}>{article.nom}</h3>

                      <p style={{ margin: 0, color: "#e8dccb" }}>
                        {article.quantite} ×{" "}
                        {article.prix.toLocaleString("fr-FR")} €
                      </p>

                      <p
                        style={{
                          margin: "8px 0 0",
                          color: "#d6b36a",
                          fontWeight: "bold",
                        }}
                      >
                        {(article.prix * article.quantite).toLocaleString(
                          "fr-FR"
                        )}{" "}
                        €
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 28,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(214,179,106,0.45)",
                }}
              >
                <p style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Sous-total</span>
                  <strong>{total.toLocaleString("fr-FR")} €</strong>
                </p>

                <p style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Livraison</span>
                  <strong>Sur devis</strong>
                </p>

                <h2
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 24,
                    color: "#d6b36a",
                  }}
                >
                  <span>Total</span>
                  <span>{total.toLocaleString("fr-FR")} €</span>
                </h2>
              </div>

              <Link
                href="/panier"
                style={{
                  display: "inline-block",
                  marginTop: 24,
                  color: "#d6b36a",
                  textDecoration: "none",
                }}
              >
                ← Modifier mon panier
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #d8cbbb",
  background: "white",
  fontFamily: "Georgia, serif",
  fontSize: 16,
  color: "#1f1a17",
};