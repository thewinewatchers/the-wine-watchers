"use client";

import { useState } from "react";

export default function AdminImagesPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileSelection(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);

    setSelectedFiles((previous) => [...previous, ...files]);

    event.target.value = "";
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) {
      setError("Veuillez sélectionner au moins une image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("/api/admin/upload-images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'import.");
      }

      setUploaded(data.paths || []);
      setSelectedFiles([]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "L'import a échoué."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearSelection() {
    setSelectedFiles([]);
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-serif text-[#2b1b16]">
          Import automatique des images
        </h1>

        <p className="mb-6 text-neutral-600">
          Tu peux sélectionner plusieurs images en plusieurs fois,
          puis tout importer ensemble.
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelection}
          className="mb-6 block w-full rounded border border-neutral-300 bg-white p-3 text-neutral-800"
        />

        {selectedFiles.length > 0 && (
          <div className="mb-6 rounded border border-neutral-200 bg-neutral-50 p-4">
            <h2 className="mb-3 font-semibold text-neutral-800">
              Images sélectionnées :
            </h2>

            <div className="space-y-2 text-sm text-neutral-700">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${index}`}>
                  {file.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="rounded-full bg-[#8B1E2D] px-6 py-3 text-white transition hover:bg-[#6f1824] disabled:opacity-50"
          >
            {loading
              ? "Import en cours..."
              : "Importer les images"}
          </button>

          {selectedFiles.length > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-full border border-neutral-300 px-6 py-3 text-neutral-700 transition hover:bg-neutral-100"
            >
              Vider la sélection
            </button>
          )}
        </div>

        {error && (
          <p className="mt-6 rounded border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {uploaded.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-green-700">
              Images présentes dans public/images :
            </h2>

            <textarea
              readOnly
              value={uploaded.join("\n")}
              className="h-80 w-full rounded border border-neutral-300 bg-white p-4 font-mono text-sm text-neutral-800"
            />
          </div>
        )}
      </div>
    </main>
  );
}