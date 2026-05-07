import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWineBySlug } from "@/lib/wines";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wine = await getWineBySlug(slug);

  if (!wine) {
    return {
      title: "Vin introuvable | The Wine Watchers",
      description: "Cette bouteille n’est pas disponible actuellement.",
    };
  }

  return {
    title: wine.seoTitle,
    description: wine.seoDescription,
    keywords: wine.keywords,
    openGraph: {
      title: wine.seoTitle,
      description: wine.seoDescription,
      type: "website",
      images: [
        {
          url: wine.image,
          width: 1200,
          height: 900,
          alt: wine.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const wine = await getWineBySlug(slug);

  if (!wine) {
    notFound();
  }

  const prixPanier = wine.price.replace(/\D/g, "");

  const lienPanier = `/panier?nom=${encodeURIComponent(
    wine.name
  )}&prix=${prixPanier}&image=${encodeURIComponent(
    wine.image
  )}&slug=${encodeURIComponent(wine.slug)}`;

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
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 60,
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fffaf3",
              borderRadius: 36,
              padding: 24,
              boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
            }}
          >
            <img
              src={wine.image}
              alt={wine.name}
              style={{
                width: "100%",
                height: 560,
                objectFit: "cover",
                borderRadius: 28,
              }}
            />
          </div>

          <section>
            <Link
              href="/boutique"
              style={{
                color: "#d6b36a",
                textDecoration: "none",
                fontSize: 15,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              ← Retour à la boutique
            </Link>

            <p
              style={{
                marginTop: 35,
                color: "#d6b36a",
                letterSpacing: 5,
                textTransform: "uppercase",
                fontSize: 14,
              }}
            >
              {wine.region} · {wine.vintage}
            </p>

            <h1
              style={{
                fontSize: 58,
                lineHeight: 1,
                margin: "18px 0",
              }}
            >
              {wine.name}
            </h1>

            <p
              style={{
                fontSize: 22,
                color: "#e8dccb",
                lineHeight: 1.7,
                maxWidth: 620,
              }}
            >
              {wine.description}
            </p>

            <div
              style={{
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
                marginTop: 30,
              }}
            >
              <span style={badgeGold}>Note {wine.rating}</span>
              <span style={badgeDark}>{wine.category}</span>
              <span style={badgeDark}>{wine.classification}</span>
            </div>

            <p
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: "#d6b36a",
                marginTop: 35,
              }}
            >
              {wine.price}
            </p>

            <Link
              href={lienPanier}
              style={{
                display: "inline-block",
                marginTop: 10,
                padding: "16px 34px",
                borderRadius: 999,
                background: "#fffaf3",
                color: "#1f1a17",
                fontWeight: "bold",
                fontSize: 16,
                textDecoration: "none",
              }}
            >
              Ajouter au panier
            </Link>
          </section>
        </section>

        <section
          style={{
            marginTop: 80,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          <InfoCard title="Domaine" value={wine.producer} />
          <InfoCard title="Appellation" value={wine.appellation} />
          <InfoCard title="Pays" value={wine.country} />
          <InfoCard title="Couleur" value={wine.color} />
          <InfoCard title="Cépages" value={wine.grapeVarieties.join(", ")} />
          <InfoCard title="Sol" value={wine.soil} />
          <InfoCard title="Style" value={wine.style} />
          <InfoCard title="Garde" value={wine.agingPotential} />
        </section>

        <section
          style={{
            marginTop: 70,
            background: "rgba(255,250,243,0.08)",
            border: "1px solid rgba(214,179,106,0.35)",
            borderRadius: 36,
            padding: 36,
          }}
        >
          <p
            style={{
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#d6b36a",
              fontSize: 13,
              marginTop: 0,
            }}
          >
            Histoire du vin
          </p>

          <h2 style={{ fontSize: 40, marginTop: 10 }}>
            {wine.name} {wine.vintage}
          </h2>

          <p
            style={{
              color: "#e8dccb",
              fontSize: 19,
              lineHeight: 1.8,
              maxWidth: 900,
            }}
          >
            {wine.story}
          </p>

          <p
            style={{
              color: "#e8dccb",
              fontSize: 18,
              lineHeight: 1.8,
              maxWidth: 900,
            }}
          >
            {wine.metaContent}
          </p>
        </section>

        <section
          style={{
            marginTop: 50,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          <TextCard title="Notes de dégustation">
            {wine.tastingNotes.join(" · ")}
          </TextCard>

          <TextCard title="Nez">{wine.nose}</TextCard>

          <TextCard title="Bouche">{wine.palate}</TextCard>

          <TextCard title="Accords mets-vins">{wine.pairing}</TextCard>

          <TextCard title="Température de service">
            {wine.servingTemperature}
          </TextCard>

          <TextCard title="Potentiel de garde">
            {wine.agingPotential}
          </TextCard>
        </section>

        <section
          style={{
            marginTop: 70,
            padding: 36,
            borderRadius: 36,
            background: "#fffaf3",
            color: "#1f1a17",
            textAlign: "center",
          }}
        >
          <p
            style={{
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#9b6a24",
              fontSize: 13,
            }}
          >
            Sélection The Wine Watchers
          </p>

          <h2 style={{ fontSize: 38, margin: "10px 0" }}>
            Une bouteille pensée pour les grands moments
          </h2>

          <p
            style={{
              maxWidth: 760,
              margin: "0 auto",
              lineHeight: 1.7,
              fontSize: 18,
              color: "#4a3b32",
            }}
          >
            Cette fiche présente les informations clés du vin, son identité, son
            profil de dégustation et ses qualités de garde, afin d’aider les
            amateurs et collectionneurs à choisir une bouteille d’exception.
          </p>

          <Link
            href={lienPanier}
            style={{
              display: "inline-block",
              marginTop: 28,
              padding: "15px 30px",
              borderRadius: 999,
              background: "#1f1a17",
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Ajouter cette bouteille au panier
          </Link>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "#fffaf3",
        color: "#1f1a17",
        borderRadius: 26,
        padding: 24,
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: "#9b6a24",
          letterSpacing: 3,
          textTransform: "uppercase",
          fontSize: 12,
        }}
      >
        {title}
      </p>

      <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5 }}>{value}</p>
    </div>
  );
}

function TextCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(255,250,243,0.08)",
        border: "1px solid rgba(214,179,106,0.28)",
        borderRadius: 28,
        padding: 26,
      }}
    >
      <h3 style={{ color: "#d6b36a", marginTop: 0 }}>{title}</h3>

      <p style={{ color: "#e8dccb", lineHeight: 1.7, marginBottom: 0 }}>
        {children}
      </p>
    </div>
  );
}

const badgeGold: React.CSSProperties = {
  padding: "12px 20px",
  borderRadius: 999,
  background: "#d6b36a",
  color: "#1f1a17",
  fontWeight: "bold",
};

const badgeDark: React.CSSProperties = {
  padding: "12px 20px",
  borderRadius: 999,
  background: "rgba(255,250,243,0.12)",
  color: "#fffaf3",
};