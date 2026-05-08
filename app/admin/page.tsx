"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { Wine } from "@/lib/wines";

type WineForm = Wine;

const emptyWine: WineForm = {
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
  keywords: [],

  producer: "",
  appellation: "",
  country: "France",
  color: "",
  grapeVarieties: [],
  classification: "",
  soil: "",
  style: "",

  description: "",
  story: "",
  tastingNotes: [],
  nose: "",
  palate: "",
  pairing: "",
  servingTemperature: "",
  agingPotential: "",
  metaContent: "",
};

export default function AdminPage() {
  const router = useRouter();

  const [wines, setWines] = useState<Wine[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [form, setForm] = useState<WineForm>(emptyWine);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const selectedWine = useMemo(() => {
    return wines.find((wine) => wine.slug === selectedSlug);
  }, [wines, selectedSlug]);

  useEffect(() => {
    verifierAccesAdmin();
  }, []);

  async function verifierAccesAdmin() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      router.push("/admin/login");
      return;
    }

    setCheckingAuth(false);
    await chargerVins();
  }

  async function seDeconnecter() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function chargerVins() {
    setLoading(true);

    const { data, error } = await supabase
      .from("wines")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      setMessage(`Erreur Supabase : ${error.message}`);
      setLoading(false);
      return;
    }

    const vinsConvertis = (data || []).map(convertirDepuisSupabase);
    setWines(vinsConvertis);

    if (vinsConvertis.length > 0 && !selectedSlug) {
      setSelectedSlug(vinsConvertis[0].slug);
      setForm(vinsConvertis[0]);
    }

    setLoading(false);
  }

  function chargerVin(slug: string) {
    const wine = wines.find((item) => item.slug === slug);

    if (!wine) return;

    setSelectedSlug(slug);
    setForm(wine);
    setMessage("");
  }

  function nouveauVin() {
    setSelectedSlug("");
    setForm(emptyWine);
    setMessage("");
  }

  function modifierChamp(champ: keyof WineForm, valeur: string) {
    setForm((ancienFormulaire) => ({
      ...ancienFormulaire,
      [champ]: valeur,
    }));
  }

  function modifierListe(champ: keyof WineForm, valeur: string) {
    const valeurs = valeur
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setForm((ancienFormulaire) => ({
      ...ancienFormulaire,
      [champ]: valeurs,
    }));
  }

  async function enregistrerVin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.slug || !form.name) {
      setMessage("Le slug et le nom du vin sont obligatoires.");
      return;
    }

    if (!form.category) {
      setMessage("La catégorie du vin est obligatoire.");
      return;
    }

    const vinSupabase = convertirVersSupabase(form);

    const { error } = await supabase
      .from("wines")
      .upsert(vinSupabase, { onConflict: "slug" });

    if (error) {
      setMessage(`Erreur lors de l’enregistrement : ${error.message}`);
      return;
    }

    setMessage("Vin enregistré dans Supabase avec succès.");
    await chargerVins();
    setSelectedSlug(form.slug);
  }

  async function supprimerVin() {
    if (!form.slug) {
      setMessage("Aucun vin sélectionné.");
      return;
    }

    const confirmation = window.confirm(
      `Supprimer définitivement ${form.name || form.slug} ?`
    );

    if (!confirmation) return;

    const { error } = await supabase
      .from("wines")
      .delete()
      .eq("slug", form.slug);

    if (error) {
      setMessage(`Erreur lors de la suppression : ${error.message}`);
      return;
    }

    setMessage("Vin supprimé de Supabase.");
    setSelectedSlug("");
    setForm(emptyWine);
    await chargerVins();
  }

  if (checkingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #16080b, #2b0f16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          color: "#fffaf3",
        }}
      >
        <p>Vérification de l’accès admin...</p>
      </main>
    );
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={kicker}>Back-office sécurisé</p>

            <h1 style={{ fontSize: 56, margin: "10px 0 18px" }}>
              Administration des vins
            </h1>

            <p
              style={{
                maxWidth: 780,
                color: "#e8dccb",
                fontSize: 18,
                lineHeight: 1.7,
                marginBottom: 35,
              }}
            >
              Cette page est protégée par Supabase Auth. Seul l’utilisateur
              admin connecté peut ajouter, modifier ou supprimer les vins.
            </p>
          </div>

          <button onClick={seDeconnecter} style={logoutButton}>
            Se déconnecter
          </button>
        </div>

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
            <button onClick={nouveauVin} style={goldButton}>
              + Ajouter un vin
            </button>

            <h2 style={{ marginTop: 24, fontSize: 24 }}>Vins Supabase</h2>

            {loading ? (
              <p style={{ color: "#e8dccb" }}>Chargement...</p>
            ) : (
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
            )}

            <Link href="/boutique" style={asideLink}>
              ← Voir la boutique
            </Link>
          </aside>

          <form
            onSubmit={enregistrerVin}
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
                  placeholder="lafite"
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

                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontWeight: "bold" }}>Catégorie</span>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      modifierChamp("category", event.target.value)
                    }
                    style={inputStyle}
                  >
                    <option value="">Choisir une catégorie</option>
                    <option value="Bordeaux">Bordeaux</option>
                    <option value="Bourgogne">Bourgogne</option>
                    <option value="Grands vins d’Italie">
                      Grands vins d’Italie
                    </option>
                    <option value="Grands vins d’Espagne">
                      Grands vins d’Espagne
                    </option>
                  </select>
                </label>

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
                />

                <Input
                  label="Appellation"
                  value={form.appellation}
                  onChange={(value) => modifierChamp("appellation", value)}
                />

                <Input
                  label="Pays"
                  value={form.country}
                  onChange={(value) => modifierChamp("country", value)}
                />

                <Input
                  label="Couleur"
                  value={form.color}
                  onChange={(value) => modifierChamp("color", value)}
                />

                <Input
                  label="Classification"
                  value={form.classification}
                  onChange={(value) => modifierChamp("classification", value)}
                />

                <Input
                  label="Style"
                  value={form.style}
                  onChange={(value) => modifierChamp("style", value)}
                />

                <Input
                  label="Sol"
                  value={form.soil}
                  onChange={(value) => modifierChamp("soil", value)}
                />

                <Input
                  label="Garde"
                  value={form.agingPotential}
                  onChange={(value) => modifierChamp("agingPotential", value)}
                />

                <Input
                  label="Température de service"
                  value={form.servingTemperature}
                  onChange={(value) =>
                    modifierChamp("servingTemperature", value)
                  }
                />

                <Input
                  label="Cépages, séparés par des virgules"
                  value={form.grapeVarieties.join(", ")}
                  onChange={(value) => modifierListe("grapeVarieties", value)}
                />
              </div>

              <Textarea
                label="Description courte"
                value={form.description}
                onChange={(value) => modifierChamp("description", value)}
              />

              <Textarea
                label="Histoire du vin"
                value={form.story}
                onChange={(value) => modifierChamp("story", value)}
              />

              <Textarea
                label="Meta contenu visible"
                value={form.metaContent}
                onChange={(value) => modifierChamp("metaContent", value)}
              />
            </section>

            <section>
              <p style={sectionLabel}>Dégustation</p>

              <Input
                label="Notes, séparées par des virgules"
                value={form.tastingNotes.join(", ")}
                onChange={(value) => modifierListe("tastingNotes", value)}
              />

              <Textarea
                label="Nez"
                value={form.nose}
                onChange={(value) => modifierChamp("nose", value)}
              />

              <Textarea
                label="Bouche"
                value={form.palate}
                onChange={(value) => modifierChamp("palate", value)}
              />

              <Textarea
                label="Accords mets-vins"
                value={form.pairing}
                onChange={(value) => modifierChamp("pairing", value)}
              />
            </section>

            <section>
              <p style={sectionLabel}>Référencement naturel</p>

              <Input
                label="Titre SEO Google"
                value={form.seoTitle}
                onChange={(value) => modifierChamp("seoTitle", value)}
              />

              <Textarea
                label="Meta description SEO"
                value={form.seoDescription}
                onChange={(value) => modifierChamp("seoDescription", value)}
              />

              <Input
                label="Mots-clés, séparés par des virgules"
                value={form.keywords.join(", ")}
                onChange={(value) => modifierListe("keywords", value)}
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

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button type="submit" style={darkButton}>
                Enregistrer dans Supabase
              </button>

              {form.slug && (
                <Link href={`/boutique/${form.slug}`} style={goldLinkButton}>
                  Voir la fiche vin
                </Link>
              )}

              {selectedWine && (
                <button
                  type="button"
                  onClick={supprimerVin}
                  style={dangerButton}
                >
                  Supprimer ce vin
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function convertirDepuisSupabase(vin: any): Wine {
  return {
    slug: vin.slug || "",
    name: vin.name || "",
    region: vin.region || "",
    vintage: vin.vintage || "",
    price: vin.price || "",
    image: vin.image || "",
    category: vin.category || "",
    rating: vin.rating || "",

    seoTitle: vin.seo_title || "",
    seoDescription: vin.seo_description || "",
    keywords: vin.keywords || [],

    producer: vin.producer || "",
    appellation: vin.appellation || "",
    country: vin.country || "",
    color: vin.color || "",
    grapeVarieties: vin.grape_varieties || [],
    classification: vin.classification || "",
    soil: vin.soil || "",
    style: vin.style || "",

    description: vin.description || "",
    story: vin.story || "",
    tastingNotes: vin.tasting_notes || [],
    nose: vin.nose || "",
    palate: vin.palate || "",
    pairing: vin.pairing || "",
    servingTemperature: vin.serving_temperature || "",
    agingPotential: vin.aging_potential || "",
    metaContent: vin.meta_content || "",
  };
}

function convertirVersSupabase(vin: Wine) {
  return {
    slug: vin.slug,
    name: vin.name,
    region: vin.region,
    vintage: vin.vintage,
    price: vin.price,
    image: vin.image,
    category: vin.category,
    rating: vin.rating,

    seo_title: vin.seoTitle,
    seo_description: vin.seoDescription,
    keywords: vin.keywords,

    producer: vin.producer,
    appellation: vin.appellation,
    country: vin.country,
    color: vin.color,
    grape_varieties: vin.grapeVarieties,
    classification: vin.classification,
    soil: vin.soil,
    style: vin.style,

    description: vin.description,
    story: vin.story,
    tasting_notes: vin.tastingNotes,
    nose: vin.nose,
    palate: vin.palate,
    pairing: vin.pairing,
    serving_temperature: vin.servingTemperature,
    aging_potential: vin.agingPotential,
    meta_content: vin.metaContent,
  };
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
        style={{ ...inputStyle, resize: "vertical" }}
      />
    </label>
  );
}

const kicker: React.CSSProperties = {
  letterSpacing: 5,
  textTransform: "uppercase",
  color: "#d6b36a",
  fontSize: 13,
};

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
};

const goldButton: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: 999,
  border: "none",
  background: "#d6b36a",
  color: "#1f1a17",
  fontWeight: "bold",
  cursor: "pointer",
};

const darkButton: React.CSSProperties = {
  padding: "15px 26px",
  borderRadius: 999,
  border: "none",
  background: "#1f1a17",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const dangerButton: React.CSSProperties = {
  padding: "15px 26px",
  borderRadius: 999,
  border: "none",
  background: "#8b0000",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const logoutButton: React.CSSProperties = {
  padding: "13px 22px",
  borderRadius: 999,
  border: "1px solid rgba(214,179,106,0.45)",
  background: "rgba(255,250,243,0.08)",
  color: "#fffaf3",
  fontWeight: "bold",
  cursor: "pointer",
};

const goldLinkButton: React.CSSProperties = {
  padding: "15px 26px",
  borderRadius: 999,
  background: "#d6b36a",
  color: "#1f1a17",
  textDecoration: "none",
  fontWeight: "bold",
};

const asideLink: React.CSSProperties = {
  display: "inline-block",
  marginTop: 24,
  color: "#d6b36a",
  textDecoration: "none",
};