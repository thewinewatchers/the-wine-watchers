"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type AiSection =
  | "story"
  | "tasting_notes"
  | "food_pairings"
  | "tww_opinion"
  | "seo_title"
  | "seo_description";

type EditorialAnalysis = {
  id: string;
  slug: string | null;
  name: string;
  producer: string | null;
  appellation: string | null;
  region: string | null;
  score: number;
  certification: string;
  starsLabel: string;
};

type EditorialAssistantResponse = {
  success: boolean;
  analyses: EditorialAnalysis[];
};

type AiResponse = {
  success: boolean;
  section: AiSection;
  sectionLabel: string;
  proposal: string;
  model: string;
  requestId: string | null;
};

const SECTION_TO_FIELD: Partial<Record<AiSection, string>> = {
  story: "story",
  tasting_notes: "tasting_notes",
  food_pairings: "pairing",
  tww_opinion: "meta_content",
  seo_title: "seo_title",
  seo_description: "seo_description",
};

function parseCurrentContent(value: unknown) {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean)
      .join("\n\n");
  }

  return String(value).trim();
}

const SECTIONS: Array<{
  value: AiSection;
  label: string;
  helper: string;
}> = [
  { value: "story", label: "Histoire du vin", helper: "Développer le domaine, le terroir, la cuvée et son identité." },
  { value: "tasting_notes", label: "Notes de dégustation", helper: "Structurer le nez, la bouche, l’équilibre et la finale." },
  { value: "food_pairings", label: "Accords mets-vins", helper: "Proposer des accords gastronomiques cohérents et argumentés." },
  { value: "tww_opinion", label: "Avis The Wine Watchers", helper: "Rédiger un avis distinctif, précis et premium." },
  { value: "seo_title", label: "Title SEO", helper: "Créer un Title clair et optimisé pour Google." },
  { value: "seo_description", label: "Meta description", helper: "Créer une description attractive et informative pour Google." },
];

function getSectionLabel(section: AiSection) {
  return SECTIONS.find((item) => item.value === section)?.label || section;
}

function getSectionHelper(section: AiSection) {
  return SECTIONS.find((item) => item.value === section)?.helper || "";
}

