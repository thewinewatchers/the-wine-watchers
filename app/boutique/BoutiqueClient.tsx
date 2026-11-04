"use client";

import Link from "next/link";
import Image from "next/image";
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
    name: normalize(
      [wine.name, wine.title, wine.chateau].filter(Boolean).join(" ")
    ),
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

  const raw = price.toString().replace(/[€\s\u00a0\u202f]/g, "");
  const cleaned = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;

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
  const image = wine.image_url || wine.imageUrl || wine.image || "";

  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const normalizedImage = image.replace(/\\/g, "/");

  return normalizedImage.startsWith("/")
    ? normalizedImage
    : `/${normalizedImage}`;
}

function getWineHref(wine: Wine) {
  return `/boutique/vin/${wine.slug || wine.id}`;
}

function slugify(value?: string | number | null) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
const KNOWN_APPELLATION_SLUGS = new Set([
  "aloxe-corton",
  "auxey-duresses",
  "barbaresco",
  "barbaresco-docg",
  "barolo",
  "barolo-docg",
  "batard-montrachet",
  "beaune",
  "bienvenues-batard-montrachet",
  "bolgheri",
  "bolgheri-doc",
  "bolgheri-sassicaia",
  "bolgheri-sassicaia-doc",
  "bolgheri-superiore",
  "bonnes-mares",
  "brunello-di-montalcino",
  "brunello-di-montalcino-docg",
  "california",
  "californie",
  "castilla-y-leon",
  "castilla-y-leon-vt",
  "castille-et-leon",
  "chablis",
  "chambertin",
  "chambertin-clos-de-beze",
  "chambolle-musigny",
  "champagne",
  "chapelle-chambertin",
  "charmes-chambertin",
  "chassagne-montrachet",
  "chateauneuf-du-pape",
  "chevalier-montrachet",
  "clos-de-la-roche",
  "clos-de-tart",
  "clos-de-vougeot",
  "clos-de-vougeot-grand-cru",
  "clos-des-lambrays",
  "clos-saint-denis",
  "cornas",
  "corton",
  "corton-charlemagne",
  "cote-de-beaune",
  "cote-de-nuits",
  "cote-des-bar",
  "cote-des-blancs",
  "cote-rotie",
  "criots-batard-montrachet",
  "echezeaux",
  "flagey-echezeaux",
  "gevrey-chambertin",
  "gigondas",
  "grands-echezeaux",
  "griotte-chambertin",
  "hermitage",
  "la-grande-rue",
  "la-romanee",
  "la-tache",
  "latricieres-chambertin",
  "margaux",
  "mazis-chambertin",
  "mazoyeres-chambertin",
  "meursault",
  "montagne-de-reims",
  "montalcino",
  "monthelie",
  "montrachet",
  "morey-saint-denis",
  "musigny",
  "napa-valley",
  "napa-valley-ava",
  "nuits-saint-georges",
  "oakville",
  "oakville-ava",
  "pauillac",
  "pernand-vergelesses",
  "pessac-leognan",
  "piemont",
  "pomerol",
  "pommard",
  "priorat",
  "priorat-doca",
  "puligny-montrachet",
  "rias-baixas",
  "rias-baixas-do",
  "ribera-del-duero",
  "ribera-del-duero-do",
  "richebourg",
  "rioja",
  "rioja-doca",
  "romanee-conti",
  "romanee-saint-vivant",
  "ruchottes-chambertin",
  "rutherford",
  "rutherford-ava",
  "saint-aubin",
  "saint-emilion",
  "saint-estephe",
  "saint-joseph",
  "saint-julien",
  "saint-romain",
  "sauternes",
  "savigny-les-beaune",
  "sonoma",
  "st-helena",
  "st-helena-ava",
  "stags-leap-district",
  "stags-leap-district-ava",
  "toro",
  "toro-do",
  "toscana",
  "toscana-igt",
  "vallee-de-la-marne",
  "volnay",
  "vosne-romanee",
  "vougeot",
  "yountville",
  "yountville-ava",
]);

const APPELLATION_SLUG_ALIASES: Record<string, string> = {
  "aoc-champagne": "champagne",
  "chablis-1er-cru": "chablis",
  "chablis-premier-cru": "chablis",
  "chablis-grand-cru": "chablis",
  "cotes-rotie": "cote-rotie",
  toscane: "toscana",
  "super-toscans": "toscana-igt",
};

