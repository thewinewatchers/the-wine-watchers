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
          "linear-gradient(115deg, rgba(12,8,7,0.92), rgba(28,12,14,0.78), rgba(0,0,0,0.58)), url('/images/lafite.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        textAlign: "center",
        padding: "34px 22px 70px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto", paddingTop: 76 }}>
        <p
          style={{
            letterSpacing: 7,
            color: "#d6b36a",
            marginBottom: 22,
            textTransform: "uppercase",
            fontSize: 13,
          }}
        >
          The Wine Watchers
        </p>

        <h1
          style={{
            fontSize: "clamp(50px, 8vw, 104px)",
            color: "#fffaf3",
            lineHeight: 0.95,
            marginBottom: 30,
            textShadow: "0 18px 48px rgba(0,0,0,0.55)",
          }}
        >
          L’Excellence des
          <br />
          Grands Crus
        </h1>

        <p
          style={{
            color: "#efe2cf",
            fontSize: 22,
            lineHeight: 1.7,
            maxWidth: 760,
            margin: "0 auto 42px",
          }}
        >
          Une sélection confidentielle de vins rares et prestigieux destinée aux
          amateurs, collectionneurs et passionnés de grands terroirs.
        </p>

        <Link
          href="/boutique"
          style={{
            display: "inline-block",
            padding: "18px 38px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #f0d58a, #c39a42)",
            color: "#1f1a17",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 18,
            boxShadow: "0 18px 42px rgba(0,0,0,0.32)",
          }}
        >
          Découvrir la collection
        </Link>

        {offerWines.length > 0 && (
          <section
            style={{
              margin: "48px auto 0",
              maxWidth: 930,
              borderRadius: 28,
              border: "1px solid rgba(214,179,106,0.42)",
              padding: "26px",
              background: "rgba(20,12,10,0.56)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.38)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p
              style={{
                color: "#d6b36a",
                letterSpacing: 4,
                textTransform: "uppercase",
                fontSize: 12,
                marginBottom: 22,
              }}
            >
              Nos offres du moment
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                textAlign: "center",
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
                      padding: "22px 16px",
                      borderRadius: 20,
                      background: "rgba(255,250,243,0.08)",
                      border: "1px solid rgba(255,250,243,0.14)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 17,
                        lineHeight: 1.35,
                        marginBottom: 10,
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
                        color: "rgba(232,220,203,0.72)",
                        textDecoration: "line-through",
                        fontSize: 13,
                        marginBottom: 3,
                      }}
                    >
                      {formatPrice(wine.compare_at_price)}
                    </p>

                    <p
                      style={{
                        color: "#d6b36a",
                        fontSize: 22,
                        fontWeight: "bold",
                        marginBottom: 4,
                      }}
                    >
                      {formatPrice(wine.price)}
                    </p>

                    {discount && (
                      <p
                        style={{
                          color: "#efe2cf",
                          fontSize: 13,
                          marginBottom: 10,
                        }}
                      >
                        -{discount.percent}%
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

            <div style={{ marginTop: 22 }}>
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

        <section
          style={{
            margin: "50px auto 0",
            maxWidth: 820,
            borderRadius: 32,
            padding: "38px 30px",
            background:
              "linear-gradient(145deg, rgba(255,250,243,0.16), rgba(255,250,243,0.07))",
            border: "1px solid rgba(214,179,106,0.46)",
            boxShadow: "0 28px 80px rgba(0,0,0,0.42)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2
            style={{
              color: "#fffaf3",
              fontSize: "clamp(28px, 4vw, 38px)",
              marginBottom: 14,
              lineHeight: 1.15,
            }}
          >
            Recevez nos allocations et offres exclusives
          </h2>

          <p
            style={{
              color: "#efe2cf",
              fontSize: 17,
              lineHeight: 1.65,
              margin: "0 auto 10px",
              maxWidth: 600,
            }}
          >
            Primeurs Bordeaux, Bourgognes rares, nouvelles disponibilités et
            arrivages exceptionnels.
          </p>

          <NewsletterForm />
        </section>

        <section
          style={{
            margin: "52px auto 0",
            maxWidth: 760,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: 30,
              padding: 10,
              background: "rgba(255,250,243,0.10)",
              border: "1px solid rgba(214,179,106,0.34)",
              boxShadow: "0 28px 75px rgba(0,0,0,0.46)",
            }}
          >
            <img
              src="/images/accueil-sommelier.jpg"
              alt="Sommelier dégustant un grand vin - The Wine Watchers"
              style={{
                display: "block",
                width: "100%",
                height: "clamp(300px, 42vw, 430px)",
                borderRadius: 22,
                objectFit: "cover",
                objectPosition: "center center",
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}