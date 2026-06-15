"use client";

import { useEffect, useState } from "react";

type RedirectItem = {
  id: string;
  source_path: string;
  destination_path: string;
  permanent: boolean;
  active: boolean;
};

export default function AdminRedirectionsPage() {
  const [items, setItems] = useState<RedirectItem[]>([]);
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [message, setMessage] = useState("");

  async function loadRedirects() {
    const res = await fetch("/api/admin/redirections");
    const data = await res.json();

    if (data.redirects) {
      setItems(data.redirects);
    }
  }

  useEffect(() => {
    loadRedirects();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin/redirections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_path: sourcePath,
        destination_path: destinationPath,
        permanent: true,
        active: true,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Erreur lors de l’enregistrement.");
      return;
    }

    setMessage("Redirection enregistrée avec succès.");
    setSourcePath("");
    setDestinationPath("");
    loadRedirects();
  }

  async function deleteRedirect(id: string) {
    const res = await fetch("/api/admin/redirections", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      loadRedirects();
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec] px-6 py-10 text-[#1f1714]">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-serif">Redirections SEO</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl bg-white p-6 shadow"
        >
          <div className="mb-4">
            <label className="mb-2 block font-semibold">Ancienne URL</label>
            <input
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              placeholder="/vin/chateau-margaux-2025-primeur"
              className="w-full rounded border p-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-semibold">Nouvelle URL</label>
            <input
              value={destinationPath}
              onChange={(e) => setDestinationPath(e.target.value)}
              placeholder="/boutique/bordeaux"
              className="w-full rounded border p-3"
              required
            />
          </div>

          <button className="rounded bg-[#4b0f14] px-5 py-3 text-white">
            Enregistrer la redirection
          </button>

          {message && <p className="mt-4">{message}</p>}
        </form>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Redirections enregistrées
          </h2>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div>
                  <p className="font-semibold">{item.source_path}</p>
                  <p className="text-sm text-neutral-600">
                    → {item.destination_path}
                  </p>
                </div>

                <button
                  onClick={() => deleteRedirect(item.id)}
                  className="rounded bg-red-700 px-3 py-2 text-sm text-white"
                >
                  Supprimer
                </button>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-neutral-500">Aucune redirection enregistrée.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}