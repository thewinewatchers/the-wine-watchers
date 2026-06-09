"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

function formatPrice(value?: string | number) {
  const price = parsePrice(value);

  return price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function formatReservationTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PanierClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);
  const [clearingCart, setClearingCart] = useState(false);

  useEffect(() => {
    async function loadPanier() {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(Boolean(data.user));

      const stored = localStorage.getItem(CART_KEY);
      let foundCart: CartItem[] = [];

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) foundCart = parsed;
        } catch (error) {
          console.error("Erreur lecture panier :", error);
        }
      }

      setCart(foundCart);
      setIsLoaded(true);
    }

    loadPanier();
  }, []);

  useEffect(() => {
    async function syncCart() {
      if (!isLoaded) return;

      localStorage.setItem(CART_KEY, JSON.stringify(cart));

      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const totalAmount = cart.reduce((sum, item) => {
        const price = parsePrice(item.price);
        const quantity = Number(item.quantity || 1);
        return sum + price * quantity;
      }, 0);

      if (cart.length === 0) {
        await supabase
          .from("abandoned_carts")
          .delete()
          .eq("user_id", data.user.id)
          .eq("status", "open");

        return;
      }

      await supabase.from("abandoned_carts").upsert(
        {
          user_id: data.user.id,
          customer_email: data.user.email,
          cart,
          total_amount: totalAmount,
          status: "open",
          last_activity_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    syncCart();
  }, [cart, isLoaded]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = parsePrice(item.price);
      const quantity = Number(item.quantity || 1);
      return sum + price * quantity;
    }, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  }, [cart]);

  async function reserveQuantity(item: CartItem, quantity: number) {
    const sessionId = getSessionId();

    const response = await fetch("/api/stock-reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wineId: item.id,
        sessionId,
        quantity,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.availableStock !== undefined
          ? `Stock insuffisant. Il reste ${result.availableStock} caisse${
              Number(result.availableStock) > 1 ? "s" : ""
            } disponible${Number(result.availableStock) > 1 ? "s" : ""}.`
          : result?.error || "Impossible de réserver ce vin."
      );
    }

    return result;
  }

  async function releaseReservation(item?: CartItem) {
    const sessionId = getSessionId();

    await fetch("/api/stock-reservations", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wineId: item?.id,
        sessionId,
      }),
    });
  }

  const updateQuantity = async (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cart[index];
    if (!item) return;

    setUpdatingIndex(index);
    setCartMessage("");

    try {
      const result = await reserveQuantity(item, newQuantity);

      setCart((previousCart) =>
        previousCart.map((cartItem, itemIndex) =>
          itemIndex === index
            ? {
                ...cartItem,
                quantity: newQuantity,
                reservation_expires_at: result.expiresAt,
              }
            : cartItem
        )
      );
    } catch (error) {
      setCartMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de la modification de la quantité."
      );
    } finally {
      setUpdatingIndex(null);
    }
  };

  const removeItem = async (index: number) => {
    const item = cart[index];
    if (!item) return;

    setUpdatingIndex(index);
    setCartMessage("");

    try {
      await releaseReservation(item);

      setCart((previousCart) =>
        previousCart.filter((_, itemIndex) => itemIndex !== index)
      );
    } catch (error) {
      setCartMessage("Erreur lors de la suppression de l’article.");
    } finally {
      setUpdatingIndex(null);
    }
  };

  const clearCart = async () => {
    setClearingCart(true);
    setCartMessage("");

    try {
      await releaseReservation();
      setCart([]);
      localStorage.setItem(CART_KEY, JSON.stringify([]));
    } catch (error) {
      setCartMessage("Erreur lors du vidage du panier.");
    } finally {
      setClearingCart(false);
    }
  };

  const checkoutHref = isLoggedIn
    ? "/checkout"
    : "/inscription?redirect=/checkout";

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-4 py-10 text-[#1f1a17]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <a
            href="/boutique/bourgogne"
            className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
          >
            ← Continuer mes achats
          </a>

          <h1 className="mt-4 text-3xl font-serif text-black md:text-5xl">
            Votre panier
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-700 md:text-base">
            Retrouvez ici les vins sélectionnés avant de finaliser votre
            commande.
          </p>

          {cartMessage && (
            <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800">
              {cartMessage}
            </p>
          )}
        </div>

        {!isLoaded ? (
          <div className="rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
            Chargement du panier...
          </div>
        ) : cart.length === 0 ? (
          <div className="rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-black">
              Votre panier est vide
            </h2>

            <p className="mt-3 text-neutral-700">
              Ajoutez un vin depuis la boutique pour commencer votre sélection.
            </p>

            <a
              href="/boutique/bourgogne"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8a6a2f]"
            >
              Retour à la boutique
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
            <section className="space-y-5">
              {cart.map((item, index) => {
                const price = parsePrice(item.price);
                const quantity = Number(item.quantity || 1);
                const lineTotal = price * quantity;
                const isUpdating = updatingIndex === index;
                const reservationTime = formatReservationTime(
                  item.reservation_expires_at
                );

                return (
                  <article
                    key={`${item.id || item.slug || item.name}-${index}`}
                    className="rounded-3xl border border-[#e6dcc8] bg-white p-5 shadow-sm md:p-6"
                  >
                    <div className="flex flex-col gap-5 md:flex-row">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Vin"}
                          className="h-56 w-full rounded-2xl object-cover md:h-40 md:w-32"
                        />
                      ) : (
                        <div className="h-56 w-full rounded-2xl bg-[#efe4d2] md:h-40 md:w-32" />
                      )}

                      <div className="flex-1">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h2 className="font-serif text-2xl text-black">
                              {item.name || "Vin sélectionné"}
                            </h2>

                            <div className="mt-2 space-y-1 text-sm text-neutral-600">
                              {item.producer && <p>{item.producer}</p>}
                              {item.appellation && <p>{item.appellation}</p>}
                              {item.vintage && (
                                <p>Millésime : {item.vintage}</p>
                              )}
                              {item.bottle_size && (
                                <p>Flaconnage : {item.bottle_size}</p>
                              )}
                              {item.packaging && (
                                <p>Caissage : {item.packaging}</p>
                              )}
                            </div>

                            <div className="mt-4 rounded-2xl border border-[#e6dcc8] bg-[#fffaf3] px-4 py-3 text-sm text-neutral-700">
                              <p className="font-medium text-[#8a6a2f]">
                                Réservation temporaire active
                              </p>
                              <p className="mt-1">
                                Stock réservé pendant 30 minutes
                                {reservationTime
                                  ? `, jusqu’à ${reservationTime}.`
                                  : "."}
                              </p>
                            </div>
                          </div>

                          <div className="text-left md:text-right">
                            <p className="text-lg font-semibold text-black">
                              {formatPrice(item.price)}
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                              Prix unitaire HT
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 border-t border-neutral-200 pt-5 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-neutral-600">
                              Quantité
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(index, quantity - 1)
                              }
                              disabled={quantity <= 1 || isUpdating}
                              className="h-9 w-9 rounded-full border border-neutral-300 text-lg hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              −
                            </button>

                            <span className="min-w-8 text-center font-medium">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(index, quantity + 1)
                              }
                              disabled={isUpdating}
                              className="h-9 w-9 rounded-full border border-neutral-300 text-lg hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-5 md:justify-end">
                            <div>
                              <p className="text-sm text-neutral-500">
                                Sous-total HT
                              </p>

                              <p className="font-semibold text-black">
                                {formatPrice(lineTotal)}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              disabled={isUpdating}
                              className="text-sm text-red-700 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isUpdating ? "Mise à jour..." : "Supprimer"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-serif text-black">
                Résumé du panier
              </h2>

              <div className="mt-6 space-y-4 border-b border-neutral-200 pb-5">
                <div className="flex justify-between text-sm">
                  <span>Nombre d’articles</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Sous-total HT</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <p className="text-xs leading-5 text-neutral-500">
                  Les vins placés au panier sont réservés temporairement pendant
                  30 minutes. Les frais de livraison seront confirmés selon la
                  destination, le poids et les conditions de transport.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between text-xl font-semibold">
                <span>Total HT</span>
                <span>{formatPrice(total)}</span>
              </div>

              {!isLoggedIn && (
                <div className="mt-6 rounded-2xl border border-[#e6dcc8] bg-[#fffaf3] p-4 text-sm leading-6 text-neutral-700">
                  Pour finaliser une commande, merci de créer un compte. Vous
                  pourrez ensuite retrouver vos commandes dans votre espace
                  client.
                </div>
              )}

              <a
                href={checkoutHref}
                className="mt-8 flex w-full items-center justify-center rounded-full bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#8a6a2f]"
              >
                {isLoggedIn ? "Procéder au paiement" : "Créer un compte"}
              </a>

              {!isLoggedIn && (
                <a
                  href="/connexion?redirect=/checkout"
                  className="mt-4 flex w-full items-center justify-center rounded-full border border-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:border-[#8a6a2f] hover:text-[#8a6a2f]"
                >
                  J’ai déjà un compte
                </a>
              )}

              <a
                href="/boutique/bourgogne"
                className="mt-4 flex w-full items-center justify-center rounded-full border border-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:border-[#8a6a2f] hover:text-[#8a6a2f]"
              >
                Continuer mes achats
              </a>

              <button
                type="button"
                onClick={clearCart}
                disabled={clearingCart}
                className="mt-4 w-full text-sm text-neutral-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {clearingCart ? "Vidage du panier..." : "Vider le panier"}
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}