"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  first_name: string;
  last_name: string;
  phone: string;
  company_name: string;
  vat_number: string;
  billing_address: string;
  billing_postal_code: string;
  billing_city: string;
  billing_country: string;
  delivery_address: string;
  delivery_postal_code: string;
  delivery_city: string;
  delivery_country: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  wine_name: string;
  producer?: string | null;
  appellation?: string | null;
  vintage?: string | null;
  bottle_size?: string | null;
  packaging?: string | null;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
};

type WishlistItem = {
  id: string;
  wine_id: string;
  created_at: string;
  wines?: {
    id: string;
    slug?: string | null;
    name?: string | null;
    producer?: string | null;
    appellation?: string | null;
    vintage?: string | number | null;
    price?: string | number | null;
    image?: string | null;
    bottle_size?: string | null;
    packaging?: string | null;
  } | null;
};

function formatPrice(value?: number | string | null) {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function paymentMethodLabel(method?: string | null) {
  switch (method) {
    case "bank_transfer":
      return "Virement bancaire";
    case "card":
      return "Carte bancaire";
    default:
      return "Non défini";
  }
}

function paymentStatusLabel(status?: string | null) {
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

function getOrderTotalTtc(order: any) {
  return order.total_incl_vat || order.total_amount || 0;
}

function getWineHref(item: WishlistItem) {
  const wine = item.wines;
  return `/boutique/vin/${wine?.slug || wine?.id || item.wine_id}`;
}

export default function MonComptePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    phone: "",
    company_name: "",
    vat_number: "",
    billing_address: "",
    billing_postal_code: "",
    billing_city: "",
    billing_country: "",
    delivery_address: "",
    delivery_postal_code: "",
    delivery_city: "",
    delivery_country: "",
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingWishlistId, setRemovingWishlistId] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");

  const inputClass =
    "rounded border border-neutral-300 bg-white p-3 text-neutral-900 placeholder:text-neutral-500";

  const inputLargeClass =
    "rounded border border-neutral-300 bg-white p-3 text-neutral-900 placeholder:text-neutral-500 md:col-span-2";

  useEffect(() => {
    loadAccount();
  }, []);

  const itemsByOrderId = useMemo(() => {
    return orderItems.reduce<Record<string, OrderItem[]>>((acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];
      acc[item.order_id].push(item);
      return acc;
    }, {});
  }, [orderItems]);

  async function loadAccount() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/connexion";
      return;
    }

    setUser(userData.user);

    const metadata = userData.user.user_metadata || {};

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (profileData) {
      setProfile({
        first_name: profileData.first_name || metadata.first_name || "",
        last_name: profileData.last_name || metadata.last_name || "",
        phone: profileData.phone || metadata.phone || "",
        company_name: profileData.company_name || metadata.company_name || "",
        vat_number: profileData.vat_number || metadata.vat_number || "",
        billing_address:
          profileData.billing_address ||
          metadata.billing_address ||
          metadata.address ||
          "",
        billing_postal_code:
          profileData.billing_postal_code ||
          metadata.billing_postal_code ||
          metadata.postal_code ||
          "",
        billing_city:
          profileData.billing_city || metadata.billing_city || metadata.city || "",
        billing_country:
          profileData.billing_country ||
          metadata.billing_country ||
          metadata.country ||
          "",
        delivery_address:
          profileData.delivery_address || metadata.delivery_address || "",
        delivery_postal_code:
          profileData.delivery_postal_code ||
          metadata.delivery_postal_code ||
          "",
        delivery_city:
          profileData.delivery_city || metadata.delivery_city || "",
        delivery_country:
          profileData.delivery_country || metadata.delivery_country || "",
      });
    }

    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    const loadedOrders = ordersData || [];
    setOrders(loadedOrders);

    if (loadedOrders.length > 0) {
      const orderIds = loadedOrders.map((order) => order.id);

      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds)
        .order("created_at", { ascending: true });

      setOrderItems((itemsData || []) as OrderItem[]);
    } else {
      setOrderItems([]);
    }

    const { data: wishlistData, error: wishlistError } = await supabase
      .from("wishlist_items")
      .select(
        `
        id,
        wine_id,
        created_at,
        wines (
          id,
          slug,
          name,
          producer,
          appellation,
          vintage,
          price,
          image,
          bottle_size,
          packaging
        )
      `
      )
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (wishlistError) {
      console.error("Erreur chargement wishlist :", wishlistError);
      setWishlistItems([]);
    } else {
      setWishlistItems((wishlistData || []) as WishlistItem[]);
    }

    setLoading(false);
  }

  function updateProfile(field: keyof Profile, value: string) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  }
  async function saveProfile() {
    if (!user) return;

    setSaving(true);
    setMessage("");

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        company_name: profile.company_name,
        vat_number: profile.vat_number,
        billing_address: profile.billing_address,
        billing_postal_code: profile.billing_postal_code,
        billing_city: profile.billing_city,
        billing_country: profile.billing_country,
        delivery_address: profile.delivery_address,
        delivery_postal_code: profile.delivery_postal_code,
        delivery_city: profile.delivery_city,
        delivery_country: profile.delivery_country,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (profileError) {
      setMessage(`Erreur profil : ${profileError.message || "erreur inconnue"}`);
      setSaving(false);
      return;
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        company_name: profile.company_name,
        vat_number: profile.vat_number,
        address: profile.billing_address,
        postal_code: profile.billing_postal_code,
        city: profile.billing_city,
        country: profile.billing_country,
        billing_address: profile.billing_address,
        billing_postal_code: profile.billing_postal_code,
        billing_city: profile.billing_city,
        billing_country: profile.billing_country,
        delivery_address: profile.delivery_address,
        delivery_postal_code: profile.delivery_postal_code,
        delivery_city: profile.delivery_city,
        delivery_country: profile.delivery_country,
      },
    });

    if (authError) {
      setMessage(
        `Erreur compte utilisateur : ${authError.message || "erreur inconnue"}`
      );
      setSaving(false);
      return;
    }

    setMessage("Informations enregistrées avec succès.");
    setSaving(false);
  }

  async function removeFromWishlist(wishlistId: string) {
    setRemovingWishlistId(wishlistId);
    setWishlistMessage("");

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("id", wishlistId);

    if (error) {
      console.error("Erreur suppression wishlist :", error);
      setWishlistMessage("Impossible de retirer ce vin de votre wishlist.");
      setRemovingWishlistId(null);
      return;
    }

    setWishlistItems((previous) =>
      previous.filter((item) => item.id !== wishlistId)
    );

    setWishlistMessage("Vin retiré de votre wishlist.");
    setRemovingWishlistId(null);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] px-6 py-12">
        <p className="text-center text-neutral-700">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-4xl font-serif text-[#2b1b16]">
          Mon compte
        </h1>

        <section className="mb-10 rounded-2xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-serif text-[#2b1b16]">
            Mes informations
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input value={profile.first_name} onChange={(e) => updateProfile("first_name", e.target.value)} placeholder="Prénom" className={inputClass} />
            <input value={profile.last_name} onChange={(e) => updateProfile("last_name", e.target.value)} placeholder="Nom" className={inputClass} />
            <input value={user?.email || ""} disabled className="rounded border border-neutral-300 bg-neutral-100 p-3 text-neutral-700" />
            <input value={profile.phone} onChange={(e) => updateProfile("phone", e.target.value)} placeholder="Téléphone" className={inputClass} />
            <input value={profile.company_name} onChange={(e) => updateProfile("company_name", e.target.value)} placeholder="Société" className={inputClass} />
            <input value={profile.vat_number} onChange={(e) => updateProfile("vat_number", e.target.value)} placeholder="N° TVA" className={inputClass} />
          </div>

          <h3 className="mt-8 mb-4 text-xl font-semibold text-[#2b1b16]">
            Adresse de facturation
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input value={profile.billing_address} onChange={(e) => updateProfile("billing_address", e.target.value)} placeholder="Adresse" className={inputLargeClass} />
            <input value={profile.billing_postal_code} onChange={(e) => updateProfile("billing_postal_code", e.target.value)} placeholder="Code postal" className={inputClass} />
            <input value={profile.billing_city} onChange={(e) => updateProfile("billing_city", e.target.value)} placeholder="Ville" className={inputClass} />
            <input value={profile.billing_country} onChange={(e) => updateProfile("billing_country", e.target.value)} placeholder="Pays" className={inputClass} />
          </div>

          <h3 className="mt-8 mb-4 text-xl font-semibold text-[#2b1b16]">
            Adresse de livraison
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input value={profile.delivery_address} onChange={(e) => updateProfile("delivery_address", e.target.value)} placeholder="Adresse" className={inputLargeClass} />
            <input value={profile.delivery_postal_code} onChange={(e) => updateProfile("delivery_postal_code", e.target.value)} placeholder="Code postal" className={inputClass} />
            <input value={profile.delivery_city} onChange={(e) => updateProfile("delivery_city", e.target.value)} placeholder="Ville" className={inputClass} />
            <input value={profile.delivery_country} onChange={(e) => updateProfile("delivery_country", e.target.value)} placeholder="Pays" className={inputClass} />
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="mt-8 rounded-full bg-[#8B1E2D] px-6 py-3 text-white transition hover:bg-[#6f1824] disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer mes informations"}
          </button>

          {message && <p className="mt-4 text-sm text-neutral-700">{message}</p>}
        </section>

        <section id="wishlist" className="mb-10 rounded-2xl bg-white p-8 shadow">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#8B1E2D]">
                Sélection personnelle
              </p>
              <h2 className="mt-2 text-2xl font-serif text-[#2b1b16]">
                Ma wishlist
              </h2>
            </div>

            <p className="text-sm text-neutral-600">
              {wishlistItems.length} vin{wishlistItems.length > 1 ? "s" : ""} favori{wishlistItems.length > 1 ? "s" : ""}
            </p>
          </div>

          {wishlistMessage && (
            <p className="mb-4 rounded-xl bg-[#f8f5ef] p-3 text-sm text-neutral-700">
              {wishlistMessage}
            </p>
          )}

          {wishlistItems.length === 0 ? (
            <p className="text-neutral-600">
              Votre wishlist est vide pour le moment.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {wishlistItems.map((item) => {
                const wine = item.wines;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-neutral-200 bg-[#fffaf8] p-4"
                  >
                    <div className="flex gap-4">
                      {wine?.image ? (
                        <img
                          src={wine.image}
                          alt={wine.name || "Vin"}
                          className="h-24 w-20 rounded-lg object-contain bg-white"
                        />
                      ) : (
                        <div className="flex h-24 w-20 items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-500">
                          Image
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-[#2b1b16]">
                          {wine?.name || "Vin"}
                        </h3>

                        <div className="mt-1 text-sm text-neutral-600">
                          {wine?.producer && <p>{wine.producer}</p>}
                          {wine?.appellation && <p>{wine.appellation}</p>}
                          {wine?.vintage && <p>Millésime : {wine.vintage}</p>}
                          {wine?.bottle_size && <p>Flaconnage : {wine.bottle_size}</p>}
                          {wine?.packaging && <p>Caissage : {wine.packaging}</p>}
                        </div>

                        <p className="mt-2 text-sm font-semibold text-[#8B1E2D]">
                          {wine?.price ? formatPrice(wine.price) : "Prix sur demande"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={getWineHref(item)}
                        className="rounded-full bg-[#8B1E2D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#6f1824]"
                      >
                        Voir le vin
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        disabled={removingWishlistId === item.id}
                        className="rounded-full border border-[#8B1E2D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8B1E2D] transition hover:bg-[#8B1E2D] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {removingWishlistId === item.id
                          ? "Suppression..."
                          : "Retirer"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-serif text-[#2b1b16]">
            Mes commandes
          </h2>

          {orders.length === 0 ? (
            <p className="text-neutral-600">Aucune commande pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isOpen = openOrderId === order.id;
                const items = itemsByOrderId[order.id] || [];
                const orderTotalTtc = getOrderTotalTtc(order);

                return (
                  <div key={order.id} className="rounded-xl border border-neutral-200 p-4">
                    <p className="break-all font-semibold text-[#2b1b16]">
                      Commande #{order.id}
                    </p>

                    <p className="mt-2 text-sm text-neutral-600">
                      Date :{" "}
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("fr-FR")
                        : "-"}
                    </p>

                    <p className="text-sm text-neutral-600">
                      Paiement : {paymentMethodLabel(order.payment_method)}
                    </p>

                    <p className="text-sm text-neutral-600">
                      Statut : {paymentStatusLabel(order.payment_status || order.status)}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-neutral-800">
                      Total TTC : {formatPrice(orderTotalTtc)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                        className="rounded-full border border-[#8B1E2D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8B1E2D] transition hover:bg-[#8B1E2D] hover:text-white"
                      >
                        {isOpen ? "Masquer ma commande" : "Voir ma commande"}
                      </button>

                      <a
                        href={`/api/orders/${order.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full bg-[#8B1E2D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#6f1824]"
                      >
                        Télécharger ma facture
                      </a>
                    </div>

                    {isOpen && (
                      <div className="mt-5 rounded-xl bg-[#f8f5ef] p-4">
                        <h3 className="mb-3 font-serif text-xl text-[#2b1b16]">
                          Détail de la commande
                        </h3>

                        {items.length === 0 ? (
                          <p className="text-sm text-neutral-600">
                            Aucun détail disponible pour cette commande.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="rounded-lg border border-neutral-200 bg-white p-3"
                              >
                                <p className="font-semibold text-[#2b1b16]">
                                  {item.wine_name}
                                </p>

                                <div className="mt-1 text-sm text-neutral-600">
                                  {item.producer && <p>{item.producer}</p>}
                                  {item.appellation && <p>{item.appellation}</p>}
                                  {item.vintage && <p>Millésime : {item.vintage}</p>}
                                  {item.bottle_size && <p>Flaconnage : {item.bottle_size}</p>}
                                  {item.packaging && <p>Caissage : {item.packaging}</p>}
                                </div>

                                <p className="mt-2 text-sm text-neutral-700">
                                  Quantité : {item.quantity} — Prix unitaire HT :{" "}
                                  {formatPrice(item.unit_price)} — Prix total TTC :{" "}
                                  {formatPrice(orderTotalTtc)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}