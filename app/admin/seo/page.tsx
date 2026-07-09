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
  country: string | null;
  image: string | null;
  price: number | string | null;
  stock: number | string | null;
  seo_title: string | null;
  seo_description: string | null;
  description: string | null;
  story: string | null;
  tasting_notes: string[] | string | null;
  hidden_from_site: boolean | null;
};

type Tone = "neutral" | "good" | "warning" | "danger";

type SeoList = {
  key: string;
  label: string;
  wines: Wine[];
  tone: "danger" | "warning" | "good";
};

function isEmpty(value: unknown) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  return String(value).trim() === "";
}

function textLength(value: unknown) {
  if (value === null || value === undefined) return 0;
  return String(value).trim().length;
}

function normalizeSeoText(value: unknown) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function duplicateContentKey(wine: Wine) {
  return [
    normalizeSeoText(wine.description),
    normalizeSeoText(wine.story),
    normalizeSeoText(wine.seo_description),
    Array.isArray(wine.tasting_notes)
      ? wine.tasting_notes.map((note) => normalizeSeoText(note)).join(" ")
      : normalizeSeoText(wine.tasting_notes),
  ]
    .filter(Boolean)
    .join(" | ");
}

function uniqueCount(values: Array<string | null | undefined>) {
  return new Set(
    values
      .filter(Boolean)
      .map((value) => String(value).trim())
      .filter(Boolean)
  ).size;
}

