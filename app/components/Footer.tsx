export default function Footer() {
  return (
    <footer
      style={{
        background: "#120609",
        color: "#e8dccb",
        padding: "50px 40px",
        fontFamily: "Georgia, serif",
        borderTop: "1px solid #3a1a20",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 35,
        }}
      >
        <div>
          <h2 style={{ color: "#d6b36a" }}>The Wine Watchers</h2>
          <p>Grands vins, crus rares et sélections confidentielles.</p>
        </div>

        <div>
          <h3 style={{ color: "#d6b36a" }}>Navigation</h3>
          <p><a href="/" style={{ color: "#e8dccb" }}>Accueil</a></p>
          <p><a href="/boutique" style={{ color: "#e8dccb" }}>Boutique</a></p>
          <p><a href="/a-propos" style={{ color: "#e8dccb" }}>À propos</a></p>
        </div>

        <div>
          <h3 style={{ color: "#d6b36a" }}>Informations</h3>
          <p><a href="/livraison" style={{ color: "#e8dccb" }}>Livraison</a></p>
          <p><a href="/contact" style={{ color: "#e8dccb" }}>Contact</a></p>
          <p><a href="/mentions-legales" style={{ color: "#e8dccb" }}>Mentions légales</a></p>
        </div>

        <div>
          <h3 style={{ color: "#d6b36a" }}>Contact</h3>
          <p>contact@thewinewatchers.com</p>
          <p>+34 600 000 000</p>
          <p>Espagne</p>
        </div>
      </div>

      <p
        style={{
          marginTop: 40,
          textAlign: "center",
          color: "#9b8c7a",
          fontSize: 14,
        }}
      >
        © The Wine Watchers SL — Tous droits réservés
      </p>
    </footer>
  );
}