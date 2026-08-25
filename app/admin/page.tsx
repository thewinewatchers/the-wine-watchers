"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type PriorityMission = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  priorityScore: number;
  priorityStarsLabel: string;
  priorityReasons: string[];
};

type SearchConsoleResponse = {
  success: boolean;
  summary: {
    current: {
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    };
  };
  priorityMissions: PriorityMission[];
};

type EditorialAnalysis = {
  id: string;
  name: string;
  producer: string | null;
  appellation: string | null;
  region: string | null;
  score: number;
  certification: string;
  starsLabel: string;
  estimatedMinutes: number;
  potentialGain: number;
  actions: Array<{
    label: string;
    detail: string;
  }>;
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
  };
  analyses: EditorialAnalysis[];
};

const adminLinks = [
  {
    title: "Catalogue",
    href: "/admin/catalogue",
    description:
      "Ajouter, modifier, dupliquer et administrer toutes les fiches vins.",
  },
  {
    title: "Importer des vins",
    href: "/admin/import",
    description:
      "Ajouter ou mettre à jour le catalogue via fichier Excel / CSV.",
  },
  {
    title: "Cockpit SEO",
    href: "/admin/search-console",
    description:
      "Consulter Search Console, les requêtes, les opportunités et les missions SEO.",
  },
  {
    title: "Assistant éditorial",
    href: "/admin/editorial-assistant",
    description:
      "Analyser la qualité des fiches et suivre les actions recommandées.",
  },
  {
    title: "Santé SEO du catalogue",
    href: "/admin/seo",
    description:
      "Contrôler les métadonnées, les contenus, les images et les données produit.",
  },
  {
    title: "Producteurs",
    href: "/admin/producteurs",
    description:
      "Gérer le référentiel des producteurs : renommer, fusionner, activer ou désactiver.",
  },
  {
    title: "Appellations",
    href: "/admin/appellations",
    description:
      "Gérer le référentiel des appellations : renommer, fusionner, activer ou désactiver.",
  },
  {
    title: "Commandes",
    href: "/admin/orders",
    description:
      "Consulter les commandes, devis PDF, factures PDF et paiements.",
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    description:
      "Consulter les inscrits à la newsletter et suivre les inscriptions.",
  },
  {
    title: "Tarifs de livraison",
    href: "/admin/livraison",
    description:
      "Visualiser les frais de livraison par pays, poids et transporteur.",
  },
  {
    title: "Pages du site",
    href: "/admin/pages",
    description:
      "Modifier les CGV, mentions légales, livraison, confidentialité et politique de cookies.",
  },
  {
    title: "Images",
    href: "/admin/images",
    description:
      "Gérer les images utilisées pour les fiches vins et la boutique.",
  },
  {
    title: "Paniers abandonnés",
    href: "/admin/abandoned-carts",
    description:
      "Suivre les paniers créés mais non transformés en commandes.",
  },
];

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

function formatMinutes(value: number) {
  if (value < 60) return `${value} min`;

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return minutes > 0 ? `${hours} h ${minutes}` : `${hours} h`;
}

