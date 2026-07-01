import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_URLS = [
  "https://www.thewinewatchers.com",
  "https://thewinewatchers.com",
  "http://www.thewinewatchers.com",
  "http://thewinewatchers.com",
];

function cleanPath(value: string) {
  let cleaned = String(value || "").trim();

  for (const siteUrl of SITE_URLS) {
    if (cleaned.startsWith(siteUrl)) {
      cleaned = cleaned.replace(siteUrl, "");
    }

    if (cleaned.startsWith(`/${siteUrl}`)) {
      cleaned = cleaned.replace(`/${siteUrl}`, "");
    }
  }

  cleaned = cleaned.split("?")[0].split("#")[0].trim();

  if (!cleaned.startsWith("/")) {
    cleaned = `/${cleaned}`;
  }

  return cleaned.replace(/\/+/g, "/");
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("redirects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ redirects: data || [] });
}

export async function POST(request: Request) {
  const body = await request.json();

  const source_path = cleanPath(body.source_path || "");
  const destination_path = cleanPath(body.destination_path || "");

  if (!source_path || !destination_path || source_path === "/" || destination_path === "/") {
    return NextResponse.json(
      { error: "Ancienne URL et nouvelle URL obligatoires." },
      { status: 400 }
    );
  }

  if (source_path === destination_path) {
    return NextResponse.json(
      {
        error:
          "L’ancienne URL et la nouvelle URL ne peuvent pas être identiques.",
      },
      { status: 400 }
    );
  }

  if (source_path.includes("https:/") || destination_path.includes("https:/")) {
    return NextResponse.json(
      { error: "Format d’URL invalide après nettoyage." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.from("redirects").upsert(
    {
      source_path,
      destination_path,
      permanent: body.permanent ?? true,
      active: body.active ?? true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "source_path" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    redirect: {
      source_path,
      destination_path,
    },
  });
}

export async function DELETE(request: Request) {
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "ID manquant." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("redirects")
    .delete()
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}