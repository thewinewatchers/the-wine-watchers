import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY manquante dans .env.local");
}

const stripe = new Stripe(stripeSecretKey);

function parsePrice(value?: string | number) {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;

  const cleaned = value
    .toString()
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { orderId, cart, totalToPay, customerEmail } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Numéro de commande manquant." },
        { status: 400 }
      );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Panier vide." }, { status: 400 });
    }

    const amount = Math.round(parsePrice(totalToPay) * 100);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Montant Stripe invalide." },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
              name: `Commande The Wine Watchers ${orderId}`,
              description:
                "Commande de vins — TVA et livraison incluses selon devis.",
            },
          },
        },
      ],

      metadata: {
        orderId,
      },

      success_url: `${siteUrl}/paiement-confirme?order=${orderId}`,
      cancel_url: `${siteUrl}/checkout?stripe=cancel&order=${orderId}`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Erreur création session Stripe :", error);

    return NextResponse.json(
      { error: "Erreur lors de la création de la session Stripe." },
      { status: 500 }
    );
  }
}