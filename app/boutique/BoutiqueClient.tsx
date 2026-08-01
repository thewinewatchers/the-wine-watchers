"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import EditorialBlock from "@/app/components/EditorialBlock";
import { APPELLATION_EDITORIAL } from "@/lib/editorial/appellations";

type Wine = {
  id: string;
  slug?: string;
  name?: string;
  title?: string;
  chateau?: string;
  vintage?: string | number;
  millesime?: string | number;
  price?: string | number;
  prix?: string | number;
  compare_at_price?: string | number;
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

const BORDEAUX_APPELLATION_ORDER = [
  "Margaux",
  "Pauillac",
  "Pessac-Léognan",
  "Pomerol",
  "Saint-Émilion",
  "Saint-Estèphe",
  "Saint-Julien",
  "Sauternes",
  "Autres",
];

function normalize(value?: string | number | null) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/-/g, " ")
    .trim();
}

function isAllSelectionsPage(slug: string, categoryTitle: string) {
  const normalizedSlug = normalize(slug);
  const normalizedTitle = normalize(categoryTitle);

  return (
    normalizedSlug === "toutes les selections" ||
    normalizedSlug === "tous les vins" ||
    normalizedSlug === "all" ||
    normalizedSlug === "boutique" ||
    normalizedTitle === "toutes les selections" ||
    normalizedTitle === "tous les vins"
  );
}

const SEARCH_ALIASES: Record<string, string[]> = {
  caisse: ["caisse", "cbo", "owc"],
  caisses: ["caisse", "cbo", "owc"],
  magnum: ["magnum", "1.5l", "150cl"],
  primeur: ["primeur", "primeurs", "2025"],
  primeurs: ["primeur", "primeurs", "2025"],
};

