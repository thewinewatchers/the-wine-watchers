import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import {
  sendOrderEmails,
  type SendOrderEmailsDiagnostic,
} from "@/lib/sendOrderEmails";

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
  category?: string;
};

type PaymentMethod = "card" | "bank_transfer";
type DeliveryMethod = "pickup" | "delivery";

type WineWeightRow = {
  id: string;
  slug: string | null;
  weight_kg: number | string | null;
  category: string | null;
  name: string | null;
  producer: string | null;
  appellation: string | null;
};

type ShippingRate = {
  id: string;
  country_code: string;
  country_name: string | null;
  min_weight_kg: number | string;
  max_weight_kg: number | string;
  price_excl_vat: number | string;
  carrier: string | null;
};

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

function parsePrice(value?: string | number | null) {
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

function roundWeight(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatMoney(value: number) {
  return value.toLocaleString("fr-FR", {
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

  return COUNTRY_NAME_TO_CODE[trimmed] || "OTHER";
}

function isPrimeurText(values: Array<string | null | undefined>) {
  const text = values.filter(Boolean).join(" ").toLowerCase();

  return (
    text.includes("primeur") ||
    text.includes("primeurs") ||
    text.includes("primeurs-2025")
  );
}

function isPrimeurCartItem(item: CartItem) {
  return isPrimeurText([
    item.category,
    item.slug,
    item.name,
    item.producer,
    item.appellation,
  ]);
}

function calculateVat({
  totalExclVat,
  countryCode,
  companyName,
  vatNumber,
}: {
  totalExclVat: number;
  countryCode: string;
  companyName?: string | null;
  vatNumber?: string | null;
}) {
  const vatRate =
    EU_VAT_RATES[countryCode] || EU_VAT_RATES[SELLER_COUNTRY_CODE];

  const isProfessional =
    Boolean(companyName?.trim()) && Boolean(vatNumber?.trim());

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
      totalExclVat: roundMoney(totalExclVat),
      totalInclVat: roundMoney(totalExclVat),
      reverseCharge: true,
      vatNote:
        "TVA intracommunautaire non facturée — autoliquidation par le client professionnel.",
    };
  }

  const vatAmount = roundMoney(totalExclVat * (vatRate / 100));
  const totalInclVat = roundMoney(totalExclVat + vatAmount);

  return {
    customerType: isProfessional ? "professional" : "individual",
    vatCountry: countryCode,
    vatRate,
    vatAmount,
    totalExclVat: roundMoney(totalExclVat),
    totalInclVat,
    reverseCharge: false,
    vatNote: `TVA ${vatRate}% ajoutée au prix HT.`,
  };
}

function getBankTransferInstructions(orderId: string) {
  const accountName = process.env.BANK_ACCOUNT_NAME || "The Wine Watchers SL";
  const bankName = process.env.BANK_NAME || "Banque à confirmer";
  const iban = process.env.BANK_IBAN || "IBAN à confirmer";
  const swift = process.env.BANK_SWIFT || "SWIFT/BIC à confirmer";
  const bankAddress = process.env.BANK_ADDRESS || "";
  const bankCountry = process.env.BANK_COUNTRY || "";

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
    bankAddress ? `Adresse banque : ${bankAddress}` : "",
    bankCountry ? `Pays : ${bankCountry}` : "",
    "",
    "Votre commande sera confirmée après réception du paiement.",
    "The Wine Watchers SL vous contactera si des informations complémentaires sont nécessaires.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function getCartShippingInfo(cart: CartItem[]) {
  const ids = cart
    .map((item) => (item.id ? String(item.id) : null))
    .filter((value): value is string => Boolean(value));

  const slugs = cart
    .map((item) => item.slug || null)
    .filter((value): value is string => Boolean(value));

  const winesById = new Map<string, WineWeightRow>();
  const winesBySlug = new Map<string, WineWeightRow>();

  if (ids.length > 0) {
    const { data, error } = await supabase
      .from("wines")
      .select("id,slug,weight_kg,category,name,producer,appellation")
      .in("id", ids);

    if (error) {
      console.error("Erreur lecture poids vins par id :", error);
      throw new Error("Impossible de calculer le poids du panier.");
    }

    (data as WineWeightRow[] | null)?.forEach((wine) => {
      winesById.set(String(wine.id), wine);

      if (wine.slug) {
        winesBySlug.set(wine.slug, wine);
      }
    });
  }

  if (slugs.length > 0) {
    const { data, error } = await supabase
      .from("wines")
      .select("id,slug,weight_kg,category,name,producer,appellation")
      .in("slug", slugs);

    if (error) {
      console.error("Erreur lecture poids vins par slug :", error);
      throw new Error("Impossible de calculer le poids du panier.");
    }

    (data as WineWeightRow[] | null)?.forEach((wine) => {
      winesById.set(String(wine.id), wine);

      if (wine.slug) {
        winesBySlug.set(wine.slug, wine);
      }
    });
  }

  let shippableWeightKg = 0;
  let shippableItemsCount = 0;
  let primeurItemsCount = 0;

  cart.forEach((item) => {
    const quantity = Number(item.quantity || 1);
    const id = item.id ? String(item.id) : null;
    const slug = item.slug || null;

    const wine =
      (id ? winesById.get(id) : undefined) ??
      (slug ? winesBySlug.get(slug) : undefined) ??
      null;

    const isPrimeur = wine
      ? isPrimeurText([
          wine.category,
          wine.slug,
          wine.name,
          wine.producer,
          wine.appellation,
        ])
      : isPrimeurCartItem(item);

    if (isPrimeur) {
      primeurItemsCount += quantity;
      return;
    }

    const weight = wine ? parsePrice(wine.weight_kg) : 0;

    shippableWeightKg += weight * quantity;
    shippableItemsCount += quantity;
  });

  return {
    shippableWeightKg: roundWeight(shippableWeightKg),
    shippableItemsCount,
    primeurItemsCount,
    primeurOnly: shippableItemsCount === 0 && primeurItemsCount > 0,
    hasPrimeurItems: primeurItemsCount > 0,
  };
}

async function getShippingRate({
  countryCode,
  totalWeightKg,
}: {
  countryCode: string;
  totalWeightKg: number;
}) {
  const { data, error } = await supabase
    .from("shipping_rates")
    .select(
      "id,country_code,country_name,min_weight_kg,max_weight_kg,price_excl_vat,carrier"
    )
    .eq("active", true)
    .eq("country_code", countryCode)
    .lte("min_weight_kg", totalWeightKg)
    .gte("max_weight_kg", totalWeightKg)
    .order("price_excl_vat", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Erreur lecture shipping_rates :", error);
    throw new Error("Impossible de calculer les frais de livraison.");
  }

  return data as ShippingRate | null;
}

export async function POST(request: Request) {
console.log("===== API ORDERS TWW =====");
  let emailDiagnostic: SendOrderEmailsDiagnostic | null = null;

  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour passer commande." },
        { status: 401 }
      );
    }

    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json(
        { error: "Session invalide. Merci de vous reconnecter." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { customer, cart, paymentMethod, deliveryMethod, sessionId } = body;

    const selectedPaymentMethod: PaymentMethod =
      paymentMethod === "card" ? "card" : "bank_transfer";

    const selectedDeliveryMethod: DeliveryMethod =
      deliveryMethod === "delivery" ? "delivery" : "pickup";

    if (!customer) {
      return NextResponse.json(
        { error: "Informations client manquantes." },
        { status: 400 }
      );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Panier vide." }, { status: 400 });
    }

    if (
      !customer.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.phone
    ) {
      return NextResponse.json(
        { error: "Prénom, nom, email et téléphone sont obligatoires." },
        { status: 400 }
      );
    }

    const metadata = userData.user.user_metadata || {};

    const companyName =
      customer.companyName ||
      customer.company_name ||
      metadata.company_name ||
      null;

    const vatNumber =
      customer.vatNumber || customer.vat_number || metadata.vat_number || null;

    const billingCountry = customer.country || "Espagne";
    const billingCountryCode = getCountryCode(billingCountry);

    const cartTotalExclVat = roundMoney(
      cart.reduce((sum: number, item: CartItem) => {
        const price = parsePrice(item.price);
        const quantity = Number(item.quantity || 1);

        return sum + price * quantity;
      }, 0)
    );

    const shippingInfo =
      selectedDeliveryMethod === "delivery"
        ? await getCartShippingInfo(cart)
        : {
            shippableWeightKg: 0,
            shippableItemsCount: 0,
            primeurItemsCount: 0,
            primeurOnly: false,
            hasPrimeurItems: false,
          };

    let shippingRate: ShippingRate | null = null;
    let safeDeliveryFee = 0;
    let deliveryLabel = "Retrait gratuit à l’entrepôt";
    let safeDeliveryNote = "Pas de livraison — retrait gratuit à l’entrepôt.";

    if (selectedDeliveryMethod === "delivery") {
      if (shippingInfo.primeurOnly) {
        deliveryLabel = "Livraison à la libération des vins";

        safeDeliveryNote =
          "Livraison à la libération des vins. Aucun frais de livraison n’est facturé maintenant pour les vins en primeur.";
      } else {
        if (billingCountryCode === "OTHER") {
          return NextResponse.json(
            {
              error:
                "Pour cette destination, merci de nous contacter afin d’établir un devis de transport.",
            },
            { status: 400 }
          );
        }

        if (shippingInfo.shippableWeightKg <= 0) {
          return NextResponse.json(
            {
              error:
                "Impossible de calculer les frais de livraison : poids du panier livrable manquant.",
            },
            { status: 400 }
          );
        }

        shippingRate = await getShippingRate({
          countryCode: billingCountryCode,
          totalWeightKg: shippingInfo.shippableWeightKg,
        });

        if (!shippingRate) {
          return NextResponse.json(
            {
              error:
                "Aucun tarif de livraison actif ne correspond au pays et au poids du panier livrable.",
            },
            { status: 400 }
          );
        }

        safeDeliveryFee = roundMoney(parsePrice(shippingRate.price_excl_vat));

        deliveryLabel = `Livraison ${
          shippingRate.country_name || billingCountry
        } — assurance transport comprise`;

        safeDeliveryNote = [
          `Poids livrable maintenant : ${shippingInfo.shippableWeightKg} kg.`,
          `Tranche tarifaire : ${parsePrice(
            shippingRate.min_weight_kg
          )} kg à ${parsePrice(shippingRate.max_weight_kg)} kg.`,
          `Frais de livraison HT : ${formatMoney(safeDeliveryFee)}.`,
          "Assurance transport comprise.",
          shippingInfo.hasPrimeurItems
            ? "Les vins en primeur seront livrés à leur libération."
            : "",
        ]
          .filter(Boolean)
          .join("\n");
      }
    }

    const taxableTotalExclVat = roundMoney(cartTotalExclVat + safeDeliveryFee);

    const vatCalculation = calculateVat({
      totalExclVat: taxableTotalExclVat,
      countryCode: billingCountryCode,
      companyName,
      vatNumber,
    });

    const orderId = crypto.randomUUID();
    const finalTotalToPay = roundMoney(vatCalculation.totalInclVat);

    const bankTransferInstructions =
      selectedPaymentMethod === "bank_transfer"
        ? getBankTransferInstructions(orderId)
        : null;

    const orderStatus =
      selectedPaymentMethod === "card" ? "pending" : "bank_transfer_pending";

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

      shipping_weight_kg: shippingInfo.shippableWeightKg,
      shipping_country_code: billingCountryCode,
      shipping_rate_id: shippingRate?.id || null,
      shipping_price_excl_vat: safeDeliveryFee,
      shipping_carrier: shippingRate?.carrier || null,
      shipping_note: safeDeliveryNote,

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
        total_price: roundMoney(unitPrice * quantity),
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

    if (sessionId) {
      const { error: stockFinalizeError } = await supabase.rpc(
        "finalize_reserved_stock",
        { p_session_id: sessionId }
      );

      if (stockFinalizeError) {
        console.error("Erreur finalisation stock :", stockFinalizeError);

        return NextResponse.json(
          {
            error:
              "Commande créée, mais erreur lors de la mise à jour du stock.",
            details: stockFinalizeError.message,
          },
          { status: 500 }
        );
      }
    }

    await supabase
      .from("abandoned_carts")
      .delete()
      .eq("user_id", userData.user.id)
      .eq("status", "open");

    emailDiagnostic = await sendOrderEmails({
      orderId,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerAddress: customer.address || null,
      customerPostalCode: customer.postalCode || null,
      customerCity: customer.city || null,
      customerCountry: customer.country || null,
      customerComment: customer.comment || null,
      companyName,
      vatNumber,
      items: orderItems,
      totalExclVat: vatCalculation.totalExclVat,
      vatAmount: vatCalculation.vatAmount,
      finalTotalToPay,
      vatNote: vatCalculation.vatNote,
      deliveryLabel,
      safeDeliveryNote,
      selectedDeliveryMethod,
      selectedPaymentMethod,
      bankTransferInstructions,
    });
console.log(
  "DIAGNOSTIC EMAIL COMMANDE :",
  JSON.stringify(emailDiagnostic, null, 2)
);
    return NextResponse.json({
      success: true,
      orderId,

      deliveryMethod: selectedDeliveryMethod,
      deliveryLabel,
      deliveryFee: safeDeliveryFee,
      deliveryNote: safeDeliveryNote,

      shippingWeightKg: shippingInfo.shippableWeightKg,
      shippingCountryCode: billingCountryCode,
      shippingRateId: shippingRate?.id || null,
      shippingCarrier: shippingRate?.carrier || null,
      shippableItemsCount: shippingInfo.shippableItemsCount,
      primeurItemsCount: shippingInfo.primeurItemsCount,
      primeurOnly: shippingInfo.primeurOnly,
      hasPrimeurItems: shippingInfo.hasPrimeurItems,

      totalAmount: finalTotalToPay,
      totalExclVat: vatCalculation.totalExclVat,
      totalInclVat: finalTotalToPay,
      vatAmount: vatCalculation.vatAmount,
      vatRate: vatCalculation.vatRate,
      reverseCharge: vatCalculation.reverseCharge,
      vatNote: vatCalculation.vatNote,

      paymentMethod: selectedPaymentMethod,
      bankTransferInstructions,

      emailDiagnostic,
    });
  } catch (error) {
    console.error("Erreur API orders :", error);

    return NextResponse.json(
      {
        error: "Erreur serveur lors de la création de la commande.",
        emailDiagnostic,
      },
      { status: 500 }
    );
  }
}