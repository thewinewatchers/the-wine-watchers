"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type WineForm = {
  slug: string;
  name: string;
  producer: string;
  region: string;
  appellation: string;
  country: string;
  color: string;
  vintage: string;
  price: string;
  stock: string;
  bottle_size: string;
  packaging: string;
  image: string;
  category: string;
  rating: string;
  seo_title: string;
  seo_description: string;
  keywords: string;
  grape_varieties: string;
  classification: string;
  soil: string;
  style: string;
  description: string;
  story: string;
  tasting_notes: string;
  nose: string;
  palate: string;
  pairing: string;
  serving_temperature: string;
  aging_potential: string;
  meta_content: string;
  external_links: string;
};

const emptyForm: WineForm = {
  slug: "",
  name: "",
  producer: "",
  region: "",
  appellation: "",
  country: "",
  color: "",
  vintage: "",
  price: "",
  stock: "",
  bottle_size: "",
  packaging: "",
  image: "",
  category: "",
  rating: "",
  seo_title: "",
  seo_description: "",
  keywords: "",
  grape_varieties: "",
  classification: "",
  soil: "",
  style: "",
  description: "",
  story: "",
  tasting_notes: "",
  nose: "",
  palate: "",
  pairing: "",
  serving_temperature: "",
  aging_potential: "",
  meta_content: "",
  external_links: "",
};

const categoryOptions = [
  "Bordeaux",
  "Bourgogne",
  "Primeurs 2025",
  "Rhône",
  "Grands vins d’Italie",
  "Espagne",
  "USA",
];

const bordeauxAppellations = [
  "Pauillac",
  "Margaux",
  "Saint-Julien",
  "Saint-Estèphe",
  "Pomerol",
  "Saint-Émilion",
  "Pessac-Léognan",
  "Sauternes",
];

