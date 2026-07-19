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
const LOGO_URL = `${SITE_URL}/favicon-tww.png`;

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

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[#e1d1bd] bg-[#f8f4ee] p-4">
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

      <div className="mx-auto max-w-[680px] overflow-hidden rounded-[1.3rem] border border-[#e1d1bd] bg-white shadow-sm">
        <header className="px-7 py-7 text-center sm:px-9">
          <a
            href={SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block"
          >
            <img
              src={LOGO_URL}
              alt="The Wine Watchers"
              className="mx-auto h-24 w-24 object-contain"
            />
          </a>

          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[#8a6a2f]">
            The Wine Watchers
          </p>

          <h3 className="mt-4 font-serif text-3xl leading-tight text-[#24110d]">
            {title.trim() || "Titre de votre newsletter"}
          </h3>
        </header>

        {mainImage ? (
          <div className="border-y border-[#eadcca] bg-[#f8f4ee]">
            <img
              src={mainImage}
              alt={title.trim() || "Newsletter The Wine Watchers"}
              className="max-h-[520px] w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-56 items-center justify-center border-y border-[#eadcca] bg-[#f3eadf] text-sm uppercase tracking-[0.2em] text-[#9a816a]">
            Image principale
          </div>
        )}

        <div className="px-7 py-8 sm:px-9">
          {paragraphs.length > 0 ? (
            <div className="space-y-5">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${paragraph}-${index}`}
                  className="whitespace-pre-line text-base leading-8 text-[#3b2a25]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-base leading-8 text-[#8a776d]">
              Le contenu de la newsletter apparaîtra ici.
            </p>
          )}

          {additionalImages.length > 0 && (
            <div className="mt-8 space-y-6">
              {additionalImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-2xl border border-[#eadcca] bg-[#f8f4ee]"
                >
                  <img
                    src={image}
                    alt={`Illustration ${index + 2} de la newsletter`}
                    className="max-h-[520px] w-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}

          {buttonLabel.trim() && normalizedButtonUrl && (
            <div className="mt-9 text-center">
              <a
                href={normalizedButtonUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-[#8a1f1f] px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#641313]"
              >
                {buttonLabel}
              </a>
            </div>
          )}

          <hr className="my-8 border-[#e1d1bd]" />

          <p className="text-xs leading-6 text-[#6d5b50]">
            {footerMessage.trim() ||
              "Vous recevez cet e-mail car vous êtes inscrit à la newsletter The Wine Watchers."}
          </p>

          <p className="mt-4 text-xs leading-6 text-[#6d5b50]">
            <span className="font-semibold text-[#8a1f1f] underline">
              Se désinscrire de la newsletter
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}