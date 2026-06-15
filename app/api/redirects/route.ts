import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ redirect: null });
  }

  const { data, error } = await supabaseAdmin
    .from("redirects")
    .select("destination_path, permanent")
    .eq("source_path", path)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ redirect: null });
  }

  return NextResponse.json({ redirect: data });
}