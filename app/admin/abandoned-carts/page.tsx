"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AbandonedCart = {
  id: string;
  user_id: string;
  customer_email: string;
  cart: any[];
  total_amount: number;
  status: string;
  last_activity_at: string;
  created_at: string;
};

function formatPrice(value: number) {
  return Number(value || 0).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-FR");
}

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCarts() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/admin/login";
        return;
      }

      const { data, error } = await supabase
        .from("abandoned_carts")
        .select("*")
        .eq("status", "open")
        .order("last_activity_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setCarts((data || []) as AbandonedCart[]);
      }

      setLoading(false);
    }

    loadCarts();
  }, []);

  async function sendReminder(cart: AbandonedCart) {
    setErrorMessage("");
    setSuccessMessage("");
    setSendingId(cart.id);

    const response = await fetch("/api/send-abandoned-cart-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: cart.customer_email,
        cartId: cart.id,
      }),
    });

    setSendingId(null);

    if (!response.ok) {
      setErrorMessage("L’email n’a pas pu être envoyé.");
      return;
    }

    setSuccessMessage(`Email envoyé à ${cart.customer_email}`);
  }

  async function deleteCart(cartId: string) {
    const confirmed = window.confirm("Supprimer ce panier abandonné ?");

    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");
    setDeletingId(cartId);

    const { error } = await supabase
      .from("abandoned_carts")
      .delete()
      .eq("id", cartId);

    setDeletingId(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setCarts((currentCarts) =>
      currentCarts.filter((cart) => cart.id !== cartId)
    );

    setSuccessMessage("Panier supprimé.");
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-10 text-[#1f1a17]">
      <div className="mx-auto max-w-7xl">
        <a
          href="/admin"
          className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
        >
          ← Retour admin
        </a>

        <h1 className="mt-6 font-serif text-4xl text-black md:text-5xl">
          Paniers abandonnés
        </h1>

        <p className="mt-4 max-w-3xl text-neutral-700">
          Liste des clients connectés ayant laissé un panier ouvert sans finaliser
          leur commande.
        </p>

        {successMessage && (
          <div className="mt-8 rounded-3xl border border-green-200 bg-green-50 p-5 text-green-700">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
            Chargement des paniers...
          </div>
        ) : errorMessage ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
            {errorMessage}
          </div>
        ) : carts.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
            Aucun panier abandonné pour le moment.
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {carts.map((cart) => (
              <article
                key={cart.id}
                className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-serif text-black">
                      {cart.customer_email || "Client sans email"}
                    </h2>

                    <p className="mt-2 text-sm text-neutral-600">
                      Dernière activité : {formatDate(cart.last_activity_at)}
                    </p>

                    <p className="mt-1 text-sm text-neutral-600">
                      Créé le : {formatDate(cart.created_at)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f8f3ea] px-5 py-4 text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8a6a2f]">
                      Total panier
                    </p>
                    <p className="mt-2 text-xl font-semibold text-black">
                      {formatPrice(cart.total_amount)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 border-t border-neutral-200 pt-5">
                  {Array.isArray(cart.cart) &&
                    cart.cart.map((item, index) => (
                      <div
                        key={`${item.id || item.slug || item.name}-${index}`}
                        className="flex gap-4 rounded-2xl bg-[#fffaf3] p-4"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Vin"}
                            className="h-24 w-20 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-24 w-20 rounded-xl bg-[#efe4d2]" />
                        )}

                        <div className="flex-1">
                          <h3 className="font-serif text-lg text-black">
                            {item.name || "Vin sélectionné"}
                          </h3>

                          <div className="mt-1 text-sm leading-6 text-neutral-600">
                            {item.producer && <p>{item.producer}</p>}
                            {item.appellation && <p>{item.appellation}</p>}
                            {item.vintage && <p>Millésime : {item.vintage}</p>}
                            {item.bottle_size && (
                              <p>Flaconnage : {item.bottle_size}</p>
                            )}
                            {item.packaging && <p>Caissage : {item.packaging}</p>}
                            <p>Quantité : {Number(item.quantity || 1)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => sendReminder(cart)}
                    disabled={sendingId === cart.id}
                    className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#8a6a2f] disabled:opacity-60"
                  >
                    {sendingId === cart.id ? "Envoi..." : "Relancer par email"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCart(cart.id)}
                    disabled={deletingId === cart.id}
                    className="rounded-full bg-red-700 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-900 disabled:opacity-60"
                  >
                    {deletingId === cart.id ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}