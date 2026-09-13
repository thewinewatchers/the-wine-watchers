import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

function getServerConfig() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    !supabaseServiceKey
  ) {
    throw new Error(
      "Configuration Supabase incomplète."
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
  };
}

function getBearerToken(request: Request) {
  const authorization =
    request.headers.get("authorization") || "";

  if (
    !authorization
      .toLowerCase()
      .startsWith("bearer ")
  ) {
    return "";
  }

  return authorization.slice(7).trim();
}

async function requireAdmin(
  request: Request
) {
  const {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
  } = getServerConfig();

  const accessToken =
    getBearerToken(request);

  if (!accessToken) {
    return {
      error: NextResponse.json(
        {
          error:
            "Connexion administrateur requise.",
        },
        { status: 401 }
      ),
    };
  }

  const supabaseAuth = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } =
    await supabaseAuth.auth.getUser(
      accessToken
    );

  if (userError || !user) {
    return {
      error: NextResponse.json(
        {
          error:
            "Session administrateur invalide ou expirée.",
        },
        { status: 401 }
      ),
    };
  }

  const configuredEmails = [
    process.env.ADMIN_EMAIL || "",
    process.env.ADMIN_EMAILS || "",
  ]
    .join(",")
    .split(",")
    .map((email) =>
      email.trim().toLowerCase()
    )
    .filter(Boolean);

  const userEmail = String(
    user.email || ""
  )
    .trim()
    .toLowerCase();

  const metadataRole = String(
    user.app_metadata?.role ||
      user.user_metadata?.role ||
      ""
  )
    .trim()
    .toLowerCase();

  const metadataAdmin =
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.is_admin === true ||
    metadataRole === "admin";

  const emailAllowed =
    configuredEmails.includes(userEmail);

  if (
    !metadataAdmin &&
    !emailAllowed
  ) {
    return {
      error: NextResponse.json(
        {
          error:
            "Accès administrateur refusé.",
        },
        { status: 403 }
      ),
    };
  }

  const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  return {
    user,
    supabaseAdmin,
  };
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

function cleanText(value: unknown) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const cleaned =
    String(value).trim();

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
        section &&
        typeof section === "object"
          ? (section as Record<
              string,
              unknown
            >)
          : {};

      const title = String(
        rawSection.title || ""
      ).trim();

      const rawBlocks =
        Array.isArray(
          rawSection.blocks
        )
          ? rawSection.blocks
          : [];

      const blocks: ContentBlock[] =
        rawBlocks
          .map((block) => {
            const rawBlock =
              block &&
              typeof block ===
                "object"
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

export async function GET(
  request: Request
) {
  try {
    const auth =
      await requireAdmin(request);

    if ("error" in auth) {
      return auth.error;
    }

    const { supabaseAdmin } = auth;

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("site_pages")
      .select(
        "id, slug, name, page_title, is_active, updated_at"
      )
      .order("name", {
        ascending: true,
      });

    if (error) {
      return NextResponse.json(
        {
          error:
            "Impossible de charger les pages.",
          details:
            error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pages: data || [],
    });
  } catch (error) {
    console.error(
      "Erreur GET /api/admin/pages :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur serveur lors du chargement des pages.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const auth =
      await requireAdmin(request);

    if ("error" in auth) {
      return auth.error;
    }

    const { supabaseAdmin } = auth;

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

    const name =
      cleanText(body.name);

    const pageTitle =
      cleanText(body.page_title);

    const sections =
      normalizeSections(
        body.sections
      );

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
  } catch (error) {
    console.error(
      "Erreur POST /api/admin/pages :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur serveur lors de la création de la page.",
      },
      { status: 500 }
    );
  }
}