import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const SITE_URL = "https://www.thewinewatchers.com";

const appellations: Record<
  string,
  {
    name: string;
    title: string;
    description: string;
    intro: string;
    boutiqueHref: string;
    boutiqueLabel: string;
  }
> = {
  pauillac: {
    name: "Pauillac",
    title: "Vins de Pauillac – Grands Crus Classés",
    description:
      "Découvrez notre sélection de vins de Pauillac : grands crus classés, primeurs, millésimes rares et châteaux emblématiques du Médoc.",
    intro:
      "Pauillac est l’une des appellations les plus prestigieuses du Médoc. Elle rassemble certains des plus grands noms de Bordeaux, réputés pour leur puissance, leur profondeur et leur immense potentiel de garde.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  margaux: {
    name: "Margaux",
    title: "Vins de Margaux – Élégance du Médoc",
    description:
      "Sélection de vins de Margaux : grands crus classés, primeurs et millésimes recherchés disponibles chez The Wine Watchers.",
    intro:
      "Margaux est une appellation emblématique du Médoc, connue pour l’élégance, la finesse et la complexité de ses vins.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  pomerol: {
    name: "Pomerol",
    title: "Vins de Pomerol – Grands vins rares",
    description:
      "Découvrez notre sélection de vins de Pomerol : Petrus, Le Pin, Vieux Château Certan, La Conseillante et autres grands vins rares.",
    intro:
      "Pomerol est une appellation mythique de la rive droite bordelaise. Réputée pour ses grands merlots, elle produit des vins profonds, veloutés et rares.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  "saint-emilion": {
    name: "Saint-Émilion",
    title: "Vins de Saint-Émilion – Grands Crus Classés",
    description:
      "Achetez des vins de Saint-Émilion : grands crus classés, millésimes recherchés et références prestigieuses de la rive droite.",
    intro:
      "Saint-Émilion est l’une des appellations les plus célèbres de Bordeaux. Ses vins allient richesse, élégance et profondeur.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  "saint-julien": {
    name: "Saint-Julien",
    title: "Vins de Saint-Julien – Grands Crus du Médoc",
    description:
      "Sélection de vins de Saint-Julien : grands crus classés, primeurs et millésimes recherchés du Médoc.",
    intro:
      "Saint-Julien est réputée pour l’équilibre exceptionnel de ses vins. Située au cœur du Médoc, l’appellation offre des crus structurés, élégants et réguliers.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  "saint-estephe": {
    name: "Saint-Estèphe",
    title: "Vins de Saint-Estèphe – Grands vins de garde",
    description:
      "Découvrez les vins de Saint-Estèphe : grands crus classés, primeurs et millésimes recherchés disponibles à l’achat.",
    intro:
      "Saint-Estèphe produit des vins puissants, profonds et structurés. L’appellation est particulièrement appréciée pour ses grands vins de garde.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  "pessac-leognan": {
    name: "Pessac-Léognan",
    title: "Vins de Pessac-Léognan – Grands Crus de Graves",
    description:
      "Découvrez notre sélection de vins de Pessac-Léognan : grands crus classés, vins rouges et blancs de Bordeaux, primeurs et millésimes recherchés.",
    intro:
      "Pessac-Léognan est l’une des grandes appellations de Bordeaux, réputée pour ses vins rouges élégants et ses grands vins blancs secs.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  sauternes: {
    name: "Sauternes",
    title: "Vins de Sauternes – Grands vins liquoreux de Bordeaux",
    description:
      "Découvrez notre sélection de vins de Sauternes : grands liquoreux de Bordeaux, millésimes rares et châteaux emblématiques.",
    intro:
      "Sauternes est l’appellation emblématique des grands vins liquoreux de Bordeaux.",
    boutiqueHref: "/boutique/bordeaux",
    boutiqueLabel: "Retour à la boutique Bordeaux",
  },
  meursault: {
    name: "Meursault",
    title: "Vins de Meursault – Grands blancs de Bourgogne",
    description:
      "Sélection de vins de Meursault : grands blancs de Bourgogne, domaines réputés et millésimes recherchés.",
    intro:
      "Meursault est une appellation majeure de la Côte de Beaune, mondialement connue pour ses grands vins blancs.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "cote-de-nuits": {
    name: "Côte de Nuits",
    title: "Vins de Côte de Nuits – Grands rouges de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Côte de Nuits : grands crus, premiers crus, domaines prestigieux et millésimes recherchés.",
    intro:
      "La Côte de Nuits concentre certains des plus grands terroirs de Bourgogne. Elle est mondialement réputée pour ses grands vins rouges, profonds, complexes et taillés pour la garde.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "cote-de-beaune": {
    name: "Côte de Beaune",
    title: "Vins de Côte de Beaune – Grands blancs et rouges de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Côte de Beaune : grands blancs, rouges élégants, domaines réputés et millésimes recherchés.",
    intro:
      "La Côte de Beaune est l’un des grands secteurs de Bourgogne. Elle est particulièrement célèbre pour ses grands vins blancs, tout en offrant également des rouges élégants et raffinés.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  chablis: {
    name: "Chablis",
    title: "Vins de Chablis – Grands blancs de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Chablis : grands blancs de Bourgogne, domaines réputés, premiers crus, grands crus et millésimes recherchés.",
    intro:
      "Chablis est une appellation emblématique du nord de la Bourgogne, réputée pour ses grands vins blancs issus du Chardonnay, marqués par la fraîcheur, la précision et la minéralité.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "puligny-montrachet": {
    name: "Puligny-Montrachet",
    title: "Vins de Puligny-Montrachet – Grands blancs de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Puligny-Montrachet : grands blancs de Bourgogne, domaines prestigieux, premiers crus, grands crus et millésimes recherchés.",
    intro:
      "Puligny-Montrachet est l’une des appellations les plus prestigieuses de la Côte de Beaune. Elle est reconnue pour ses grands vins blancs d’une grande finesse, alliant tension, élégance et profondeur.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "vosne-romanee": {
    name: "Vosne-Romanée",
    title: "Vins de Vosne-Romanée – Grands rouges de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Vosne-Romanée, appellation mythique de la Côte de Nuits.",
    intro:
      "Vosne-Romanée est l’un des villages les plus prestigieux de Bourgogne.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "gevrey-chambertin": {
    name: "Gevrey-Chambertin",
    title: "Vins de Gevrey-Chambertin – Côte de Nuits",
    description:
      "Sélection de vins de Gevrey-Chambertin : grands crus, premiers crus et domaines prestigieux.",
    intro:
      "Gevrey-Chambertin est une appellation incontournable de la Côte de Nuits.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "chambolle-musigny": {
    name: "Chambolle-Musigny",
    title: "Vins de Chambolle-Musigny – Élégance bourguignonne",
    description:
      "Découvrez les vins de Chambolle-Musigny, grands rouges de Bourgogne réputés pour leur finesse.",
    intro:
      "Chambolle-Musigny incarne la finesse et l’élégance bourguignonnes.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "morey-saint-denis": {
    name: "Morey-Saint-Denis",
    title: "Vins de Morey-Saint-Denis – Grands vins de la Côte de Nuits",
    description:
      "Découvrez notre sélection de vins de Morey-Saint-Denis : premiers crus, grands crus, domaines prestigieux et millésimes recherchés.",
    intro:
      "Morey-Saint-Denis est une appellation emblématique de la Côte de Nuits, réputée pour ses rouges profonds, élégants et structurés.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "nuits-saint-georges": {
    name: "Nuits-Saint-Georges",
    title: "Vins de Nuits-Saint-Georges – Grands rouges de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Nuits-Saint-Georges : premiers crus, domaines réputés et millésimes recherchés.",
    intro:
      "Nuits-Saint-Georges produit des vins rouges puissants, structurés et aptes à une longue garde.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "vougeot": {
    name: "Vougeot",
    title: "Vins de Vougeot – Côte de Nuits",
    description:
      "Découvrez notre sélection de vins de Vougeot et du Clos de Vougeot, issus de terroirs historiques de Bourgogne.",
    intro:
      "Vougeot est une appellation historique de la Côte de Nuits, dominée par le célèbre Clos de Vougeot.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "flagey-echezeaux": {
    name: "Flagey-Échezeaux",
    title: "Vins de Flagey-Échezeaux – Grands Crus de Bourgogne",
    description:
      "Découvrez les vins de Flagey-Échezeaux, notamment Échezeaux et Grands-Échezeaux.",
    intro:
      "Flagey-Échezeaux abrite deux Grands Crus majeurs de la Côte de Nuits : Échezeaux et Grands-Échezeaux.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "aloxe-corton": {
    name: "Aloxe-Corton",
    title: "Vins d’Aloxe-Corton – Grands Crus de la Côte de Beaune",
    description:
      "Découvrez les vins d’Aloxe-Corton : rouges de caractère, Corton et Corton-Charlemagne.",
    intro:
      "Aloxe-Corton est une appellation majeure de la Côte de Beaune, célèbre pour la colline de Corton et ses Grands Crus.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "pernand-vergelesses": {
    name: "Pernand-Vergelesses",
    title: "Vins de Pernand-Vergelesses – Côte de Beaune",
    description:
      "Découvrez les vins de Pernand-Vergelesses, rouges et blancs de Bourgogne issus de terroirs réputés.",
    intro:
      "Pernand-Vergelesses produit des rouges élégants et des blancs précis au pied de la colline de Corton.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "savigny-les-beaune": {
    name: "Savigny-lès-Beaune",
    title: "Vins de Savigny-lès-Beaune – Côte de Beaune",
    description:
      "Découvrez notre sélection de vins de Savigny-lès-Beaune, rouges fins et blancs de Bourgogne.",
    intro:
      "Savigny-lès-Beaune est réputée pour ses vins accessibles, fins et expressifs.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  beaune: {
    name: "Beaune",
    title: "Vins de Beaune – Capitale des vins de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Beaune : premiers crus, domaines historiques et millésimes recherchés.",
    intro:
      "Beaune est le cœur historique du vignoble bourguignon et possède une remarquable diversité de premiers crus.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  pommard: {
    name: "Pommard",
    title: "Vins de Pommard – Grands rouges de la Côte de Beaune",
    description:
      "Découvrez notre sélection de vins de Pommard : premiers crus, domaines prestigieux et millésimes de garde.",
    intro:
      "Pommard est célèbre pour ses vins rouges puissants, charpentés et profondément bourguignons.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  volnay: {
    name: "Volnay",
    title: "Vins de Volnay – Finesse de la Côte de Beaune",
    description:
      "Découvrez notre sélection de vins de Volnay, rouges fins, élégants et parfumés.",
    intro:
      "Volnay est l’une des appellations les plus élégantes de la Côte de Beaune.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "chassagne-montrachet": {
    name: "Chassagne-Montrachet",
    title: "Vins de Chassagne-Montrachet – Grands blancs de Bourgogne",
    description:
      "Découvrez notre sélection de vins de Chassagne-Montrachet : grands blancs, rouges, premiers crus et grands crus.",
    intro:
      "Chassagne-Montrachet produit certains des plus grands Chardonnay de Bourgogne ainsi que des rouges raffinés.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "saint-aubin": {
    name: "Saint-Aubin",
    title: "Vins de Saint-Aubin – Grands blancs de la Côte de Beaune",
    description:
      "Découvrez les vins de Saint-Aubin : blancs précis, premiers crus et domaines recherchés.",
    intro:
      "Saint-Aubin est reconnue pour ses blancs tendus et minéraux, à proximité immédiate de Montrachet.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "auxey-duresses": {
    name: "Auxey-Duresses",
    title: "Vins d’Auxey-Duresses – Côte de Beaune",
    description:
      "Découvrez les vins d’Auxey-Duresses, rouges et blancs de Bourgogne.",
    intro:
      "Auxey-Duresses offre des vins authentiques, équilibrés et expressifs.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "monthelie": {
    name: "Monthélie",
    title: "Vins de Monthélie – Côte de Beaune",
    description:
      "Découvrez les vins de Monthélie, rouges fins et blancs confidentiels de Bourgogne.",
    intro:
      "Monthélie produit des vins délicats et élégants entre Volnay et Meursault.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "saint-romain": {
    name: "Saint-Romain",
    title: "Vins de Saint-Romain – Bourgogne",
    description:
      "Découvrez les vins de Saint-Romain, blancs frais et rouges élégants de la Côte de Beaune.",
    intro:
      "Saint-Romain est une appellation d’altitude connue pour la fraîcheur et la précision de ses vins.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "corton": {
    name: "Corton",
    title: "Corton Grand Cru – Grands vins de Bourgogne",
    description:
      "Découvrez notre sélection de Corton Grand Cru, rouges puissants et grands vins de garde.",
    intro:
      "Corton est le seul Grand Cru rouge majeur de la Côte de Beaune et produit des vins profonds, structurés et durables.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "corton-charlemagne": {
    name: "Corton-Charlemagne",
    title: "Corton-Charlemagne Grand Cru – Grand blanc de Bourgogne",
    description:
      "Découvrez notre sélection de Corton-Charlemagne Grand Cru, l’un des plus grands vins blancs de Bourgogne.",
    intro:
      "Corton-Charlemagne est un Grand Cru blanc mythique, réputé pour sa puissance, sa minéralité et sa longévité.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "clos-de-vougeot": {
    name: "Clos de Vougeot",
    title: "Clos de Vougeot Grand Cru – Bourgogne",
    description:
      "Découvrez les vins du Clos de Vougeot Grand Cru, terroir historique de la Côte de Nuits.",
    intro:
      "Le Clos de Vougeot est l’un des Grands Crus les plus célèbres de Bourgogne.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "clos-de-la-roche": {
    name: "Clos de la Roche",
    title: "Clos de la Roche Grand Cru – Morey-Saint-Denis",
    description:
      "Découvrez notre sélection de Clos de la Roche Grand Cru, grand vin rouge de Bourgogne.",
    intro:
      "Clos de la Roche produit des vins profonds, puissants et complexes, parmi les plus grands de Morey-Saint-Denis.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "clos-saint-denis": {
    name: "Clos Saint-Denis",
    title: "Clos Saint-Denis Grand Cru – Morey-Saint-Denis",
    description:
      "Découvrez les vins de Clos Saint-Denis Grand Cru, réputés pour leur finesse et leur élégance.",
    intro:
      "Clos Saint-Denis est un Grand Cru de grande distinction, plus floral et délicat que ses voisins.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "clos-des-lambrays": {
    name: "Clos des Lambrays",
    title: "Clos des Lambrays Grand Cru – Morey-Saint-Denis",
    description:
      "Découvrez les vins du Clos des Lambrays Grand Cru, monopole historique de Morey-Saint-Denis.",
    intro:
      "Clos des Lambrays est un Grand Cru historique produisant des vins complexes, élégants et profonds.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "clos-de-tart": {
    name: "Clos de Tart",
    title: "Clos de Tart Grand Cru – Monopole de Morey-Saint-Denis",
    description:
      "Découvrez les vins du Clos de Tart Grand Cru, monopole emblématique de Bourgogne.",
    intro:
      "Clos de Tart est un Grand Cru monopole historique, reconnu pour la profondeur, la précision et la longévité de ses vins.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  musigny: {
    name: "Musigny",
    title: "Musigny Grand Cru – Grand vin de Chambolle-Musigny",
    description:
      "Découvrez notre sélection de Musigny Grand Cru, l’un des vins les plus rares et prestigieux de Bourgogne.",
    intro:
      "Musigny est un Grand Cru mythique, célèbre pour sa finesse, sa profondeur et son incomparable élégance.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "bonnes-mares": {
    name: "Bonnes-Mares",
    title: "Bonnes-Mares Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Bonnes-Mares Grand Cru, entre Chambolle-Musigny et Morey-Saint-Denis.",
    intro:
      "Bonnes-Mares produit des vins puissants, complexes et de très longue garde.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  chambertin: {
    name: "Chambertin",
    title: "Chambertin Grand Cru – Gevrey-Chambertin",
    description:
      "Découvrez notre sélection de Chambertin Grand Cru, l’un des vins rouges les plus prestigieux de Bourgogne.",
    intro:
      "Chambertin est un Grand Cru mythique, réputé pour sa puissance, sa profondeur et sa longévité.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "chambertin-clos-de-beze": {
    name: "Chambertin-Clos de Bèze",
    title: "Chambertin-Clos de Bèze Grand Cru – Bourgogne",
    description:
      "Découvrez les vins de Chambertin-Clos de Bèze Grand Cru, grands rouges de Gevrey-Chambertin.",
    intro:
      "Chambertin-Clos de Bèze associe puissance, noblesse et raffinement.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "chapelle-chambertin": {
    name: "Chapelle-Chambertin",
    title: "Chapelle-Chambertin Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Chapelle-Chambertin Grand Cru.",
    intro:
      "Chapelle-Chambertin est un Grand Cru élégant et raffiné de Gevrey-Chambertin.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "charmes-chambertin": {
    name: "Charmes-Chambertin",
    title: "Charmes-Chambertin Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Charmes-Chambertin Grand Cru.",
    intro:
      "Charmes-Chambertin produit des vins généreux, soyeux et profonds.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "mazoyeres-chambertin": {
    name: "Mazoyères-Chambertin",
    title: "Mazoyères-Chambertin Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Mazoyères-Chambertin Grand Cru.",
    intro:
      "Mazoyères-Chambertin est un Grand Cru puissant et complexe de Gevrey-Chambertin.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "mazis-chambertin": {
    name: "Mazis-Chambertin",
    title: "Mazis-Chambertin Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Mazis-Chambertin Grand Cru.",
    intro:
      "Mazis-Chambertin est réputé pour ses vins intenses, structurés et profonds.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "griotte-chambertin": {
    name: "Griotte-Chambertin",
    title: "Griotte-Chambertin Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Griotte-Chambertin Grand Cru.",
    intro:
      "Griotte-Chambertin est un Grand Cru rare, recherché pour sa finesse et son expression aromatique.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "latricieres-chambertin": {
    name: "Latricières-Chambertin",
    title: "Latricières-Chambertin Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Latricières-Chambertin Grand Cru.",
    intro:
      "Latricières-Chambertin produit des vins précis, minéraux et de grande garde.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "ruchottes-chambertin": {
    name: "Ruchottes-Chambertin",
    title: "Ruchottes-Chambertin Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Ruchottes-Chambertin Grand Cru.",
    intro:
      "Ruchottes-Chambertin est un Grand Cru rare, élégant et minéral.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  echezeaux: {
    name: "Échezeaux",
    title: "Échezeaux Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection d’Échezeaux Grand Cru, grands rouges de la Côte de Nuits.",
    intro:
      "Échezeaux est un Grand Cru renommé, capable d’allier charme, ampleur et complexité.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "grands-echezeaux": {
    name: "Grands-Échezeaux",
    title: "Grands-Échezeaux Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Grands-Échezeaux Grand Cru.",
    intro:
      "Grands-Échezeaux produit des vins profonds, structurés et raffinés.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  richebourg: {
    name: "Richebourg",
    title: "Richebourg Grand Cru – Vosne-Romanée",
    description:
      "Découvrez notre sélection de Richebourg Grand Cru, l’un des vins les plus prestigieux de Bourgogne.",
    intro:
      "Richebourg est un Grand Cru monumental, associant puissance, profondeur et raffinement.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "romanee-saint-vivant": {
    name: "Romanée-Saint-Vivant",
    title: "Romanée-Saint-Vivant Grand Cru – Vosne-Romanée",
    description:
      "Découvrez notre sélection de Romanée-Saint-Vivant Grand Cru.",
    intro:
      "Romanée-Saint-Vivant est réputée pour la finesse, la sensualité et la complexité de ses vins.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "la-tache": {
    name: "La Tâche",
    title: "La Tâche Grand Cru – Monopole de Vosne-Romanée",
    description:
      "Découvrez les vins de La Tâche Grand Cru, monopole mythique de Bourgogne.",
    intro:
      "La Tâche est l’un des vins les plus rares et recherchés au monde, connu pour sa profondeur et son intensité.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "romanee-conti": {
    name: "Romanée-Conti",
    title: "Romanée-Conti Grand Cru – Vin mythique de Bourgogne",
    description:
      "Découvrez Romanée-Conti Grand Cru, l’un des vins les plus rares et prestigieux au monde.",
    intro:
      "Romanée-Conti est un Grand Cru monopole mythique, symbole absolu de la Bourgogne.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "la-romanee": {
    name: "La Romanée",
    title: "La Romanée Grand Cru – Vosne-Romanée",
    description:
      "Découvrez les vins de La Romanée Grand Cru, l’un des plus petits Grands Crus de Bourgogne.",
    intro:
      "La Romanée est un Grand Cru minuscule et rare, connu pour sa finesse et sa profondeur.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "la-grande-rue": {
    name: "La Grande Rue",
    title: "La Grande Rue Grand Cru – Vosne-Romanée",
    description:
      "Découvrez les vins de La Grande Rue Grand Cru, monopole de Vosne-Romanée.",
    intro:
      "La Grande Rue est un Grand Cru monopole situé entre La Tâche et Romanée-Conti.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  montrachet: {
    name: "Montrachet",
    title: "Montrachet Grand Cru – Grand blanc de Bourgogne",
    description:
      "Découvrez notre sélection de Montrachet Grand Cru, référence absolue des grands vins blancs de Bourgogne.",
    intro:
      "Montrachet est considéré comme l’un des plus grands terroirs de Chardonnay au monde.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "chevalier-montrachet": {
    name: "Chevalier-Montrachet",
    title: "Chevalier-Montrachet Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Chevalier-Montrachet Grand Cru.",
    intro:
      "Chevalier-Montrachet produit des blancs d’une grande finesse, tendus, complexes et lumineux.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "batard-montrachet": {
    name: "Bâtard-Montrachet",
    title: "Bâtard-Montrachet Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Bâtard-Montrachet Grand Cru.",
    intro:
      "Bâtard-Montrachet est un Grand Cru blanc puissant, ample et de très longue garde.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "bienvenues-batard-montrachet": {
    name: "Bienvenues-Bâtard-Montrachet",
    title: "Bienvenues-Bâtard-Montrachet Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Bienvenues-Bâtard-Montrachet Grand Cru.",
    intro:
      "Bienvenues-Bâtard-Montrachet produit des blancs raffinés, élégants et complexes.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  "criots-batard-montrachet": {
    name: "Criots-Bâtard-Montrachet",
    title: "Criots-Bâtard-Montrachet Grand Cru – Bourgogne",
    description:
      "Découvrez notre sélection de Criots-Bâtard-Montrachet Grand Cru.",
    intro:
      "Criots-Bâtard-Montrachet est un Grand Cru rare, produisant des blancs riches et harmonieux.",
    boutiqueHref: "/boutique/bourgogne",
    boutiqueLabel: "Retour à la boutique Bourgogne",
  },
  bolgheri: {
    name: "Bolgheri",
    title: "Vins de Bolgheri – Grands vins de Toscane",
    description:
      "Découvrez notre sélection de vins de Bolgheri : Sassicaia, Ornellaia, Masseto et grandes cuvées de la côte toscane.",
    intro:
      "Bolgheri est l’un des terroirs les plus prestigieux d’Italie. Située sur la côte toscane, l’appellation est devenue célèbre pour ses grands vins rouges d’inspiration bordelaise, capables d’allier profondeur, élégance et remarquable potentiel de garde.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  "bolgheri-doc": {
    name: "Bolgheri DOC",
    title: "Vins de Bolgheri DOC – Grandes cuvées de Toscane",
    description:
      "Découvrez notre sélection de vins de Bolgheri DOC : rouges toscans prestigieux, domaines emblématiques et millésimes recherchés.",
    intro:
      "Bolgheri DOC rassemble certaines des cuvées les plus réputées de Toscane. Le terroir maritime, les sols variés et l’usage de cépages internationaux donnent naissance à des vins puissants, raffinés et taillés pour la garde.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  "bolgheri-superiore": {
    name: "Bolgheri Superiore",
    title: "Bolgheri Superiore – Grands vins rouges de Toscane",
    description:
      "Découvrez notre sélection de Bolgheri Superiore : cuvées de prestige, domaines réputés et grands millésimes.",
    intro:
      "Bolgheri Superiore représente le sommet qualitatif de l’appellation Bolgheri. Ces vins rouges concentrés, complexes et structurés bénéficient d’élevages ambitieux et d’un grand potentiel de vieillissement.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  "bolgheri-sassicaia": {
    name: "Bolgheri Sassicaia",
    title: "Bolgheri Sassicaia DOC – Vin iconique de Toscane",
    description:
      "Découvrez notre sélection de Bolgheri Sassicaia DOC, l’un des vins les plus prestigieux et recherchés d’Italie.",
    intro:
      "Bolgheri Sassicaia DOC est une appellation unique, créée autour du vin Sassicaia. Elle consacre l’identité d’un terroir exceptionnel de la côte toscane et un style devenu une référence internationale.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  "bolgheri-sassicaia-doc": {
    name: "Bolgheri Sassicaia DOC",
    title: "Bolgheri Sassicaia DOC – Grand vin de Toscane",
    description:
      "Découvrez les millésimes de Bolgheri Sassicaia DOC disponibles chez The Wine Watchers.",
    intro:
      "Bolgheri Sassicaia DOC distingue l’un des vins les plus emblématiques d’Italie. Issu principalement de Cabernet Sauvignon, Sassicaia séduit par sa précision, son élégance et sa longévité.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  toscana: {
    name: "Toscana",
    title: "Vins de Toscane – Grands vins italiens",
    description:
      "Découvrez notre sélection de vins de Toscane : Super Toscans, Bolgheri, Montalcino et domaines emblématiques.",
    intro:
      "La Toscane est l’une des régions viticoles les plus célèbres d’Italie. Elle produit aussi bien des vins issus du Sangiovese que de grandes cuvées modernes fondées sur des cépages internationaux.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  "toscana-igt": {
    name: "Toscana IGT",
    title: "Vins Toscana IGT – Super Toscans et grandes cuvées",
    description:
      "Découvrez notre sélection de Toscana IGT : Super Toscans, domaines prestigieux et millésimes recherchés.",
    intro:
      "Toscana IGT a permis l’émergence de nombreux vins italiens de légende. Cette indication géographique offre une grande liberté d’assemblage et rassemble certaines des cuvées les plus recherchées de Toscane.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  "brunello-di-montalcino": {
    name: "Brunello di Montalcino",
    title: "Brunello di Montalcino DOCG – Grands vins de Toscane",
    description:
      "Découvrez notre sélection de Brunello di Montalcino DOCG : grands domaines, millésimes de garde et cuvées prestigieuses.",
    intro:
      "Brunello di Montalcino est l’une des appellations les plus prestigieuses d’Italie. Produit à partir de Sangiovese, ce grand vin toscan associe puissance, complexité et remarquable aptitude au vieillissement.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  "brunello-di-montalcino-docg": {
    name: "Brunello di Montalcino DOCG",
    title: "Brunello di Montalcino DOCG – Vins de garde italiens",
    description:
      "Découvrez les Brunello di Montalcino DOCG disponibles chez The Wine Watchers.",
    intro:
      "Brunello di Montalcino DOCG figure parmi les appellations majeures d’Italie. Ses vins profonds et structurés gagnent en finesse et en complexité au fil du temps.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  montalcino: {
    name: "Montalcino",
    title: "Vins de Montalcino – Grands vins de Toscane",
    description:
      "Découvrez notre sélection de vins de Montalcino : Brunello, Rosso et grandes cuvées toscanes.",
    intro:
      "Montalcino est un territoire viticole emblématique du sud de la Toscane. Ses collines, son climat et son Sangiovese donnent naissance à des vins de grande personnalité.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  barolo: {
    name: "Barolo",
    title: "Vins de Barolo DOCG – Grands Nebbiolo du Piémont",
    description:
      "Découvrez notre sélection de Barolo DOCG : grands domaines, crus prestigieux et millésimes de garde.",
    intro:
      "Barolo est l’une des appellations les plus prestigieuses du Piémont. Issus du Nebbiolo, ses vins associent puissance, finesse aromatique et immense potentiel de vieillissement.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  "barolo-docg": {
    name: "Barolo DOCG",
    title: "Barolo DOCG – Grands vins rouges du Piémont",
    description:
      "Découvrez les Barolo DOCG disponibles chez The Wine Watchers.",
    intro:
      "Barolo DOCG produit certains des vins rouges les plus nobles d’Italie. Leur structure tannique, leur complexité et leur capacité de garde en font des références pour les collectionneurs.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  barbaresco: {
    name: "Barbaresco",
    title: "Vins de Barbaresco DOCG – Élégance du Piémont",
    description:
      "Découvrez notre sélection de Barbaresco DOCG : grands Nebbiolo, domaines réputés et millésimes recherchés.",
    intro:
      "Barbaresco est une grande appellation du Piémont, également fondée sur le Nebbiolo. Ses vins sont réputés pour leur élégance, leur finesse et leur expression aromatique.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },
  "barbaresco-docg": {
    name: "Barbaresco DOCG",
    title: "Barbaresco DOCG – Grands vins du Piémont",
    description:
      "Découvrez les Barbaresco DOCG disponibles chez The Wine Watchers.",
    intro:
      "Barbaresco DOCG donne naissance à des Nebbiolo raffinés et complexes, souvent plus accessibles dans leur jeunesse que les Barolo tout en conservant un excellent potentiel de garde.",
    boutiqueHref: "/boutique/italie",
    boutiqueLabel: "Retour à la boutique Italie",
  },

  "ribera-del-duero": {
    name: "Ribera del Duero",
    title: "Vins de Ribera del Duero – Grands vins d’Espagne",
    description:
      "Découvrez notre sélection de vins de Ribera del Duero : grands Tempranillo, domaines prestigieux et millésimes recherchés.",
    intro:
      "Ribera del Duero est l’une des appellations les plus prestigieuses d’Espagne. Implantée le long du Duero, elle produit des rouges profonds, structurés et élégants, principalement issus du Tempranillo.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  "ribera-del-duero-do": {
    name: "Ribera del Duero DO",
    title: "Ribera del Duero DO – Grands Tempranillo espagnols",
    description:
      "Découvrez les vins de Ribera del Duero DO disponibles chez The Wine Watchers.",
    intro:
      "Ribera del Duero DO rassemble certains des domaines les plus recherchés d’Espagne. L’altitude, les amplitudes thermiques et les sols variés donnent naissance à des vins concentrés, précis et aptes à une longue garde.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  rioja: {
    name: "Rioja",
    title: "Vins de Rioja – Grandes cuvées espagnoles",
    description:
      "Découvrez notre sélection de vins de Rioja : Gran Reserva, Reserva, domaines historiques et millésimes de garde.",
    intro:
      "Rioja est l’appellation espagnole la plus célèbre. Elle est reconnue pour ses vins élégants, complexes et harmonieux, souvent élevés longuement en fût puis en bouteille.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  "rioja-doca": {
    name: "Rioja DOCa",
    title: "Rioja DOCa – Grands vins rouges d’Espagne",
    description:
      "Découvrez les vins de Rioja DOCa disponibles chez The Wine Watchers.",
    intro:
      "Rioja DOCa bénéficie du plus haut niveau de reconnaissance réglementaire en Espagne. Ses vins associent tradition, finesse et remarquable capacité de vieillissement.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  priorat: {
    name: "Priorat",
    title: "Vins du Priorat – Grands vins de Catalogne",
    description:
      "Découvrez notre sélection de vins du Priorat : cuvées puissantes, domaines prestigieux et terroirs de llicorella.",
    intro:
      "Le Priorat est une appellation spectaculaire de Catalogne, célèbre pour ses coteaux escarpés et ses sols de schiste appelés llicorella. Ses vins sont profonds, minéraux et intensément méditerranéens.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  "priorat-doca": {
    name: "Priorat DOCa",
    title: "Priorat DOCa – Grands vins de Catalogne",
    description:
      "Découvrez les vins de Priorat DOCa disponibles chez The Wine Watchers.",
    intro:
      "Priorat DOCa est l’une des deux appellations espagnoles bénéficiant du plus haut niveau de classification. Elle produit des vins puissants, complexes et recherchés.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  "castille-et-leon": {
    name: "Castille et León",
    title: "Vins de Castille et León – Grandes cuvées espagnoles",
    description:
      "Découvrez notre sélection de vins de Castille et León : domaines emblématiques, cuvées rares et grands millésimes.",
    intro:
      "Castille et León est une vaste région viticole du nord-ouest de l’Espagne. Elle abrite plusieurs terroirs prestigieux et certaines des cuvées les plus recherchées du pays.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  "castilla-y-leon": {
    name: "Castilla y León",
    title: "Vins de Castilla y León – Grands vins d’Espagne",
    description:
      "Découvrez les vins de Castilla y León disponibles chez The Wine Watchers.",
    intro:
      "Castilla y León rassemble une mosaïque de terroirs d’altitude, où naissent des vins rouges de caractère, souvent issus du Tempranillo.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  "castilla-y-leon-vt": {
    name: "Castilla y León VT",
    title: "Castilla y León VT – Grandes cuvées espagnoles",
    description:
      "Découvrez notre sélection de vins Castilla y León VT, dont des cuvées emblématiques et confidentielles.",
    intro:
      "La mention Castilla y León VT offre aux producteurs une grande liberté de création. Elle accueille plusieurs vins de renommée internationale élaborés hors du cadre d’une appellation classique.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  "toro": {
    name: "Toro",
    title: "Vins de Toro – Rouges puissants d’Espagne",
    description:
      "Découvrez notre sélection de vins de Toro : Tinta de Toro, domaines prestigieux et millésimes recherchés.",
    intro:
      "Toro produit des vins rouges puissants et généreux, issus principalement de la Tinta de Toro, une adaptation locale du Tempranillo.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  "toro-do": {
    name: "Toro DO",
    title: "Toro DO – Grands vins rouges espagnols",
    description:
      "Découvrez les vins de Toro DO disponibles chez The Wine Watchers.",
    intro:
      "Toro DO est reconnue pour ses rouges intenses, structurés et aptes au vieillissement, produits sur les hauts plateaux de Castille et León.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  "rias-baixas": {
    name: "Rías Baixas",
    title: "Vins de Rías Baixas – Grands blancs d’Espagne",
    description:
      "Découvrez notre sélection de vins de Rías Baixas : Albariño frais, précis et minéraux.",
    intro:
      "Rías Baixas est l’appellation emblématique de l’Albariño. Proche de l’Atlantique, elle produit des blancs frais, aromatiques et élégants.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  "rias-baixas-do": {
    name: "Rías Baixas DO",
    title: "Rías Baixas DO – Grands Albariño espagnols",
    description:
      "Découvrez les vins de Rías Baixas DO disponibles chez The Wine Watchers.",
    intro:
      "Rías Baixas DO est mondialement réputée pour ses Albariño vifs, salins et expressifs.",
    boutiqueHref: "/boutique/espagne",
    boutiqueLabel: "Retour à la boutique Espagne",
  },
  champagne: {
    name: "Champagne",
    title: "Champagnes – Grandes maisons et cuvées prestigieuses",
    description:
      "Découvrez notre sélection de champagnes : grandes maisons, cuvées prestigieuses, millésimes rares et bouteilles de collection.",
    intro:
      "La Champagne est l’une des régions viticoles les plus prestigieuses au monde. Elle donne naissance à des vins effervescents d’exception, issus de terroirs uniques et du savoir-faire de maisons et de vignerons emblématiques.",
    boutiqueHref: "/boutique/champagne",
    boutiqueLabel: "Retour à la boutique Champagne",
  },


  "napa-valley": {
    name: "Napa Valley",
    title: "Vins de Napa Valley – Grands vins de Californie",
    description:
      "Découvrez notre sélection de vins de Napa Valley : grandes cuvées californiennes, domaines emblématiques et millésimes recherchés.",
    intro:
      "Napa Valley est l’une des régions viticoles les plus prestigieuses des États-Unis. Son climat, la diversité de ses sols et son savoir-faire ont donné naissance à des Cabernet Sauvignon de renommée mondiale.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  "napa-valley-ava": {
    name: "Napa Valley AVA",
    title: "Napa Valley AVA – Grands vins de Californie",
    description:
      "Découvrez les vins de Napa Valley AVA disponibles chez The Wine Watchers.",
    intro:
      "Napa Valley AVA rassemble certains des domaines les plus réputés de Californie. Ses vins combinent maturité, précision, richesse et remarquable potentiel de garde.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  oakville: {
    name: "Oakville",
    title: "Vins d’Oakville – Grands Cabernet Sauvignon de Napa",
    description:
      "Découvrez notre sélection de vins d’Oakville : Cabernet Sauvignon prestigieux et domaines emblématiques de Napa Valley.",
    intro:
      "Oakville est l’une des sous-régions les plus renommées de Napa Valley. Elle produit des Cabernet Sauvignon profonds, structurés et particulièrement recherchés.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  "oakville-ava": {
    name: "Oakville AVA",
    title: "Oakville AVA – Grands vins de Napa Valley",
    description:
      "Découvrez les vins d’Oakville AVA disponibles chez The Wine Watchers.",
    intro:
      "Oakville AVA occupe une position centrale dans Napa Valley et abrite plusieurs propriétés iconiques. Ses Cabernet Sauvignon sont réputés pour leur concentration et leur équilibre.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  rutherford: {
    name: "Rutherford",
    title: "Vins de Rutherford – Napa Valley",
    description:
      "Découvrez notre sélection de vins de Rutherford : grands Cabernet Sauvignon, domaines historiques et millésimes de garde.",
    intro:
      "Rutherford est une appellation historique de Napa Valley. Elle est célèbre pour ses Cabernet Sauvignon à la fois structurés, élégants et marqués par une texture distinctive.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  "rutherford-ava": {
    name: "Rutherford AVA",
    title: "Rutherford AVA – Grands Cabernet Sauvignon californiens",
    description:
      "Découvrez les vins de Rutherford AVA disponibles chez The Wine Watchers.",
    intro:
      "Rutherford AVA bénéficie d’un climat chaud et de sols graveleux favorables au Cabernet Sauvignon. Ses vins associent richesse, profondeur et complexité.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  yountville: {
    name: "Yountville",
    title: "Vins de Yountville – Napa Valley",
    description:
      "Découvrez notre sélection de vins de Yountville, au cœur de Napa Valley.",
    intro:
      "Yountville est une sous-région importante de Napa Valley, bénéficiant d’influences fraîches qui apportent équilibre et finesse aux vins.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  "yountville-ava": {
    name: "Yountville AVA",
    title: "Yountville AVA – Vins de Napa Valley",
    description:
      "Découvrez les vins de Yountville AVA disponibles chez The Wine Watchers.",
    intro:
      "Yountville AVA produit des vins élégants et équilibrés grâce à son climat tempéré et à la diversité de ses sols.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  "st-helena": {
    name: "St. Helena",
    title: "Vins de St. Helena – Napa Valley",
    description:
      "Découvrez notre sélection de vins de St. Helena : Cabernet Sauvignon prestigieux et domaines réputés.",
    intro:
      "St. Helena est l’un des secteurs historiques de Napa Valley. Son climat chaud favorise des vins riches, mûrs et structurés.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  "st-helena-ava": {
    name: "St. Helena AVA",
    title: "St. Helena AVA – Grands vins de Californie",
    description:
      "Découvrez les vins de St. Helena AVA disponibles chez The Wine Watchers.",
    intro:
      "St. Helena AVA est réputée pour ses Cabernet Sauvignon généreux, profonds et aptes au vieillissement.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  "stags-leap-district": {
    name: "Stags Leap District",
    title: "Stags Leap District – Grands Cabernet Sauvignon de Napa",
    description:
      "Découvrez notre sélection de vins de Stags Leap District, l’une des appellations les plus prestigieuses de Napa Valley.",
    intro:
      "Stags Leap District est célèbre pour ses Cabernet Sauvignon combinant puissance, finesse et texture soyeuse.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  "stags-leap-district-ava": {
    name: "Stags Leap District AVA",
    title: "Stags Leap District AVA – Napa Valley",
    description:
      "Découvrez les vins de Stags Leap District AVA disponibles chez The Wine Watchers.",
    intro:
      "Stags Leap District AVA bénéficie d’un terroir unique qui produit des Cabernet Sauvignon raffinés, structurés et élégants.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  californie: {
    name: "Californie",
    title: "Vins de Californie – Grands vins des États-Unis",
    description:
      "Découvrez notre sélection de vins de Californie : Napa Valley, Sonoma et grandes cuvées américaines.",
    intro:
      "La Californie est la région viticole la plus importante des États-Unis. Elle rassemble une grande diversité de climats et de terroirs, capables de produire des vins de très haut niveau.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },
  california: {
    name: "California",
    title: "California Wines – Grandes cuvées américaines",
    description:
      "Découvrez les vins de Californie disponibles chez The Wine Watchers.",
    intro:
      "La Californie produit certaines des cuvées les plus prestigieuses des États-Unis, notamment à Napa Valley et Sonoma.",
    boutiqueHref: "/boutique/usa",
    boutiqueLabel: "Retour à la boutique États-Unis",
  },

};

type AppellationWine = {
  id: string;
  slug?: string | null;
  name?: string | null;
  producer?: string | null;
  vintage?: string | number | null;
  price?: string | number | null;
  image?: string | null;
  appellation?: string | null;
  region?: string | null;
  category?: string | null;
  classification?: string | null;
  bottle_size?: string | null;
  packaging?: string | null;
  hidden_from_site?: boolean | null;
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

function getWineHref(wine: AppellationWine) {
  return `/boutique/vin/${wine.slug || wine.id}`;
}

function getAbsoluteWineUrl(wine: AppellationWine) {
  return `${SITE_URL}${getWineHref(wine)}`;
}

function formatPrice(price?: string | number | null) {
  if (!price) return "Prix sur demande";

  const value =
    typeof price === "number"
      ? price
      : Number(
          price
            .toString()
            .replace(/[€\s]/g, "")
            .replace(/\./g, "")
            .replace(",", ".")
        );

  if (Number.isNaN(value) || value <= 0) return "Prix sur demande";

  return (
    value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € HT"
  );
}

function getWineGroupTitle(wine: AppellationWine) {
  const name = String(wine.name || "Vin sans nom").trim();
  const vintage = String(wine.vintage || "").trim();
  const appellationSlug = slugify(wine.appellation || "");

  if (
    appellationSlug === "bolgheri" ||
    appellationSlug === "bolgheri-doc" ||
    appellationSlug === "bolgheri-superiore"
  ) {
    return "Vins de Bolgheri";
  }

  if (
    appellationSlug === "castille-et-leon" ||
    appellationSlug === "castilla-y-leon" ||
    appellationSlug === "castilla-y-leon-vt"
  ) {
    return "Vins de Castille et León";
  }

  if (
    appellationSlug === "ribera-del-duero" ||
    appellationSlug === "ribera-del-duero-do"
  ) {
    return "Vins de Ribera del Duero";
  }

  if (
    appellationSlug === "napa-valley" ||
    appellationSlug === "napa-valley-ava" ||
    appellationSlug === "oakville" ||
    appellationSlug === "oakville-ava" ||
    appellationSlug === "rutherford" ||
    appellationSlug === "rutherford-ava" ||
    appellationSlug === "yountville" ||
    appellationSlug === "yountville-ava"
  ) {
    return "Vins de Napa Valley";
  }

  if (!vintage) return name;

  return name
    .replace(new RegExp(`\\s*[–—-]?\\s*${vintage}\\s*$`), "")
    .trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const appellation = appellations[slug];

  if (!appellation) {
    return {
      title: "Appellation introuvable | The Wine Watchers",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${appellation.title} | The Wine Watchers`,
    description: appellation.description,
    alternates: {
      canonical: `${SITE_URL}/appellation/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AppellationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const appellation = appellations[slug];

  if (!appellation) {
    notFound();
  }

  const appellationSearchTerms = Array.from(
    new Set([
      appellation.name,
      `${appellation.name} Grand Cru`,
      `${appellation.name} Premier Cru`,
      `${appellation.name} 1er Cru`,
      `${appellation.name} DOC`,
      `${appellation.name} DOCG`,
      `${appellation.name} IGT`,
      `${appellation.name} DO`,
      `${appellation.name} DOCa`,
      `${appellation.name} VT`,
      `${appellation.name} AVA`,
    ])
  );

  const appellationQueries = await Promise.all(
    appellationSearchTerms.map((term) =>
      supabase
        .from("wines")
        .select(
          "id, slug, name, producer, vintage, price, image, appellation, region, category, classification, bottle_size, packaging, hidden_from_site"
        )
        .ilike("appellation", term)
        .neq("hidden_from_site", true)
    )
  );

  const nameQuery = await supabase
    .from("wines")
    .select(
      "id, slug, name, producer, vintage, price, image, appellation, region, category, classification, bottle_size, packaging, hidden_from_site"
    )
    .ilike("name", `%${appellation.name}%`)
    .neq("hidden_from_site", true);

  const error =
    appellationQueries.find((result) => result.error)?.error || nameQuery.error;

  const wineMap = new Map<string, AppellationWine>();

  [...appellationQueries, nameQuery].forEach((result) => {
    ((result.data || []) as AppellationWine[]).forEach((wine) => {
      wineMap.set(wine.id, wine);
    });
  });

  const visibleWines = Array.from(wineMap.values()).sort((a, b) => {
    const producerComparison = String(a.producer || "").localeCompare(
      String(b.producer || ""),
      "fr"
    );

    if (producerComparison !== 0) return producerComparison;

    const nameComparison = String(a.name || "").localeCompare(
      String(b.name || ""),
      "fr"
    );

    if (nameComparison !== 0) return nameComparison;

    return Number(b.vintage || 0) - Number(a.vintage || 0);
  });

  const producers = Array.from(
    new Set(visibleWines.map((wine) => wine.producer).filter(Boolean))
  ) as string[];

  const producerGroups = Array.from(
    visibleWines.reduce(
      (
        map,
        wine
      ): Map<
        string,
        {
          title: string;
          wineMap: Map<string, { title: string; wines: AppellationWine[] }>;
        }
      > => {
        const producerTitle =
          String(wine.producer || "").trim() || "Producteur non précisé";
        const producerKey = slugify(producerTitle);

        const wineTitle =
          slug === "napa-valley" || slug === "napa-valley-ava"
            ? "Vins de Napa Valley"
            : getWineGroupTitle(wine);

        const wineKey = slugify(wineTitle);

        if (!map.has(producerKey)) {
          map.set(producerKey, {
            title: producerTitle,
            wineMap: new Map<
              string,
              { title: string; wines: AppellationWine[] }
            >(),
          });
        }

        const producerGroup = map.get(producerKey)!;

        if (!producerGroup.wineMap.has(wineKey)) {
          producerGroup.wineMap.set(wineKey, {
            title: wineTitle,
            wines: [],
          });
        }

        producerGroup.wineMap.get(wineKey)!.wines.push(wine);

        return map;
      },
      new Map<
        string,
        {
          title: string;
          wineMap: Map<
            string,
            { title: string; wines: AppellationWine[] }
          >;
        }
      >()
    ).values()
  )
    .sort((a, b) => a.title.localeCompare(b.title, "fr"))
    .map((producerGroup) => ({
      title: producerGroup.title,
      wineGroups: Array.from(producerGroup.wineMap.values())
        .sort((a, b) => a.title.localeCompare(b.title, "fr"))
        .map((wineGroup) => ({
          ...wineGroup,
          wines: [...wineGroup.wines].sort((a, b) => {
            const vintageA = Number(a.vintage || 0);
            const vintageB = Number(b.vintage || 0);

            if (vintageA !== vintageB) return vintageB - vintageA;

            return String(a.name || "").localeCompare(
              String(b.name || ""),
              "fr"
            );
          }),
        })),
    }));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Vins de ${appellation.name}`,
    description: appellation.description,
    url: `${SITE_URL}/appellation/${slug}`,
    numberOfItems: visibleWines.length,
    itemListElement: visibleWines.map((wine, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getAbsoluteWineUrl(wine),
      name: wine.name || `${appellation.name} ${wine.vintage || ""}`.trim(),
    })),
  };

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />

      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="transition hover:text-[#8B1E2D]">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/boutique" className="transition hover:text-[#8B1E2D]">
            Boutique
          </Link>
          <span>/</span>
          <Link
            href={appellation.boutiqueHref}
            className="transition hover:text-[#8B1E2D]"
          >
            {appellation.boutiqueHref.includes("bourgogne")
              ? "Bourgogne"
              : appellation.boutiqueHref.includes("italie")
                ? "Italie"
                : appellation.boutiqueHref.includes("espagne")
                  ? "Espagne"
                  : appellation.boutiqueHref.includes("usa")
                    ? "États-Unis"
                    : "Bordeaux"}
          </Link>
          <span>/</span>
          <span className="font-medium text-[#3b1f1f]">{appellation.name}</span>
        </div>

        <div className="mb-10 rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href={appellation.boutiqueHref}
              className="inline-flex rounded-full border border-[#8B1E2D] px-5 py-2 text-sm font-semibold text-[#8B1E2D] transition hover:bg-[#8B1E2D] hover:text-white"
            >
              ← {appellation.boutiqueLabel}
            </Link>
          </div>

          <p className="mb-2 text-sm uppercase tracking-[0.25em] text-gray-500">
            Appellation
          </p>

          <h1 className="mb-3 font-serif text-4xl text-[#3b1f1f] md:text-6xl">
            {appellation.name}
          </h1>

          <p className="mb-6 text-lg font-medium text-gray-700">
            {visibleWines.length} vin(s) disponible(s)
          </p>

          <p className="max-w-4xl text-lg leading-relaxed text-gray-700">
            {appellation.intro}
          </p>

          {error && (
            <p className="mt-4 text-red-600">
              Erreur Supabase : {error.message}
            </p>
          )}
        </div>

        {producers.length > 0 && (
          <div
            id="producteurs"
            className="mb-10 scroll-mt-24 rounded-[2rem] border border-[#e1d1bd] bg-white p-8 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
              Producteurs liés
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {producers.map((producer) => (
                <Link
                  key={producer}
                  href={`/producteur/${slugify(producer)}`}
                  className="rounded-full border border-[#d8b56d]/50 bg-[#fffaf3] px-5 py-2 text-sm text-[#6d5b50] transition hover:border-[#8a1f1f] hover:text-[#8a1f1f]"
                >
                  {producer}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8a6a2f]">
            Sélection disponible
          </p>

          <h2 className="mt-3 font-serif text-4xl text-[#24110d]">
            Vins de {appellation.name}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d5b50]">
            Découvrez les vins actuellement disponibles dans cette appellation.
            Comparez les domaines, les millésimes et les caractéristiques de
            chaque cuvée avant de consulter sa fiche détaillée.
          </p>
        </div>

        {visibleWines.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-600 shadow-sm">
            Aucun vin disponible actuellement pour cette appellation.
          </div>
        ) : (
          <div className="space-y-9">
            {producerGroups.map((producerGroup) => (
              <section key={producerGroup.title} className="space-y-5">
                <div className="rounded-xl border border-[#d8b56d]/40 bg-[#24110d] px-5 py-2.5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/50">
                      Producteur
                    </p>

                    <h3 className="font-serif text-2xl text-[#d8b56d]">
                      {producerGroup.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-6">
                  {producerGroup.wineGroups.map((wineGroup) => (
                    <section
                      key={`${producerGroup.title}-${wineGroup.title}`}
                    >
                      <div className="mb-4 rounded-xl border border-[#d8c6ae] bg-[#fffaf3] px-5 py-2.5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8a6a2f]">
                              Vin
                            </p>

                            <h4 className="font-serif text-xl leading-tight text-[#24110d]">
                              {wineGroup.title}
                            </h4>
                          </div>

                          <p className="text-xs text-[#7d6b5e]">
                            {wineGroup.wines.length} millésime
                            {wineGroup.wines.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {wineGroup.wines.map((wine) => (
                          <article
                            key={wine.id}
                            className="group overflow-hidden rounded-[1.7rem] border border-[#dfcfb8] bg-[#fffaf3] shadow-sm transition hover:-translate-y-1 hover:border-[#d8b56d] hover:shadow-xl"
                          >
                            <Link href={getWineHref(wine)} className="block">
                              <div className="flex h-[245px] items-center justify-center bg-[#efe3d2] p-6">
                                {wine.image ? (
                                  <img
                                    src={wine.image}
                                    alt={`Bouteille de ${
                                      wine.name || "vin"
                                    } - ${appellation.name}`}
                                    className="max-h-[205px] w-auto object-contain transition group-hover:scale-105"
                                  />
                                ) : (
                                  <span className="text-sm text-[#8a6a2f]">
                                    Image non disponible
                                  </span>
                                )}
                              </div>
                            </Link>

                            <div className="p-5">
                              {wine.producer && (
                                <Link
                                  href={`/producteur/${slugify(wine.producer)}`}
                                  className="mb-3 block rounded-full bg-[#24110d]/90 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.16em] text-[#d8b56d] transition hover:bg-[#8a1f1f]"
                                >
                                  {wine.producer}
                                </Link>
                              )}

                              <Link href={getWineHref(wine)} className="block">
                                <h3 className="min-h-[64px] font-serif text-sm leading-tight text-[#24110d] group-hover:text-[#8a1f1f]">
                                  {wine.name}
                                </h3>
                              </Link>

                              <div className="mb-3 mt-3 flex flex-wrap items-center gap-2">
                                {wine.classification && (
                                  <span className="rounded-full border border-[#dfcfb8] bg-white px-3 py-1 text-[11px] text-[#6d5b50]">
                                    {wine.classification}
                                  </span>
                                )}

                                {(wine.appellation || wine.region) && (
                                  <span className="rounded-full border border-[#dfcfb8] bg-white px-3 py-1 text-[11px] text-[#6d5b50]">
                                    {wine.appellation || wine.region}
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

                              <p className="mt-4 font-serif text-2xl text-[#8a1f1f]">
                                {formatPrice(wine.price)}
                              </p>

                              <Link
                                href={getWineHref(wine)}
                                className="mt-5 inline-flex w-full justify-center rounded-full bg-[#8a1f1f] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#641313]"
                              >
                                Voir le vin
                              </Link>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}