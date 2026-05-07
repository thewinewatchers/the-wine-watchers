export default function Contact() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4efe7",
        padding: "60px 30px",
        fontFamily: "Georgia, serif",
        color: "#1f1a17",
      }}
    >
      <section style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ letterSpacing: 4, color: "#9b6a24" }}>
          THE WINE WATCHERS
        </p>

        <h1 style={{ fontSize: 52 }}>Contact</h1>

        <p style={{ color: "#6b625a", fontSize: 18 }}>
          Pour toute demande concernant nos grands vins, disponibilités ou commandes privées.
        </p>

        <div
          style={{
            marginTop: 40,
            background: "#fffaf3",
            padding: 30,
            borderRadius: 20,
            border: "1px solid #e5dccf",
          }}
        >
          <h2>Nous contacter</h2>

          <p>Email : contact@thewinewatchers.com</p>
          <p>Téléphone / WhatsApp : +34 600 000 000</p>
          <p>Adresse : Espagne</p>

          <a
            href="https://wa.me/34600000000"
            target="_blank"
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
            Contacter sur WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}