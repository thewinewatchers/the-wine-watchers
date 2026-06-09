import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const RESERVATION_MINUTES = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const wineId = body.wineId;
    const sessionId = body.sessionId;
    const quantity = Number(body.quantity);

    if (!wineId || !sessionId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Données de réservation invalides." },
        { status: 400 }
      );
    }

    await supabase
      .from("stock_reservations")
      .delete()
      .lte("expires_at", new Date().toISOString());

    await supabase
      .from("stock_reservations")
      .delete()
      .eq("wine_id", wineId)
      .eq("session_id", sessionId);

    const { data: availableStock, error: stockError } = await supabase.rpc(
      "get_available_stock",
      { p_wine_id: wineId }
    );

    if (stockError) {
      return NextResponse.json(
        { error: "Impossible de vérifier le stock disponible." },
        { status: 500 }
      );
    }

    if (availableStock === null || availableStock < quantity) {
      return NextResponse.json(
        {
          error: "Stock insuffisant.",
          availableStock: availableStock ?? 0,
        },
        { status: 409 }
      );
    }

    const expiresAt = new Date(
      Date.now() + RESERVATION_MINUTES * 60 * 1000
    ).toISOString();

    const { error: insertError } = await supabase
      .from("stock_reservations")
      .insert({
        wine_id: wineId,
        session_id: sessionId,
        quantity,
        expires_at: expiresAt,
      });

    if (insertError) {
  console.error("Erreur insertion stock_reservations :", insertError);

  return NextResponse.json(
    {
      error: "Impossible de réserver le stock.",
      details: insertError.message,
    },
    { status: 500 }
  );
}

    const { data: newAvailableStock } = await supabase.rpc(
      "get_available_stock",
      { p_wine_id: wineId }
    );

    return NextResponse.json({
      success: true,
      reservedQuantity: quantity,
      expiresAt,
      availableStock: newAvailableStock ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur lors de la réservation." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const wineId = body.wineId;
    const sessionId = body.sessionId;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session manquante." },
        { status: 400 }
      );
    }

    let query = supabase
      .from("stock_reservations")
      .delete()
      .eq("session_id", sessionId);

    if (wineId) {
      query = query.eq("wine_id", wineId);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Impossible de libérer la réservation." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur lors de la libération du stock." },
      { status: 500 }
    );
  }
}