"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { trackWineView } from "@/lib/analytics";

type Wine = {
  id?: string | number;
  slug?: string;
  name?: string;
  region?: string;
  vintage?: string | number;
  price?: string | number;
  compare_at_price?: string | number;
  stock?: string | number;
  bottle_size?: string;
  packaging?: string;
  image?: string;
  additional_images?: string[] | string;
  category?: string;
  rating?: string | number;
  seo_title?: string;
  seo_description?: string;
  keywords?: string[] | string;
  producer?: string;
  appellation?: string;
  country?: string;
  color?: string;
  grape_varieties?: string[] | string;
  classification?: string;
  soil?: string;
  style?: string;
  description?: string;
  story?: string;
  tasting_notes?: string[] | string;
  nose?: string;
  palate?: string;
  pairing?: string;
  serving_temperature?: string;
  aging_potential?: string;
  meta_content?: string;
  hidden_from_site?: boolean;
};

type CartItem = {
  id?: string | number;
  slug?: string;
  name?: string;
  producer?: string;
  appellation?: string;
  vintage?: string | number;
  price?: number | string;
  quantity: number;
  image?: string;
  bottle_size?: string;
  packaging?: string;
  reservation_expires_at?: string;
};

const CART_KEY = "cart";
const SESSION_KEY = "wine_watchers_session_id";

