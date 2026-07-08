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

function uniqueCount(values: Array<string | null | undefined>) {
  return new Set(
    values
      .filter(Boolean)
      .map((value) => String(value).trim())
      .filter(Boolean)
  ).size;
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  tone?: "neutral" | "good" | "warning" | "danger";
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

    const withoutImage = visibleWines.filter((wine) => isEmpty(wine.image));
    const withoutDescription = visibleWines.filter((wine) =>
      isEmpty(wine.description)
    );
    const withoutSeoTitle = visibleWines.filter((wine) =>
      isEmpty(wine.seo_title)
    );
    const withoutSeoDescription = visibleWines.filter((wine) =>
      isEmpty(wine.seo_description)
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

    const slugMap = new Map<string, number>();

    visibleWines.forEach((wine) => {
      if (!wine.slug) return;
      slugMap.set(wine.slug, (slugMap.get(wine.slug) || 0) + 1);
    });

    const duplicatedSlugValues = Array.from(slugMap.entries())
      .filter(([, count]) => count > 1)
      .map(([slug]) => slug);

    const duplicatedSlugWines = visibleWines.filter(
      (wine) => wine.slug && duplicatedSlugValues.includes(wine.slug)
    );

    const imageScore = Math.round(
      ((totalVisible - withoutImage.length) / totalVisible) * 100
    );

    const seoTitleScore = Math.round(
      ((totalVisible - withoutSeoTitle.length) / totalVisible) * 100
    );

    const seoDescriptionScore = Math.round(
      ((totalVisible - withoutSeoDescription.length) / totalVisible) * 100
    );

    const descriptionScore = Math.round(
      ((totalVisible - withoutDescription.length) / totalVisible) * 100
    );

    const contentScore = Math.round(
      ((totalVisible - withoutStory.length - withoutTastingNotes.length / 2) /
        totalVisible) *
        100
    );

    const globalScore = Math.round(
      imageScore * 0.2 +
        seoTitleScore * 0.2 +
        seoDescriptionScore * 0.2 +
        descriptionScore * 0.25 +
        Math.max(0, contentScore) * 0.15
    );

    const issueLists: SeoList[] = [
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
        key: "without-seo-title",
        label: "Fiches sans SEO title",
        wines: withoutSeoTitle,
        tone: withoutSeoTitle.length === 0 ? "good" : "warning",
      },
      {
        key: "without-seo-description",
        label: "Fiches sans meta description",
        wines: withoutSeoDescription,
        tone: withoutSeoDescription.length === 0 ? "good" : "warning",
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
        key: "duplicated-slugs",
        label: "Fiches avec slug dupliqué",
        wines: duplicatedSlugWines,
        tone: duplicatedSlugWines.length === 0 ? "good" : "danger",
      },
    ];

    return {
      visibleWines,
      hiddenWines: wines.filter((wine) => wine.hidden_from_site),
      producers: uniqueCount(visibleWines.map((wine) => wine.producer)),
      appellations: uniqueCount(visibleWines.map((wine) => wine.appellation)),
      countries: uniqueCount(visibleWines.map((wine) => wine.country)),
      regions: uniqueCount(visibleWines.map((wine) => wine.region)),
      withoutImage,
      withoutDescription,
      withoutSeoTitle,
      withoutSeoDescription,
      withoutStory,
      withoutTastingNotes,
      withoutPrice,
      withoutStock,
      withoutAppellation,
      withoutRegion,
      duplicatedSlugs: duplicatedSlugValues,
      duplicatedSlugWines,
      issueLists,
      imageScore,
      seoTitleScore,
      seoDescriptionScore,
      descriptionScore,
      contentScore: Math.max(0, contentScore),
      globalScore,
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
            Vue synthétique des fiches vins visibles, des champs SEO manquants
            et de la qualité globale du catalogue The Wine Watchers.
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
                tone={
                  seo.globalScore >= 90
                    ? "good"
                    : seo.globalScore >= 70
                    ? "warning"
                    : "danger"
                }
              />
            </section>

            <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-serif text-black">
                  Qualité SEO globale
                </h2>

                <div className="mt-6 space-y-5">
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
                </div>
              </div>

              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-serif text-black">
                  Alertes prioritaires
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
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
                  <StatCard
                    label="Sans histoire domaine"
                    value={seo.withoutStory.length}
                    tone={seo.withoutStory.length === 0 ? "good" : "warning"}
                  />
                  <StatCard
                    label="Sans dégustation"
                    value={seo.withoutTastingNotes.length}
                    tone={
                      seo.withoutTastingNotes.length === 0
                        ? "good"
                        : "warning"
                    }
                  />
                </div>
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
              </div>
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