function scoreTone(score: number): Tone {
  if (score >= 90) return "good";
  if (score >= 70) return "warning";
  return "danger";
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  tone?: Tone;
}) {
  const toneClass =
    tone === "good"
      ? "border-green-200 bg-green-50 text-green-900"
      : tone === "warning"
      ? "border-orange-200 bg-orange-50 text-orange-900"
      : tone === "danger"
      ? "border-red-200 bg-red-50 text-red-900"
      : "border-[#e6dcc8] bg-white text-black";

  return (
    <div className={`rounded-3xl border p-6 shadow-sm ${toneClass}`}>
      <p className="text-sm uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="mt-3 text-4xl font-serif">{value}</p>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#eee2cf]">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function Pill({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  const toneClass =
    tone === "good"
      ? "bg-green-100 text-green-900"
      : tone === "warning"
      ? "bg-orange-100 text-orange-900"
      : tone === "danger"
      ? "bg-red-100 text-red-900"
      : "bg-neutral-100 text-neutral-800";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>
      {children}
    </span>
  );
}

function WineIssueList({
  title,
  wines,
  tone,
}: {
  title: string;
  wines: Wine[];
  tone: "danger" | "warning" | "good";
}) {
  const toneClass =
    tone === "danger"
      ? "border-red-200 bg-red-50"
      : tone === "warning"
      ? "border-orange-200 bg-orange-50"
      : "border-green-200 bg-green-50";

  return (
    <div className={`rounded-3xl border p-6 ${toneClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-serif text-black">{title}</h3>
          <p className="mt-1 text-sm text-neutral-700">
            {wines.length === 0
              ? "Aucune fiche concernée."
              : `${wines.length} fiche${wines.length > 1 ? "s" : ""} à vérifier.`}
          </p>
        </div>

        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
          {wines.length}
        </span>
      </div>

      {wines.length > 0 && (
        <div className="mt-5 space-y-3">
          {wines.map((wine) => (
            <div
              key={`${title}-${wine.id}`}
              className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-serif text-lg text-black">
                    {wine.name || "Vin sans nom"}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {[wine.producer, wine.appellation, wine.region]
                      .filter(Boolean)
                      .join(" · ") || "Informations producteur/région manquantes"}
                  </p>
                  {wine.slug && (
                    <p className="mt-1 text-xs text-neutral-500">/{wine.slug}</p>
                  )}
                </div>

                <Link
                  href={`/admin/catalogue/${wine.id}`}
                  className="rounded-full bg-black px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#8a6a2f]"
                >
                  Modifier
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GoogleCheck({
  label,
  status,
  detail,
}: {
  label: string;
  status: "ok" | "warning" | "danger";
  detail: string;
}) {
  const tone = status === "ok" ? "good" : status;

  return (
    <div className="rounded-2xl border border-[#e6dcc8] bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-serif text-lg text-black">{label}</h3>
        <Pill tone={tone}>{status === "ok" ? "OK" : "À vérifier"}</Pill>
      </div>
      <p className="mt-3 text-sm leading-6 text-neutral-700">{detail}</p>
    </div>
  );
}

function getWineScore(wine: Wine) {
  let score = 0;

  if (!isEmpty(wine.slug)) score += 10;
  if (!isEmpty(wine.image)) score += 10;
  if (!isEmpty(wine.price)) score += 10;
  if (!isEmpty(wine.stock)) score += 5;
  if (!isEmpty(wine.seo_title)) score += 10;
  if (!isEmpty(wine.seo_description)) score += 10;
  if (!isEmpty(wine.description)) score += 15;
  if (!isEmpty(wine.story)) score += 10;
  if (!isEmpty(wine.tasting_notes)) score += 10;
  if (!isEmpty(wine.producer)) score += 3;
  if (!isEmpty(wine.appellation)) score += 3;
  if (!isEmpty(wine.region)) score += 2;
  if (!isEmpty(wine.country)) score += 2;

  return Math.min(100, score);
}

export default function AdminSeoPage() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadSeoData() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("wines")
      .select(
        "id, slug, name, producer, region, appellation, country, image, price, stock, seo_title, seo_description, description, story, tasting_notes, hidden_from_site"
      )
      .order("name", { ascending: true });

    if (error) {
      console.error("Erreur SEO dashboard :", error);
      setErrorMessage("Impossible de charger les données SEO.");
      setLoading(false);
      return;
    }

    setWines((data || []) as Wine[]);
    setLoading(false);
  }

  useEffect(() => {
    loadSeoData();
  }, []);

  const seo = useMemo(() => {
    const visibleWines = wines.filter((wine) => !wine.hidden_from_site);
    const totalVisible = visibleWines.length || 1;

    const withoutSlug = visibleWines.filter((wine) => isEmpty(wine.slug));
    const longSlugs = visibleWines.filter((wine) => textLength(wine.slug) > 75);
    const withoutImage = visibleWines.filter((wine) => isEmpty(wine.image));
    const withoutDescription = visibleWines.filter((wine) =>
      isEmpty(wine.description)
    );
    const withoutSeoTitle = visibleWines.filter((wine) =>
      isEmpty(wine.seo_title)
    );
    const shortSeoTitle = visibleWines.filter(
      (wine) => !isEmpty(wine.seo_title) && textLength(wine.seo_title) < 35
    );
    const longSeoTitle = visibleWines.filter(
      (wine) => textLength(wine.seo_title) > 65
    );
    const withoutSeoDescription = visibleWines.filter((wine) =>
      isEmpty(wine.seo_description)
    );
    const shortSeoDescription = visibleWines.filter(
      (wine) =>
        !isEmpty(wine.seo_description) && textLength(wine.seo_description) < 90
    );
    const longSeoDescription = visibleWines.filter(
      (wine) => textLength(wine.seo_description) > 165
    );
    const withoutStory = visibleWines.filter((wine) => isEmpty(wine.story));
    const withoutTastingNotes = visibleWines.filter((wine) =>
      isEmpty(wine.tasting_notes)
    );
    const withoutPrice = visibleWines.filter((wine) => isEmpty(wine.price));
    const withoutStock = visibleWines.filter((wine) => isEmpty(wine.stock));
    const withoutAppellation = visibleWines.filter((wine) =>
      isEmpty(wine.appellation)
    );
    const withoutRegion = visibleWines.filter((wine) => isEmpty(wine.region));
    const withoutCountry = visibleWines.filter((wine) => isEmpty(wine.country));

    const slugMap = new Map<string, number>();
    const contentMap = new Map<string, number>();

    visibleWines.forEach((wine) => {
      if (wine.slug) {
        const slug = wine.slug.trim().toLowerCase();
        slugMap.set(slug, (slugMap.get(slug) || 0) + 1);
      }

      const contentKey = duplicateContentKey(wine);

      if (contentKey.length > 120) {
        contentMap.set(contentKey, (contentMap.get(contentKey) || 0) + 1);
      }
    });

    const duplicatedSlugValues = Array.from(slugMap.entries())
      .filter(([, count]) => count > 1)
      .map(([slug]) => slug);

    const duplicatedContentValues = Array.from(contentMap.entries())
      .filter(([, count]) => count > 1)
      .map(([content]) => content);

    const duplicatedSlugWines = visibleWines.filter(
      (wine) => wine.slug && duplicatedSlugValues.includes(wine.slug.trim())
    );

    const duplicatedContentWines = visibleWines.filter((wine) => {
      const contentKey = duplicateContentKey(wine);
      return contentKey.length > 120 && duplicatedContentValues.includes(contentKey);
    });

    const imageScore = Math.round(
      ((totalVisible - withoutImage.length) / totalVisible) * 100
    );

    const slugScore = Math.round(
      ((totalVisible -
        withoutSlug.length -
        duplicatedSlugWines.length -
        longSlugs.length) /
        totalVisible) *
        100
    );

    const seoTitleScore = Math.round(
      ((totalVisible -
        withoutSeoTitle.length -
        shortSeoTitle.length -
        longSeoTitle.length) /
        totalVisible) *
        100
    );

    const seoDescriptionScore = Math.round(
      ((totalVisible -
        withoutSeoDescription.length -
        shortSeoDescription.length -
        longSeoDescription.length) /
        totalVisible) *
        100
    );

    const descriptionScore = Math.round(
      ((totalVisible -
        withoutDescription.length -
        duplicatedContentWines.length) /
        totalVisible) *
        100
    );

    const contentScore = Math.round(
      ((totalVisible - withoutStory.length - withoutTastingNotes.length / 2) /
        totalVisible) *
        100
    );

    const catalogueScore = Math.round(
      ((totalVisible -
        withoutPrice.length -
        withoutStock.length -
        withoutAppellation.length -
        withoutRegion.length -
        withoutCountry.length) /
        totalVisible) *
        100
    );

    const globalScore = Math.round(
      Math.max(0, slugScore) * 0.15 +
        Math.max(0, imageScore) * 0.15 +
        Math.max(0, seoTitleScore) * 0.15 +
        Math.max(0, seoDescriptionScore) * 0.15 +
        Math.max(0, descriptionScore) * 0.2 +
        Math.max(0, contentScore) * 0.1 +
        Math.max(0, catalogueScore) * 0.1
    );

    const scoredWines = visibleWines
      .map((wine) => ({
        wine,
        score: getWineScore(wine),
      }))
      .sort((a, b) => a.score - b.score);

    const weakWines = scoredWines.filter((item) => item.score < 80).slice(0, 20);

    const issueLists: SeoList[] = [
      {
        key: "without-slug",
        label: "Fiches sans slug",
        wines: withoutSlug,
        tone: withoutSlug.length === 0 ? "good" : "danger",
      },
      {
        key: "duplicated-slugs",
        label: "Fiches avec slug dupliqué",
        wines: duplicatedSlugWines,
        tone: duplicatedSlugWines.length === 0 ? "good" : "danger",
      },
      {
        key: "long-slugs",
        label: "Slugs trop longs",
        wines: longSlugs,
        tone: longSlugs.length === 0 ? "good" : "warning",
      },
      {
        key: "without-image",
        label: "Fiches sans image",
        wines: withoutImage,
        tone: withoutImage.length === 0 ? "good" : "danger",
      },
      {
        key: "without-description",
        label: "Fiches sans description",
        wines: withoutDescription,
        tone: withoutDescription.length === 0 ? "good" : "danger",
      },
      {
        key: "duplicated-descriptions",
        label: "Contenus dupliqués",
        wines: duplicatedContentWines,
        tone: duplicatedContentWines.length === 0 ? "good" : "warning",
      },
      {
        key: "without-seo-title",
        label: "Fiches sans SEO title",
        wines: withoutSeoTitle,
        tone: withoutSeoTitle.length === 0 ? "good" : "warning",
      },
      {
        key: "short-seo-title",
        label: "SEO title trop court",
        wines: shortSeoTitle,
        tone: shortSeoTitle.length === 0 ? "good" : "warning",
      },
      {
        key: "long-seo-title",
        label: "SEO title trop long",
        wines: longSeoTitle,
        tone: longSeoTitle.length === 0 ? "good" : "warning",
      },
      {
        key: "without-seo-description",
        label: "Fiches sans meta description",
        wines: withoutSeoDescription,
        tone: withoutSeoDescription.length === 0 ? "good" : "warning",
      },
      {
        key: "short-seo-description",
        label: "Meta description trop courte",
        wines: shortSeoDescription,
        tone: shortSeoDescription.length === 0 ? "good" : "warning",
      },
      {
        key: "long-seo-description",
        label: "Meta description trop longue",
        wines: longSeoDescription,
        tone: longSeoDescription.length === 0 ? "good" : "warning",
      },
      {
        key: "without-story",
        label: "Fiches sans histoire domaine",
        wines: withoutStory,
        tone: withoutStory.length === 0 ? "good" : "warning",
      },
      {
        key: "without-tasting-notes",
        label: "Fiches sans dégustation",
        wines: withoutTastingNotes,
        tone: withoutTastingNotes.length === 0 ? "good" : "warning",
      },
      {
        key: "without-price",
        label: "Fiches sans prix",
        wines: withoutPrice,
        tone: withoutPrice.length === 0 ? "good" : "danger",
      },
      {
        key: "without-stock",
        label: "Fiches sans stock",
        wines: withoutStock,
        tone: withoutStock.length === 0 ? "good" : "warning",
      },
      {
        key: "without-appellation",
        label: "Fiches sans appellation",
        wines: withoutAppellation,
        tone: withoutAppellation.length === 0 ? "good" : "warning",
      },
      {
        key: "without-region",
        label: "Fiches sans région",
        wines: withoutRegion,
        tone: withoutRegion.length === 0 ? "good" : "warning",
      },
      {
        key: "without-country",
        label: "Fiches sans pays",
        wines: withoutCountry,
        tone: withoutCountry.length === 0 ? "good" : "warning",
      },
    ];

    return {
      visibleWines,
      hiddenWines: wines.filter((wine) => wine.hidden_from_site),
      producers: uniqueCount(visibleWines.map((wine) => wine.producer)),
      appellations: uniqueCount(visibleWines.map((wine) => wine.appellation)),
      countries: uniqueCount(visibleWines.map((wine) => wine.country)),
      regions: uniqueCount(visibleWines.map((wine) => wine.region)),
      withoutSlug,
      longSlugs,
      duplicatedSlugs: duplicatedSlugValues,
      duplicatedSlugWines,
      withoutImage,
      withoutDescription,
      duplicatedContentWines,
      withoutSeoTitle,
      shortSeoTitle,
      longSeoTitle,
      withoutSeoDescription,
      shortSeoDescription,
      longSeoDescription,
      withoutStory,
      withoutTastingNotes,
      withoutPrice,
      withoutStock,
      withoutAppellation,
      withoutRegion,
      withoutCountry,
      issueLists,
      scoredWines,
      weakWines,
      imageScore: Math.max(0, imageScore),
      slugScore: Math.max(0, slugScore),
      seoTitleScore: Math.max(0, seoTitleScore),
      seoDescriptionScore: Math.max(0, seoDescriptionScore),
      descriptionScore: Math.max(0, descriptionScore),
      contentScore: Math.max(0, contentScore),
      catalogueScore: Math.max(0, catalogueScore),
      globalScore: Math.max(0, globalScore),
    };
  }, [wines]);

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
        >
          ← Retour admin
        </Link>

        <div className="mt-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
            Tableau de bord SEO
          </p>

          <h1 className="mt-3 text-4xl font-serif text-black md:text-6xl">
            Santé SEO du catalogue
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-700">
            Audit automatique du catalogue The Wine Watchers : slugs, contenus,
            métadonnées, images, données produit, qualité Google et priorités de
            correction.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-3xl border border-[#e6dcc8] bg-white p-8 text-sm text-neutral-600">
            Chargement du tableau de bord SEO...
          </div>
        ) : (
          <>
            <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Vins en ligne" value={seo.visibleWines.length} />
              <StatCard label="Vins masqués" value={seo.hiddenWines.length} />
              <StatCard label="Producteurs" value={seo.producers} />
              <StatCard label="Appellations" value={seo.appellations} />
              <StatCard label="Régions" value={seo.regions} />
              <StatCard label="Pays" value={seo.countries} />
              <StatCard
                label="Slugs dupliqués"
                value={seo.duplicatedSlugs.length}
                tone={seo.duplicatedSlugs.length === 0 ? "good" : "danger"}
              />
              <StatCard
                label="Score global"
                value={`${seo.globalScore}/100`}
                tone={scoreTone(seo.globalScore)}
              />
            </section>

            <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-serif text-black">
                  Qualité SEO globale
                </h2>

                <div className="mt-6 space-y-5">
                  <ProgressBar label="Slugs & URLs" value={seo.slugScore} />
                  <ProgressBar label="Images" value={seo.imageScore} />
                  <ProgressBar label="SEO title" value={seo.seoTitleScore} />
                  <ProgressBar
                    label="Meta description"
                    value={seo.seoDescriptionScore}
                  />
                  <ProgressBar
                    label="Descriptions produits"
                    value={seo.descriptionScore}
                  />
                  <ProgressBar
                    label="Contenu éditorial"
                    value={seo.contentScore}
                  />
                  <ProgressBar
                    label="Données catalogue"
                    value={seo.catalogueScore}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-serif text-black">
                  Alertes prioritaires
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <StatCard
                    label="Sans slug"
                    value={seo.withoutSlug.length}
                    tone={seo.withoutSlug.length === 0 ? "good" : "danger"}
                  />
                  <StatCard
                    label="Slugs dupliqués"
                    value={seo.duplicatedSlugWines.length}
                    tone={
                      seo.duplicatedSlugWines.length === 0 ? "good" : "danger"
                    }
                  />
                  <StatCard
                    label="Sans image"
                    value={seo.withoutImage.length}
                    tone={seo.withoutImage.length === 0 ? "good" : "danger"}
                  />
                  <StatCard
                    label="Sans description"
                    value={seo.withoutDescription.length}
                    tone={
                      seo.withoutDescription.length === 0 ? "good" : "danger"
                    }
                  />
                  <StatCard
                    label="Sans SEO title"
                    value={seo.withoutSeoTitle.length}
                    tone={
                      seo.withoutSeoTitle.length === 0 ? "good" : "warning"
                    }
                  />
                  <StatCard
                    label="Sans meta description"
                    value={seo.withoutSeoDescription.length}
                    tone={
                      seo.withoutSeoDescription.length === 0
                        ? "good"
                        : "warning"
                    }
                  />
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-serif text-black">
                Contrôle Google
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">
                Cette section vérifie les grands piliers SEO côté catalogue. Le
                contrôle Search Console réel restera à suivre dans Google, mais
                le site prépare ici les bons signaux : URLs, sitemap, robots,
                données produit et contenu.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <GoogleCheck
                  label="Sitemap"
                  status="ok"
                  detail="/sitemap.xml doit inclure les fiches vins visibles, les pages boutique, appellations, producteurs et blog."
                />
                <GoogleCheck
                  label="Robots.txt"
                  status="ok"
                  detail="Les pages publiques doivent être autorisées. Les pages admin, API, checkout et panier doivent rester exclues."
                />
                <GoogleCheck
                  label="Product JSON-LD"
                  status={
                    seo.withoutPrice.length === 0 && seo.withoutImage.length === 0
                      ? "ok"
                      : "warning"
                  }
                  detail="Les données structurées Product ont besoin au minimum d'un nom, d'une image, d'un prix et d'une URL propre."
                />
                <GoogleCheck
                  label="URLs canoniques"
                  status={seo.withoutSlug.length === 0 ? "ok" : "danger"}
                  detail="Chaque fiche visible doit posséder un slug unique afin d'obtenir une URL canonique stable."
                />
                <GoogleCheck
                  label="Google Merchant"
                  status={
                    seo.withoutPrice.length === 0 && seo.withoutImage.length === 0
                      ? "ok"
                      : "warning"
                  }
                  detail="Les prix, images et disponibilités doivent être complets pour éviter les refus ou avertissements."
                />
                <GoogleCheck
                  label="Contenu utile"
                  status={
                    seo.withoutDescription.length === 0 &&
                    seo.withoutStory.length === 0
                      ? "ok"
                      : "warning"
                  }
                  detail="Les fiches doivent contenir une description propre, une présentation domaine et des notes de dégustation."
                />
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-serif text-black">
                Contrôle catalogue
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Sans prix"
                  value={seo.withoutPrice.length}
                  tone={seo.withoutPrice.length === 0 ? "good" : "danger"}
                />
                <StatCard
                  label="Sans stock"
                  value={seo.withoutStock.length}
                  tone={seo.withoutStock.length === 0 ? "good" : "warning"}
                />
                <StatCard
                  label="Sans appellation"
                  value={seo.withoutAppellation.length}
                  tone={
                    seo.withoutAppellation.length === 0 ? "good" : "warning"
                  }
                />
                <StatCard
                  label="Sans région"
                  value={seo.withoutRegion.length}
                  tone={seo.withoutRegion.length === 0 ? "good" : "warning"}
                />
                <StatCard
                  label="Sans pays"
                  value={seo.withoutCountry.length}
                  tone={seo.withoutCountry.length === 0 ? "good" : "warning"}
                />
                <StatCard
                  label="Contenus dupliqués"
                  value={seo.duplicatedContentWines.length}
                  tone={
                    seo.duplicatedContentWines.length === 0
                      ? "good"
                      : "warning"
                  }
                />
                <StatCard
                  label="Fiches < 80/100"
                  value={seo.weakWines.length}
                  tone={seo.weakWines.length === 0 ? "good" : "warning"}
                />
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-serif text-black">
                Fiches les plus faibles
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">
                Priorité de correction : ces fiches ont le score SEO/catalogue
                le plus faible parmi les vins visibles.
              </p>

              {seo.weakWines.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-900">
                  Aucune fiche visible sous 80/100.
                </div>
              ) : (
                <div className="mt-6 overflow-hidden rounded-3xl border border-[#e6dcc8] bg-white">
                  <div className="grid grid-cols-[1fr_120px_120px] gap-4 border-b border-[#e6dcc8] bg-[#fbf7ef] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                    <span>Vin</span>
                    <span>Score</span>
                    <span>Action</span>
                  </div>

                  {seo.weakWines.map(({ wine, score }) => (
                    <div
                      key={`weak-${wine.id}`}
                      className="grid grid-cols-[1fr_120px_120px] gap-4 border-b border-[#f0e6d5] px-5 py-4 text-sm last:border-b-0"
                    >
                      <div>
                        <p className="font-serif text-lg text-black">
                          {wine.name || "Vin sans nom"}
                        </p>
                        <p className="mt-1 text-xs text-neutral-600">
                          {[wine.producer, wine.appellation, wine.region]
                            .filter(Boolean)
                            .join(" · ") || "Informations manquantes"}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <Pill tone={scoreTone(score)}>{score}/100</Pill>
                      </div>

                      <div className="flex items-center">
                        <Link
                          href={`/admin/catalogue/${wine.id}`}
                          className="rounded-full bg-black px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#8a6a2f]"
                        >
                          Modifier
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-serif text-black">
                Listes de correction
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">
                Chaque bloc affiche les fiches concernées avec un accès direct
                à la modification dans le catalogue.
              </p>

              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                {seo.issueLists.map((issue) => (
                  <WineIssueList
                    key={issue.key}
                    title={issue.label}
                    wines={issue.wines}
                    tone={issue.tone}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}