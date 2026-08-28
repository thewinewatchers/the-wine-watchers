"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type NavigationItem = {
  id: string;
  label: string;
  href: string;
  position: number;
  is_active: boolean;
  show_when_logged_out: boolean;
  show_when_logged_in: boolean;
};

type NewNavigationItem = {
  label: string;
  href: string;
  position: string;
};

const emptyNewItem: NewNavigationItem = {
  label: "",
  href: "",
  position: "",
};

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [newItem, setNewItem] =
    useState<NewNavigationItem>(emptyNewItem);

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadItems() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/navigation", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result?.details ||
            result?.error ||
            "Impossible de charger le menu."
        );
        setLoading(false);
        return;
      }

      setItems(result.items || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de charger le menu."
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  const nextSuggestedPosition = useMemo(() => {
    if (items.length === 0) return 10;

    const maxPosition = Math.max(
      ...items.map((item) => Number(item.position || 0))
    );

    return maxPosition + 10;
  }, [items]);

  function updateLocalItem(
    id: string,
    field: keyof NavigationItem,
    value: string | number | boolean
  ) {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function handleNewItemChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setNewItem((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function createItem(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setCreating(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(event.currentTarget);

    const label = String(formData.get("label") ?? "").trim();
    const href = String(formData.get("href") ?? "").trim();

    const rawPosition = String(
      formData.get("position") ?? ""
    ).trim();

    const position =
      Number(rawPosition) || nextSuggestedPosition;

    if (!label) {
      setErrorMessage("Le libellé du menu est obligatoire.");
      setCreating(false);
      return;
    }

    if (!href) {
      setErrorMessage("Le lien est obligatoire.");
      setCreating(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/navigation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label,
          href,
          position,
          is_active: true,
          show_when_logged_out: true,
          show_when_logged_in: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result?.details ||
            result?.error ||
            "Impossible d’ajouter ce lien."
        );

        setCreating(false);
        return;
      }

      setNewItem(emptyNewItem);
      setSuccessMessage("Lien ajouté au menu.");
      await loadItems();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d’ajouter ce lien."
      );
    }

    setCreating(false);
  }

  async function saveItem(item: NavigationItem) {
    setSavingId(item.id);
    setErrorMessage("");
    setSuccessMessage("");

    if (!item.label.trim()) {
      setErrorMessage("Le libellé du menu est obligatoire.");
      setSavingId("");
      return;
    }

    if (!item.href.trim()) {
      setErrorMessage("Le lien est obligatoire.");
      setSavingId("");
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/navigation/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            label: item.label.trim(),
            href: item.href.trim(),
            position: Number(item.position || 0),
            is_active: item.is_active,
            show_when_logged_out:
              item.show_when_logged_out,
            show_when_logged_in:
              item.show_when_logged_in,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result?.details ||
            result?.error ||
            "Impossible d’enregistrer ce lien."
        );

        setSavingId("");
        return;
      }

      setSuccessMessage(
        `Lien "${item.label}" enregistré.`
      );

      await loadItems();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d’enregistrer ce lien."
      );
    }

    setSavingId("");
  }

  async function deleteItem(item: NavigationItem) {
    const confirmed = window.confirm(
      `Supprimer "${item.label}" du menu ?`
    );

    if (!confirmed) return;

    setSavingId(item.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `/api/admin/navigation/${item.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result?.details ||
            result?.error ||
            "Impossible de supprimer ce lien."
        );

        setSavingId("");
        return;
      }

      setSuccessMessage(
        `Lien "${item.label}" supprimé.`
      );

      await loadItems();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer ce lien."
      );
    }

    setSavingId("");
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Link
              href="/admin"
              className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
            >
              ← Retour administration
            </Link>

            <p className="mt-8 text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
              Administration
            </p>

            <h1 className="mt-3 font-serif text-5xl">
              Menu du site
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-neutral-600">
              Ajoutez, modifiez, masquez ou supprimez les
              liens affichés dans le menu principal du site.
            </p>
          </div>

          <Link
            href="/admin/pages"
            className="rounded-full border border-[#8a6a2f] px-5 py-3 text-sm font-semibold text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
          >
            Pages du site
          </Link>
        </div>

        {errorMessage && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={createItem}
          className="mt-10 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8"
        >
          <h2 className="font-serif text-3xl">
            Ajouter un lien
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Pour une nouvelle page créée depuis
            l&apos;administration, utilisez son adresse,
            par exemple <strong>/page/nos-services</strong>.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.5fr_160px]">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Libellé
              </label>

              <input
                name="label"
                value={newItem.label}
                onChange={handleNewItemChange}
                placeholder="Ex. Nos services"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Lien
              </label>

              <input
                name="href"
                value={newItem.href}
                onChange={handleNewItemChange}
                placeholder="/page/nos-services"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Position
              </label>

              <input
                name="position"
                type="number"
                value={newItem.position}
                onChange={handleNewItemChange}
                placeholder={String(nextSuggestedPosition)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#8a6a2f] disabled:bg-neutral-400"
          >
            {creating
              ? "Ajout..."
              : "+ Ajouter au menu"}
          </button>
        </form>

        <section className="mt-10">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
              Navigation actuelle
            </p>

            <h2 className="mt-2 font-serif text-4xl">
              Liens du menu
            </h2>
          </div>

          {loading ? (
            <div className="mt-6 rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
              Chargement du menu...
            </div>
          ) : items.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
              Aucun lien enregistré.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr_130px]">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Libellé
                      </label>

                      <input
                        value={item.label}
                        onChange={(event) =>
                          updateLocalItem(
                            item.id,
                            "label",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Lien
                      </label>

                      <input
                        value={item.href}
                        onChange={(event) =>
                          updateLocalItem(
                            item.id,
                            "href",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Position
                      </label>

                      <input
                        type="number"
                        value={item.position}
                        onChange={(event) =>
                          updateLocalItem(
                            item.id,
                            "position",
                            Number(event.target.value)
                          )
                        }
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-5">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.is_active}
                        onChange={(event) =>
                          updateLocalItem(
                            item.id,
                            "is_active",
                            event.target.checked
                          )
                        }
                        className="h-4 w-4"
                      />

                      Actif
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.show_when_logged_out}
                        onChange={(event) =>
                          updateLocalItem(
                            item.id,
                            "show_when_logged_out",
                            event.target.checked
                          )
                        }
                        className="h-4 w-4"
                      />

                      Visible hors connexion
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.show_when_logged_in}
                        onChange={(event) =>
                          updateLocalItem(
                            item.id,
                            "show_when_logged_in",
                            event.target.checked
                          )
                        }
                        className="h-4 w-4"
                      />

                      Visible connecté
                    </label>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => saveItem(item)}
                      disabled={savingId === item.id}
                      className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-[#8a6a2f] disabled:bg-neutral-400"
                    >
                      {savingId === item.id
                        ? "Enregistrement..."
                        : "Enregistrer"}
                    </button>

                    <Link
                      href={item.href}
                      target="_blank"
                      className="rounded-full border border-[#8a6a2f] px-5 py-2 text-sm font-semibold text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
                    >
                      Ouvrir
                    </Link>

                    <button
                      type="button"
                      onClick={() => deleteItem(item)}
                      disabled={savingId === item.id}
                      className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}