function getAppellationHref(appellation: string, categorySlug: string) {
  const rawSlug = slugify(appellation);
  const appellationSlug = APPELLATION_SLUG_ALIASES[rawSlug] || rawSlug;

  if (KNOWN_APPELLATION_SLUGS.has(appellationSlug)) {
    return `/appellation/${appellationSlug}`;
  }

  return `/boutique/${categorySlug}?appellation=${encodeURIComponent(appellation)}`;
}

function getProducerHref(producer: string) {
  const producerSlug = slugify(producer);

  if (
    producerSlug === "domaine-armand-rousseau" ||
    producerSlug === "armand-rousseau"
  ) {
    return "/producteur/armand-rousseau";
  }

  if (producerSlug.includes("opus-one")) {
    return "/producteur/opus-one";
  }

  return `/producteur/${producerSlug}`;
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
    new RegExp(
      `(^|\\s|[–—-])${escapeRegExp(normalizedValue)}(?=$|\\s|[–—-])`,
      "gi"
    ),
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
  categorySlug,
}: {
  wine: Wine;
  categoryTitle: string;
  categorySlug: string;
}) {
  const image = getWineImage(wine);
  const name = getWineName(wine);
  const vintage = String(getWineVintage(wine));
  const price = getWinePrice(wine);
  const discount = getDiscountInfo(price, wine.compare_at_price);
  const href = getWineHref(wine);
  const stock = wine.stock ?? wine.quantity;
  const knownStock =
    stock !== undefined &&
    stock !== null &&
    String(stock).trim() !== "" &&
    Number.isFinite(Number(stock));

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-colors hover:border-[#8a1f1f]">
      <Link
        href={href}
        className="relative flex h-44 items-center justify-center p-3"
        aria-label={name}
      >
        {discount && (
          <span className="absolute left-3 top-3 rounded bg-[#8a1f1f] px-2 py-1 text-xs font-semibold text-white">
            −{discount.percent} %
          </span>
        )}

        {wine.rating && (
          <span className="absolute right-3 top-3 rounded bg-stone-100 px-2 py-1 text-xs text-stone-700">
            {wine.rating}
          </span>
        )}

        {image ? (
          <Image
            src={image}
            alt={name}
            width={180}
            height={160}
            sizes="180px"
            className="max-h-40 w-auto max-w-full object-contain"
          />
        ) : (
          <span className="text-sm text-stone-400">Photo à venir</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 pt-2">
        {wine.appellation ? (
          <Link
            href={getAppellationHref(wine.appellation, categorySlug)}
            className="text-xs text-stone-500 hover:text-[#8a1f1f]"
          >
            {wine.appellation}
          </Link>
        ) : (
          <p className="text-xs text-stone-500">
            {wine.region || categoryTitle}
          </p>
        )}

        <Link href={href} className="mt-2 hover:text-[#8a1f1f]">
          <h3 className="font-serif text-lg leading-snug">
            {name}
            {vintage && !name.includes(vintage) ? ` ${vintage}` : ""}
          </h3>
        </Link>

        {wine.producer && (
          <Link
            href={getProducerHref(wine.producer)}
            className="mt-1 text-xs text-stone-500 hover:text-[#8a1f1f]"
          >
            {wine.producer}
          </Link>
        )}

        <p className="mt-3 text-xs leading-5 text-stone-600">
          {[wine.bottle_size, wine.packaging].filter(Boolean).join(" · ")}
        </p>

        {wine.classification && (
          <p className="text-xs leading-5 text-stone-500">
            {wine.classification}
          </p>
        )}

        <div className="mt-auto pt-4">
          {discount && (
            <p className="text-xs text-stone-400 line-through">
              {formatPrice(wine.compare_at_price)}
            </p>
          )}

          <p className="text-lg font-semibold text-[#8a1f1f]">
            {formatPrice(price) || "Prix sur demande"}
          </p>

          <p className="mt-1 text-xs text-stone-500">
            {categorySlug === "primeurs-2025"
              ? "En précommande"
              : knownStock
                ? Number(stock) > 0
                  ? `${stock} unité${Number(stock) > 1 ? "s" : ""} disponible${Number(stock) > 1 ? "s" : ""}`
                  : "Indisponible"
                : "Disponibilité sur la fiche"}
          </p>

          <Link
            href={href}
            className="mt-3 block rounded border border-[#8a1f1f] px-3 py-2 text-center text-sm font-medium text-[#8a1f1f] transition-colors hover:bg-[#8a1f1f] hover:text-white"
          >
            Voir le vin
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BoutiqueClient({
  slug,
  categoryTitle,
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
    const winesToFilter = isAllSelectionsPage(slug, categoryTitle)
      ? wines.filter(isVisibleWine)
      : search
        ? wines.filter(isVisibleWine)
        : categoryWines;

    return winesToFilter
      .filter((wine) => {
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

        const matchesSearch = search
          ? wineMatchesSearch(wine, search)
          : true;

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

          if (rankA !== rankB) return rankA - rankB;

          return normalize(getWineName(a)).localeCompare(
            normalize(getWineName(b)),
            "fr"
          );
        }

        if (slug === "primeurs-2025") {
          const appellationA = normalize(a.appellation || a.region || "");
          const appellationB = normalize(b.appellation || b.region || "");

          if (appellationA !== appellationB) {
            return appellationA.localeCompare(appellationB, "fr");
          }

          return normalize(a.name || a.title || "").localeCompare(
            normalize(b.name || b.title || ""),
            "fr"
          );
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

          if (nameA !== nameB) return nameA.localeCompare(nameB, "fr");

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

        if (
          groupsByAppellation &&
          a.appellationRank !== b.appellationRank
        ) {
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
    type WineGroup = {
      title: string;
      wines: Wine[];
    };

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

  function resetFilters() {
    setSearch("");
    setSelectedAppellation("");
    setSelectedClassification("");
    setSelectedVintage("");
    setCurrentPage(1);
  }

  return (
    <section className="bg-white px-5 pb-12 text-stone-800 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 border-y border-stone-200 py-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-medium text-stone-600">
              Rechercher
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="search"
                placeholder="Nom, domaine, millésime…"
                className="mt-1 block w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-[#8a1f1f]"
              />
            </label>

            <label className="text-xs font-medium text-stone-600">
              Appellation
              <select
                value={selectedAppellation}
                onChange={(event) =>
                  setSelectedAppellation(event.target.value)
                }
                className="mt-1 block w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900"
              >
                <option value="">Toutes les appellations</option>
                {appellationOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-medium text-stone-600">
              Classification
              <select
                value={selectedClassification}
                onChange={(event) =>
                  setSelectedClassification(event.target.value)
                }
                className="mt-1 block w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900"
              >
                <option value="">Toutes les classifications</option>
                {classificationOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-medium text-stone-600">
              Millésime
              <select
                value={selectedVintage}
                onChange={(event) => setSelectedVintage(event.target.value)}
                className="mt-1 block w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900"
              >
                <option value="">Tous les millésimes</option>
                {vintageOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p role="status">
              {loading
                ? "Chargement…"
                : `${filteredWines.length} référence${filteredWines.length > 1 ? "s" : ""}`}
            </p>

            <div className="flex flex-wrap gap-4">
              {slug === "bordeaux" && (
                <Link
                  href="/boutique/primeurs-2025"
                  className="text-[#8a1f1f] hover:underline"
                >
                  Primeurs 2025
                </Link>
              )}

              {(search ||
                selectedAppellation ||
                selectedClassification ||
                selectedVintage) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[#8a1f1f] hover:underline"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          </div>

          {search && (
            <p className="mt-2 text-xs text-stone-500">
              La recherche porte sur toutes les régions.
            </p>
          )}
        </div>

        {!loading && errorMessage && (
          <p role="alert" className="py-8 text-center text-red-700">
            Impossible de charger les vins. Merci de réessayer dans
            quelques instants.
          </p>
        )}

        {!loading && !errorMessage && filteredWines.length === 0 && (
          <p className="py-8 text-center text-stone-600">
            Aucun vin ne correspond à ces critères.
          </p>
        )}

        {!loading && !errorMessage && groupedPaginatedWines.length > 0 && (
          <>
            <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {groupedPaginatedWines.flatMap((producer) =>
                producer.wineGroups.flatMap((group) =>
                  group.wines.map((wine) => (
                    <WineCard
                      key={wine.id}
                      wine={wine}
                      categoryTitle={categoryTitle}
                      categorySlug={slug}
                    />
                  ))
                )
              )}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Pagination des vins"
                className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded border border-stone-300 px-4 py-2 hover:border-[#8a1f1f] disabled:opacity-40"
                >
                  ← Précédent
                </button>

                <span aria-live="polite">
                  Page {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded border border-stone-300 px-4 py-2 hover:border-[#8a1f1f] disabled:opacity-40"
                >
                  Suivant →
                </button>
              </nav>
            )}
          </>
        )}

        {appellationEditorial && (
          <details className="mt-8 border-t border-stone-200 pt-4">
            <summary className="cursor-pointer text-sm text-[#8a1f1f]">
              En savoir plus sur {selectedAppellation}
            </summary>

            <EditorialBlock
              title={appellationEditorial.title}
              text={appellationEditorial.opinion}
            />
          </details>
        )}
      </div>
    </section>
  );
}