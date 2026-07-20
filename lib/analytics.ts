import { sendGAEvent } from "@next/third-parties/google";

const CONSENT_KEY = "tww_analytics_consent";
const VIEWED_WINES_KEY = "tww_ga4_viewed_wines";

type WineViewData = {
  id?: string | number;
  slug?: string;
  name?: string;
  producer?: string;
  appellation?: string;
  region?: string;
  country?: string;
  vintage?: string | number;
  classification?: string;
  price?: number;
  bottleSize?: string;
  packaging?: string;
  stock?: number;
  category?: string;
};

function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}

function getWineTrackingId(wine: WineViewData) {
  return String(wine.id || wine.slug || wine.name || "").trim();
}

function wasWineAlreadyTracked(wineId: string) {
  if (!wineId) return false;

  try {
    const stored = sessionStorage.getItem(VIEWED_WINES_KEY);
    const viewedIds = stored ? JSON.parse(stored) : [];
    return Array.isArray(viewedIds) && viewedIds.includes(wineId);
  } catch {
    return false;
  }
}

function markWineAsTracked(wineId: string) {
  if (!wineId) return;

  try {
    const stored = sessionStorage.getItem(VIEWED_WINES_KEY);
    const viewedIds = stored ? JSON.parse(stored) : [];
    const normalizedIds = Array.isArray(viewedIds) ? viewedIds : [];

    if (!normalizedIds.includes(wineId)) {
      sessionStorage.setItem(
        VIEWED_WINES_KEY,
        JSON.stringify([...normalizedIds, wineId])
      );
    }
  } catch {
    // Le suivi ne doit jamais perturber la navigation.
  }
}

export function trackWineView(wine: WineViewData) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;

  const wineId = getWineTrackingId(wine);

  if (!wineId || wasWineAlreadyTracked(wineId)) return;

  sendGAEvent("event", "view_item", {
    currency: "EUR",
    value: wine.price || 0,
    items: [
      {
        item_id: wineId,
        item_name: wine.name || "Vin sans nom",
        item_brand: wine.producer || "",
        item_category: wine.category || wine.country || "",
        item_category2: wine.region || "",
        item_category3: wine.appellation || "",
        item_category4: wine.classification || "",
        item_variant: wine.vintage ? String(wine.vintage) : "",
        price: wine.price || 0,
        quantity: 1,
      },
    ],
    wine_slug: wine.slug || "",
    wine_country: wine.country || "",
    wine_bottle_size: wine.bottleSize || "",
    wine_packaging: wine.packaging || "",
    wine_stock: wine.stock || 0,
  });

  markWineAsTracked(wineId);
}