const bourgogneDomains = [
  "Domaine de la Romanée-Conti",
  "Armand Rousseau",
  "Comte Georges de Vogüé",
  "Clos de Tart",
  "Clos des Lambrays",
  "Georges Roumier",
  "Mugnier",
  "Liger-Belair",
  "Comte Liger-Belair",
  "Pierre-Yves Colin-Morey",
  "Ponsot",
  "Fourrier",
  "Anne Gros",
  "Domaine Leroy",
  "Domaine Leflaive",
  "Domaine Dujac",
  "Domaine Trapet",
  "Louis Jadot",
  "Bouchard Père & Fils",
  "Faiveley",
  "Jacques Prieur",
  "Méo-Camuzet",
  "Coche-Dury",
  "Raveneau",
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseTextArray(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  return "";
}

function parsePrice(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return "";
  return String(parsed);
}

function cleanText(value: unknown) {
  return String(value || "").trim() || null;
}

function parseNumber(value: string) {
  if (!value.trim()) return null;
  const cleaned = value.replace(/\s/g, "").replace(",", ".");
  const numberValue = Number(cleaned);
  return Number.isNaN(numberValue) ? null : numberValue;
}

function parseStock(value: string) {
  if (!value.trim()) return 0;
  const cleaned = value.replace(/\s/g, "").replace(",", ".");
  const numberValue = Number(cleaned);
  if (Number.isNaN(numberValue)) return 0;
  return Math.max(0, Math.floor(numberValue));
}

export default function AdminEditWinePage() {
  const params = useParams();
  const wineId = String(params.id || "");

  const [form, setForm] = useState<WineForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const previewSlug = useMemo(() => {
    if (form.slug.trim()) return createSlug(form.slug);
    return createSlug(`${form.name}-${form.vintage}`);
  }, [form.slug, form.name, form.vintage]);

  useEffect(() => {
    async function loadWine() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("wines")
        .select("*")
        .eq("id", wineId)
        .maybeSingle();

      if (error) {
        setErrorMessage("Impossible de charger ce vin.");
        setLoading(false);
        return;
      }

      if (!data) {
        setErrorMessage("Vin introuvable.");
        setLoading(false);
        return;
      }

      setForm({
        slug: data.slug || "",
        name: data.name || "",
        producer: data.producer || "",
        region: data.region || "",
        appellation: data.appellation || "",
        country: data.country || "",
        color: data.color || "",
        vintage: data.vintage || "",
        price: parsePrice(data.price),
        stock: String(data.stock ?? ""),
        bottle_size: data.bottle_size || "",
        packaging: data.packaging || "",
        image: data.image || "",
        category: data.category || "",
        rating: parsePrice(data.rating),
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
        keywords: parseTextArray(data.keywords),
        grape_varieties: parseTextArray(data.grape_varieties),
        classification: data.classification || "",
        soil: data.soil || "",
        style: data.style || "",
        description: parseTextArray(data.description),
        story: parseTextArray(data.story),
        tasting_notes: parseTextArray(data.tasting_notes),
        nose: parseTextArray(data.nose),
        palate: parseTextArray(data.palate),
        pairing: parseTextArray(data.pairing),
        serving_temperature: parseTextArray(data.serving_temperature),
        aging_potential: parseTextArray(data.aging_potential),
        meta_content: parseTextArray(data.meta_content),
        external_links: data.external_links || "",
      });

      setLoading(false);
    }

    if (wineId) loadWine();
  }, [wineId]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;

    setForm((previous) => ({
      ...previous,
      category: value,
      region:
        value === "Bordeaux" || value === "Primeurs 2025"
          ? "Bordeaux"
          : value === "Bourgogne"
          ? "Bourgogne"
          : previous.region,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const slug = previewSlug;
    const parsedStock = parseStock(form.stock);

    if (!form.name.trim()) {
      setErrorMessage("Le nom du vin est obligatoire.");
      setSaving(false);
      return;
    }

    if (!slug) {
      setErrorMessage("Impossible de générer le slug du vin.");
      setSaving(false);
      return;
    }

    const payload = {
      slug,
      name: form.name.trim(),
      producer: cleanText(form.producer),
      region: cleanText(form.region),
      appellation: cleanText(form.appellation),
      country: cleanText(form.country),
      color: cleanText(form.color),
      vintage: cleanText(form.vintage),
      price: parseNumber(form.price),
      stock: parsedStock,
      bottle_size: cleanText(form.bottle_size),
      packaging: cleanText(form.packaging),
      image: cleanText(form.image),
      category: cleanText(form.category) || cleanText(form.region),
      rating: parseNumber(form.rating),
      seo_title: cleanText(form.seo_title),
      seo_description: cleanText(form.seo_description),
      keywords: form.keywords
        ? form.keywords.split(",").map((x) => x.trim()).filter(Boolean)
        : [],
      grape_varieties: form.grape_varieties
        ? form.grape_varieties.split(",").map((x) => x.trim()).filter(Boolean)
        : [],
      classification: cleanText(form.classification),
      soil: cleanText(form.soil),
      style: cleanText(form.style),
      description: cleanText(form.description),
      story: cleanText(form.story),
      tasting_notes: form.tasting_notes ? [form.tasting_notes.trim()] : [],
      nose: cleanText(form.nose),
      palate: cleanText(form.palate),
      pairing: cleanText(form.pairing),
      serving_temperature: cleanText(form.serving_temperature),
      aging_potential: cleanText(form.aging_potential),
      meta_content: cleanText(form.meta_content),
      external_links: cleanText(form.external_links),
    };

    const response = await fetch(`/api/admin/wines/${wineId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setErrorMessage(
        result?.details ||
          result?.error ||
          "Erreur lors de la modification du vin."
      );
      setSaving(false);
      return;
    }

    setForm((previous) => ({
      ...previous,
      stock: String(result?.wine?.stock ?? parsedStock),
    }));

    setSuccessMessage(
      `Fiche vin modifiée avec succès. Stock enregistré : ${
        result?.wine?.stock ?? parsedStock
      } caisse${Number(result?.wine?.stock ?? parsedStock) > 1 ? "s" : ""}.`
    );

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
        <div className="mx-auto max-w-6xl">
          <p>Chargement de la fiche vin...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin/catalogue"
          className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
        >
          ← Retour catalogue
        </Link>

        <div className="mt-4">
          <Link
            href={`/boutique/vin/${wineId}`}
            target="_blank"
            className="inline-flex rounded-full border border-[#8a6a2f] px-5 py-2 text-sm font-medium text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
          >
            Voir la fiche
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8"
        >
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              {successMessage}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nom du vin *" className="rounded-xl border border-neutral-300 px-4 py-3" />

            <select name="category" value={form.category} onChange={handleCategoryChange} className="rounded-xl border border-neutral-300 px-4 py-3">
              <option value="">Catégorie</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <input name="region" value={form.region} onChange={handleChange} placeholder="Région" className="rounded-xl border border-neutral-300 px-4 py-3" />

            {form.category === "Bordeaux" || form.category === "Primeurs 2025" ? (
              <select name="appellation" value={form.appellation} onChange={handleChange} className="rounded-xl border border-neutral-300 px-4 py-3">
                <option value="">Appellation Bordeaux</option>
                {bordeauxAppellations.map((appellation) => (
                  <option key={appellation} value={appellation}>{appellation}</option>
                ))}
              </select>
            ) : (
              <input name="appellation" value={form.appellation} onChange={handleChange} placeholder="Appellation" className="rounded-xl border border-neutral-300 px-4 py-3" />
            )}

            {form.category === "Bourgogne" ? (
              <select name="producer" value={form.producer} onChange={handleChange} className="rounded-xl border border-neutral-300 px-4 py-3">
                <option value="">Domaine Bourgogne</option>
                {bourgogneDomains.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            ) : (
              <input name="producer" value={form.producer} onChange={handleChange} placeholder="Domaine / Château" className="rounded-xl border border-neutral-300 px-4 py-3" />
            )}

            <input name="country" value={form.country} onChange={handleChange} placeholder="Pays" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <input name="color" value={form.color} onChange={handleChange} placeholder="Couleur" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <input name="vintage" value={form.vintage} onChange={handleChange} placeholder="Millésime" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Prix HT" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock disponible (caisses)" className="rounded-xl border-2 border-green-500 bg-green-50 px-4 py-3 font-semibold" />
            <input name="bottle_size" value={form.bottle_size} onChange={handleChange} placeholder="Flaconnage ex: 75cl" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <input name="packaging" value={form.packaging} onChange={handleChange} placeholder="Caissage ex: CBO/6" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image ex: /images/chateau-margaux-2020.jpg" className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2" />
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug personnalisé optionnel" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <input name="rating" value={form.rating} onChange={handleChange} placeholder="Note ex: 98" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <input name="classification" value={form.classification} onChange={handleChange} placeholder="Classification" className="rounded-xl border border-neutral-300 px-4 py-3" />

            <input name="seo_title" value={form.seo_title} onChange={handleChange} placeholder="Titre SEO" className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2" />
            <textarea name="seo_description" value={form.seo_description} onChange={handleChange} rows={3} placeholder="Description SEO" className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2" />
            <input name="keywords" value={form.keywords} onChange={handleChange} placeholder="Mots-clés séparés par virgules" className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2" />
            <input name="grape_varieties" value={form.grape_varieties} onChange={handleChange} placeholder="Cépages séparés par virgules" className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2" />
            <input name="soil" value={form.soil} onChange={handleChange} placeholder="Sol" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <input name="style" value={form.style} onChange={handleChange} placeholder="Style" className="rounded-xl border border-neutral-300 px-4 py-3" />

            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Description" className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2" />
            <textarea name="story" value={form.story} onChange={handleChange} rows={4} placeholder="Histoire / domaine" className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2" />
            <textarea name="tasting_notes" value={form.tasting_notes} onChange={handleChange} rows={4} placeholder="Notes de dégustation" className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2" />
            <textarea name="nose" value={form.nose} onChange={handleChange} rows={3} placeholder="Nez" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <textarea name="palate" value={form.palate} onChange={handleChange} rows={3} placeholder="Bouche" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <textarea name="pairing" value={form.pairing} onChange={handleChange} rows={3} placeholder="Accords mets-vins" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <textarea name="serving_temperature" value={form.serving_temperature} onChange={handleChange} rows={3} placeholder="Température de service" className="rounded-xl border border-neutral-300 px-4 py-3" />
            <textarea name="aging_potential" value={form.aging_potential} onChange={handleChange} rows={3} placeholder="Potentiel de garde" className="rounded-xl border border-neutral-300 px-4 py-3" />

            <textarea
              name="meta_content"
              value={form.meta_content}
              onChange={handleChange}
              rows={4}
              placeholder="Contenu complémentaire / méta"
              className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
            />

            <textarea
              name="external_links"
              value={form.external_links}
              onChange={handleChange}
              rows={5}
              placeholder={`Liens externes\n\nSite officiel|https://www.chateau-palmer.com\nWine-Searcher|https://www.wine-searcher.com\niDealwine|https://www.idealwine.com`}
              className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
            />
          </div>

          <div className="mt-6 rounded-2xl bg-[#fffaf3] p-4 text-sm text-neutral-700">
            Slug actuel :{" "}
            <strong className="text-black">{previewSlug || "—"}</strong>
            <br />
            Stock actuellement saisi :{" "}
            <strong className="text-black">{form.stock || "0"} caisse(s)</strong>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white hover:bg-[#8a6a2f] disabled:bg-neutral-400"
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </main>
  );
}
