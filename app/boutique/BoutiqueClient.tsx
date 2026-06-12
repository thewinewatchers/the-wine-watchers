"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Wine = {
  id: string;
  name?: string;
  title?: string;
  chateau?: string;
  vintage?: string | number;
  millesime?: string | number;
  price?: string | number;
  prix?: string | number;
  quantity?: string | number;
  stock?: string | number;
  category?: string;
  categorie?: string;
  region?: string;
  appellation?: string;
  image_url?: string;
  image?: string;
  imageUrl?: string;
  description?: string;
  rating?: string | number;
  producer?: string;
  classification?: string;
  color?: string;
  bottle_size?: string;
  packaging?: string;
  hidden_from_site?: boolean | null;
};

type BoutiqueClientProps = {
  slug: string;
  categoryTitle: string;
  appellations: string[];
};

const WINES_PER_PAGE = 24;

function normalize(value?: string | number | null) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/-/g, " ")
    .trim();
}

function isVisibleWine(wine: Wine) {
  return wine.hidden_from_site !== true;
}

function getWineName(wine: Wine) {
  return wine.name || wine.title || wine.chateau || "Vin sans nom";
}

function getWineVintage(wine: Wine) {
  return wine.vintage || wine.millesime || "";
}

function getWinePrice(wine: Wine) {
  return wine.price || wine.prix || "";
}

function formatPrice(price: string | number | undefined) {
  if (!price) return "";

  const value = Number(price);

  if (Number.isNaN(value)) return String(price);

  return (
    value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € HT"
  );
}

function getWineImage(wine: Wine) {
  return wine.image_url || wine.imageUrl || wine.image || "";
}