export default function AdminEditorialAssistantAiPage() {
  const [analyses, setAnalyses] = useState<EditorialAnalysis[]>([]);
  const [loadingWines, setLoadingWines] = useState(true);
  const [wineError, setWineError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedWineId, setSelectedWineId] = useState("");
  const [section, setSection] = useState<AiSection>("tww_opinion");
  const [existingContent, setExistingContent] = useState("");
  const [proposal, setProposal] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [loadingCurrentContent, setLoadingCurrentContent] = useState(false);

  useEffect(() => {
    async function loadWines() {
      setLoadingWines(true);
      setWineError("");

      try {
        const response = await fetch("/api/admin/editorial-assistant", { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.details || result?.error || "Impossible de charger les fiches."
          );
        }

        const loadedAnalyses = (result as EditorialAssistantResponse).analyses || [];
        setAnalyses(loadedAnalyses);

        const requestedWineId =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("wine")
            : null;

        const requestedWineExists =
          requestedWineId &&
          loadedAnalyses.some((wine) => wine.id === requestedWineId);

        if (requestedWineExists && requestedWineId) {
          setSelectedWineId(requestedWineId);
        } else if (loadedAnalyses.length > 0) {
          setSelectedWineId(loadedAnalyses[0].id);
        }
      } catch (error) {
        setWineError(
          error instanceof Error ? error.message : "Impossible de charger les fiches."
        );
      } finally {
        setLoadingWines(false);
      }
    }

    loadWines();
  }, []);

  useEffect(() => {
    async function loadCurrentContent() {
      if (!selectedWineId) {
        setExistingContent("");
        return;
      }

      const field = SECTION_TO_FIELD[section];

      if (!field) {
        setExistingContent("");
        return;
      }

      setLoadingCurrentContent(true);
      setGenerationError("");
      setSaveMessage("");

      try {
        const { data, error } = await supabase
          .from("wines")
          .select(field)
          .eq("id", selectedWineId)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        const row = (data || {}) as Record<string, unknown>;
        setExistingContent(parseCurrentContent(row[field]));
      } catch (error) {
        setGenerationError(
          error instanceof Error
            ? `Impossible de charger le contenu actuel : ${error.message}`
            : "Impossible de charger le contenu actuel."
        );
        setExistingContent("");
      } finally {
        setLoadingCurrentContent(false);
      }
    }

    loadCurrentContent();
  }, [selectedWineId, section]);

  const selectedWine = useMemo(
    () => analyses.find((wine) => wine.id === selectedWineId) || null,
    [analyses, selectedWineId]
  );

  const filteredWines = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("fr");
    if (!normalizedSearch) return analyses;

    return analyses.filter((wine) =>
      [wine.name, wine.producer, wine.appellation, wine.region]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("fr")
        .includes(normalizedSearch)
    );
  }, [analyses, search]);

  function handleSelectWine(id: string) {
    setSelectedWineId(id);
    setProposal("");
    setGenerationError("");
    setCopied(false);
    setSaveMessage("");
  }

  function handleSectionChange(nextSection: AiSection) {
    setSection(nextSection);
    setProposal("");
    setGenerationError("");
    setCopied(false);
    setSaveMessage("");
  }

  async function generateProposal() {
    if (!selectedWine) {
      setGenerationError("Sélectionne d’abord un vin.");
      return;
    }

    setGenerating(true);
    setGenerationError("");
    setCopied(false);

    try {
      const response = await fetch("/api/admin/editorial-assistant/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          wine: {
            id: selectedWine.id,
            name: selectedWine.name,
            producer: selectedWine.producer,
            appellation: selectedWine.appellation,
            region: selectedWine.region,
            existingContent,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.details || result?.error || "Impossible de générer la proposition."
        );
      }

      setProposal((result as AiResponse).proposal || "");
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Impossible de générer la proposition."
      );
    } finally {
      setGenerating(false);
    }
  }

  async function copyProposal() {
    if (!proposal) return;

    try {
      await navigator.clipboard.writeText(proposal);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setGenerationError("Impossible de copier automatiquement le texte.");
    }
  }

  async function saveProposal() {
    if (!selectedWine || !proposal) return;

    const field = SECTION_TO_FIELD[section];

    if (!field) {
      setGenerationError(
        "Cette rubrique n’est pas encore reliée à un champ enregistrable."
      );
      return;
    }

    const confirmed = window.confirm(
      `Confirmer l’enregistrement de « ${getSectionLabel(section)} » dans la fiche ${selectedWine.name} ?`
    );

    if (!confirmed) return;

    setSaving(true);
    setGenerationError("");
    setSaveMessage("");

    try {
      const payload =
        section === "tasting_notes"
          ? { [field]: [proposal.trim()] }
          : { [field]: proposal.trim() };

      const response = await fetch(`/api/admin/wines/${selectedWine.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.details ||
            result?.error ||
            "Impossible d’enregistrer la proposition."
        );
      }

      setSaveMessage(
        `${getSectionLabel(section)} enregistré avec succès dans la fiche.`
      );
      setExistingContent(proposal);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Impossible d’enregistrer la proposition."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/admin/editorial-assistant" className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black">
            ← Retour Assistant éditorial
          </Link>

          <Link href="/admin" className="text-sm uppercase tracking-[0.25em] text-neutral-500 hover:text-black">
            Centre de pilotage
          </Link>
        </div>

        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">The Wine Watchers</p>
          <h1 className="mt-3 font-serif text-4xl text-black md:text-6xl">Atelier IA éditorial</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700">
            Génère une proposition éditoriale à partir des informations de la fiche. Aucun texte n’est enregistré automatiquement : tu gardes toujours la validation finale.
          </p>
        </div>

        {wineError && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-7 text-red-800">
            {wineError}
          </div>
        )}

        <section className="mt-10 grid gap-8 xl:grid-cols-[360px_1fr]">
          <aside className="rounded-3xl border border-[#e6dcc8] bg-white p-5 shadow-sm md:p-6">
            <h2 className="font-serif text-2xl text-black">1. Choisir un vin</h2>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un vin..."
              className="mt-5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
            />

            {loadingWines ? (
              <p className="mt-5 text-sm text-neutral-600">Chargement du catalogue...</p>
            ) : (
              <div className="mt-5 max-h-[620px] space-y-2 overflow-y-auto pr-1">
                {filteredWines.map((wine) => {
                  const isSelected = wine.id === selectedWineId;

                  return (
                    <button
                      key={wine.id}
                      type="button"
                      onClick={() => handleSelectWine(wine.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-[#8a6a2f] bg-[#fffaf3]"
                          : "border-[#eee2cf] bg-white hover:border-[#8a6a2f]"
                      }`}
                    >
                      <p className="font-serif text-lg text-black">{wine.name}</p>
                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        {[wine.producer, wine.appellation].filter(Boolean).join(" · ") || "Informations incomplètes"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-neutral-100 px-2 py-1 font-semibold text-neutral-700">
                          {wine.score}/100
                        </span>
                        <span className="rounded-full bg-neutral-100 px-2 py-1 font-semibold text-neutral-700">
                          {wine.certification}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          <div className="space-y-8">
            {selectedWine ? (
              <>
                <section className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-[#8a6a2f]">Fiche sélectionnée</p>
                      <h2 className="mt-2 font-serif text-3xl text-black">{selectedWine.name}</h2>
                      <p className="mt-3 text-sm leading-7 text-neutral-600">
                        {[selectedWine.producer, selectedWine.appellation, selectedWine.region]
                          .filter(Boolean)
                          .join(" · ") || "Informations incomplètes"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#fffaf3] px-4 py-2 text-sm font-semibold text-black">
                        {selectedWine.score}/100
                      </span>
                      <span className="rounded-full bg-[#fffaf3] px-4 py-2 text-sm font-semibold text-black">
                        {selectedWine.certification}
                      </span>
                      <Link
                        href={`/admin/catalogue/${selectedWine.id}`}
                        className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-[#8a6a2f]"
                      >
                        Modifier la fiche
                      </Link>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
                  <h2 className="font-serif text-2xl text-black">2. Choisir la section</h2>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {SECTIONS.map((item) => {
                      const isSelected = item.value === section;

                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => handleSectionChange(item.value)}
                          className={`rounded-2xl border p-4 text-left ${
                            isSelected
                              ? "border-[#8a6a2f] bg-[#fffaf3]"
                              : "border-[#eee2cf] bg-white hover:border-[#8a6a2f]"
                          }`}
                        >
                          <p className="font-semibold text-black">{item.label}</p>
                          <p className="mt-2 text-xs leading-5 text-neutral-600">{item.helper}</p>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
                  <h2 className="font-serif text-2xl text-black">3. Contenu actuel</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Le contenu déjà enregistré dans la fiche est chargé automatiquement. Tu peux le corriger ici avant de demander une nouvelle proposition.
                  </p>

                  {loadingCurrentContent && (
                    <div className="mt-4 rounded-2xl border border-[#e6dcc8] bg-[#fffaf3] px-4 py-3 text-sm text-neutral-600">
                      Chargement du contenu actuel...
                    </div>
                  )}


                  <textarea
                    value={existingContent}
                    onChange={(event) => setExistingContent(event.target.value)}
                    rows={10}
                    disabled={loadingCurrentContent}
                    placeholder={`Contenu actuel — ${getSectionLabel(section)}`}
                    className="mt-5 w-full rounded-2xl border border-neutral-300 px-4 py-4 text-sm leading-7 outline-none focus:border-[#8a6a2f]"
                  />

                  <div className="mt-4 rounded-2xl bg-[#fffaf3] px-4 py-3 text-sm text-neutral-700">
                    <strong>{getSectionLabel(section)}</strong> — {getSectionHelper(section)}
                  </div>
                </section>

                <section className="rounded-3xl border border-[#8a6a2f] bg-[#fffaf3] p-6 shadow-sm md:p-8">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-[#8a6a2f]">4. Proposition IA</p>
                      <h2 className="mt-2 font-serif text-3xl text-black">{getSectionLabel(section)}</h2>
                    </div>

                    <button
                      type="button"
                      onClick={generateProposal}
                      disabled={generating}
                      className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-[#8a6a2f] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {generating
                        ? "Génération en cours..."
                        : proposal
                          ? "Régénérer"
                          : "✨ Générer une proposition"}
                    </button>
                  </div>

                  {generationError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
                      {generationError}
                    </div>
                  )}

                  {proposal ? (
                    <>
                      <textarea
                        value={proposal}
                        onChange={(event) => setProposal(event.target.value)}
                        rows={14}
                        className="mt-6 w-full rounded-2xl border border-[#d8c9ad] bg-white px-5 py-5 text-sm leading-7 outline-none focus:border-[#8a6a2f]"
                      />

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={copyProposal}
                          className="rounded-full border border-[#8a6a2f] bg-white px-5 py-2.5 text-sm font-semibold text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
                        >
                          {copied ? "Copié ✓" : "Copier"}
                        </button>

                        {SECTION_TO_FIELD[section] ? (
                          <button
                            type="button"
                            onClick={saveProposal}
                            disabled={saving}
                            className="rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                          >
                            {saving ? "Enregistrement..." : "Valider et enregistrer"}
                          </button>
                        ) : (
                          <span className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-500">
                            Enregistrement non disponible
                          </span>
                        )}

                        <Link
                          href={`/admin/catalogue/${selectedWine.id}`}
                          className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8a6a2f]"
                        >
                          Ouvrir la fiche
                        </Link>
                      </div>

                      {saveMessage && (
                        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                          {saveMessage}
                        </div>
                      )}

                      <p className="mt-5 text-xs leading-5 text-neutral-500">
                        L’enregistrement nécessite toujours une confirmation explicite. L’Avis The Wine Watchers est enregistré dans « Informations complémentaires », conformément à la structure actuelle des fiches.
                      </p>
                    </>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-[#cdbb9a] bg-white/60 p-8 text-center text-sm leading-7 text-neutral-600">
                      Aucune proposition générée pour le moment.
                    </div>
                  )}
                </section>
              </>
            ) : (
              <div className="rounded-3xl border border-[#e6dcc8] bg-white p-8 text-sm text-neutral-600">
                Sélectionne un vin pour commencer.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}