function getSessionId() {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

function normalizeArray(value?: string[] | string): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePrice(price?: string | number) {
  if (price === undefined || price === null || price === "") return 0;

  if (typeof price === "number") {
    return Number.isNaN(price) ? 0 : price;
  }

  const raw = String(price).trim().replace(/[€\s]/g, "");
  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parseStock(stock?: string | number) {
  if (stock === undefined || stock === null || stock === "") return 0;
  const parsed = Number(stock);
  return Number.isNaN(parsed) ? 0 : parsed;
}

type PackagingInfo = {
  display: string;
  stockSingular: string;
  stockPlural: string;
};

function getPackagingInfo(packaging?: string): PackagingInfo {
  const raw = String(packaging || "").trim();

  if (!raw) {
    return {
      display: "Non renseigné",
      stockSingular: "unité",
      stockPlural: "unités",
    };
  }

  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const cboMatch = normalized.match(/\bcbo\s*\/?\s*(1|3|6|12)\b/);

  if (cboMatch) {
    const bottleCount = Number(cboMatch[1]);

    return {
      display: `CBO/${bottleCount} – caisse bois d’origine de ${bottleCount} bouteille${
        bottleCount > 1 ? "s" : ""
      }`,
      stockSingular: "caisse",
      stockPlural: "caisses",
    };
  }

  const bottleMatch = normalized.match(/\b(1|3|6|12)\s*bouteille(?:s)?\b/);

  if (bottleMatch) {
    const bottleCount = Number(bottleMatch[1]);

    if (bottleCount === 1) {
      return {
        display: "1 bouteille",
        stockSingular: "bouteille",
        stockPlural: "bouteilles",
      };
    }

    return {
      display: `${bottleCount} bouteilles`,
      stockSingular: `lot de ${bottleCount} bouteilles`,
      stockPlural: `lots de ${bottleCount} bouteilles`,
    };
  }

  if (
    normalized === "bouteille" ||
    normalized === "bt" ||
    normalized === "bt/1"
  ) {
    return {
      display: "1 bouteille",
      stockSingular: "bouteille",
      stockPlural: "bouteilles",
    };
  }

  return {
    display: raw,
    stockSingular: "unité",
    stockPlural: "unités",
  };
}

function formatAvailableStock(stock: number, packaging?: string) {
  const info = getPackagingInfo(packaging);
  const unit = stock === 1 ? info.stockSingular : info.stockPlural;

  return `${stock} ${unit} disponible${stock > 1 ? "s" : ""}`;
}

function formatRemainingStock(stock: number, packaging?: string) {
  const info = getPackagingInfo(packaging);
  const unit = stock === 1 ? info.stockSingular : info.stockPlural;

  return `${stock} ${unit}`;
}

function formatPrice(price?: string | number) {
  const parsedPrice = parsePrice(price);

  if (parsedPrice <= 0) return "Prix sur demande";

  return (
    parsedPrice.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € HT"
  );
}

function getDiscountInfo(
  priceValue?: string | number,
  compareAtPriceValue?: string | number
) {
  const price = parsePrice(priceValue);
  const compareAtPrice = parsePrice(compareAtPriceValue);

  if (price <= 0 || compareAtPrice <= price) return null;

  const saving = compareAtPrice - price;
  const percent = Math.round((saving / compareAtPrice) * 100);

  return { saving, percent };
}

function categoryToSlug(category?: string) {
  if (!category) return "";

  const normalized = category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae");

  if (normalized.includes("italie")) return "italie";
  if (normalized.includes("bourgogne")) return "bourgogne";
  if (normalized.includes("bordeaux")) return "bordeaux";
  if (normalized.includes("rhone")) return "rhone";
  if (normalized.includes("espagne")) return "espagne";
  if (normalized.includes("usa")) return "usa";
  if (normalized.includes("primeur")) return "primeurs-2025";

  return normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSlugSource(value?: string | null) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getMainCategorySlug(wine?: Wine | null) {
  if (!wine) return "";

  const values = [
    wine.category,
    wine.country,
    wine.region,
    wine.appellation,
    wine.producer,
    wine.name,
  ]
    .map((value) => normalizeSlugSource(value))
    .filter(Boolean);

  const joined = values.join(" ");

  if (
    joined.includes("bordeaux") ||
    joined.includes("pauillac") ||
    joined.includes("margaux") ||
    joined.includes("saint julien") ||
    joined.includes("saint estephe") ||
    joined.includes("saint emilion") ||
    joined.includes("pomerol") ||
    joined.includes("pessac leognan") ||
    joined.includes("sauternes")
  ) {
    return "bordeaux";
  }

  if (
    joined.includes("bourgogne") ||
    joined.includes("burgundy") ||
    joined.includes("cote de nuits") ||
    joined.includes("cote de beaune") ||
    joined.includes("chablis") ||
    joined.includes("meursault") ||
    joined.includes("puligny montrachet") ||
    joined.includes("gevrey chambertin") ||
    joined.includes("vosne romanee") ||
    joined.includes("chambolle musigny") ||
    joined.includes("romanee conti") ||
    joined.includes("drc")
  ) {
    return "bourgogne";
  }

  if (
    joined.includes("italie") ||
    joined.includes("italy") ||
    joined.includes("toscane") ||
    joined.includes("toscana") ||
    joined.includes("piemont") ||
    joined.includes("piedmont") ||
    joined.includes("barolo") ||
    joined.includes("barbaresco") ||
    joined.includes("brunello") ||
    joined.includes("bolgheri") ||
    joined.includes("sassicaia") ||
    joined.includes("ornellaia") ||
    joined.includes("masseto")
  ) {
    return "italie";
  }

  if (
    joined.includes("espagne") ||
    joined.includes("spain") ||
    joined.includes("ribera del duero") ||
    joined.includes("rioja") ||
    joined.includes("priorat") ||
    joined.includes("toro") ||
    joined.includes("rias baixas") ||
    joined.includes("vega sicilia") ||
    joined.includes("pingus")
  ) {
    return "espagne";
  }

  if (
    joined.includes("usa") ||
    joined.includes("united states") ||
    joined.includes("etats unis") ||
    joined.includes("californie") ||
    joined.includes("california") ||
    joined.includes("napa") ||
    joined.includes("sonoma") ||
    joined.includes("oakville") ||
    joined.includes("rutherford") ||
    joined.includes("stags leap") ||
    joined.includes("opus one") ||
    joined.includes("screaming eagle")
  ) {
    return "usa";
  }

  if (joined.includes("rhone")) return "rhone";
  if (joined.includes("primeur")) return "primeurs-2025";

  return categoryToSlug(wine.category || wine.region || wine.country);
}
const DEDICATED_APPELLATION_SLUGS = new Set([
  "pauillac", "margaux", "saint-julien", "saint-estephe",
  "pomerol", "saint-emilion", "pessac-leognan", "sauternes",
  "cote-de-nuits", "cote-de-beaune", "chablis", "meursault",
  "puligny-montrachet", "gevrey-chambertin", "vosne-romanee",
  "chambolle-musigny", "cote-rotie", "hermitage", "cornas",
  "saint-joseph", "chateauneuf-du-pape", "gigondas",
  "toscane", "piemont", "barolo", "barbaresco",
  "brunello-di-montalcino", "bolgheri", "super-toscans",
  "ribera-del-duero", "rioja", "priorat", "toro", "rias-baixas",
  "napa-valley", "sonoma", "oakville", "rutherford",
  "stags-leap-district", "montagne-de-reims", "vallee-de-la-marne",
  "cote-des-blancs", "cote-des-bar", "champagne",
]);

function getAppellationHref(wine?: Wine | null) {
  if (!wine?.appellation) return "";

  const appellationSlug = appellationToSlug(wine.appellation);

  if (DEDICATED_APPELLATION_SLUGS.has(appellationSlug)) {
    return `/appellation/${appellationSlug}`;
  }

  const mainCategorySlug = getMainCategorySlug(wine);
  if (!mainCategorySlug) return "";

  return `/boutique/${mainCategorySlug}?appellation=${encodeURIComponent(
    wine.appellation
  )}`;
}

function getCategoryLabel(wine?: Wine | null) {
  if (!wine) return "Grand vin";

  const mainCategorySlug = getMainCategorySlug(wine);
  const currentCategorySlug = categoryToSlug(wine.category);

  if (!wine.category || currentCategorySlug === "autres") {
    const labels: Record<string, string> = {
      usa: "USA",
      italie: "Grands vins d’Italie",
      espagne: "Espagne",
      bourgogne: "Bourgogne",
      bordeaux: "Bordeaux",
    };

    if (labels[mainCategorySlug]) return labels[mainCategorySlug];
  }

  return wine.category || wine.country || wine.region || "Grand vin";
}

function producerToSlug(producer?: string) {
  if (!producer) return "";

  return producer
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function appellationToSlug(appellation?: string) {
  return producerToSlug(appellation);
}

function getWineUrl(wine: Wine) {
  return `/boutique/vin/${wine.slug || wine.id}`;
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) {
  if (!value && value !== 0) return null;

  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 border-b border-stone-100 py-2.5 text-sm">
      <dt className="text-stone-500">{label}</dt>
      <dd className="min-w-0 text-stone-800">{value}</dd>
    </div>
  );
}

function TextSection({
  title,
  children,
}: {
  title: string;
  children?: string | null;
}) {
  if (!children) return null;

  return (
    <details className="border-b border-stone-200 py-4">
      <summary className="cursor-pointer font-serif text-xl text-stone-900">
        {title}
      </summary>
      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-stone-600">
        {children}
      </p>
    </details>
  );
}

function RelatedWineList({
  title,
  wines,
}: {
  title: string;
  wines: Wine[];
}) {
  if (!wines || wines.length === 0) return null;

  return (
    <div>
      <h3 className="font-serif text-lg text-stone-900">{title}</h3>
      <ul className="mt-3 divide-y divide-stone-100">
        {wines.map((item) => (
          <li key={`${item.id}-${item.slug}`} className="py-2">
            <Link
              href={getWineUrl(item)}
              className="text-sm leading-6 text-[#8a1f1f] hover:underline"
            >
              {item.name}
              {item.vintage &&
              !String(item.name || "").includes(String(item.vintage))
                ? ` ${item.vintage}`
                : ""}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WinePage({ initialWine }: { initialWine: Wine }) {
  const router = useRouter();

  const [wine, setWine] = useState<Wine | null>(initialWine);
  const [availableStock, setAvailableStock] = useState(
    parseStock(initialWine.stock)
  );
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [sameProducerWines, setSameProducerWines] = useState<Wine[]>([]);
  const [sameAppellationWines, setSameAppellationWines] = useState<Wine[]>([]);
  const [sameVintageWines, setSameVintageWines] = useState<Wine[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function loadClientData() {
      setWine(initialWine);
      setLoading(false);
      setErrorMessage("");
      setCartMessage("");
      setWishlistMessage("");
      setIsInWishlist(false);
      setSameProducerWines([]);
      setSameAppellationWines([]);
      setSameVintageWines([]);
      setSelectedImageIndex(0);
      setAvailableStock(parseStock(initialWine.stock));

      try {
        const { data: userData } = await supabase.auth.getUser();

        if (userData.user && initialWine.id) {
          const { data: wishlistData } = await supabase
            .from("wishlist_items")
            .select("id")
            .eq("user_id", userData.user.id)
            .eq("wine_id", initialWine.id)
            .maybeSingle();

          setIsInWishlist(Boolean(wishlistData));
        }

        if (initialWine.producer && initialWine.id) {
          const { data } = await supabase
            .from("wines")
            .select("id,name,slug,vintage,producer,appellation,category")
            .eq("producer", initialWine.producer)
            .neq("id", initialWine.id)
            .or("hidden_from_site.is.null,hidden_from_site.eq.false")
            .limit(6);

          setSameProducerWines((data || []) as Wine[]);
        }

        if (initialWine.appellation && initialWine.id) {
          const { data } = await supabase
            .from("wines")
            .select("id,name,slug,vintage,producer,appellation,category")
            .eq("appellation", initialWine.appellation)
            .neq("id", initialWine.id)
            .or("hidden_from_site.is.null,hidden_from_site.eq.false")
            .limit(6);

          setSameAppellationWines((data || []) as Wine[]);
        }

        if (initialWine.vintage && initialWine.id) {
          const { data } = await supabase
            .from("wines")
            .select("id,name,slug,vintage,producer,appellation,category")
            .eq("vintage", initialWine.vintage)
            .neq("id", initialWine.id)
            .or("hidden_from_site.is.null,hidden_from_site.eq.false")
            .limit(6);

          setSameVintageWines((data || []) as Wine[]);
        }

        if (initialWine.id) {
          const { data: stockData, error: stockError } = await supabase.rpc(
            "get_available_stock",
            { p_wine_id: initialWine.id }
          );

          if (stockError) {
            console.error("Erreur stock disponible :", stockError);
            setAvailableStock(parseStock(initialWine.stock));
          } else {
            const calculatedStock = Number(stockData);

            setAvailableStock(
              Number.isNaN(calculatedStock)
                ? parseStock(initialWine.stock)
                : calculatedStock
            );
          }
        }
      } catch (error) {
        console.error("Erreur chargement données client :", error);
        setAvailableStock(parseStock(initialWine.stock));
      }
    }

    loadClientData();
  }, [initialWine]);

  useEffect(() => {
    if (!wine) return;

    const sendViewEvent = () => {
      trackWineView({
        id: wine.id,
        slug: wine.slug,
        name: wine.name,
        producer: wine.producer,
        appellation: wine.appellation,
        region: wine.region,
        country: wine.country,
        vintage: wine.vintage,
        classification: wine.classification,
        price: parsePrice(wine.price),
        bottleSize: wine.bottle_size,
        packaging: wine.packaging,
        stock: availableStock,
        category: wine.category,
      });
    };

    sendViewEvent();

    window.addEventListener(
      "tww-analytics-consent-accepted",
      sendViewEvent
    );

    return () => {
      window.removeEventListener(
        "tww-analytics-consent-accepted",
        sendViewEvent
      );
    };
  }, [wine, availableStock]);

  const grapeVarieties = useMemo(
    () => normalizeArray(wine?.grape_varieties),
    [wine?.grape_varieties]
  );

  const tastingNotes = useMemo(
    () => normalizeArray(wine?.tasting_notes),
    [wine?.tasting_notes]
  );

  const galleryImages = useMemo(() => {
    const images = [wine?.image, ...normalizeArray(wine?.additional_images)]
      .map((image) => String(image || "").trim())
      .filter(Boolean);

    return Array.from(new Set(images));
  }, [wine?.image, wine?.additional_images]);

  const selectedImage =
    galleryImages[selectedImageIndex] || galleryImages[0] || "";

  useEffect(() => {
    if (selectedImageIndex >= galleryImages.length) {
      setSelectedImageIndex(0);
    }
  }, [galleryImages.length, selectedImageIndex]);

  const categorySlug = getMainCategorySlug(wine);
  const regionSlug = categorySlug;
  const appellationHref = getAppellationHref(wine);
  const categoryLabel = getCategoryLabel(wine);
  const vintage = wine?.vintage ? String(wine.vintage) : undefined;
  const stock = availableStock;
  const isAvailable = stock > 0;
  const discountInfo = getDiscountInfo(wine?.price, wine?.compare_at_price);
  const packagingInfo = getPackagingInfo(wine?.packaging);

  const addToWishlist = async () => {
    if (!wine?.id || wishlistLoading) return;

    setWishlistLoading(true);
    setWishlistMessage("");

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setWishlistMessage(
          "Connectez-vous pour ajouter ce vin à votre wishlist."
        );
        return;
      }

      if (isInWishlist) {
        setWishlistMessage("Ce vin est déjà dans votre wishlist.");
        return;
      }

      const { error } = await supabase.from("wishlist_items").insert({
        user_id: userData.user.id,
        wine_id: wine.id,
      });

      if (error) {
        if (error.code === "23505") {
          setIsInWishlist(true);
          setWishlistMessage("Ce vin est déjà dans votre wishlist.");
        } else {
          console.error("Erreur ajout wishlist :", error);
          setWishlistMessage("Impossible d’ajouter ce vin à la wishlist.");
        }
        return;
      }

      setIsInWishlist(true);
      setWishlistMessage("Vin ajouté à votre wishlist.");
    } catch (error) {
      console.error("Erreur wishlist :", error);
      setWishlistMessage("Erreur lors de l’ajout à la wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const addToCart = async () => {
    if (!wine || !isAvailable || addingToCart) return;

    if (!wine.id) {
      setCartMessage("Impossible de réserver ce vin : identifiant manquant.");
      return;
    }

    setAddingToCart(true);
    setCartMessage("");

    try {
      const sessionId = getSessionId();
      const winePrice = parsePrice(wine.price);

      let currentCart: CartItem[] = [];
      const storedCart = localStorage.getItem(CART_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) currentCart = parsedCart;
      }

      const existingIndex = currentCart.findIndex((item) => {
        if (wine.id && item.id) return String(item.id) === String(wine.id);
        if (wine.slug && item.slug) return item.slug === wine.slug;
        return item.name === wine.name;
      });

      const currentQuantity =
        existingIndex >= 0
          ? Number(currentCart[existingIndex].quantity || 1)
          : 0;

      const newQuantity = currentQuantity + 1;

      const response = await fetch("/api/stock-reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wineId: wine.id,
          sessionId,
          quantity: newQuantity,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setCartMessage(
          result?.availableStock !== undefined
            ? `Stock insuffisant. Il reste ${formatRemainingStock(
                Number(result.availableStock),
                wine.packaging
              )}.`
            : result?.error || "Impossible de réserver ce vin."
        );

        if (result?.availableStock !== undefined) {
          setAvailableStock(Number(result.availableStock || 0));
        }

        return;
      }

      const newItem: CartItem = {
        id: wine.id,
        slug: wine.slug,
        name: wine.name,
        producer: wine.producer,
        appellation: wine.appellation,
        vintage: wine.vintage,
        price: winePrice,
        image: wine.image,
        bottle_size: wine.bottle_size,
        packaging: wine.packaging,
        quantity: 1,
        reservation_expires_at: result.expiresAt,
      };

      if (existingIndex >= 0) {
        currentCart[existingIndex] = {
          ...currentCart[existingIndex],
          quantity: newQuantity,
          reservation_expires_at: result.expiresAt,
        };
      } else {
        currentCart.push(newItem);
      }

      localStorage.setItem(CART_KEY, JSON.stringify(currentCart));
      setAvailableStock(Number(result.availableStock || 0));

      router.push("/panier");
    } catch (error) {
      console.error("Erreur ajout panier :", error);
      setCartMessage("Erreur lors de l’ajout au panier.");
    } finally {
      setAddingToCart(false);
    }
  };
  if (loading) {
    return (
      <main className="min-h-screen bg-white px-5 py-12 text-stone-700">
        <p className="mx-auto max-w-6xl">Chargement du vin…</p>
      </main>
    );
  }

  if (errorMessage || !wine) {
    return (
      <main className="min-h-screen bg-white px-5 py-12 text-stone-800">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-serif text-3xl">
            {errorMessage || "Vin introuvable"}
          </h1>

          <Link
            href="/boutique"
            className="mt-5 inline-block text-sm text-[#8a1f1f] hover:underline"
          >
            ← Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  const isPrimeur =
    categoryToSlug(wine.category) === "primeurs-2025";

  const displayName =
    vintage && !String(wine.name || "").includes(vintage)
      ? `${wine.name || "Grand vin"} ${vintage}`
      : wine.name || "Grand vin";

  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
        <nav
          aria-label="Fil d’Ariane"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-6 text-stone-500"
        >
          <Link href="/boutique" className="hover:text-[#8a1f1f]">
            Boutique
          </Link>

          {categorySlug && (
            <>
              <span aria-hidden="true">/</span>

              <Link
                href={`/boutique/${categorySlug}`}
                className="hover:text-[#8a1f1f]"
              >
                {categoryLabel}
              </Link>
            </>
          )}

          <span aria-hidden="true">/</span>
          <span aria-current="page">{displayName}</span>
        </nav>

        <section className="mt-6 grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <div className="min-w-0">
            <div className="flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={`${displayName} — photo ${selectedImageIndex + 1}`}
                  className="h-[280px] w-full object-contain md:h-[380px]"
                />
              ) : (
                <div className="flex h-[280px] w-full items-center justify-center bg-stone-50 text-sm text-stone-400 md:h-[380px]">
                  Photo à venir
                </div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`Afficher la photo ${index + 1}`}
                    aria-pressed={selectedImageIndex === index}
                    className={`rounded border bg-white p-1 transition-colors ${
                      selectedImageIndex === index
                        ? "border-[#8a1f1f]"
                        : "border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-14 w-14 object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0">
            {wine.appellation &&
              (appellationHref ? (
                <Link
                  href={appellationHref}
                  className="text-sm text-stone-500 hover:text-[#8a1f1f]"
                >
                  {wine.appellation}
                </Link>
              ) : (
                <p className="text-sm text-stone-500">
                  {wine.appellation}
                </p>
              ))}

            <h1 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
              {displayName}
            </h1>

            {wine.producer && (
              <Link
                href={`/producteur/${producerToSlug(wine.producer)}`}
                className="mt-3 inline-block text-sm text-[#8a1f1f] underline-offset-4 hover:underline"
              >
                {wine.producer}
              </Link>
            )}

            {wine.classification && (
              <p className="mt-2 text-sm text-stone-600">
                {wine.classification}
              </p>
            )}

            <dl className="mt-5">
              <InfoCard
                label="Millésime"
                value={
                  vintage ? (
                    <Link
                      href={`/millesime/${vintage}`}
                      className="underline-offset-4 hover:text-[#8a1f1f] hover:underline"
                    >
                      {vintage}
                    </Link>
                  ) : undefined
                }
              />

              <InfoCard label="Format" value={wine.bottle_size} />

              <InfoCard
                label="Conditionnement"
                value={wine.packaging ? packagingInfo.display : undefined}
              />

              <InfoCard label="Note" value={wine.rating} />
            </dl>

            <div className="mt-6">
              {discountInfo && (
                <div className="mb-1 flex flex-wrap items-center gap-3">
                  <p className="text-sm text-stone-400 line-through">
                    {formatPrice(wine.compare_at_price)}
                  </p>

                  <span className="rounded bg-[#8a1f1f] px-2 py-1 text-xs font-semibold text-white">
                    −{discountInfo.percent} %
                  </span>
                </div>
              )}

              <p className="text-3xl font-semibold text-[#8a1f1f]">
                {formatPrice(wine.price)}
              </p>

              <p className="mt-2 text-xs leading-5 text-stone-500">
                Prix pour le conditionnement indiqué. TVA calculée lors
                de la finalisation de la commande.
              </p>

              <p
                className={`mt-4 text-sm ${
                  isAvailable ? "text-green-800" : "text-stone-500"
                }`}
              >
                {isAvailable
                  ? formatAvailableStock(stock, wine.packaging)
                  : "Épuisé"}
              </p>

              {isPrimeur && (
                <p className="mt-2 text-sm leading-6 text-[#8a1f1f]">
                  Vin en précommande. Livraison estimée en 2027.
                  Sans frais de livraison.
                </p>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={addToCart}
                disabled={!isAvailable || addingToCart}
                className="rounded bg-[#8a1f1f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#641313] disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                {addingToCart
                  ? "Réservation…"
                  : isAvailable
                    ? "Ajouter au panier"
                    : "Épuisé"}
              </button>

              <button
                type="button"
                onClick={addToWishlist}
                disabled={wishlistLoading || isInWishlist}
                className="rounded border border-stone-300 px-5 py-3 text-sm text-stone-700 transition-colors hover:border-[#8a1f1f] hover:text-[#8a1f1f] disabled:cursor-default disabled:opacity-60"
              >
                {wishlistLoading
                  ? "Ajout…"
                  : isInWishlist
                    ? "♡ Dans ma wishlist"
                    : "♡ Ajouter à ma wishlist"}
              </button>
            </div>

            {cartMessage && (
              <p role="status" className="mt-3 text-sm text-[#8a1f1f]">
                {cartMessage}
              </p>
            )}

            {wishlistMessage && (
              <p role="status" className="mt-3 text-sm text-[#8a1f1f]">
                {wishlistMessage}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
              <Link
                href="/panier"
                className="text-[#8a1f1f] hover:underline"
              >
                Voir le panier →
              </Link>

              <Link
                href="/livraison"
                className="text-stone-500 hover:underline"
              >
                Livraison et retours
              </Link>
            </div>

            {isAvailable && (
              <p className="mt-3 text-xs leading-5 text-stone-500">
                Stock réservé pendant 30 minutes lors de l’ajout au panier.
              </p>
            )}
          </div>
        </section>

        <div className="mt-10 border-t border-stone-200">
          {wine.description && (
            <section className="border-b border-stone-200 py-6">
              <h2 className="font-serif text-2xl">
                Présentation du vin
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-stone-600">
                {wine.description}
              </p>
            </section>
          )}

          <TextSection title="L’Avis The Wine Watchers">
            {wine.meta_content}
          </TextSection>

          <TextSection title="Histoire du domaine et du vin">
            {wine.story}
          </TextSection>

          {(wine.country ||
            wine.region ||
            wine.color ||
            wine.style ||
            wine.soil ||
            grapeVarieties.length > 0) && (
            <details className="border-b border-stone-200 py-4">
              <summary className="cursor-pointer font-serif text-xl text-stone-900">
                Caractéristiques du vin
              </summary>

              <dl className="mt-4 grid gap-x-8 md:grid-cols-2">
                <InfoCard label="Pays" value={wine.country} />

                <InfoCard
                  label="Région"
                  value={
                    wine.region && regionSlug ? (
                      <Link
                        href={`/boutique/${regionSlug}`}
                        className="hover:text-[#8a1f1f] hover:underline"
                      >
                        {wine.region}
                      </Link>
                    ) : (
                      wine.region
                    )
                  }
                />

                <InfoCard label="Couleur" value={wine.color} />

                <InfoCard
                  label="Cépages"
                  value={grapeVarieties.join(", ")}
                />

                <InfoCard label="Style" value={wine.style} />
                <InfoCard label="Sol" value={wine.soil} />
              </dl>
            </details>
          )}

          {tastingNotes.length > 0 && (
            <details className="border-b border-stone-200 py-4">
              <summary className="cursor-pointer font-serif text-xl text-stone-900">
                Notes de dégustation
              </summary>

              <div className="mt-4 space-y-4">
                {tastingNotes.map((note, index) => (
                  <p
                    key={`${index}-${note}`}
                    className="whitespace-pre-line text-sm leading-7 text-stone-600"
                  >
                    {note}
                  </p>
                ))}
              </div>
            </details>
          )}

          <TextSection title="Nez">{wine.nose}</TextSection>
          <TextSection title="Bouche">{wine.palate}</TextSection>

          <TextSection title="Accords mets et vins">
            {wine.pairing}
          </TextSection>

          <TextSection title="Température de service">
            {wine.serving_temperature}
          </TextSection>

          <TextSection title="Potentiel de garde">
            {wine.aging_potential}
          </TextSection>
        </div>

        <section className="mt-8 border-b border-stone-200 pb-6">
          <h2 className="font-serif text-xl">Explorer la sélection</h2>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {wine.producer && (
              <Link
                href={`/producteur/${producerToSlug(wine.producer)}`}
                className="text-[#8a1f1f] hover:underline"
              >
                Tous les vins de {wine.producer}
              </Link>
            )}

            {wine.appellation && appellationHref && (
              <Link
                href={appellationHref}
                className="text-[#8a1f1f] hover:underline"
              >
                {wine.appellation}
              </Link>
            )}

            {categorySlug && (
              <Link
                href={`/boutique/${categorySlug}`}
                className="text-[#8a1f1f] hover:underline"
              >
                {categoryLabel}
              </Link>
            )}

            {(categorySlug === "bordeaux" ||
              categorySlug === "primeurs-2025") && (
              <Link
                href="/boutique/primeurs-2025"
                className="text-[#8a1f1f] hover:underline"
              >
                Primeurs 2025
              </Link>
            )}
          </div>
        </section>

        {(sameProducerWines.length > 0 ||
          sameAppellationWines.length > 0 ||
          sameVintageWines.length > 0) && (
          <section className="py-8">
            <h2 className="font-serif text-2xl">À découvrir également</h2>

            <div className="mt-5 grid items-start gap-8 lg:grid-cols-3">
              <RelatedWineList
                title="Du même domaine"
                wines={sameProducerWines}
              />

              <RelatedWineList
                title="De la même appellation"
                wines={sameAppellationWines}
              />

              <RelatedWineList
                title={vintage ? `Millésime ${vintage}` : "Du même millésime"}
                wines={sameVintageWines}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}