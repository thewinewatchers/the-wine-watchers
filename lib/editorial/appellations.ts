export type AppellationEditorial = {
  title: string;
  opinion: string;
};

export const APPELLATION_EDITORIAL: Record<
  string,
  AppellationEditorial
> = {
  corton: {
    title: "Pourquoi choisir un Corton Grand Cru ?",
    opinion:
      "Seul Grand Cru rouge majeur de la Côte de Beaune, Corton offre une interprétation unique du Pinot Noir, alliant puissance, profondeur et remarquable potentiel de garde. Les meilleurs domaines révèlent ici des vins structurés mais précis, capables d’évoluer pendant plusieurs décennies. Chez The Wine Watchers, nous sélectionnons les cuvées qui expriment le plus fidèlement la personnalité de cette appellation emblématique de Bourgogne.",
  },
};