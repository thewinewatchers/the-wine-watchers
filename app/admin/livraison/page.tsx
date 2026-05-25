"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ShippingRate = {
  id: string;
  country_code: string;
  country_name: string;
  min_weight_kg: number;
  max_weight_kg: number;
  price_excl_vat: number;
  carrier: string | null;
  active: boolean;
};

function formatPrice(value: number) {
  return Number(value || 0).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export default function AdminLivraisonPage() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRates() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("country_code", { ascending: true })
        .order("min_weight_kg", { ascending: true });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setRates((data || []) as ShippingRate[]);
      setLoading(false);
    }

    loadRates();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-6xl">
        <a
          href="/admin"
          className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
        >
          ← Retour admin
        </a>

        <h1 className="mt-6 text-4xl font-serif text-black">
          Tarifs de livraison
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-700">
          Consultation des tarifs de livraison par pays, transporteur et tranche
          de poids. Les montants sont exprimés hors TVA.
        </p>

        {loading && (
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
            Chargement des tarifs...
          </div>
        )}

        {errorMessage && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
            Erreur : {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && (
          <div className="mt-8 overflow-x-auto rounded-3xl border border-[#e6dcc8] bg-white shadow-sm">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead className="bg-[#fffaf3] text-xs uppercase tracking-[0.18em] text-[#8a6a2f]">
                <tr>
                  <th className="px-5 py-4">Pays</th>
                  <th className="px-5 py-4">Code</th>
                  <th className="px-5 py-4">Poids min</th>
                  <th className="px-5 py-4">Poids max</th>
                  <th className="px-5 py-4">Transporteur</th>
                  <th className="px-5 py-4">Prix HT</th>
                  <th className="px-5 py-4">Statut</th>
                </tr>
              </thead>

              <tbody>
                {rates.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-neutral-600"
                    >
                      Aucun tarif de livraison enregistré.
                    </td>
                  </tr>
                )}

                {rates.map((rate) => (
                  <tr
                    key={rate.id}
                    className="border-t border-neutral-200 text-neutral-800"
                  >
                    <td className="px-5 py-4 font-medium">
                      {rate.country_name}
                    </td>

                    <td className="px-5 py-4">{rate.country_code}</td>

                    <td className="px-5 py-4">{rate.min_weight_kg} kg</td>

                    <td className="px-5 py-4">{rate.max_weight_kg} kg</td>

                    <td className="px-5 py-4">
                      {rate.carrier || "À confirmer"}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      {formatPrice(rate.price_excl_vat)}
                    </td>

                    <td className="px-5 py-4">
                      {rate.active ? "Actif" : "Inactif"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-[#e6dcc8] bg-white p-6 text-sm leading-7 text-neutral-700">
          <strong>Note :</strong> les tarifs seront ajustés lorsque les offres
          définitives FedEx, France Express / Géodis et Planzer seront reçues.
        </div>
      </div>
    </main>
  );
}