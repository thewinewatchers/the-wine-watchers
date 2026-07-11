"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type PremiumSearchWine = {
  id: string;
  slug?: string;
  name?: string;
  title?: string;
  chateau?: string;
  vintage?: string | number;
  millesime?: string | number;
  price?: string | number;
  prix?: string | number;
  producer?: string;
  appellation?: string;
  region?: string;
  category?: string;
  categorie?: string;
  image_url?: string;
  image?: string;
  imageUrl?: string;
  bottle_size?: string;
  packaging?: string;
  hidden_from_site?: boolean | null;
};

type SearchSuggestion = {
  id: string;
  type: "wine" | "producer" | "appellation" | "region";
  label: string;
  vintage?: string;
  producer?: string;
  location?: string;
  price?: string;
  href?: string;
  image?: string;
  value?: string;
};

type PremiumSearchProps = {
  wines: PremiumSearchWine[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function normalize(value?: string | number | null) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWineName(wine: PremiumSearchWine) {
  return wine.name || wine.title || wine.chateau || "Vin sans nom";
}

function getWineVintage(wine: PremiumSearchWine) {
  return String(wine.vintage || wine.millesime || "").trim();
}

function getWineImage(wine: PremiumSearchWine) {
  return wine.image_url || wine.imageUrl || wine.image || "";
}

function getWineHref(wine: PremiumSearchWine) {
  return `/boutique/vin/${wine.slug || wine.id}`;
}

function parsePrice(price?: string | number) {
  if (price === undefined || price === null || price === "") return 0;

  if (typeof price === "number") {
    return Number.isNaN(price) ? 0 : price;
  }

  const raw = String(price).trim();

  if (!raw) return 0;

  const cleaned = raw
    .replace(/[€\s]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatPrice(price?: string | number) {
  const value = parsePrice(price);

  if (value <= 0) return "";

  return (
    value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € HT"
  );
}

function getMatchScore(
  query: string,
  values: Array<string | number | undefined | null>
) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return 0;

  let bestScore = 0;

  values.forEach((value) => {
    const normalizedValue = normalize(value);

    if (!normalizedValue) return;

    if (normalizedValue === normalizedQuery) {
      bestScore = Math.max(bestScore, 100);
      return;
    }

    if (normalizedValue.startsWith(normalizedQuery)) {
      bestScore = Math.max(bestScore, 85);
      return;
    }

    const words = normalizedValue.split(" ");

    if (words.some((word) => word.startsWith(normalizedQuery))) {
      bestScore = Math.max(bestScore, 70);
      return;
    }

    if (normalizedValue.includes(normalizedQuery)) {
      bestScore = Math.max(bestScore, 55);
    }
  });

  return bestScore;
}

export default function PremiumSearch({
  wines,
  value,
  onChange,
  placeholder = "Rechercher un domaine, un cru, un millésime...",
}: PremiumSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const visibleWines = useMemo(
    () => wines.filter((wine) => wine.hidden_from_site !== true),
    [wines]
  );

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    const normalizedQuery = normalize(value);

    if (normalizedQuery.length < 1) return [];

    const wineSuggestions = visibleWines
      .map((wine) => {
        const name = getWineName(wine);
        const vintage = getWineVintage(wine);

        const score = getMatchScore(value, [
          name,
          wine.producer,
          wine.appellation,
          wine.region,
          vintage,
          wine.category,
          wine.categorie,
          wine.bottle_size,
          wine.packaging,
        ]);

        return {
          wine,
          score,
          name,
          vintage,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;

        const nameComparison = a.name.localeCompare(b.name, "fr");

        if (nameComparison !== 0) return nameComparison;

        return Number(b.vintage || 0) - Number(a.vintage || 0);
      })
      .slice(0, 8)
      .map<SearchSuggestion>(({ wine, name, vintage }) => ({
        id: `wine-${wine.id}`,
        type: "wine",
        label: name,
        vintage,
        producer: wine.producer || "",
        location: wine.appellation || wine.region || "",
        price: formatPrice(wine.price || wine.prix),
        href: getWineHref(wine),
        image: getWineImage(wine),
      }));

    const createTextSuggestions = (
      type: "producer" | "appellation" | "region",
      values: Array<string | undefined>
    ) => {
      const uniqueValues = Array.from(
        new Set(values.map((item) => String(item || "").trim()).filter(Boolean))
      );

      return uniqueValues
        .map((item) => ({
          item,
          score: getMatchScore(value, [item]),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => {
          if (a.score !== b.score) return b.score - a.score;

          return a.item.localeCompare(b.item, "fr");
        })
        .slice(0, 3)
        .map<SearchSuggestion>(({ item }) => ({
          id: `${type}-${normalize(item)}`,
          type,
          label: item,
          value: item,
        }));
    };

    const producerSuggestions = createTextSuggestions(
      "producer",
      visibleWines.map((wine) => wine.producer)
    );

    const appellationSuggestions = createTextSuggestions(
      "appellation",
      visibleWines.map((wine) => wine.appellation)
    );

    const regionSuggestions = createTextSuggestions(
      "region",
      visibleWines.map((wine) => wine.region)
    );

    return [
      ...wineSuggestions,
      ...producerSuggestions,
      ...appellationSuggestions,
      ...regionSuggestions,
    ];
  }, [value, visibleWines]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(-1);

    if (value.trim()) {
      setIsOpen(true);
    }
  }, [value]);

  function selectSuggestion(suggestion: SearchSuggestion) {
    setIsOpen(false);
    setActiveIndex(-1);

    if (suggestion.type === "wine" && suggestion.href) {
      router.push(suggestion.href);
      return;
    }

    if (suggestion.value) {
      onChange(suggestion.value);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen || suggestions.length === 0) {
      if (event.key === "ArrowDown" && value.trim()) {
        setIsOpen(true);
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((current) =>
        current >= suggestions.length - 1 ? 0 : current + 1
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1
      );

      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      const suggestion = suggestions[activeIndex];

      if (suggestion) {
        selectSuggestion(suggestion);
      }
    }
  }

  function getTypeLabel(type: SearchSuggestion["type"]) {
    if (type === "wine") return "Vin";
    if (type === "producer") return "Domaine";
    if (type === "appellation") return "Appellation";

    return "Région";
  }

  function getTypeIcon(type: SearchSuggestion["type"]) {
    if (type === "wine") return "🍷";
    if (type === "producer") return "🏰";
    if (type === "appellation") return "📍";

    return "🌍";
  }

  return (
    <div ref={containerRef} className="relative z-40">
      <div
        className={`relative flex items-center rounded-full border bg-white shadow-sm transition ${
          isOpen && value.trim()
            ? "border-[#8a1f1f] ring-4 ring-[#8a1f1f]/10"
            : "border-[#d8c6ae]"
        }`}
      >
        <div className="pointer-events-none absolute left-5 text-[#8a6a2f]">
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
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => {
            if (value.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          type="search"
          placeholder={placeholder}
          autoComplete="off"
          aria-label="Rechercher un vin"
          aria-expanded={isOpen}
          className="w-full rounded-full bg-transparent py-3 pl-13 pr-12 text-sm text-[#24110d] outline-none placeholder:text-[#9b8c7d]"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#f2e8dc] text-sm text-[#6d5b50] transition hover:bg-[#8a1f1f] hover:text-white"
            aria-label="Effacer la recherche"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && value.trim() && (
        <div className="fixed left-4 right-4 top-20 z-50 flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-[1.5rem] border border-[#d8c6ae] bg-[#fffaf3] shadow-2xl lg:absolute lg:left-0 lg:right-auto lg:top-[calc(100%+0.75rem)] lg:h-auto lg:max-h-[620px] lg:w-[760px]">
          <div className="shrink-0 border-b border-[#eadfce] bg-[#24110d] px-5 py-4">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d8b56d]">
                  Recherche instantanée
                </p>

                <p className="mt-1 text-xs text-white/60">
                  {suggestions.length} résultat
                  {suggestions.length > 1 ? "s" : ""}
                </p>
              </div>

              <p className="hidden text-[10px] leading-5 text-white/55 md:block">
                ↑ ↓ naviguer
                <br />
                Entrée ouvrir · Échap fermer
              </p>
            </div>
          </div>

          {suggestions.length > 0 ? (
            <div className="flex-1 overflow-y-auto p-2.5">
              {suggestions.map((suggestion, index) => {
                const isActive = activeIndex === index;

                return (
                  <button
                    key={suggestion.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectSuggestion(suggestion)}
                    className={`flex w-full items-center gap-4 rounded-[1.1rem] border px-3 py-3.5 text-left transition ${
                      isActive
                        ? "border-[#8a1f1f] bg-[#8a1f1f] text-white"
                        : "border-transparent text-[#24110d] hover:border-[#dfcfb8] hover:bg-[#f1e4d4]"
                    }`}
                  >
                    {suggestion.type === "wine" ? (
                      <div
                        className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-1.5 sm:h-24 sm:w-24 ${
                          isActive
                            ? "border-white/25 bg-white/10"
                            : "border-[#dfcfb8] bg-[#efe3d2]"
                        }`}
                      >
                        {suggestion.image ? (
                          <img
                            src={suggestion.image}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-2xl">🍷</span>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl ${
                          isActive ? "bg-white/10" : "bg-[#efe3d2]"
                        }`}
                      >
                        {getTypeIcon(suggestion.type)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start gap-2">
                        <h3 className="min-w-0 flex-1 font-serif text-lg leading-6 sm:text-xl">
                          {suggestion.label}
                        </h3>

                        {suggestion.vintage && (
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              isActive
                                ? "bg-white/15 text-white"
                                : "border border-[#d8c6ae] bg-white text-[#6d5b50]"
                            }`}
                          >
                            {suggestion.vintage}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-[#24110d] text-[#d8b56d]"
                          }`}
                        >
                          {getTypeLabel(suggestion.type)}
                        </span>

                        {suggestion.producer &&
                          normalize(suggestion.producer) !==
                            normalize(suggestion.label) && (
                            <span
                              className={`text-xs font-medium ${
                                isActive
                                  ? "text-white/85"
                                  : "text-[#6d5b50]"
                              }`}
                            >
                              {suggestion.producer}
                            </span>
                          )}
                      </div>

                      {(suggestion.location || suggestion.price) && (
                        <div
                          className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${
                            isActive ? "text-white/70" : "text-[#7d6b5e]"
                          }`}
                        >
                          {suggestion.location && (
                            <span>{suggestion.location}</span>
                          )}

                          {suggestion.location && suggestion.price && (
                            <span aria-hidden="true">•</span>
                          )}

                          {suggestion.price && (
                            <span className="font-semibold">
                              {suggestion.price}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <span
                      className={`shrink-0 text-xl ${
                        isActive ? "text-white" : "text-[#8a6a2f]"
                      }`}
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-[#8a6a2f]">
                Aucun résultat immédiat
              </p>

              <p className="mt-3 text-sm leading-6 text-[#6d5b50]">
                La recherche complète du catalogue reste appliquée sous le
                moteur de recherche.
              </p>
            </div>
          )}

          <div className="shrink-0 border-t border-[#eadfce] bg-white px-5 py-3">
            <p className="text-[11px] leading-5 text-[#7d6b5e]">
              Recherchez un vin, un château, un domaine, une appellation, une
              région ou un millésime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}