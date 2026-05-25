export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('/images/lafite.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        textAlign: "center",
        padding: "40px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ maxWidth: 850, margin: "0 auto", paddingTop: 90 }}>
        <p
          style={{
            letterSpacing: 6,
            color: "#d6b36a",
            marginBottom: 20,
            textTransform: "uppercase",
          }}
        >
          The Wine Watchers
        </p>

        <h1
          style={{
            fontSize: "clamp(52px, 8vw, 96px)",
            color: "#fffaf3",
            lineHeight: 1,
            marginBottom: 30,
          }}
        >
          L’Excellence des
          <br />
          Grands Crus
        </h1>

        <p
          style={{
            color: "#e8dccb",
            fontSize: 22,
            lineHeight: 1.7,
            maxWidth: 700,
            margin: "0 auto 40px",
          }}
        >
          Une sélection confidentielle de vins rares et prestigieux destinée aux
          amateurs, investisseurs et collectionneurs.
        </p>

        <a
          href="/boutique"
          style={{
            display: "inline-block",
            padding: "18px 36px",
            borderRadius: 999,
            background: "#d6b36a",
            color: "#1f1a17",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Découvrir la collection
        </a>

        <div
          style={{
            marginTop: 42,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/images/accueil-sommelier.jpg"
            alt="Sommelier dégustant un grand vin - The Wine Watchers"
            style={{
              width: "100%",
              maxWidth: 620,
              height: 340,
              borderRadius: 24,
              boxShadow: "0 24px 60px rgba(0,0,0,0.40)",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>
      </div>
    </main>
  );
}