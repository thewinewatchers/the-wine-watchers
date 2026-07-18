"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type StorageImage = {
  name: string;
  path: string;
  publicUrl: string;
};

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
};

const BUCKET_NAME = "wine-images";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isImageFile(filename: string) {
  return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(filename);
}

export default function NewsletterImageBrowser({
  images,
  onChange,
  maxImages = 12,
}: Props) {
  const [storageImages, setStorageImages] = useState<StorageImage[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function listFolder(
    folder = "",
    depth = 0
  ): Promise<StorageImage[]> {
    if (depth > 4) return [];

    const { data, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 1000,
        sortBy: {
          column: "name",
          order: "asc",
        },
      });

    if (listError) {
      throw listError;
    }

    const files: StorageImage[] = [];
    const folders: string[] = [];

    for (const item of data || []) {
      const path = folder ? `${folder}/${item.name}` : item.name;

      if (item.id && isImageFile(item.name)) {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(path);

        files.push({
          name: item.name,
          path,
          publicUrl,
        });
      } else if (!item.id && !isImageFile(item.name)) {
        folders.push(path);
      }
    }

    const nestedImages = await Promise.all(
      folders.map((nestedFolder) =>
        listFolder(nestedFolder, depth + 1)
      )
    );

    return [...files, ...nestedImages.flat()];
  }

  async function loadImages() {
    setLoading(true);
    setError("");

    try {
      const results = await listFolder();

      const uniqueImages = Array.from(
        new Map(
          results.map((image) => [image.publicUrl, image])
        ).values()
      );

      setStorageImages(uniqueImages);
    } catch (loadError) {
      console.error(loadError);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossible de charger les images."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadImages();
  }, []);

  const filteredImages = useMemo(() => {
    const query = normalizeText(search.trim());

    if (!query) return storageImages;

    return storageImages.filter((image) =>
      normalizeText(`${image.name} ${image.path}`).includes(query)
    );
  }, [search, storageImages]);

  function isSelected(publicUrl: string) {
    return images.includes(publicUrl);
  }

  function toggleImage(publicUrl: string) {
    if (isSelected(publicUrl)) {
      onChange(images.filter((image) => image !== publicUrl));
      return;
    }

    if (images.length >= maxImages) {
      window.alert(
        `Vous pouvez sélectionner au maximum ${maxImages} images.`
      );
      return;
    }

    onChange([...images, publicUrl]);
  }

  return (
    <section className="rounded-3xl border border-[#e6dcc8] bg-[#fffaf3] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl text-[#24110d]">
            Bibliothèque d’images
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#6d5b50]">
            Sélectionnez les images déjà présentes dans Supabase.
            Vous pouvez en choisir jusqu’à {maxImages}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadImages()}
          disabled={loading}
          className="rounded-full border border-[#8a6a2f] px-5 py-3 text-sm font-semibold text-[#8a6a2f] transition hover:bg-[#8a6a2f] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Actualiser"}
        </button>
      </div>

      <div className="mt-5">
        <label
          htmlFor="newsletter-image-search"
          className="mb-2 block text-sm font-semibold text-[#24110d]"
        >
          Rechercher une image
        </label>

        <input
          id="newsletter-image-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Exemple : Lafite, Guigal, Pingus..."
          className="w-full rounded-xl border border-[#d8c8b2] bg-white px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#6d5b50]">
        <span>
          {filteredImages.length} image(s) trouvée(s)
        </span>

        <span>
          {images.length}/{maxImages} sélectionnée(s)
        </span>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#d8c8b2] bg-white p-8 text-center text-sm text-[#6d5b50]">
          Chargement de la bibliothèque...
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#d8c8b2] bg-white p-8 text-center text-sm text-[#6d5b50]">
          Aucune image trouvée.
        </div>
      ) : (
        <div className="mt-6 grid max-h-[620px] grid-cols-2 gap-4 overflow-y-auto pr-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredImages.map((image) => {
            const selected = isSelected(image.publicUrl);

            return (
              <button
                key={image.path}
                type="button"
                onClick={() => toggleImage(image.publicUrl)}
                className={`relative overflow-hidden rounded-2xl border bg-white p-3 text-left transition ${
                  selected
                    ? "border-[#8a1f1f] ring-2 ring-[#8a1f1f]/20"
                    : "border-[#e1d1bd] hover:border-[#8a6a2f]"
                }`}
              >
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f8f3ea]">
                  <img
                    src={image.publicUrl}
                    alt={image.name}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>

                <p
                  title={image.path}
                  className="mt-3 truncate text-xs font-semibold text-[#24110d]"
                >
                  {image.name}
                </p>

                <p
                  title={image.path}
                  className="mt-1 truncate text-[11px] text-[#8b7a6f]"
                >
                  {image.path}
                </p>

                <span
                  className={`mt-3 block rounded-full px-3 py-2 text-center text-xs font-semibold ${
                    selected
                      ? "bg-[#8a1f1f] text-white"
                      : "bg-[#f3eadf] text-[#6d5b50]"
                  }`}
                >
                  {selected
                    ? "Image sélectionnée"
                    : "Sélectionner"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}