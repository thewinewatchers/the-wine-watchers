"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type SummaryMetrics = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type DailyRow = {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type PageRow = {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type QueryRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type SearchConsoleResponse = {
  success: boolean;
  days: number;
  ranges: {
    current: {
      startDate: string;
      endDate: string;
    };
    previous: {
      startDate: string;
      endDate: string;
    };
  };
  summary: {
    current: SummaryMetrics;
    previous: SummaryMetrics;
  };
  daily: DailyRow[];
  pages: PageRow[];
  queries: QueryRow[];
  opportunities: QueryRow[];
  lowCtrOpportunities: QueryRow[];
};

type Period = 7 | 28 | 90;
type CockpitTab =
  | "overview"
  | "pages"
  | "queries"
  | "opportunities"
  | "assistant";

function formatInteger(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value || 0);
}

function formatPosition(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value || 0);
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getChange(current: number, previous: number) {
  if (!previous) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function formatChange(value: number, inverse = false) {
  const adjustedValue = inverse ? -value : value;
  const sign = adjustedValue > 0 ? "+" : "";

  return `${sign}${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(adjustedValue)} %`;
}

function getChangeTone(value: number, inverse = false) {
  const adjustedValue = inverse ? -value : value;

  if (adjustedValue > 0.5) return "text-green-700";
  if (adjustedValue < -0.5) return "text-red-700";

  return "text-neutral-600";
}

function getPageLabel(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname === "/"
      ? "Accueil"
      : decodeURIComponent(parsedUrl.pathname);
  } catch {
    return url || "Page inconnue";
  }
}

function MetricCard({
  label,
  value,
  change,
  inverse = false,
  helper,
}: {
  label: string;
  value: string;
  change: number;
  inverse?: boolean;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </p>

      <p className="mt-3 font-serif text-4xl text-black">{value}</p>

      <p
        className={`mt-3 text-sm font-semibold ${getChangeTone(
          change,
          inverse
        )}`}
      >
        {formatChange(change, inverse)}
      </p>

      <p className="mt-1 text-xs leading-5 text-neutral-500">{helper}</p>
    </div>
  );
}

