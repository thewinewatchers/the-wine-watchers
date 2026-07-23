"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import NewsletterEditor, {
  type NewsletterForm,
} from "@/app/components/newsletter/NewsletterEditor";
import NewsletterPreview from "@/app/components/newsletter/NewsletterPreview";
import {
  NEWSLETTER_TEMPLATES,
  type NewsletterTemplate,
} from "@/lib/newsletter-templates";

type Subscriber = {
  id: string;
  email: string;
  source?: string | null;
  created_at?: string | null;
};

const EMPTY_FORM: NewsletterForm = {
  subject: "",
  preheader: "",
  title: "",
  message: "",
  images: [],
  buttonLabel: "",
  buttonUrl: "",
  footerMessage:
    "Vous recevez cet e-mail car vous êtes inscrit à la newsletter The Wine Watchers.",
};

function normalizeEmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeCsvValue(value: unknown) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("fr-FR");
}

function normalizePublicUrl(value: string) {
  const url = value.trim();

  if (!url) return "";

  if (/^https?:\/\//i.test(url)) return url;

  return `https://${url}`;
}

function normalizeTemplateImageUrl(value?: string) {
  const url = String(value || "")
    .trim()
    .replace(/\\/g, "/");

  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return url;

  return `/${url}`;
}

export default function AdminNewsletterPage() {
  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageMessage, setPageMessage] = useState("");
  const [pageError, setPageError] = useState("");
  const [sendMessage, setSendMessage] = useState("");

  const [search, setSearch] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualSource, setManualSource] =
    useState("Ajout manuel");
  const [bulkEmails, setBulkEmails] = useState("");

  const [addingSubscribers, setAddingSubscribers] =
    useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [form, setForm] =
    useState<NewsletterForm>(EMPTY_FORM);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState("Tous");

  const [showPreview, setShowPreview] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [sendingNewsletter, setSendingNewsletter] =
    useState(false);

  async function getAccessToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || "";
  }

  async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
  ) {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error(
        "Session administrateur absente ou expirée. Reconnectez-vous."
      );
    }

    const headers = new Headers(options.headers);

    headers.set(
      "Authorization",
      `Bearer ${accessToken}`
    );

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }

  function resetMessages() {
    setPageMessage("");
    setPageError("");
    setSendMessage("");
  }

  async function loadSubscribers() {
    setLoading(true);
    setPageError("");

    try {
      const response = await authenticatedFetch(
        "/api/admin/newsletter-subscribers",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Impossible de charger les abonnés."
        );
      }

      setSubscribers(
        (result.subscribers || []) as Subscriber[]
      );
    } catch (error) {
      setSubscribers([]);

      setPageError(
        error instanceof Error
          ? error.message
          : "Erreur lors du chargement des abonnés."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    void loadSubscribers();
  }, []);

  const filteredSubscribers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return subscribers;

    return subscribers.filter((subscriber) => {
      return (
        subscriber.email.toLowerCase().includes(query) ||
        String(subscriber.source || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [search, subscribers]);

  const templateCategories = useMemo(() => {
    return [
      "Tous",
      ...Array.from(
        new Set(
          NEWSLETTER_TEMPLATES.map(
            (template) => template.category
          )
        )
      ),
    ];
  }, []);

  const filteredTemplates = useMemo(() => {
    const query = templateSearch.trim().toLowerCase();

    return NEWSLETTER_TEMPLATES.filter((template) => {
      const matchesCategory =
        templateCategory === "Tous" ||
        template.category === templateCategory;

      const matchesSearch =
        !query ||
        template.name.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.subject.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [templateCategory, templateSearch]);

  const selectedTemplate = useMemo(() => {
    return NEWSLETTER_TEMPLATES.find(
      (template) => template.id === selectedTemplateId
    );
  }, [selectedTemplateId]);

  const csvContent = useMemo(() => {
    const header = [
      "email",
      "source",
      "created_at",
    ]
      .map(escapeCsvValue)
      .join(",");

    const rows = subscribers.map((subscriber) =>
      [
        subscriber.email,
        subscriber.source || "",
        subscriber.created_at || "",
      ]
        .map(escapeCsvValue)
        .join(",")
    );

    return [header, ...rows].join("\n");
  }, [subscribers]);

  function updateForm<
    K extends keyof NewsletterForm,
  >(
    key: K,
    value: NewsletterForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function applyTemplate(template: NewsletterTemplate) {
    const hasContent = Boolean(
      form.subject.trim() ||
        form.preheader.trim() ||
        form.title.trim() ||
        form.message.trim() ||
        form.images.some((image) => image.trim()) ||
        form.buttonLabel.trim() ||
        form.buttonUrl.trim()
    );

    if (hasContent) {
      const confirmed = window.confirm(
        `Charger le modèle « ${template.name} » et remplacer le contenu actuel ?`
      );

      if (!confirmed) return;
    }

    setForm({
      subject: template.subject,
      preheader: template.preheader,
      title: template.title,
      message: template.message,
      images: [...template.images],
      buttonLabel: template.buttonLabel,
      buttonUrl: template.buttonUrl,
      footerMessage: template.footerMessage,
    });

    setSelectedTemplateId(template.id);
    setPageError("");
    setSendMessage("");
    setPageMessage(
      `Le modèle « ${template.name} » a été chargé. Vous pouvez maintenant personnaliser son contenu.`
    );
  }

  async function addEmail(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    resetMessages();

    const email = normalizeEmail(manualEmail);

    if (!isValidEmail(email)) {
      setPageError(
        "Saisissez une adresse e-mail valide."
      );
      return;
    }

    setAddingSubscribers(true);

    try {
      const response = await authenticatedFetch(
        "/api/admin/newsletter-subscribers",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            source:
              manualSource.trim() || "Ajout manuel",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Impossible d’ajouter l’adresse."
        );
      }

      setPageMessage(
        result.message || "Adresse ajoutée."
      );
      setManualEmail("");

      await loadSubscribers();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l’ajout de l’adresse."
      );
    } finally {
      setAddingSubscribers(false);
    }
  }

  async function addBulkEmails() {
    resetMessages();

    const emails = bulkEmails
      .split(/[\n,;]+/)
      .map(normalizeEmail)
      .filter(Boolean);

    const uniqueEmails =
      Array.from(new Set(emails));

    if (uniqueEmails.length === 0) {
      setPageError(
        "Ajoutez au moins une adresse e-mail."
      );
      return;
    }

    const invalidEmails = uniqueEmails.filter(
      (email) => !isValidEmail(email)
    );

    if (invalidEmails.length > 0) {
      setPageError(
        `Adresse(s) invalide(s) : ${invalidEmails.join(
          ", "
        )}`
      );
      return;
    }

    setAddingSubscribers(true);

    try {
      const response = await authenticatedFetch(
        "/api/admin/newsletter-subscribers",
        {
          method: "POST",
          body: JSON.stringify({
            emails: uniqueEmails,
            source: "Import manuel",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Impossible d’ajouter les adresses."
        );
      }

      setPageMessage(
        `${result.insertedCount || 0} adresse(s) ajoutée(s). ${
          result.duplicateCount || 0
        } doublon(s) ignoré(s).`
      );

      setBulkEmails("");

      await loadSubscribers();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l’import des adresses."
      );
    } finally {
      setAddingSubscribers(false);
    }
  }

  async function deleteSubscriber(
    subscriber: Subscriber
  ) {
    const confirmed = window.confirm(
      `Supprimer ${subscriber.email} de la newsletter ?`
    );

    if (!confirmed) return;

    resetMessages();
    setDeletingId(subscriber.id);

    try {
      const response = await authenticatedFetch(
        "/api/admin/newsletter-subscribers",
        {
          method: "DELETE",
          body: JSON.stringify({
            id: subscriber.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Impossible de supprimer cette adresse."
        );
      }

      setSubscribers((current) =>
        current.filter(
          (item) => item.id !== subscriber.id
        )
      );

      setPageMessage(
        "Adresse supprimée de la newsletter."
      );
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression."
      );
    } finally {
      setDeletingId("");
    }
  }

  function downloadCsv() {
    const blob = new Blob(
      ["\uFEFF", csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `newsletter-abonnes-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  async function importCsv(
    event: ChangeEvent<HTMLInputElement>
  ) {
    resetMessages();

    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const content = await file.text();

      const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      const emails = lines
        .flatMap((line) => line.split(/[;,]/))
        .map((cell) =>
          normalizeEmail(
            cell.replace(/^["']|["']$/g, "")
          )
        )
        .filter((email) => isValidEmail(email));

      const uniqueEmails =
        Array.from(new Set(emails));

      if (uniqueEmails.length === 0) {
        throw new Error(
          "Aucune adresse e-mail valide trouvée dans ce fichier."
        );
      }

      setBulkEmails(uniqueEmails.join("\n"));

      setPageMessage(
        `${uniqueEmails.length} adresse(s) détectée(s). Cliquez sur « Ajouter la liste » pour confirmer l’import.`
      );
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Impossible de lire le fichier CSV."
      );
    } finally {
      event.target.value = "";
    }
  }

  function validateNewsletter() {
    if (!form.subject.trim()) {
      return "Le sujet de la newsletter est obligatoire.";
    }

    if (!form.title.trim()) {
      return "Le titre principal est obligatoire.";
    }

    if (!form.message.trim()) {
      return "Le texte de la newsletter est obligatoire.";
    }

    if (
      form.buttonLabel.trim() &&
      !form.buttonUrl.trim()
    ) {
      return "Ajoutez le lien associé au bouton.";
    }

    if (
      form.buttonUrl.trim() &&
      !/^https?:\/\//i.test(
        normalizePublicUrl(form.buttonUrl)
      )
    ) {
      return "Le lien du bouton est invalide.";
    }

    return "";
  }

  function createNewsletterPayload() {
    const images = form.images
      .map((image) => image.trim())
      .filter(Boolean);

    return {
      ...form,
      images,
      imageUrl: images[0] || "",
      buttonUrl: normalizePublicUrl(
        form.buttonUrl
      ),
    };
  }

  async function sendTestNewsletter() {
    resetMessages();

    const validationError =
      validateNewsletter();

    if (validationError) {
      setPageError(validationError);
      return;
    }

    const email = normalizeEmail(testEmail);

    if (!isValidEmail(email)) {
      setPageError(
        "Saisissez une adresse e-mail valide pour l’envoi test."
      );
      return;
    }

    setSendingTest(true);

    try {
      const response = await authenticatedFetch(
        "/api/admin/send-newsletter",
        {
          method: "POST",
          body: JSON.stringify({
            ...createNewsletterPayload(),
            testEmail: email,
            mode: "test",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Erreur lors de l’envoi du test."
        );
      }

      setSendMessage(
        result.message ||
          `Newsletter test envoyée à ${email}.`
      );
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l’envoi test."
      );
    } finally {
      setSendingTest(false);
    }
  }

  async function sendNewsletter() {
    resetMessages();

    const validationError =
      validateNewsletter();

    if (validationError) {
      setPageError(validationError);
      return;
    }

    if (subscribers.length === 0) {
      setPageError(
        "Aucun abonné ne peut recevoir la newsletter."
      );
      return;
    }

    const confirmed = window.confirm(
      `Envoyer cette newsletter à ${subscribers.length} abonné(s) ?`
    );

    if (!confirmed) return;

    setSendingNewsletter(true);

    try {
      const response = await authenticatedFetch(
        "/api/admin/send-newsletter",
        {
          method: "POST",
          body: JSON.stringify({
            ...createNewsletterPayload(),
            mode: "campaign",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Erreur lors de l’envoi de la newsletter."
        );
      }

      setSendMessage(
        result.message ||
          `Newsletter envoyée à ${
            result.sentCount || 0
          } abonné(s).`
      );
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l’envoi de la newsletter."
      );
    } finally {
      setSendingNewsletter(false);
    }
  }

  function deselectTemplate() {
    const confirmed = window.confirm(
      "Désélectionner le modèle actif et revenir à une newsletter vierge ?"
    );

    if (!confirmed) return;

    setForm({
      ...EMPTY_FORM,
      images: [],
    });
    setSelectedTemplateId("");
    setSendMessage("");
    setPageError("");
    setPageMessage(
      "Le modèle a été désélectionné. La newsletter générique est prête."
    );
  }

  function resetNewsletter() {
    const confirmed = window.confirm(
      "Effacer le contenu actuel de la newsletter ?"
    );

    if (!confirmed) return;

    setForm({
      ...EMPTY_FORM,
      images: [],
    });
    setSelectedTemplateId("");

    setSendMessage("");
    setPageMessage("");
    setPageError("");
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#f8f4ee] px-5 py-10 text-[#24110d]">
        <section className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-[#eadcca] bg-white p-8 shadow-sm">
            <p className="text-sm text-[#6d5b50]">
              Chargement de l’outil newsletter...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f4ee] px-5 py-10 text-[#24110d]">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex text-sm font-medium text-[#8a1f1f] hover:underline"
        >
          ← Retour admin
        </Link>

        <header className="mb-8 rounded-[2rem] border border-[#eadcca] bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f]">
            Administration
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="font-serif text-4xl text-[#24110d]">
                Outil newsletter
              </h1>

              <p className="mt-3 max-w-3xl leading-7 text-[#6d5b50]">
                Gérez vos abonnés, préparez une newsletter illustrée,
                contrôlez son aperçu et effectuez un envoi test avant la
                campagne.
              </p>
            </div>

            <div className="rounded-2xl bg-[#fff8ee] px-6 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8a6a2f]">
                Abonnés
              </p>

              <p className="mt-1 text-3xl font-semibold">
                {subscribers.length}
              </p>
            </div>
          </div>
        </header>

        {pageError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {pageError}
          </div>
        )}

        {pageMessage && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
            {pageMessage}
          </div>
        )}

        {sendMessage && (
          <div className="mb-6 rounded-2xl border border-[#d8b56d] bg-[#fff8df] px-5 py-4 text-sm font-medium text-[#6d4a10]">
            {sendMessage}
          </div>
        )}

        <section className="mb-8 overflow-hidden rounded-[2rem] border border-[#eadcca] bg-white shadow-sm">
          <div className="border-b border-[#eadcca] bg-gradient-to-r from-[#fffaf3] via-white to-[#fff8ee] p-6 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#8a6a2f]">
                  Bibliothèque CMS
                </p>

                <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                  Modèles de newsletters
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6d5b50]">
                  Sélectionnez un univers pour préremplir immédiatement tous
                  les champs de la campagne.
                </p>
              </div>

              <div className="rounded-2xl border border-[#eadcca] bg-white px-6 py-4 text-center shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8a6a2f]">
                  Bibliothèque
                </p>
                <p className="mt-1 text-3xl font-semibold">
                  {NEWSLETTER_TEMPLATES.length}
                </p>
                <p className="text-xs text-[#6d5b50]">modèles</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
              <label className="relative block">
                <span className="sr-only">Rechercher un modèle</span>
                <input
                  type="search"
                  value={templateSearch}
                  onChange={(event) =>
                    setTemplateSearch(event.target.value)
                  }
                  placeholder="Rechercher un modèle, une région ou une campagne..."
                  className="w-full rounded-2xl border border-[#dfcfb8] bg-white px-5 py-4 pr-12 outline-none transition focus:border-[#8a1f1f]"
                />
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-lg text-[#8a6a2f]">
                  ⌕
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                {templateCategories.map((category) => {
                  const isActive = templateCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setTemplateCategory(category)}
                      className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-[#8a1f1f] text-white shadow-sm"
                          : "border border-[#dfcfb8] bg-white text-[#6d5b50] hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {filteredTemplates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d8b56d] bg-[#fffdf7] p-8 text-center">
                <p className="font-serif text-2xl">Aucun modèle trouvé</p>
                <button
                  type="button"
                  onClick={() => {
                    setTemplateSearch("");
                    setTemplateCategory("Tous");
                  }}
                  className="mt-4 text-sm font-semibold text-[#8a1f1f] hover:underline"
                >
                  Réinitialiser la recherche
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTemplates.map((template) => {
                  const isSelected =
                    selectedTemplateId === template.id;

                  const coverImage = normalizeTemplateImageUrl(
                    template.images?.[0]
                  );

                  return (
                    <article
                      key={template.id}
                      className={`group overflow-hidden rounded-[1.7rem] border bg-white transition duration-300 ${
                        isSelected
                          ? "border-[#8a1f1f] shadow-[0_16px_42px_rgba(138,31,31,0.18)]"
                          : "border-[#eadcca] hover:-translate-y-1 hover:border-[#c5a46a] hover:shadow-xl"
                      }`}
                    >
                      <div className="relative h-56 overflow-hidden bg-[linear-gradient(135deg,#2f1712,#8a1f1f)]">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={template.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,#d9bd8c,transparent_42%),linear-gradient(135deg,#2f1712,#8a1f1f)]" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

                        <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                          {template.category}
                        </span>

                        {isSelected && (
                          <span className="absolute right-4 top-4 rounded-full bg-[#fff8df] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a1f1f]">
                            Actif
                          </span>
                        )}

                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#ead4a9]">
                            The Wine Watchers
                          </p>

                          <h3 className="mt-2 font-serif text-3xl leading-tight text-white">
                            {template.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="min-h-[72px] text-sm leading-6 text-[#6d5b50]">
                          {template.description}
                        </p>

                        <div className="mt-4 border-t border-[#f0e5d7] pt-4">
                          <p className="line-clamp-2 text-xs leading-5 text-[#8a6a2f]">
                            {template.subject}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => applyTemplate(template)}
                          className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
                            isSelected
                              ? "bg-[#8a1f1f] text-white"
                              : "bg-[#fff4e6] text-[#8a1f1f] group-hover:bg-[#8a1f1f] group-hover:text-white"
                          }`}
                        >
                          {isSelected
                            ? "Modèle sélectionné"
                            : "Utiliser ce modèle"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-[#d8b56d] bg-[#fffdf7] px-5 py-4">
              <div>
                <p className="font-semibold text-[#24110d]">
                  {selectedTemplate
                    ? `Modèle actif : ${selectedTemplate.name}`
                    : "Aucun modèle sélectionné"}
                </p>
                <p className="mt-1 text-sm text-[#6d5b50]">
                  Les modèles personnalisés seront ajoutés lors de la prochaine étape.
                </p>
              </div>

              {selectedTemplate && (
                <button
                  type="button"
                  onClick={deselectTemplate}
                  className="rounded-full border border-[#d8b56d] bg-white px-5 py-3 text-sm font-semibold text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
                >
                  Désélectionner
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <NewsletterEditor
            form={form}
            testEmail={testEmail}
            subscriberCount={subscribers.length}
            sendingTest={sendingTest}
            sendingNewsletter={sendingNewsletter}
            onFormChange={updateForm}
            onTestEmailChange={setTestEmail}
            onSendTest={sendTestNewsletter}
            onSendNewsletter={sendNewsletter}
            onReset={resetNewsletter}
          />

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-[#eadcca] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#8a6a2f]">
                    Contrôle
                  </p>

                  <h2 className="mt-2 font-serif text-3xl">
                    Aperçu de la newsletter
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPreview((current) => !current)
                  }
                  className="rounded-full border border-[#8a6a2f]/40 px-5 py-3 text-sm font-semibold text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
                >
                  {showPreview
                    ? "Masquer l’aperçu"
                    : "Afficher l’aperçu"}
                </button>
              </div>

              {showPreview && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-[#eadcca] bg-[#f8f4ee] p-4">
                  <NewsletterPreview
                    preheader={form.preheader}
                    title={form.title}
                    message={form.message}
                    images={form.images}
                    buttonLabel={form.buttonLabel}
                    buttonUrl={normalizePublicUrl(
                      form.buttonUrl
                    )}
                    footerMessage={form.footerMessage}
                  />
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-[#eadcca] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#8a6a2f]">
                    Base abonnés
                  </p>

                  <h2 className="mt-2 font-serif text-3xl">
                    Gestion des destinataires
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => void loadSubscribers()}
                  disabled={loading}
                  className="rounded-full border border-[#8a6a2f]/40 px-5 py-3 text-sm font-semibold text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Chargement..." : "Actualiser"}
                </button>
              </div>

              <form
                onSubmit={addEmail}
                className="mt-6 rounded-2xl border border-[#eadcca] bg-[#fffaf3] p-5"
              >
                <h3 className="font-serif text-2xl">
                  Ajouter une adresse
                </h3>

                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px_auto]">
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(event) =>
                      setManualEmail(event.target.value)
                    }
                    placeholder="client@exemple.com"
                    className="rounded-xl border border-[#dfcfb8] bg-white px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
                  />

                  <input
                    type="text"
                    value={manualSource}
                    onChange={(event) =>
                      setManualSource(event.target.value)
                    }
                    placeholder="Source"
                    className="rounded-xl border border-[#dfcfb8] bg-white px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
                  />

                  <button
                    type="submit"
                    disabled={addingSubscribers}
                    className="rounded-full bg-[#8a1f1f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#641313] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Ajouter
                  </button>
                </div>
              </form>

              <div className="mt-5 rounded-2xl border border-[#eadcca] bg-[#fffaf3] p-5">
                <h3 className="font-serif text-2xl">
                  Importer plusieurs adresses
                </h3>

                <textarea
                  value={bulkEmails}
                  onChange={(event) =>
                    setBulkEmails(event.target.value)
                  }
                  rows={6}
                  placeholder={
                    "Une adresse par ligne, ou séparées par une virgule ou un point-virgule."
                  }
                  className="mt-4 w-full rounded-xl border border-[#dfcfb8] bg-white px-4 py-3 leading-6 outline-none transition focus:border-[#8a1f1f]"
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void addBulkEmails()}
                    disabled={addingSubscribers}
                    className="rounded-full bg-[#8a6a2f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6d4a10] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Ajouter la liste
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      csvInputRef.current?.click()
                    }
                    className="rounded-full border border-[#8a6a2f]/40 px-6 py-3 text-sm font-semibold text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
                  >
                    Lire un fichier CSV
                  </button>

                  <button
                    type="button"
                    onClick={downloadCsv}
                    disabled={subscribers.length === 0}
                    className="rounded-full border border-[#8a6a2f]/40 px-6 py-3 text-sm font-semibold text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Exporter en CSV
                  </button>

                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={importCsv}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="subscriber-search"
                  className="mb-2 block text-sm font-semibold"
                >
                  Rechercher un abonné
                </label>

                <input
                  id="subscriber-search"
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Adresse e-mail ou source"
                  className="w-full rounded-xl border border-[#dfcfb8] px-4 py-3 outline-none transition focus:border-[#8a1f1f]"
                />
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-[#eadcca]">
                {loading ? (
                  <div className="p-6 text-sm text-[#6d5b50]">
                    Chargement des abonnés...
                  </div>
                ) : filteredSubscribers.length === 0 ? (
                  <div className="p-6 text-sm text-[#6d5b50]">
                    Aucun abonné trouvé.
                  </div>
                ) : (
                  <div className="max-h-[540px] overflow-auto">
                    <table className="min-w-full divide-y divide-[#eadcca] text-sm">
                      <thead className="sticky top-0 bg-[#fffaf3]">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">
                            Adresse
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Source
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Inscription
                          </th>
                          <th className="px-4 py-3 text-right font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#eadcca] bg-white">
                        {filteredSubscribers.map(
                          (subscriber) => (
                            <tr key={subscriber.id}>
                              <td className="px-4 py-3 font-medium">
                                {subscriber.email}
                              </td>

                              <td className="px-4 py-3 text-[#6d5b50]">
                                {subscriber.source || "—"}
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 text-[#6d5b50]">
                                {formatDate(
                                  subscriber.created_at
                                )}
                              </td>

                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() =>
                                    void deleteSubscriber(
                                      subscriber
                                    )
                                  }
                                  disabled={
                                    deletingId === subscriber.id
                                  }
                                  className="font-semibold text-[#8a1f1f] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {deletingId === subscriber.id
                                    ? "Suppression..."
                                    : "Supprimer"}
                                </button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm text-[#6d5b50]">
                {filteredSubscribers.length} résultat(s) affiché(s)
                sur {subscribers.length} abonné(s).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}