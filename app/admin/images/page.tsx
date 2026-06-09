"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabaseClient";

type ImportRow = {
  slug: string;
  image: string;
};

export default function AdminImagesPage() {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const data = XLSX.utils.sheet_to_json<ImportRow>(worksheet, {
      defval: "",
    });

    const cleanedRows = data
      .map((row) => ({
        slug: String(row.slug || "").trim(),
        image: String(row.image || "").trim(),
      }))
      .filter((row) => row.slug && row.image);

    setRows(cleanedRows);
  }

  async function handleImport() {
    if (rows.length === 0) {
      setError("Veuillez sélectionner un fichier Excel avec les colonnes slug et image.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    let successCount = 0;
    let errorCount = 0;

    for (const row of rows) {
      const { error } = await supabase
        .from("wines")
        .update({ image: row.image })
        .eq("slug", row.slug);

      if (error) {
        errorCount += 1;
      } else {
        successCount += 1;
      }
    }

    setLoading(false);
    setMessage(`${successCount} image(s) mise(s) à jour. ${errorCount} erreur(s).`);
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-serif text-[#2b1b16]">
          Import images par Excel
        </h1>

        <p className="mb-6 text-neutral-600">
          Importe un fichier Excel .xlsx avec deux colonnes : slug et image.
        </p>

        <div className="mb-6 rounded-xl bg-[#fff8ed] p-4 text-sm text-neutral-700">
          Exemple :
          <pre className="mt-3 whitespace-pre-wrap">
{`slug | image
chateau-lafite | /images/chateau-lafite.jpg
pavillon-rouge-2025-mu | /images/pavillon-rouge-2025-mu.png`}
          </pre>
        </div>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelection}
          className="mb-6 block w-full rounded border border-neutral-300 bg-white p-3 text-neutral-800"
        />

        {rows.length > 0 && (
          <div className="mb-6 rounded border border-neutral-200 bg-neutral-50 p-4">
            <h2 className="mb-3 font-semibold text-neutral-800">
              Lignes détectées : {rows.length}
            </h2>

            <div className="max-h-80 space-y-2 overflow-auto text-sm text-neutral-700">
              {rows.map((row, index) => (
                <div key={`${row.slug}-${index}`}>
                  <strong>{row.slug}</strong> → {row.image}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleImport}
          disabled={loading || rows.length === 0}
          className="rounded-full bg-[#8B1E2D] px-6 py-3 text-white transition hover:bg-[#6f1824] disabled:opacity-50"
        >
          {loading ? "Import en cours..." : "Mettre à jour les images"}
        </button>

        {error && (
          <p className="mt-6 rounded border border-red-300 bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-6 rounded border border-green-300 bg-green-50 p-4 text-green-700">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}