"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Wine = {
  id?: string | number;
  slug?: string;
  name?: string;
  region?: string;
  vintage?: string | number;
  price?: string | number;
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
};

const CART_KEY = "cart";

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
  if (price === undefined || price === null || price === "") {
    return 0;
  }

  if (typeof price === "number") {
    return price;
  }

  const cleaned = price
    .toString()
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatPrice(price?: string | number) {
  const parsedPrice = parsePrice(price);

  if (parsedPrice <= 0) {
    return "Prix sur demande";
  }

  return parsedPrice.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function categoryToSlug(category?: string) {
  if (!category) return "";

  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;

  return (
    <div className="rounded-[1.5rem] border border-[#e1d1bd] bg-[#fffaf3] p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-[#8a6a2f]">
        {label}
      </p>
      <p className="mt-3 text-base font-medium text-[#24110d]">{value}</p>
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
      <p className="mt-5 text-base leading-8 text-[#6d5b50]">{children}</p>
    </section>
  );
}

export default function WinePage() {
  const params = useParams();
  const router = useRouter();

  const routeId = String(params?.id || "");

  const [wine, setWine] = useState<Wine | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadWine() {
      if (!routeId) {
        setErrorMessage("Vin introuvable.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

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
        }

        setWine(foundWine);
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

  const categorySlug = categoryToSlug(wine?.category);
  const vintage = wine?.vintage ? String(wine.vintage) : undefined;

  const addToCart = () => {
    if (!wine) return;

    const winePrice = parsePrice(wine.price);

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
    };

    let currentCart: CartItem[] = [];

    try {
      const storedCart = localStorage.getItem(CART_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);

        if (Array.isArray(parsedCart)) {
          currentCart = parsedCart;
        }
      }
    } catch (error) {
      console.error("Erreur lecture panier :", error);
    }

    const existingIndex = currentCart.findIndex((item) => {
      if (newItem.id && item.id) return String(item.id) === String(newItem.id);
      if (newItem.slug && item.slug) return item.slug === newItem.slug;
      return item.name === newItem.name;
    });

    if (existingIndex >= 0) {
      currentCart[existingIndex] = {
        ...currentCart[existingIndex],
        quantity: Number(currentCart[existingIndex].quantity || 1) + 1,
      };
    } else {
      currentCart.push(newItem);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(currentCart));

    router.push("/panier");
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
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            Fiche vin
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            {errorMessage || "Vin introuvable"}
          </h1>

          <Link
            href="/boutique/bourgogne"
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

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div className="flex items-center justify-center">
            <div className="relative rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              {wine.image ? (
                <img
                  src={wine.image}
                  alt={wine.name || "Vin"}
                  className="h-[440px] w-full max-w-[360px] rounded-[2rem] object-contain"
                />
              ) : (
                <div className="flex h-[440px] w-[320px] items-center justify-center rounded-[2rem] bg-white/10 text-sm uppercase tracking-[0.2em] text-white/60">
                  Image à venir
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#d8b56d]">
              {wine.category || "Grand vin"}
            </p>

            <h1 className="mt-5 font-serif text-4xl leading-tight text-white md:text-6xl">
              {wine.name}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/75">
              {wine.producer && <span>{wine.producer}</span>}
              {wine.appellation && <span>• {wine.appellation}</span>}
              {vintage && <span>• {vintage}</span>}
            </div>

            {wine.description && (
              <p className="mt-8 max-w-2xl text-base leading-8 text-white/78">
                {wine.description}
              </p>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
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
                <p className="mt-2 text-white">{formatPrice(wine.price)}</p>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={addToCart}
                className="rounded-full bg-[#d8b56d] px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#24110d] transition hover:bg-white"
              >
                Ajouter au panier
              </button>

              <Link
                href="/panier"
                className="rounded-full border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#d8b56d] hover:text-[#d8b56d]"
              >
                Voir le panier
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <Link
                href="/boutique"
                className="text-[#d8b56d] transition hover:text-white"
              >
                ← Retour boutique
              </Link>

              {categorySlug && (
                <Link
                  href={`/boutique/${categorySlug}`}
                  className="text-[#d8b56d] transition hover:text-white"
                >
                  Retour {wine.category}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard label="Millésime" value={vintage} />
          <InfoCard label="Flaconnage" value={wine.bottle_size} />
          <InfoCard label="Caissage" value={wine.packaging} />
          <InfoCard label="Note" value={wine.rating} />
          <InfoCard label="Région" value={wine.region} />
          <InfoCard label="Appellation" value={wine.appellation} />
          <InfoCard label="Domaine" value={wine.producer} />
          <InfoCard label="Pays" value={wine.country} />
          <InfoCard label="Couleur" value={wine.color} />
          <InfoCard label="Classification" value={wine.classification} />
          <InfoCard label="Style" value={wine.style} />
          <InfoCard label="Sol" value={wine.soil} />
          <InfoCard label="Température" value={wine.serving_temperature} />
          <InfoCard label="Potentiel de garde" value={wine.aging_potential} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-8">
          <TextSection title="Histoire du vin">{wine.story}</TextSection>
          <TextSection title="Nez">{wine.nose}</TextSection>
          <TextSection title="Bouche">{wine.palate}</TextSection>
          <TextSection title="Accords mets-vins">{wine.pairing}</TextSection>
        </div>

        <div className="grid content-start gap-8">
          {grapeVarieties.length > 0 && (
            <section className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm">
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
            <section className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm">
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
            <section className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
                Informations complémentaires
              </p>

              <p className="mt-5 text-base leading-8 text-[#6d5b50]">
                {wine.meta_content}
              </p>
            </section>
          )}

          <section className="rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3] p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
              Commande
            </p>

            <h2 className="mt-4 font-serif text-3xl text-[#24110d]">
              Ajouter ce vin à votre sélection
            </h2>

            <p className="mt-4 text-base leading-7 text-[#6d5b50]">
              Ajoutez ce vin au panier pour finaliser votre commande. La TVA
              applicable sera calculée lors de la finalisation de la commande.
            </p>

            <button
              type="button"
              onClick={addToCart}
              className="mt-6 inline-block rounded-full bg-[#8a1f1f] px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#641313]"
            >
              Ajouter au panier
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}