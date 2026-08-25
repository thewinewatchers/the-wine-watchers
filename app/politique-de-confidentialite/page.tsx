import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const SITE_URL = "https://www.thewinewatchers.com";
const PAGE_SLUG = "politique-de-confidentialite";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ContentBlock = {
  type: "paragraph" | "subheading";
  text: string;
};

type PageSection = {
  title: string;
  blocks: ContentBlock[];
};

type SitePage = {
  slug: string;
  name: string;
  page_title: string;
  eyebrow: string | null;
  intro: string | null;
  seo_title: string | null;
  seo_description: string | null;
  sections: PageSection[];
  is_active: boolean;
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

async function getPage(): Promise<SitePage | null> {
  const { data, error } = await supabase
    .from("site_pages")
    .select(
      `
        slug,
        name,
        page_title,
        eyebrow,
        intro,
        seo_title,
        seo_description,
        sections,
        is_active
      `
    )
    .eq("slug", PAGE_SLUG)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    slug: data.slug,
    name: data.name,
    page_title: data.page_title,
    eyebrow: data.eyebrow,
    intro: data.intro,
    seo_title: data.seo_title,
    seo_description: data.seo_description,
    sections: normalizeSections(data.sections),
    is_active: data.is_active,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();

  const title =
    page?.seo_title ||
    "Politique de confidentialité | The Wine Watchers";

  const description =
    page?.seo_description ||
    "Consultez la politique de confidentialité de The Wine Watchers SL concernant la collecte, l’utilisation, la conservation et la protection des données personnelles.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/politique-de-confidentialite`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/politique-de-confidentialite`,
      siteName: "The Wine Watchers",
      locale: "fr_FR",
      type: "website",
    },
  };
}

function renderText(sectionTitle: string, text: string) {
  const lines = text.split("\n");

  const isBulletList =
    lines.length > 1 &&
    lines.every(
      (line) =>
        !line.trim() ||
        line.trim().startsWith("•")
    );

  if (isBulletList) {
    return (
      <ul className="mt-4 list-disc pl-8 leading-8 text-[#6d5b50]">
        {lines
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, index) => (
            <li key={index}>
              {line.replace(/^•\s*/, "")}
            </li>
          ))}
      </ul>
    );
  }

  if (
    sectionTitle === "Cookies" &&
    text.includes("Politique de cookies")
  ) {
    return (
      <p className="mt-4 leading-8 text-[#6d5b50]">
        Pour plus d&apos;informations, vous pouvez consulter notre{" "}
        <Link
          href="/politique-cookies"
          className="font-semibold text-[#8a1f1f] underline-offset-4 hover:underline"
        >
          Politique de cookies
        </Link>
        .
      </p>
    );
  }

  const email = "contact@thewinewatchers.com";

  if (text.includes(email)) {
    const parts = text.split(email);

    return (
      <p className="mt-4 whitespace-pre-line leading-8 text-[#6d5b50]">
        {parts[0]}
        <a
          href={`mailto:${email}`}
          className="font-semibold text-[#8a1f1f] underline-offset-4 hover:underline"
        >
          {email}
        </a>
        {parts.slice(1).join(email)}
      </p>
    );
  }

  return (
    <p className="mt-4 whitespace-pre-line leading-8 text-[#6d5b50]">
      {text}
    </p>
  );
}

export default async function PolitiqueConfidentialitePage() {
  const page = await getPage();

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#24110d]">
      <section className="bg-[#170606] px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="text-sm uppercase tracking-[0.25em] text-[#d8b56d]"
          >
            ← Retour accueil
          </Link>

          {page.eyebrow && (
            <p className="mt-8 text-sm uppercase tracking-[0.25em] text-[#d8b56d]">
              {page.eyebrow}
            </p>
          )}

          <h1 className="mt-8 font-serif text-5xl">
            {page.page_title}
          </h1>

          {page.intro && (
            <p className="mt-6 max-w-3xl text-white/70">
              {page.intro}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm md:p-10">
          {page.sections.map((section, sectionIndex) => (
            <section key={`${section.title}-${sectionIndex}`}>
              <h2
                className={
                  sectionIndex === 0
                    ? "font-serif text-3xl"
                    : "mt-10 font-serif text-3xl"
                }
              >
                {section.title}
              </h2>

              {section.blocks.map((block, blockIndex) => {
                if (block.type === "subheading") {
                  return (
                    <h3
                      key={`${sectionIndex}-${blockIndex}`}
                      className="mt-8 font-serif text-2xl"
                    >
                      {block.text}
                    </h3>
                  );
                }

                return (
                  <div key={`${sectionIndex}-${blockIndex}`}>
                    {renderText(section.title, block.text)}
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}