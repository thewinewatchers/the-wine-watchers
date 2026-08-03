"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ImageGalleryEditor from "@/app/components/ImageGalleryEditor";

type CatalogueReference = {
  producer: string | null;
  category: string | null;
  region: string | null;
  appellation: string | null;
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
  compare_at_price: string;
  stock: string;
  bottle_size: string;
  packaging: string;
  image: string;
  additional_images: string[];
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
  compare_at_price: "",
  stock: "",
  bottle_size: "",
  packaging: "",
  image: "",
  additional_images: [],
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


const packagingOptions = [
  { value: "BT/1", label: "1 bouteille" },
  { value: "BT/3", label: "Lot de 3 bouteilles" },
  { value: "BT/6", label: "Lot de 6 bouteilles" },
  { value: "BT/12", label: "Lot de 12 bouteilles" },
  { value: "CBO/1", label: "Caisse bois de 1 bouteille" },
  { value: "CBO/3", label: "Caisse bois de 3 bouteilles" },
  { value: "CBO/6", label: "Caisse bois de 6 bouteilles" },
  { value: "CBO/12", label: "Caisse bois de 12 bouteilles" },
];

function getPackagingLabel(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) return "conditionnement non renseigné";

  return (
    packagingOptions.find((option) => option.value === normalizedValue)?.label ||
    normalizedValue
  );
}

function getStockLabel(stock: number, packaging: string) {
  const normalizedPackaging = packaging.trim();
  const isPlural = stock > 1;

  if (normalizedPackaging === "BT/1") {
    return `${stock} bouteille${isPlural ? "s" : ""}`;
  }

  if (normalizedPackaging.startsWith("BT/")) {
    const bottleCount = normalizedPackaging.replace("BT/", "");
    return `${stock} lot${isPlural ? "s" : ""} de ${bottleCount} bouteilles`;
  }

  if (normalizedPackaging.startsWith("CBO/")) {
    const bottleCount = normalizedPackaging.replace("CBO/", "");
    return `${stock} caisse${isPlural ? "s" : ""} bois de ${bottleCount} bouteille${
      bottleCount === "1" ? "" : "s"
    }`;
  }

  return `${stock} unité${isPlural ? "s" : ""}`;
}

