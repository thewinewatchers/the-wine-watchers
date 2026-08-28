import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey
);

type ContentBlock = {
  type: "paragraph" | "subheading";
  text: string;
};

type PageSection = {
  title: string;
  blocks: ContentBlock[];
};

type CreatePagePayload = {
  slug?: string;
  name?: string;
  page_title?: string;
  eyebrow?: string | null;
  intro?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  sections?: PageSection[];
  is_active?: boolean;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanText(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  const cleaned = String(value).trim();

  return cleaned || null;
}

function normalizeSections(
  value: unknown
): PageSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((section) => {
      const rawSection =
        section && typeof section === "object"
          ? (section as Record<string, unknown>)
          : {};

      const title = String(
        rawSection.title || ""
      ).trim();

      const rawBlocks = Array.isArray(
        rawSection.blocks
      )
        ? rawSection.blocks
        : [];

      const blocks: ContentBlock[] =
        rawBlocks
          .map((block) => {
            const rawBlock =
              block &&
              typeof block === "object"
                ? (block as Record<
                    string,
                    unknown
                  >)
                : {};

            const type:
              | "paragraph"
              | "subheading" =
              rawBlock.type ===
              "subheading"
                ? "subheading"
                : "paragraph";

            return {
              type,
              text: String(
                rawBlock.text || ""
              ).trim(),
            };
          })
          .filter(
            (block) =>
              block.text.length > 0
          );

      return {
        title,
        blocks,
      };
    })
    .filter(
      (section) =>
        section.title.length > 0 &&
        section.blocks.length > 0
    );
}

export async function POST(
  request: Request
) {
  let body: CreatePagePayload;

  try {
    body =
      (await request.json()) as CreatePagePayload;
  } catch {
    return NextResponse.json(
      {
        error:
          "Données invalides.",
      },
      { status: 400 }
    );
  }

  const slug = createSlug(
    String(body.slug || "")
  );

  const name = cleanText(body.name);
  const pageTitle = cleanText(
    body.page_title
  );

  const sections =
    normalizeSections(body.sections);

  if (!slug) {
    return NextResponse.json(
      {
        error:
          "Le slug de la page est obligatoire.",
      },
      { status: 400 }
    );
  }

  if (!name) {
    return NextResponse.json(
      {
        error:
          "Le nom de la page est obligatoire.",
      },
      { status: 400 }
    );
  }

  if (!pageTitle) {
    return NextResponse.json(
      {
        error:
          "Le titre principal est obligatoire.",
      },
      { status: 400 }
    );
  }

  if (sections.length === 0) {
    return NextResponse.json(
      {
        error:
          "La page doit contenir au moins une section avec du contenu.",
      },
      { status: 400 }
    );
  }

  const {
    data: existingPage,
    error: existingError,
  } = await supabaseAdmin
    .from("site_pages")
    .select("id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      {
        error:
          "Impossible de vérifier l’adresse de la page.",
        details:
          existingError.message,
      },
      { status: 500 }
    );
  }

  if (existingPage) {
    return NextResponse.json(
      {
        error:
          "Une page utilise déjà cette adresse.",
      },
      { status: 409 }
    );
  }

  const payload = {
    slug,
    name,
    page_title: pageTitle,
    eyebrow: cleanText(
      body.eyebrow
    ),
    intro: cleanText(
      body.intro
    ),
    seo_title: cleanText(
      body.seo_title
    ),
    seo_description:
      cleanText(
        body.seo_description
      ),
    sections,
    is_active:
      body.is_active !== false,
    updated_at:
      new Date().toISOString(),
  };

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("site_pages")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      {
        error:
          "Erreur lors de la création de la page.",
        details:
          error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      page: data,
    },
    { status: 201 }
  );
}