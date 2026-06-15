import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function cleanPath(path: string) {
  const cleaned = path.trim();

  if (!cleaned.startsWith("/")) {
    return `/${cleaned}`;
  }

  return cleaned;
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

  if (!source_path || !destination_path) {
    return NextResponse.json(
      { error: "Ancienne URL et nouvelle URL obligatoires." },
      { status: 400 }
    );
  }

  if (source_path === destination_path) {
    return NextResponse.json(
      { error: "L’ancienne URL et la nouvelle URL ne peuvent pas être identiques." },
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

  return NextResponse.json({ success: true });
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