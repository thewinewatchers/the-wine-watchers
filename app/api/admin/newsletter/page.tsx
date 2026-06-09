"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Subscriber = {
  id: string;
  email: string;
  source?: string | null;
  created_at?: string | null;
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadSubscribers() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id,email,source,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      setSubscribers([]);
    } else {
      setSubscribers((data || []) as Subscriber[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSubscribers();
  }, []);

  const csvContent = useMemo(() => {
    const header = "email,source,created_at\n";

    const rows = subscribers
      .map((subscriber) => {
        const email = subscriber.email || "";
        const source = subscriber.source || "";
        const createdAt = subscriber.created_at || "";

        return `"${email}","${source}","${createdAt}"`;
      })
      .join("\n");

    return header + rows;
  }, [subscribers]);

  function downloadCsv() {
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "newsletter-subscribers.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#f8f4ee] px-6 py-10 text-[#24110d]">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm font-medium text-[#8a1f1f] hover:underline"
        >
          ← Retour admin
        </Link>

        <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#8a6a2f]">
            Administration
          </p>

          <h1 className="font-serif text-4xl text-[#24110d]">Newsletter</h1>

          <p className="mt-4 text-gray-600">
            Gestion des inscriptions à la newsletter The Wine Watchers.
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-[#8a6a2f]">
              Abonnés
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {subscribers.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2">
            <p className="text-sm uppercase tracking-[0.2em] text-[#8a6a2f]">
              Export
            </p>

            <button
              type="button"
              onClick={downloadCsv}
              disabled={subscribers.length === 0}
              className="mt-4 rounded-full bg-[#8a1f1f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#641313] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Exporter en CSV
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl">Liste des inscrits</h2>

            <button
              type="button"
              onClick={loadSubscribers}
              className="rounded-full border border-[#8a6a2f]/40 px-5 py-2 text-sm font-medium text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
            >
              Actualiser
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600">Chargement des abonnés...</p>
          ) : errorMessage ? (
            <p className="text-red-600">Erreur : {errorMessage}</p>
          ) : subscribers.length === 0 ? (
            <p className="text-gray-600">Aucun inscrit pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e1d1bd] text-[#8a6a2f]">
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Source</th>
                    <th className="py-3 pr-4">Date d’inscription</th>
                  </tr>
                </thead>

                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="border-b border-[#f0e4d6]"
                    >
                      <td className="py-3 pr-4 font-medium">
                        {subscriber.email}
                      </td>
                      <td className="py-3 pr-4">
                        {subscriber.source || "—"}
                      </td>
                      <td className="py-3 pr-4">
                        {subscriber.created_at
                          ? new Date(subscriber.created_at).toLocaleString(
                              "fr-FR"
                            )
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}