function SearchTable({
  title,
  description,
  rows,
  kind,
}: {
  title: string;
  description: string;
  rows: Array<PageRow | QueryRow>;
  kind: "page" | "query";
}) {
  return (
    <section className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
      <h2 className="font-serif text-2xl text-black">{title}</h2>
      <p className="mt-2 text-sm text-neutral-600">{description}</p>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-600">
          Aucune donnée disponible.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#eee2cf]">
          <div className="hidden grid-cols-[1fr_90px_110px_90px_90px] gap-3 bg-[#fffaf3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600 md:grid">
            <span>{kind === "page" ? "Page" : "Requête"}</span>
            <span>Clics</span>
            <span>Impressions</span>
            <span>CTR</span>
            <span>Position</span>
          </div>

          <div className="divide-y divide-[#eee2cf]">
            {rows.map((row) => {
              const key = kind === "page"
                ? (row as PageRow).page
                : (row as QueryRow).query;

              return (
                <div
                  key={key}
                  className="grid gap-2 px-4 py-4 text-sm md:grid-cols-[1fr_90px_110px_90px_90px] md:items-center md:gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-black">
                      {kind === "page"
                        ? getPageLabel((row as PageRow).page)
                        : (row as QueryRow).query}
                    </p>

                    {kind === "page" && (
                      <p className="mt-1 truncate text-xs text-neutral-500">
                        {(row as PageRow).page}
                      </p>
                    )}
                  </div>

                  <span>{formatInteger(row.clicks)}</span>
                  <span>{formatInteger(row.impressions)}</span>
                  <span>{formatPercent(row.ctr)}</span>
                  <span>{formatPosition(row.position)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default function AdminSearchConsolePage() {
  const [period, setPeriod] = useState<Period>(28);
  const [activeTab, setActiveTab] = useState<CockpitTab>("overview");
  const [data, setData] = useState<SearchConsoleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const [querySearch, setQuerySearch] = useState("");

  async function loadSearchConsole(selectedPeriod: Period) {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/admin/search-console?days=${selectedPeriod}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.details ||
            result?.error ||
            "Impossible de charger les données Search Console."
        );
      }

      setData(result as SearchConsoleResponse);
    } catch (error) {
      console.error("Erreur dashboard Search Console :", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de charger les données Search Console."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSearchConsole(period);
  }, [period]);

  const current = data?.summary.current;
  const previous = data?.summary.previous;

  const clicksChange =
    current && previous ? getChange(current.clicks, previous.clicks) : 0;

  const impressionsChange =
    current && previous
      ? getChange(current.impressions, previous.impressions)
      : 0;

  const ctrChange =
    current && previous ? getChange(current.ctr, previous.ctr) : 0;

  const positionChange =
    current && previous ? getChange(current.position, previous.position) : 0;

  const topPages = useMemo(() => {
    return [...(data?.pages || [])]
      .sort((a, b) => {
        if (b.clicks !== a.clicks) return b.clicks - a.clicks;
        return b.impressions - a.impressions;
      })
      .slice(0, 10);
  }, [data]);

  const topQueries = useMemo(() => {
    return [...(data?.queries || [])]
      .filter((query) => query.query.trim())
      .sort((a, b) => {
        if (b.clicks !== a.clicks) return b.clicks - a.clicks;
        return b.impressions - a.impressions;
      })
      .slice(0, 10);
  }, [data]);

  const filteredPages = useMemo(() => {
    const normalized = pageSearch.trim().toLocaleLowerCase("fr");

    return [...(data?.pages || [])]
      .filter((page) =>
        !normalized
          ? true
          : `${page.page} ${getPageLabel(page.page)}`
              .toLocaleLowerCase("fr")
              .includes(normalized)
      )
      .sort((a, b) => b.impressions - a.impressions);
  }, [data, pageSearch]);

  const filteredQueries = useMemo(() => {
    const normalized = querySearch.trim().toLocaleLowerCase("fr");

    return [...(data?.queries || [])]
      .filter((query) =>
        !normalized
          ? true
          : query.query.toLocaleLowerCase("fr").includes(normalized)
      )
      .sort((a, b) => b.impressions - a.impressions);
  }, [data, querySearch]);

  const opportunityCount = data?.opportunities.length || 0;
  const lowCtrCount = data?.lowCtrOpportunities.length || 0;

  const tabs: Array<{ key: CockpitTab; label: string }> = [
    { key: "overview", label: "Vue d’ensemble" },
    { key: "pages", label: "Pages" },
    { key: "queries", label: "Requêtes" },
    { key: "opportunities", label: "Opportunités" },
    { key: "assistant", label: "Assistant SEO" },
  ];

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
            onClick={() => loadSearchConsole(period)}
            disabled={loading}
            className="rounded-full border border-[#8a6a2f] px-5 py-2 text-sm font-medium text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white disabled:opacity-50"
          >
            {loading ? "Actualisation..." : "Actualiser les données"}
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
              Cockpit SEO
            </p>

            <h1 className="mt-3 font-serif text-4xl text-black md:text-6xl">
              Google Search Console
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700">
              Performance Google, pages visibles, requêtes, opportunités et
              priorités de travail pour The Wine Watchers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[7, 28, 90].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setPeriod(value as Period)}
                className={`rounded-full px-5 py-3 text-sm font-semibold ${
                  period === value
                    ? "bg-black text-white"
                    : "border border-[#d8c9ad] bg-white text-neutral-700 hover:border-[#8a6a2f]"
                }`}
              >
                {value} jours
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-[#d8c9ad] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-5 py-3 text-sm font-semibold ${
                activeTab === tab.key
                  ? "bg-[#8a6a2f] text-white"
                  : "bg-white text-neutral-700 hover:bg-[#fffaf3]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-7 text-red-800">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-3xl border border-[#e6dcc8] bg-white p-8 text-sm text-neutral-600">
            Chargement des données Google Search Console...
          </div>
        ) : data && current && previous ? (
          <>
            <div className="mt-8 rounded-2xl border border-[#e6dcc8] bg-[#fffaf3] px-5 py-4 text-sm text-neutral-700">
              Période analysée :{" "}
              <strong>
                du {formatDate(data.ranges.current.startDate)} au{" "}
                {formatDate(data.ranges.current.endDate)}
              </strong>
              . Comparaison avec la période précédente.
            </div>

            {activeTab === "overview" && (
              <>
                <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Clics"
                    value={formatInteger(current.clicks)}
                    change={clicksChange}
                    helper="Visites obtenues depuis les résultats Google."
                  />

                  <MetricCard
                    label="Impressions"
                    value={formatInteger(current.impressions)}
                    change={impressionsChange}
                    helper="Nombre de fois où une page du site a été affichée."
                  />

                  <MetricCard
                    label="CTR"
                    value={formatPercent(current.ctr)}
                    change={ctrChange}
                    helper="Part des impressions ayant généré un clic."
                  />

                  <MetricCard
                    label="Position moyenne"
                    value={formatPosition(current.position)}
                    change={positionChange}
                    inverse
                    helper="Plus le nombre est faible, meilleure est la position."
                  />
                </section>

                <section className="mt-8 grid gap-5 md:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("pages")}
                    className="rounded-3xl border border-[#e6dcc8] bg-white p-6 text-left shadow-sm hover:border-[#8a6a2f]"
                  >
                    <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                      Pages suivies
                    </p>
                    <p className="mt-2 font-serif text-4xl text-black">
                      {data.pages.length}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("queries")}
                    className="rounded-3xl border border-[#e6dcc8] bg-white p-6 text-left shadow-sm hover:border-[#8a6a2f]"
                  >
                    <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                      Requêtes suivies
                    </p>
                    <p className="mt-2 font-serif text-4xl text-black">
                      {data.queries.length}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("opportunities")}
                    className="rounded-3xl border border-purple-200 bg-purple-50 p-6 text-left shadow-sm hover:border-purple-500"
                  >
                    <p className="text-sm uppercase tracking-[0.18em] text-purple-700">
                      Opportunités
                    </p>
                    <p className="mt-2 font-serif text-4xl text-purple-900">
                      {opportunityCount + lowCtrCount}
                    </p>
                  </button>
                </section>

                <section className="mt-8 grid gap-8 xl:grid-cols-2">
                  <SearchTable
                    title="Meilleures pages"
                    description="Pages ayant reçu le plus de clics depuis Google."
                    rows={topPages}
                    kind="page"
                  />

                  <SearchTable
                    title="Meilleures requêtes"
                    description="Recherches Google ayant généré le plus de clics."
                    rows={topQueries}
                    kind="query"
                  />
                </section>
              </>
            )}

            {activeTab === "pages" && (
              <section className="mt-8">
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="font-serif text-3xl text-black">
                      Toutes les pages
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                      {filteredPages.length} page
                      {filteredPages.length > 1 ? "s" : ""} affichée
                      {filteredPages.length > 1 ? "s" : ""}.
                    </p>
                  </div>

                  <input
                    type="search"
                    value={pageSearch}
                    onChange={(event) => setPageSearch(event.target.value)}
                    placeholder="Rechercher une page..."
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm md:max-w-md"
                  />
                </div>

                <SearchTable
                  title="Performance des pages"
                  description="Classement par nombre d’impressions."
                  rows={filteredPages}
                  kind="page"
                />
              </section>
            )}

            {activeTab === "queries" && (
              <section className="mt-8">
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="font-serif text-3xl text-black">
                      Toutes les requêtes
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                      {filteredQueries.length} requête
                      {filteredQueries.length > 1 ? "s" : ""} affichée
                      {filteredQueries.length > 1 ? "s" : ""}.
                    </p>
                  </div>

                  <input
                    type="search"
                    value={querySearch}
                    onChange={(event) => setQuerySearch(event.target.value)}
                    placeholder="Rechercher un mot-clé..."
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm md:max-w-md"
                  />
                </div>

                <SearchTable
                  title="Performance des requêtes"
                  description="Classement par nombre d’impressions."
                  rows={filteredQueries}
                  kind="query"
                />
              </section>
            )}

            {activeTab === "opportunities" && (
              <section className="mt-8 grid gap-8 xl:grid-cols-2">
                <SearchTable
                  title="Proches de la première page"
                  description="Requêtes situées entre les positions 8 et 25 avec au moins 10 impressions."
                  rows={data.opportunities}
                  kind="query"
                />

                <SearchTable
                  title="CTR faible"
                  description="Requêtes visibles mais peu cliquées malgré une position intéressante."
                  rows={data.lowCtrOpportunities}
                  kind="query"
                />
              </section>
            )}

            {activeTab === "assistant" && (
              <section className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-purple-200 bg-purple-50 p-6 md:p-8">
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-700">
                    Travail conseillé
                  </p>

                  <h2 className="mt-3 font-serif text-3xl text-purple-950">
                    Commencer par les opportunités proches de la première page
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-purple-900">
                    Ces requêtes ont déjà de la visibilité. Un meilleur titre,
                    une meta description plus attractive et un contenu enrichi
                    peuvent améliorer leur potentiel de clic et de classement.
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveTab("opportunities")}
                    className="mt-6 rounded-full bg-purple-800 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-900"
                  >
                    Voir les opportunités
                  </button>
                </div>

                <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 md:p-8">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#8a6a2f]">
                    Analyse des fiches
                  </p>

                  <h2 className="mt-3 font-serif text-3xl text-black">
                    Croiser les données Google avec l’Assistant SEO
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-neutral-700">
                    L’Assistant SEO du catalogue indique déjà les contenus
                    manquants, les métadonnées trop courtes et les priorités de
                    correction fiche par fiche.
                  </p>

                  <Link
                    href="/admin/seo"
                    className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-[#8a6a2f]"
                  >
                    Ouvrir l’Assistant SEO
                  </Link>
                </div>
              </section>
            )}
          </>
        ) : null}
      </div>
    </main>
  );
}