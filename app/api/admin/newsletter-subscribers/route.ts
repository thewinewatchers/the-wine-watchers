import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscriberInput = {
  email?: unknown;
  emails?: unknown;
  source?: unknown;
};

function getServerConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    throw new Error("Configuration Supabase manquante.");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
  };
}

function normalizeEmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeSource(value: unknown) {
  const source = String(value || "Ajout manuel").trim();
  return source || "Ajout manuel";
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";

  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return "";
  }

  return authorization.slice(7).trim();
}

async function requireAdmin(request: Request) {
  const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } =
    getServerConfig();

  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return {
      error: NextResponse.json(
        { error: "Connexion administrateur requise." },
        { status: 401 }
      ),
    };
  }

  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser(accessToken);

  if (userError || !user) {
    return {
      error: NextResponse.json(
        { error: "Session administrateur invalide ou expirée." },
        { status: 401 }
      ),
    };
  }

  const allowedEmails = String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const userEmail = String(user.email || "").toLowerCase();

  const metadataRole =
    String(user.app_metadata?.role || user.user_metadata?.role || "")
      .trim()
      .toLowerCase();

  const metadataAdmin =
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.is_admin === true ||
    metadataRole === "admin";

  const emailAllowed =
    allowedEmails.length === 0 || allowedEmails.includes(userEmail);

  if (!metadataAdmin && !emailAllowed) {
    return {
      error: NextResponse.json(
        { error: "Accès administrateur refusé." },
        { status: 403 }
      ),
    };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return {
    user,
    supabaseAdmin,
  };
}

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);

    if ("error" in auth) {
      return auth.error;
    }

    const { data, error } = await auth.supabaseAdmin
      .from("newsletter_subscribers")
      .select("id,email,source,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscribers: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Erreur lecture abonnés newsletter :", error);

    return NextResponse.json(
      { error: "Erreur lors du chargement des abonnés." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);

    if ("error" in auth) {
      return auth.error;
    }

    const body = (await request.json()) as SubscriberInput;
    const source = normalizeSource(body.source);

    const submittedEmails: unknown[] = [];

    if (body.email !== undefined) {
      submittedEmails.push(body.email);
    }

    if (Array.isArray(body.emails)) {
      submittedEmails.push(...body.emails);
    } else if (typeof body.emails === "string") {
      submittedEmails.push(
        ...body.emails
          .split(/[\n,;]+/)
          .map((email) => email.trim())
          .filter(Boolean)
      );
    }

    const normalizedEmails = Array.from(
      new Set(submittedEmails.map(normalizeEmail).filter(Boolean))
    );

    if (normalizedEmails.length === 0) {
      return NextResponse.json(
        { error: "Aucune adresse e-mail fournie." },
        { status: 400 }
      );
    }

    const invalidEmails = normalizedEmails.filter(
      (email) => !isValidEmail(email)
    );

    if (invalidEmails.length > 0) {
      return NextResponse.json(
        {
          error: "Certaines adresses e-mail sont invalides.",
          invalidEmails,
        },
        { status: 400 }
      );
    }

    const rows = normalizedEmails.map((email) => ({
      email,
      source,
    }));

    const { data, error } = await auth.supabaseAdmin
      .from("newsletter_subscribers")
      .upsert(rows, {
        onConflict: "email",
        ignoreDuplicates: true,
      })
      .select("id,email,source,created_at");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const insertedCount = data?.length || 0;
    const duplicateCount = normalizedEmails.length - insertedCount;

    return NextResponse.json({
      success: true,
      insertedCount,
      duplicateCount,
      subscribers: data || [],
      message:
        insertedCount === 0
          ? "Toutes les adresses étaient déjà inscrites."
          : `${insertedCount} adresse(s) ajoutée(s) avec succès.`,
    });
  } catch (error) {
    console.error("Erreur ajout abonnés newsletter :", error);

    return NextResponse.json(
      { error: "Erreur lors de l’ajout des abonnés." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAdmin(request);

    if ("error" in auth) {
      return auth.error;
    }

    const body = await request.json();

    const id = String(body?.id || "").trim();
    const email = normalizeEmail(body?.email);

    if (!id && !email) {
      return NextResponse.json(
        { error: "Identifiant ou adresse e-mail obligatoire." },
        { status: 400 }
      );
    }

    let query = auth.supabaseAdmin
      .from("newsletter_subscribers")
      .delete();

    query = id ? query.eq("id", id) : query.eq("email", email);

    const { data, error } = await query.select(
      "id,email,source,created_at"
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Abonné introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: data[0],
      message: "Adresse supprimée de la newsletter.",
    });
  } catch (error) {
    console.error("Erreur suppression abonné newsletter :", error);

    return NextResponse.json(
      { error: "Erreur lors de la suppression de l’abonné." },
      { status: 500 }
    );
  }
}