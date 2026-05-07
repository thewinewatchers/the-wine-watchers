import Link from "next/link";

export default function MentionsLegalesPage() {
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
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p
          style={{
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#9b6a24",
            fontSize: 13,
          }}
        >
          Informations légales
        </p>

        <h1 style={{ fontSize: 52, margin: "10px 0 30px" }}>
          Mentions légales
        </h1>

        <section
          style={{
            background: "#fffaf3",
            border: "1px solid #e5dccf",
            borderRadius: 28,
            padding: 32,
            lineHeight: 1.8,
          }}
        >
          <h2>Éditeur du site</h2>
          <p>
            Le site <strong>The Wine Watchers</strong> est édité par The Wine
            Watchers.
          </p>

          <p>
            Adresse : à compléter
            <br />
            Email : contact@thewinewatchers.com
            <br />
            Téléphone : à compléter
          </p>

          <h2>Directeur de la publication</h2>
          <p>À compléter.</p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc.
            <br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus présents sur ce site, notamment les textes,
            images, éléments graphiques, logo et structure, est protégé par le
            droit de la propriété intellectuelle. Toute reproduction ou
            utilisation non autorisée est interdite.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les informations transmises via les formulaires du site sont
            utilisées uniquement pour traiter les demandes des utilisateurs et
            les commandes. Elles ne sont pas revendues à des tiers.
          </p>

          <h2>Cookies</h2>
          <p>
            Le site peut utiliser des cookies nécessaires à son bon
            fonctionnement, notamment pour la gestion du panier.
          </p>

          <h2>Vente d’alcool</h2>
          <p>
            La vente de boissons alcoolisées est réservée aux personnes majeures
            selon la législation en vigueur dans leur pays de résidence. L’abus
            d’alcool est dangereux pour la santé, à consommer avec modération.
          </p>

          <p style={{ marginTop: 30, color: "#6e5a49" }}>
            Dernière mise à jour : 2026
          </p>
        </section>

        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: 30,
            color: "#9b6a24",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}