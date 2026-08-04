"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type ProducerReference = {
  id: string;
  name: string;
  region: string | null;
  category: string | null;
  active: boolean;
  created_at: string | null;
};

type WineReference = {
  producer: string | null;
};

type ProducerDialog =
  | {
      type: "rename";
      producer: ProducerReference;
      nextName: string;
    }
  | {
      type: "merge";
      producer: ProducerReference;
      targetId: string;
    }
  | {
      type: "toggle";
      producer: ProducerReference;
    }
  | null;

export default function AdminProducteursPage() {
  const [producers, setProducteurs] = useState<ProducerReference[]>([]);
  const [wines, setWines] = useState<WineReference[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<ProducerDialog>(null);

  async function loadProducteurs() {
    setLoading(true);
    setErrorMessage("");

    const [
      { data: producerData, error: producerError },
      { data: wineData, error: wineError },
    ] = await Promise.all([
      supabase
        .from("producers")
        .select("id, name, region, category, active, created_at")
        .order("name", { ascending: true }),
      supabase
        .from("wines")
        .select("producer"),
    ]);

    if (producerError || wineError) {
      console.error(
        "Erreur chargement producteurs :",
        producerError || wineError
      );
      setErrorMessage(
        "Impossible de charger les producteurs et leur nombre de vins."
      );
      setLoading(false);
      return;
    }

    setProducteurs((producerData || []) as ProducerReference[]);
    setWines((wineData || []) as WineReference[]);
    setLoading(false);
  }

  useEffect(() => {
    loadProducteurs();
  }, []);

  const filteredProducteurs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return producers;

    return producers.filter((producer) =>
      [
        producer.name,
        producer.region,
        producer.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [producers, search]);

  const wineCountByProducteur = useMemo(() => {
    const counts = new Map<string, number>();

    wines.forEach((wine) => {
      const producer = String(wine.producer || "").trim();

      if (!producer) return;

      counts.set(producer, (counts.get(producer) || 0) + 1);
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
    () => producers.filter((producer) => producer.active).length,
    [producers]
  );

  const inactiveCount = producers.length - activeCount;

  async function runAction(
    producerId: string,
    payload: Record<string, unknown>
  ) {
    setUpdatingId(producerId);
    setErrorMessage("");
    setSuccessMessage("");

    const response = await fetch(`/api/admin/producteurs/${producerId}`, {
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
    await loadProducteurs();
    return true;
  }

  function openRenameDialog(producer: ProducerReference) {
    setErrorMessage("");
    setSuccessMessage("");
    setDialog({
      type: "rename",
      producer,
      nextName: producer.name,
    });
  }

  function openMergeDialog(producer: ProducerReference) {
    const firstTarget = producers.find((item) => item.id !== producer.id);

    if (!firstTarget) {
      setErrorMessage("Aucun autre producteur n’est disponible.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setDialog({
      type: "merge",
      producer,
      targetId: firstTarget.id,
    });
  }

  function openToggleDialog(producer: ProducerReference) {
    setErrorMessage("");
    setSuccessMessage("");
    setDialog({
      type: "toggle",
      producer,
    });
  }

  async function confirmDialogAction() {
    if (!dialog) return;

    const source = dialog.producer;

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
          `Le producteur "${source.name}" a été renommé en "${cleanedName}".`
        );
        setDialog(null);
      }

      return;
    }

    if (dialog.type === "merge") {
      const target = producers.find(
        (item) => item.id === dialog.targetId
      );

      if (!target) {
        setErrorMessage("Le producteur de destination est introuvable.");
        return;
      }

      const success = await runAction(source.id, {
        action: "merge",
        targetId: target.id,
      });

      if (success) {
        setSuccessMessage(
          `Le producteur "${source.name}" a été fusionné vers "${target.name}".`
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
        `Le producteur "${source.name}" a été ${
          source.active ? "désactivé" : "réactivé"
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
          Producteurs
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700">
          Cette page regroupe les producteurs permanents utilisés dans le
          catalogue. Ils restent disponibles même lorsqu’aucun vin ne leur est
          momentanément associé.
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
              Total
            </p>
            <p className="mt-2 font-serif text-4xl text-black">
              {producers.length}
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
                Liste des producteurs
              </h2>

              <p className="mt-2 text-sm text-neutral-600">
                {filteredProducteurs.length} résultat
                {filteredProducteurs.length > 1 ? "s" : ""}
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un producteur..."
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
              Chargement des producteurs...
            </p>
          ) : filteredProducteurs.length === 0 ? (
            <p className="mt-8 text-sm text-neutral-600">
              Aucun producteur trouvé.
            </p>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#eee2cf]">
              <div className="hidden grid-cols-[1.35fr_0.8fr_0.8fr_0.4fr_0.65fr_0.55fr_1.6fr] gap-4 bg-[#fffaf3] px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600 lg:grid">
                <span>Producteur</span>
                <span>Région</span>
                <span>Catégorie</span>
                <span>Vins</span>
                <span>Création</span>
                <span>Statut</span>
                <span>Action</span>
              </div>

              <div className="divide-y divide-[#eee2cf]">
                {filteredProducteurs.map((producer) => (
                  <div
                    key={producer.id}
                    className="grid gap-3 px-5 py-5 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.4fr_0.65fr_0.55fr_1.6fr] lg:items-center lg:gap-4"
                  >
                    <div>
                      <p className="font-serif text-lg text-black">
                        {producer.name}
                      </p>
                    </div>

                    <p className="text-sm text-neutral-700">
                      {producer.region || "—"}
                    </p>

                    <p className="text-sm text-neutral-700">
                      {producer.category || "—"}
                    </p>

                    <p className="text-sm font-semibold text-black">
                      {wineCountByProducteur.get(producer.name) || 0}
                    </p>

                    <p className="text-sm text-neutral-700">
                      {formatCreatedAt(producer.created_at)}
                    </p>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                          producer.active
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {producer.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/catalogue?search=${encodeURIComponent(
                          producer.name
                        )}`}
                        className="inline-flex rounded-full border border-[#8a6a2f] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
                      >
                        Voir
                      </Link>

                      <button
                        type="button"
                        onClick={() => openRenameDialog(producer)}
                        disabled={updatingId === producer.id}
                        className="rounded-full border border-blue-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                      >
                        Renommer
                      </button>

                      <button
                        type="button"
                        onClick={() => openMergeDialog(producer)}
                        disabled={updatingId === producer.id}
                        className="rounded-full border border-purple-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                      >
                        Fusionner
                      </button>

                      <button
                        type="button"
                        onClick={() => openToggleDialog(producer)}
                        disabled={updatingId === producer.id}
                        className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] disabled:opacity-50 ${
                          producer.active
                            ? "border-orange-300 text-orange-700 hover:bg-orange-50"
                            : "border-green-300 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {updatingId === producer.id
                          ? "Mise à jour..."
                          : producer.active
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
                ? "Renommer un producteur"
                : dialog.type === "merge"
                  ? "Fusionner deux producteurs"
                  : dialog.producer.active
                    ? "Désactiver un producteur"
                    : "Réactiver un producteur"}
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-700">
              Producteur concerné :{" "}
              <strong className="text-black">{dialog.producer.name}</strong>
            </p>

            <div className="mt-5 rounded-2xl border border-[#eee2cf] bg-[#fffaf3] p-4 text-sm leading-7 text-neutral-700">
              <p>
                <strong className="text-black">
                  {wineCountByProducteur.get(dialog.producer.name) || 0}
                </strong>{" "}
                vin
                {(wineCountByProducteur.get(dialog.producer.name) || 0) > 1
                  ? "s"
                  : ""}{" "}
                actuellement associé
                {(wineCountByProducteur.get(dialog.producer.name) || 0) > 1
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
                  Les vins seront déplacés vers la destination et l’ancien
                  producteur sera supprimé du référentiel. Cette opération est
                  irréversible.
                </p>
              )}

              {dialog.type === "toggle" && (
                <p>
                  Les vins existants resteront inchangés. Le producteur sera
                  seulement {dialog.producer.active ? "retiré des" : "réintégré aux"} listes de sélection.
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
                  Producteur de destination
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
                  {producers
                    .filter((item) => item.id !== dialog.producer.id)
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
                disabled={updatingId === dialog.producer.id}
                className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={confirmDialogAction}
                disabled={updatingId === dialog.producer.id}
                className={`rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 ${
                  dialog.type === "merge"
                    ? "bg-purple-700 hover:bg-purple-800"
                    : dialog.type === "toggle" && dialog.producer.active
                      ? "bg-orange-700 hover:bg-orange-800"
                      : "bg-black hover:bg-[#8a6a2f]"
                }`}
              >
                {updatingId === dialog.producer.id
                  ? "Mise à jour..."
                  : dialog.type === "rename"
                    ? "Renommer"
                    : dialog.type === "merge"
                      ? "Fusionner"
                      : dialog.producer.active
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