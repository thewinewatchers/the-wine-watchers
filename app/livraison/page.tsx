import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const SITE_URL = "https://www.thewinewatchers.com";
const PAGE_SLUG = "livraison";

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
    "Livraison, retrait, retours et remboursements | The Wine Watchers";

  const description =
    page?.seo_description ||
    "Informations sur la livraison, le retrait, les retours, le droit de rétractation et les remboursements chez The Wine Watchers.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/livraison`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/livraison`,
      siteName: "The Wine Watchers",
      locale: "fr_FR",
      type: "website",
    },
  };
}

function renderText(text: string) {
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
      <ul className="mt-4 list-disc space-y-2 pl-6 text-neutral-700">
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

  const email = "contact@thewinewatchers.com";

  if (text.includes(email)) {
    const parts = text.split(email);

    return (
      <p className="mt-4 whitespace-pre-line leading-7 text-neutral-700">
        {parts[0]}
        <a
          href={`mailto:${email}`}
          className="font-semibold underline"
        >
          {email}
        </a>
        {parts.slice(1).join(email)}
      </p>
    );
  }

  return (
    <p className="mt-4 whitespace-pre-line leading-7 text-neutral-700">
      {text}
    </p>
  );
}

export default async function LivraisonPage() {
  const page = await getPage();

  if (!page) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MerchantReturnPolicy",
    name: "Politique de livraison, retours et remboursements The Wine Watchers",
    url: `${SITE_URL}/livraison`,
    applicableCountry: ["FR", "BE", "LU", "ES", "IT", "DE", "NL"],
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnShippingFees",
    refundType: "https://schema.org/FullRefund",
  };

  return (
    <main className="bg-[#f8f4ef] text-[#1f1713]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <section className="mx-auto max-w-5xl px-6 py-16">
        {page.eyebrow && (
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#8a6a3f]">
            {page.eyebrow}
          </p>
        )}

        <h1 className="mb-6 text-4xl font-serif text-[#2a120b] md:text-5xl">
          {page.page_title}
        </h1>

        {page.intro && (
          <p className="mb-10 max-w-3xl text-lg leading-8 text-neutral-700">
            {page.intro.replace(
              " Elle complète nos Conditions Générales de Vente.",
              ""
            )}
            {" "}
            <Link
              href="/conditions-generales-de-vente"
              className="font-semibold underline"
            >
              Conditions Générales de Vente
            </Link>
            .
          </p>
        )}

        <div className="space-y-8">
          {page.sections.map((section, sectionIndex) => {
            const isImportant =
              section.title === "Information importante";

            return (
              <section
                key={`${section.title}-${sectionIndex}`}
                className={
                  isImportant
                    ? "rounded-2xl border border-[#d6c3a5] bg-[#fffaf2] p-6"
                    : "rounded-2xl bg-white p-6 shadow-sm"
                }
              >
                <h2
                  className={
                    isImportant
                      ? "mb-3 text-xl font-serif text-[#2a120b]"
                      : "mb-4 text-2xl font-serif text-[#2a120b]"
                  }
                >
                  {section.title}
                </h2>

                {section.blocks.map((block, blockIndex) => {
                  if (block.type === "subheading") {
                    return (
                      <h3
                        key={`${sectionIndex}-${blockIndex}`}
                        className="mt-6 text-xl font-serif text-[#2a120b]"
                      >
                        {block.text}
                      </h3>
                    );
                  }

                  return (
                    <div key={`${sectionIndex}-${blockIndex}`}>
                      {renderText(block.text)}
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}