"use client";

import Link from "next/link";
import { useState } from "react";
import type { Wine } from "@/lib/wines";

type BoutiqueClientProps = {
  wines: Wine[];
};

export default function BoutiqueClient({ wines }: BoutiqueClientProps) {
  const [categorieActive, setCategorieActive] = useState("Tous");
  const [appellationActive, setAppellationActive] = useState("Toutes");

  const categories = [
    "Tous",
    ...Array.from(
      new Set([
        ...wines.map((vin) => vin.category).filter(Boolean),
        "Grands vins d’Italie",
        "Grands vins d’Espagne",
      ])
    ),
  ];

  const vinsApresCategorie =
    categorieActive === "Tous"
      ? wines
      : wines.filter((vin) => vin.category === categorieActive);

  const appellations = [
    "Toutes",
    ...Array.from(
      new Set(
        vinsApresCategorie
          .map((vin) => vin.appellation)
          .filter((appellation) => appellation && appellation.trim() !== "")
      )
    ),
  ];

  const produitsFiltres =
    appellationActive === "Toutes"
      ? vinsApresCategorie
      : vinsApresCategorie.filter(
          (vin) => vin.appellation === appellationActive
        );

  function changerCategorie(categorie: string) {
    setCategorieActive(categorie);
    setAppellationActive("Toutes");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #16080b, #2b0f16)",
        padding: "80px 30px",
        fontFamily: "Georgia, serif",
        color: "#fffaf3",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <p
          style={{
            letterSpacing: 6,
            color: "#d6b36a",
            textTransform: "uppercase",
          }}
        >
          Collection privée
        </p>

        <h1 style={{ fontSize: 64, margin: "10px 0", lineHeight: 1 }}>
          Grands Vins d’Exception
        </h1>

        <p
          style={{
            color: "#e8dccb",
            maxWidth: 620,
            fontSize: 19,
            lineHeight: 1.6,
          }}
        >
          Une sélection rare de crus prestigieux, destinée aux collectionneurs et
          amateurs de grands domaines.
        </p>

        {/* CATÉGORIES PRINCIPALES */}
        <div style={{ marginTop: 40 }}>
          <p
            style={{
              letterSpacing: 4,
              color: "#d6b36a",
              textTransform: "uppercase",
              fontSize: 13,
              marginBottom: 15,
            }}
          >
            Catégories
          </p>

          <div
            style={{
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            {categories.map((categorie) => (
              <button
                key={categorie}
                onClick={() => changerCategorie(categorie)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    categorieActive === categorie ? "#d6b36a" : "#fffaf3",
                  color: "#1f1a17",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {categorie}
              </button>
            ))}
          </div>
        </div>

        {/* SOUS-CATÉGORIES / APPELLATIONS */}
        {appellations.length > 1 && (
          <div style={{ marginTop: 32 }}>
            <p
              style={{
                letterSpacing: 4,
                color: "#d6b36a",
                textTransform: "uppercase",
                fontSize: 13,
                marginBottom: 15,
              }}
            >
              Appellations
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {appellations.map((appellation) => (
                <button
                  key={appellation}
                  onClick={() => setAppellationActive(appellation)}
                  style={{
                    padding: "9px 18px",
                    borderRadius: 999,
                    border:
                      appellationActive === appellation
                        ? "1px solid #d6b36a"
                        : "1px solid rgba(255,250,243,0.25)",
                    background:
                      appellationActive === appellation
                        ? "rgba(214,179,106,0.22)"
                        : "rgba(255,250,243,0.08)",
                    color: "#fffaf3",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {appellation}
                </button>
              ))}
            </div>
          </div>
        )}

        {produitsFiltres.length === 0 ? (
          <div
            style={{
              marginTop: 60,
              background: "rgba(255,250,243,0.08)",
              border: "1px solid rgba(214,179,106,0.3)",
              borderRadius: 28,
              padding: 30,
              color: "#e8dccb",
            }}
          >
            Aucun vin disponible actuellement dans cette sélection.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 42,
              marginTop: 60,
            }}
          >
            {produitsFiltres.map((vin) => (
              <Link
                key={vin.slug}
                href={`/boutique/${vin.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article
                  className="card-luxe"
                  style={{
                    background: "#fffaf3",
                    borderRadius: 32,
                    padding: 22,
                  }}
                >
                  <div style={{ overflow: "hidden", borderRadius: 26 }}>
                    <img
                      className="image-luxe"
                      src={vin.image}
                      alt={vin.name}
                      style={{
                        width: "100%",
                        height: 340,
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div style={{ padding: "24px 6px 6px" }}>
                    <p
                      style={{
                        color: "#9b6a24",
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        fontSize: 13,
                      }}
                    >
                      {vin.region}
                    </p>

                    <h2 style={{ fontSize: 28, color: "#1f1a17" }}>
                      {vin.name}
                    </h2>

                    {vin.appellation && (
                      <p
                        style={{
                          color: "#6e5a49",
                          fontSize: 15,
                          marginTop: -6,
                        }}
                      >
                        {vin.appellation}
                      </p>
                    )}

                    <p
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "#1f1a17",
                      }}
                    >
                      {vin.price}
                    </p>

                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 18,
                        padding: "12px 24px",
                        borderRadius: 999,
                        background: "#1f1a17",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Voir le vin
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}