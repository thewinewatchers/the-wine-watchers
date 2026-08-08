export type EditorialWineInput = {
  slug?: string | null;
  name?: string | null;
  producer?: string | null;
  appellation?: string | null;
  region?: string | null;
  country?: string | null;

  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;

  description?: string | null;
  story?: string | null;
  tasting_notes?: string[] | string | null;
  nose?: string | null;
  palate?: string | null;
  food_pairings?: string[] | string | null;
  additional_information?: string | null;
  tww_opinion?: string | null;

  grapes?: string[] | string | null;
  serving_temperature?: string | null;
  aging_potential?: string | null;
  format?: string | null;
  price?: number | string | null;
  stock?: number | string | null;

  image?: string | null;
  case_image?: string | null;
  gallery?: string[] | null;
  image_alt?: string | null;

  producer_link?: string | null;
  appellation_link?: string | null;
  region_link?: string | null;
  boutique_link?: string | null;

  has_product_schema?: boolean | null;
  has_breadcrumb_schema?: boolean | null;
};

export type EditorialScoreAction = {
  category:
    | "metadata"
    | "editorial"
    | "technical"
    | "images"
    | "internalLinks"
    | "structuredData";
  label: string;
  detail: string;
  estimatedGain: number;
  estimatedMinutes: number;
};

export type EditorialScoreResult = {
  score: number;
  certification: "Platine" | "Or" | "Argent" | "Bronze" | "À améliorer";
  stars: 1 | 2 | 3 | 4 | 5;

  metadata: number;
  editorial: number;
  technical: number;
  images: number;
  internalLinks: number;
  structuredData: number;

  warnings: string[];
  actions: EditorialScoreAction[];
  estimatedMinutes: number;
  potentialGain: number;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function isEmpty(value: unknown) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  return String(value).trim() === "";
}

