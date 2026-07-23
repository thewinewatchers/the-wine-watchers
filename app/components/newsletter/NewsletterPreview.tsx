"use client";

import { useMemo } from "react";

type NewsletterPreviewProps = {
  preheader?: string;
  title: string;
  message: string;
  images: string[];
  buttonLabel?: string;
  buttonUrl?: string;
  footerMessage?: string;
};

const SITE_URL = "https://www.thewinewatchers.com";
const LOGO_URL = "/images/logo-tww.jpg";

function normalizeImageUrl(value: string) {
  const url = value.trim().replace(/\\/g, "/");

  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return url;

  return `/${url}`;
}

function normalizeButtonUrl(value: string) {
  const url = value.trim();

  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${SITE_URL}${url}`;

  return `https://${url}`;
}

export default function NewsletterPreview({
  preheader = "",
  title,
  message,
  images,
  buttonLabel = "",
  buttonUrl = "",
  footerMessage = "",
}: NewsletterPreviewProps) {
  const paragraphs = useMemo(() => {
    return message
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [message]);

  const normalizedImages = images
    .map((image) => normalizeImageUrl(image))
    .filter(Boolean);

  const mainImage = normalizedImages[0] || "";
  const additionalImages = normalizedImages.slice(1);
  const normalizedButtonUrl = normalizeButtonUrl(buttonUrl);
  const displayedTitle = title.trim() || "Titre de votre newsletter";

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#d7c5ad] bg-[#eee8df] p-4 sm:p-6">
      {preheader && (
        <div
          style={{
            display: "none",
            maxHeight: 0,
            overflow: "hidden",
            opacity: 0,
          }}
        >
          {preheader}
        </div>
      )}

      <div className="mx-auto max-w-[720px] overflow-hidden bg-[#fffdf9] shadow-[0_18px_55px_rgba(45,28,20,0.14)]">
        <header className="border-b border-[#dfd2c0] bg-[#fffdf9] px-7 py-8 text-center sm:px-12 sm:py-10">
          <a
            href={SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block"
          >
            <img
              src={LOGO_URL}
              alt="The Wine Watchers"
              className="mx-auto h-auto max-h-24 w-auto max-w-[280px] object-contain"
            />
          </a>

          <div className="mx-auto mt-7 flex max-w-[360px] items-center gap-4">
            <span className="h-px flex-1 bg-[#c8ad7f]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#8b6b39]">
              Grands vins & belles découvertes
            </span>
            <span className="h-px flex-1 bg-[#c8ad7f]" />
          </div>
        </header>

        <section className="relative bg-[#24120f]">
          {mainImage ? (
            <>
              <img
                src={mainImage}
                alt={displayedTitle}
                className="h-[440px] w-full object-cover sm:h-[520px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />

              <div className="absolute inset-x-0 bottom-0 px-7 pb-9 text-center sm:px-12 sm:pb-12">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.36em] text-[#e9d3a6]">
                  The Wine Watchers
                </p>

                <h3 className="font-serif text-4xl leading-[1.08] text-white sm:text-5xl">
                  {displayedTitle}
                </h3>

                <div className="mx-auto mt-6 h-px w-20 bg-[#d2ae6d]" />
              </div>
            </>
          ) : (
            <div className="flex min-h-[380px] flex-col items-center justify-center px-8 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-[#d8bd8c]">
                The Wine Watchers
              </p>

              <h3 className="mt-6 max-w-[560px] font-serif text-4xl leading-tight text-white sm:text-5xl">
                {displayedTitle}
              </h3>

              <p className="mt-8 text-xs uppercase tracking-[0.24em] text-[#bcae9c]">
                Ajoutez une image principale
              </p>
            </div>
          )}
        </section>

        <main className="bg-[#fffdf9]">
          <section className="px-7 py-10 sm:px-14 sm:py-14">
            <p className="mb-7 text-center text-[10px] font-semibold uppercase tracking-[0.34em] text-[#9a7440]">
              L&apos;édition The Wine Watchers
            </p>

            {paragraphs.length > 0 ? (
              <div className="space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={`${paragraph}-${index}`}
                    className={
                      index === 0
                        ? "whitespace-pre-line text-center font-serif text-xl leading-9 text-[#2d1914] sm:text-2xl"
                        : "whitespace-pre-line text-base leading-8 text-[#4a3730]"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-center text-base leading-8 text-[#8a776d]">
                Le contenu de la newsletter apparaîtra ici.
              </p>
            )}

            {buttonLabel.trim() && normalizedButtonUrl && (
              <div className="mt-10 text-center">
                <a
                  href={normalizedButtonUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[220px] items-center justify-center border border-[#7a1717] bg-[#7a1717] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#541010]"
                >
                  {buttonLabel}
                </a>
              </div>
            )}
          </section>

          {additionalImages.length > 0 && (
            <section className="border-t border-[#e4d8c8] bg-[#f5efe7] px-5 py-8 sm:px-8 sm:py-10">
              <div className="mb-8 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#9a7440]">
                  Notre sélection
                </p>

                <h4 className="mt-3 font-serif text-3xl text-[#2d1914]">
                  À découvrir
                </h4>
              </div>

              <div
                className={
                  additionalImages.length === 1
                    ? "grid grid-cols-1 gap-6"
                    : "grid grid-cols-1 gap-6 sm:grid-cols-2"
                }
              >
                {additionalImages.map((image, index) => (
                  <article
                    key={`${image}-${index}`}
                    className={
                      additionalImages.length % 2 !== 0 &&
                      index === additionalImages.length - 1
                        ? "overflow-hidden border border-[#ded0bc] bg-white sm:col-span-2"
                        : "overflow-hidden border border-[#ded0bc] bg-white"
                    }
                  >
                    <div className="flex min-h-[320px] items-center justify-center bg-white p-5">
                      <img
                        src={image}
                        alt={`Sélection The Wine Watchers ${index + 1}`}
                        className="max-h-[430px] w-full object-contain"
                      />
                    </div>

                    <div className="border-t border-[#e8ddce] px-5 py-5 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a7440]">
                        Sélection privée
                      </p>

                      <p className="mt-2 font-serif text-xl text-[#2d1914]">
                        The Wine Watchers
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        <footer className="bg-[#24120f] px-7 py-10 text-center sm:px-12">
          <p className="font-serif text-2xl text-white">
            The Wine Watchers
          </p>

          <div className="mx-auto my-7 h-px w-20 bg-[#927342]" />

          <p className="text-xs leading-6 text-[#d8cec5]">
            {footerMessage.trim() ||
              "Vous recevez cet e-mail car vous êtes inscrit à la newsletter The Wine Watchers."}
          </p>

          <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-[#d2b47e]">
            Grands vins de Bordeaux, Bourgogne, Rhône, Italie, Espagne et USA
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-[#e9dfd5]">
            <a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Visiter le site
            </a>

            <span className="text-[#806b5e]">•</span>

            <span className="text-[#a99587]">
              Lien de désinscription ajouté lors de l&apos;envoi
            </span>
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-[0.18em] text-[#8f7c6f]">
            © The Wine Watchers SL
          </p>
        </footer>
      </div>
    </div>
  );
}