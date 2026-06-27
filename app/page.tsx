import Link from "next/link";
import NewsletterForm from "./components/NewsletterForm";

type Wine = {
  id: string;
  slug?: string | null;
  name?: string | null;
  vintage?: string | number | null;
  price?: string | number | null;
  compare_at_price?: string | number | null;
};

function parsePrice(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return 0;
  if (typeof value === "number") return value;

  const cleaned = value
    .toString()
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatPrice(value?: string | number | null) {
  const price = parsePrice(value);
  if (price <= 0) return "Prix sur demande";

  return (
    price.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € HT"
  );
}

function getDiscountInfo(wine: Wine) {
  const price = parsePrice(wine.price);
  const compareAtPrice = parsePrice(wine.compare_at_price);

  if (price <= 0 || compareAtPrice <= price) return null;

  const saving = compareAtPrice - price;
  const percent = Math.round((saving / compareAtPrice) * 100);

  return { saving, percent };
}

async function getOfferWines() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) return [];

  const url =
    `${supabaseUrl}/rest/v1/wines?select=id,slug,name,vintage,price,compare_at_price,hidden_from_site` +
    `&compare_at_price=not.is.null&order=created_at.desc&limit=24`;

  const response = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as (Wine & {
    hidden_from_site?: boolean | null;
  })[];

  return data
    .filter((wine) => wine.hidden_from_site !== true)
    .filter((wine) => getDiscountInfo(wine))
    .sort((a, b) => {
      const discountA = getDiscountInfo(a);
      const discountB = getDiscountInfo(b);
      return (discountB?.percent || 0) - (discountA?.percent || 0);
    })
    .slice(0, 3);
}

export default async function Home() {
  const offerWines = await getOfferWines();

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

        {offerWines.length > 0 && (
          <section
            style={{
              margin: "42px auto 0",
              maxWidth: 850,
              borderTop: "1px solid rgba(214,179,106,0.45)",
              borderBottom: "1px solid rgba(214,179,106,0.45)",
              padding: "22px 0",
            }}
          >
            <p
              style={{
                color: "#d6b36a",
                letterSpacing: 4,
                textTransform: "uppercase",
                fontSize: 12,
                marginBottom: 18,
              }}
            >
              Nos offres du moment
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
                textAlign: "left",
              }}
            >
              {offerWines.map((wine) => {
                const discount = getDiscountInfo(wine);
                const href = `/boutique/vin/${wine.slug || wine.id}`;

                return (
                  <Link
                    key={wine.id}
                    href={href}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "#fffaf3",
                      padding: "0 10px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 16,
                        lineHeight: 1.25,
                        marginBottom: 8,
                        color: "#fffaf3",
                      }}
                    >
                      {wine.name}
                      {wine.vintage &&
                      !String(wine.name || "").includes(String(wine.vintage))
                        ? ` ${wine.vintage}`
                        : ""}
                    </h3>

                    <p
                      style={{
                        color: "rgba(232,220,203,0.7)",
                        textDecoration: "line-through",
                        fontSize: 13,
                        marginBottom: 2,
                      }}
                    >
                      {formatPrice(wine.compare_at_price)}
                    </p>

                    <p
                      style={{
                        color: "#d6b36a",
                        fontSize: 20,
                        fontWeight: "bold",
                        marginBottom: 4,
                      }}
                    >
                      {formatPrice(wine.price)}
                    </p>

                    {discount && (
                      <p
                        style={{
                          color: "#e8dccb",
                          fontSize: 12,
                          marginBottom: 8,
                        }}
                      >
                        (-{discount.percent}%)
                      </p>
                    )}

                    <span
                      style={{
                        color: "#d6b36a",
                        fontSize: 12,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                      }}
                    >
                      Découvrir →
                    </span>
                  </Link>
                );
              })}
            </div>

            <div style={{ marginTop: 20 }}>
              <Link
                href="/offres"
                style={{
                  color: "#d6b36a",
                  textDecoration: "none",
                  fontSize: 12,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                Voir toutes les offres →
              </Link>
            </div>
          </section>
        )}

        <div
          style={{
            margin: "48px auto 0",
            maxWidth: 720,
            borderRadius: 28,
            padding: "34px 28px",
            background: "rgba(255,250,243,0.12)",
            border: "1px solid rgba(214,179,106,0.45)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            backdropFilter: "blur(8px)",
          }}
        >
          <h2
            style={{
              color: "#fffaf3",
              fontSize: 30,
              marginBottom: 12,
            }}
          >
            Recevez nos allocations et offres exclusives
          </h2>

          <p
            style={{
              color: "#e8dccb",
              fontSize: 17,
              lineHeight: 1.6,
              margin: "0 auto",
              maxWidth: 560,
            }}
          >
            Primeurs Bordeaux, Bourgognes rares, nouvelles disponibilités et
            arrivages exceptionnels.
          </p>

          <NewsletterForm />
        </div>

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