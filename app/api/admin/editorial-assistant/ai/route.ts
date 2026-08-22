import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AiSection =
  | "description"
  | "story"
  | "nose"
  | "palate"
  | "serving_temperature"
  | "aging_potential"
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
  description: "Description du vin",
  story: "Histoire du vin",
  nose: "Nez",
  palate: "Bouche",
  serving_temperature: "Température de service",
  aging_potential: "Potentiel de garde",
  additional_information: "Informations complémentaires",
  tasting_notes: "Notes de dégustation",
  food_pairings: "Accords mets-vins",
  tww_opinion: "Avis The Wine Watchers",
  seo_title: "Title SEO",
  seo_description: "Meta description",
};

function normalizeValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "Non renseigné";
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ");
  }

  return String(value).trim() || "Non renseigné";
}

function getSectionInstructions(section: AiSection) {
  if (section === "description") {
    return `
Rédige ou améliore la description principale du vin.

Objectif : environ 700 à 1 200 caractères.

La description doit présenter clairement :
- l'identité du vin ;
- son domaine ou producteur ;
- son appellation et son terroir lorsque ces informations peuvent être vérifiées ;
- son style ;
- sa personnalité ;
- son intérêt pour l'amateur de grands vins.

Recherche les informations fiables nécessaires avant de rédiger.

Évite de répéter mot pour mot l'Histoire du vin ou l'Avis The Wine Watchers.

Si un contenu actuel est fourni, conserve ses informations fiables, corrige les éventuelles imprécisions et enrichis réellement le contenu.

Ne remplis jamais artificiellement le texte pour atteindre la longueur cible.
`;
  }

  if (section === "nose") {
    return `
Rédige uniquement la rubrique "Nez".

Objectif : environ 120 à 250 caractères.

Recherche si nécessaire des informations crédibles sur le profil aromatique du vin, du millésime ou de la cuvée.

Décris le profil aromatique avec précision et sobriété.

Évite les accumulations interminables de fruits, fleurs et épices.

Ne prétends jamais que The Wine Watchers a personnellement dégusté le vin.
`;
  }

  if (section === "palate") {
    return `
Rédige uniquement la rubrique "Bouche".

Objectif : environ 140 à 300 caractères.

Recherche des informations fiables sur le style du vin et, lorsque cela est pertinent, du millésime.

Décris :
- l'attaque ;
- la matière ;
- la texture ;
- l'équilibre ;
- la structure ;
- la finale.

Ne prétends jamais à une dégustation personnelle par The Wine Watchers.
`;
  }

  if (section === "serving_temperature") {
    return `
Recherche la température de service généralement recommandée pour ce vin ou ce type de vin.

Retourne uniquement une température ou une plage de température.

Exemple :
16 à 18 °C

Aucun commentaire supplémentaire.
`;
  }

  if (section === "aging_potential") {
    return `
Recherche les informations disponibles sur le potentiel de garde du vin, du millésime ou d'exemples comparables du même domaine.

Retourne une recommandation concise et prudente.

Exemple :
À boire dès maintenant ou à conserver 10 à 15 ans.

Ne présente jamais une estimation de garde comme une certitude absolue.
`;
  }

  if (section === "story") {
    return `
Rédige une véritable section "Histoire du vin", documentée, précise et élégante.

Objectif : environ 1 500 à 2 500 caractères.

Effectue une recherche documentaire sérieuse avant de rédiger.

Lorsque les sources permettent de les établir, explique notamment :
- l'histoire du domaine ou du producteur ;
- la naissance ou la place de la cuvée ;
- le vignoble concerné ;
- le terroir ;
- les parcelles importantes ;
- l'appellation ;
- les éléments historiques réellement pertinents ;
- la singularité de ce vin dans la production du domaine.

Ne transforme pas cette rubrique en simple note de dégustation.

Les dates, classements, superficies, parcelles, personnes, méthodes de production et autres faits précis doivent provenir d'informations vérifiables.

Si une information n'est pas suffisamment confirmée, ne l'affirme pas.

Privilégie la qualité documentaire à l'accumulation de faits.
`;
  }

  if (section === "additional_information") {
    return `
Rédige des "Informations complémentaires" réellement utiles.

Objectif : environ 800 à 1 300 caractères.

Effectue une recherche web avant de rédiger.

Cette rubrique doit compléter les autres sections et peut notamment apporter, lorsque cela est vérifiable :
- des précisions sur le terroir ;
- les sols ;
- l'exposition ;
- les cépages ;
- la viticulture ;
- la vinification ;
- l'élevage ;
- les particularités du millésime ;
- la place du vin dans la gamme du domaine ;
- les caractéristiques de production pertinentes.

Évite de répéter l'Histoire du vin.

N'invente jamais une donnée technique absente des sources fiables.
`;
  }

  if (section === "tasting_notes") {
    return `
Rédige des notes de dégustation éditoriales structurées et crédibles.

Objectif : environ 700 à 1 100 caractères.

Recherche les informations disponibles sur le profil du vin et, lorsqu'il est renseigné, sur le millésime.

Décris de manière cohérente :
- le nez ;
- la bouche ;
- la matière ;
- la texture ;
- l'équilibre ;
- la finale ;
- l'évolution possible.

Tu peux synthétiser les caractéristiques régulièrement décrites par des sources fiables, mais ne copie jamais leurs textes.

Ne cite pas de critique et ne reproduis pas de note chiffrée sauf demande explicite.

Ne prétends jamais que cette dégustation a été réalisée personnellement par The Wine Watchers.
`;
  }

  if (section === "food_pairings") {
    return `
Rédige des accords mets-vins précis et gastronomiques.

Objectif : environ 450 à 750 caractères.

Tiens compte du style réel du vin après recherche.

Propose plusieurs accords cohérents et explique brièvement pourquoi ils fonctionnent.

Privilégie une approche gastronomique adaptée au positionnement premium de The Wine Watchers.

Évite les listes interminables, les banalités et les associations fantaisistes.
`;
  }

  if (section === "tww_opinion") {
    return `
Rédige un "Avis The Wine Watchers" distinctif, précis, élégant et crédible.

Objectif : environ 600 à 1 000 caractères.

Avant de rédiger, recherche suffisamment d'informations sur :
- le vin précis concerné ;
- le producteur ou domaine ;
- le cru, l'appellation et le terroir lorsque cela est pertinent ;
- le millésime lorsqu'il est renseigné ;
- la place de cette cuvée dans la gamme du domaine ;
- son style et son potentiel d'évolution lorsque ces éléments sont documentables.

L'avis doit porter prioritairement sur la bouteille ou la cuvée concernée, et non seulement sur la réputation générale du domaine.

Il doit expliquer de manière naturelle et argumentée :
- ce qui distingue ce vin ou ce cru ;
- la manière dont le domaine interprète ce terroir ;
- la personnalité du millésime lorsqu'elle peut être établie ;
- les qualités qui justifient sa présence dans la sélection The Wine Watchers ;
- son intérêt pour l'amateur ou le collectionneur lorsque cela est réellement pertinent.

Le texte doit être suffisamment spécifique pour qu'il ne puisse pas être repris tel quel pour un autre vin.

Lorsque le millésime est renseigné, évite de produire un avis qui pourrait s'appliquer indistinctement à tous les millésimes du même domaine.

Lorsque le cru ou la cuvée possède une identité particulière, fais-la apparaître clairement.

Il s'agit d'un avis éditorial The Wine Watchers, et non d'une compilation d'avis de critiques.

Ne cite pas de concurrent, de marchand ou de critique.

Ne reproduis aucune note chiffrée dans cette rubrique sauf demande explicite.

Ne prétends jamais que The Wine Watchers a dégusté personnellement le vin si cela n'est pas établi.

Évite les superlatifs creux, le ton publicitaire agressif et les formulations génériques réutilisables.

Évite notamment les matrices répétitives du type :
- "la noblesse de ses arômes" ;
- "la précision de son interprétation" ;
- "sa capacité à exprimer un terroir d'exception" ;
- ou toute succession de formules abstraites qui pourrait convenir à de nombreux vins sans distinction.

Privilégie toujours des éléments concrets propres au domaine, au cru, au millésime ou au style du vin.

La conclusion doit, lorsque cela est naturel, expliquer en une phrase pourquoi cette bouteille trouve sa place dans la sélection The Wine Watchers, sans appel commercial ni formule promotionnelle.
`;
  }

  if (section === "seo_title") {
    return `
Rédige uniquement un Title SEO.

Longueur cible : 45 à 60 caractères.

Recherche si nécessaire la dénomination correcte du vin.

Inclure naturellement :
- le nom du vin ;
- le producteur lorsqu'il apporte de la pertinence ;
- le millésime lorsqu'il est renseigné et utile.

Le résultat doit être naturel et destiné à Google.

Aucun commentaire autour du Title.
`;
  }

  return `
Rédige uniquement une meta description.

Longueur cible : 140 à 160 caractères.

Elle doit être :
- informative ;
- précise ;
- élégante ;
- attractive dans les résultats Google ;
- sans langage commercial excessif.

Recherche si nécessaire les informations permettant de mieux caractériser le vin.

Inclure naturellement le vin, le producteur, l'appellation ou le millésime lorsque pertinent.

Aucun commentaire autour de la meta description.
`;
}

