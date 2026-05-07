import { Suspense } from "react";
import PanierClient from "./PanierClient";

export default function PanierPage() {
  return (
    <Suspense fallback={<PanierFallback />}>
      <PanierClient />
    </Suspense>
  );
}

function PanierFallback() {
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

        <p>Chargement du panier...</p>
      </div>
    </main>
  );
}