const categoryOptions = [
  "Bordeaux",
  "Bourgogne",
  "Primeurs 2025",
  "Rhône",
  "Grands vins d’Italie",
  "Espagne",
  "USA",
  "Champagne",
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

function parseImageArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((image) => String(image || "").trim())
    .filter(Boolean);
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

function getLength(value: string) {
  return value.trim().length;
}

function getSeoStatus(value: string, min: number, max: number) {
  const length = getLength(value);

  if (length === 0) {
    return {
      label: "À corriger",
      className: "border-red-200 bg-red-50 text-red-800",
    };
  }

  if (length < min) {
    return {
      label: "Trop court",
      className: "border-orange-200 bg-orange-50 text-orange-800",
    };
  }

  if (length > max) {
    return {
      label: "Trop long",
      className: "border-red-200 bg-red-50 text-red-800",
    };
  }

  return {
    label: "Longueur idéale",
    className: "border-green-200 bg-green-50 text-green-800",
  };
}

function getMinimumStatus(value: string, min: number) {
  const length = getLength(value);

  if (length === 0) {
    return {
      label: "À corriger",
      className: "border-red-200 bg-red-50 text-red-800",
    };
  }

  if (length < min) {
    return {
      label: "À enrichir",
      className: "border-orange-200 bg-orange-50 text-orange-800",
    };
  }

  return {
    label: "OK",
    className: "border-green-200 bg-green-50 text-green-800",
  };
}

function getSeoScore(form: WineForm, previewSlug: string) {
  let score = 0;

  const slugLength = getLength(previewSlug);
  const seoTitleLength = getLength(form.seo_title);
  const seoDescriptionLength = getLength(form.seo_description);
  const descriptionLength = getLength(form.description);
  const storyLength = getLength(form.story);
  const tastingLength = getLength(form.tasting_notes);

  if (slugLength > 0 && slugLength <= 75) score += 15;
  if (seoTitleLength >= 35 && seoTitleLength <= 65) score += 20;
  if (seoDescriptionLength >= 90 && seoDescriptionLength <= 165) score += 20;
  if (descriptionLength >= 300) score += 15;
  if (storyLength >= 500) score += 10;
  if (tastingLength >= 120) score += 10;
  if (form.image.trim()) score += 5;
  if (form.price.trim()) score += 3;
  if (form.stock.trim()) score += 2;

  return Math.min(100, score);
}

function getScoreClass(score: number) {
  if (score >= 90) {
    return "border-green-200 bg-green-50 text-green-900";
  }

  if (score >= 70) {
    return "border-orange-200 bg-orange-50 text-orange-900";
  }

  return "border-red-200 bg-red-50 text-red-900";
}

function SeoIndicator({
  label,
  value,
  min,
  max,
  type = "range",
}: {
  label: string;
  value: string;
  min: number;
  max?: number;
  type?: "range" | "minimum";
}) {
  const status =
    type === "minimum"
      ? getMinimumStatus(value, min)
      : getSeoStatus(value, min, max || min);

  return (
    <div className={`rounded-2xl border p-4 text-sm ${status.className}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">{label}</span>

        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold">
          {status.label}
        </span>
      </div>

      <p className="mt-2">
        {type === "minimum"
          ? `${getLength(value)} caractères / minimum conseillé : ${min}`
          : `${getLength(value)} caractères / idéal : ${min}-${max}`}
      </p>
    </div>
  );
}

export default function AdminEditWinePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const wineId = String(params.id || "");

  const search = searchParams.get("search") || "";

  const backToCatalogueHref = search
    ? `/admin/catalogue?search=${encodeURIComponent(search)}`
    : "/admin/catalogue";

  const [form, setForm] = useState<WineForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [producerOptions, setProducerOptions] = useState<string[]>([]);
  const [catalogueReferences, setCatalogueReferences] = useState<
    CatalogueReference[]
  >([]);

  const appellationOptions = useMemo(() => {
    const appellations = catalogueReferences
      .map((wine) => String(wine.appellation || "").trim())
      .filter(Boolean);

    if (form.appellation.trim()) {
      appellations.push(form.appellation.trim());
    }

    return Array.from(new Set(appellations)).sort((a, b) =>
      a.localeCompare(b, "fr")
    );
  }, [catalogueReferences, form.appellation]);


  const previewSlug = useMemo(() => {
    if (form.slug.trim()) return createSlug(form.slug);

    return createSlug(`${form.name}-${form.vintage}`);
  }, [form.slug, form.name, form.vintage]);

  const seoTitleStatus = useMemo(
    () => getSeoStatus(form.seo_title, 35, 65),
    [form.seo_title]
  );

  const seoDescriptionStatus = useMemo(
    () => getSeoStatus(form.seo_description, 90, 165),
    [form.seo_description]
  );

  const seoScore = useMemo(() => {
    return getSeoScore(form, previewSlug);
  }, [form, previewSlug]);

  const googleTitle =
    form.seo_title.trim() ||
    `${form.name || "Nom du vin"} | The Wine Watchers`;

  const googleDescription =
    form.seo_description.trim() ||
    "Meta description non renseignée. Ajoutez une description optimisée pour améliorer l'affichage Google.";

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
        compare_at_price: parsePrice(data.compare_at_price),
        stock: String(data.stock ?? ""),
        bottle_size: data.bottle_size || "",
        packaging: data.packaging || "",
        image: data.image || "",
        additional_images: parseImageArray(data.additional_images),
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

      const { data: producerData, error: producerError } = await supabase
        .from("wines")
        .select("producer, category, region, appellation");

      if (producerError) {
        setErrorMessage(
          "La fiche est chargée, mais la liste des producteurs n’a pas pu être actualisée."
        );
      }

      const dynamicProducerOptions = Array.from(
        new Set(
          (producerData || [])
            .map((wine) => String(wine.producer || "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, "fr"));

      const currentProducer = String(data.producer || "").trim();

      if (currentProducer && !dynamicProducerOptions.includes(currentProducer)) {
        dynamicProducerOptions.push(currentProducer);
        dynamicProducerOptions.sort((a, b) => a.localeCompare(b, "fr"));
      }

      setProducerOptions(dynamicProducerOptions);
      setCatalogueReferences(
        ((producerData || []) as CatalogueReference[])
      );
      setLoading(false);
    }

    if (wineId) {
      loadWine();
    }
  }, [wineId]);

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
      compare_at_price: parseNumber(form.compare_at_price),
      stock: parsedStock,
      bottle_size: cleanText(form.bottle_size),
      packaging: cleanText(form.packaging),
      image: cleanText(form.image),
      additional_images: form.additional_images
        .map((image) => image.trim())
        .filter(Boolean),
      category: cleanText(form.category) || cleanText(form.region),
      rating: parseNumber(form.rating),
      seo_title: cleanText(form.seo_title),
      seo_description: cleanText(form.seo_description),
      keywords: form.keywords
        ? form.keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      grape_varieties: form.grape_varieties
        ? form.grape_varieties
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
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
      headers: {
        "Content-Type": "application/json",
      },
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
      compare_at_price: parsePrice(
        result?.wine?.compare_at_price ?? form.compare_at_price
      ),
      additional_images: parseImageArray(
        result?.wine?.additional_images ?? form.additional_images
      ),
    }));

    const savedStock = Number(result?.wine?.stock ?? parsedStock);
    const savedPackaging = String(
      result?.wine?.packaging ?? form.packaging ?? ""
    );

    setSuccessMessage(
      `Fiche vin modifiée avec succès. Disponibilité enregistrée : ${getStockLabel(
        savedStock,
        savedPackaging
      )}.`
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
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href={backToCatalogueHref}
            className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
          >
            ← Retour catalogue
          </Link>

          <Link
            href="/admin/seo"
            className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
          >
            ← Retour tableau SEO
          </Link>
        </div>

        <div className="mt-4">
          <Link
            href={`/boutique/vin/${previewSlug || wineId}`}
            target="_blank"
            className="inline-flex rounded-full border border-[#8a6a2f] px-5 py-2 text-sm font-medium text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
          >
            Voir la fiche
          </Link>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div
            className={`rounded-3xl border p-6 shadow-sm ${getScoreClass(
              seoScore
            )}`}
          >
            <p className="text-sm uppercase tracking-[0.22em] opacity-80">
              Assistant SEO
            </p>

            <p className="mt-3 font-serif text-5xl">{seoScore}/100</p>

            <p className="mt-3 text-sm">
              Score calculé en temps réel selon le slug, le titre SEO, la meta
              description, les contenus, l&apos;image, le prix et le stock.
            </p>
          </div>

          <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
              Prévisualisation Google
            </p>

            <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-sm text-[#1a0dab]">
                {googleTitle.length > 65
                  ? `${googleTitle.slice(0, 65)}...`
                  : googleTitle}
              </p>

              <p className="mt-1 text-xs text-green-700">
                https://www.thewinewatchers.com/boutique/vin/
                {previewSlug || wineId}
              </p>

              <p className="mt-2 text-sm leading-6 text-neutral-700">
                {googleDescription.length > 165
                  ? `${googleDescription.slice(0, 165)}...`
                  : googleDescription}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SeoIndicator
            label="Slug"
            value={previewSlug}
            min={1}
            max={75}
          />

          <SeoIndicator
            label="Titre SEO"
            value={form.seo_title}
            min={35}
            max={65}
          />

          <SeoIndicator
            label="Meta description"
            value={form.seo_description}
            min={90}
            max={165}
          />

          <SeoIndicator
            label="Description produit"
            value={form.description}
            min={300}
            type="minimum"
          />

          <SeoIndicator
            label="Histoire domaine"
            value={form.story}
            min={500}
            type="minimum"
          />

          <SeoIndicator
            label="Notes de dégustation"
            value={form.tasting_notes}
            min={120}
            type="minimum"
          />
        </section>

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
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nom du vin *"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleCategoryChange}
              className="rounded-xl border border-neutral-300 px-4 py-3"
            >
              <option value="">Catégorie</option>

              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              name="region"
              value={form.region}
              onChange={handleChange}
              placeholder="Région"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <select
              name="appellation"
              value={form.appellation}
              onChange={handleChange}
              className="rounded-xl border border-neutral-300 px-4 py-3"
            >
              <option value="">Appellation</option>

              {appellationOptions.map((appellation) => (
                <option key={appellation} value={appellation}>
                  {appellation}
                </option>
              ))}
            </select>

            {form.category === "Bourgogne" ? (
              <select
                name="producer"
                value={form.producer}
                onChange={handleChange}
                className="rounded-xl border border-neutral-300 px-4 py-3"
              >
                <option value="">Domaine Bourgogne</option>

                {producerOptions.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="producer"
                value={form.producer}
                onChange={handleChange}
                placeholder="Domaine / Château"
                className="rounded-xl border border-neutral-300 px-4 py-3"
              />
            )}

            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Pays"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Couleur"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <input
              name="vintage"
              value={form.vintage}
              onChange={handleChange}
              placeholder="Millésime"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Prix HT"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <input
              name="compare_at_price"
              value={form.compare_at_price}
              onChange={handleChange}
              placeholder="Prix avant remise HT optionnel"
              className="rounded-xl border border-[#d6b36a] bg-[#fffaf3] px-4 py-3"
            />

            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Nombre de lots disponibles"
              className="rounded-xl border-2 border-green-500 bg-green-50 px-4 py-3 font-semibold"
            />

            <input
              name="bottle_size"
              value={form.bottle_size}
              onChange={handleChange}
              placeholder="Flaconnage ex: 75cl"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <select
              name="packaging"
              value={form.packaging}
              onChange={handleChange}
              className="rounded-xl border border-neutral-300 px-4 py-3"
            >
              <option value="">Conditionnement / lot vendu</option>

              {form.packaging &&
                !packagingOptions.some(
                  (option) => option.value === form.packaging
                ) && (
                  <option value={form.packaging}>
                    Valeur actuelle : {form.packaging}
                  </option>
                )}

              {packagingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image ex: /images/chateau-margaux-2020.jpg"
              className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
            />

            <ImageGalleryEditor
              images={form.additional_images}
              onChange={(images) =>
                setForm((previous) => ({
                  ...previous,
                  additional_images: images,
                }))
              }
            />

            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="Slug personnalisé optionnel"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <input
              name="rating"
              value={form.rating}
              onChange={handleChange}
              placeholder="Note ex: 98"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <input
              name="classification"
              value={form.classification}
              onChange={handleChange}
              placeholder="Classification"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <div
              className={`rounded-2xl border p-4 md:col-span-2 ${seoTitleStatus.className}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="text-sm font-semibold">Titre SEO</label>

                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold">
                  {seoTitleStatus.label}
                </span>
              </div>

              <input
                name="seo_title"
                value={form.seo_title}
                onChange={handleChange}
                placeholder="Titre SEO"
                className="mt-3 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[#24110d]"
              />

              <p className="mt-2 text-xs">
                {getLength(form.seo_title)} caractères — idéal : 35 à 65.
              </p>
            </div>

            <div
              className={`rounded-2xl border p-4 md:col-span-2 ${seoDescriptionStatus.className}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="text-sm font-semibold">
                  Meta description
                </label>

                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold">
                  {seoDescriptionStatus.label}
                </span>
              </div>

              <textarea
                name="seo_description"
                value={form.seo_description}
                onChange={handleChange}
                rows={7}
                placeholder="Meta description SEO"
                className="mt-3 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[#24110d]"
              />

              <p className="mt-2 text-xs">
                {getLength(form.seo_description)} caractères — idéal : 90 à
                165.
              </p>
            </div>

            <input
              name="keywords"
              value={form.keywords}
              onChange={handleChange}
              placeholder="Mots-clés séparés par virgules"
              className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
            />

            <input
              name="grape_varieties"
              value={form.grape_varieties}
              onChange={handleChange}
              placeholder="Cépages séparés par virgules"
              className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
            />

            <input
              name="soil"
              value={form.soil}
              onChange={handleChange}
              placeholder="Sol"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <input
              name="style"
              value={form.style}
              onChange={handleChange}
              placeholder="Style"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Description"
              className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
            />

            <textarea
              name="story"
              value={form.story}
              onChange={handleChange}
              rows={4}
              placeholder="Histoire / domaine"
              className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
            />

            <textarea
              name="tasting_notes"
              value={form.tasting_notes}
              onChange={handleChange}
              rows={4}
              placeholder="Notes de dégustation"
              className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
            />

            <textarea
              name="nose"
              value={form.nose}
              onChange={handleChange}
              rows={3}
              placeholder="Nez"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <textarea
              name="palate"
              value={form.palate}
              onChange={handleChange}
              rows={3}
              placeholder="Bouche"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <textarea
              name="pairing"
              value={form.pairing}
              onChange={handleChange}
              rows={3}
              placeholder="Accords mets-vins"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <textarea
              name="serving_temperature"
              value={form.serving_temperature}
              onChange={handleChange}
              rows={3}
              placeholder="Température de service"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

            <textarea
              name="aging_potential"
              value={form.aging_potential}
              onChange={handleChange}
              rows={3}
              placeholder="Potentiel de garde"
              className="rounded-xl border border-neutral-300 px-4 py-3"
            />

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
              placeholder={`Liens externes

Site officiel|https://www.chateau-palmer.com
Wine-Searcher|https://www.wine-searcher.com
iDealwine|https://www.idealwine.com`}
              className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
            />
          </div>

          <div className="mt-6 rounded-2xl bg-[#fffaf3] p-4 text-sm text-neutral-700">
            Slug actuel :{" "}
            <strong className="text-black">{previewSlug || "—"}</strong>
            <br />
            Disponibilité actuellement saisie :{" "}
            <strong className="text-black">
              {getStockLabel(Number(form.stock || 0), form.packaging)}
            </strong>
            <br />
            Conditionnement :{" "}
            <strong className="text-black">
              {getPackagingLabel(form.packaging)}
            </strong>
            <br />
            Images supplémentaires :{" "}
            <strong className="text-black">
              {
                form.additional_images.filter((image) => image.trim()).length
              }
            </strong>
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