function buildPrompt(section: AiSection, wine: WineContext) {
  return `
SECTION À RÉDIGER
${SECTION_LABELS[section]}

INFORMATIONS DISPONIBLES DANS THE WINE WATCHERS

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

MISSION

Avant de rédiger, effectue une recherche web sur ce vin et son producteur.

Ne considère pas les informations de la fiche comme la seule source disponible.

Cherche notamment, lorsque cela est pertinent :
- le site officiel du domaine ou du producteur ;
- les organismes officiels d'appellation ;
- les interprofessions ;
- les fiches techniques officielles ;
- les importateurs reconnus ;
- les marchands et publications spécialisées disposant d'informations détaillées ;
- plusieurs sources indépendantes lorsqu'un fait mérite d'être confirmé.

Les informations trouvées sur Internet servent à documenter le texte.

Ne copie jamais les formulations d'une source.

Synthétise les informations et produis un texte original correspondant à la ligne éditoriale The Wine Watchers.

En cas d'informations contradictoires, privilégie les sources officielles ou les informations les mieux documentées.

N'intègre pas dans le texte final les URL, noms de sites consultés ou références bibliographiques, sauf demande explicite.

CONSIGNE SPÉCIFIQUE

${getSectionInstructions(section)}

Retourne uniquement la proposition finale destinée à être affichée dans l'atelier éditorial.
`;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Variable d’environnement manquante : OPENAI_API_KEY",
        },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey,
    });

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

      tools: [
        {
          type: "web_search",
          search_context_size: "high",
        },
      ],

      tool_choice: "required",

      instructions: `
Tu es l'assistant éditorial de The Wine Watchers, maison spécialisée dans les grands vins.

MISSION GÉNÉRALE

Tu ne dois pas simplement reformuler les quelques informations présentes dans la fiche.

Pour chaque demande, effectue une recherche web afin de disposer d'un contexte documentaire plus riche avant de rédiger.

L'objectif est de produire des contenus éditoriaux qui apportent une véritable valeur ajoutée par rapport aux informations minimales déjà présentes dans le catalogue.

HIÉRARCHIE DES SOURCES

Privilégie dans cet ordre :

1. le site officiel du domaine, château, maison ou producteur ;
2. les fiches techniques et documents officiels du producteur ;
3. les organismes officiels d'appellation ou interprofessions ;
4. les importateurs et distributeurs reconnus lorsqu'ils disposent d'informations techniques précises ;
5. les publications spécialisées reconnues dans le monde du vin ;
6. les marchands spécialisés disposant d'informations détaillées et crédibles ;
7. d'autres sources fiables uniquement lorsque nécessaire.

Pour les informations importantes ou potentiellement discutables, croise plusieurs sources lorsque cela est utile.

FIABILITÉ

Ne fabrique jamais :
- une date ;
- une superficie ;
- un classement ;
- une parcelle ;
- un cépage ;
- une méthode d'élevage ;
- une durée d'élevage ;
- un rendement ;
- un propriétaire ;
- un œnologue ;
- une note ;
- une récompense ;
- une citation ;
- ou toute autre donnée factuelle précise.

Une information précise peut être utilisée lorsqu'elle provient d'une source web suffisamment fiable.

Si les sources sont contradictoires, privilégie les sources officielles.

Si aucune source sérieuse ne permet d'établir un fait, formule le texte sans ce fait plutôt que de l'inventer.

ORIGINALITÉ

Les sources servent à comprendre et vérifier.

Ne copie jamais des paragraphes ou formulations provenant des sites consultés.

Ne reproduis pas les textes d'un marchand, d'un critique ou d'un domaine.

Effectue une synthèse originale.

Le résultat doit être un contenu propre à The Wine Watchers.

LIGNE ÉDITORIALE THE WINE WATCHERS

- français naturel, précis et élégant ;
- ton premium, sobre et cultivé ;
- vocabulaire du vin maîtrisé ;
- aucune emphase commerciale excessive ;
- aucun discours artificiellement luxueux ;
- aucune formule générique du type "une expérience inoubliable" ;
- éviter les répétitions ;
- privilégier les informations concrètes ;
- conserver une lecture fluide ;
- aucune citation inventée ;
- pas de Markdown ;
- pas de titre ajouté sauf demande explicite ;
- ne pas mentionner le processus de recherche ;
- ne pas mentionner les sources dans le texte final sauf demande explicite ;
- ne pas expliquer ce que tu ne peux pas faire lorsque suffisamment d'informations existent pour rédiger un texte utile.

IMPORTANT

Le fait qu'une information ne soit pas présente dans la fiche The Wine Watchers ne signifie pas qu'elle est interdite.

Tu peux et dois utiliser les informations pertinentes découvertes grâce à la recherche web, à condition qu'elles soient suffisamment fiables.

Le texte sera toujours relu par un humain avant toute publication.
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