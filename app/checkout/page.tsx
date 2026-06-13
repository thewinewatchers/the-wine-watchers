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

type CustomerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  vatNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  comment: string;
};

type PaymentMethod = "card" | "bank_transfer";
type DeliveryMethod = "pickup" | "delivery";

const CART_KEY = "cart";

const VAT_RATES: Record<string, number> = {
  AT: 20,
  BE: 21,
  BG: 20,
  CY: 19,
  CZ: 21,
  DE: 19,
  DK: 25,
  EE: 24,
  EL: 24,
  ES: 21,
  FI: 25.5,
  FR: 20,
  HR: 25,
  HU: 27,
  IE: 23,
  IT: 22,
  LT: 21,
  LU: 17,
  LV: 21,
  MT: 18,
  NL: 21,
  PL: 23,
  PT: 23,
  RO: 19,
  SE: 25,
  SI: 22,
  SK: 23,
  CH: 8.1,
};

const EU_COUNTRIES = [
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "EL",
  "ES",
  "FI",
  "FR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
];

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

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatPrice(value?: string | number) {
  const price = parsePrice(value);

  return price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function getCountryCode(country?: string) {
  if (!country) return "ES";

  const trimmed = country.trim();

  if (trimmed.length === 2) return trimmed.toUpperCase();

  return COUNTRY_NAME_TO_CODE[trimmed] || "ES";
}

function calculateVat({
  totalExclVat,
  countryCode,
  companyName,
  vatNumber,
}: {
  totalExclVat: number;
  countryCode: string;
  companyName?: string;
  vatNumber?: string;
}) {
  const vatRate = VAT_RATES[countryCode] ?? VAT_RATES["ES"];

  const isProfessional =
    Boolean(companyName?.trim()) && Boolean(vatNumber?.trim());

  const reverseCharge =
    isProfessional &&
    countryCode !== "ES" &&
    EU_COUNTRIES.includes(countryCode);

  if (reverseCharge) {
    return {
      vatRate: 0,
      vatAmount: 0,
      totalExclVat: roundMoney(totalExclVat),
      totalInclVat: roundMoney(totalExclVat),
      reverseCharge: true,
      vatNote:
        "TVA intracommunautaire non facturée — autoliquidation par le client professionnel.",
    };
  }

  const vatAmount = roundMoney(totalExclVat * (vatRate / 100));
  const totalInclVat = roundMoney(totalExclVat + vatAmount);

  return {
    vatRate,
    vatAmount,
    totalExclVat: roundMoney(totalExclVat),
    totalInclVat,
    reverseCharge: false,
    vatNote: `TVA ${vatRate}% ajoutée au prix HT.`,
  };
}

function BankInstructionsBlock({
  instructions,
}: {
  instructions: string | null;
}) {
  if (!instructions) return null;

  return (
    <div className="mt-4 rounded-xl bg-white p-4 text-sm leading-7 text-neutral-700">
      {instructions.split("\n").map((line, index) => {
        const [label, ...rest] = line.split(":");
        const value = rest.join(":").trim();

        const shouldBold =
          line.startsWith("Référence à indiquer") ||
          line.startsWith("Titulaire du compte") ||
          line.startsWith("Banque") ||
          line.startsWith("IBAN") ||
          line.startsWith("SWIFT/BIC") ||
          line.startsWith("Adresse banque") ||
          line.startsWith("Pays");

        if (!line.trim()) return <br key={index} />;

        if (shouldBold) {
          return (
            <p key={index}>
              <strong>{label} :</strong> {value}
            </p>
          );
        }

        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [successPaymentMethod, setSuccessPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const [bankInstructions, setBankInstructions] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("bank_transfer");

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("pickup");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isAdult, setIsAdult] = useState(false);

  const [form, setForm] = useState<CustomerForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    vatNumber: "",
    address: "",
    postalCode: "",
    city: "",
    country: "Espagne",
    comment: "",
  });

  useEffect(() => {
    async function loadCheckout() {
      try {
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
          setIsLoggedIn(false);
          setIsLoaded(true);
          return;
        }

        setIsLoggedIn(true);

        const metadata = data.user.user_metadata || {};
        const storedCart = localStorage.getItem(CART_KEY);

        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);

          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          }
        }

        setForm((previous) => ({
          ...previous,
          email: data.user?.email || "",
          companyName: metadata.company_name || "",
          vatNumber: metadata.vat_number || "",
          firstName: metadata.first_name || previous.firstName,
          lastName: metadata.last_name || previous.lastName,
          phone: metadata.phone || previous.phone,
          address: metadata.address || previous.address,
          postalCode: metadata.postal_code || previous.postalCode,
          city: metadata.city || previous.city,
          country: metadata.country || previous.country,
        }));
      } catch (error) {
        console.error("Erreur lecture checkout :", error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadCheckout();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = parsePrice(item.price);
      const quantity = Number(item.quantity || 1);

      return sum + price * quantity;
    }, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + Number(item.quantity || 1);
    }, 0);
  }, [cart]);

  const deliveryFee = 0;

  const deliveryNote =
    deliveryMethod === "pickup"
      ? "Retrait gratuit à l’entrepôt."
      : "Les frais de livraison seront confirmés selon la destination, le poids et les conditions de transport.";

  const vatCalculation = useMemo(() => {
    return calculateVat({
      totalExclVat: total,
      countryCode: getCountryCode(form.country),
      companyName: form.companyName,
      vatNumber: form.vatNumber,
    });
  }, [total, form.country, form.companyName, form.vatNumber]);

  const totalToPay = vatCalculation.totalInclVat + deliveryFee;

  const removeItem = (index: number) => {
    setCart((previousCart) =>
      previousCart.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem(CART_KEY, JSON.stringify([]));
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessOrderId(null);
    setSuccessPaymentMethod(null);
    setBankInstructions(null);

    const { data: userData } = await supabase.auth.getUser();
    const { data: sessionData } = await supabase.auth.getSession();

    if (!userData.user || !sessionData.session?.access_token) {
      setErrorMessage(
        "Vous devez créer un compte ou vous connecter avant de valider une commande."
      );

      setIsLoggedIn(false);
      return;
    }

    if (cart.length === 0) {
      setErrorMessage("Votre panier est vide.");
      return;
    }

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.postalCode ||
      !form.city ||
      !form.country
    ) {
      setErrorMessage("Merci de compléter tous les champs obligatoires.");
      return;
    }

    if (!acceptedTerms || !isAdult) {
      setErrorMessage(
        "Vous devez accepter les conditions et confirmer être majeur."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },

        body: JSON.stringify({
          customer: form,
          cart,
          paymentMethod,
          deliveryMethod,
          deliveryFee,
          deliveryNote,
          vat: vatCalculation,
          totalToPay,
          sessionId: localStorage.getItem("wine_watchers_session_id"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result?.error || "Erreur lors de la création de la commande."
        );

        return;
      }

      if (!result?.orderId) {
        setErrorMessage("Commande créée mais numéro introuvable.");
        return;
      }

      if (paymentMethod === "card") {
        const stripeResponse = await fetch(
          "/api/stripe/create-checkout-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: result.orderId,
              items: cart,
              totalToPay,
              customerEmail: form.email,
            }),
          }
        );

        const stripeResult = await stripeResponse.json();

        if (!stripeResponse.ok || !stripeResult?.url) {
          setErrorMessage(
            stripeResult?.error ||
              "Erreur lors de la création du paiement Stripe."
          );

          return;
        }

        localStorage.setItem(CART_KEY, JSON.stringify([]));
        setCart([]);

        window.location.href = stripeResult.url;
        return;
      }

      setSuccessOrderId(result.orderId);
      setSuccessPaymentMethod(paymentMethod);

      if (paymentMethod === "bank_transfer") {
        setBankInstructions(result.bankTransferInstructions || null);
      }

      localStorage.setItem(CART_KEY, JSON.stringify([]));
      setCart([]);
    } catch (error) {
      console.error("Erreur création commande :", error);

      setErrorMessage("Erreur serveur lors de la création de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#f8f3ea] px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p>Chargement du checkout...</p>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#f8f3ea] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-serif text-black">
            Connexion obligatoire
          </h1>

          <p className="mt-4 text-neutral-700">
            Vous devez créer un compte ou vous connecter avant de pouvoir
            commander.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/connexion?redirect=/checkout"
              className="rounded-full bg-black px-6 py-3 text-center text-sm uppercase tracking-[0.2em] text-white hover:bg-[#8a6a2f]"
            >
              Se connecter
            </a>

            <a
              href="/inscription?redirect=/checkout"
              className="rounded-full border border-black px-6 py-3 text-center text-sm uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white"
            >
              Créer un compte
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-4 py-10 text-[#1f1a17]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <a
            href="/panier"
            className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
          >
            ← Retour au panier
          </a>

          <h1 className="mt-4 text-3xl font-serif text-black md:text-5xl">
            Finaliser votre commande
          </h1>
        </div>

        {successOrderId && (
          <div className="mb-8 rounded-3xl border border-green-200 bg-green-50 p-6 text-green-900">
            <h2 className="text-2xl font-serif">Commande enregistrée</h2>

            <p className="mt-3">
              Référence commande : <strong>{successOrderId}</strong>
            </p>

            {successPaymentMethod === "bank_transfer" && (
              <BankInstructionsBlock instructions={bankInstructions} />
            )}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8"
          >
            <h2 className="mb-6 text-2xl font-serif">Informations client</h2>

            {errorMessage && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Prénom *"
                className="rounded-xl border border-neutral-300 px-4 py-3"
              />

              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Nom *"
                className="rounded-xl border border-neutral-300 px-4 py-3"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email *"
                className="rounded-xl border border-neutral-300 px-4 py-3"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Téléphone *"
                className="rounded-xl border border-neutral-300 px-4 py-3"
              />

              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Société"
                className="rounded-xl border border-neutral-300 px-4 py-3"
              />

              <input
                name="vatNumber"
                value={form.vatNumber}
                onChange={handleChange}
                placeholder="N° TVA"
                className="rounded-xl border border-neutral-300 px-4 py-3"
              />

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Adresse *"
                className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
              />

              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="Code postal *"
                className="rounded-xl border border-neutral-300 px-4 py-3"
              />

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Ville *"
                className="rounded-xl border border-neutral-300 px-4 py-3"
              />

              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
              >
                <option value="Espagne">Espagne</option>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Suisse">Suisse</option>
                <option value="Italie">Italie</option>
                <option value="Allemagne">Allemagne</option>
                <option value="Autre">Autre</option>
              </select>

              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                rows={4}
                placeholder="Commentaire"
                className="rounded-xl border border-neutral-300 px-4 py-3 md:col-span-2"
              />
            </div>

            <div className="mt-8 rounded-3xl border border-[#e6dcc8] bg-[#fffaf3] p-6">
              <h2 className="text-2xl font-serif">Retrait / livraison</h2>

              <div className="mt-5 space-y-4">
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 hover:border-[#8a6a2f]">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                    className="mt-1"
                  />

                  <span>
                    <span className="block font-medium">
                      Pas de livraison — retrait gratuit à l’entrepôt
                    </span>
                    <span className="mt-1 block text-sm text-neutral-600">
                      Aucun frais de livraison ajouté à la commande.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 hover:border-[#8a6a2f]">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="delivery"
                    checked={deliveryMethod === "delivery"}
                    onChange={() => setDeliveryMethod("delivery")}
                    className="mt-1"
                  />

                  <span>
                    <span className="block font-medium">Livraison</span>
                    <span className="mt-1 block text-sm text-neutral-600">
                      Les frais de livraison seront confirmés selon la
                      destination, le poids et les conditions de transport.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-[#e6dcc8] bg-[#fffaf3] p-6">
              <h2 className="text-2xl font-serif">TVA & facturation</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total HT vins</span>
                  <strong>{formatPrice(vatCalculation.totalExclVat)}</strong>
                </div>

                <div className="flex justify-between">
                  <span>
                    TVA
                    {vatCalculation.vatRate > 0
                      ? ` (${vatCalculation.vatRate}%)`
                      : ""}
                  </span>
                  <strong>{formatPrice(vatCalculation.vatAmount)}</strong>
                </div>

                <div className="flex justify-between">
                  <span>
                    {deliveryMethod === "pickup"
                      ? "Retrait entrepôt"
                      : "Livraison"}
                  </span>
                  <strong>
                    {deliveryMethod === "pickup" ? "Gratuit" : "À confirmer"}
                  </strong>
                </div>

                <div className="flex justify-between border-t border-[#e6dcc8] pt-3 text-base">
                  <span>Total TTC à payer</span>
                  <strong>{formatPrice(totalToPay)}</strong>
                </div>

                <div className="rounded-2xl bg-white p-4 text-xs leading-6 text-neutral-600">
                  {vatCalculation.vatNote}
                  <br />
                  {deliveryNote}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-6">
              <h2 className="text-2xl font-serif">Mode de paiement</h2>

              <div className="mt-5 space-y-4">
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 p-4 hover:border-[#8a6a2f]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="mt-1"
                  />

                  <span>
                    <span className="block font-medium">Virement bancaire</span>
                    <span className="mt-1 block text-sm text-neutral-600">
                      Votre commande sera confirmée après réception du paiement.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 p-4 hover:border-[#8a6a2f]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mt-1"
                  />

                  <span>
                    <span className="block font-medium">
                      Carte bancaire Stripe
                    </span>
                    <span className="mt-1 block text-sm text-neutral-600">
                      Paiement sécurisé par carte via Stripe.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-sm">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                />
                <span>J’accepte les Conditions Générales.</span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isAdult}
                  onChange={(event) => setIsAdult(event.target.checked)}
                />
                <span>Je confirme avoir plus de 18 ans.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="mt-8 w-full rounded-full bg-black px-6 py-4 text-sm uppercase tracking-[0.25em] text-white hover:bg-[#8a6a2f] disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {isSubmitting
                ? "Validation en cours..."
                : paymentMethod === "card"
                ? "Payer par carte"
                : "Valider la commande"}
            </button>
          </form>

          <aside className="h-fit rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-2xl font-serif">Résumé de commande</h2>

            <div className="space-y-5">
              {cart.length === 0 && (
                <div className="rounded-2xl bg-[#f8f3ea] p-4 text-sm">
                  Votre panier est vide.
                </div>
              )}

              {cart.map((item, index) => {
                const price = parsePrice(item.price);
                const quantity = Number(item.quantity || 1);
                const lineTotal = price * quantity;

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="border-b border-neutral-200 pb-5"
                  >
                    <div className="flex gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Vin"}
                          className="h-24 w-20 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="h-24 w-20 rounded-xl bg-[#f0e7d8]" />
                      )}

                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-black">
                          {item.name}
                        </h3>

                        <div className="mt-1 text-xs text-neutral-600">
                          {item.vintage && <span>{item.vintage}</span>}
                          {item.bottle_size && (
                            <span> · {item.bottle_size}</span>
                          )}
                          {item.packaging && <span> · {item.packaging}</span>}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span>
                            {quantity} × {formatPrice(item.price)} HT
                          </span>

                          <strong>{formatPrice(lineTotal)} HT</strong>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="mt-3 text-sm text-red-700 hover:text-red-900"
                        >
                          Supprimer ce vin
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="border-t border-neutral-300 pt-5">
                <div className="flex justify-between text-sm">
                  <span>Nombre d’articles</span>
                  <span>{totalItems}</span>
                </div>

                <div className="mt-4 flex justify-between text-sm">
                  <span>Total HT vins</span>
                  <strong>{formatPrice(vatCalculation.totalExclVat)}</strong>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span>
                    TVA
                    {vatCalculation.vatRate > 0
                      ? ` (${vatCalculation.vatRate}%)`
                      : ""}
                  </span>
                  <strong>{formatPrice(vatCalculation.vatAmount)}</strong>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span>
                    {deliveryMethod === "pickup"
                      ? "Retrait entrepôt"
                      : "Livraison"}
                  </span>
                  <strong>
                    {deliveryMethod === "pickup" ? "Gratuit" : "À confirmer"}
                  </strong>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-300 pt-4 text-lg font-semibold">
                  <span>Total TTC à payer</span>
                  <span>{formatPrice(totalToPay)}</span>
                </div>

                <div className="mt-4 rounded-2xl bg-[#f8f3ea] p-4 text-xs leading-6 text-neutral-600">
                  {deliveryNote}
                </div>

                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-5 w-full rounded-full border border-red-300 px-5 py-3 text-sm text-red-700 hover:bg-red-50"
                  >
                    Vider le panier
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}