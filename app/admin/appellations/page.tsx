"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type AppellationReference = {
  id: string;
  name: string;
  region: string | null;
  category: string | null;
  active: boolean;
  created_at: string | null;
};

type WineReference = {
  appellation: string | null;
};

type AppellationDialog =
  | {
      type: "rename";
      appellation: AppellationReference;
      nextName: string;
    }
  | {
      type: "merge";
      appellation: AppellationReference;
      targetId: string;
    }
  | {
      type: "toggle";
      appellation: AppellationReference;
    }
  | null;

export default function AdminAppellationsPage() {
  const [appellations, setAppellations] = useState<AppellationReference[]>([]);
  const [wines, setWines] = useState<WineReference[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<AppellationDialog>(null);

  async function loadAppellations() {
    setLoading(true);
    setErrorMessage("");

    const [
      { data: appellationData, error: appellationError },
      { data: wineData, error: wineError },
    ] = await Promise.all([
      supabase
        .from("appellations")
        .select("id, name, region, category, active, created_at")
        .order("name", { ascending: true }),
      supabase
        .from("wines")
        .select("appellation"),
    ]);

    if (appellationError || wineError) {
      console.error(
        "Erreur chargement appellations :",
        appellationError || wineError
      );
      setErrorMessage(
        "Impossible de charger les appellations et leur nombre de vins."
      );
      setLoading(false);
      return;
    }

    setAppellations((appellationData || []) as AppellationReference[]);
    setWines((wineData || []) as WineReference[]);
    setLoading(false);
  }

  useEffect(() => {
    loadAppellations();
  }, []);

  const filteredAppellations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return appellations;

    return appellations.filter((appellation) =>
      [
        appellation.name,
        appellation.region,
        appellation.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [appellations, search]);

  const wineCountByAppellation = useMemo(() => {
    const counts = new Map<string, number>();

    wines.forEach((wine) => {
      const appellation = String(wine.appellation || "").trim();

      if (!appellation) return;

      counts.set(appellation, (counts.get(appellation) || 0) + 1);
    });

    return counts;
  }, [wines]);

  function formatCreatedAt(value: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }

  const activeCount = useMemo(
    () => appellations.filter((appellation) => appellation.active).length,
    [appellations]
  );

  const inactiveCount = appellations.length - activeCount;

  async function runAction(
    appellationId: string,
    payload: Record<string, unknown>
  ) {
    setUpdatingId(appellationId);
    setErrorMessage("");
    setSuccessMessage("");

    const response = await fetch(`/api/admin/appellations/${appellationId}`, {
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
          "Une erreur est survenue lors de la mise à jour."
      );
      setUpdatingId(null);
      return false;
    }

    setUpdatingId(null);
    await loadAppellations();
    return true;
  }

  function openRenameDialog(appellation: AppellationReference) {
    setErrorMessage("");
    setSuccessMessage("");
    setDialog({
      type: "rename",
      appellation,
      nextName: appellation.name,
    });
  }

  function openMergeDialog(appellation: AppellationReference) {
    const firstTarget = appellations.find((item) => item.id !== appellation.id);

    if (!firstTarget) {
      setErrorMessage("Aucune autre appellation n’est disponible.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setDialog({
      type: "merge",
      appellation,
      targetId: firstTarget.id,
    });
  }

  function openToggleDialog(appellation: AppellationReference) {
    setErrorMessage("");
    setSuccessMessage("");
    setDialog({
      type: "toggle",
      appellation,
    });
  }

  async function confirmDialogAction() {
    if (!dialog) return;

    const source = dialog.appellation;

    if (dialog.type === "rename") {
      const cleanedName = dialog.nextName.trim();

      if (!cleanedName) {
        setErrorMessage("Le nouveau nom est obligatoire.");
        return;
      }

      if (cleanedName === source.name) {
        setDialog(null);
        return;
      }

      const success = await runAction(source.id, {
        action: "rename",
        name: cleanedName,
      });

      if (success) {
        setSuccessMessage(
          `L’appellation "${source.name}" a été renommée en "${cleanedName}".`
        );
        setDialog(null);
      }

      return;
    }

    if (dialog.type === "merge") {
      const target = appellations.find(
        (item) => item.id === dialog.targetId
      );

      if (!target) {
        setErrorMessage("L’appellation de destination est introuvable.");
        return;
      }

      const success = await runAction(source.id, {
        action: "merge",
        targetId: target.id,
      });

      if (success) {
        setSuccessMessage(
          `L’appellation "${source.name}" a été fusionnée vers "${target.name}".`
        );
        setDialog(null);
      }

      return;
    }

    const success = await runAction(source.id, {
      action: "toggle-active",
    });

    if (success) {
      setSuccessMessage(
        `L’appellation "${source.name}" a été ${
          source.active ? "désactivée" : "réactivée"
        }.`
      );
      setDialog(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin"
            className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
          >
            ← Retour administration
          </Link>

          <Link
            href="/admin/catalogue"
            className="rounded-full border border-[#8a6a2f] px-5 py-2 text-sm font-medium text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
          >
            Ouvrir le catalogue
          </Link>
        </div>

        <p className="mt-10 text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
          Référentiel
        </p>

        <h1 className="mt-3 font-serif text-4xl text-black md:text-6xl">
          Appellations
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700">
          Cette page regroupe les appellations permanentes utilisées dans le
          catalogue. Elles restent disponibles même lorsqu’aucun vin ne leur est
          momentanément associé.
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
              Total
            </p>
            <p className="mt-2 font-serif text-4xl text-black">
              {appellations.length}
            </p>
          </div>

          <div className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-green-700">
              Actives
            </p>
            <p className="mt-2 font-serif text-4xl text-green-900">
              {activeCount}
            </p>
          </div>

          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-orange-700">
              Inactives
            </p>
            <p className="mt-2 font-serif text-4xl text-orange-900">
              {inactiveCount}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-black">
                Liste des appellations
              </h2>

              <p className="mt-2 text-sm text-neutral-600">
                {filteredAppellations.length} résultat
                {filteredAppellations.length > 1 ? "s" : ""}
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une appellation..."
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm md:max-w-md"
            />
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              {successMessage}
            </div>
          )}

          {loading ? (
            <p className="mt-8 text-sm text-neutral-600">
              Chargement des appellations...
            </p>
          ) : filteredAppellations.length === 0 ? (
            <p className="mt-8 text-sm text-neutral-600">
              Aucune appellation trouvée.
            </p>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#eee2cf]">
              <div className="hidden grid-cols-[1.35fr_0.8fr_0.8fr_0.4fr_0.65fr_0.55fr_1.6fr] gap-4 bg-[#fffaf3] px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600 lg:grid">
                <span>Appellation</span>
                <span>Région</span>
                <span>Catégorie</span>
                <span>Vins</span>
                <span>Création</span>
                <span>Statut</span>
                <span>Action</span>
              </div>

              <div className="divide-y divide-[#eee2cf]">
                {filteredAppellations.map((appellation) => (
                  <div
                    key={appellation.id}
                    className="grid gap-3 px-5 py-5 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.4fr_0.65fr_0.55fr_1.6fr] lg:items-center lg:gap-4"
                  >
                    <div>
                      <p className="font-serif text-lg text-black">
                        {appellation.name}
                      </p>
                    </div>

                    <p className="text-sm text-neutral-700">
                      {appellation.region || "—"}
                    </p>

                    <p className="text-sm text-neutral-700">
                      {appellation.category || "—"}
                    </p>

                    <p className="text-sm font-semibold text-black">
                      {wineCountByAppellation.get(appellation.name) || 0}
                    </p>

                    <p className="text-sm text-neutral-700">
                      {formatCreatedAt(appellation.created_at)}
                    </p>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                          appellation.active
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {appellation.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/catalogue?search=${encodeURIComponent(
                          appellation.name
                        )}`}
                        className="inline-flex rounded-full border border-[#8a6a2f] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
                      >
                        Voir
                      </Link>

                      <button
                        type="button"
                        onClick={() => openRenameDialog(appellation)}
                        disabled={updatingId === appellation.id}
                        className="rounded-full border border-blue-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                      >
                        Renommer
                      </button>

                      <button
                        type="button"
                        onClick={() => openMergeDialog(appellation)}
                        disabled={updatingId === appellation.id}
                        className="rounded-full border border-purple-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                      >
                        Fusionner
                      </button>

                      <button
                        type="button"
                        onClick={() => openToggleDialog(appellation)}
                        disabled={updatingId === appellation.id}
                        className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] disabled:opacity-50 ${
                          appellation.active
                            ? "border-orange-300 text-orange-700 hover:bg-orange-50"
                            : "border-green-300 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {updatingId === appellation.id
                          ? "Mise à jour..."
                          : appellation.active
                            ? "Désactiver"
                            : "Réactiver"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xl rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-2xl md:p-8"
          >
            <p className="text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
              Action sécurisée
            </p>

            <h2 className="mt-3 font-serif text-3xl text-black">
              {dialog.type === "rename"
                ? "Renommer une appellation"
                : dialog.type === "merge"
                  ? "Fusionner deux appellations"
                  : dialog.appellation.active
                    ? "Désactiver une appellation"
                    : "Réactiver une appellation"}
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-700">
              Appellation concernée :{" "}
              <strong className="text-black">{dialog.appellation.name}</strong>
            </p>

            <div className="mt-5 rounded-2xl border border-[#eee2cf] bg-[#fffaf3] p-4 text-sm leading-7 text-neutral-700">
              <p>
                <strong className="text-black">
                  {wineCountByAppellation.get(dialog.appellation.name) || 0}
                </strong>{" "}
                vin
                {(wineCountByAppellation.get(dialog.appellation.name) || 0) > 1
                  ? "s"
                  : ""}{" "}
                actuellement associé
                {(wineCountByAppellation.get(dialog.appellation.name) || 0) > 1
                  ? "s"
                  : ""}.
              </p>

              {dialog.type === "rename" && (
                <p>
                  Tous les vins concernés seront automatiquement mis à jour.
                </p>
              )}

              {dialog.type === "merge" && (
                <p>
                  Les vins seront déplacés vers la destination et l’ancienne
                  appellation sera supprimée du référentiel. Cette opération est
                  irréversible.
                </p>
              )}

              {dialog.type === "toggle" && (
                <p>
                  Les vins existants resteront inchangés. L’appellation sera
                  seulement {dialog.appellation.active ? "retirée des" : "réintégrée aux"} listes de sélection.
                </p>
              )}
            </div>

            {dialog.type === "rename" && (
              <div className="mt-6">
                <label className="text-sm font-semibold text-black">
                  Nouveau nom
                </label>
                <input
                  autoFocus
                  value={dialog.nextName}
                  onChange={(event) =>
                    setDialog({
                      ...dialog,
                      nextName: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>
            )}

            {dialog.type === "merge" && (
              <div className="mt-6">
                <label className="text-sm font-semibold text-black">
                  Appellation de destination
                </label>
                <select
                  value={dialog.targetId}
                  onChange={(event) =>
                    setDialog({
                      ...dialog,
                      targetId: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3"
                >
                  {appellations
                    .filter((item) => item.id !== dialog.appellation.id)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDialog(null)}
                disabled={updatingId === dialog.appellation.id}
                className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={confirmDialogAction}
                disabled={updatingId === dialog.appellation.id}
                className={`rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 ${
                  dialog.type === "merge"
                    ? "bg-purple-700 hover:bg-purple-800"
                    : dialog.type === "toggle" && dialog.appellation.active
                      ? "bg-orange-700 hover:bg-orange-800"
                      : "bg-black hover:bg-[#8a6a2f]"
                }`}
              >
                {updatingId === dialog.appellation.id
                  ? "Mise à jour..."
                  : dialog.type === "rename"
                    ? "Renommer"
                    : dialog.type === "merge"
                      ? "Fusionner"
                      : dialog.appellation.active
                        ? "Désactiver"
                        : "Réactiver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}