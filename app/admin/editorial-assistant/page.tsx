"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Certification =
  | "Platine"
  | "Or"
  | "Argent"
  | "Bronze"
  | "À améliorer";

type EditorialAction = {
  category:
    | "metadata"
    | "editorial"
    | "technical"
    | "images"
    | "internalLinks"
    | "structuredData";
  label: string;
  detail: string;
  estimatedGain: number;
  estimatedMinutes: number;
};

type EditorialAnalysis = {
  id: string;
  slug: string | null;
  name: string;
  producer: string | null;
  appellation: string | null;
  region: string | null;
  hiddenFromSite: boolean;

  score: number;
  certification: Certification;
  stars: number;
  starsLabel: string;

  categories: {
    metadata: number;
    editorial: number;
    technical: number;
    images: number;
    internalLinks: number;
    structuredData: number;
  };

  warnings: string[];
  actions: EditorialAction[];
  estimatedMinutes: number;
  potentialGain: number;

  twwOpinionStatus: "regenerate" | "improve" | "compliant";
  twwOpinionLabel: string;
  twwOpinionReason: string;
  twwOpinionDuplicateCount: number;
};

type EditorialAssistantResponse = {
  success: boolean;
  summary: {
    total: number;
    averageScore: number;
    certifications: Record<string, number>;
    priorityCount: number;
    improvementCount: number;
    certifiedCount: number;
    twwOpinionRegenerateCount: number;
    twwOpinionImproveCount: number;
    twwOpinionCompliantCount: number;
    twwOpinionReviewCount: number;
  };
  analyses: EditorialAnalysis[];
};

type EditorialFilter =
  | "all"
  | "priority"
  | "improve"
  | "certified"
  | "platine"
  | "or"
  | "argent"
  | "bronze"
  | "tww-review"
  | "tww-regenerate"
  | "tww-improve"
  | "tww-compliant";

