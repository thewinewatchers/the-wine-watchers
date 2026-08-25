"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type ContentBlock = {
  type: "paragraph" | "subheading";
  text: string;
};

type PageSection = {
  title: string;
  blocks: ContentBlock[];
};

type SitePageForm = {
  name: string;
  page_title: string;
  eyebrow: string;
  intro: string;
  seo_title: string;
  seo_description: string;
  sections: PageSection[];
  is_active: boolean;
};

const emptyForm: SitePageForm = {
  name: "",
  page_title: "",
  eyebrow: "",
  intro: "",
  seo_title: "",
  seo_description: "",
  sections: [],
  is_active: true,
};

function normalizeSections(value: unknown): PageSection[] {
  if (!Array.isArray(value)) return [];

  return value.map((section) => {
    const rawSection =
      section && typeof section === "object"
        ? (section as Record<string, unknown>)
        : {};

    const rawBlocks = Array.isArray(rawSection.blocks)
      ? rawSection.blocks
      : [];

    return {
      title: String(rawSection.title || ""),
      blocks: rawBlocks.map((block) => {
        const rawBlock =
          block && typeof block === "object"
            ? (block as Record<string, unknown>)
            : {};

        return {
          type:
            rawBlock.type === "subheading"
              ? "subheading"
              : "paragraph",
          text: String(rawBlock.text || ""),
        };
      }),
    };
  });
}

