"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

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

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

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

  const raw = String(price)
    .trim()
    .replace(/[€\s]/g, "");

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

  return {
    saving,
    percent,
  };
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
  "pauillac",
  "margaux",
  "saint-julien",
  "saint-estephe",
  "pomerol",
  "saint-emilion",
  "pessac-leognan",
  "sauternes",
  "meursault",
  "vosne-romanee",
  "gevrey-chambertin",
  "chambolle-musigny",
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

  if (mainCategorySlug === "usa" && (!wine.category || currentCategorySlug === "autres")) {
    return "USA";
  }

  if (mainCategorySlug === "italie" && (!wine.category || currentCategorySlug === "autres")) {
    return "Grands vins d’Italie";
  }

  if (mainCategorySlug === "espagne" && (!wine.category || currentCategorySlug === "autres")) {
    return "Espagne";
  }

  if (mainCategorySlug === "bourgogne" && (!wine.category || currentCategorySlug === "autres")) {
    return "Bourgogne";
  }

  if (mainCategorySlug === "bordeaux" && (!wine.category || currentCategorySlug === "autres")) {
    return "Bordeaux";
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
  if (!appellation) return "";

  return appellation
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
    <div className="rounded-[1.5rem] border border-[#e1d1bd] bg-[#fffaf3] p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-[#8a6a2f]">
        {label}
      </p>
      <div className="mt-3 text-base font-medium text-[#24110d]">{value}</div>
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
    <section className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm">
      <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
        {title}
      </p>
      <p className="mt-5 whitespace-pre-line text-base leading-8 text-[#6d5b50]">
        {children}
      </p>
    </section>
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
    <div className="rounded-[1.5rem] border border-[#e1d1bd] bg-white p-5 shadow-sm">
      <h3 className="font-serif text-xl text-[#24110d]">{title}</h3>

      <div className="mt-4 grid gap-3">
        {wines.map((item) => (
          <Link
            key={`${item.id}-${item.slug}`}
            href={getWineUrl(item)}
            className="rounded-2xl border border-[#eadcca] bg-[#fffaf3] px-4 py-3 text-sm font-medium text-[#6d5b50] transition hover:border-[#8a6a2f] hover:text-[#8a1f1f]"
          >
            {item.name}
            {item.vintage &&
            !String(item.name || "").includes(String(item.vintage))
              ? ` ${item.vintage}`
              : ""}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function WinePage() {
  const params = useParams();
  const router = useRouter();

  const routeId = String(params?.id || "");

  const [wine, setWine] = useState<Wine | null>(null);
  const [availableStock, setAvailableStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [sameProducerWines, setSameProducerWines] = useState<Wine[]>([]);
  const [sameAppellationWines, setSameAppellationWines] = useState<Wine[]>([]);
  const [sameVintageWines, setSameVintageWines] = useState<Wine[]>([]);

  useEffect(() => {
    async function loadWine() {
      if (!routeId) {
        setErrorMessage("Vin introuvable.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");
      setCartMessage("");
      setWishlistMessage("");
      setIsInWishlist(false);
      setSameProducerWines([]);
      setSameAppellationWines([]);
      setSameVintageWines([]);

      try {
        let foundWine: Wine | null = null;

        const byId = await supabase
          .from("wines")
          .select("*")
          .eq("id", routeId)
          .maybeSingle();

        if (byId.data) {
          foundWine = byId.data as Wine;
        }

        if (!foundWine) {
          const bySlug = await supabase
            .from("wines")
            .select("*")
            .eq("slug", routeId)
            .maybeSingle();

          if (bySlug.data) {
            foundWine = bySlug.data as Wine;
          }
        }

        if (!foundWine) {
          setErrorMessage("Ce vin est introuvable ou n’est plus disponible.");
          setWine(null);
          return;
        }

        if (foundWine.hidden_from_site === true) {
          setErrorMessage("Ce vin est actuellement indisponible.");
          setWine(null);
          return;
        }

        setWine(foundWine);

        const { data: userData } = await supabase.auth.getUser();

        if (userData.user && foundWine.id) {
          const { data: wishlistData } = await supabase
            .from("wishlist_items")
            .select("id")
            .eq("user_id", userData.user.id)
            .eq("wine_id", foundWine.id)
            .maybeSingle();

          setIsInWishlist(Boolean(wishlistData));
        }

        if (foundWine.producer && foundWine.id) {
          const { data } = await supabase
            .from("wines")
            .select("id,name,slug,vintage,producer,appellation,category")
            .eq("producer", foundWine.producer)
            .neq("id", foundWine.id)
            .or("hidden_from_site.is.null,hidden_from_site.eq.false")
            .limit(6);

          setSameProducerWines((data || []) as Wine[]);
        }

        if (foundWine.appellation && foundWine.id) {
          const { data } = await supabase
            .from("wines")
            .select("id,name,slug,vintage,producer,appellation,category")
            .eq("appellation", foundWine.appellation)
            .neq("id", foundWine.id)
            .or("hidden_from_site.is.null,hidden_from_site.eq.false")
            .limit(6);

          setSameAppellationWines((data || []) as Wine[]);
        }

        if (foundWine.vintage && foundWine.id) {
          const { data } = await supabase
            .from("wines")
            .select("id,name,slug,vintage,producer,appellation,category")
            .eq("vintage", foundWine.vintage)
            .neq("id", foundWine.id)
            .or("hidden_from_site.is.null,hidden_from_site.eq.false")
            .limit(6);

          setSameVintageWines((data || []) as Wine[]);
        }

        if (foundWine.id) {
          const { data: stockData, error: stockError } = await supabase.rpc(
            "get_available_stock",
            { p_wine_id: foundWine.id }
          );

          if (stockError) {
            console.error("Erreur stock disponible :", stockError);
            setAvailableStock(parseStock(foundWine.stock));
          } else {
            const calculatedStock = Number(stockData);

            if (Number.isNaN(calculatedStock)) {
              setAvailableStock(parseStock(foundWine.stock));
            } else {
              setAvailableStock(calculatedStock);
            }
          }
        } else {
          setAvailableStock(parseStock(foundWine.stock));
        }
      } catch (error) {
        console.error("Erreur chargement fiche vin :", error);
        setErrorMessage("Erreur lors du chargement de la fiche vin.");
      } finally {
        setLoading(false);
      }
    }

    loadWine();
  }, [routeId]);

  const grapeVarieties = useMemo(
    () => normalizeArray(wine?.grape_varieties),
    [wine?.grape_varieties]
  );

  const tastingNotes = useMemo(
    () => normalizeArray(wine?.tasting_notes),
    [wine?.tasting_notes]
  );

  const categorySlug = getMainCategorySlug(wine);
  const regionSlug = categorySlug;
  const appellationHref = getAppellationHref(wine);
  const categoryLabel = getCategoryLabel(wine);
  const vintage = wine?.vintage ? String(wine.vintage) : undefined;
  const stock = availableStock;
  const isAvailable = stock > 0;
  const discountInfo = getDiscountInfo(wine?.price, wine?.compare_at_price);

  const addToWishlist = async () => {
    if (!wine?.id || wishlistLoading) return;

    setWishlistLoading(true);
    setWishlistMessage("");

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setWishlistMessage("Connectez-vous pour ajouter ce vin à votre wishlist.");
        setWishlistLoading(false);
        return;
      }

      if (isInWishlist) {
        setWishlistMessage("Ce vin est déjà dans votre wishlist.");
        setWishlistLoading(false);
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

        setWishlistLoading(false);
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

        if (Array.isArray(parsedCart)) {
          currentCart = parsedCart;
        }
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
            ? `Stock insuffisant. Il reste ${result.availableStock} caisse${
                Number(result.availableStock) > 1 ? "s" : ""
              } disponible${Number(result.availableStock) > 1 ? "s" : ""}.`
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
      <main className="min-h-screen bg-[#f8f3ea] px-6 py-20 text-[#24110d]">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#e1d1bd] bg-white p-10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            The Wine Watchers
          </p>
          <h1 className="mt-4 font-serif text-4xl">Chargement du vin...</h1>
        </div>
      </main>
    );
  }

  if (errorMessage || !wine) {
    return (
      <main className="min-h-screen bg-[#f8f3ea] px-6 py-20 text-[#24110d]">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#e1d1bd] bg-white p-10 shadow-sm">
          <h1 className="mt-4 font-serif text-4xl">
            {errorMessage || "Vin introuvable"}
          </h1>

          <Link
            href="/boutique/bordeaux"
            className="mt-8 inline-flex rounded-full bg-black px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#8a6a2f]"
          >
            Retour boutique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#24110d]">
      <section className="relative overflow-hidden bg-[#1c0f0b] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,181,109,0.22),transparent_40%),linear-gradient(135deg,#1c0f0b,#3a1712)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div className="flex items-center justify-center">
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
              {wine.image ? (
                <img
                  src={wine.image}
                  alt={`Bouteille de ${wine.name || "vin"} - The Wine Watchers`}
                  className="h-[380px] w-full max-w-[340px] rounded-[1.5rem] object-contain"
                />
              ) : (
                <div className="flex h-[380px] w-[300px] items-center justify-center rounded-[1.5rem] bg-white/10 text-sm uppercase tracking-[0.2em] text-white/60">
                  Image à venir
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            {categorySlug ? (
              <Link
                href={`/boutique/${categorySlug}`}
                className="text-sm uppercase tracking-[0.35em] text-[#d8b56d] transition hover:text-white"
              >
                {categoryLabel}
              </Link>
            ) : (
              <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
                {categoryLabel}
              </p>
            )}

            <h1 className="mt-5 font-serif text-xl leading-tight text-white md:text-3xl">
              {wine.name}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/75">
                          {wine.producer && (
                <Link
                  href={`/producteur/${producerToSlug(wine.producer)}`}
                  className="underline underline-offset-4 transition hover:text-[#d8b56d]"
                >
                  Producteur : {wine.producer}
                </Link>
              )}

              {wine.appellation && appellationHref && (
                <Link
                  href={appellationHref}
                  className="underline underline-offset-4 transition hover:text-[#d8b56d]"
                >
                  • {wine.appellation}
                </Link>
              )}

              {wine.appellation && !appellationHref && (
                <span>• {wine.appellation}</span>
              )}

              {wine.region && regionSlug && (
                <Link
                  href={`/boutique/${regionSlug}`}
                  className="underline underline-offset-4 transition hover:text-[#d8b56d]"
                >
                  • {wine.region}
                </Link>
              )}

              {vintage && <span>• {vintage}</span>}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-4">
              {wine.bottle_size && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#d8b56d]">
                    Flaconnage
                  </p>
                  <p className="mt-2 text-white">{wine.bottle_size}</p>
                </div>
              )}

              {wine.packaging && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#d8b56d]">
                    Caissage
                  </p>
                  <p className="mt-2 text-white">{wine.packaging}</p>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#d8b56d]">
                  Prix HT
                </p>

                {discountInfo ? (
                  <div className="mt-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d8b56d]">
                      🏷️ Offre exceptionnelle
                    </p>
                    <p className="mt-2 text-sm text-white/50 line-through">
                      {formatPrice(wine.compare_at_price)}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {formatPrice(wine.price)}
                    </p>
                    <p className="mt-1 text-xs text-[#f5dfaa]">
                      Vous économisez {formatPrice(discountInfo.saving)} (-
                      {discountInfo.percent} %)
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-white">{formatPrice(wine.price)}</p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#d8b56d]">
                  Disponibilité
                </p>
                <p className="mt-2 text-white">
                  {isAvailable
                    ? `${stock} caisse${stock > 1 ? "s" : ""} disponible${
                        stock > 1 ? "s" : ""
                      }`
                    : "Épuisé"}
                </p>
              </div>
            </div>

            {cartMessage && (
              <p className="mt-5 rounded-2xl border border-[#d8b56d]/40 bg-black/20 px-5 py-3 text-sm text-[#f5dfaa]">
                {cartMessage}
              </p>
            )}

            {wishlistMessage && (
              <p className="mt-5 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm text-[#f5dfaa]">
                {wishlistMessage}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={addToCart}
                disabled={!isAvailable || addingToCart}
                className={`rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                  isAvailable && !addingToCart
                    ? "bg-[#d8b56d] text-[#24110d] hover:bg-white"
                    : "cursor-not-allowed bg-neutral-500 text-white"
                }`}
              >
                {addingToCart
                  ? "Réservation..."
                  : isAvailable
                  ? "Ajouter au panier"
                  : "Épuisé"}
              </button>

              <button
                type="button"
                onClick={addToWishlist}
                disabled={wishlistLoading || isInWishlist}
                className={`rounded-full border px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                  isInWishlist
                    ? "cursor-not-allowed border-[#d8b56d] bg-[#d8b56d] text-[#24110d]"
                    : "border-white/30 text-white hover:border-[#d8b56d] hover:text-[#d8b56d]"
                }`}
              >
                {wishlistLoading
                  ? "Ajout..."
                  : isInWishlist
                  ? "Dans ma wishlist"
                  : "♡ Ajouter à ma wishlist"}
              </button>

              <Link
                href="/panier"
                className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#d8b56d] hover:text-[#d8b56d]"
              >
                Voir le panier
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <Link
                href={categorySlug ? `/boutique/${categorySlug}` : "/boutique"}
                className="text-[#d8b56d] transition hover:text-white"
              >
                ← Retour boutique
              </Link>

              {categorySlug && (
                <Link
                  href={`/boutique/${categorySlug}`}
                  className="text-[#d8b56d] transition hover:text-white"
                >
                  Retour {categoryLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard label="Millésime" value={vintage} />
          <InfoCard
            label="Stock disponible"
            value={
              isAvailable ? `${stock} caisse${stock > 1 ? "s" : ""}` : "Épuisé"
            }
          />
          <InfoCard label="Flaconnage" value={wine.bottle_size} />
          <InfoCard label="Caissage" value={wine.packaging} />
          <InfoCard label="Note" value={wine.rating} />

          <InfoCard
            label="Région"
            value={
              wine.region && regionSlug ? (
                <Link
                  href={`/boutique/${regionSlug}`}
                  className="underline underline-offset-4 transition hover:text-[#8a1f1f]"
                >
                  {wine.region}
                </Link>
              ) : (
                wine.region
              )
            }
          />

          <InfoCard
            label="Appellation"
            value={
              wine.appellation && appellationHref ? (
                <Link
                  href={appellationHref}
                  className="underline underline-offset-4 transition hover:text-[#8a1f1f]"
                >
                  {wine.appellation}
                </Link>
              ) : (
                wine.appellation
              )
            }
          />

          <InfoCard
            label="Domaine"
            value={
              wine.producer ? (
                <Link
                  href={`/producteur/${producerToSlug(wine.producer)}`}
                  className="underline underline-offset-4 transition hover:text-[#8a1f1f]"
                >
                  {wine.producer}
                </Link>
              ) : (
                wine.producer
              )
            }
          />

          <InfoCard label="Pays" value={wine.country} />
          <InfoCard label="Couleur" value={wine.color} />
          <InfoCard label="Classification" value={wine.classification} />
          <InfoCard label="Style" value={wine.style} />
          <InfoCard label="Sol" value={wine.soil} />
          <InfoCard label="Température" value={wine.serving_temperature} />
          <InfoCard label="Potentiel de garde" value={wine.aging_potential} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-[1fr_0.72fr]">
        <div className="grid gap-8">
          <TextSection title="Description complète">
            {wine.description}
          </TextSection>

          <TextSection title="Histoire du vin">{wine.story}</TextSection>
          <TextSection title="Nez">{wine.nose}</TextSection>
          <TextSection title="Bouche">{wine.palate}</TextSection>
          <TextSection title="Accords mets-vins">{wine.pairing}</TextSection>
        </div>

        <div className="grid content-start gap-6">
          {grapeVarieties.length > 0 && (
            <section className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
                Cépages
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {grapeVarieties.map((grape) => (
                  <span
                    key={grape}
                    className="rounded-full border border-[#dfcfb8] bg-white px-4 py-2 text-sm text-[#6d5b50]"
                  >
                    {grape}
                  </span>
                ))}
              </div>
            </section>
          )}

          {tastingNotes.length > 0 && (
            <section className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
                Notes de dégustation
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-[#dfcfb8] bg-white px-4 py-2 text-sm text-[#6d5b50]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </section>
          )}

          {wine.meta_content && (
            <section className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
                Informations complémentaires
              </p>

              <p className="mt-5 whitespace-pre-line text-base leading-8 text-[#6d5b50]">
                {wine.meta_content}
              </p>
            </section>
          )}

          <section className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-6 shadow-sm">
            <h2 className="font-serif text-2xl text-[#24110d]">
              Commander ce vin
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#6d5b50]">
              {isAvailable
                ? "Stock réservé temporairement pendant 30 minutes lors de l’ajout au panier. TVA calculée automatiquement lors du paiement."
                : "Ce vin est actuellement épuisé."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addToCart}
                disabled={!isAvailable || addingToCart}
                className={`inline-block rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition ${
                  isAvailable && !addingToCart
                    ? "bg-[#8a1f1f] hover:bg-[#641313]"
                    : "cursor-not-allowed bg-neutral-500"
                }`}
              >
                {addingToCart
                  ? "Réservation..."
                  : isAvailable
                  ? "Ajouter au panier"
                  : "Épuisé"}
              </button>

              <button
                type="button"
                onClick={addToWishlist}
                disabled={wishlistLoading || isInWishlist}
                className={`inline-block rounded-full border px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
                  isInWishlist
                    ? "cursor-not-allowed border-[#8a1f1f] bg-[#8a1f1f] text-white"
                    : "border-[#8a1f1f] text-[#8a1f1f] hover:bg-[#8a1f1f] hover:text-white"
                }`}
              >
                {wishlistLoading
                  ? "Ajout..."
                  : isInWishlist
                  ? "Dans ma wishlist"
                  : "♡ Wishlist"}
              </button>
            </div>

            {cartMessage && (
              <p className="mt-4 text-sm text-[#8a1f1f]">{cartMessage}</p>
            )}

            {wishlistMessage && (
              <p className="mt-4 text-sm text-[#8a1f1f]">{wishlistMessage}</p>
            )}
          </section>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[2.5rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            Suggestions
          </p>

          <h2 className="mt-3 font-serif text-3xl text-[#24110d]">
            Voir aussi
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d5b50]">
            Découvrez d’autres grands vins proches de cette sélection : même
            domaine, même appellation, même millésime ou sélection Bordeaux
            Primeurs 2025.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <RelatedWineList
              title={
                wine.producer
                  ? `Autres vins du domaine ${wine.producer}`
                  : "Autres vins du même domaine"
              }
              wines={sameProducerWines}
            />

            <RelatedWineList
              title={
                wine.appellation
                  ? `Autres vins de ${wine.appellation}`
                  : "Autres vins de la même appellation"
              }
              wines={sameAppellationWines}
            />

            <RelatedWineList
              title={
                vintage
                  ? `Autres vins du millésime ${vintage}`
                  : "Autres vins du même millésime"
              }
              wines={sameVintageWines}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/boutique/bordeaux"
              className="rounded-full border border-[#8a6a2f]/40 bg-white px-5 py-3 text-sm font-semibold text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
            >
              Tous les Bordeaux
            </Link>

            <Link
              href="/boutique/bordeaux?primeur=2025"
              className="rounded-full border border-[#8a6a2f]/40 bg-white px-5 py-3 text-sm font-semibold text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
            >
              Bordeaux Primeurs 2025
            </Link>

            {categorySlug && (
              <Link
                href={`/boutique/${categorySlug}`}
                className="rounded-full border border-[#8a6a2f]/40 bg-white px-5 py-3 text-sm font-semibold text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
              >
                Tous les vins {categoryLabel}
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}