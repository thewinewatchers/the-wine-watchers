"use client";

import Link from "next/link";
import { useState } from "react";
import type { Wine } from "@/lib/wines";

type BoutiqueClientProps = {
  wines: Wine[];
};

export default function BoutiqueClient({ wines }: BoutiqueClientProps) {
  const [categorieActive, setCategorieActive] = useState("Tous");

  const categories = ["Tous", "Bordeaux", "Bourgogne", "Grands vins d’Italie"];

  const produitsFiltres =
    categorieActive === "Tous"
      ? wines
      : wines.filter((vin) => vin.category === categorieActive);

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

        <div
          style={{
            display: "flex",
            gap: 18,
            marginTop: 35,
            flexWrap: "wrap",
          }}
        >
          {categories.map((categorie) => (
            <button
              key={categorie}
              onClick={() => setCategorieActive(categorie)}
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
      </div>
    </main>
  );
}