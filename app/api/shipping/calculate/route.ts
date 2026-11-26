import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type CartItem = {
  id?: string | number;
  slug?: string;
  name?: string;
  producer?: string;
  appellation?: string;
  category?: string;
  quantity?: number;
};

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

function parseNumber(value?: string | number | null) {
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

function getCountryCode(country?: string) {
  if (!country) return "ES";

  const trimmed = country.trim();

  if (trimmed.length === 2) {
    return trimmed.toUpperCase();
  }

  return COUNTRY_NAME_TO_CODE[trimmed] || "OTHER";
}

class CartShippingError extends Error {}

async function getCartWeightKg(cart: CartItem[]) {
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

  let totalWeightKg = 0;
  let shippableItemsCount = 0;
  let primeurItemsCount = 0;
  let primeur2025ItemsCount = 0;

  cart.forEach((item) => {
    const quantity = Number(item.quantity ?? 1);
    const id = item.id ? String(item.id) : null;
    const slug = item.slug || null;

    const wine =
      (id ? winesById.get(id) : undefined) ??
      (slug ? winesBySlug.get(slug) : undefined) ??
      null;

    if (!wine || (id && String(wine.id) !== id) || !Number.isSafeInteger(quantity) || quantity <= 0) {
      throw new CartShippingError("Vin introuvable ou quantité invalide dans le panier.");
    }

    const category = (wine.category || "").trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");
    if (!category) throw new CartShippingError("Catégorie du vin manquante.");
    if (/^primeurs?(?: |$)/.test(category)) {
      primeurItemsCount += quantity;
      if (/^primeurs? 2025$/.test(category)) primeur2025ItemsCount += quantity;
      return;
    }

    const weight = Number(wine.weight_kg);
    if (!Number.isFinite(weight) || weight <= 0) {
      throw new CartShippingError("Poids manquant ou invalide pour un vin du panier.");
    }

    totalWeightKg += weight * quantity;
    shippableItemsCount += quantity;
  });

  return {
    totalWeightKg: roundWeight(totalWeightKg),
    shippableItemsCount,
    primeurItemsCount,
    primeur2025ItemsCount,
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
  try {
    const body = await request.json();
    const cart = body?.cart;
    const country = body?.country || "Espagne";
    const countryCode = getCountryCode(country);

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Panier vide." }, { status: 400 });
    }

    const { totalWeightKg, shippableItemsCount, primeurItemsCount, primeur2025ItemsCount } =
      await getCartWeightKg(cart);
    const primeurOnly = shippableItemsCount === 0 && primeurItemsCount > 0;
    const hasPrimeurItems = primeurItemsCount > 0;
    const primeurMessage = [
      primeur2025ItemsCount > 0
        ? "Primeurs 2025 : livraison estimée au premier semestre 2027. Les frais de livraison seront facturés au moment de la livraison. Assurance transport comprise."
        : "",
      primeurItemsCount > primeur2025ItemsCount
        ? "Les autres vins en primeur seront livrés à leur libération. Aucun frais de livraison n’est facturé maintenant pour ces vins."
        : "",
    ].filter(Boolean).join(" ");

    const base = {
      success: true,
      primeurOnly,
      hasPrimeurItems,
      shippableItemsCount,
      primeurItemsCount,
      primeur2025ItemsCount,
      countryCode,
      countryName: country,
      totalWeightKg,
      shippingPriceExclVat: 0,
      carrier: null,
      rateId: null,
      minWeightKg: null,
      maxWeightKg: null,
    };

    if (primeurOnly) {
      return NextResponse.json({
        ...base, available: true, requiresQuote: false,
        message: primeurMessage,
      });
    }

    if (countryCode === "OTHER") {
      return NextResponse.json({
        ...base, available: false, requiresQuote: true,
        countryName: "Autres pays",
        message: "Pour cette destination, merci de nous contacter afin d’établir un devis de transport.",
      });
    }

    if (totalWeightKg <= 0) {
      return NextResponse.json({ error: "Impossible de calculer les frais de livraison : poids du panier livrable manquant." }, { status: 400 });
    }

    const shippingRate = await getShippingRate({ countryCode, totalWeightKg });
    if (!shippingRate) {
      return NextResponse.json({
        ...base, available: false, requiresQuote: true,
        message: "Aucun tarif automatique ne correspond à cette destination ou à ce poids. Merci de nous contacter pour un devis de transport.",
      });
    }

    const shippingPriceExclVat = roundMoney(parseNumber(shippingRate.price_excl_vat));
    return NextResponse.json({
      ...base,
      available: true,
      requiresQuote: false,
      countryName: shippingRate.country_name || country,
      shippingPriceExclVat,
      carrier: shippingRate.carrier || null,
      rateId: shippingRate.id,
      minWeightKg: parseNumber(shippingRate.min_weight_kg),
      maxWeightKg: parseNumber(shippingRate.max_weight_kg),
      message: `Frais de livraison HT calculés automatiquement : ${shippingPriceExclVat.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}. Assurance transport comprise.${hasPrimeurItems ? " Ces frais concernent uniquement les vins livrables maintenant. " + primeurMessage : ""}`,
    });
  } catch (error) {
    if (error instanceof CartShippingError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Erreur API shipping/calculate :", error);
    return NextResponse.json({ error: "Erreur serveur lors du calcul de la livraison." }, { status: 500 });
  }
}
