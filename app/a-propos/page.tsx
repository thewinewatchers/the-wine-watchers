export default function APropos() {
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
      <section style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ letterSpacing: 6, color: "#d6b36a" }}>
          THE WINE WATCHERS
        </p>

        <h1 style={{ fontSize: 64, margin: "20px 0" }}>
          À propos
        </h1>

        <p style={{ fontSize: 20, lineHeight: 1.8, color: "#e8dccb" }}>
          The Wine Watchers SL sélectionne des grands vins, crus rares et flacons
          d’exception pour les amateurs, collectionneurs et caves privées.
        </p>

        <p style={{ fontSize: 20, lineHeight: 1.8, color: "#e8dccb" }}>
          Notre approche repose sur la discrétion, la qualité de provenance et
          une sélection exigeante de domaines iconiques.
        </p>

        <a
          href="/boutique"
          style={{
            display: "inline-block",
            marginTop: 35,
            padding: "15px 30px",
            borderRadius: 999,
            background: "#d6b36a",
            color: "#1f1a17",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Découvrir la boutique
        </a>
      </section>
    </main>
  );
}