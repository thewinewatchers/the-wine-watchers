import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY manquante.");
}

const stripe = new Stripe(stripeSecretKey);

function toStripeAmount(value: unknown) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  return Math.round(amount * 100);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { orderId, items, totalToPay, customerEmail } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Numéro de commande manquant." },
        { status: 400 }
      );
    }

    const amount = toStripeAmount(totalToPay);

    if (amount <= 0) {
      return NextResponse.json(
        {
          error: `Montant de paiement invalide. totalToPay reçu : ${String(
            totalToPay
          )}`,
        },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const itemCount = Array.isArray(items)
      ? items.reduce((sum, item) => sum + Number(item.quantity || 1), 0)
      : 1;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: {
              name: "Commande The Wine Watchers",
              description: `${itemCount} article(s) - Commande ${orderId}`,
            },
          },
        },
      ],

      metadata: {
        orderId: String(orderId),
      },

      success_url: `${siteUrl}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/paiement/annule?order_id=${orderId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe Checkout diagnostic:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erreur Stripe inconnue.";

    return NextResponse.json(
      {
        error: `Erreur Stripe diagnostic : ${message}`,
      },
      { status: 500 }
    );
  }
}