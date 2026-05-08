import { supabase } from "@/lib/supabaseClient";
import { wines as fallbackWines } from "@/data/wines";

export type Wine = {
  slug: string;
  name: string;
  region: string;
  vintage: string;
  price: string;
  image: string;
  category: string;
  rating: string;

  seoTitle: string;
  seoDescription: string;
  keywords: string[];

  producer: string;
  appellation: string;
  country: string;
  color: string;
  grapeVarieties: string[];
  classification: string;
  soil: string;
  style: string;

  description: string;
  story: string;
  tastingNotes: string[];
  nose: string;
  palate: string;
  pairing: string;
  servingTemperature: string;
  agingPotential: string;
  metaContent: string;
};

type SupabaseWine = {
  slug: string;
  name: string;
  region: string | null;
  vintage: string | null;
  price: string | null;
  image: string | null;
  category: string | null;
  rating: string | null;

  seo_title: string | null;
  seo_description: string | null;
  keywords: string[] | null;

  producer: string | null;
  appellation: string | null;
  country: string | null;
  color: string | null;
  grape_varieties: string[] | null;
  classification: string | null;
  soil: string | null;
  style: string | null;

  description: string | null;
  story: string | null;
  tasting_notes: string[] | null;
  nose: string | null;
  palate: string | null;
  pairing: string | null;
  serving_temperature: string | null;
  aging_potential: string | null;
  meta_content: string | null;
};

function convertWine(vin: SupabaseWine): Wine {
  return {
    slug: vin.slug,
    name: vin.name,
    region: vin.region || "",
    vintage: vin.vintage || "",
    price: vin.price || "",
    image: vin.image || "",
    category: vin.category || "",
    rating: vin.rating || "",

    seoTitle: vin.seo_title || "",
    seoDescription: vin.seo_description || "",
    keywords: vin.keywords || [],

    producer: vin.producer || "",
    appellation: vin.appellation || "",
    country: vin.country || "",
    color: vin.color || "",
    grapeVarieties: vin.grape_varieties || [],
    classification: vin.classification || "",
    soil: vin.soil || "",
    style: vin.style || "",

    description: vin.description || "",
    story: vin.story || "",
    tastingNotes: vin.tasting_notes || [],
    nose: vin.nose || "",
    palate: vin.palate || "",
    pairing: vin.pairing || "",
    servingTemperature: vin.serving_temperature || "",
    agingPotential: vin.aging_potential || "",
    metaContent: vin.meta_content || "",
  };
}

export async function getWines(): Promise<Wine[]> {
  const { data, error } = await supabase
    .from("wines")
    .select("*")
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("Erreur Supabase getWines:", error?.message);
    return fallbackWines as Wine[];
  }

  return data.map((vin) => convertWine(vin as SupabaseWine));
}

export async function getWineBySlug(slug: string): Promise<Wine | undefined> {
  if (!slug) {
    return undefined;
  }

  const { data, error } = await supabase
    .from("wines")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erreur Supabase getWineBySlug:", error.message);
    return (fallbackWines as Wine[]).find((wine) => wine.slug === slug);
  }

  if (!data) {
    return (fallbackWines as Wine[]).find((wine) => wine.slug === slug);
  }

  return convertWine(data as SupabaseWine);
}