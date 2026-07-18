"use client";

import {
  ChangeEvent,
  FormEvent,
} from "react";
import NewsletterImagePicker from "./NewsletterImagePicker";

export type NewsletterForm = {
  subject: string;
  preheader: string;
  title: string;
  message: string;
  images: string[];
  buttonLabel: string;
  buttonUrl: string;
  footerMessage: string;
};

type NewsletterEditorProps = {
  form: NewsletterForm;
  testEmail: string;
  subscriberCount: number;
  sendingTest: boolean;
  sendingNewsletter: boolean;
  onFormChange: <K extends keyof NewsletterForm>(
    key: K,
    value: NewsletterForm[K]
  ) => void;
  onTestEmailChange: (value: string) => void;
  onSendTest: () => void | Promise<void>;
  onSendNewsletter: () => void | Promise<void>;
  onReset: () => void;
};

function normalizePublicUrl(value: string) {
  const url = value.trim();

  if (!url) return "";

  if (/^https?:\/\//i.test(url)) return url;

  return `https://${url}`;
}

export default function NewsletterEditor({
  form,
  testEmail,
  subscriberCount,
  sendingTest,
  sendingNewsletter,
  onFormChange,
  onTestEmailChange,
  onSendTest,
  onSendNewsletter,
  onReset,
}: NewsletterEditorProps) {
  function handleTestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSendTest();
  }

  function handleImagesChange(images: string[]) {
    onFormChange("images", images);
  }

  function handleInputChange<K extends keyof NewsletterForm>(
    key: K
  ) {
    return (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      onFormChange(key, event.target.value as NewsletterForm[K]);
    };
  }

  const normalizedButtonUrl = normalizePublicUrl(form.buttonUrl);

  return (
    <div className="rounded-[2rem] border border-[#eadcca] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a6a2f]">
            Création
          </p>

          <h2 className="mt-2 font-serif text-3xl">
            Composer la newsletter
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d5b50]">
            Préparez le sujet, le contenu, les images et le bouton de la
            campagne avant de procéder à un envoi test.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={sendingTest || sendingNewsletter}
          className="rounded-full border border-[#8a6a2f]/40 px-5 py-3 text-sm font-semibold text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Effacer
        </button>
      </div>

      <div className="mt-7 grid gap-5">
        <div>
          <label
            htmlFor="newsletter-subject"
            className="mb-2 block text-sm font-semibold"
          >
            Sujet de l’e-mail *
          </label>

          <input
            id="newsletter-subject"
            type="text"
            value={form.subject}
            onChange={handleInputChange("subject")}
            placeholder="Exemple : Nos grands vins disponibles cette semaine"
            className="w-full rounded-xl border border-[#dfcfb8] px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
          />
        </div>

        <div>
          <label
            htmlFor="newsletter-preheader"
            className="mb-2 block text-sm font-semibold"
          >
            Texte d’aperçu
          </label>

          <input
            id="newsletter-preheader"
            type="text"
            value={form.preheader}
            onChange={handleInputChange("preheader")}
            placeholder="Court texte visible dans la boîte de réception"
            className="w-full rounded-xl border border-[#dfcfb8] px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
          />

          <p className="mt-2 text-xs leading-5 text-[#8a776d]">
            Ce texte apparaît généralement après le sujet dans la boîte
            de réception du destinataire.
          </p>
        </div>

        <div>
          <label
            htmlFor="newsletter-title"
            className="mb-2 block text-sm font-semibold"
          >
            Titre principal *
          </label>

          <input
            id="newsletter-title"
            type="text"
            value={form.title}
            onChange={handleInputChange("title")}
            placeholder="Titre affiché dans la newsletter"
            className="w-full rounded-xl border border-[#dfcfb8] px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
          />
        </div>

        <NewsletterImagePicker
          images={form.images}
          onChange={handleImagesChange}
          maxImages={12}
        />

        <div>
          <label
            htmlFor="newsletter-message"
            className="mb-2 block text-sm font-semibold"
          >
            Contenu principal *
          </label>

          <textarea
            id="newsletter-message"
            value={form.message}
            onChange={handleInputChange("message")}
            rows={14}
            placeholder="Rédigez votre message. Séparez les paragraphes par une ligne vide."
            className="w-full rounded-xl border border-[#dfcfb8] px-4 py-3 leading-7 outline-none transition focus:border-[#8a1f1f]"
          />

          <p className="mt-2 text-xs leading-5 text-[#8a776d]">
            Séparez les paragraphes par une ligne vide. Les retours à la
            ligne seront conservés dans l’aperçu et dans l’e-mail.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="newsletter-button-label"
              className="mb-2 block text-sm font-semibold"
            >
              Texte du bouton
            </label>

            <input
              id="newsletter-button-label"
              type="text"
              value={form.buttonLabel}
              onChange={handleInputChange("buttonLabel")}
              placeholder="Découvrir les vins"
              className="w-full rounded-xl border border-[#dfcfb8] px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
            />
          </div>

          <div>
            <label
              htmlFor="newsletter-button-url"
              className="mb-2 block text-sm font-semibold"
            >
              Lien du bouton
            </label>

            <input
              id="newsletter-button-url"
              type="text"
              value={form.buttonUrl}
              onChange={handleInputChange("buttonUrl")}
              placeholder="https://www.thewinewatchers.com/..."
              className="w-full rounded-xl border border-[#dfcfb8] px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
            />
          </div>
        </div>

        {form.buttonLabel.trim() && normalizedButtonUrl && (
          <div className="rounded-2xl border border-[#eadcca] bg-[#fffaf3] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#8a6a2f]">
              Aperçu du bouton
            </p>

            <div className="mt-4 text-center">
              <a
                href={normalizedButtonUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-[#8a1f1f] px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#641313]"
              >
                {form.buttonLabel}
              </a>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="newsletter-footer-message"
            className="mb-2 block text-sm font-semibold"
          >
            Message de pied de page
          </label>

          <textarea
            id="newsletter-footer-message"
            value={form.footerMessage}
            onChange={handleInputChange("footerMessage")}
            rows={3}
            className="w-full rounded-xl border border-[#dfcfb8] px-4 py-3 leading-6 outline-none transition focus:border-[#8a1f1f]"
          />
        </div>
      </div>

      <form
        onSubmit={handleTestSubmit}
        className="mt-8 rounded-2xl border border-[#eadcca] bg-[#fffaf3] p-5"
      >
        <h3 className="font-serif text-2xl">
          Envoi test
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#6d5b50]">
          Envoyez d’abord la newsletter à votre propre adresse pour
          contrôler son affichage avant l’envoi général.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={testEmail}
            onChange={(event) =>
              onTestEmailChange(event.target.value)
            }
            placeholder="votre-adresse@exemple.com"
            className="flex-1 rounded-xl border border-[#dfcfb8] bg-white px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
          />

          <button
            type="submit"
            disabled={sendingTest || sendingNewsletter}
            className="rounded-full bg-[#8a6a2f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#6d4a10] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendingTest
              ? "Envoi du test..."
              : "Envoyer le test"}
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-2xl border border-[#eadcca] bg-[#fffaf3] p-5">
        <h3 className="font-serif text-2xl">
          Envoi général
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#6d5b50]">
          La campagne sera envoyée à {subscriberCount} abonné(s).
        </p>

        <button
          type="button"
          onClick={() => void onSendNewsletter()}
          disabled={
            sendingNewsletter ||
            sendingTest ||
            subscriberCount === 0
          }
          className="mt-5 w-full rounded-full bg-[#8a1f1f] px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#641313] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {sendingNewsletter
            ? "Envoi de la campagne..."
            : `Envoyer à ${subscriberCount} abonné(s)`}
        </button>
      </div>
    </div>
  );
}