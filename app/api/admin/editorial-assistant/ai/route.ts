import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AiSection =
  | "story"
  | "additional_information"
  | "tasting_notes"
  | "food_pairings"
  | "tww_opinion"
  | "seo_title"
  | "seo_description";

type WineContext = {
  id?: string | null;
  name?: string | null;
  producer?: string | null;
  appellation?: string | null;
  region?: string | null;
  country?: string | null;
  vintage?: string | number | null;
  grapes?: string[] | string | null;
  color?: string | null;
  existingContent?: string | null;
};

type AiRequestBody = {
  section?: AiSection;
  wine?: WineContext;
};

const SECTION_LABELS: Record<AiSection, string> = {
  story: "Histoire du vin",
  additional_information: "Informations complémentaires",
  tasting_notes: "Notes de dégustation",
  food_pairings: "Accords mets-vins",
  tww_opinion: "Avis The Wine Watchers",
  seo_title: "Title SEO",
  seo_description: "Meta description",
};

function normalizeValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "Non renseigné";

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ");
  }

  return String(value).trim() || "Non renseigné";
}

function getSectionInstructions(section: AiSection) {
  if (section === "story") {
    return `
Rédige une section "Histoire du vin" élégante et documentée.
Objectif : environ 900 à 1 400 caractères.
Présente le domaine, le terroir, la cuvée et son identité.
Ne fabrique jamais de fait historique, de date, de classement ou de donnée technique non fournie.
Si une information manque, reste général plutôt que d'inventer.
`;
  }

  if (section === "additional_information") {
    return `
Rédige des "Informations complémentaires" utiles et premium.
Objectif : environ 500 à 900 caractères.
Apporte du contexte sur le style du vin, son terroir, son élevage ou sa place dans la gamme uniquement si cela peut être formulé sans inventer de faits précis.
Évite de répéter l'Histoire du vin.
`;
  }

  if (section === "tasting_notes") {
    return `
Rédige des notes de dégustation structurées et crédibles.
Objectif : environ 500 à 800 caractères.
Décris le nez, la bouche, la texture, l'équilibre, la finale et l'évolution possible.
N'invente pas une dégustation prétendument réalisée par The Wine Watchers.
Présente le texte comme une description éditoriale du style attendu du vin.
`;
  }

  if (section === "food_pairings") {
    return `
Rédige des accords mets-vins précis et gastronomiques.
Objectif : environ 350 à 600 caractères.
Propose plusieurs accords cohérents avec le style du vin.
Explique brièvement pourquoi ils fonctionnent.
Évite les listes interminables et les accords fantaisistes.
`;
  }

  if (section === "tww_opinion") {
    return `
Rédige un "Avis The Wine Watchers" distinctif, élégant et crédible.
Objectif : environ 450 à 700 caractères.
Le texte doit expliquer pourquoi ce vin mérite l'attention, sa personnalité, sa précision et son intérêt pour l'amateur.
Ne prétends pas que le vin a été dégusté si cette information n'est pas fournie.
Évite les superlatifs creux et le ton publicitaire agressif.
`;
  }

  if (section === "seo_title") {
    return `
Rédige uniquement un Title SEO.
Longueur cible : 45 à 60 caractères.
Inclure naturellement le nom du vin et, si pertinent, le producteur et le millésime.
Ne mets aucun commentaire autour du Title.
`;
  }

  return `
Rédige uniquement une meta description.
Longueur cible : 140 à 160 caractères.
Elle doit être informative, élégante et donner envie de cliquer sans langage promotionnel excessif.
Inclure naturellement le vin, le producteur ou l'appellation si pertinent.
Ne mets aucun commentaire autour de la meta description.
`;
}

function buildPrompt(section: AiSection, wine: WineContext) {
  return `
SECTION À RÉDIGER
${SECTION_LABELS[section]}

INFORMATIONS DISPONIBLES
Vin : ${normalizeValue(wine.name)}
Producteur : ${normalizeValue(wine.producer)}
Appellation : ${normalizeValue(wine.appellation)}
Région : ${normalizeValue(wine.region)}
Pays : ${normalizeValue(wine.country)}
Millésime : ${normalizeValue(wine.vintage)}
Cépages : ${normalizeValue(wine.grapes)}
Couleur : ${normalizeValue(wine.color)}

CONTENU ACTUEL
${normalizeValue(wine.existingContent)}

CONSIGNE SPÉCIFIQUE
${getSectionInstructions(section)}

Retourne uniquement la proposition finale destinée à être affichée dans l'atelier éditorial.
`;
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "Variable d’environnement manquante : OPENAI_API_KEY",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as AiRequestBody;

    if (!body.section || !SECTION_LABELS[body.section]) {
      return NextResponse.json(
        {
          error: "Section éditoriale invalide.",
        },
        { status: 400 }
      );
    }

    if (!body.wine || !body.wine.name) {
      return NextResponse.json(
        {
          error: "Informations du vin insuffisantes.",
        },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.5",
      instructions: `
Tu es l'assistant éditorial de The Wine Watchers, maison spécialisée dans les grands vins.

LIGNE ÉDITORIALE
- français naturel, précis et élégant ;
- ton premium, sobre et cultivé ;
- aucune emphase commerciale excessive ;
- aucune formule générique du type "une expérience inoubliable" ;
- aucune invention factuelle ;
- aucune note, récompense, date, classification, méthode d'élevage ou donnée historique non fournie ;
- pas de citation inventée ;
- pas de Markdown ;
- pas de titre ajouté sauf si explicitement demandé ;
- respecter la terminologie du vin ;
- privilégier la précision, la lisibilité et la valeur éditoriale.

Le texte sera relu par un humain avant toute éventuelle publication.
`,
      input: buildPrompt(body.section, body.wine),
    });

    const proposal = response.output_text?.trim();

    if (!proposal) {
      return NextResponse.json(
        {
          error: "L’IA n’a retourné aucune proposition.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      section: body.section,
      sectionLabel: SECTION_LABELS[body.section],
      proposal,
      model: "gpt-5.5",
      requestId: response._request_id || null,
    });
  } catch (error) {
    console.error("Erreur Assistant IA :", error);

    let details =
      error instanceof Error ? error.message : String(error);

    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status?: unknown }).status === "number"
    ) {
      const status = (error as { status: number }).status;

      if (status === 401) {
        details = "Clé API OpenAI invalide ou non autorisée.";
      } else if (status === 429) {
        details =
          "Quota ou limite OpenAI atteinte. Vérifiez le crédit et les limites du projet.";
      }
    }

    return NextResponse.json(
      {
        error: "Impossible de générer la proposition éditoriale.",
        details,
      },
      { status: 500 }
    );
  }
}