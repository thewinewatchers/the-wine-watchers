"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type CsvRow = Record<string, string>;

type ValidationError = {
  rowNumber: number;
  slug: string;
  message: string;
};

const arrayFields = ["keywords", "grape_varieties", "tasting_notes"];

const allowedCategories = [
  "Bordeaux",
  "Bourgogne",
  "Rhône",
  "Grands vins d’Italie",
  "Espagne",
  "USA",
  "Primeurs 2025",
];

const expectedColumns = [
  "slug",
  "name",
  "region",
  "vintage",
  "price",
  "bottle_size",
  "packaging",
  "image",
  "category",
  "rating",
  "seo_title",
  "seo_description",
  "keywords",
  "producer",
  "appellation",
  "country",
  "color",
  "grape_varieties",
  "classification",
  "soil",
  "style",
  "description",
  "story",
  "tasting_notes",
  "nose",
  "palate",
  "pairing",
  "serving_temperature",
  "aging_potential",
  "meta_content",
];

function detectDelimiter(firstLine: string) {
  const tabs = (firstLine.match(/\t/g) || []).length;
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;

  if (tabs >= semicolons && tabs >= commas) return "\t";
  if (semicolons > commas) return ";";
  return ",";
}

function parseLine(line: string, delimiter: string) {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === delimiter && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseTextToRows(text: string): CsvRow[] {
  const cleanText = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const lines = cleanText
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseLine(lines[0], delimiter).map((header) =>
    header.trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseLine(line, delimiter);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return row;
  });
}

function cleanValue(value: string | undefined) {
  const clean = String(value || "").trim();
  return clean === "" ? null : clean;
}

function toArray(value: string | undefined) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function convertRowToSupabase(row: CsvRow) {
  const wine: Record<string, any> = {};

  expectedColumns.forEach((column) => {
    if (arrayFields.includes(column)) {
      wine[column] = toArray(row[column]);
    } else {
      wine[column] = cleanValue(row[column]);
    }
  });

  return wine;
}