export default function AdminDashboardPage() {
  const [searchData, setSearchData] =
    useState<SearchConsoleResponse | null>(null);
  const [editorialData, setEditorialData] =
    useState<EditorialAssistantResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setErrorMessage("");

    try {
      const [searchResponse, editorialResponse] = await Promise.all([
        fetch("/api/admin/search-console?days=28", {
          cache: "no-store",
        }),
        fetch("/api/admin/editorial-assistant", {
          cache: "no-store",
        }),
      ]);

      const [searchResult, editorialResult] = await Promise.all([
        searchResponse.json(),
        editorialResponse.json(),
      ]);

      if (!searchResponse.ok) {
        throw new Error(
          searchResult?.details ||
            searchResult?.error ||
            "Impossible de charger Search Console."
        );
      }

      if (!editorialResponse.ok) {
        throw new Error(
          editorialResult?.details ||
            editorialResult?.error ||
            "Impossible de charger l’Assistant éditorial."
        );
      }

      setSearchData(searchResult as SearchConsoleResponse);
      setEditorialData(editorialResult as EditorialAssistantResponse);
    } catch (error) {
      console.error("Erreur Centre de pilotage :", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de charger le Centre de pilotage."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const topMissions = useMemo(
    () => (searchData?.priorityMissions || []).slice(0, 5),
    [searchData]
  );

  const editorialPriorities = useMemo(
    () => (editorialData?.analyses || []).slice(0, 5),
    [editorialData]
  );

  const searchSummary = searchData?.summary.current;
  const editorialSummary = editorialData?.summary;

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
              The Wine Watchers
            </p>

            <h1 className="mt-4 font-serif text-4xl text-black md:text-6xl">
              Centre de pilotage
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700">
              Synthèse du catalogue, de la qualité éditoriale, des performances
              Google et des principales actions à mener.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="rounded-full border border-[#8a6a2f] px-5 py-3 text-sm font-semibold text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white disabled:opacity-50"
          >
            {loading ? "Actualisation..." : "Actualiser le tableau de bord"}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-7 text-red-800">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-3xl border border-[#e6dcc8] bg-white p-8 text-sm text-neutral-600">
            Chargement du Centre de pilotage...
          </div>
        ) : (
          <>
            <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/admin/editorial-assistant"
                className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm hover:border-[#8a6a2f]"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                  Score éditorial moyen
                </p>
                <p className="mt-2 font-serif text-4xl text-black">
                  {editorialSummary?.averageScore || 0}/100
                </p>
                <p className="mt-3 text-sm text-neutral-600">
                  {editorialSummary?.total || 0} fiches analysées
                </p>
              </Link>

              <Link
                href="/admin/editorial-assistant"
                className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm hover:border-red-500"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-red-700">
                  Fiches prioritaires
                </p>
                <p className="mt-2 font-serif text-4xl text-red-900">
                  {editorialSummary?.priorityCount || 0}
                </p>
                <p className="mt-3 text-sm text-red-800">
                  Score inférieur à 70/100
                </p>
              </Link>

              <Link
                href="/admin/search-console"
                className="rounded-3xl border border-purple-200 bg-purple-50 p-6 shadow-sm hover:border-purple-500"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-purple-700">
                  Missions SEO
                </p>
                <p className="mt-2 font-serif text-4xl text-purple-900">
                  {searchData?.priorityMissions.length || 0}
                </p>
                <p className="mt-3 text-sm text-purple-800">
                  Priorités détectées sur 28 jours
                </p>
              </Link>

              <Link
                href="/admin/editorial-assistant"
                className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm hover:border-yellow-500"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-yellow-700">
                  Certifiées Or +
                </p>
                <p className="mt-2 font-serif text-4xl text-yellow-900">
                  {editorialSummary?.certifiedCount || 0}
                </p>
                <p className="mt-3 text-sm text-yellow-800">
                  Fiches ayant un score de 90 ou plus
                </p>
              </Link>
            </section>

            <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                  Clics Google
                </p>
                <p className="mt-2 font-serif text-4xl text-black">
                  {formatInteger(searchSummary?.clicks || 0)}
                </p>
                <p className="mt-3 text-sm text-neutral-600">
                  Sur les 28 derniers jours analysés
                </p>
              </div>

              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                  Impressions Google
                </p>
                <p className="mt-2 font-serif text-4xl text-black">
                  {formatInteger(searchSummary?.impressions || 0)}
                </p>
                <p className="mt-3 text-sm text-neutral-600">
                  Apparitions du site dans les résultats
                </p>
              </div>

              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                  CTR
                </p>
                <p className="mt-2 font-serif text-4xl text-black">
                  {formatPercent(searchSummary?.ctr || 0)}
                </p>
                <p className="mt-3 text-sm text-neutral-600">
                  Taux de clic depuis Google
                </p>
              </div>

              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                  Position moyenne
                </p>
                <p className="mt-2 font-serif text-4xl text-black">
                  {formatPosition(searchSummary?.position || 0)}
                </p>
                <p className="mt-3 text-sm text-neutral-600">
                  Plus le nombre est faible, meilleure est la position
                </p>
              </div>
            </section>

            <section className="mt-8 grid gap-8 xl:grid-cols-2">
              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-[#8a6a2f]">
                      Search Console
                    </p>
                    <h2 className="mt-2 font-serif text-3xl text-black">
                      Missions SEO prioritaires
                    </h2>
                  </div>

                  <Link
                    href="/admin/search-console"
                    className="rounded-full border border-[#8a6a2f] px-4 py-2 text-sm font-semibold text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
                  >
                    Ouvrir
                  </Link>
                </div>

                {topMissions.length === 0 ? (
                  <p className="mt-6 text-sm text-neutral-600">
                    Aucune mission prioritaire détectée.
                  </p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {topMissions.map((mission, index) => (
                      <div
                        key={`${mission.query}-${index}`}
                        className="rounded-2xl border border-[#eee2cf] bg-[#fffaf3] p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.14em] text-[#8a6a2f]">
                              Mission #{index + 1}
                            </p>
                            <p className="mt-2 font-serif text-xl text-black">
                              {mission.query}
                            </p>
                            <p className="mt-2 text-sm text-neutral-700">
                              {mission.priorityStarsLabel} · Position{" "}
                              {formatPosition(mission.position)}
                            </p>
                          </div>

                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                            {mission.priorityScore}/120
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-[#8a6a2f]">
                      Assistant éditorial
                    </p>
                    <h2 className="mt-2 font-serif text-3xl text-black">
                      Fiches à améliorer
                    </h2>
                  </div>

                  <Link
                    href="/admin/editorial-assistant"
                    className="rounded-full border border-[#8a6a2f] px-4 py-2 text-sm font-semibold text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
                  >
                    Ouvrir
                  </Link>
                </div>

                {editorialPriorities.length === 0 ? (
                  <p className="mt-6 text-sm text-neutral-600">
                    Aucune fiche prioritaire détectée.
                  </p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {editorialPriorities.map((analysis) => (
                      <div
                        key={analysis.id}
                        className="rounded-2xl border border-[#eee2cf] bg-[#fffaf3] p-4"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="font-serif text-xl text-black">
                              {analysis.name}
                            </p>
                            <p className="mt-2 text-sm text-neutral-600">
                              {[analysis.producer, analysis.appellation]
                                .filter(Boolean)
                                .join(" · ") || "Informations incomplètes"}
                            </p>
                            <p className="mt-2 text-sm text-neutral-700">
                              {analysis.certification} · {analysis.starsLabel}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                              {analysis.score}/100
                            </span>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                              {formatMinutes(analysis.estimatedMinutes)}
                            </span>
                            <Link
                              href={`/admin/catalogue/${analysis.id}`}
                              className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white hover:bg-[#8a6a2f]"
                            >
                              Modifier
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="mt-10">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
                  Outils d’administration
                </p>
                <h2 className="mt-2 font-serif text-3xl text-black">
                  Accès rapide
                </h2>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {adminLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-[2rem] border border-[#e6dcc8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#8a6a2f] hover:shadow-xl"
                  >
                    <h3 className="font-serif text-2xl text-black group-hover:text-[#8a1f1f]">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-neutral-700">
                      {item.description}
                    </p>

                    <span className="mt-6 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#8a6a2f]">
                      Ouvrir →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}