function textLength(value: unknown) {
  if (value === null || value === undefined) return 0;

  if (Array.isArray(value)) {
    return value.join(" ").trim().length;
  }

  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

function getCertification(
  score: number
): EditorialScoreResult["certification"] {
  if (score >= 95) return "Platine";
  if (score >= 90) return "Or";
  if (score >= 80) return "Argent";
  if (score >= 70) return "Bronze";
  return "À améliorer";
}

function getStars(score: number): EditorialScoreResult["stars"] {
  if (score >= 95) return 5;
  if (score >= 85) return 4;
  if (score >= 75) return 3;
  if (score >= 60) return 2;
  return 1;
}

function addAction(
  actions: EditorialScoreAction[],
  action: EditorialScoreAction
) {
  actions.push(action);
}

export function calculateEditorialScore(
  wine: EditorialWineInput
): EditorialScoreResult {
  const actions: EditorialScoreAction[] = [];
  const warnings: string[] = [];

  // -------------------------------------------------------
  // Métadonnées
  // -------------------------------------------------------
  let metadata = 0;

  const slugLength = textLength(wine.slug);
  if (slugLength > 0 && slugLength <= 75) {
    metadata += 25;
  } else {
    warnings.push(
      slugLength === 0 ? "Slug absent." : "Slug trop long."
    );
    addAction(actions, {
      category: "metadata",
      label: slugLength === 0 ? "Créer le slug" : "Raccourcir le slug",
      detail:
        slugLength === 0
          ? "Créer une URL courte, descriptive et stable."
          : `Réduire le slug d’environ ${slugLength - 75} caractères.`,
      estimatedGain: 8,
      estimatedMinutes: 3,
    });
  }

  const titleLength = textLength(wine.seo_title);
  if (titleLength >= 35 && titleLength <= 65) {
    metadata += 30;
  } else {
    warnings.push(
      titleLength === 0
        ? "Titre SEO absent."
        : titleLength < 35
          ? "Titre SEO trop court."
          : "Titre SEO trop long."
    );
    addAction(actions, {
      category: "metadata",
      label: "Optimiser le titre SEO",
      detail:
        titleLength === 0
          ? "Ajouter un titre SEO de 35 à 65 caractères."
          : titleLength < 35
            ? `Ajouter environ ${35 - titleLength} caractères.`
            : `Retirer environ ${titleLength - 65} caractères.`,
      estimatedGain: 10,
      estimatedMinutes: 5,
    });
  }

  const descriptionLength = textLength(wine.seo_description);
  if (descriptionLength >= 90 && descriptionLength <= 165) {
    metadata += 35;
  } else {
    warnings.push(
      descriptionLength === 0
        ? "Meta description absente."
        : descriptionLength < 90
          ? "Meta description trop courte."
          : "Meta description trop longue."
    );
    addAction(actions, {
      category: "metadata",
      label: "Optimiser la meta description",
      detail:
        descriptionLength === 0
          ? "Ajouter une meta description de 90 à 165 caractères."
          : descriptionLength < 90
            ? `Ajouter environ ${90 - descriptionLength} caractères.`
            : `Retirer environ ${descriptionLength - 165} caractères.`,
      estimatedGain: 10,
      estimatedMinutes: 7,
    });
  }

  if (!isEmpty(wine.canonical_url) || !isEmpty(wine.slug)) {
    metadata += 10;
  } else {
    warnings.push("URL canonique non vérifiable.");
    addAction(actions, {
      category: "metadata",
      label: "Vérifier l’URL canonique",
      detail: "S’assurer que la fiche possède une URL canonique stable.",
      estimatedGain: 4,
      estimatedMinutes: 3,
    });
  }

  metadata = clamp(metadata);

  // -------------------------------------------------------
  // Contenu éditorial
  // -------------------------------------------------------
  let editorial = 0;

  const productDescriptionLength = textLength(wine.description);
  if (productDescriptionLength >= 300) {
    editorial += 15;
  } else {
    warnings.push("Description produit insuffisante.");
    addAction(actions, {
      category: "editorial",
      label: "Enrichir la description",
      detail:
        productDescriptionLength === 0
          ? "Rédiger une description produit complète."
          : `Ajouter environ ${300 - productDescriptionLength} caractères.`,
      estimatedGain: 8,
      estimatedMinutes: 10,
    });
  }

  const storyLength = textLength(wine.story);
  if (storyLength >= 600) {
    editorial += 20;
  } else {
    warnings.push("Histoire du vin trop courte ou absente.");
    addAction(actions, {
      category: "editorial",
      label: "Développer l’histoire du vin",
      detail:
        storyLength === 0
          ? "Ajouter une présentation complète du domaine et du vin."
          : `Ajouter environ ${600 - storyLength} caractères.`,
      estimatedGain: 12,
      estimatedMinutes: 15,
    });
  }

  const tastingLength = textLength(wine.tasting_notes);
  if (tastingLength >= 180) {
    editorial += 15;
  } else {
    warnings.push("Notes de dégustation insuffisantes.");
    addAction(actions, {
      category: "editorial",
      label: "Enrichir les notes de dégustation",
      detail:
        tastingLength === 0
          ? "Ajouter des notes de dégustation détaillées."
          : `Ajouter environ ${180 - tastingLength} caractères.`,
      estimatedGain: 8,
      estimatedMinutes: 10,
    });
  }

  const noseLength = textLength(wine.nose);
  if (noseLength >= 80) {
    editorial += 10;
  } else {
    warnings.push("Nez insuffisant ou absent.");
    addAction(actions, {
      category: "editorial",
      label: "Enrichir le nez",
      detail:
        noseLength === 0
          ? "Rédiger une description aromatique précise du nez."
          : `Ajouter environ ${80 - noseLength} caractères.`,
      estimatedGain: 6,
      estimatedMinutes: 6,
    });
  }

  const palateLength = textLength(wine.palate);
  if (palateLength >= 80) {
    editorial += 10;
  } else {
    warnings.push("Bouche insuffisante ou absente.");
    addAction(actions, {
      category: "editorial",
      label: "Enrichir la bouche",
      detail:
        palateLength === 0
          ? "Rédiger une description précise de la bouche, de la texture et de la finale."
          : `Ajouter environ ${80 - palateLength} caractères.`,
      estimatedGain: 6,
      estimatedMinutes: 6,
    });
  }

  const foodPairingsLength = textLength(wine.food_pairings);
  if (foodPairingsLength >= 100) {
    editorial += 10;
  } else {
    warnings.push("Accords mets-vins insuffisants.");
    addAction(actions, {
      category: "editorial",
      label: "Compléter les accords mets-vins",
      detail:
        foodPairingsLength === 0
          ? "Ajouter plusieurs accords mets-vins argumentés."
          : `Ajouter environ ${100 - foodPairingsLength} caractères.`,
      estimatedGain: 6,
      estimatedMinutes: 8,
    });
  }

  const opinionLength = textLength(wine.tww_opinion);
  if (opinionLength >= 120) {
    editorial += 10;
  } else {
    warnings.push("Avis The Wine Watchers absent ou trop court.");
    addAction(actions, {
      category: "editorial",
      label: "Améliorer l’avis The Wine Watchers",
      detail:
        opinionLength === 0
          ? "Rédiger un avis éditorial distinctif et argumenté."
          : `Ajouter environ ${120 - opinionLength} caractères.`,
      estimatedGain: 10,
      estimatedMinutes: 10,
    });
  }

  const servingTemperatureLength = textLength(wine.serving_temperature);
  if (servingTemperatureLength >= 3) {
    editorial += 5;
  } else {
    warnings.push("Température de service absente.");
    addAction(actions, {
      category: "editorial",
      label: "Renseigner la température de service",
      detail: "Proposer une température ou une plage de service adaptée au vin.",
      estimatedGain: 3,
      estimatedMinutes: 3,
    });
  }

  const agingPotentialLength = textLength(wine.aging_potential);
  if (agingPotentialLength >= 3) {
    editorial += 5;
  } else {
    warnings.push("Potentiel de garde absent.");
    addAction(actions, {
      category: "editorial",
      label: "Renseigner le potentiel de garde",
      detail: "Proposer un potentiel de garde cohérent avec le profil du vin.",
      estimatedGain: 3,
      estimatedMinutes: 3,
    });
  }

  editorial = clamp(editorial);

  // -------------------------------------------------------
  // Données techniques
  // -------------------------------------------------------
  const technicalFields = [
    ["Producteur", wine.producer],
    ["Appellation", wine.appellation],
    ["Région", wine.region],
    ["Pays", wine.country],
    ["Cépages", wine.grapes],
    ["Format", wine.format],
    ["Prix", wine.price],
    ["Stock", wine.stock],
  ] as const;

  const technicalCompleted = technicalFields.filter(
    ([, value]) => !isEmpty(value)
  ).length;

  let technical = Math.round(
    (technicalCompleted / technicalFields.length) * 100
  );

  technicalFields.forEach(([label, value]) => {
    if (isEmpty(value)) {
      warnings.push(`${label} manquant.`);
      addAction(actions, {
        category: "technical",
        label: `Renseigner : ${label}`,
        detail: `Compléter le champ ${label.toLowerCase()}.`,
        estimatedGain: 3,
        estimatedMinutes: 2,
      });
    }
  });

  technical = clamp(technical);

  // -------------------------------------------------------
  // Images
  // -------------------------------------------------------
  let images = 0;

  if (!isEmpty(wine.image)) {
    images += 55;
  } else {
    warnings.push("Image principale absente.");
    addAction(actions, {
      category: "images",
      label: "Ajouter l’image principale",
      detail: "Ajouter une image claire et adaptée à la fiche produit.",
      estimatedGain: 12,
      estimatedMinutes: 5,
    });
  }

  if (Array.isArray(wine.gallery) && wine.gallery.length > 0) {
    images += 30;
  } else {
    addAction(actions, {
      category: "images",
      label: "Créer une galerie",
      detail: "Ajouter une ou plusieurs images complémentaires.",
      estimatedGain: 4,
      estimatedMinutes: 8,
    });
  }

  if (!isEmpty(wine.image_alt)) {
    images += 15;
  } else {
    warnings.push("Texte alternatif de l’image absent.");
    addAction(actions, {
      category: "images",
      label: "Ajouter le texte alternatif",
      detail: "Décrire précisément la bouteille pour l’accessibilité et le SEO.",
      estimatedGain: 5,
      estimatedMinutes: 3,
    });
  }

  images = clamp(images);

  // -------------------------------------------------------
  // Maillage interne
  // -------------------------------------------------------
  const internalLinkFields = [
    ["Producteur", wine.producer_link],
    ["Appellation", wine.appellation_link],
    ["Région", wine.region_link],
    ["Boutique", wine.boutique_link],
  ] as const;

  const linksCompleted = internalLinkFields.filter(
    ([, value]) => !isEmpty(value)
  ).length;

  let internalLinks = Math.round(
    (linksCompleted / internalLinkFields.length) * 100
  );

  internalLinkFields.forEach(([label, value]) => {
    if (isEmpty(value)) {
      warnings.push(`Lien interne ${label.toLowerCase()} non vérifié.`);
      addAction(actions, {
        category: "internalLinks",
        label: `Ajouter le lien ${label.toLowerCase()}`,
        detail: `Créer un lien interne vers la page ${label.toLowerCase()}.`,
        estimatedGain: 5,
        estimatedMinutes: 3,
      });
    }
  });

  internalLinks = clamp(internalLinks);

  // -------------------------------------------------------
  // Données structurées
  // -------------------------------------------------------
  let structuredData = 0;

  if (wine.has_product_schema) {
    structuredData += 65;
  } else {
    warnings.push("Données structurées Product non vérifiées.");
    addAction(actions, {
      category: "structuredData",
      label: "Vérifier le schéma Product",
      detail:
        "Contrôler le nom, l’image, le prix, la disponibilité et l’URL du produit.",
      estimatedGain: 6,
      estimatedMinutes: 8,
    });
  }

  if (wine.has_breadcrumb_schema) {
    structuredData += 35;
  } else {
    warnings.push("Fil d’Ariane structuré non vérifié.");
    addAction(actions, {
      category: "structuredData",
      label: "Vérifier le Breadcrumb",
      detail: "Contrôler les données structurées du fil d’Ariane.",
      estimatedGain: 4,
      estimatedMinutes: 5,
    });
  }

  structuredData = clamp(structuredData);

  // -------------------------------------------------------
  // Score global
  // -------------------------------------------------------
  const score = Math.round(
    metadata * 0.2 +
      editorial * 0.3 +
      technical * 0.15 +
      images * 0.1 +
      internalLinks * 0.15 +
      structuredData * 0.1
  );

  const sortedActions = [...actions].sort((a, b) => {
    if (b.estimatedGain !== a.estimatedGain) {
      return b.estimatedGain - a.estimatedGain;
    }

    return a.estimatedMinutes - b.estimatedMinutes;
  });

  const estimatedMinutes = sortedActions.reduce(
    (sum, action) => sum + action.estimatedMinutes,
    0
  );

  const potentialGain = clamp(
    sortedActions.reduce((sum, action) => sum + action.estimatedGain, 0)
  );

  return {
    score,
    certification: getCertification(score),
    stars: getStars(score),

    metadata,
    editorial,
    technical,
    images,
    internalLinks,
    structuredData,

    warnings,
    actions: sortedActions,
    estimatedMinutes,
    potentialGain,
  };
}

export function renderEditorialStars(stars: number) {
  const safeStars = clamp(Math.round(stars), 1, 5);

  return `${"★".repeat(safeStars)}${"☆".repeat(5 - safeStars)}`;
}