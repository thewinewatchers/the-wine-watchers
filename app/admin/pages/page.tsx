"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type SitePage = {
  id: string;
  slug: string;
  name: string;
  page_title: string;
  is_active: boolean;
  updated_at: string;
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPages() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("site_pages")
        .select("id, slug, name, page_title, is_active, updated_at")
        .order("name", { ascending: true });

      if (error) {
        setErrorMessage(
          `Impossible de charger les pages : ${error.message}`
        );
        setLoading(false);
        return;
      }

      setPages((data || []) as SitePage[]);
      setLoading(false);
    }

    loadPages();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#1f1a17]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f] hover:text-black"
            >
              ← Retour administration
            </Link>

            <p className="mt-8 text-sm uppercase tracking-[0.22em] text-[#8a6a2f]">
              Administration
            </p>

            <h1 className="mt-3 font-serif text-5xl">
              Pages du site
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-neutral-600">
              Modifiez les contenus des pages institutionnelles et
              informatives du site sans intervenir directement dans le code.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
            Chargement des pages...
          </div>
        ) : pages.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#e6dcc8] bg-white p-8 shadow-sm">
            Aucune page administrable n&apos;est encore enregistrée.
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex flex-col gap-5 rounded-3xl border border-[#e6dcc8] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-serif text-2xl">
                      {page.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        page.is_active
                          ? "bg-green-50 text-green-800"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {page.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-neutral-500">
                    /{page.slug}
                  </p>

                  <p className="mt-3 text-sm text-neutral-600">
                    Titre : {page.page_title}
                  </p>

                  <p className="mt-2 text-xs text-neutral-400">
                    Dernière modification :{" "}
                    {new Date(page.updated_at).toLocaleString("fr-FR")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/${page.slug}`}
                    target="_blank"
                    className="rounded-full border border-[#8a6a2f] px-5 py-2 text-sm font-medium text-[#8a6a2f] hover:bg-[#8a6a2f] hover:text-white"
                  >
                    Voir la page
                  </Link>

                  <Link
                    href={`/admin/pages/${page.slug}`}
                    className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-[#8a6a2f]"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}