export default function AdminSitePageEditor() {
  const params = useParams();
  const slug = String(params.slug || "");

  const [form, setForm] = useState<SitePageForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadPage() {
      if (!slug) return;

      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      try {
        const response = await fetch(
          `/api/admin/pages/${encodeURIComponent(slug)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          setErrorMessage(
            result?.details ||
              result?.error ||
              "Impossible de charger la page."
          );
          setLoading(false);
          return;
        }

        const page = result.page;

        setForm({
          name: page?.name || "",
          page_title: page?.page_title || "",
          eyebrow: page?.eyebrow || "",
          intro: page?.intro || "",
          seo_title: page?.seo_title || "",
          seo_description: page?.seo_description || "",
          sections: normalizeSections(page?.sections),
          is_active: page?.is_active !== false,
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Impossible de charger la page."
        );
      }

      setLoading(false);
    }

    loadPage();
  }, [slug]);

  function handleMainChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSectionTitleChange(
    sectionIndex: number,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      sections: previous.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              title: value,
            }
          : section
      ),
    }));
  }

  function handleBlockTextChange(
    sectionIndex: number,
    blockIndex: number,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      sections: previous.sections.map((section, index) => {
        if (index !== sectionIndex) return section;

        return {
          ...section,
          blocks: section.blocks.map((block, currentBlockIndex) =>
            currentBlockIndex === blockIndex
              ? {
                  ...block,
                  text: value,
                }
              : block
          ),
        };
      }),
    }));
  }

  function handleBlockTypeChange(
    sectionIndex: number,
    blockIndex: number,
    type: "paragraph" | "subheading"
  ) {
    setForm((previous) => ({
      ...previous,
      sections: previous.sections.map((section, index) => {
        if (index !== sectionIndex) return section;

        return {
          ...section,
          blocks: section.blocks.map((block, currentBlockIndex) =>
            currentBlockIndex === blockIndex
              ? {
                  ...block,
                  type,
                }
              : block
          ),
        };
      }),
    }));
  }

  function addParagraph(sectionIndex: number) {
    setForm((previous) => ({
      ...previous,
      sections: previous.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              blocks: [
                ...section.blocks,
                {
                  type: "paragraph",
                  text: "",
                },
              ],
            }
          : section
      ),
    }));
  }

  function addSubheading(sectionIndex: number) {
    setForm((previous) => ({
      ...previous,
      sections: previous.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              blocks: [
                ...section.blocks,
                {
                  type: "subheading",
                  text: "",
                },
              ],
            }
          : section
      ),
    }));
  }

  function removeBlock(
    sectionIndex: number,
    blockIndex: number
  ) {
    const confirmed = window.confirm(
      "Supprimer ce bloc de texte ?"
    );

    if (!confirmed) return;

    setForm((previous) => ({
      ...previous,
      sections: previous.sections.map((section, index) => {
        if (index !== sectionIndex) return section;

        return {
          ...section,
          blocks: section.blocks.filter(
            (_, currentBlockIndex) =>
              currentBlockIndex !== blockIndex
          ),
        };
      }),
    }));
  }

  function addSection() {
    setForm((previous) => ({
      ...previous,
      sections: [
        ...previous.sections,
        {
          title: "Nouvelle section",
          blocks: [
            {
              type: "paragraph",
              text: "",
            },
          ],
        },
      ],
    }));
  }

  function removeSection(sectionIndex: number) {
    const confirmed = window.confirm(
      "Supprimer cette section complète ?"
    );

    if (!confirmed) return;

    setForm((previous) => ({
      ...previous,
      sections: previous.sections.filter(
        (_, index) => index !== sectionIndex
      ),
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!form.name.trim()) {
      setErrorMessage("Le nom de la page est obligatoire.");
      setSaving(false);
      return;
    }

    if (!form.page_title.trim()) {
      setErrorMessage("Le titre principal est obligatoire.");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      page_title: form.page_title.trim(),
      eyebrow: form.eyebrow.trim() || null,
      intro: form.intro.trim() || null,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      sections: form.sections,
      is_active: form.is_active,
    };

    try {
      const response = await fetch(
        `/api/admin/pages/${encodeURIComponent(slug)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result?.details ||
            result?.error ||
            "Erreur lors de l’enregistrement."
        );

        setSaving(false);
        return;
      }

      setSuccessMessage(
        "Modifications enregistrées avec succès."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de l’enregistrement."
      );
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
        <div className="mx-auto max-w-6xl">
          <p>Chargement de la page...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/admin/pages"
            className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
          >
            ← Retour pages du site
          </Link>

          <Link
            href={`/${slug}`}
            target="_blank"
            className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
          >
            Voir la page
          </Link>
        </div>

        <p className="mt-8 text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
          Administration
        </p>

        <h1 className="mt-3 font-serif text-5xl">
          Modifier la page
        </h1>

        <p className="mt-4 text-sm text-neutral-500">
          /{slug}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8"
        >
          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              {successMessage}
            </div>
          )}

          <section className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
            <h2 className="font-serif text-3xl">
              Informations générales
            </h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nom dans l’administration
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleMainChange}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Titre principal
                </label>

                <input
                  name="page_title"
                  value={form.page_title}
                  onChange={handleMainChange}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Petit titre éventuel
                </label>

                <input
                  name="eyebrow"
                  value={form.eyebrow}
                  onChange={handleMainChange}
                  placeholder="Ex. Service client"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Introduction
                </label>

                <textarea
                  name="intro"
                  value={form.intro}
                  onChange={handleMainChange}
                  rows={4}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
            <h2 className="font-serif text-3xl">
              Référencement SEO
            </h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Titre SEO
                </label>

                <input
                  name="seo_title"
                  value={form.seo_title}
                  onChange={handleMainChange}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />

                <p className="mt-2 text-xs text-neutral-500">
                  {form.seo_title.length} caractères
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Meta description
                </label>

                <textarea
                  name="seo_description"
                  value={form.seo_description}
                  onChange={handleMainChange}
                  rows={4}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />

                <p className="mt-2 text-xs text-neutral-500">
                  {form.seo_description.length} caractères
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
                  Contenu
                </p>

                <h2 className="mt-2 font-serif text-4xl">
                  Sections de la page
                </h2>
              </div>

              <button
                type="button"
                onClick={addSection}
                className="rounded-full border border-[#8a6a2f] px-5 py-2 text-sm font-semibold text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
              >
                + Ajouter une section
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {form.sections.map(
                (section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start">
                      <div className="flex-1">
                        <label className="mb-2 block text-sm font-semibold">
                          Titre de la section
                        </label>

                        <input
                          value={section.title}
                          onChange={(event) =>
                            handleSectionTitleChange(
                              sectionIndex,
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-neutral-300 px-4 py-3 font-semibold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSection(sectionIndex)
                        }
                        className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        Supprimer la section
                      </button>
                    </div>

                    <div className="mt-6 space-y-5">
                      {section.blocks.map(
                        (block, blockIndex) => (
                          <div
                            key={blockIndex}
                            className="rounded-2xl border border-neutral-200 bg-[#fffaf3] p-5"
                          >
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                              <select
                                value={block.type}
                                onChange={(event) =>
                                  handleBlockTypeChange(
                                    sectionIndex,
                                    blockIndex,
                                    event.target.value as
                                      | "paragraph"
                                      | "subheading"
                                  )
                                }
                                className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm"
                              >
                                <option value="paragraph">
                                  Paragraphe
                                </option>
                                <option value="subheading">
                                  Sous-titre
                                </option>
                              </select>

                              <button
                                type="button"
                                onClick={() =>
                                  removeBlock(
                                    sectionIndex,
                                    blockIndex
                                  )
                                }
                                className="text-sm text-red-700 hover:underline"
                              >
                                Supprimer ce bloc
                              </button>
                            </div>

                            <textarea
                              value={block.text}
                              onChange={(event) =>
                                handleBlockTextChange(
                                  sectionIndex,
                                  blockIndex,
                                  event.target.value
                                )
                              }
                              rows={
                                block.type === "subheading"
                                  ? 2
                                  : 5
                              }
                              className={`w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 ${
                                block.type === "subheading"
                                  ? "font-semibold"
                                  : ""
                              }`}
                            />
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          addParagraph(sectionIndex)
                        }
                        className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
                      >
                        + Paragraphe
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          addSubheading(sectionIndex)
                        }
                        className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
                      >
                        + Sous-titre
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    is_active: event.target.checked,
                  }))
                }
                className="h-5 w-5"
              />

              <span className="font-semibold">
                Page active
              </span>
            </label>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white hover:bg-[#8a6a2f] disabled:bg-neutral-400"
          >
            {saving
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </main>
  );
}