function validateRows(rows: CsvRow[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const slugCounts = new Map<string, number>();

  rows.forEach((row) => {
    const slug = String(row.slug || "").trim();

    if (slug) {
      slugCounts.set(slug, (slugCounts.get(slug) || 0) + 1);
    }
  });

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const slug = String(row.slug || "").trim();
    const name = String(row.name || "").trim();
    const image = String(row.image || "").trim();
    const category = String(row.category || "").trim();
    const bottleSize = String(row.bottle_size || "").trim();
    const packaging = String(row.packaging || "").trim();

    if (!slug) {
      errors.push({
        rowNumber,
        slug: "-",
        message: "Slug manquant.",
      });
    }

    if (!name) {
      errors.push({
        rowNumber,
        slug: slug || "-",
        message: "Nom du vin manquant.",
      });
    }

    if (!image) {
      errors.push({
        rowNumber,
        slug: slug || "-",
        message: "Image manquante.",
      });
    }

    if (slug && (slugCounts.get(slug) || 0) > 1) {
      errors.push({
        rowNumber,
        slug,
        message: "Slug en double dans les données collées.",
      });
    }

    if (category && !allowedCategories.includes(category)) {
      errors.push({
        rowNumber,
        slug: slug || "-",
        message: `Catégorie invalide : "${category}". Catégories autorisées : ${allowedCategories.join(
          ", "
        )}.`,
      });
    }

    if (bottleSize && !/^[0-9]+(cl|CL|Cl|ml|ML|Ml|l|L)$/.test(bottleSize)) {
      errors.push({
        rowNumber,
        slug: slug || "-",
        message:
          'Flaconnage suspect. Utilisez par exemple "75cl", "150cl", "300cl", "600cl".',
      });
    }

    if (
      packaging &&
      !["CBO/1", "CBO/3", "CBO/6", "CBO/12", "CB/1", "CB/3", "CB/6", "CB/12"].includes(
        packaging
      )
    ) {
      errors.push({
        rowNumber,
        slug: slug || "-",
        message:
          'Caissage suspect. Valeurs conseillées : "CBO/1", "CBO/3", "CBO/6", "CBO/12".',
      });
    }
  });

  return errors;
}
export default function AdminImportPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [rawText, setRawText] = useState("");
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [importing, setImporting] = useState(false);

  const canImport = rows.length > 0 && validationErrors.length === 0;

  const categoryStats = useMemo(() => {
    const stats = new Map<string, number>();

    rows.forEach((row) => {
      const category = String(row.category || "Non renseignée").trim();
      stats.set(category, (stats.get(category) || 0) + 1);
    });

    return Array.from(stats.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [rows]);

  useEffect(() => {
    verifierAccesAdmin();
  }, []);

  async function verifierAccesAdmin() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      router.push("/admin/login");
      return;
    }

    setCheckingAuth(false);
  }

  function analyserTexte(texte: string) {
    setMessage("");
    setErrorMessage("");
    setRows([]);
    setValidationErrors([]);

    const parsedRows = parseTextToRows(texte);

    if (parsedRows.length === 0) {
      setErrorMessage(
        "Aucune ligne détectée. Copiez bien la ligne des titres de colonnes + les vins depuis Excel."
      );
      return;
    }

    const firstRow = parsedRows[0];

    const missingColumns = expectedColumns.filter(
      (column) => !(column in firstRow)
    );

    if (missingColumns.length > 0) {
      setErrorMessage(`Colonnes manquantes : ${missingColumns.join(", ")}`);
      return;
    }

    const errors = validateRows(parsedRows);

    setRows(parsedRows);
    setValidationErrors(errors);

    if (errors.length > 0) {
      setMessage(
        `${parsedRows.length} vin(s) détecté(s), mais ${errors.length} erreur(s) doivent être corrigée(s) avant import.`
      );
      return;
    }

    setMessage(
      `${parsedRows.length} vin(s) détecté(s). Données prêtes à importer.`
    );
  }

  function handlePasteChange(value: string) {
    setRawText(value);

    if (value.trim()) {
      analyserTexte(value);
    } else {
      setRows([]);
      setValidationErrors([]);
      setMessage("");
      setErrorMessage("");
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage("");
    setErrorMessage("");
    setRows([]);
    setValidationErrors([]);
    setRawText("");

    const file = event.target.files?.[0];

    if (!file) return;

    const text = await file.text();
    setRawText(text);
    analyserTexte(text);
  }

  async function importerVins() {
    if (rows.length === 0) {
      setErrorMessage("Aucun vin à importer.");
      return;
    }

    if (validationErrors.length > 0) {
      setErrorMessage(
        "Import impossible : corrigez les erreurs affichées avant d’importer."
      );
      return;
    }

    const confirmation = window.confirm(
      `Importer ${rows.length} vin(s) dans Supabase ? Les vins ayant le même slug seront mis à jour.`
    );

    if (!confirmation) return;

    setImporting(true);
    setMessage("");
    setErrorMessage("");

    const winesToImport = rows.map(convertRowToSupabase);

    const { error } = await supabase
      .from("wines")
      .upsert(winesToImport, { onConflict: "slug" });

    if (error) {
      setErrorMessage(`Erreur Supabase : ${error.message}`);
      setImporting(false);
      return;
    }

    setMessage(`${rows.length} vin(s) importé(s) avec succès dans Supabase.`);
    setRows([]);
    setValidationErrors([]);
    setRawText("");
    setImporting(false);
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#170606] text-white">
        <p>Vérification de l’accès admin...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#24110d]">
      <section className="relative overflow-hidden bg-[#170606] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,181,109,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(138,31,31,0.35),transparent_36%),linear-gradient(135deg,#2a0d0d,#120505)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <Link
            href="/admin"
            className="mb-8 inline-block text-sm uppercase tracking-[0.25em] text-[#d8b56d] transition hover:text-white"
          >
            ← Retour admin
          </Link>

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
            Import Excel / CSV
          </p>

          <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">
            Importer plusieurs vins
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            Copiez-collez directement les lignes depuis Excel, ou chargez un
            fichier CSV, pour ajouter plusieurs vins en une seule opération.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            Mode d’emploi
          </p>

          <h2 className="mt-4 font-serif text-3xl">Import rapide</h2>

          <ol className="mt-6 space-y-4 text-sm leading-7 text-[#6d5b50]">
            <li>
              <strong>1.</strong> Ouvre ton fichier Excel.
            </li>
            <li>
              <strong>2.</strong> Remplis au minimum <strong>slug</strong>,{" "}
              <strong>name</strong> et <strong>image</strong>.
            </li>
            <li>
              <strong>3.</strong> Les autres colonnes peuvent rester vides.
            </li>
            <li>
              <strong>4.</strong> Enregistre en <strong>CSV UTF-8</strong> ou
              copie-colle les lignes depuis Excel.
            </li>
            <li>
              <strong>5.</strong> Importe seulement si aucune erreur n’est
              affichée.
            </li>
          </ol>

          <div className="mt-8 rounded-2xl bg-[#f1e8dc] p-5 text-sm leading-7 text-[#6d5b50]">
            <p>
              <strong>Colonnes obligatoires :</strong>
            </p>
            <ul className="mt-3 grid gap-1">
              <li>• slug</li>
              <li>• name</li>
              <li>• image</li>
            </ul>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5 text-sm leading-7 text-[#6d5b50]">
            <p>
              <strong>Image :</strong> utilisez par exemple{" "}
              <strong>/images/chateau-lafite.jpg</strong>.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
              Option CSV
            </p>

            <label className="mt-4 inline-block cursor-pointer rounded-full border border-[#8a1f1f] px-5 py-3 text-sm font-semibold text-[#8a1f1f] transition hover:bg-[#8a1f1f] hover:text-white">
              Charger un CSV
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            Données Excel
          </p>

          <h2 className="mt-4 font-serif text-3xl">
            Coller les vins à importer
          </h2>

          <textarea
            value={rawText}
            onChange={(event) => handlePasteChange(event.target.value)}
            rows={14}
            className="mt-8 w-full rounded-2xl border border-[#d8cbbb] bg-white p-4 font-mono text-xs leading-6 text-[#24110d] outline-none transition focus:border-[#8a1f1f]"
            placeholder={`Collez ici les lignes copiées depuis Excel.

La première ligne doit contenir les noms de colonnes :
slug	name	region	vintage	price	bottle_size	packaging	image	category	rating	seo_title	seo_description	keywords	producer	appellation	country	color	grape_varieties	classification	soil	style	description	story	tasting_notes	nose	palate	pairing	serving_temperature	aging_potential	meta_content`}
          />

          {message && (
            <div
              className={`mt-6 rounded-2xl border p-4 text-sm leading-6 ${
                validationErrors.length > 0
                  ? "border-yellow-200 bg-yellow-50 text-yellow-900"
                  : "border-green-200 bg-green-50 text-green-800"
              }`}
            >
              {message}
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
              {errorMessage}
            </div>
          )}

          {rows.length > 0 && categoryStats.length > 0 && (
            <div className="mt-6 rounded-2xl border border-[#e1d1bd] bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a6a2f]">
                Répartition par catégorie
              </p>

              <div className="mt-4 grid gap-2 text-sm text-[#6d5b50]">
                {categoryStats.map(([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between border-b border-[#f0e5d5] pb-2"
                  >
                    <span>{category}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
              <p className="font-semibold">
                Erreurs à corriger avant import :
              </p>

              <div className="mt-4 max-h-64 overflow-y-auto rounded-xl bg-white/70">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-red-100">
                      <th className="px-3 py-2">Ligne Excel</th>
                      <th className="px-3 py-2">Slug</th>
                      <th className="px-3 py-2">Erreur</th>
                    </tr>
                  </thead>

                  <tbody>
                    {validationErrors.map((error, index) => (
                      <tr
                        key={`${error.rowNumber}-${index}`}
                        className="border-b border-red-100"
                      >
                        <td className="px-3 py-2">{error.rowNumber}</td>
                        <td className="px-3 py-2">{error.slug}</td>
                        <td className="px-3 py-2">{error.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {rows.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 rounded-2xl bg-[#f1e8dc] p-4 text-sm text-[#6d5b50]">
                Aperçu des 5 premières lignes détectées.
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#e1d1bd] bg-white">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#170606] text-white">
                    <tr>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Nom</th>
                      <th className="px-4 py-3">Image</th>
                      <th className="px-4 py-3">Catégorie</th>
                      <th className="px-4 py-3">Appellation</th>
                      <th className="px-4 py-3">Flaconnage</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.slice(0, 5).map((row, index) => (
                      <tr key={`${row.slug}-${index}`} className="border-t">
                        <td className="px-4 py-3">{row.slug}</td>
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3">{row.image}</td>
                        <td className="px-4 py-3">{row.category}</td>
                        <td className="px-4 py-3">{row.appellation}</td>
                        <td className="px-4 py-3">{row.bottle_size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={importerVins}
                disabled={importing || !canImport}
                className="mt-8 rounded-full bg-[#8a1f1f] px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#641313] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {importing
                  ? "Import en cours..."
                  : canImport
                  ? `Importer ${rows.length} vin(s) dans Supabase`
                  : "Corriger les erreurs avant import"}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}