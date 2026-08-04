import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

function cleanName(value: unknown) {
  return String(value || "").trim();
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const action = cleanName(body.action);

    const { data: currentAppellation, error: loadError } = await supabaseAdmin
      .from("appellations")
      .select("id, name, active, region, category")
      .eq("id", id)
      .maybeSingle();

    if (loadError) {
      return NextResponse.json(
        {
          error: "Erreur lors de la recherche de l’appellation.",
          details: loadError.message,
        },
        { status: 500 }
      );
    }

    if (!currentAppellation) {
      return NextResponse.json(
        { error: "Appellation introuvable." },
        { status: 404 }
      );
    }

    if (action === "toggle-active") {
      const nextActive = !Boolean(currentAppellation.active);

      const { data, error } = await supabaseAdmin
        .from("appellations")
        .update({ active: nextActive })
        .eq("id", id)
        .select("id, name, region, category, active, created_at")
        .single();

      if (error) {
        return NextResponse.json(
          {
            error: "Erreur lors du changement de statut.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action,
        appellation: data,
      });
    }

    if (action === "rename") {
      const nextName = cleanName(body.name);

      if (!nextName) {
        return NextResponse.json(
          { error: "Le nouveau nom est obligatoire." },
          { status: 400 }
        );
      }

      if (nextName === currentAppellation.name) {
        return NextResponse.json({
          success: true,
          action,
          appellation: currentAppellation,
        });
      }

      const { data: existingTarget, error: targetError } = await supabaseAdmin
        .from("appellations")
        .select("id, name")
        .eq("name", nextName)
        .maybeSingle();

      if (targetError) {
        return NextResponse.json(
          {
            error: "Erreur lors de la vérification du nouveau nom.",
            details: targetError.message,
          },
          { status: 500 }
        );
      }

      if (existingTarget && existingTarget.id !== id) {
        return NextResponse.json(
          {
            error:
              "Cette appellation existe déjà. Utilise la fonction Fusionner.",
          },
          { status: 409 }
        );
      }

      const { error: winesError } = await supabaseAdmin
        .from("wines")
        .update({ appellation: nextName })
        .eq("appellation", currentAppellation.name);

      if (winesError) {
        return NextResponse.json(
          {
            error: "Erreur lors de la mise à jour des vins.",
            details: winesError.message,
          },
          { status: 500 }
        );
      }

      const { data, error } = await supabaseAdmin
        .from("appellations")
        .update({ name: nextName })
        .eq("id", id)
        .select("id, name, region, category, active, created_at")
        .single();

      if (error) {
        await supabaseAdmin
          .from("wines")
          .update({ appellation: currentAppellation.name })
          .eq("appellation", nextName);

        return NextResponse.json(
          {
            error: "Erreur lors du renommage de l’appellation.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action,
        appellation: data,
      });
    }

    if (action === "merge") {
      const targetId = cleanName(body.targetId);

      if (!targetId) {
        return NextResponse.json(
          { error: "L’appellation de destination est obligatoire." },
          { status: 400 }
        );
      }

      if (targetId === id) {
        return NextResponse.json(
          {
            error:
              "L’appellation source et l’appellation de destination doivent être différentes.",
          },
          { status: 400 }
        );
      }

      const { data: targetAppellation, error: targetError } =
        await supabaseAdmin
          .from("appellations")
          .select("id, name, active")
          .eq("id", targetId)
          .maybeSingle();

      if (targetError) {
        return NextResponse.json(
          {
            error: "Erreur lors de la recherche de la destination.",
            details: targetError.message,
          },
          { status: 500 }
        );
      }

      if (!targetAppellation) {
        return NextResponse.json(
          { error: "Appellation de destination introuvable." },
          { status: 404 }
        );
      }

      const { error: winesError } = await supabaseAdmin
        .from("wines")
        .update({ appellation: targetAppellation.name })
        .eq("appellation", currentAppellation.name);

      if (winesError) {
        return NextResponse.json(
          {
            error: "Erreur lors de la fusion des vins.",
            details: winesError.message,
          },
          { status: 500 }
        );
      }

      const { error: targetUpdateError } = await supabaseAdmin
        .from("appellations")
        .update({ active: true })
        .eq("id", targetId);

      if (targetUpdateError) {
        return NextResponse.json(
          {
            error:
              "Les vins ont été déplacés, mais la destination n’a pas pu être réactivée.",
            details: targetUpdateError.message,
          },
          { status: 500 }
        );
      }

      const { error: sourceDeleteError } = await supabaseAdmin
        .from("appellations")
        .delete()
        .eq("id", id);

      if (sourceDeleteError) {
        return NextResponse.json(
          {
            error:
              "Les vins ont été déplacés, mais l’ancienne appellation n’a pas pu être supprimée.",
            details: sourceDeleteError.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action,
        sourceName: currentAppellation.name,
        targetName: targetAppellation.name,
      });
    }

    return NextResponse.json(
      { error: "Action inconnue." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erreur serveur lors de la gestion de l’appellation.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}