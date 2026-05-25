import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY manquante dans .env.local");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(request: Request) {
  try {
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "STRIPE_WEBHOOK_SECRET manquant." },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Signature Stripe manquante." },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error("Signature webhook Stripe invalide :", error);

      return NextResponse.json(
        { error: "Signature webhook invalide." },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        const { error } = await supabase
          .from("orders")
          .update({
            status: "paid",
            payment_status: "paid",
            stripe_session_id: session.id,
          })
          .eq("id", orderId);

        if (error) {
          console.error("Erreur mise à jour commande Stripe :", error);
        }
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Erreur webhook Stripe :", error);

    return NextResponse.json(
      { error: "Erreur serveur webhook Stripe." },
      { status: 500 }
    );
  }
}