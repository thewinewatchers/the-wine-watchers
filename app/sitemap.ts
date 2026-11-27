import type { MetadataRoute } from "next";
import { blogPosts } from "@/app/blog/blogPosts";

const siteUrl = "https://www.thewinewatchers.com";

type SitemapWine = {
  slug: string | null;
  producer: string | null;
  vintage: string | number | null;
  appellation: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getComparableAppellationSlug(value?: string | null) {
  return slugify(String(value || ""))
    .replace(/^aoc-/, "")
    .replace(/-st-vivant(?=-|$)/, "-saint-vivant")
    .replace(/-monopole$/, "")
    .replace(/-grand-cru$/, "")
    .replace(/-premier-cru$/, "")
    .replace(/-1er-cru$/, "")
    .replace(/-aoc$/, "")
    .replace(/-docg$/, "")
    .replace(/-doc$/, "")
    .replace(/-igt$/, "")
    .replace(/-doca$/, "")
    .replace(/-do$/, "")
    .replace(/-vt$/, "")
    .replace(/-ava$/, "")
    .replace(/-american-viticultural-area$/, "")
    .replace(/-vino-de-la-tierra$/, "")
    .replace(/-denominacion-de-origen-calificada$/, "")
    .replace(/-denominacion-de-origen$/, "")
    .replace(/-denominazione-di-origine-controllata-e-garantita$/, "")
    .replace(/-denominazione-di-origine-controllata$/, "")
    .replace(/-indicazione-geografica-tipica$/, "")
    .replace(/-appellation-d-origine-controlee$/, "");
}

// Existing editorial pages retained even when temporarily without stock.
const editorialAppellations = [
  "pauillac",
  "margaux",
  "saint-julien",
  "saint-estephe",
  "pomerol",
  "saint-emilion",
  "pessac-leognan",
  "sauternes",
  "cote-de-nuits",
  "cote-de-beaune",
  "chablis",
  "meursault",
  "puligny-montrachet",
  "gevrey-chambertin",
  "vosne-romanee",
  "chambolle-musigny",
  "cote-rotie",
  "hermitage",
  "cornas",
  "toscana",
  "barolo",
  "barbaresco",
  "brunello-di-montalcino",
  "bolgheri",
  "ribera-del-duero",
  "rioja",
  "priorat",
  "toro",
  "rias-baixas",
  "napa-valley",
  "oakville",
  "rutherford",
  "stags-leap-district",
  "champagne",
];

// Only routes defined by the current appellation page, excluding redirects.
// Keep this list synchronized when new editorial routes are created.
const validAppellations = new Set([
  "pauillac",
  "margaux",
  "pomerol",
  "saint-emilion",
  "saint-julien",
  "saint-estephe",
  "pessac-leognan",
  "sauternes",
  "meursault",
  "cote-de-nuits",
  "cote-de-beaune",
  "chablis",
  "puligny-montrachet",
  "vosne-romanee",
  "gevrey-chambertin",
  "chambolle-musigny",
  "morey-saint-denis",
  "nuits-saint-georges",
  "vougeot",
  "flagey-echezeaux",
  "aloxe-corton",
  "pernand-vergelesses",
  "savigny-les-beaune",
  "beaune",
  "pommard",
  "volnay",
  "chassagne-montrachet",
  "saint-aubin",
  "auxey-duresses",
  "monthelie",
  "saint-romain",
  "corton",
  "corton-charlemagne",
  "clos-de-vougeot-grand-cru",
  "clos-de-la-roche",
  "clos-saint-denis",
  "clos-des-lambrays",
  "clos-de-tart",
  "musigny",
  "bonnes-mares",
  "chambertin",
  "chambertin-clos-de-beze",
  "chapelle-chambertin",
  "charmes-chambertin",
  "mazoyeres-chambertin",
  "mazis-chambertin",
  "griotte-chambertin",
  "latricieres-chambertin",
  "ruchottes-chambertin",
  "echezeaux",
  "grands-echezeaux",
  "richebourg",
  "romanee-saint-vivant",
  "la-tache",
  "romanee-conti",
  "la-romanee",
  "la-grande-rue",
  "montrachet",
  "chevalier-montrachet",
  "batard-montrachet",
  "bienvenues-batard-montrachet",
  "criots-batard-montrachet",
  "bolgheri",
  "bolgheri-doc",
  "bolgheri-superiore",
  "bolgheri-sassicaia",
  "bolgheri-sassicaia-doc",
  "toscana",
  "toscana-igt",
  "brunello-di-montalcino",
  "brunello-di-montalcino-docg",
  "montalcino",
  "barolo",
  "barolo-docg",
  "barbaresco",
  "barbaresco-docg",
  "ribera-del-duero",
  "ribera-del-duero-do",
  "rioja",
  "rioja-doca",
  "priorat",
  "priorat-doca",
  "castille-et-leon",
  "castilla-y-leon",
  "castilla-y-leon-vt",
  "toro",
  "toro-do",
  "rias-baixas",
  "rias-baixas-do",
  "cote-rotie",
  "champagne",
  "napa-valley",
  "napa-valley-ava",
  "oakville",
  "oakville-ava",
  "rutherford",
  "rutherford-ava",
  "yountville",
  "yountville-ava",
  "st-helena",
  "st-helena-ava",
  "stags-leap-district",
  "stags-leap-district-ava",
  "californie",
  "california",
  "hermitage",
  "cote-des-bar",
  "cornas",
  "piemont",
  "sonoma",
  "chateauneuf-du-pape",
  "saint-joseph",
  "vallee-de-la-marne",
  "gigondas",
  "montagne-de-reims",
  "cote-des-blancs",
]);

function getAppellationSlug(value: string | null) {
  const normalized = getComparableAppellationSlug(value);
  if (normalized === "clos-de-vougeot") return "clos-de-vougeot-grand-cru";
  if (validAppellations.has(normalized)) return normalized;
  return null;
}

function normalizeVintage(value: string | number | null) {
  if (value === null || value === undefined) return null;
  const year = String(value).trim();
  return /^\d{4}$/.test(year) ? year : null;
}

async function getSitemapWines(): Promise<SitemapWine[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseKey) throw new Error("Configuration Supabase manquante");
  const wines: SitemapWine[] = [];
  const pageSize = 500;
  for (let offset = 0; ; offset += pageSize) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/wines?or=(hidden_from_site.eq.false,hidden_from_site.is.null)&slug=not.is.null&select=slug,producer,vintage,appellation&order=id.asc&offset=${offset}&limit=${pageSize}`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, next: { revalidate: 3600 } }
    );
    if (!response.ok) throw new Error(`Erreur sitemap Supabase : ${response.status}`);
    const batch: SitemapWine[] = await response.json();
    wines.push(...batch);
    if (batch.length < pageSize) break;
  }
  return wines;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const wines = await getSitemapWines();
  const pagesPrincipales: MetadataRoute.Sitemap = [
    "", "/boutique", "/boutique/bordeaux", "/boutique/bourgogne", "/boutique/rhone",
    "/boutique/italie", "/boutique/espagne", "/boutique/usa", "/boutique/champagne",
    "/boutique/primeurs-2025", "/offres", "/millesimes", "/blog", "/a-propos",
    "/livraison", "/mentions-legales", "/politique-de-confidentialite", "/politique-cookies",
  ].map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : path === "/millesimes" ? 0.9 : 0.8 }));

  const appellations = new Set(editorialAppellations);
  for (const wine of wines) {
    const slug = getAppellationSlug(wine.appellation);
    if (slug) appellations.add(slug);
  }
  const pagesAppellations: MetadataRoute.Sitemap = Array.from(appellations).sort().map((slug) => ({
    url: `${siteUrl}/appellation/${slug}`, changeFrequency: "weekly", priority: 0.85,
  }));
  const pagesVins: MetadataRoute.Sitemap = Array.from(new Set(wines.map((wine) => wine.slug?.trim()).filter((slug): slug is string => Boolean(slug)))).map((slug) => ({
    url: `${siteUrl}/boutique/vin/${slug}`, changeFrequency: "monthly", priority: 0.85,
  }));
  const producers = Array.from(new Set(wines.map((wine) => slugify(wine.producer || "")).map((slug) => slug === "opus-one-winery" ? "opus-one" : slug === "armand-rousseau" ? "domaine-armand-rousseau" : slug).filter(Boolean)));
  const pagesProducteurs: MetadataRoute.Sitemap = producers.map((slug) => ({
    url: `${siteUrl}/producteur/${slug}`, changeFrequency: "weekly", priority: 0.8,
  }));
  const vintages = Array.from(new Set(wines.map((wine) => normalizeVintage(wine.vintage)).filter((year): year is string => Boolean(year)))).sort((a,b) => Number(b)-Number(a));
  const pagesMillesimes: MetadataRoute.Sitemap = vintages.map((year) => ({
    url: `${siteUrl}/millesime/${year}`, changeFrequency: "weekly", priority: 0.85,
  }));
  const pagesBlog: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`, changeFrequency: "monthly", priority: 0.75,
  }));
  return [...pagesPrincipales, ...pagesAppellations, ...pagesProducteurs, ...pagesMillesimes, ...pagesVins, ...pagesBlog];
}
