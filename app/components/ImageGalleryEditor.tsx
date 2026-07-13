"use client";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
};

export default function ImageGalleryEditor({
  images,
  onChange,
}: Props) {
  function addImage() {
    onChange([...images, ""]);
  }

  function updateImage(index: number, value: string) {
    onChange(
      images.map((image, imageIndex) =>
        imageIndex === index ? value : image
      )
    );
  }

  function removeImage(index: number) {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  }

  function moveImage(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= images.length) return;

    const reorderedImages = [...images];
    const currentImage = reorderedImages[index];

    reorderedImages[index] = reorderedImages[targetIndex];
    reorderedImages[targetIndex] = currentImage;

    onChange(reorderedImages);
  }

  return (
    <section className="rounded-3xl border border-[#e6dcc8] bg-[#fffaf3] p-6 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#24110d]">
            Images supplémentaires
          </h2>

          <p className="mt-2 text-sm text-[#6d5b50]">
            Facultatif. L’image principale reste celle du champ Image.
          </p>
        </div>

        <button
          type="button"
          onClick={addImage}
          className="rounded-full bg-[#8a1f1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          + Ajouter une image
        </button>
      </div>

      {images.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#d8c8b2] bg-white p-6 text-sm text-[#6d5b50]">
          Aucune image supplémentaire.
        </div>
      ) : (
        <div className="mt-6 grid gap-5">
          {images.map((image, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#e1d1bd] bg-white p-5"
            >
              <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                <div className="flex min-h-[160px] items-center justify-center overflow-hidden rounded-2xl border border-[#eadcca] bg-[#f8f3ea]">
                  {image.trim() ? (
                    <img
                      src={image}
                      alt={`Aperçu image supplémentaire ${index + 1}`}
                      className="h-40 w-full object-contain"
                    />
                  ) : (
                    <span className="px-4 text-center text-sm text-[#8b7a6f]">
                      Aperçu indisponible
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#24110d]">
                    Image {index + 1}
                  </label>

                  <input
                    type="text"
                    value={image}
                    onChange={(event) =>
                      updateImage(index, event.target.value)
                    }
                    placeholder="/images/nom-image.jpg ou URL complète"
                    className="mt-3 w-full rounded-xl border border-neutral-300 px-4 py-3"
                  />

                  <div className="mt-4 flex flex-wrap gap-3">
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