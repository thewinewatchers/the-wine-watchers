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

  pauillac: {
    title: "Pourquoi choisir un Pauillac ?",
    opinion:
      "Pauillac incarne avec une rare intensité la grandeur des vins du Médoc. Dominés par le Cabernet Sauvignon, ses vins associent profondeur, structure, élégance et remarquable aptitude au vieillissement. L’appellation abrite plusieurs propriétés mythiques et offre une diversité d’expressions allant de la puissance majestueuse à une finesse plus classique. Chez The Wine Watchers, nous privilégions les Pauillac capables de révéler la noblesse de leur terroir, la précision de leur élevage et l’équilibre des grands millésimes.",
  },

  margaux: {
    title: "Pourquoi choisir un Margaux ?",
    opinion:
      "Margaux est l’une des expressions les plus raffinées du Médoc. Ses vins se distinguent par leur élégance, leur finesse aromatique et la délicatesse de leur texture, sans jamais renoncer à la profondeur ni au potentiel de garde. Les meilleurs crus offrent des bouquets floraux, une matière soyeuse et une remarquable harmonie. Chez The Wine Watchers, nous sélectionnons les Margaux qui traduisent avec précision cette identité singulière, où la distinction et la complexité l’emportent toujours sur la seule puissance.",
  },

  pomerol: {
    title: "Pourquoi choisir un Pomerol ?",
    opinion:
      "Pomerol occupe une place unique parmi les grandes appellations de Bordeaux. Principalement issus du Merlot, ses vins associent richesse, sensualité, profondeur et texture veloutée. Malgré la modestie de sa superficie, l’appellation rassemble certaines des cuvées les plus rares et recherchées au monde. Chez The Wine Watchers, nous apprécions les Pomerol pour leur capacité à conjuguer intensité et élégance, avec des expressions capables de séduire dans leur jeunesse tout en développant une grande complexité au fil du temps.",
  },

  "saint-emilion": {
    title: "Pourquoi choisir un Saint-Émilion ?",
    opinion:
      "Saint-Émilion offre une remarquable diversité de terroirs et de styles, depuis les vins amples et généreux des secteurs argilo-calcaires jusqu’aux expressions plus fraîches et minérales du plateau. Le Merlot y occupe une place centrale, souvent complété par le Cabernet Franc. Chez The Wine Watchers, nous sélectionnons les Saint-Émilion qui privilégient l’équilibre, la précision et l’identité du terroir. Les meilleures cuvées associent profondeur, élégance et capacité de garde, tout en conservant une texture particulièrement séduisante.",
  },

  "vosne-romanee": {
    title: "Pourquoi choisir un Vosne-Romanée ?",
    opinion:
      "Vosne-Romanée représente l’un des sommets de la Bourgogne rouge. Ses vins associent profondeur, finesse, sensualité et complexité aromatique, avec une capacité unique à exprimer toute la subtilité du Pinot Noir. Le village abrite plusieurs climats et Grands Crus parmi les plus prestigieux au monde. Chez The Wine Watchers, nous recherchons les Vosne-Romanée qui conjuguent intensité, texture soyeuse et précision, offrant une lecture noble et profondément raffinée de la Côte de Nuits.",
  },

  "gevrey-chambertin": {
    title: "Pourquoi choisir un Gevrey-Chambertin ?",
    opinion:
      "Gevrey-Chambertin est une appellation majeure de la Côte de Nuits, réputée pour ses Pinot Noir profonds, structurés et expressifs. Les meilleurs vins associent puissance, complexité et fraîcheur, avec une remarquable capacité à évoluer en bouteille. L’appellation offre une grande diversité de terroirs, depuis les cuvées village jusqu’aux Grands Crus les plus prestigieux. Chez The Wine Watchers, nous privilégions les Gevrey-Chambertin qui révèlent avec précision leur origine et conservent un équilibre naturel entre intensité et élégance.",
  },

  meursault: {
    title: "Pourquoi choisir un Meursault ?",
    opinion:
      "Meursault figure parmi les appellations les plus emblématiques de la Bourgogne blanche. Issus du Chardonnay, ses vins sont appréciés pour leur ampleur, leur profondeur et leur remarquable complexité aromatique. Les meilleures cuvées associent richesse, tension et précision minérale, évitant toute lourdeur. Chez The Wine Watchers, nous sélectionnons les Meursault qui expriment avec justesse leur climat et leur millésime, capables d’offrir un grand plaisir dans leur jeunesse comme de se développer harmonieusement au fil des années.",
  },

  champagne: {
    title: "Pourquoi choisir un grand Champagne ?",
    opinion:
      "Le Champagne ne se résume pas à son effervescence : les grandes cuvées sont de véritables vins de terroir, capables d’associer finesse, profondeur, fraîcheur et complexité. Maisons historiques et vignerons d’exception proposent des expressions très différentes selon les cépages, les crus et les méthodes d’élevage. Chez The Wine Watchers, nous privilégions les Champagnes dotés d’une identité forte, d’une bulle précise et d’un équilibre remarquable, qu’ils soient destinés à être appréciés dès aujourd’hui ou conservés plusieurs années.",
  },

  bolgheri: {
    title: "Pourquoi choisir un vin de Bolgheri ?",
    opinion:
      "Bolgheri est devenu l’un des terroirs les plus prestigieux d’Italie grâce à des vins rouges d’une grande profondeur, souvent élaborés à partir de cépages bordelais. L’influence maritime, la diversité des sols et la précision des meilleurs domaines permettent d’obtenir des cuvées puissantes, élégantes et aptes à une longue garde. Chez The Wine Watchers, nous sélectionnons les vins de Bolgheri qui associent maturité, fraîcheur et finesse, en privilégiant les expressions les plus fidèles à l’identité de la côte toscane.",
  },

  "ribera-del-duero": {
    title: "Pourquoi choisir un Ribera del Duero ?",
    opinion:
      "Ribera del Duero est l’une des grandes appellations espagnoles de référence. Principalement issus du Tempranillo, ses vins bénéficient de l’altitude et de fortes amplitudes thermiques, qui favorisent concentration, fraîcheur et complexité. Les meilleures cuvées offrent une matière profonde, des tanins structurés et un remarquable potentiel de garde. Chez The Wine Watchers, nous recherchons les Ribera del Duero capables d’allier puissance et précision, avec une expression équilibrée du fruit, du terroir et de l’élevage.",
  },

  "bonnes-mares-grand-cru": {
    title: "Pourquoi choisir un Bonnes-Mares Grand Cru ?",
    opinion:
      "Bonnes-Mares compte parmi les Grands Crus les plus puissants et les plus complexes de la Côte de Nuits. Situé entre Chambolle-Musigny et Morey-Saint-Denis, ce terroir donne naissance à des Pinot Noir profonds, structurés et capables d’une très longue évolution. Chez The Wine Watchers, nous apprécions Bonnes-Mares pour son alliance entre densité, noblesse aromatique et précision, avec des vins qui gagnent en harmonie et en raffinement au fil des années.",
  },

  "chablis-1er-cru": {
    title: "Pourquoi choisir un Chablis Premier Cru ?",
    opinion:
      "Les Chablis Premier Cru offrent une lecture particulièrement précise du Chardonnay sur les sols kimméridgiens du vignoble chablisien. Ils associent fraîcheur, tension, minéralité et profondeur, avec une complexité supérieure aux cuvées village. Chez The Wine Watchers, nous sélectionnons les Chablis Premier Cru qui préservent la pureté du fruit, l’énergie du terroir et une remarquable aptitude à évoluer en bouteille, sans jamais perdre leur identité cristalline.",
  },

  "chablis-grand-cru": {
    title: "Pourquoi choisir un Chablis Grand Cru ?",
    opinion:
      "Chablis Grand Cru représente le sommet du vignoble chablisien. Ces grands Chardonnay associent puissance, ampleur, tension minérale et remarquable capacité de garde. Les meilleurs climats développent avec le temps une complexité profonde tout en conservant la fraîcheur et la précision caractéristiques de Chablis. Chez The Wine Watchers, nous privilégions les cuvées capables d’exprimer toute la noblesse de ces terroirs historiques avec équilibre, pureté et longueur.",
  },

  "chambolle-musigny": {
    title: "Pourquoi choisir un Chambolle-Musigny ?",
    opinion:
      "Chambolle-Musigny incarne l’une des expressions les plus fines et les plus élégantes du Pinot Noir en Bourgogne. Ses vins se distinguent par leur texture soyeuse, leur précision aromatique et leur capacité à conjuguer délicatesse et profondeur. Chez The Wine Watchers, nous recherchons les Chambolle-Musigny qui traduisent avec justesse cette identité raffinée, depuis les cuvées village jusqu’aux Premiers Crus et Grands Crus les plus prestigieux.",
  },

  "cote-de-nuits": {
    title: "Pourquoi choisir un vin de la Côte de Nuits ?",
    opinion:
      "La Côte de Nuits concentre certains des plus grands terroirs de Pinot Noir au monde. De Gevrey-Chambertin à Nuits-Saint-Georges, en passant par Chambolle-Musigny et Vosne-Romanée, elle offre une diversité exceptionnelle de styles, de la puissance à la finesse la plus raffinée. Chez The Wine Watchers, nous sélectionnons les vins qui expriment avec précision leur village, leur climat et leur domaine, tout en conservant l’équilibre et le potentiel de garde propres aux grandes Bourgognes.",
  },

  musigny: {
    title: "Pourquoi choisir un Musigny Grand Cru ?",
    opinion:
      "Musigny est l’un des Grands Crus les plus rares et les plus prestigieux de Bourgogne. Il se distingue par une combinaison exceptionnelle de finesse, de profondeur, de complexité aromatique et de longueur. Les meilleurs Musigny offrent une texture d’une grande délicatesse tout en possédant une structure capable de traverser les décennies. Chez The Wine Watchers, nous considérons ce cru comme l’une des expressions les plus accomplies et les plus émouvantes du Pinot Noir.",
  },

  "pessac-leognan": {
    title: "Pourquoi choisir un Pessac-Léognan ?",
    opinion:
      "Pessac-Léognan se distingue par sa capacité à produire aussi bien de grands vins rouges que de remarquables blancs secs. Les rouges associent structure, finesse, notes fumées et potentiel de garde, tandis que les blancs offrent fraîcheur, profondeur et complexité. Chez The Wine Watchers, nous privilégions les cuvées qui révèlent avec précision les sols graveleux de l’appellation et l’équilibre caractéristique des meilleurs domaines des Graves.",
  },

  "st-estephe": {
    title: "Pourquoi choisir un Saint-Estèphe ?",
    opinion:
      "Saint-Estèphe est réputée pour ses vins profonds, structurés et particulièrement aptes au vieillissement. Les sols argileux apportent densité et fraîcheur, permettant aux meilleurs crus de conjuguer puissance, équilibre et complexité. Chez The Wine Watchers, nous sélectionnons les Saint-Estèphe qui dépassent la seule force tannique pour révéler une véritable précision, une belle énergie et une personnalité durable au fil des millésimes.",
  },

  "saint-estephe": {
    title: "Pourquoi choisir un Saint-Estèphe ?",
    opinion:
      "Saint-Estèphe est réputée pour ses vins profonds, structurés et particulièrement aptes au vieillissement. Les sols argileux apportent densité et fraîcheur, permettant aux meilleurs crus de conjuguer puissance, équilibre et complexité. Chez The Wine Watchers, nous sélectionnons les Saint-Estèphe qui dépassent la seule force tannique pour révéler une véritable précision, une belle énergie et une personnalité durable au fil des millésimes.",
  },

  "st-julien": {
    title: "Pourquoi choisir un Saint-Julien ?",
    opinion:
      "Saint-Julien est souvent considérée comme l’une des appellations les plus harmonieuses du Médoc. Ses vins associent structure, élégance, régularité et remarquable potentiel de garde. Chez The Wine Watchers, nous apprécions particulièrement leur équilibre naturel, leur précision et leur capacité à réunir la profondeur de Pauillac et la finesse de Margaux. Les meilleurs crus offrent une lecture classique et profondément raffinée du Cabernet Sauvignon médocain.",
  },

  "saint-julien": {
    title: "Pourquoi choisir un Saint-Julien ?",
    opinion:
      "Saint-Julien est souvent considérée comme l’une des appellations les plus harmonieuses du Médoc. Ses vins associent structure, élégance, régularité et remarquable potentiel de garde. Chez The Wine Watchers, nous apprécions particulièrement leur équilibre naturel, leur précision et leur capacité à réunir la profondeur de Pauillac et la finesse de Margaux. Les meilleurs crus offrent une lecture classique et profondément raffinée du Cabernet Sauvignon médocain.",
  },

  sauternes: {
    title: "Pourquoi choisir un Sauternes ?",
    opinion:
      "Sauternes produit certains des plus grands vins liquoreux au monde grâce à l’action de la pourriture noble et à un savoir-faire d’une précision exceptionnelle. Les meilleures cuvées associent richesse, fraîcheur, complexité aromatique et immense potentiel de garde. Chez The Wine Watchers, nous sélectionnons les Sauternes capables de conserver un équilibre lumineux entre douceur et acidité, afin d’offrir des vins profonds, raffinés et jamais pesants.",
  },
  "chambertin-clos-de-beze-grand-cru": {
    title: "Pourquoi choisir un Chambertin Clos de Bèze Grand Cru ?",
    opinion:
      "Chambertin Clos de Bèze Grand Cru figure parmi les terroirs les plus prestigieux de Gevrey-Chambertin et de toute la Bourgogne. Les meilleurs vins allient une puissance naturelle à une profondeur aromatique remarquable, tout en conservant une finesse et une précision qui leur permettent d’évoluer harmonieusement pendant plusieurs décennies. Chez The Wine Watchers, nous privilégions les cuvées capables d’exprimer toute la noblesse de ce Grand Cru historique, où la concentration du Pinot Noir s’accompagne toujours d’une élégance exceptionnelle.",
  },

  "clos-des-lambrays-grand-cru": {
    title: "Pourquoi choisir un Clos des Lambrays Grand Cru ?",
    opinion:
      "Clos des Lambrays Grand Cru est l’un des climats les plus emblématiques de Morey-Saint-Denis. Son monopole historique produit des vins à la fois profonds, raffinés et particulièrement complexes, où la richesse du fruit s’équilibre avec une remarquable fraîcheur. Chez The Wine Watchers, nous apprécions les Clos des Lambrays qui révèlent toute la subtilité de leur terroir, avec une texture soyeuse, une grande longueur et un potentiel de garde exceptionnel.",
  },

  "clos-de-la-roche-grand-cru": {
    title: "Pourquoi choisir un Clos de la Roche Grand Cru ?",
    opinion:
      "Clos de la Roche Grand Cru est reconnu pour produire certains des Pinot Noir les plus profonds de la Côte de Nuits. Les meilleurs domaines y élaborent des vins concentrés, complexes et parfaitement structurés, capables de traverser les décennies sans perdre leur précision. Chez The Wine Watchers, nous recherchons les Clos de la Roche qui associent puissance, équilibre et élégance, offrant une lecture fidèle de l’un des plus grands terroirs de Morey-Saint-Denis.",
  },

  "chapelle-chambertin-grand-cru": {
    title: "Pourquoi choisir un Chapelle-Chambertin Grand Cru ?",
    opinion:
      "Chapelle-Chambertin Grand Cru séduit par son équilibre entre finesse, profondeur et expression aromatique. Moins démonstratif que certains Grands Crus voisins, il offre souvent une texture particulièrement élégante et une grande précision du fruit. Chez The Wine Watchers, nous sélectionnons les Chapelle-Chambertin capables de conjuguer raffinement, complexité et potentiel de garde, dans le respect de l’identité unique de ce climat prestigieux.",
  },

  "charmes-chambertin-grand-cru": {
    title: "Pourquoi choisir un Charmes-Chambertin Grand Cru ?",
    opinion:
      "Charmes-Chambertin Grand Cru est réputé pour la générosité, la profondeur et la sensualité de ses Pinot Noir. Les meilleures cuvées associent une matière ample, des tanins soyeux et une grande richesse aromatique, tout en conservant l’équilibre nécessaire à une longue évolution. Chez The Wine Watchers, nous privilégions les Charmes-Chambertin qui expriment avec précision la noblesse de ce terroir de Gevrey-Chambertin.",
  },

  "ruchottes-chambertin-grand-cru": {
    title: "Pourquoi choisir un Ruchottes-Chambertin Grand Cru ?",
    opinion:
      "Ruchottes-Chambertin Grand Cru est l’un des climats les plus rares et les plus confidentiels de Gevrey-Chambertin. Ses vins associent finesse, fraîcheur, minéralité et profondeur, avec une précision remarquable dans les meilleurs millésimes. Chez The Wine Watchers, nous apprécions particulièrement les Ruchottes-Chambertin capables de révéler cette identité subtile et élégante, portée par un grand potentiel de garde.",
  },

  "mazis-chambertin-grand-cru": {
    title: "Pourquoi choisir un Mazis-Chambertin Grand Cru ?",
    opinion:
      "Mazis-Chambertin Grand Cru compte parmi les expressions les plus puissantes et les plus structurées de Gevrey-Chambertin. Les meilleurs vins offrent une matière profonde, une grande intensité aromatique et une capacité remarquable à évoluer avec le temps. Chez The Wine Watchers, nous sélectionnons les Mazis-Chambertin qui associent densité, fraîcheur et précision, sans jamais sacrifier l’élégance à la puissance.",
  },

  "clos-de-tart-grand-cru-monopole": {
    title: "Pourquoi choisir un Clos de Tart Grand Cru Monopole ?",
    opinion:
      "Clos de Tart Grand Cru Monopole est l’un des terroirs historiques les plus prestigieux de Morey-Saint-Denis. Ce vignoble clos produit des Pinot Noir profonds, complexes et d’une grande longévité, capables d’allier puissance, finesse et remarquable précision. Chez The Wine Watchers, nous recherchons les Clos de Tart qui traduisent pleinement l’identité de ce monopole d’exception et la noblesse de son terroir.",
  },

  "cote-rotie": {
    title: "Pourquoi choisir une Côte-Rôtie ?",
    opinion:
      "Côte-Rôtie compte parmi les appellations les plus prestigieuses de la Vallée du Rhône septentrionale. Sur ses coteaux abrupts, la Syrah donne naissance à des vins profonds, élégants et complexes, souvent marqués par une grande finesse aromatique et un remarquable potentiel de garde. Chez The Wine Watchers, nous sélectionnons les Côte-Rôtie qui associent intensité, précision et équilibre, avec une expression fidèle de leur terroir et de leur domaine.",
  },

  californie: {
    title: "Pourquoi choisir un grand vin de Californie ?",
    opinion:
      "La Californie produit certaines des cuvées les plus prestigieuses des États-Unis, notamment dans la Napa Valley et à Sonoma. Les meilleurs vins associent maturité, profondeur, précision et remarquable capacité de vieillissement. Chez The Wine Watchers, nous privilégions les domaines capables de préserver fraîcheur, équilibre et identité du terroir, au-delà de la seule richesse du fruit, afin d’offrir des vins puissants mais toujours harmonieux.",
  },

  "aoc-champagne": {
    title: "Pourquoi choisir un Champagne d’exception ?",
    opinion:
      "L’AOC Champagne réunit une grande diversité de terroirs, de cépages et de styles, depuis les grandes maisons historiques jusqu’aux vignerons les plus confidentiels. Les meilleures cuvées associent finesse de bulle, fraîcheur, profondeur et complexité. Chez The Wine Watchers, nous sélectionnons les Champagnes dotés d’une véritable identité, capables d’offrir un équilibre remarquable dès aujourd’hui comme après plusieurs années de garde.",
  },
};