export type SeoPriorityInput = {
  position: number;
  impressions: number;
  ctr: number;
  clicks?: number;
};

export type SeoPriorityResult = {
  score: number;
  stars: 1 | 2 | 3 | 4 | 5;
  level: "faible" | "moyenne" | "élevée" | "très élevée" | "absolue";
  reasons: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getStars(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score >= 100) return 5;
  if (score >= 75) return 4;
  if (score >= 50) return 3;
  if (score >= 25) return 2;
  return 1;
}

function getLevel(stars: SeoPriorityResult["stars"]): SeoPriorityResult["level"] {
  if (stars === 5) return "absolue";
  if (stars === 4) return "très élevée";
  if (stars === 3) return "élevée";
  if (stars === 2) return "moyenne";
  return "faible";
}

export function calculateSeoPriority(
  input: SeoPriorityInput
): SeoPriorityResult {
  const position = Number(input.position || 0);
  const impressions = Number(input.impressions || 0);
  const ctr = Number(input.ctr || 0);
  const clicks = Number(input.clicks || 0);

  let score = 0;
  const reasons: string[] = [];

  if (position >= 8 && position <= 15) {
    score += 40;
    reasons.push("Position très proche de la première page");
  } else if (position > 15 && position <= 20) {
    score += 25;
    reasons.push("Position proche de la première page");
  } else if (position > 20 && position <= 30) {
    score += 10;
    reasons.push("Page déjà visible dans les premiers résultats");
  }

  if (impressions >= 1000) {
    score += 35;
    reasons.push("Très grand nombre d’impressions");
  } else if (impressions >= 500) {
    score += 30;
    reasons.push("Grand nombre d’impressions");
  } else if (impressions >= 200) {
    score += 20;
    reasons.push("Volume d’impressions intéressant");
  } else if (impressions >= 50) {
    score += 10;
    reasons.push("Visibilité Google déjà établie");
  }

  if (ctr < 0.01 && impressions >= 20) {
    score += 25;
    reasons.push("CTR très faible malgré la visibilité");
  } else if (ctr < 0.02 && impressions >= 20) {
    score += 20;
    reasons.push("CTR faible");
  } else if (ctr < 0.04 && impressions >= 50) {
    score += 10;
    reasons.push("CTR perfectible");
  }

  if (clicks === 0 && impressions >= 50) {
    score += 10;
    reasons.push("Aucun clic malgré les impressions");
  }

  if (position > 0 && position < 8) {
    score -= 15;
  }

  if (position > 30) {
    score -= 10;
  }

  const normalizedScore = clamp(Math.round(score), 0, 120);
  const stars = getStars(normalizedScore);

  return {
    score: normalizedScore,
    stars,
    level: getLevel(stars),
    reasons,
  };
}

export function renderPriorityStars(stars: number) {
  const safeStars = clamp(Math.round(stars), 1, 5);

  return `${"★".repeat(safeStars)}${"☆".repeat(5 - safeStars)}`;
}