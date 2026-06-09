"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Wine = {
  id: string;
  slug: string | null;
  name: string | null;
  producer: string | null;
  region: string | null;
  appellation: string | null;
  vintage: string | null;
  price: number | string | null;
  image: string | null;
  bottle_size: string | null;
  packaging: string | null;
  hidden_from_site?: boolean | null;
  created_at?: string | null;
};

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
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePrice(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return null;

  const cleaned = String(value)
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? null : parsed;
}

function formatPrice(value?: number | string | null) {
  const price = parsePrice(value);

  if (price === null) return "Prix sur demande";

  return price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export default function AdminCataloguePage() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [form, setForm] = useState<WineForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [updatingVisibilityId, setUpdatingVisibilityId] = useState<string | null>(null);
  const [searchWine, setSearchWine] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadWines() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("wines")
      .select(
        "id, slug, name, producer, region, appellation, vintage, price, image, bottle_size, packaging, hidden_from_site, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement vins :", error);
      setErrorMessage("Impossible de charger le catalogue.");
      setLoading(false);
      return;
    }

    setWines((data || []) as Wine[]);
    setLoading(false);
  }

  useEffect(() => {
    loadWines();
  }, []);

  const filteredAdminWines = useMemo(() => {
    if (!searchWine.trim()) return wines;

    const search = searchWine.toLowerCase();

    return wines.filter((wine) =>
      [wine.name, wine.producer, wine.appellation, wine.vintage]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [wines, searchWine]);

  const previewSlug = useMemo(() => {
    if (form.slug.trim()) return createSlug(form.slug);
    return createSlug(`${form.name}-${form.vintage}`);
  }, [form.slug, form.name, form.vintage]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleDeleteWine(wineId: string, wineName?: string | null) {
    const confirmed = window.confirm(
      `Supprimer définitivement ce vin du catalogue ?\n\n${
        wineName || "Vin sélectionné"
      }`
    );

    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await supabase.from("wines").delete().eq("id", wineId);

    if (error) {
      console.error("Erreur suppression vin :", error);
      setErrorMessage(`Erreur lors de la suppression : ${error.message}`);
      return;
    }

    setSuccessMessage("Vin supprimé du catalogue.");
    await loadWines();
  }

  async function handleDuplicateWine(wineId: string, wineName?: string | null) {
    const confirmed = window.confirm(
      `Dupliquer cette fiche vin ?\n\n${wineName || "Vin sélectionné"}`
    );

    if (!confirmed) return;

    setDuplicatingId(wineId);
    setErrorMessage("");
    setSuccessMessage("");

    const response = await fetch(`/api/admin/wines/${wineId}`, {
      method: "POST",
    });

    const result = await response.json();

    if (!response.ok) {
      setErrorMessage(
        result?.details ||
          result?.error ||
          "Erreur lors de la duplication du vin."
      );
      setDuplicatingId(null);
      return;
    }

    setSuccessMessage("Fiche vin dupliquée avec succès.");
    setDuplicatingId(null);

    await loadWines();

    if (result?.wine?.id) {
      window.location.href = `/admin/catalogue/${result.wine.id}`;
    }
  }

  async function handleToggleVisibility(wine: Wine) {
    setUpdatingVisibilityId(wine.id);
    setErrorMessage("");
    setSuccessMessage("");

    const newHiddenValue = !Boolean(wine.hidden_from_site);

    const response = await fetch(`/api/admin/wines/${wine.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hidden_from_site: newHiddenValue,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setErrorMessage(
        result?.details ||
          result?.error ||
          "Erreur lors de la modification de visibilité."
      );
      setUpdatingVisibilityId(null);
      return;
    }

    setSuccessMessage(
      newHiddenValue
        ? "Vin masqué du site."
        : "Vin affiché sur le site."
    );

    setUpdatingVisibilityId(null);
    await loadWines();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const slug = previewSlug;

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

    const parsedPrice = parsePrice(form.price);
    const parsedRating = parsePrice(form.rating);

    const payload = {
      slug,
      name: form.name.trim(),
      producer: form.producer.trim() || null,
      region: form.region.trim() || null,
      appellation: form.appellation.trim() || null,
      country: form.country.trim() || null,
      color: form.color.trim() || null,
      vintage: form.vintage.trim() || null,
      price: parsedPrice,
      hidden_from_site: false,
      bottle_size: form.bottle_size.trim() || null,
      packaging: form.packaging.trim() || null,
      image: form.image.trim() || null,
      category: form.category.trim() || form.region.trim() || null,
      rating: parsedRating,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      keywords: form.keywords
        ? form.keywords
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean)
        : [],
      grape_varieties: form.grape_varieties
        ? form.grape_varieties
            .split(",")
            .map((grape) => grape.trim())
            .filter(Boolean)
        : [],
      classification: form.classification.trim() || null,
      soil: form.soil.trim() || null,
      style: form.style.trim() || null,
      description: form.description.trim() || null,
      story: form.story.trim() || null,
      tasting_notes: form.tasting_notes
        ? form.tasting_notes
            .split(",")
            .map((note) => note.trim())
            .filter(Boolean)
        : [],
      nose: form.nose.trim() || null,
      palate: form.palate.trim() || null,
      pairing: form.pairing.trim() || null,
      serving_temperature: form.serving_temperature.trim() || null,
      aging_potential: form.aging_potential.trim() || null,
      meta_content: form.meta_content.trim() || null,
    };

    const { error } = await supabase.from("wines").insert(payload);

    if (error) {
      console.error("Erreur insertion vin :", error);
      setErrorMessage(`Erreur lors de l’enregistrement : ${error.message}`);
      setSaving(false);
      return;
    }

    setSuccessMessage("Vin enregistré dans Supabase.");
    setForm(emptyForm);
    await loadWines();
    setSaving(false);
  }
  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
        >
          ← Retour admin
        </Link>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
              Catalogue
            </p>

            <h1 className="mt-3 text-4xl font-serif text-black md:text-6xl">
              Ajouter un vin
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-700">
              Ajout manuel d’un vin directement dans Supabase. Pour un volume
              important de références, utilisez plutôt l’import Excel.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/import"
              className="rounded-full border border-black px-5 py-3 text-center text-sm uppercase tracking-[0.18em] text-black hover:bg-black hover:text-white"
            >
              Import Excel
            </Link>

            <Link
              href="/boutique/bordeaux"
              className="rounded-full bg-black px-5 py-3 text-center text-sm uppercase tracking-[0.18em] text-white hover:bg-[#8a6a2f]"
            >
              Voir boutique
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8"
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
              <input name="producer" value={form.producer} onChange={handleChange} placeholder="Domaine / Château" className="rounded-xl border border-neutral-300 px-4 py-3" />
              <input name="region" value={form.region} onChange={handleChange} placeholder="Région" className="rounded-xl border border-neutral-300 px-4 py-3" />
              <input name="appellation" value={form.appellation} onChange={handleChange} placeholder="Appellation" className="rounded-xl border border-neutral-300 px-4 py-3" />
              <input name="country" value={form.country} onChange={handleChange} placeholder="Pays" className="rounded-xl border border-neutral-300 px-4 py-3" />
              <input name="color" value={form.color} onChange={handleChange} placeholder="Couleur" className="rounded-xl border border-neutral-300 px-4 py-3" />
              <input name="vintage" value={form.vintage} onChange={handleChange} placeholder="Millésime" className="rounded-xl border border-neutral-300 px-4 py-3" />
              <input name="price" value={form.price} onChange={handleChange} placeholder="Prix HT" className="rounded-xl border border-neutral-300 px-4 py-3" />
              <input name="bottle_size" value={form.bottle_size} onChange={handleChange} placeholder="Flaconnage ex: 75cl" className="rounded-xl border border-neutral-300 px-4 py-3" />
              <input name="packaging" value={form.packaging} onChange={handleChange} placeholder="Caissage ex: CBO/6" className="rounded-xl border border-neutral-300 px-4 py-3" />
              <input name="image" value={form.image} onChange={handleChange} placeholder="Image ex: /images/chateau-margaux-2020.jpg" className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2" />
              <input name="category" value={form.category} onChange={handleChange} placeholder="Catégorie ex: Bordeaux, Bourgogne" className="rounded-xl border border-neutral-300 px-4 py-3" />
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
              <textarea name="meta_content" value={form.meta_content} onChange={handleChange} rows={4} placeholder="Contenu complémentaire / méta" className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2" />
            </div>

            <div className="mt-6 rounded-2xl bg-[#fffaf3] p-4 text-sm text-neutral-700">
              Slug généré :{" "}
              <strong className="text-black">{previewSlug || "—"}</strong>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white hover:bg-[#8a6a2f] disabled:bg-neutral-400"
            >
              {saving ? "Enregistrement..." : "Enregistrer dans Supabase"}
            </button>
          </form>

          <aside className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-serif text-black">Vins enregistrés</h2>

            <div className="mt-4">
              <input
                type="text"
                value={searchWine}
                onChange={(e) => setSearchWine(e.target.value)}
                placeholder="Rechercher un vin..."
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
              />
            </div>

            {loading ? (
              <p className="mt-5 text-sm text-neutral-600">
                Chargement du catalogue...
              </p>
            ) : filteredAdminWines.length === 0 ? (
              <p className="mt-5 text-sm text-neutral-600">
                Aucun vin enregistré.
              </p>
            ) : (
              <div className="mt-5 max-h-[900px] space-y-4 overflow-y-auto pr-2">
                {filteredAdminWines.map((wine) => {
                  const isHidden = Boolean(wine.hidden_from_site);

                  return (
                    <div
                      key={wine.id}
                      className={`rounded-2xl border p-4 ${
                        isHidden
                          ? "border-orange-300 bg-orange-50"
                          : "border-[#eee2cf]"
                      }`}
                    >
                      <div className="flex gap-4">
                        {wine.image ? (
                          <img
                            src={wine.image}
                            alt={wine.name || "Vin"}
                            className="h-20 w-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-20 w-16 rounded-xl bg-[#f0e7d8]" />
                        )}

                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="font-serif text-lg text-black">
                              {wine.name || "Vin sans nom"}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                                isHidden
                                  ? "bg-orange-200 text-orange-900"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {isHidden ? "Masqué" : "Visible"}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-neutral-600">
                            {[wine.producer, wine.appellation, wine.vintage]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-black">
                            {formatPrice(wine.price)}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Link
                              href={`/boutique/vin/${wine.id}`}
                              target="_blank"
                              className="rounded-full bg-black px-3 py-2 text-xs uppercase tracking-[0.14em] text-white hover:bg-[#8a6a2f]"
                            >
                              Voir fiche
                            </Link>

                            <Link
                              href={`/admin/catalogue/${wine.id}`}
                              className="rounded-full border border-[#8a6a2f] px-3 py-2 text-xs uppercase tracking-[0.14em] text-[#8a6a2f] hover:bg-[#fffaf3]"
                            >
                              Modifier
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(wine)}
                              disabled={updatingVisibilityId === wine.id}
                              className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.14em] disabled:opacity-50 ${
                                isHidden
                                  ? "border-green-300 text-green-700 hover:bg-green-50"
                                  : "border-orange-300 text-orange-700 hover:bg-orange-50"
                              }`}
                            >
                              {updatingVisibilityId === wine.id
                                ? "Mise à jour..."
                                : isHidden
                                ? "Afficher sur le site"
                                : "Ne pas afficher"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDuplicateWine(wine.id, wine.name)
                              }
                              disabled={duplicatingId === wine.id}
                              className="rounded-full border border-blue-300 px-3 py-2 text-xs uppercase tracking-[0.14em] text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                            >
                              {duplicatingId === wine.id
                                ? "Copie..."
                                : "Dupliquer"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteWine(wine.id, wine.name)
                              }
                              className="rounded-full border border-red-300 px-3 py-2 text-xs uppercase tracking-[0.14em] text-red-700 hover:bg-red-50"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}