function formatInteger(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatMinutes(value: number) {
  if (value < 60) return `${value} min`;

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return minutes > 0 ? `${hours} h ${minutes}` : `${hours} h`;
}

function getCertificationTone(certification: Certification) {
  if (certification === "Platine") {
    return {
      card: "border-slate-300 bg-slate-50",
      badge: "bg-slate-200 text-slate-900",
      text: "text-slate-900",
    };
  }

  if (certification === "Or") {
    return {
      card: "border-yellow-300 bg-yellow-50",
      badge: "bg-yellow-200 text-yellow-900",
      text: "text-yellow-900",
    };
  }

  if (certification === "Argent") {
    return {
      card: "border-neutral-300 bg-neutral-50",
      badge: "bg-neutral-200 text-neutral-900",
      text: "text-neutral-900",
    };
  }

  if (certification === "Bronze") {
    return {
      card: "border-orange-300 bg-orange-50",
      badge: "bg-orange-200 text-orange-900",
      text: "text-orange-900",
    };
  }

  return {
    card: "border-red-300 bg-red-50",
    badge: "bg-red-200 text-red-900",
    text: "text-red-900",
  };
}

function categoryLabel(category: EditorialAction["category"]) {
  if (category === "metadata") return "Métadonnées";
  if (category === "editorial") return "Contenu";
  if (category === "technical") return "Technique";
  if (category === "images") return "Images";
  if (category === "internalLinks") return "Maillage";
  return "Données structurées";
}

type AiSection =
  | "description"
  | "story"
  | "nose"
  | "palate"
  | "serving_temperature"
  | "aging_potential"
  | "tasting_notes"
  | "food_pairings"
  | "tww_opinion"
  | "seo_title"
  | "seo_description";

function getAiSectionForAction(action: EditorialAction): AiSection | null {
  const label = action.label.toLocaleLowerCase("fr");

  if (label.includes("description") && !label.includes("meta")) return "description";
  if (label.includes("nez")) return "nose";
  if (label.includes("bouche")) return "palate";
  if (label.includes("température de service")) return "serving_temperature";
  if (label.includes("potentiel de garde")) return "aging_potential";
  if (label.includes("titre seo")) return "seo_title";
  if (label.includes("meta description")) return "seo_description";
  if (label.includes("histoire du vin")) return "story";
  if (label.includes("notes de dégustation")) return "tasting_notes";
  if (label.includes("accords mets-vins")) return "food_pairings";
  if (label.includes("avis the wine watchers")) return "tww_opinion";

  return null;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{label}</span>
        <strong>{value}/100</strong>
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

export default function AdminEditorialAssistantPage() {
  const [data, setData] = useState<EditorialAssistantResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EditorialFilter>("priority");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function loadEditorialAssistant() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/editorial-assistant", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.details ||
            result?.error ||
            "Impossible de charger l’Assistant éditorial."
        );
      }

      setData(result as EditorialAssistantResponse);
    } catch (error) {
      console.error("Erreur Assistant éditorial :", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de charger l’Assistant éditorial."
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEditorialAssistant();
  }, []);

  const filteredAnalyses = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("fr");

    return [...(data?.analyses || [])].filter((analysis) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          analysis.name,
          analysis.producer,
          analysis.appellation,
          analysis.region,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("fr")
          .includes(normalizedSearch);

      if (!matchesSearch) return false;

      if (filter === "priority") return analysis.score < 70;
      if (filter === "improve") {
        return analysis.score >= 70 && analysis.score < 90;
      }
      if (filter === "certified") return analysis.score >= 90;
      if (filter === "platine") return analysis.certification === "Platine";
      if (filter === "or") return analysis.certification === "Or";
      if (filter === "argent") return analysis.certification === "Argent";
      if (filter === "bronze") return analysis.certification === "Bronze";
      if (filter === "tww-review") {
        return (
          analysis.twwOpinionStatus === "regenerate" ||
          analysis.twwOpinionStatus === "improve"
        );
      }
      if (filter === "tww-regenerate") {
        return analysis.twwOpinionStatus === "regenerate";
      }
      if (filter === "tww-improve") {
        return analysis.twwOpinionStatus === "improve";
      }
      if (filter === "tww-compliant") {
        return analysis.twwOpinionStatus === "compliant";
      }

      return true;
    });
  }, [data, search, filter]);

  const summary = data?.summary;

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin"
            className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
          >
            ← Retour administration
          </Link>

          <button
            type="button"
            onClick={loadEditorialAssistant}
            disabled={loading}
            className="rounded-full border border-[#8a6a2f] px-5 py-2 text-sm font-medium text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white disabled:opacity-50"
          >
            {loading ? "Actualisation..." : "Actualiser l’analyse"}
          </button>
        </div>

        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
            Assistant éditorial
          </p>

          <h1 className="mt-3 font-serif text-4xl text-black md:text-6xl">
            Qualité des fiches vins
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700">
            Analyse automatique des métadonnées, contenus, données techniques,
            images, maillage interne et données structurées du catalogue.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-7 text-red-800">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-3xl border border-[#e6dcc8] bg-white p-8 text-sm text-neutral-600">
            Analyse des fiches du catalogue...
          </div>
        ) : data && summary ? (
          <>
            <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-3xl border p-6 text-left shadow-sm ${
                  filter === "all"
                    ? "border-[#8a6a2f] bg-[#fffaf3]"
                    : "border-[#e6dcc8] bg-white"
                }`}
              >
                <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                  Fiches analysées
                </p>
                <p className="mt-2 font-serif text-4xl text-black">
                  {summary.total}
                </p>
              </button>

              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                  Score moyen
                </p>
                <p className="mt-2 font-serif text-4xl text-black">
                  {summary.averageScore}/100
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFilter("priority")}
                className={`rounded-3xl border p-6 text-left shadow-sm ${
                  filter === "priority"
                    ? "border-red-500 bg-red-100"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <p className="text-sm uppercase tracking-[0.18em] text-red-700">
                  Prioritaires
                </p>
                <p className="mt-2 font-serif text-4xl text-red-900">
                  {summary.priorityCount}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFilter("improve")}
                className={`rounded-3xl border p-6 text-left shadow-sm ${
                  filter === "improve"
                    ? "border-orange-500 bg-orange-100"
                    : "border-orange-200 bg-orange-50"
                }`}
              >
                <p className="text-sm uppercase tracking-[0.18em] text-orange-700">
                  À améliorer
                </p>
                <p className="mt-2 font-serif text-4xl text-orange-900">
                  {summary.improvementCount}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFilter("certified")}
                className={`rounded-3xl border p-6 text-left shadow-sm ${
                  filter === "certified"
                    ? "border-green-500 bg-green-100"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <p className="text-sm uppercase tracking-[0.18em] text-green-700">
                  Certifiées Or +
                </p>
                <p className="mt-2 font-serif text-4xl text-green-900">
                  {summary.certifiedCount}
                </p>
              </button>
            </section>

            <section className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#8a6a2f]">
                    Avis The Wine Watchers
                  </p>
                  <h2 className="mt-2 font-serif text-3xl text-black">
                    Qualité des avis TWW
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">
                    Détection automatique des anciennes matrices éditoriales et des
                    avis repris à l’identique sur plusieurs fiches.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFilter("tww-review")}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold ${
                    filter === "tww-review"
                      ? "border-[#8a6a2f] bg-[#8a6a2f] text-white"
                      : "border-[#8a6a2f] bg-white text-[#8a6a2f] hover:bg-[#fffaf3]"
                  }`}
                >
                  Afficher les avis à reprendre
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setFilter("tww-review")}
                  className={`rounded-2xl border p-5 text-left ${
                    filter === "tww-review"
                      ? "border-[#8a6a2f] bg-[#fffaf3] ring-2 ring-[#8a6a2f]"
                      : "border-[#e6dcc8] bg-[#fffaf3]"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a6a2f]">
                    À reprendre
                  </p>
                  <p className="mt-2 font-serif text-3xl text-black">
                    {summary.twwOpinionReviewCount}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("tww-regenerate")}
                  className={`rounded-2xl border p-5 text-left ${
                    filter === "tww-regenerate"
                      ? "border-red-500 bg-red-100 ring-2 ring-red-500"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700">
                    🔴 À régénérer
                  </p>
                  <p className="mt-2 font-serif text-3xl text-red-900">
                    {summary.twwOpinionRegenerateCount}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("tww-improve")}
                  className={`rounded-2xl border p-5 text-left ${
                    filter === "tww-improve"
                      ? "border-orange-500 bg-orange-100 ring-2 ring-orange-500"
                      : "border-orange-200 bg-orange-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">
                    🟠 À améliorer
                  </p>
                  <p className="mt-2 font-serif text-3xl text-orange-900">
                    {summary.twwOpinionImproveCount}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("tww-compliant")}
                  className={`rounded-2xl border p-5 text-left ${
                    filter === "tww-compliant"
                      ? "border-green-500 bg-green-100 ring-2 ring-green-500"
                      : "border-green-200 bg-green-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-700">
                    🟢 Conforme
                  </p>
                  <p className="mt-2 font-serif text-3xl text-green-900">
                    {summary.twwOpinionCompliantCount}
                  </p>
                </button>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-serif text-2xl text-black">
                Certifications du catalogue
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {[
                  ["platine", "Platine", "border-slate-300 bg-slate-50"],
                  ["or", "Or", "border-yellow-300 bg-yellow-50"],
                  ["argent", "Argent", "border-neutral-300 bg-neutral-50"],
                  ["bronze", "Bronze", "border-orange-300 bg-orange-50"],
                  [
                    "priority",
                    "À améliorer",
                    "border-red-300 bg-red-50",
                  ],
                ].map(([value, label, className]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value as EditorialFilter)}
                    className={`rounded-2xl border p-5 text-left ${className} ${
                      filter === value ? "ring-2 ring-[#8a6a2f]" : ""
                    }`}
                  >
                    <p className="text-sm font-semibold text-black">{label}</p>
                    <p className="mt-2 font-serif text-3xl text-black">
                      {label === "À améliorer"
                        ? summary.certifications["À améliorer"] || 0
                        : summary.certifications[label] || 0}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h2 className="font-serif text-3xl text-black">
                    Analyse fiche par fiche
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-neutral-700">
                    Les fiches sont classées des plus faibles aux plus complètes.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 md:flex-row xl:max-w-2xl">
                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(event.target.value as EditorialFilter)
                    }
                    className="rounded-xl border border-neutral-300 px-4 py-3 text-sm"
                  >
                    <option value="priority">Prioritaires — moins de 70</option>
                    <option value="improve">À améliorer — 70 à 89</option>
                    <option value="certified">Certifiées — 90 et plus</option>
                    <option value="platine">Platine</option>
                    <option value="or">Or</option>
                    <option value="argent">Argent</option>
                    <option value="bronze">Bronze</option>
                    <option value="tww-review">Avis TWW à reprendre</option>
                    <option value="tww-regenerate">Avis TWW — à régénérer</option>
                    <option value="tww-improve">Avis TWW — à améliorer</option>
                    <option value="tww-compliant">Avis TWW — conformes</option>
                    <option value="all">Toutes les fiches</option>
                  </select>

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un vin..."
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <p className="mt-5 text-sm text-neutral-600">
                {filteredAnalyses.length} fiche
                {filteredAnalyses.length > 1 ? "s" : ""} affichée
                {filteredAnalyses.length > 1 ? "s" : ""}.
              </p>

              {filteredAnalyses.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-900">
                  Aucune fiche ne correspond à ce filtre.
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {filteredAnalyses.map((analysis) => {
                    const tone = getCertificationTone(
                      analysis.certification
                    );
                    const isExpanded = expandedId === analysis.id;

                    return (
                      <article
                        key={analysis.id}
                        className={`rounded-3xl border p-5 md:p-6 ${tone.card}`}
                      >
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${tone.badge}`}
                              >
                                {analysis.certification}
                              </span>

                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                                {analysis.starsLabel}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  analysis.twwOpinionStatus === "regenerate"
                                    ? "bg-red-100 text-red-900"
                                    : analysis.twwOpinionStatus === "improve"
                                      ? "bg-orange-100 text-orange-900"
                                      : "bg-green-100 text-green-900"
                                }`}
                              >
                                {analysis.twwOpinionStatus === "regenerate"
                                  ? "🔴 Avis TWW à régénérer"
                                  : analysis.twwOpinionStatus === "improve"
                                    ? "🟠 Avis TWW à améliorer"
                                    : "🟢 Avis TWW conforme"}
                              </span>
                            </div>

                            <h3
                              className={`mt-4 font-serif text-2xl ${tone.text}`}
                            >
                              {analysis.name}
                            </h3>

                            <p className="mt-2 text-sm text-neutral-600">
                              {[
                                analysis.producer,
                                analysis.appellation,
                                analysis.region,
                              ]
                                .filter(Boolean)
                                .join(" · ") || "Informations incomplètes"}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                              {analysis.score}/100
                            </span>

                            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                              {formatMinutes(analysis.estimatedMinutes)}
                            </span>

                            <Link
                              href={`/admin/catalogue/${analysis.id}`}
                              className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-[#8a6a2f]"
                            >
                              Modifier
                            </Link>

                            <Link
                              href={
                                analysis.twwOpinionStatus === "regenerate" ||
                                analysis.twwOpinionStatus === "improve"
                                  ? `/admin/editorial-assistant/ai?wine=${encodeURIComponent(
                                      analysis.id
                                    )}&section=tww_opinion`
                                  : `/admin/editorial-assistant/ai?wine=${encodeURIComponent(
                                      analysis.id
                                    )}`
                              }
                              className="rounded-full border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-900 hover:bg-purple-100"
                            >
                              {analysis.twwOpinionStatus === "regenerate" ||
                              analysis.twwOpinionStatus === "improve"
                                ? "✨ Reprendre l’avis TWW"
                                : "✨ Atelier IA"}
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId(
                                  isExpanded ? null : analysis.id
                                )
                              }
                              className="rounded-full border border-[#8a6a2f] bg-white px-4 py-2 text-sm font-semibold text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
                            >
                              {isExpanded ? "Réduire" : "Voir l’analyse"}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-6">
                            <div className="grid gap-5 lg:grid-cols-2">
                              <div className="rounded-2xl border border-white/80 bg-white p-5">
                                <h4 className="font-serif text-xl text-black">
                                  Scores par catégorie
                                </h4>

                                <div className="mt-5 space-y-5">
                                  <ScoreBar
                                    label="Métadonnées"
                                    value={analysis.categories.metadata}
                                  />
                                  <ScoreBar
                                    label="Contenu éditorial"
                                    value={analysis.categories.editorial}
                                  />
                                  <ScoreBar
                                    label="Données techniques"
                                    value={analysis.categories.technical}
                                  />
                                  <ScoreBar
                                    label="Images"
                                    value={analysis.categories.images}
                                  />
                                  <ScoreBar
                                    label="Maillage interne"
                                    value={analysis.categories.internalLinks}
                                  />
                                  <ScoreBar
                                    label="Données structurées"
                                    value={analysis.categories.structuredData}
                                  />
                                </div>
                              </div>

                              <div className="rounded-2xl border border-white/80 bg-white p-5">
                                <h4 className="font-serif text-xl text-black">
                                  Résumé de l’effort
                                </h4>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                  <div className="rounded-2xl bg-[#fffaf3] p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                                      Gain potentiel
                                    </p>
                                    <p className="mt-2 font-serif text-3xl text-black">
                                      +{analysis.potentialGain}
                                    </p>
                                  </div>

                                  <div className="rounded-2xl bg-[#fffaf3] p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                                      Temps estimé
                                    </p>
                                    <p className="mt-2 font-serif text-3xl text-black">
                                      {formatMinutes(
                                        analysis.estimatedMinutes
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <p className="mt-5 text-sm leading-7 text-neutral-700">
                                  {analysis.actions.length} action
                                  {analysis.actions.length > 1 ? "s" : ""}{" "}
                                  recommandée
                                  {analysis.actions.length > 1 ? "s" : ""}.
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 rounded-2xl border border-white/80 bg-white p-5">
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <h4 className="font-serif text-xl text-black">
                                    Avis The Wine Watchers
                                  </h4>
                                  <p className="mt-3 text-sm leading-7 text-neutral-700">
                                    {analysis.twwOpinionReason}
                                  </p>
                                  {analysis.twwOpinionDuplicateCount > 1 && (
                                    <p className="mt-2 text-xs font-semibold text-orange-800">
                                      Avis identique détecté sur{" "}
                                      {analysis.twwOpinionDuplicateCount} fiches.
                                    </p>
                                  )}
                                </div>

                                <Link
                                  href={`/admin/editorial-assistant/ai?wine=${encodeURIComponent(
                                    analysis.id
                                  )}&section=tww_opinion`}
                                  className="shrink-0 rounded-full border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-900 hover:bg-purple-100"
                                >
                                  ✨ Traiter l’avis TWW
                                </Link>
                              </div>
                            </div>

                            <div className="mt-5 rounded-2xl border border-white/80 bg-white p-5">
                              <h4 className="font-serif text-xl text-black">
                                Actions recommandées
                              </h4>

                              {analysis.actions.length === 0 ? (
                                <p className="mt-4 text-sm text-green-800">
                                  Cette fiche ne présente aucun manque majeur.
                                </p>
                              ) : (
                                <div className="mt-5 space-y-3">
                                  {analysis.actions.map((action, index) => {
                                    const aiSection =
                                      getAiSectionForAction(action);

                                    return (
                                      <div
                                        key={`${analysis.id}-action-${index}`}
                                        className="rounded-2xl border border-[#eee2cf] bg-[#fffdf9] p-4"
                                      >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                          <div>
                                            <span className="rounded-full bg-[#fff3d6] px-3 py-1 text-xs font-semibold text-[#7a5311]">
                                              {categoryLabel(action.category)}
                                            </span>

                                            <p className="mt-3 font-semibold text-black">
                                              {action.label}
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-neutral-700">
                                              {action.detail}
                                            </p>
                                          </div>

                                          <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs">
                                            <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-900">
                                              Gain +{action.estimatedGain}
                                            </span>

                                            <span className="rounded-full bg-neutral-100 px-3 py-1 font-semibold text-neutral-800">
                                              {action.estimatedMinutes} min
                                            </span>

                                            {aiSection ? (
                                              <Link
                                                href={`/admin/editorial-assistant/ai?wine=${encodeURIComponent(
                                                  analysis.id
                                                )}&section=${encodeURIComponent(
                                                  aiSection
                                                )}`}
                                                className="rounded-full border border-purple-300 bg-purple-50 px-3 py-1 font-semibold text-purple-900 hover:bg-purple-100"
                                              >
                                                ✨ Traiter avec l’IA
                                              </Link>
                                            ) : (
                                              <Link
                                                href={`/admin/catalogue/${analysis.id}`}
                                                className="rounded-full border border-[#8a6a2f] bg-white px-3 py-1 font-semibold text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
                                              >
                                                Modifier la fiche
                                              </Link>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}