function uniqueSorted(values: Array<string | number | undefined | null>) {
  return Array.from(
    new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr"));
}

export default function BoutiqueClient({
  slug,
  categoryTitle,
  appellations,
}: BoutiqueClientProps) {
  const searchParams = useSearchParams();
  const selectedAppellationFromUrl = searchParams.get("appellation");
  const selectedSearchFromUrl = searchParams.get("search");

  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [selectedProducer, setSelectedProducer] = useState("");
  const [selectedAppellation, setSelectedAppellation] = useState("");
  const [selectedClassification, setSelectedClassification] = useState("");
  const [selectedVintage, setSelectedVintage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedSlug = normalize(slug);
  const normalizedCategoryTitle = normalize(categoryTitle);

  const normalizedAppellations = useMemo(
    () => appellations.map((item) => normalize(item)),
    [appellations]
  );

  useEffect(() => {
    async function loadWines() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("wines")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
        setWines([]);
        setLoading(false);
        return;
      }

      const visibleWines = ((data as Wine[]) || []).filter(isVisibleWine);

      setWines(visibleWines);
      setLoading(false);
    }

    loadWines();
  }, []);

  useEffect(() => {
    setSelectedAppellation(selectedAppellationFromUrl || "");
    setSearch(selectedSearchFromUrl || "");
    setCurrentPage(1);
  }, [selectedAppellationFromUrl, selectedSearchFromUrl, slug]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedProducer,
    selectedAppellation,
    selectedClassification,
    selectedVintage,
  ]);

 const categoryWines = useMemo(() => {
  return wines.filter((wine) => {
    if (!isVisibleWine(wine)) return false;

    const wineCategory = normalize(wine.category);
    const wineCategorie = normalize(wine.categorie);

    return (
      wineCategory === normalizedSlug ||
      wineCategorie === normalizedSlug ||
      wineCategory === normalizedCategoryTitle ||
      wineCategorie === normalizedCategoryTitle
    );
  });
}, [wines, normalizedSlug, normalizedCategoryTitle]);

  const producerOptions = useMemo(() => {
    return uniqueSorted(
      categoryWines.filter(isVisibleWine).map((wine) => wine.producer)
    );
  }, [categoryWines]);

  const appellationOptions = useMemo(() => {
    return uniqueSorted(
      categoryWines.filter(isVisibleWine).map((wine) => wine.appellation)
    );
  }, [categoryWines]);

  const classificationOptions = useMemo(() => {
    return uniqueSorted(
      categoryWines.filter(isVisibleWine).map((wine) => wine.classification)
    );
  }, [categoryWines]);

  const vintageOptions = useMemo(() => {
    return uniqueSorted(
      categoryWines
        .filter(isVisibleWine)
        .map((wine) => wine.vintage || wine.millesime)
    ).sort((a, b) => Number(b) - Number(a));
  }, [categoryWines]);

   const filteredWines = useMemo(() => {
  return (search ? wines.filter(isVisibleWine) : categoryWines)
    .filter((wine) => {
        if (!isVisibleWine(wine)) return false;

        const wineProducer = normalize(wine.producer);
        const wineAppellation = normalize(wine.appellation);
        const wineRegion = normalize(wine.region);
        const wineClassification = normalize(wine.classification);
        const wineVintage = normalize(wine.vintage || wine.millesime);

        const matchesProducer = selectedProducer
          ? wineProducer === normalize(selectedProducer)
          : true;

        const matchesAppellation = selectedAppellation
          ? wineAppellation === normalize(selectedAppellation) ||
            wineRegion === normalize(selectedAppellation)
          : true;

        const matchesClassification = selectedClassification
          ? wineClassification === normalize(selectedClassification)
          : true;

        const matchesVintage = selectedVintage
          ? wineVintage === normalize(selectedVintage)
          : true;

        const searchText = normalize(
          [
            wine.name,
            wine.title,
            wine.chateau,
            wine.producer,
            wine.region,
            wine.appellation,
            wine.vintage,
            wine.millesime,
            wine.classification,
            wine.color,
            wine.bottle_size,
            wine.packaging,
            wine.description,
          ]
            .filter(Boolean)
            .join(" ")
        );

        const matchesSearch = search
          ? searchText.includes(normalize(search))
          : true;

        return (
          matchesProducer &&
          matchesAppellation &&
          matchesClassification &&
          matchesVintage &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        const appellationA = normalize(a.appellation || a.region || "");
        const appellationB = normalize(b.appellation || b.region || "");

        if (appellationA !== appellationB) {
          return appellationA.localeCompare(appellationB, "fr");
        }

        const nameA = normalize(getWineName(a));
        const nameB = normalize(getWineName(b));

        if (nameA !== nameB) {
          return nameA.localeCompare(nameB, "fr");
        }

        const vintageA = Number(a.vintage || a.millesime || 0);
        const vintageB = Number(b.vintage || b.millesime || 0);

        return vintageB - vintageA;
      });
    }, [
    categoryWines,
    wines,
    selectedProducer,
    selectedAppellation,
    selectedClassification,
    selectedVintage,
    search,
  ]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredWines.length / WINES_PER_PAGE)
  );

  const paginatedWines = filteredWines.slice(
    (currentPage - 1) * WINES_PER_PAGE,
    currentPage * WINES_PER_PAGE
  );

  function resetFilters() {
    setSearch("");
    setSelectedProducer("");
    setSelectedAppellation("");
    setSelectedClassification("");
    setSelectedVintage("");
    setCurrentPage(1);
  }

  return (
    <section className="relative overflow-hidden bg-[#f7f1e8] px-6 pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,181,109,0.20),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(138,31,31,0.10),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3]/90 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
                Vins disponibles
              </p>

              <h2 className="mt-3 font-serif text-4xl leading-tight text-[#24110d] md:text-5xl">
                {selectedAppellation
                  ? selectedAppellation
                  : `Sélection ${categoryTitle}`}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-8 text-[#6d5b50]">
                Filtrez la sélection par domaine, appellation, classification,
                millésime ou recherche libre.
              </p>
            </div>

            <div className="rounded-full border border-[#d8c6ae] bg-white px-5 py-3 text-sm text-[#6d5b50] shadow-sm">
              {filteredWines.length} vin{filteredWines.length > 1 ? "s" : ""}{" "}
              affiché{filteredWines.length > 1 ? "s" : ""}
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder="Rechercher un domaine, un cru, un millésime..."
              className="rounded-full border border-[#d8c6ae] bg-white px-5 py-3 text-sm text-[#24110d] outline-none transition placeholder:text-[#9b8c7d] focus:border-[#8a1f1f]"
            />

            <select
              value={selectedProducer}
              onChange={(event) => setSelectedProducer(event.target.value)}
              className="rounded-full border border-[#d8c6ae] bg-white px-5 py-3 text-sm text-[#24110d] outline-none transition focus:border-[#8a1f1f]"
            >
              <option value="">Tous les domaines</option>
              {producerOptions.map((producer) => (
                <option key={producer} value={producer}>
                  {producer}
                </option>
              ))}
            </select>

            <select
              value={selectedAppellation}
              onChange={(event) => setSelectedAppellation(event.target.value)}
              className="rounded-full border border-[#d8c6ae] bg-white px-5 py-3 text-sm text-[#24110d] outline-none transition focus:border-[#8a1f1f]"
            >
              <option value="">Toutes les appellations</option>
              {appellationOptions.map((appellation) => (
                <option key={appellation} value={appellation}>
                  {appellation}
                </option>
              ))}
            </select>

            <select
              value={selectedClassification}
              onChange={(event) =>
                setSelectedClassification(event.target.value)
              }
              className="rounded-full border border-[#d8c6ae] bg-white px-5 py-3 text-sm text-[#24110d] outline-none transition focus:border-[#8a1f1f]"
            >
              <option value="">Toutes les classifications</option>
              {classificationOptions.map((classification) => (
                <option key={classification} value={classification}>
                  {classification}
                </option>
              ))}
            </select>

            <select
              value={selectedVintage}
              onChange={(event) => setSelectedVintage(event.target.value)}
              className="rounded-full border border-[#d8c6ae] bg-white px-5 py-3 text-sm text-[#24110d] outline-none transition focus:border-[#8a1f1f]"
            >
             <option value="">Millésimes</option>
{vintageOptions.map((vintage) => (
  <option key={vintage} value={vintage}>
    {vintage}
  </option>
))}
</select>

{slug === "bordeaux" && (
  <Link
    href="/boutique/primeurs-2025"
    className="rounded-full border border-[#8a1f1f] bg-white px-5 py-3 text-center text-sm font-semibold text-[#8a1f1f] transition hover:bg-[#8a1f1f] hover:text-white"
  >
    Primeurs 2025
  </Link>
)}
</div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-[#8a1f1f] px-5 py-2.5 text-sm font-semibold text-[#8a1f1f] transition hover:bg-[#8a1f1f] hover:text-white"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {loading && (
          <div className="rounded-[2rem] border border-[#e5d8c7] bg-[#fffaf3] p-10 text-center shadow-sm">
            <p className="text-[#6d5b50]">Chargement des vins...</p>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="rounded-[2rem] border border-red-200 bg-white p-10 text-center shadow-sm">
            <p className="font-medium text-red-700">
              Erreur Supabase : {errorMessage}
            </p>
          </div>
        )}

        {!loading && !errorMessage && filteredWines.length === 0 && (
          <div className="rounded-[2rem] border border-[#e5d8c7] bg-[#fffaf3] p-10 text-center shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-[#8a6a2f]">
              Aucun vin affiché
            </p>

            <h3 className="mt-3 font-serif text-3xl text-[#24110d]">
              Aucun vin trouvé pour cette sélection
            </h3>
          </div>
        )}

        {!loading && !errorMessage && paginatedWines.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {paginatedWines.map((wine) => {
                const image = getWineImage(wine);
                const name = getWineName(wine);
                const vintage = getWineVintage(wine);
                const price = getWinePrice(wine);
                const location = wine.appellation || wine.region || categoryTitle;

                return (
                  <article
                    key={wine.id}
                    className="group overflow-hidden rounded-[1.7rem] border border-[#dfcfb8] bg-[#fffaf3] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl"
                  >
                    <Link href={`/boutique/vin/${wine.id}`} className="block">
                      <div className="relative flex h-[245px] items-center justify-center overflow-hidden bg-[#efe3d2] p-6">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(216,181,109,0.24),transparent_38%)]" />

                        {wine.rating && (
                          <div className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#8a1f1f] shadow-sm">
                            {wine.rating}
                          </div>
                        )}

                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="relative z-10 max-h-[205px] w-auto object-contain transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="relative z-10 flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-[#cdbb9f] text-sm text-[#8a6a2f]">
                            Image non disponible
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-5">
                      <p className="mb-3 rounded-full bg-[#24110d]/90 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-[#d8b56d]">
                        {location}
                      </p>

                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {vintage && (
                          <span className="rounded-full border border-[#dfcfb8] bg-white px-3 py-1 text-[11px] text-[#6d5b50]">
                            {vintage}
                          </span>
                        )}

                        {wine.classification && (
                          <span className="rounded-full border border-[#dfcfb8] bg-white px-3 py-1 text-[11px] text-[#6d5b50]">
                            {wine.classification}
                          </span>
                        )}

                        {wine.bottle_size && (
                          <span className="rounded-full border border-[#dfcfb8] bg-white px-3 py-1 text-[11px] text-[#6d5b50]">
                            {wine.bottle_size}
                          </span>
                        )}

                        {wine.packaging && (
                          <span className="rounded-full border border-[#dfcfb8] bg-white px-3 py-1 text-[11px] text-[#6d5b50]">
                            {wine.packaging}
                          </span>
                        )}
                      </div>

                      <Link href={`/boutique/vin/${wine.id}`}>
  <h3 className="min-h-[64px] truncate font-serif text-sm leading-tight text-[#24110d] transition group-hover:text-[#8a1f1f]">
    {name}
  </h3>
</Link>

                      {(wine.producer || wine.region) && (
                        <p className="mt-3 truncate text-[11px] uppercase tracking-[0.18em] text-[#b08a43]">
                          {wine.producer || wine.region}
                        </p>
                      )}

                      <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#eadfce] pt-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a6a2f]">
                            Prix
                          </p>

                          {price ? (
                            <p className="mt-1 font-serif text-2xl text-[#8a1f1f]">
                              {formatPrice(price)}
                            </p>
                          ) : (
                            <p className="mt-2 text-sm text-[#6d5b50]">
                              Sur demande
                            </p>
                          )}
                        </div>

                        <Link
                          href={`/boutique/vin/${wine.id}`}
                          className="rounded-full bg-[#8a1f1f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#641313]"
                        >
                          Détails
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-[#d8c6ae] bg-[#fffaf3] px-5 py-3 text-sm font-semibold text-[#24110d] transition hover:border-[#8a1f1f] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Précédent
                </button>

                <span className="rounded-full border border-[#d8c6ae] bg-white px-5 py-3 text-sm text-[#6d5b50]">
                  Page {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-[#d8c6ae] bg-[#fffaf3] px-5 py-3 text-sm font-semibold text-[#24110d] transition hover:border-[#8a1f1f] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}