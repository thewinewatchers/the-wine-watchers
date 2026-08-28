"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ContentBlock = {
  type: "paragraph" | "subheading";
  text: string;
};

type PageSection = {
  title: string;
  blocks: ContentBlock[];
};

type NewPageForm = {
  name: string;
  page_title: string;
  eyebrow: string;
  intro: string;
  seo_title: string;
  seo_description: string;
  sections: PageSection[];
  is_active: boolean;
};

const emptyForm: NewPageForm = {
  name: "",
  page_title: "",
  eyebrow: "",
  intro: "",
  seo_title: "",
  seo_description: "",
  sections: [
    {
      title: "",
      blocks: [
        {
          type: "paragraph",
          text: "",
        },
      ],
    },
  ],
  is_active: true,
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminCreateSitePage() {
  const router = useRouter();

  const [form, setForm] = useState<NewPageForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const slug = useMemo(() => createSlug(form.name), [form.name]);

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

  function addSection() {
    setForm((previous) => ({
      ...previous,
      sections: [
        ...previous.sections,
        {
          title: "",
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
    if (form.sections.length === 1) {
      window.alert("La page doit conserver au moins une section.");
      return;
    }

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
    const section = form.sections[sectionIndex];

    if (section.blocks.length === 1) {
      window.alert(
        "Une section doit conserver au moins un bloc de contenu."
      );
      return;
    }

    const confirmed = window.confirm(
      "Supprimer ce bloc de texte ?"
    );

    if (!confirmed) return;

    setForm((previous) => ({
      ...previous,
      sections: previous.sections.map((currentSection, index) => {
        if (index !== sectionIndex) return currentSection;

        return {
          ...currentSection,
          blocks: currentSection.blocks.filter(
            (_, currentBlockIndex) =>
              currentBlockIndex !== blockIndex
          ),
        };
      }),
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");

    if (!form.name.trim()) {
      setErrorMessage("Le nom de la page est obligatoire.");
      setSaving(false);
      return;
    }

    if (!slug) {
      setErrorMessage(
        "Impossible de générer l’adresse de la page. Renseigne d’abord le nom de la page."
      );
      setSaving(false);
      return;
    }

    if (!form.page_title.trim()) {
      setErrorMessage("Le titre principal est obligatoire.");
      setSaving(false);
      return;
    }

    if (
      form.sections.some(
        (section) => !section.title.trim()
      )
    ) {
      setErrorMessage(
        "Toutes les sections doivent avoir un titre."
      );
      setSaving(false);
      return;
    }

    const payload = {
      slug,
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
      const response = await fetch("/api/admin/pages", {
        method: "POST",
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
            "Erreur lors de la création de la page."
        );

        setSaving(false);
        return;
      }

      router.push(`/admin/pages/${slug}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de la page."
      );
    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/pages"
          className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
        >
          ← Retour pages du site
        </Link>

        <p className="mt-8 text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
          Administration
        </p>

        <h1 className="mt-3 font-serif text-5xl">
          Créer une page
        </h1>

        <p className="mt-4 max-w-3xl leading-7 text-neutral-600">
          Créez une nouvelle page publique sans intervenir dans le code.
          Elle sera accessible automatiquement à l&apos;adresse
          /page/slug-de-la-page.
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
                  placeholder="Ex. Nos services"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Adresse de la page
                </label>

                <div className="rounded-xl border border-neutral-300 bg-[#fffaf3] px-4 py-3 text-sm">
                  /page/{slug || "adresse-générée-automatiquement"}
                </div>

                <p className="mt-2 text-xs text-neutral-500">
                  L’adresse se met à jour automatiquement pendant la saisie du nom.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Titre principal
                </label>

                <input
                  name="page_title"
                  value={form.page_title}
                  onChange={handleMainChange}
                  placeholder="Titre visible sur la page"
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
                  placeholder="Ex. The Wine Watchers"
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
                  placeholder="Texte d’introduction de la page"
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
                  placeholder="Titre affiché dans Google"
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
                  placeholder="Description destinée aux moteurs de recherche"
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
                              placeholder={
                                block.type === "subheading"
                                  ? "Sous-titre"
                                  : "Texte du paragraphe"
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
                Publier immédiatement la page
              </span>
            </label>

            <p className="mt-3 text-sm text-neutral-500">
              Si cette option est décochée, la page sera enregistrée mais
              ne sera pas accessible publiquement.
            </p>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white hover:bg-[#8a6a2f] disabled:bg-neutral-400"
          >
            {saving
              ? "Création..."
              : "Créer la page"}
          </button>
        </form>
      </div>
    </main>
  );
}