"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import NewsletterImageBrowser from "./NewsletterImageBrowser";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
};

const BUCKET_NAME = "wine-images";

function sanitizeFileName(filename: string) {
  const extension = filename.includes(".")
    ? `.${filename.split(".").pop()?.toLowerCase()}`
    : "";

  const baseName = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "newsletter-image"}-${Date.now()}${extension}`;
}

export default function NewsletterImagePicker({
  images,
  onChange,
  maxImages = 12,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [manualImage, setManualImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(
    null
  );
  const [showLibrary, setShowLibrary] = useState(false);

  function addManualImage() {
    const image = manualImage.trim();

    if (!image) return;

    if (images.includes(image)) {
      window.alert("Cette image est déjà sélectionnée.");
      return;
    }

    if (images.length >= maxImages) {
      window.alert(
        `Vous pouvez ajouter au maximum ${maxImages} images.`
      );
      return;
    }

    onChange([...images, image]);
    setManualImage("");
  }

  function removeImage(index: number) {
    onChange(
      images.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  function moveImage(
    index: number,
    direction: "up" | "down"
  ) {
    const targetIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= images.length
    ) {
      return;
    }

    const reorderedImages = [...images];

    [
      reorderedImages[index],
      reorderedImages[targetIndex],
    ] = [
      reorderedImages[targetIndex],
      reorderedImages[index],
    ];

    onChange(reorderedImages);
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
    targetIndex: number
  ) {
    event.preventDefault();

    if (
      draggedIndex === null ||
      draggedIndex === targetIndex
    ) {
      setDraggedIndex(null);
      return;
    }

    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(
      draggedIndex,
      1
    );

    reorderedImages.splice(
      targetIndex,
      0,
      movedImage
    );

    onChange(reorderedImages);
    setDraggedIndex(null);
  }

  async function uploadImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    event.target.value = "";

    if (files.length === 0) return;

    const remainingPlaces =
      maxImages - images.length;

    if (remainingPlaces <= 0) {
      window.alert(
        `Vous pouvez ajouter au maximum ${maxImages} images.`
      );
      return;
    }

    const filesToUpload = files.slice(
      0,
      remainingPlaces
    );

    if (files.length > remainingPlaces) {
      window.alert(
        `Seules ${remainingPlaces} image(s) peuvent encore être ajoutée(s).`
      );
    }

    setUploading(true);
    setUploadError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        if (!file.type.startsWith("image/")) {
          throw new Error(
            `${file.name} n’est pas un fichier image.`
          );
        }

        const filename = sanitizeFileName(file.name);
        const storagePath = `newsletter/${filename}`;

        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(storagePath);

        uploadedUrls.push(publicUrl);
      }

      onChange([
        ...images,
        ...uploadedUrls.filter(
          (url) => !images.includes(url)
        ),
      ]);
    } catch (error) {
      console.error(error);

      setUploadError(
        error instanceof Error
          ? error.message
          : "Impossible de téléverser les images."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-[#e6dcc8] bg-[#fffaf3] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl text-[#24110d]">
            Images de la newsletter
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#6d5b50]">
            La première image sera utilisée comme visuel
            principal. Les suivantes seront affichées dans
            la newsletter.
          </p>
        </div>

        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#8a6a2f]">
          {images.length}/{maxImages}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={
            uploading || images.length >= maxImages
          }
          className="rounded-full bg-[#8a1f1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? "Téléversement..."
            : "Téléverser des images"}
        </button>

        <button
          type="button"
          onClick={() =>
            setShowLibrary((current) => !current)
          }
          className="rounded-full border border-[#8a6a2f] px-5 py-3 text-sm font-semibold text-[#8a6a2f] transition hover:bg-[#8a6a2f] hover:text-white"
        >
          {showLibrary
            ? "Fermer la bibliothèque"
            : "Choisir dans la bibliothèque"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={uploadImages}
          className="hidden"
        />
      </div>

      {uploadError && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {uploadError}
        </div>
      )}

      {showLibrary && (
        <div className="mt-6">
          <NewsletterImageBrowser
            images={images}
            onChange={onChange}
            maxImages={maxImages}
          />
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-[#e1d1bd] bg-white p-5">
        <label
          htmlFor="manual-newsletter-image"
          className="block text-sm font-semibold text-[#24110d]"
        >
          Ajouter une image par chemin ou URL
        </label>

        <p className="mt-2 text-xs leading-5 text-[#8b7a6f]">
          Exemple : `/images/nom-image.jpg` ou une URL
          complète.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            id="manual-newsletter-image"
            type="text"
            value={manualImage}
            onChange={(event) =>
              setManualImage(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addManualImage();
              }
            }}
            placeholder="/images/nom-image.jpg"
            className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
          />

          <button
            type="button"
            onClick={addManualImage}
            disabled={
              !manualImage.trim() ||
              images.length >= maxImages
            }
            className="rounded-full bg-[#8a6a2f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6d4a10] disabled:cursor-not-allowed disabled:opacity-50"
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
              draggable
              onDragStart={() =>
                handleDragStart(index)
              }
              onDragOver={handleDragOver}
              onDrop={(event) =>
                handleDrop(event, index)
              }
              onDragEnd={() =>
                setDraggedIndex(null)
              }
              className={`rounded-2xl border bg-white p-5 transition ${
                draggedIndex === index
                  ? "border-[#8a1f1f] opacity-60"
                  : "border-[#e1d1bd]"
              }`}
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
                  </div>

                  <p
                    title={image}
                    className="mt-3 break-all text-xs leading-5 text-[#8b7a6f]"
                  >
                    {image}
                  </p>

                  <p className="mt-3 text-xs text-[#8b7a6f]">
                    Vous pouvez également déplacer cette
                    carte par glisser-déposer.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        moveImage(index, "up")
                      }
                      disabled={index === 0}
                      className="rounded-full border border-[#8a6a2f] px-4 py-2 text-sm text-[#8a6a2f] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Monter
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        moveImage(index, "down")
                      }
                      disabled={
                        index === images.length - 1
                      }
                      className="rounded-full border border-[#8a6a2f] px-4 py-2 text-sm text-[#8a6a2f] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Descendre
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
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