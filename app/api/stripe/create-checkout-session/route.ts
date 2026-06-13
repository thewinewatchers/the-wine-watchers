import { NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY manquante.");
}

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

    const params = new URLSearchParams();

    params.append("mode", "payment");
    params.append("payment_method_types[]", "card");

    if (customerEmail) {
      params.append("customer_email", String(customerEmail));
    }

    params.append("line_items[0][quantity]", "1");
    params.append("line_items[0][price_data][currency]", "eur");
    params.append(
      "line_items[0][price_data][unit_amount]",
      String(amount)
    );
    params.append(
      "line_items[0][price_data][product_data][name]",
      "Commande The Wine Watchers"
    );
    params.append(
      "line_items[0][price_data][product_data][description]",
      `${itemCount} article(s) - Commande ${orderId}`
    );

    params.append("metadata[orderId]", String(orderId));

    params.append(
      "success_url",
      `${siteUrl}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`
    );
    params.append(
      "cancel_url",
      `${siteUrl}/paiement/annule?order_id=${orderId}`
    );

    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const stripeResult = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return NextResponse.json(
        {
          error: `Erreur Stripe API : ${
            stripeResult?.error?.message || "Erreur inconnue."
          }`,
        },
        { status: stripeResponse.status }
      );
    }

    return NextResponse.json({ url: stripeResult.url });
  } catch (error) {
    console.error("Erreur Stripe Checkout fetch:", error);

    const message =
      error instanceof Error ? error.message : "Erreur inconnue.";

    return NextResponse.json(
      {
        error: `Erreur Stripe fetch : ${message}`,
      },
      { status: 500 }
    );
  }
}