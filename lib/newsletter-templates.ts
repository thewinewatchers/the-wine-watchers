export type NewsletterTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  subject: string;
  preheader: string;
  title: string;
  message: string;
  images: string[];
  buttonLabel: string;
  buttonUrl: string;
  footerMessage: string;
};

const SITE_URL = "https://www.thewinewatchers.com";

const DEFAULT_FOOTER =
  "Vous recevez cet e-mail car vous êtes inscrit à la newsletter The Wine Watchers.";

export const NEWSLETTER_TEMPLATES: NewsletterTemplate[] = [
  {
    id: "offres-du-moment",
    name: "Offres du moment",
    category: "Commercial",
    description:
      "Mettre en avant une sélection limitée de vins actuellement disponibles.",
    subject: "Les offres du moment chez The Wine Watchers",
    preheader:
      "Découvrez notre sélection actuelle de grands vins disponibles en quantité limitée.",
    title: "Nos offres du moment",
    message:
      "Nous avons sélectionné pour vous plusieurs grands vins actuellement disponibles dans notre catalogue. Des cuvées recherchées, choisies pour la qualité de leur provenance et proposées dans la limite des stocks disponibles.",
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1400&q=85",
    ],
    buttonLabel: "Découvrir les offres",
    buttonUrl: `${SITE_URL}/boutique`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "primeurs",
    name: "Primeurs",
    category: "Bordeaux",
    description:
      "Présenter une campagne Primeurs et diriger les clients vers la sélection dédiée.",
    subject: "Primeurs : notre sélection de grands Bordeaux",
    preheader:
      "Accédez à notre sélection de vins de Bordeaux proposés en Primeurs.",
    title: "La campagne Primeurs",
    message:
      "Découvrez notre sélection de grands vins de Bordeaux proposés en Primeurs. Nous retenons des propriétés reconnues ainsi que des cuvées à fort potentiel, avec une attention particulière portée à la provenance et aux conditions de conservation futures.",
    images: [
  "/images/bordeaux-degustation-primeur.jpg",
],
    buttonLabel: "Voir les Primeurs",
    buttonUrl: `${SITE_URL}/boutique/primeurs-2025`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "bordeaux",
    name: "Bordeaux",
    category: "Région",
    description:
      "Valoriser les grands crus et appellations de Bordeaux.",
    subject: "Bordeaux : une sélection de propriétés incontournables",
    preheader:
      "Pauillac, Margaux, Saint-Émilion, Pomerol et les grandes appellations bordelaises.",
    title: "Les grands vins de Bordeaux",
    message:
      "Explorez une sélection de grands vins issus des appellations les plus prestigieuses de Bordeaux. Médoc, Graves et rive droite se rencontrent dans une collection composée de propriétés historiques, de grands crus classés et de domaines emblématiques.",
          images: [
  "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1400&q=85",
],
    buttonLabel: "Explorer Bordeaux",
    buttonUrl: `${SITE_URL}/boutique/bordeaux`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "bourgogne",
    name: "Bourgogne",
    category: "Région",
    description:
      "Mettre en avant domaines, climats et grands crus de Bourgogne.",
    subject: "Bourgogne : domaines et grands crus d’exception",
    preheader:
      "Découvrez notre sélection de grands vins de Bourgogne.",
    title: "La Bourgogne dans toute sa singularité",
    message:
      "De la Côte de Nuits à la Côte de Beaune, découvrez des vins façonnés par des climats uniques et des domaines de référence. Une sélection destinée aux amateurs de pinot noir, de chardonnay et de grands terroirs bourguignons.",
    images: [
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1400&q=85",
],
    buttonLabel: "Explorer la Bourgogne",
    buttonUrl: `${SITE_URL}/boutique/bourgogne`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "vallee-du-rhone",
    name: "Vallée du Rhône",
    category: "Région",
    description:
      "Présenter les cuvées emblématiques de la Vallée du Rhône.",
    subject:
      "Vallée du Rhône : cuvées emblématiques et grands terroirs",
    preheader:
      "Côte-Rôtie, Hermitage et grandes signatures rhodaniennes.",
    title: "Les grands vins de la Vallée du Rhône",
    message:
      "Découvrez une sélection de cuvées emblématiques de la Vallée du Rhône. Syrah, terroirs escarpés et savoir-faire de maisons historiques composent des vins profonds, précis et recherchés par les collectionneurs.",
    images: [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1400&q=85&sat=-15",
    ],
    buttonLabel: "Explorer le Rhône",
    buttonUrl: `${SITE_URL}/boutique/rhone`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "italie",
    name: "Italie",
    category: "Région",
    description:
      "Mettre en valeur les grandes signatures italiennes.",
    subject: "Italie : les grandes signatures de notre sélection",
    preheader:
      "Découvrez notre sélection de vins italiens emblématiques.",
    title: "Les grands vins d’Italie",
    message:
      "La richesse viticole italienne s’exprime à travers des domaines de renommée internationale et des terroirs au caractère affirmé. Découvrez notre sélection de grandes cuvées italiennes, choisies pour leur identité et leur potentiel de garde.",
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85",
    ],
    buttonLabel: "Explorer l’Italie",
    buttonUrl: `${SITE_URL}/boutique/italie`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "espagne",
    name: "Espagne",
    category: "Région",
    description:
      "Présenter les domaines et cuvées espagnoles du catalogue.",
    subject: "Espagne : une sélection de vins rares et prestigieux",
    preheader:
      "Découvrez les grandes cuvées espagnoles disponibles chez The Wine Watchers.",
    title: "Les grands vins d’Espagne",
    message:
      "Découvrez une sélection de vins espagnols issus de domaines devenus incontournables. Des cuvées puissantes, raffinées et produites en quantités limitées, représentatives des grands terroirs de la péninsule ibérique.",
       images: [
  "/images/vin-rouge-jambon-espagne.jpg",
],
    buttonLabel: "Explorer l’Espagne",
    buttonUrl: `${SITE_URL}/boutique/espagne`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "usa",
    name: "USA",
    category: "Région",
    description:
      "Valoriser les grandes cuvées américaines et la Napa Valley.",
    subject: "USA : les grands vins de la Napa Valley",
    preheader:
      "Découvrez notre sélection de vins américains de prestige.",
    title: "Les grands vins des États-Unis",
    message:
      "La Napa Valley compte aujourd’hui parmi les terroirs les plus prestigieux du monde. Découvrez des cuvées américaines recherchées, reconnues pour leur profondeur, leur précision et leur remarquable capacité de vieillissement.",
    images: [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1400&q=85&crop=entropy",
    ],
    buttonLabel: "Explorer les vins USA",
    buttonUrl: `${SITE_URL}/boutique/usa`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "champagne",
    name: "Champagne",
    category: "Région",
    description:
      "Préparer une campagne consacrée aux maisons et cuvées de Champagne.",
    subject: "Champagne : une sélection pour les grandes occasions",
    preheader:
      "Découvrez notre sélection de champagnes pour célébrer les moments d’exception.",
    title: "L’élégance de la Champagne",
    message:
      "Pour célébrer un événement ou enrichir une cave, découvrez une sélection de champagnes choisis pour leur finesse, leur précision et la réputation de leur maison. Une invitation à partager les grandes occasions avec élégance.",
  
    images: [
  "/images/champagne-generique.jpg",
],
    buttonLabel: "Découvrir les champagnes",
    buttonUrl: `${SITE_URL}/boutique`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "foire-aux-vins",
    name: "Foire aux vins",
    category: "Saisonnier",
    description:
      "Créer une opération commerciale temporaire sur une sélection de vins.",
    subject: "Foire aux vins : notre sélection à découvrir",
    preheader:
      "Une sélection exceptionnelle disponible pendant une durée limitée.",
    title: "Notre Foire aux vins",
    message:
      "À l’occasion de notre Foire aux vins, nous vous proposons une sélection de bouteilles choisies parmi les grandes régions viticoles. Profitez de cette opération pour compléter votre cave avec des vins de caractère, dans la limite des quantités disponibles.",
    images: [
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1400&q=85",
    ],
    buttonLabel: "Voir la sélection",
    buttonUrl: `${SITE_URL}/boutique`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "noel",
    name: "Noël",
    category: "Saisonnier",
    description:
      "Proposer une sélection de bouteilles et coffrets pour les fêtes de Noël.",
    subject: "Noël : offrez un grand vin",
    preheader:
      "Découvrez notre sélection de bouteilles d’exception pour les fêtes.",
    title: "Des grands vins pour Noël",
    message:
      "Pour les fêtes de Noël, offrez une bouteille porteuse d’histoire, de terroir et d’émotion. Découvrez notre sélection de grands vins à partager à table, à offrir ou à conserver pour une occasion future.",
    images: [
  "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=1400&q=85",
],
    buttonLabel: "Découvrir la sélection de Noël",
    buttonUrl: `${SITE_URL}/boutique`,
    footerMessage: DEFAULT_FOOTER,
  },
  {
    id: "nouvel-an",
    name: "Nouvel An",
    category: "Saisonnier",
    description:
      "Créer une campagne festive pour le réveillon et la nouvelle année.",
    subject: "Nouvel An : célébrez avec des vins d’exception",
    preheader:
      "Notre sélection pour accompagner le réveillon et commencer l’année avec élégance.",
    title: "Célébrons la nouvelle année",
    message:
      "Le passage à la nouvelle année mérite des bouteilles à la hauteur de l’occasion. Découvrez notre sélection de grands vins pour accompagner le réveillon, partager un moment précieux et commencer l’année sous le signe de l’excellence.",
   images: [
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1400&q=85",
],
    buttonLabel: "Voir la sélection du Nouvel An",
    buttonUrl: `${SITE_URL}/boutique`,
    footerMessage: DEFAULT_FOOTER,
  },
];

export function getNewsletterTemplate(templateId: string) {
  return NEWSLETTER_TEMPLATES.find(
    (template) => template.id === templateId
  );
}