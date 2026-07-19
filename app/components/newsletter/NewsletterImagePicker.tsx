"use client";

import { useState } from "react";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
};

function normalizeImagePath(value: string) {
  const path = value.trim().replace(/\\/g, "/");

  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  return path.startsWith("/") ? path : `/${path}`;
}

export default function NewsletterImagePicker({
  images,
  onChange,
  maxImages = 12,
}: Props) {
  const [mainImagePath, setMainImagePath] = useState("");
  const [additionalImagePath, setAdditionalImagePath] = useState("");

  function saveMainImage() {
    const normalizedPath = normalizeImagePath(mainImagePath);

    if (!normalizedPath) return;

    const remainingImages = images.filter(
      (image) => image !== normalizedPath
    );

    onChange([normalizedPath, ...remainingImages]);
    setMainImagePath("");
  }

  function addAdditionalImage() {
    const normalizedPath = normalizeImagePath(additionalImagePath);

    if (!normalizedPath) return;

    if (images.includes(normalizedPath)) {
      window.alert("Cette image est déjà sélectionnée.");
      return;
    }

    if (images.length >= maxImages) {
      window.alert(
        `Vous pouvez ajouter au maximum ${maxImages} images.`
      );
      return;
    }

    onChange([...images, normalizedPath]);
    setAdditionalImagePath("");
  }

  function removeImage(index: number) {
    onChange(
      images.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  function moveImage(index: number, direction: "up" | "down") {
    const targetIndex =
      direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const reorderedImages = [...images];

    [reorderedImages[index], reorderedImages[targetIndex]] = [
      reorderedImages[targetIndex],
      reorderedImages[index],
    ];

    onChange(reorderedImages);
  }

  return (
    <section className="rounded-3xl border border-[#e6dcc8] bg-[#fffaf3] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl text-[#24110d]">
            Images de la newsletter
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#6d5b50]">
            Choisissez une image principale puis ajoutez autant d’images
            supplémentaires que nécessaire.
          </p>
        </div>

        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#8a6a2f]">
          {images.length}/{maxImages}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#e1d1bd] bg-white p-5">
        <label
          htmlFor="newsletter-main-image"
          className="block text-sm font-semibold text-[#24110d]"
        >
          Image principale
        </label>

        <p className="mt-2 text-xs leading-5 text-[#8b7a6f]">
          Exemple : /images/bonnes-mares-2015-roumier-6-bouteilles.png
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            id="newsletter-main-image"
            type="text"
            value={mainImagePath}
            onChange={(event) => setMainImagePath(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                saveMainImage();
              }
            }}
            placeholder="/images/nom-image-principale.png"
            className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
          />

          <button
            type="button"
            onClick={saveMainImage}
            disabled={!mainImagePath.trim()}
            className="rounded-full bg-[#8a1f1f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#641313] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Définir comme principale
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#e1d1bd] bg-white p-5">
        <label
          htmlFor="newsletter-additional-image"
          className="block text-sm font-semibold text-[#24110d]"
        >
          Ajouter une image supplémentaire
        </label>

        <p className="mt-2 text-xs leading-5 text-[#8b7a6f]">
          Entrez un nouveau chemin puis cliquez sur « Ajouter ». Vous pouvez
          répéter l’opération pour chaque image.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            id="newsletter-additional-image"
            type="text"
            value={additionalImagePath}
            onChange={(event) =>
              setAdditionalImagePath(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addAdditionalImage();
              }
            }}
            placeholder="/images/nom-image-supplementaire.png"
            className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-[#8a6a2f]"
          />

          <button
            type="button"
            onClick={addAdditionalImage}
            disabled={
              !additionalImagePath.trim() ||
              images.length >= maxImages
            }
            className="rounded-full bg-[#8a6a2f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6d4a10] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ajouter
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#d8c8b2] bg-white p-8 text-center text-sm text-[#6d5b50]">
          Aucune image sélectionnée.
        </div>
      ) : (
        <div className="mt-6 grid gap-5">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="rounded-2xl border border-[#e1d1bd] bg-white p-5"
            >
              <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                <div className="flex min-h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-[#eadcca] bg-[#f8f3ea]">
                  <img
                    src={image}
                    alt={`Aperçu newsletter ${index + 1}`}
                    className="h-44 w-full object-contain"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-[#24110d]">
                      Image {index + 1}
                    </p>

                    {index === 0 && (
                      <span className="rounded-full bg-[#8a1f1f] px-3 py-1 text-xs font-semibold text-white">
                        Image principale
                      </span>
                    )}

                    {index > 0 && (
                      <span className="rounded-full bg-[#f3eadf] px-3 py-1 text-xs font-semibold text-[#8a6a2f]">
                        Image supplémentaire
                      </span>
                    )}
                  </div>

                  <p className="mt-3 break-all text-xs leading-5 text-[#8b7a6f]">
                    {image}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0}
                      className="rounded-full border border-[#8a6a2f] px-4 py-2 text-sm text-[#8a6a2f] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Monter
                    </button>

                    <button
                      type="button"
                      onClick={() => moveImage(index, "down")}
                      disabled={index === images.length - 1}
                      className="rounded-full border border-[#8a6a2f] px-4 py-2 text-sm text-[#8a6a2f] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Descendre
                    </button>

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-700 transition hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}