function getSearchWords(value?: string | number | null) {
  return normalize(value)
    .split(/[\s/]+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function getWineSearchFields(wine: Wine) {
  return {
    name: normalize([wine.name, wine.title, wine.chateau].filter(Boolean).join(" ")),
    producer: normalize(wine.producer),
    other: normalize(
      [
        wine.appellation,
        wine.region,
        wine.vintage,
        wine.millesime,
        wine.classification,
        wine.bottle_size,
        wine.packaging,
        wine.category,
        wine.categorie,
      ]
        .filter(Boolean)
        .join(" ")
    ),
  };
}

function wineMatchesSearch(wine: Wine, search: string) {
  const searchWords = getSearchWords(search);

  if (searchWords.length === 0) return true;

  const fields = getWineSearchFields(wine);
  const identityWords = getSearchWords(
    [fields.name, fields.producer].join(" ")
  );
  const allWineWords = getSearchWords(
    [fields.name, fields.producer, fields.other].join(" ")
  );

  const identityMarkers = new Set([
    "chateau",
    "domaine",
    "domaines",
    "tenuta",
    "bodega",
    "bodegas",
  ]);

  const searchesNamedEstate = searchWords.some((word) =>
    identityMarkers.has(word)
  );

  return searchWords.every((searchWord) => {
    const acceptedWords = SEARCH_ALIASES[searchWord] || [searchWord];
    const isTechnicalWord =
      Boolean(SEARCH_ALIASES[searchWord]) || /^\d{4}$/.test(searchWord);

    const wordsToSearch =
      searchesNamedEstate && !isTechnicalWord ? identityWords : allWineWords;

    return acceptedWords.some((acceptedWord) =>
      wordsToSearch.some(
        (wineWord) =>
          wineWord === acceptedWord ||
          wineWord.startsWith(acceptedWord) ||
          acceptedWord.startsWith(wineWord)
      )
    );
  });
}

function getWineSearchScore(wine: Wine, search: string) {
  const normalizedSearch = normalize(search);

  if (!normalizedSearch) return 0;

  const fields = getWineSearchFields(wine);
  const searchWords = getSearchWords(search);
  const nameWords = getSearchWords(fields.name);
  const producerWords = getSearchWords(fields.producer);
  const otherWords = getSearchWords(fields.other);

  let score = 0;

  if (fields.name === normalizedSearch) score += 500;
  if (fields.producer === normalizedSearch) score += 450;
  if (fields.name.startsWith(normalizedSearch)) score += 300;
  if (fields.producer.startsWith(normalizedSearch)) score += 260;
  if (fields.name.includes(normalizedSearch)) score += 180;
  if (fields.producer.includes(normalizedSearch)) score += 150;

  searchWords.forEach((searchWord) => {
    const acceptedWords = SEARCH_ALIASES[searchWord] || [searchWord];

    if (acceptedWords.some((word) => nameWords.includes(word))) score += 70;
    if (acceptedWords.some((word) => producerWords.includes(word))) score += 55;
    if (acceptedWords.some((word) => otherWords.includes(word))) score += 25;
  });

  return score;
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

function parsePrice(price?: string | number) {
  if (price === undefined || price === null || price === "") return 0;
  if (typeof price === "number") return price;

  const cleaned = price
    .toString()
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const value = Number(cleaned);
  return Number.isNaN(value) ? 0 : value;
}

function formatPrice(price: string | number | undefined) {
  const value = parsePrice(price);

  if (value <= 0) return "";

  return (
    value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € HT"
  );
}

function getDiscountInfo(
  priceValue?: string | number,
  compareAtPriceValue?: string | number
) {
  const price = parsePrice(priceValue);
  const compareAtPrice = parsePrice(compareAtPriceValue);

  if (price <= 0 || compareAtPrice <= price) return null;

  const saving = compareAtPrice - price;
  const percent = Math.round((saving / compareAtPrice) * 100);

  return {
    saving,
    percent,
  };
}

function getWineImage(wine: Wine) {
  return wine.image_url || wine.imageUrl || wine.image || "";
}

function getWineHref(wine: Wine) {
  return `/boutique/vin/${wine.slug || wine.id}`;
}

function uniqueSorted(values: Array<string | number | undefined | null>) {
  return Array.from(
    new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr"));
}

function getBordeauxAppellationTitle(wine: Wine) {
  const normalizedAppellation = normalize(wine.appellation || wine.region || "");

  const matchedAppellation = BORDEAUX_APPELLATION_ORDER.find(
    (appellation) => normalize(appellation) === normalizedAppellation
  );

  return matchedAppellation || "Autres";
}

function getBordeauxAppellationRank(wine: Wine) {
  const title = getBordeauxAppellationTitle(wine);
  const index = BORDEAUX_APPELLATION_ORDER.indexOf(title);

  return index >= 0 ? index : BORDEAUX_APPELLATION_ORDER.length - 1;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeWordsFromTitle(title: string, value?: string | number | null) {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) return title;

  return title.replace(
    new RegExp(`(^|\\s|[–—-])${escapeRegExp(normalizedValue)}(?=$|\\s|[–—-])`, "gi"),
    " "
  );
}

function getWineGroupTitle(wine: Wine, categorySlug: string) {
  let title = getWineName(wine).trim();

  title = removeWordsFromTitle(title, getWineVintage(wine));
  title = removeWordsFromTitle(title, wine.bottle_size);
  title = removeWordsFromTitle(title, wine.packaging);

  title = title
    .replace(/\b(?:cbo|owc)\s*\/?\s*\d+\b/gi, " ")
    .replace(/\b(?:75\s*cl|150\s*cl|1[.,]5\s*l|magnum)\b/gi, " ")
    .replace(/\s*[–—-]\s*$/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (categorySlug === "rhone") {
    title = removeWordsFromTitle(title, wine.producer);
    title = removeWordsFromTitle(title, wine.appellation);
    title = removeWordsFromTitle(title, wine.region);

    title = title
      .replace(/\b(?:cote rotie|côtes? du rhone|vallee du rhone)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return title || getWineName(wine).trim();
}

function WineCard({
  wine,
  categoryTitle,
}: {
  wine: Wine;
  categoryTitle: string;
}) {
  const image = getWineImage(wine);
  const name = getWineName(wine);
  const vintage = getWineVintage(wine);
  const price = getWinePrice(wine);
  const discountInfo = getDiscountInfo(price, wine.compare_at_price);
  const location = wine.appellation || wine.region || categoryTitle;
  const wineHref = getWineHref(wine);

  return (
    <article className="group overflow-hidden rounded-[1.7rem] border border-[#dfcfb8] bg-[#fffaf3] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl">
      <Link href={wineHref} className="block">
        <div className="relative flex h-[245px] items-center justify-center overflow-hidden bg-[#efe3d2] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(216,181,109,0.24),transparent_38%)]" />

          {discountInfo && (
            <div className="absolute left-4 top-4 z-20 rounded-full bg-[#8a1f1f] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
              -{discountInfo.percent} %
            </div>
          )}

          {wine.rating && (
            <div className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#8a1f1f] shadow-sm">
              {wine.rating}
            </div>
          )}

          {image ? (
            <img
              src={image}
              alt={`Bouteille de ${name} - The Wine Watchers`}
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

        <Link href={wineHref}>
          <h3 className="min-h-[64px] font-serif text-sm leading-tight text-[#24110d] transition group-hover:text-[#8a1f1f]">
            {name}
          </h3>
        </Link>

        {(wine.producer || wine.region) && (
          <p className="mt-3 truncate text-[11px] uppercase tracking-[0.18em] text-[#b08a43]">
            {wine.producer || wine.region}
          </p>
        )}

        <div className="mt-5 flex items-end justify-between gap-2 border-t border-[#eadfce] pt-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a6a2f]">
              Prix
            </p>

            {price ? (
              discountInfo ? (
                <div className="mt-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a6a2f]">
                    🏷️ Offre exceptionnelle
                  </p>

                  <p className="mt-1 text-sm text-[#9b8c7d] line-through">
                    {formatPrice(wine.compare_at_price)}
                  </p>

                  <p className="whitespace-nowrap font-serif text-[1.35rem] text-[#8a1f1f] xl:text-[1.45rem]">
                    {formatPrice(price)}
                  </p>

                  <p className="mt-1 whitespace-nowrap text-[11px] text-[#6d5b50]">
                    Vous économisez {formatPrice(discountInfo.saving)} (-
                    {discountInfo.percent}%)
                  </p>
                </div>
              ) : (
                <p className="mt-1 whitespace-nowrap font-serif text-[1.35rem] text-[#8a1f1f] xl:text-[1.45rem]">
                  {formatPrice(price)}
                </p>
              )
            ) : (
              <p className="mt-2 text-sm text-[#6d5b50]">Sur demande</p>
            )}
          </div>

          <Link
            href={wineHref}
            className="shrink-0 rounded-full bg-[#8a1f1f] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#641313]"
          >
            Détails
          </Link>
        </div>
      </div>
    </article>
  );
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
  const [selectedAppellation, setSelectedAppellation] = useState("");
  const [selectedClassification, setSelectedClassification] = useState("");
  const [selectedVintage, setSelectedVintage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedSlug = normalize(slug);
  const normalizedCategoryTitle = normalize(categoryTitle);
  const selectedAppellationSlug = normalize(selectedAppellation)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const appellationEditorial =
    APPELLATION_EDITORIAL[selectedAppellationSlug];

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
    selectedAppellation,
    selectedClassification,
    selectedVintage,
  ]);

  const categoryWines = useMemo(() => {
    const showAllWines = isAllSelectionsPage(slug, categoryTitle);

    return wines.filter((wine) => {
      if (!isVisibleWine(wine)) return false;

      if (showAllWines) return true;

      const wineCategory = normalize(wine.category);
      const wineCategorie = normalize(wine.categorie);

      return (
        wineCategory === normalizedSlug ||
        wineCategorie === normalizedSlug ||
        wineCategory === normalizedCategoryTitle ||
        wineCategorie === normalizedCategoryTitle
      );
    });
  }, [
    wines,
    slug,
    categoryTitle,
    normalizedSlug,
    normalizedCategoryTitle,
  ]);

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
    const normalizedSearch = normalize(search);

    const winesToFilter = isAllSelectionsPage(slug, categoryTitle)
      ? wines.filter(isVisibleWine)
      : search
        ? wines.filter(isVisibleWine)
        : categoryWines;

    return winesToFilter.filter((wine) => {
        if (!isVisibleWine(wine)) return false;

        const wineAppellation = normalize(wine.appellation);
        const wineRegion = normalize(wine.region);
        const wineClassification = normalize(wine.classification);
        const wineVintage = normalize(wine.vintage || wine.millesime);

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

        const matchesSearch = search ? wineMatchesSearch(wine, search) : true;

        return (
          matchesAppellation &&
          matchesClassification &&
          matchesVintage &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        if (search) {
          const scoreDifference =
            getWineSearchScore(b, search) - getWineSearchScore(a, search);

          if (scoreDifference !== 0) return scoreDifference;

          return getWineName(a).localeCompare(getWineName(b), "fr");
        }

        if (slug === "bordeaux") {
          const rankA = getBordeauxAppellationRank(a);
          const rankB = getBordeauxAppellationRank(b);

          if (rankA !== rankB) {
            return rankA - rankB;
          }

          const nameA = normalize(getWineName(a));
          const nameB = normalize(getWineName(b));

          return nameA.localeCompare(nameB, "fr");
        }

        if (slug === "primeurs-2025") {
          const appellationA = normalize(a.appellation || a.region || "");
          const appellationB = normalize(b.appellation || b.region || "");

          if (appellationA !== appellationB) {
            return appellationA.localeCompare(appellationB, "fr");
          }

          const nameA = normalize(a.name || a.title || "");
          const nameB = normalize(b.name || b.title || "");

          return nameA.localeCompare(nameB, "fr");
        }

        if (slug === "bourgogne") {
          const producerA = normalize(a.producer || "");
          const producerB = normalize(b.producer || "");

          if (producerA !== producerB) {
            return producerA.localeCompare(producerB, "fr");
          }

          const appellationA = normalize(a.appellation || a.region || "");
          const appellationB = normalize(b.appellation || b.region || "");

          if (appellationA !== appellationB) {
            return appellationA.localeCompare(appellationB, "fr");
          }

          const nameA = normalize(a.name || a.title || "");
          const nameB = normalize(b.name || b.title || "");

          if (nameA !== nameB) {
            return nameA.localeCompare(nameB, "fr");
          }

          const vintageA = Number(a.vintage || a.millesime || 0);
          const vintageB = Number(b.vintage || b.millesime || 0);

          return vintageB - vintageA;
        }

        return 0;
      });
  }, [
    wines,
    categoryWines,
    search,
    selectedAppellation,
    selectedClassification,
    selectedVintage,
    slug,
    categoryTitle,
  ]);

  const groupedFilteredWines = useMemo(() => {
    const producerMap = new Map<
      string,
      {
        title: string;
        appellationTitle: string;
        appellationRank: number;
        wineMap: Map<string, { title: string; wines: Wine[] }>;
      }
    >();

    filteredWines.forEach((wine) => {
      const producerTitle =
        String(wine.producer || "").trim() || "Producteur non précisé";
      const groupsByAppellation =
        slug === "bordeaux" || slug === "primeurs-2025";
      const appellationTitle = groupsByAppellation
        ? getBordeauxAppellationTitle(wine)
        : "";
      const appellationRank = groupsByAppellation
        ? getBordeauxAppellationRank(wine)
        : 0;
      const producerKey = normalize(
        groupsByAppellation
          ? `${appellationTitle}-${producerTitle}`
          : producerTitle
      );

      const wineTitle = getWineGroupTitle(wine, slug);
      const wineKey = normalize(wineTitle);

      if (!producerMap.has(producerKey)) {
        producerMap.set(producerKey, {
          title: producerTitle,
          appellationTitle,
          appellationRank,
          wineMap: new Map(),
        });
      }

      const producerGroup = producerMap.get(producerKey)!;

      if (!producerGroup.wineMap.has(wineKey)) {
        producerGroup.wineMap.set(wineKey, {
          title: wineTitle,
          wines: [],
        });
      }

      producerGroup.wineMap.get(wineKey)!.wines.push(wine);
    });

    return Array.from(producerMap.values())
      .sort((a, b) => {
        const groupsByAppellation =
          slug === "bordeaux" || slug === "primeurs-2025";

        if (groupsByAppellation && a.appellationRank !== b.appellationRank) {
          return a.appellationRank - b.appellationRank;
        }

        if (
          groupsByAppellation &&
          a.appellationTitle !== b.appellationTitle
        ) {
          return a.appellationTitle.localeCompare(b.appellationTitle, "fr");
        }

        return a.title.localeCompare(b.title, "fr");
      })
      .map((producerGroup) => ({
        title: producerGroup.title,
        appellationTitle: producerGroup.appellationTitle,
        wineGroups: Array.from(producerGroup.wineMap.values())
          .sort((a, b) => a.title.localeCompare(b.title, "fr"))
          .map((wineGroup) => ({
            ...wineGroup,
            wines: [...wineGroup.wines].sort((a, b) => {
              const vintageA = Number(getWineVintage(a) || 0);
              const vintageB = Number(getWineVintage(b) || 0);

              if (vintageA !== vintageB) return vintageB - vintageA;

              return getWineName(a).localeCompare(getWineName(b), "fr");
            }),
          })),
      }));
  }, [filteredWines, slug]);

  const groupedPages = useMemo(() => {
    type WineGroup = { title: string; wines: Wine[] };
    type ProducerGroup = {
      title: string;
      appellationTitle: string;
      wineGroups: WineGroup[];
    };

    const pages: ProducerGroup[][] = [];
    let currentPageGroups: ProducerGroup[] = [];
    let currentPageWineCount = 0;

    function pushCurrentPage() {
      if (currentPageGroups.length > 0) {
        pages.push(currentPageGroups);
        currentPageGroups = [];
        currentPageWineCount = 0;
      }
    }

    groupedFilteredWines.forEach((producerGroup) => {
      let currentProducerGroup: ProducerGroup | null = null;

      producerGroup.wineGroups.forEach((wineGroup) => {
        const wineCount = wineGroup.wines.length;

        if (
          currentPageWineCount > 0 &&
          currentPageWineCount + wineCount > WINES_PER_PAGE
        ) {
          pushCurrentPage();
          currentProducerGroup = null;
        }

        if (!currentProducerGroup) {
          currentProducerGroup = {
            title: producerGroup.title,
            appellationTitle: producerGroup.appellationTitle,
            wineGroups: [],
          };

          currentPageGroups.push(currentProducerGroup);
        }

        currentProducerGroup.wineGroups.push(wineGroup);
        currentPageWineCount += wineCount;
      });
    });

    pushCurrentPage();

    return pages;
  }, [groupedFilteredWines]);

  const totalPages = Math.max(1, groupedPages.length);

  const groupedPaginatedWines = groupedPages[currentPage - 1] || [];

  const primeurAppellationGroups = useMemo(() => {
    if (slug !== "primeurs-2025") return [];

    const groups: {
      title: string;
      producers: typeof groupedPaginatedWines;
    }[] = [];

    groupedPaginatedWines.forEach((producerGroup) => {
      const existingGroup = groups.find(
        (group) => group.title === producerGroup.appellationTitle
      );

      if (existingGroup) {
        existingGroup.producers.push(producerGroup);
      } else {
        groups.push({
          title: producerGroup.appellationTitle || "Autres",
          producers: [producerGroup],
        });
      }
    });

    return groups;
  }, [groupedPaginatedWines, slug]);

  function resetFilters() {
    setSearch("");
    setSelectedAppellation("");
    setSelectedClassification("");
    setSelectedVintage("");
    setCurrentPage(1);
  }

  return (
    <section className="relative overflow-visible bg-[#f7f1e8] px-6 pb-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(216,181,109,0.20),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(138,31,31,0.10),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="relative z-30 mb-10 rounded-[2rem] border border-[#e1d1bd] bg-[#fffaf3]/90 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8a6a2f]">
                Vins disponibles
              </p>

              <h2 className="mt-3 font-serif text-4xl leading-tight text-[#24110d] md:text-5xl">
                {search
                  ? `Recherche : ${search}`
                  : selectedAppellation
                  ? selectedAppellation
                  : `Sélection ${categoryTitle}`}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-8 text-[#6d5b50]">
                Recherchez précisément un vin, puis affinez par appellation,
                classification ou millésime.
              </p>
            </div>

            <div className="rounded-full border border-[#d8c6ae] bg-white px-5 py-3 text-sm text-[#6d5b50] shadow-sm">
              {filteredWines.length} vin{filteredWines.length > 1 ? "s" : ""}{" "}
              affiché{filteredWines.length > 1 ? "s" : ""}
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr_1fr_0.8fr]">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-[#8a6a2f]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </div>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="search"
                placeholder="Rechercher un vin, une appellation, un millésime..."
                autoComplete="off"
                className="w-full rounded-full border border-[#d8c6ae] bg-white py-3 pl-13 pr-12 text-sm text-[#24110d] outline-none transition placeholder:text-[#9b8c7d] focus:border-[#8a1f1f] focus:ring-4 focus:ring-[#8a1f1f]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-4 flex items-center text-xl text-[#8a6a2f] transition hover:text-[#8a1f1f]"
                  aria-label="Effacer la recherche"
                >
                  ×
                </button>
              )}
            </div>

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

        {appellationEditorial && (
          <EditorialBlock
            title={appellationEditorial.title}
            text={appellationEditorial.opinion}
          />
        )}

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

        {!loading &&
          !errorMessage &&
          groupedPaginatedWines.length > 0 && (
            <>
              {slug === "primeurs-2025" ? (
                <div className="space-y-9">
                  {primeurAppellationGroups.map((appellationGroup) => (
                    <section key={appellationGroup.title}>
                      <div className="mb-5 rounded-xl border border-[#8a1f1f]/30 bg-[#8a1f1f] px-5 py-2.5 shadow-sm">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/60">
                            Appellation
                          </p>

                          <h2 className="font-serif text-2xl text-white">
                            {appellationGroup.title}
                          </h2>
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {appellationGroup.producers.flatMap((producerGroup) =>
                          producerGroup.wineGroups.flatMap((wineGroup) =>
                            wineGroup.wines.map((wine) => (
                              <section
                                key={`${producerGroup.title}-${wineGroup.title}-${wine.id}`}
                                className="min-w-0"
                              >
                                <div className="mb-3 rounded-xl border border-[#d8b56d]/40 bg-[#24110d] px-4 py-2 shadow-sm">
                                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/45">
                                    Producteur
                                  </p>

                                  <h3 className="mt-0.5 truncate font-serif text-lg text-[#d8b56d]">
                                    {producerGroup.title}
                                  </h3>
                                </div>

                                <div className="mb-3 rounded-xl border border-[#d8c6ae] bg-[#fffaf3] px-4 py-2 shadow-sm">
                                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#8a6a2f]">
                                    Vin
                                  </p>

                                  <h4 className="mt-0.5 truncate font-serif text-base text-[#24110d]">
                                    {wineGroup.title}
                                  </h4>
                                </div>

                                <WineCard
                                  wine={wine}
                                  categoryTitle={categoryTitle}
                                />
                              </section>
                            ))
                          )
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="space-y-9">
                  {groupedPaginatedWines.map((producerGroup, producerIndex) => {
                    const previousGroup =
                      groupedPaginatedWines[producerIndex - 1];
                    const showAppellationBanner =
                      slug === "bordeaux" &&
                      (!previousGroup ||
                        previousGroup.appellationTitle !==
                          producerGroup.appellationTitle);

                    return (
                      <div key={`${producerGroup.title}-${producerIndex}`}>
                        {showAppellationBanner && (
                          <div className="mb-5 rounded-xl border border-[#8a1f1f]/30 bg-[#8a1f1f] px-5 py-3 shadow-sm">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/60">
                                Appellation
                              </p>

                              <h2 className="font-serif text-2xl text-white md:text-3xl">
                                {producerGroup.appellationTitle}
                              </h2>
                            </div>
                          </div>
                        )}

                        <section className="space-y-5">
                          <div className="rounded-xl border border-[#d8b56d]/40 bg-[#24110d] px-5 py-3 shadow-sm">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/50">
                                Producteur
                              </p>

                              <h3 className="font-serif text-2xl text-[#d8b56d] md:text-3xl">
                                {producerGroup.title}
                              </h3>
                            </div>
                          </div>

                          <div className="space-y-6">
                            {producerGroup.wineGroups.map(
                              (wineGroup, wineIndex) => (
                                <section
                                  key={`${producerGroup.title}-${wineGroup.title}-${wineIndex}`}
                                >
                                  <div className="mb-4 rounded-xl border border-[#d8c6ae] bg-[#fffaf3] px-5 py-3 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8a6a2f]">
                                          Vin
                                        </p>

                                        <h4 className="font-serif text-xl leading-tight text-[#24110d] md:text-2xl">
                                          {wineGroup.title}
                                        </h4>
                                      </div>

                                      <p className="text-xs text-[#7d6b5e]">
                                        {wineGroup.wines.length} millésime
                                        {wineGroup.wines.length > 1 ? "s" : ""}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                                    {wineGroup.wines.map((wine) => (
                                      <WineCard
                                        key={wine.id}
                                        wine={wine}
                                        categoryTitle={categoryTitle}
                                      />
                                    ))}
                                  </div>
                                </section>
                              )
                            )}
                          </div>
                        </section>
                      </div>
                    );
                  })}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
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