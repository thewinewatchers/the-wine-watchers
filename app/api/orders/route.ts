import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { Resend } from "resend";

type CartItem = {
  id?: string | number;
  slug?: string;
  name?: string;
  producer?: string;
  appellation?: string;
  vintage?: string | number;
  price?: number | string;
  quantity?: number;
  image?: string;
  bottle_size?: string;
  packaging?: string;
};

type PaymentMethod = "card" | "bank_transfer";
type DeliveryMethod = "pickup" | "delivery";

const resend = new Resend(process.env.RESEND_API_KEY);

const SELLER_COUNTRY_CODE = "ES";

const EU_VAT_RATES: Record<string, number> = {
  AT: 20,
  BE: 21,
  BG: 20,
  CY: 19,
  CZ: 21,
  DE: 19,
  DK: 25,
  EE: 24,
  EL: 24,
  ES: 21,
  FI: 25.5,
  FR: 20,
  HR: 25,
  HU: 27,
  IE: 23,
  IT: 22,
  LT: 21,
  LU: 17,
  LV: 21,
  MT: 18,
  NL: 21,
  PL: 23,
  PT: 23,
  RO: 19,
  SE: 25,
  SI: 22,
  SK: 23,
  CH: 8.1,
};

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  France: "FR",
  Belgique: "BE",
  Luxembourg: "LU",
  Suisse: "CH",
  Espagne: "ES",
  Italie: "IT",
  Allemagne: "DE",
  Autre: "OTHER",
};

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

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatPrice(value: number) {
  return Number(value || 0).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function getCountryCode(country?: string) {
  if (!country) return SELLER_COUNTRY_CODE;

  const trimmed = country.trim();

  if (trimmed.length === 2) {
    return trimmed.toUpperCase();
  }

  return COUNTRY_NAME_TO_CODE[trimmed] || SELLER_COUNTRY_CODE;
}

function calculateVat({
  cartTotalExclVat,
  countryCode,
  companyName,
  vatNumber,
}: {
  cartTotalExclVat: number;
  countryCode: string;
  companyName?: string | null;
  vatNumber?: string | null;
}) {
  const vatRate =
    EU_VAT_RATES[countryCode] || EU_VAT_RATES[SELLER_COUNTRY_CODE];

  const isProfessional =
    Boolean(companyName?.trim()) &&
    Boolean(vatNumber?.trim());

  const reverseCharge =
    isProfessional &&
    countryCode !== SELLER_COUNTRY_CODE &&
    Object.prototype.hasOwnProperty.call(EU_VAT_RATES, countryCode);

  if (reverseCharge) {
    return {
      customerType: "professional",
      vatCountry: countryCode,
      vatRate: 0,
      vatAmount: 0,
      totalExclVat: roundMoney(cartTotalExclVat),
      totalInclVat: roundMoney(cartTotalExclVat),
      reverseCharge: true,
      vatNote:
        "TVA intracommunautaire non facturée — autoliquidation par le client professionnel.",
    };
  }

  const vatAmount = roundMoney(
    cartTotalExclVat * (vatRate / 100)
  );

  const totalInclVat = roundMoney(
    cartTotalExclVat + vatAmount
  );

  return {
    customerType: isProfessional
      ? "professional"
      : "individual",

    vatCountry: countryCode,
    vatRate,
    vatAmount,

    totalExclVat: roundMoney(cartTotalExclVat),
    totalInclVat,

    reverseCharge: false,
    vatNote: `TVA ${vatRate}% ajoutée au prix HT.`,
  };
}

function getBankTransferInstructions(orderId: string) {
  const accountName =
    process.env.BANK_ACCOUNT_NAME ||
    "The Wine Watchers SL";

  const bankName =
    process.env.BANK_NAME ||
    "Banque à confirmer";

  const iban =
    process.env.BANK_IBAN ||
    "IBAN à confirmer";

  const swift =
    process.env.BANK_SWIFT ||
    "SWIFT/BIC à confirmer";

  const bankAddress =
    process.env.BANK_ADDRESS || "";

  const bankCountry =
    process.env.BANK_COUNTRY || "";

  return [
    "Merci d’effectuer votre virement bancaire en indiquant impérativement le numéro de commande en communication.",
    "",
    `Référence à indiquer : ${orderId}`,
    "",
    "Coordonnées bancaires :",
    `Titulaire du compte : ${accountName}`,
    `Banque : ${bankName}`,
    `IBAN : ${iban}`,
    `SWIFT/BIC : ${swift}`,
    bankAddress
      ? `Adresse banque : ${bankAddress}`
      : "",
    bankCountry
      ? `Pays : ${bankCountry}`
      : "",
    "",
    "Votre commande sera confirmée après réception du paiement.",
    "The Wine Watchers SL vous contactera si des informations complémentaires sont nécessaires.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  try {
    const authHeader =
      request.headers.get("authorization");

    const token =
      authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Vous devez être connecté pour passer commande.",
        },
        { status: 401 }
      );
    }

    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json(
        {
          error:
            "Session invalide. Merci de vous reconnecter.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      customer,
      cart,
      paymentMethod,
      deliveryMethod,
      deliveryFee,
      deliveryNote,
      totalToPay,
    } = body;

    const selectedPaymentMethod: PaymentMethod =
      paymentMethod === "card"
        ? "card"
        : "bank_transfer";

    const selectedDeliveryMethod: DeliveryMethod =
      deliveryMethod === "delivery"
        ? "delivery"
        : "pickup";

    if (!customer) {
      return NextResponse.json(
        {
          error:
            "Informations client manquantes.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Panier vide." },
        { status: 400 }
      );
    }

    if (
      !customer.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.phone
    ) {
      return NextResponse.json(
        {
          error:
            "Prénom, nom, email et téléphone sont obligatoires.",
        },
        { status: 400 }
      );
    }

    const metadata =
      userData.user.user_metadata || {};

    const companyName =
      customer.companyName ||
      customer.company_name ||
      metadata.company_name ||
      null;

    const vatNumber =
      customer.vatNumber ||
      customer.vat_number ||
      metadata.vat_number ||
      null;

    const billingCountry =
      customer.country || "Espagne";

    const billingCountryCode =
      getCountryCode(billingCountry);

    const cartTotalExclVat = cart.reduce(
      (sum: number, item: CartItem) => {
        const price = parsePrice(item.price);

        const quantity = Number(
          item.quantity || 1
        );

        return sum + price * quantity;
      },
      0
    );

    const vatCalculation = calculateVat({
      cartTotalExclVat,
      countryCode: billingCountryCode,
      companyName,
      vatNumber,
    });

    const orderId = crypto.randomUUID();
    const safeDeliveryFee =
      selectedDeliveryMethod === "pickup"
        ? 0
        : Number(deliveryFee || 0);

    const safeDeliveryNote =
      selectedDeliveryMethod === "pickup"
        ? "Pas de livraison — retrait gratuit à l’entrepôt."
        : deliveryNote ||
          "Les frais de livraison seront confirmés selon la destination, le poids et les conditions de transport.";

    const deliveryLabel =
      selectedDeliveryMethod === "pickup"
        ? "Retrait gratuit à l’entrepôt"
        : "Livraison à confirmer";

    const finalTotalToPay =
      Number(totalToPay || 0) > 0
        ? roundMoney(Number(totalToPay))
        : roundMoney(vatCalculation.totalInclVat + safeDeliveryFee);

    const bankTransferInstructions =
      selectedPaymentMethod === "bank_transfer"
        ? getBankTransferInstructions(orderId)
        : null;

    const orderStatus =
      selectedPaymentMethod === "card"
        ? "pending"
        : "bank_transfer_pending";

    const enrichedCustomerComment = [
      customer.comment || "",
      "",
      "Mode retrait / livraison :",
      deliveryLabel,
      safeDeliveryNote,
    ]
      .filter(Boolean)
      .join("\n");

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      user_id: userData.user.id,

      customer_type: vatCalculation.customerType,
      customer_company_name: companyName,
      customer_vat_number: vatNumber,
      billing_country_code: billingCountryCode,

      customer_first_name: customer.firstName,
      customer_last_name: customer.lastName,
      customer_email: customer.email,
      customer_phone: customer.phone,

      customer_address: customer.address || null,
      customer_postal_code: customer.postalCode || null,
      customer_city: customer.city || null,
      customer_country: customer.country || null,
      customer_comment: enrichedCustomerComment || null,

      total_amount: finalTotalToPay,
      total_excl_vat: vatCalculation.totalExclVat,
      total_incl_vat: finalTotalToPay,
      vat_rate: vatCalculation.vatRate,
      vat_amount: vatCalculation.vatAmount,
      vat_country: vatCalculation.vatCountry,
      reverse_charge: vatCalculation.reverseCharge,
      vat_note: vatCalculation.vatNote,
      currency: "EUR",

      status: orderStatus,
      payment_status: "unpaid",
      payment_method: selectedPaymentMethod,

      bank_transfer_reference:
        selectedPaymentMethod === "bank_transfer" ? orderId : null,

      bank_transfer_instructions: bankTransferInstructions,
    });

    if (orderError) {
      console.error("Erreur création commande Supabase :", orderError);

      return NextResponse.json(
        {
          error: "Erreur lors de la création de la commande.",
          details: orderError.message,
        },
        { status: 500 }
      );
    }

    const orderItems = cart.map((item: CartItem) => {
      const unitPrice = parsePrice(item.price);
      const quantity = Number(item.quantity || 1);

      return {
        order_id: orderId,

        wine_id: item.id ? String(item.id) : null,
        wine_slug: item.slug || null,
        wine_name: item.name || "Vin sélectionné",
        producer: item.producer || null,
        appellation: item.appellation || null,
        vintage: item.vintage ? String(item.vintage) : null,
        bottle_size: item.bottle_size || null,
        packaging: item.packaging || null,
        image: item.image || null,

        quantity,
        unit_price: unitPrice,
        total_price: unitPrice * quantity,
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Erreur création lignes commande Supabase :", itemsError);

      return NextResponse.json(
        {
          error: "Commande créée, mais erreur sur les lignes de commande.",
          details: itemsError.message,
        },
        { status: 500 }
      );
    }

    await supabase
      .from("abandoned_carts")
      .delete()
      .eq("user_id", userData.user.id)
      .eq("status", "open");

    const formattedItems = orderItems
      .map((item) => {
        return `- ${item.wine_name}
  Quantité : ${item.quantity}
  Prix unitaire HT : ${formatPrice(item.unit_price)}
  Total ligne HT : ${formatPrice(item.total_price)}`;
      })
      .join("\n\n");

    try {
      await resend.emails.send({
        from:
          process.env.EMAIL_FROM ||
          "The Wine Watchers <onboarding@resend.dev>",
        to: customer.email,
        subject: `Confirmation de commande - ${orderId}`,
        text: `Bonjour ${customer.firstName},

Nous vous remercions pour votre commande chez The Wine Watchers.

Numéro de commande :
${orderId}

Client :
${customer.firstName} ${customer.lastName}
${companyName ? `Société : ${companyName}` : ""}
${vatNumber ? `N° TVA : ${vatNumber}` : ""}

Vins commandés :

${formattedItems}

Total HT vins :
${formatPrice(vatCalculation.totalExclVat)}

TVA :
${formatPrice(vatCalculation.vatAmount)}

Retrait / livraison :
${deliveryLabel}

${safeDeliveryNote}

Frais livraison :
${
  selectedDeliveryMethod === "pickup"
    ? "Gratuit"
    : "À confirmer"
}

Total TTC / Total à payer :
${formatPrice(finalTotalToPay)}

Régime TVA :
${vatCalculation.vatNote}

Mode de paiement :
${
  selectedPaymentMethod === "bank_transfer"
    ? "Virement bancaire"
    : "Carte bancaire"
}

${
  bankTransferInstructions
    ? `Instructions de virement :

${bankTransferInstructions}`
    : ""
}

Notre équipe reste à votre disposition pour toute question.

The Wine Watchers SL`,
      });

      await resend.emails.send({
        from:
          process.env.EMAIL_FROM ||
          "The Wine Watchers <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL || "millesimesunited@gmail.com",
        subject: `Nouvelle commande reçue - ${orderId}`,
        text: `Nouvelle commande reçue sur The Wine Watchers.

Numéro de commande :
${orderId}

Client :
${customer.firstName} ${customer.lastName}

Société :
${companyName || "-"}

N° TVA :
${vatNumber || "-"}

Email :
${customer.email}

Téléphone :
${customer.phone}

Adresse :
${customer.address || ""}
${customer.postalCode || ""} ${customer.city || ""}
${customer.country || ""}

Commentaire :
${customer.comment || "Aucun commentaire"}

Retrait / livraison :
${deliveryLabel}

${safeDeliveryNote}

Frais livraison :
${
  selectedDeliveryMethod === "pickup"
    ? "Gratuit"
    : "À confirmer"
}

Total HT vins :
${formatPrice(vatCalculation.totalExclVat)}

TVA :
${formatPrice(vatCalculation.vatAmount)}

Total TTC / Total à payer :
${formatPrice(finalTotalToPay)}

Régime TVA :
${vatCalculation.vatNote}

Mode de paiement :
${
  selectedPaymentMethod === "bank_transfer"
    ? "Virement bancaire"
    : "Carte bancaire"
}

Vins commandés :

${formattedItems}`,
      });
    } catch (emailError) {
      console.error("Erreur envoi emails Resend :", emailError);
    }

    return NextResponse.json({
      success: true,
      orderId,

      deliveryMethod: selectedDeliveryMethod,
      deliveryLabel,
      deliveryFee: safeDeliveryFee,
      deliveryNote: safeDeliveryNote,

      totalAmount: finalTotalToPay,
      totalExclVat: vatCalculation.totalExclVat,
      totalInclVat: finalTotalToPay,
      vatAmount: vatCalculation.vatAmount,
      vatRate: vatCalculation.vatRate,
      reverseCharge: vatCalculation.reverseCharge,
      vatNote: vatCalculation.vatNote,

      paymentMethod: selectedPaymentMethod,
      bankTransferInstructions,
    });
  } catch (error) {
    console.error("Erreur API orders :", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de la création de la commande." },
      { status: 500 }
    );
  }
}