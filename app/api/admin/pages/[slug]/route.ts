import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SitePagePayload = {
  name?: string;
  page_title?: string;
  eyebrow?: string | null;
  intro?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  sections?: unknown[];
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

  const allowedEmails = [
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
    allowedEmails.includes(userEmail);

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

function normalizePayload(
  body: SitePagePayload
) {
  const payload: Record<
    string,
    unknown
  > = {
    updated_at:
      new Date().toISOString(),
  };

  if ("name" in body) {
    payload.name =
      cleanText(body.name);
  }

  if ("page_title" in body) {
    payload.page_title =
      cleanText(body.page_title);
  }

  if ("eyebrow" in body) {
    payload.eyebrow =
      cleanText(body.eyebrow);
  }

  if ("intro" in body) {
    payload.intro =
      cleanText(body.intro);
  }

  if ("seo_title" in body) {
    payload.seo_title =
      cleanText(body.seo_title);
  }

  if (
    "seo_description" in body
  ) {
    payload.seo_description =
      cleanText(
        body.seo_description
      );
  }

  if ("sections" in body) {
    payload.sections =
      Array.isArray(body.sections)
        ? body.sections
        : [];
  }

  if ("is_active" in body) {
    payload.is_active =
      Boolean(body.is_active);
  }

  return payload;
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    const auth =
      await requireAdmin(request);

    if ("error" in auth) {
      return auth.error;
    }

    const { supabaseAdmin } = auth;

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Slug de page manquant.",
        },
        { status: 400 }
      );
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("site_pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          error:
            "Impossible de charger la page.",
          details:
            error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Page introuvable.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      page: data,
    });
  } catch (error) {
    console.error(
      "Erreur GET /api/admin/pages/[slug] :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur serveur lors du chargement de la page.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    const auth =
      await requireAdmin(request);

    if ("error" in auth) {
      return auth.error;
    }

    const { supabaseAdmin } = auth;

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Slug de page manquant.",
        },
        { status: 400 }
      );
    }

    let body: SitePagePayload;

    try {
      body =
        (await request.json()) as SitePagePayload;
    } catch {
      return NextResponse.json(
        {
          error:
            "Données invalides.",
        },
        { status: 400 }
      );
    }

    const payload =
      normalizePayload(body);

    if (
      "name" in payload &&
      (!payload.name ||
        typeof payload.name !==
          "string")
    ) {
      return NextResponse.json(
        {
          error:
            "Le nom de la page est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (
      "page_title" in payload &&
      (!payload.page_title ||
        typeof payload.page_title !==
          "string")
    ) {
      return NextResponse.json(
        {
          error:
            "Le titre de la page est obligatoire.",
        },
        { status: 400 }
      );
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("site_pages")
      .update(payload)
      .eq("slug", slug)
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          error:
            "Erreur lors de la modification de la page.",
          details:
            error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Page introuvable.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      page: data,
    });
  } catch (error) {
    console.error(
      "Erreur PATCH /api/admin/pages/[slug] :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur serveur lors de la modification de la page.",
      },
      { status: 500 }
    );
  }
}