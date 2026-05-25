"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Order = {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: string | null;
  customer_postal_code?: string | null;
  customer_city?: string | null;
  customer_country?: string | null;
  customer_comment?: string | null;
  total_amount: number | string;
  currency: string;
  status: string;
  payment_status: string;
  payment_method?: string | null;
  bank_transfer_reference?: string | null;
  bank_transfer_instructions?: string | null;
  stripe_session_id?: string | null;
  created_at: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  wine_id?: string | null;
  wine_slug?: string | null;
  wine_name: string;
  producer?: string | null;
  appellation?: string | null;
  vintage?: string | null;
  bottle_size?: string | null;
  packaging?: string | null;
  image?: string | null;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
};

function formatPrice(value?: number | string | null) {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function formatDate(value?: string) {
  if (!value) return "";

  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusLabel(status?: string) {
  switch (status) {
    case "pending":
      return "Commande créée";
    case "payment_pending":
      return "Paiement en attente";
    case "bank_transfer_pending":
      return "En attente de virement";
    case "paid":
      return "Payée";
    case "cancelled":
      return "Annulée";
    default:
      return status || "Non défini";
  }
}

function paymentStatusLabel(status?: string) {
  switch (status) {
    case "unpaid":
      return "Non payé";
    case "paid":
      return "Payé";
    case "failed":
      return "Échec paiement";
    default:
      return status || "Non défini";
  }
}

function paymentMethodLabel(method?: string | null) {
  switch (method) {
    case "card":
      return "Carte bancaire";
    case "bank_transfer":
      return "Virement bancaire";
    default:
      return "Non défini";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      setErrorMessage("");

      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (ordersError) {
          throw ordersError;
        }

        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .order("created_at", { ascending: true });

        if (itemsError) {
          throw itemsError;
        }

        setOrders((ordersData || []) as Order[]);
        setItems((itemsData || []) as OrderItem[]);
      } catch (error) {
        console.error("Erreur chargement commandes :", error);
        setErrorMessage(
          "Impossible de charger les commandes. Vérifiez les droits Supabase/RLS."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const itemsByOrderId = useMemo(() => {
    return items.reduce<Record<string, OrderItem[]>>((acc, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = [];
      }

      acc[item.order_id].push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-4 py-10 text-[#1f1a17]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
            >
              ← Retour admin
            </Link>

            <h1 className="mt-4 text-3xl font-serif text-black md:text-5xl">
              Commandes
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-700 md:text-base">
              Retrouvez ici les commandes enregistrées depuis la page checkout,
              avec le mode de paiement choisi par le client.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e6dcc8] bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8a6a2f]">
              Total commandes
            </p>
            <p className="mt-1 text-2xl font-semibold text-black">
              {orders.length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
            Chargement des commandes...
          </div>
        ) : errorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800 shadow-sm">
            {errorMessage}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-black">
              Aucune commande pour le moment
            </h2>
            <p className="mt-3 text-neutral-700">
              Les prochaines commandes apparaîtront ici après validation du
              checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderItems = itemsByOrderId[order.id] || [];
              const isBankTransfer =
                order.payment_method === "bank_transfer";

              return (
                <section
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-[#e6dcc8] bg-white shadow-sm"
                >
                  <div className="border-b border-[#eee2cf] bg-[#fffaf3] p-6">
                    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.9fr_0.8fr]">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#8a6a2f]">
                          Commande
                        </p>

                        <p className="mt-2 break-all font-mono text-sm text-black">
                          {order.id}
                        </p>

                        <h2 className="mt-4 text-2xl font-serif text-black">
                          {order.customer_first_name}{" "}
                          {order.customer_last_name}
                        </h2>

                        <div className="mt-2 space-y-1 text-sm text-neutral-700">
                          <p>{order.customer_email}</p>
                          <p>{order.customer_phone}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#8a6a2f]">
                          Paiement
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                            {paymentMethodLabel(order.payment_method)}
                          </span>

                          <span className="rounded-full border border-[#8a6a2f] px-3 py-1 text-xs font-medium text-[#8a6a2f]">
                            {statusLabel(order.status)}
                          </span>

                          <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700">
                            {paymentStatusLabel(order.payment_status)}
                          </span>
                        </div>

                        <p className="mt-4 text-sm text-neutral-600">
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <div className="lg:text-right">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#8a6a2f]">
                          Montant
                        </p>

                        <p className="mt-2 text-2xl font-semibold text-black">
                          {formatPrice(order.total_amount)}
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                          {orderItems.length} ligne(s)
                        </p>

                        <a
                          href={`/api/orders/${order.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#8a6a2f]"
                        >
                          Télécharger devis PDF
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.2fr]">
                    <div className="space-y-5">
                      <div className="rounded-2xl bg-[#f8f3ea] p-5">
                        <h3 className="font-serif text-xl text-black">
                          Coordonnées livraison
                        </h3>

                        <div className="mt-4 space-y-2 text-sm text-neutral-700">
                          {order.customer_address && (
                            <p>{order.customer_address}</p>
                          )}

                          {(order.customer_postal_code ||
                            order.customer_city) && (
                            <p>
                              {order.customer_postal_code}{" "}
                              {order.customer_city}
                            </p>
                          )}

                          {order.customer_country && (
                            <p>{order.customer_country}</p>
                          )}

                          {order.customer_comment && (
                            <div className="mt-4 rounded-xl bg-white p-4">
                              <p className="text-xs uppercase tracking-[0.18em] text-[#8a6a2f]">
                                Commentaire
                              </p>

                              <p className="mt-2 whitespace-pre-wrap">
                                {order.customer_comment}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {isBankTransfer && (
                        <div className="rounded-2xl border border-[#e6dcc8] bg-[#fffaf3] p-5">
                          <h3 className="font-serif text-xl text-black">
                            Virement bancaire
                          </h3>

                          <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                            <p>
                              Le client a choisi le paiement par virement
                              bancaire.
                            </p>

                            <p>
                              Référence à indiquer :{" "}
                              <strong>
                                {order.bank_transfer_reference || order.id}
                              </strong>
                            </p>

                            {order.bank_transfer_instructions && (
                              <pre className="whitespace-pre-wrap rounded-xl bg-white p-4 text-xs leading-6 text-neutral-700">
                                {order.bank_transfer_instructions}
                              </pre>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-serif text-xl text-black">
                        Vins commandés
                      </h3>

                      <div className="mt-4 space-y-4">
                        {orderItems.length === 0 ? (
                          <p className="text-sm text-neutral-600">
                            Aucune ligne de commande trouvée.
                          </p>
                        ) : (
                          orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-4 rounded-2xl border border-[#eee2cf] p-4"
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.wine_name}
                                  className="h-24 w-20 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="h-24 w-20 rounded-xl bg-[#f0e7d8]" />
                              )}

                              <div className="flex-1">
                                <h4 className="font-serif text-lg text-black">
                                  {item.wine_name}
                                </h4>

                                <div className="mt-1 space-y-1 text-sm text-neutral-600">
                                  {item.producer && (
                                    <p>{item.producer}</p>
                                  )}

                                  {item.appellation && (
                                    <p>{item.appellation}</p>
                                  )}

                                  {item.vintage && (
                                    <p>
                                      Millésime : {item.vintage}
                                    </p>
                                  )}

                                  {item.bottle_size && (
                                    <p>
                                      Flaconnage : {item.bottle_size}
                                    </p>
                                  )}

                                  {item.packaging && (
                                    <p>
                                      Caissage : {item.packaging}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-3 flex flex-wrap justify-between gap-3 text-sm">
                                  <span>
                                    Qté : {item.quantity}
                                  </span>

                                  <span>
                                    Prix unitaire :{" "}
                                    {formatPrice(item.unit_price)}
                                  </span>

                                  <span className="font-semibold text-black">
                                    Total :{" "}
                                    {formatPrice(item.total_price)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}