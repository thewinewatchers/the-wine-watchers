import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { orderId, items, customerEmail } = body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Commande ou panier invalide." },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      customer_email: customerEmail || undefined,

      line_items: items.map((item: any) => ({
        quantity: item.quantity || 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(Number(item.price) * 100),
          product_data: {
            name: item.name || "Vin",
            description: item.vintage
              ? `Millésime ${item.vintage}`
              : undefined,
          },
        },
      })),

      metadata: {
        orderId: String(orderId),
      },

      success_url: `${siteUrl}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/paiement/annule?order_id=${orderId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe Checkout:", error);

    return NextResponse.json(
      { error: "Erreur lors de la création du paiement Stripe." },
      { status: 500 }
    );
  }
}