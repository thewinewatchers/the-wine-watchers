"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { wines } from "@/data/wines";

type WineForm = {
  slug: string;
  name: string;
  region: string;
  vintage: string;
  price: string;
  image: string;
  category: string;
  rating: string;
  seoTitle: string;
  seoDescription: string;
  producer: string;
  appellation: string;
  country: string;
  color: string;
  classification: string;
  style: string;
  description: string;
};

export default function AdminPage() {
  const [selectedSlug, setSelectedSlug] = useState(wines[0]?.slug || "");
  const [message, setMessage] = useState("");

  const selectedWine = useMemo(() => {
    return wines.find((wine) => wine.slug === selectedSlug) || wines[0];
  }, [selectedSlug]);

  const [form, setForm] = useState<WineForm>({
    slug: selectedWine?.slug || "",
    name: selectedWine?.name || "",
    region: selectedWine?.region || "",
    vintage: selectedWine?.vintage || "",
    price: selectedWine?.price || "",
    image: selectedWine?.image || "",
    category: selectedWine?.category || "",
    rating: selectedWine?.rating || "",
    seoTitle: selectedWine?.seoTitle || "",
    seoDescription: selectedWine?.seoDescription || "",
    producer: selectedWine?.producer || "",
    appellation: selectedWine?.appellation || "",
    country: selectedWine?.country || "",
    color: selectedWine?.color || "",
    classification: selectedWine?.classification || "",
    style: selectedWine?.style || "",
    description: selectedWine?.description || "",
  });

  function chargerVin(slug: string) {
    const wine = wines.find((item) => item.slug === slug);

    if (!wine) return;

    setSelectedSlug(slug);
    setMessage("");

    setForm({
      slug: wine.slug,
      name: wine.name,
      region: wine.region,
      vintage: wine.vintage,
      price: wine.price,
      image: wine.image,
      category: wine.category,
      rating: wine.rating,
      seoTitle: wine.seoTitle,
      seoDescription: wine.seoDescription,
      producer: wine.producer,
      appellation: wine.appellation,
      country: wine.country,
      color: wine.color,
      classification: wine.classification,
      style: wine.style,
      description: wine.description,
    });
  }

  function modifierChamp(champ: keyof WineForm, valeur: string) {
    setForm((ancienFormulaire) => ({
      ...ancienFormulaire,
      [champ]: valeur,
    }));
  }

  function enregistrerPrototype(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const vinsAdmin = JSON.parse(localStorage.getItem("vins-admin") || "[]");
    const autresVins = vinsAdmin.filter((vin: WineForm) => vin.slug !== form.slug);
    const nouveauStockage = [...autresVins, form];

    localStorage.setItem("vins-admin", JSON.stringify(nouveauStockage));

    setMessage(
      "Prototype enregistré dans ce navigateur. Pour un vrai site, il faudra connecter cette page à Supabase ou une autre base de données."
    );
  }

  function nouveauVin() {
    setSelectedSlug("");

    setForm({
      slug: "",
      name: "",
      region: "",
      vintage: "",
      price: "",
      image: "/images/",
      category: "",
      rating: "",
      seoTitle: "",
      seoDescription: "",
      producer: "",
      appellation: "",
      country: "France",
      color: "",
      classification: "",
      style: "",
      description: "",
    });

    setMessage("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #16080b, #2b0f16)",
        padding: "70px 30px",
        fontFamily: "Georgia, serif",
        color: "#fffaf3",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p
          style={{
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#d6b36a",
            fontSize: 13,
          }}
        >
          Back-office
        </p>

        <h1 style={{ fontSize: 56, margin: "10px 0 18px" }}>
          Administration des vins
        </h1>

        <p
          style={{
            maxWidth: 760,
            color: "#e8dccb",
            fontSize: 18,
            lineHeight: 1.7,
            marginBottom: 35,
          }}
        >
          Cette première version permet de préparer l’interface de gestion des
          vins, des contenus SEO et des informations produit. Les modifications
          sont sauvegardées uniquement dans le navigateur pour le moment.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 340px) 1fr",
            gap: 30,
            alignItems: "start",
          }}
        >
          <aside
            style={{
              background: "rgba(255,250,243,0.08)",
              border: "1px solid rgba(214,179,106,0.3)",
              borderRadius: 30,
              padding: 24,
            }}
          >
            <button
              onClick={nouveauVin}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: 999,
                border: "none",
                background: "#d6b36a",
                color: "#1f1a17",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: 22,
              }}
            >
              + Ajouter un vin
            </button>

            <h2 style={{ marginTop: 0, fontSize: 24 }}>Vins existants</h2>

            <div style={{ display: "grid", gap: 12 }}>
              {wines.map((wine) => (
                <button
                  key={wine.slug}
                  onClick={() => chargerVin(wine.slug)}
                  style={{
                    textAlign: "left",
                    padding: 14,
                    borderRadius: 18,
                    border:
                      selectedSlug === wine.slug
                        ? "1px solid #d6b36a"
                        : "1px solid rgba(255,250,243,0.15)",
                    background:
                      selectedSlug === wine.slug
                        ? "rgba(214,179,106,0.18)"
                        : "rgba(255,250,243,0.06)",
                    color: "#fffaf3",
                    cursor: "pointer",
                  }}
                >
                  <strong>{wine.name}</strong>
                  <br />
                  <span style={{ color: "#e8dccb", fontSize: 14 }}>
                    {wine.region} · {wine.vintage}
                  </span>
                </button>
              ))}
            </div>

            <Link
              href="/boutique"
              style={{
                display: "inline-block",
                marginTop: 24,
                color: "#d6b36a",
                textDecoration: "none",
              }}
            >
              ← Voir la boutique
            </Link>
          </aside>

          <form
            onSubmit={enregistrerPrototype}
            style={{
              background: "#fffaf3",
              color: "#1f1a17",
              borderRadius: 34,
              padding: 30,
              display: "grid",
              gap: 26,
            }}
          >
            <section>
              <p style={sectionLabel}>Produit</p>

              <div style={gridTwo}>
                <Input
                  label="Slug URL"
                  value={form.slug}
                  onChange={(value) => modifierChamp("slug", value)}
                  placeholder="exemple : lafite"
                />

                <Input
                  label="Nom du vin"
                  value={form.name}
                  onChange={(value) => modifierChamp("name", value)}
                  placeholder="Château Lafite Rothschild"
                />

                <Input
                  label="Région"
                  value={form.region}
                  onChange={(value) => modifierChamp("region", value)}
                  placeholder="Pauillac, Bordeaux"
                />

                <Input
                  label="Millésime"
                  value={form.vintage}
                  onChange={(value) => modifierChamp("vintage", value)}
                  placeholder="2018"
                />

                <Input
                  label="Prix"
                  value={form.price}
                  onChange={(value) => modifierChamp("price", value)}
                  placeholder="950 €"
                />

                <Input
                  label="Image"
                  value={form.image}
                  onChange={(value) => modifierChamp("image", value)}
                  placeholder="/images/lafite.jpg"
                />

                <Input
                  label="Catégorie"
                  value={form.category}
                  onChange={(value) => modifierChamp("category", value)}
                  placeholder="Bordeaux"
                />

                <Input
                  label="Note"
                  value={form.rating}
                  onChange={(value) => modifierChamp("rating", value)}
                  placeholder="98/100"
                />
              </div>
            </section>

            <section>
              <p style={sectionLabel}>Informations vin</p>

              <div style={gridTwo}>
                <Input
                  label="Domaine"
                  value={form.producer}
                  onChange={(value) => modifierChamp("producer", value)}
                  placeholder="Château Lafite Rothschild"
                />

                <Input
                  label="Appellation"
                  value={form.appellation}
                  onChange={(value) => modifierChamp("appellation", value)}
                  placeholder="Pauillac"
                />

                <Input
                  label="Pays"
                  value={form.country}
                  onChange={(value) => modifierChamp("country", value)}
                  placeholder="France"
                />

                <Input
                  label="Couleur"
                  value={form.color}
                  onChange={(value) => modifierChamp("color", value)}
                  placeholder="Rouge"
                />

                <Input
                  label="Classification"
                  value={form.classification}
                  onChange={(value) => modifierChamp("classification", value)}
                  placeholder="Premier Grand Cru Classé"
                />

                <Input
                  label="Style"
                  value={form.style}
                  onChange={(value) => modifierChamp("style", value)}
                  placeholder="Grand rouge de garde"
                />
              </div>

              <Textarea
                label="Description courte"
                value={form.description}
                onChange={(value) => modifierChamp("description", value)}
                placeholder="Description visible sur la fiche vin..."
              />
            </section>

            <section>
              <p style={sectionLabel}>Référencement naturel</p>

              <Input
                label="Titre SEO Google"
                value={form.seoTitle}
                onChange={(value) => modifierChamp("seoTitle", value)}
                placeholder="Château Lafite Rothschild 2018 | Grand vin de Pauillac"
              />

              <Textarea
                label="Meta description SEO"
                value={form.seoDescription}
                onChange={(value) => modifierChamp("seoDescription", value)}
                placeholder="Description optimisée pour les résultats Google..."
              />
            </section>

            {form.image && (
              <section>
                <p style={sectionLabel}>Aperçu</p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "130px 1fr",
                    gap: 18,
                    alignItems: "center",
                    background: "#f4efe7",
                    borderRadius: 22,
                    padding: 18,
                  }}
                >
                  <div
                    style={{
                      width: 130,
                      height: 160,
                      borderRadius: 18,
                      overflow: "hidden",
                      background: "#e5dccf",
                    }}
                  >
                    <img
                      src={form.image}
                      alt={form.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div>
                    <h3 style={{ margin: "0 0 8px" }}>
                      {form.name || "Nom du vin"}
                    </h3>
                    <p style={{ margin: "0 0 6px", color: "#6e5a49" }}>
                      {form.region || "Région"} · {form.vintage || "Millésime"}
                    </p>
                    <strong>{form.price || "Prix"}</strong>
                  </div>
                </div>
              </section>
            )}

            {message && (
              <p
                style={{
                  background: "#efe4d5",
                  borderRadius: 18,
                  padding: 16,
                  color: "#4a3b32",
                  lineHeight: 1.6,
                }}
              >
                {message}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "15px 26px",
                  borderRadius: 999,
                  border: "none",
                  background: "#1f1a17",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Enregistrer le prototype
              </button>

              {form.slug && (
                <Link
                  href={`/boutique/${form.slug}`}
                  style={{
                    padding: "15px 26px",
                    borderRadius: 999,
                    background: "#d6b36a",
                    color: "#1f1a17",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Voir la fiche vin
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontWeight: "bold" }}>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 8, marginTop: 18 }}>
      <span style={{ fontWeight: "bold" }}>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          ...inputStyle,
          resize: "vertical",
        }}
      />
    </label>
  );
}

const gridTwo: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 18,
};

const sectionLabel: React.CSSProperties = {
  margin: "0 0 16px",
  color: "#9b6a24",
  letterSpacing: 4,
  textTransform: "uppercase",
  fontSize: 13,
  fontWeight: "bold",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 15px",
  borderRadius: 15,
  border: "1px solid #d8cbbb",
  background: "white",
  color: "#1f1a17",
  fontFamily: "Georgia, serif",
  fontSize: 15,
}