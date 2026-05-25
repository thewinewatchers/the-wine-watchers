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
};

const CART_KEY = "cart";

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

export default function PanierClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      localStorage.setItem(CART_KEY, JSON.stringify(foundCart));
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

      const { error } = await supabase.from("abandoned_carts").upsert(
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

      if (error) {
        console.error("Erreur sauvegarde panier abandonné :", error);
      }
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

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((previousCart) =>
      previousCart.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (index: number) => {
    setCart((previousCart) =>
      previousCart.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem(CART_KEY, JSON.stringify([]));
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
                              className="h-9 w-9 rounded-full border border-neutral-300 text-lg hover:border-black"
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
                              className="h-9 w-9 rounded-full border border-neutral-300 text-lg hover:border-black"
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
                              className="text-sm text-red-700 hover:text-red-900"
                            >
                              Supprimer
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
                  Les frais de livraison seront confirmés selon la destination,
                  le poids et les conditions de transport.
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
                className="mt-4 w-full text-sm text-neutral-500 hover:text-red-700"
              >
                Vider le panier
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}