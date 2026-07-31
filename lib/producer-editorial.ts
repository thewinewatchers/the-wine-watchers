export type ProducerEditorialSection = {
  title: string;
  paragraphs: string[];
};

export type ProducerEditorialContent = {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: ProducerEditorialSection[];
  conclusion?: string;
};

export const PRODUCER_EDITORIAL_LIBRARY: Record<
  string,
  ProducerEditorialContent
> = {
  "chateau-lafite-rothschild": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Lafite Rothschild, la précision souveraine de Pauillac",
    introduction:
      "Premier Grand Cru Classé de Pauillac, Château Lafite Rothschild occupe une place singulière dans l’histoire des grands vins de Bordeaux. Son nom évoque autant la profondeur d’un terroir exceptionnel que la recherche constante d’un équilibre fondé sur la finesse, la longueur et la retenue. Derrière son prestige international se trouve un vin dont l’identité repose moins sur la puissance démonstrative que sur une précision patiemment construite.",
    sections: [
      {
        title: "Un domaine historique au cœur de Pauillac",
        paragraphs: [
          "Installé au nord de l’appellation Pauillac, à proximité de Saint-Estèphe, Château Lafite Rothschild appartient aux propriétés les plus anciennes et les plus reconnues du Médoc. Sa réputation, déjà solidement établie bien avant le classement de 1855, lui valut d’être placé au sommet de la hiérarchie bordelaise parmi les Premiers Grands Crus Classés.",
          "L’acquisition du domaine par la famille Rothschild au XIXe siècle a ouvert une nouvelle période de son histoire. Depuis lors, la propriété a su préserver une continuité rare, associant le respect de son patrimoine à une exigence technique destinée à exprimer chaque millésime avec la plus grande fidélité.",
        ],
      },
      {
        title: "Les graves profondes, fondement du style Lafite",
        paragraphs: [
          "Le vignoble repose principalement sur de profondes croupes de graves, mêlées de sables et posées sur un sous-sol calcaire. Ces sols pauvres et très drainants favorisent un enracinement profond de la vigne et permettent une maturation progressive des raisins, particulièrement favorable au Cabernet Sauvignon.",
          "Cette combinaison entre drainage, exposition et régulation naturelle de l’eau contribue directement au profil du grand vin. Lafite se distingue ainsi par une structure très droite, des tanins d’une grande finesse et une fraîcheur qui accompagne le vin jusque dans sa finale.",
        ],
      },
      {
        title: "Une expression fondée sur l’élégance et la longueur",
        paragraphs: [
          "Château Lafite Rothschild n’est pas un Pauillac qui cherche à impressionner par la seule densité. Sa personnalité se révèle dans la précision de son dessin, la pureté de son fruit et la qualité de ses nuances. Le cassis, le graphite, le cèdre, le tabac blond et les notes florales apparaissent souvent avec le temps, sans jamais masquer la trame minérale du vin.",
          "Dans les grands millésimes, la bouche conjugue profondeur et légèreté de mouvement. Les tanins, présents mais extrêmement raffinés, soutiennent une finale persistante qui constitue l’une des signatures les plus reconnaissables de la propriété.",
        ],
      },
      {
        title: "Le temps comme allié naturel",
        paragraphs: [
          "La capacité de garde de Château Lafite Rothschild est l’une des raisons majeures de son statut auprès des amateurs et des collectionneurs. Les bouteilles les plus jeunes peuvent paraître réservées, parfois presque austères, avant de gagner progressivement en complexité, en ampleur et en harmonie.",
          "Au fil des années, le vin développe une palette aromatique plus profonde où les fruits noirs, les épices douces, les notes de boîte à cigares et les touches minérales se fondent dans une texture de plus en plus soyeuse. Cette lente évolution explique l’intérêt porté aussi bien aux millésimes récents qu’aux bouteilles anciennes conservées dans de bonnes conditions.",
        ],
      },
      {
        title: "Carruades de Lafite, une autre lecture du vignoble",
        paragraphs: [
          "Le domaine produit également Carruades de Lafite, issu de parcelles et de sélections distinctes du grand vin. Cette cuvée possède sa propre personnalité tout en conservant les repères essentiels de la propriété : précision, fraîcheur, élégance et équilibre.",
          "Plus accessible dans sa jeunesse selon les millésimes, Carruades de Lafite permet d’approcher le style du domaine sous une forme différente, sans être une simple réduction du grand vin. Il constitue à part entière une expression recherchée de Pauillac.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Lafite Rothschild, c’est entrer dans l’univers d’un grand vin dont la force réside dans la maîtrise. Chaque bouteille raconte à sa manière la rencontre entre un terroir de graves, une culture du temps long et une conception de l’élégance devenue une référence mondiale.",
  },
  "chateau-latour": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Latour, la puissance maîtrisée de Pauillac",
    introduction:
      "Premier Grand Cru Classé de Pauillac, Château Latour incarne une vision monumentale du grand vin de Bordeaux. Sa réputation repose sur un terroir d’une rare cohérence, une profondeur de structure remarquable et une capacité de vieillissement qui place ses plus grands millésimes parmi les références absolues du Médoc. Latour impressionne par sa force, mais surtout par la précision avec laquelle cette force est maîtrisée.",
    sections: [
      {
        title: "La Tour de Saint-Lambert, emblème d’un domaine historique",
        paragraphs: [
          "Situé à l’extrême sud de Pauillac, face à l’estuaire de la Gironde, Château Latour doit une partie de son identité à la célèbre tour qui domine la propriété. Le domaine est intimement lié à l’histoire du Médoc et sa réputation était déjà solidement établie bien avant le classement de 1855, qui le consacra Premier Grand Cru Classé.",
          "Au fil des siècles, la propriété a su préserver une continuité exceptionnelle. Son exigence repose sur une connaissance approfondie de chaque parcelle et sur une sélection rigoureuse destinée à maintenir un niveau de qualité constant, y compris dans les millésimes plus difficiles.",
        ],
      },
      {
        title: "L’Enclos, cœur du terroir de Latour",
        paragraphs: [
          "Le grand vin naît principalement de l’Enclos, un ensemble de parcelles historiques situé autour du château. Les sols de graves profondes, posés sur des sous-sols d’argile, bénéficient de la proximité de l’estuaire, qui joue un rôle modérateur sur les températures et limite les risques climatiques extrêmes.",
          "Ce terroir convient particulièrement au Cabernet Sauvignon, cépage dominant de l’assemblage. Il y développe une maturité lente, une structure tannique dense et une fraîcheur naturelle qui constituent la colonne vertébrale du style Latour.",
        ],
      },
      {
        title: "Un Pauillac de profondeur et de précision",
        paragraphs: [
          "Château Latour est souvent associé à la puissance, mais cette définition demeure incomplète. La véritable signature du vin réside dans l’équilibre entre densité, tension et précision. Les arômes de cassis, de mûre, de graphite, de cèdre et de tabac s’inscrivent dans une bouche compacte, droite et remarquablement persistante.",
          "Dans les grands millésimes, la matière est impressionnante sans jamais devenir lourde. Les tanins, très présents dans la jeunesse, gagnent progressivement en finesse et en intégration, révélant une texture profonde et une finale d’une longueur exceptionnelle.",
        ],
      },
      {
        title: "Une capacité de garde légendaire",
        paragraphs: [
          "Latour fait partie des vins de Bordeaux dont l’évolution en bouteille est la plus spectaculaire. Les jeunes millésimes peuvent se montrer fermés, massifs et peu expansifs, mais leur structure contient une réserve de complexité considérable.",
          "Avec le temps, le vin développe des notes de cuir fin, de boîte à cigares, de mine de crayon, de truffe et d’épices, tout en conservant une fraîcheur remarquable. Cette longévité explique pourquoi les anciennes bouteilles de Latour occupent une place privilégiée dans les caves de collection.",
        ],
      },
      {
        title: "Les Forts de Latour et Pauillac de Latour",
        paragraphs: [
          "La propriété produit également Les Forts de Latour, une cuvée issue de parcelles et de sélections distinctes du grand vin. Elle conserve l’empreinte du domaine tout en offrant généralement une expression plus accessible dans sa jeunesse.",
          "Pauillac de Latour complète cette gamme avec une lecture plus immédiate du vignoble. Ces cuvées ne sont pas de simples déclinaisons : elles possèdent leur propre équilibre et permettent de comprendre les différentes expressions du terroir de Latour.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Latour, c’est choisir un vin construit pour durer. Sa puissance n’est jamais gratuite : elle est portée par un terroir exceptionnel, une précision constante et une capacité à traverser les décennies sans perdre son identité.",
  },
  "chateau-mouton-rothschild": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Mouton Rothschild, l’audace et la grandeur de Pauillac",
    introduction:
      "Premier Grand Cru Classé de Pauillac, Château Mouton Rothschild occupe une place unique dans l’histoire de Bordeaux. Son ascension, son identité artistique et son style ample et expressif en ont fait l’un des domaines les plus emblématiques du Médoc. Derrière cette image prestigieuse se trouve un terroir de premier ordre, porté par le Cabernet Sauvignon et interprété avec une ambition constante.",
    sections: [
      {
        title: "Une ascension devenue légendaire",
        paragraphs: [
          "Longtemps classé Deuxième Cru dans la hiérarchie de 1855, Château Mouton Rothschild fut élevé au rang de Premier Grand Cru Classé en 1973. Cette promotion exceptionnelle consacra des décennies d’efforts et l’action déterminante du baron Philippe de Rothschild, qui transforma profondément la propriété et son rayonnement international.",
          "Cette histoire nourrit encore aujourd’hui l’identité du domaine. Mouton symbolise à la fois l’attachement à la tradition médocaine et une volonté permanente d’innover, de se distinguer et de donner au vin une dimension culturelle qui dépasse le seul cadre de la dégustation.",
        ],
      },
      {
        title: "Le Plateau de Mouton, un grand terroir de graves",
        paragraphs: [
          "Le vignoble s’étend sur les croupes graveleuses de Pauillac, dans un secteur réputé pour la qualité de son drainage et la profondeur de ses sols. Ces graves pauvres obligent la vigne à développer un enracinement profond, favorisant une maturation régulière et une grande concentration des raisins.",
          "Le Cabernet Sauvignon domine largement l’encépagement et donne au grand vin sa structure, sa profondeur et son aptitude à la garde. Le Merlot apporte de la chair et de la souplesse, tandis que les autres cépages complètent l’assemblage selon les caractéristiques de chaque millésime.",
        ],
      },
      {
        title: "Un Pauillac généreux, profond et expressif",
        paragraphs: [
          "Le style de Château Mouton Rothschild se distingue par une intensité aromatique souvent spectaculaire. Les fruits noirs mûrs, le cassis, la mûre, le cèdre, les épices, le graphite et les notes fumées composent une palette riche, soutenue par une texture ample et des tanins puissants mais raffinés.",
          "Mouton possède une dimension plus expansive que certains autres Premiers Crus de Pauillac. Cette générosité ne sacrifie pourtant ni la précision ni la fraîcheur : dans les grands millésimes, le vin associe densité, énergie et longueur avec une remarquable maîtrise.",
        ],
      },
      {
        title: "Les étiquettes d’artistes, signature culturelle du domaine",
        paragraphs: [
          "Depuis le milieu du XXe siècle, chaque millésime de Château Mouton Rothschild reçoit une étiquette originale créée par un artiste. Cette tradition a associé le domaine à de grandes figures de la peinture et de l’art contemporain, donnant à chaque bouteille une identité visuelle immédiatement reconnaissable.",
          "Ces œuvres ne remplacent jamais le vin, mais elles prolongent son histoire et renforcent le caractère singulier de chaque millésime. Pour les collectionneurs, une bouteille de Mouton représente ainsi à la fois un grand Pauillac, un témoignage d’époque et un objet culturel.",
        ],
      },
      {
        title: "Petit Mouton, une autre expression de la propriété",
        paragraphs: [
          "Le Petit Mouton de Mouton Rothschild est élaboré avec la même attention que le grand vin, à partir de sélections distinctes. Il reprend les principaux repères stylistiques du domaine : richesse aromatique, profondeur, précision et caractère typiquement pauillacais.",
          "Généralement plus accessible dans sa jeunesse, il ne doit pas être considéré comme une simple version réduite du grand vin. Chaque millésime possède son équilibre propre et offre une lecture complémentaire du terroir et du savoir-faire de Mouton Rothschild.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Mouton Rothschild, c’est associer la grandeur d’un Premier Cru de Pauillac à une histoire d’audace et de création. Le vin séduit par sa profondeur, son expression et sa capacité à traverser le temps, tandis que chaque bouteille porte la mémoire artistique de son millésime.",
  },
  "chateau-margaux": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Margaux, l’élégance souveraine du Médoc",
    introduction:
      "Premier Grand Cru Classé en 1855, Château Margaux occupe une place à part parmi les grandes propriétés bordelaises. Son prestige repose sur une alliance rare entre profondeur, finesse aromatique et fluidité de texture. Là où certains grands Médocs s’imposent d’abord par leur puissance, Margaux séduit par la précision de son équilibre et par une élégance qui traverse les décennies.",
    sections: [
      {
        title: "Une propriété historique au cœur de l’appellation Margaux",
        paragraphs: [
          "L’histoire du domaine s’inscrit dans celle des plus anciennes propriétés viticoles du Médoc. Sa réputation était déjà considérable avant le classement de 1855, qui le plaça au rang de Premier Grand Cru Classé. Le château néoclassique, devenu l’un des symboles architecturaux de Bordeaux, reflète la dimension patrimoniale d’une propriété dont l’identité dépasse largement le seul cadre viticole.",
          "Au fil des générations, Château Margaux a connu différentes périodes avant de retrouver une continuité et une précision remarquables. La propriété s’appuie aujourd’hui sur une connaissance détaillée de ses parcelles, une sélection rigoureuse et une recherche permanente de pureté dans l’expression du millésime.",
        ],
      },
      {
        title: "Les graves, source de finesse et de profondeur",
        paragraphs: [
          "Le vignoble repose sur des croupes de graves particulièrement bien drainées, mêlées selon les secteurs à des éléments calcaires et argileux. Ces sols pauvres favorisent un enracinement profond et une maturation régulière, particulièrement adaptée au Cabernet Sauvignon.",
          "Cette diversité géologique permet de construire des assemblages à la fois complexes et harmonieux. Le Cabernet Sauvignon apporte la colonne vertébrale, la longueur et la fraîcheur, tandis que le Merlot contribue à la rondeur et à l’ampleur. Les autres cépages complètent l’ensemble avec des nuances florales et épicées.",
        ],
      },
      {
        title: "Le style Margaux : parfum, texture et précision",
        paragraphs: [
          "La signature de Château Margaux réside autant dans son bouquet que dans sa texture. Les grands millésimes développent des notes de cassis, de violette, de rose, de cèdre, de graphite et d’épices fines. L’intensité aromatique s’accompagne d’une bouche souple dans son mouvement, mais solidement structurée.",
          "Les tanins sont souvent d’une finesse remarquable. Ils donnent au vin une sensation de précision et de légèreté sans jamais réduire sa profondeur. La finale, longue et fraîche, prolonge l’impression de pureté qui caractérise les plus belles réussites de la propriété.",
        ],
      },
      {
        title: "Une évolution lente et harmonieuse",
        paragraphs: [
          "Château Margaux possède une grande capacité de garde. Dans sa jeunesse, le vin peut se montrer réservé, dominé par sa structure et sa fraîcheur. Avec le temps, il développe une complexité plus ample où apparaissent des notes de tabac blond, de sous-bois, de cuir fin, de truffe et de fleurs séchées.",
          "Cette évolution progressive ne gomme pas l’identité du millésime. Elle lui apporte au contraire une profondeur supplémentaire, permettant aux grandes bouteilles de conserver une étonnante vitalité après plusieurs décennies.",
        ],
      },
      {
        title: "Pavillon Rouge et Pavillon Blanc",
        paragraphs: [
          "Pavillon Rouge du Château Margaux constitue le second vin rouge de la propriété. Issu de sélections spécifiques, il conserve les repères essentiels du domaine tout en offrant généralement une approche plus accessible dans sa jeunesse.",
          "Pavillon Blanc du Château Margaux, élaboré à partir de Sauvignon Blanc, représente une autre facette historique de la propriété. Sa production limitée, sa tension et sa complexité en font l’un des grands vins blancs secs de Bordeaux.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Margaux, c’est rechercher un grand vin dont la puissance se dissimule derrière l’élégance. Son parfum, sa précision et sa capacité à évoluer lentement en bouteille en font l’une des expressions les plus raffinées du Médoc.",
  },
  "chateau-haut-brion": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Haut-Brion, la profondeur historique de Pessac-Léognan",
    introduction:
      "Premier Grand Cru Classé, Château Haut-Brion occupe une position unique dans l’univers des grands vins de Bordeaux. Situé aux portes de la ville, il est le seul Premier Cru Classé de 1855 établi hors du Médoc. Son identité associe une histoire ancienne, un terroir de graves singulier et un style immédiatement reconnaissable, marqué par la profondeur, la complexité aromatique et une texture d’une grande distinction.",
    sections: [
      {
        title: "L’un des plus anciens noms du vignoble bordelais",
        paragraphs: [
          "Château Haut-Brion appartient aux propriétés qui ont contribué très tôt à la renommée internationale des vins de Bordeaux. Dès les siècles passés, ses vins étaient identifiés sous le nom de leur domaine, à une époque où cette pratique demeurait encore exceptionnelle.",
          "Son classement parmi les Premiers Grands Crus en 1855 confirma une réputation déjà ancienne. Cette continuité historique donne à Haut-Brion une place particulière : celle d’un domaine qui a participé à la construction même de la notion de grand cru bordelais.",
        ],
      },
      {
        title: "Un terroir de graves au sein d’un environnement urbain",
        paragraphs: [
          "Le vignoble repose sur des croupes de graves profondes, composées de galets, de quartz et de sables, avec des sous-sols mêlant argiles et éléments calcaires. Ces sols assurent un drainage efficace tout en permettant à la vigne de puiser l’eau en profondeur.",
          "Entourée aujourd’hui par l’agglomération bordelaise, la propriété conserve un terroir exceptionnellement préservé. Cette situation singulière ne réduit en rien son identité ; elle souligne au contraire la rareté d’un vignoble historique demeuré intact au fil de l’expansion urbaine.",
        ],
      },
      {
        title: "Une signature aromatique immédiatement reconnaissable",
        paragraphs: [
          "Haut-Brion se distingue par un bouquet souvent marqué par les fruits noirs, la fumée, le tabac, la terre chaude, le graphite et les épices. Ces notes légèrement empyreumatiques constituent l’une des signatures les plus célèbres du domaine.",
          "En bouche, le vin associe densité et souplesse. La structure tannique est profonde mais rarement massive, tandis que la texture gagne rapidement en velouté. Cette combinaison donne un vin à la fois puissant, complexe et étonnamment harmonieux.",
        ],
      },
      {
        title: "Un assemblage à forte personnalité",
        paragraphs: [
          "Le Merlot et le Cabernet Sauvignon occupent une place centrale dans les assemblages, accompagnés du Cabernet Franc. Leur proportion varie selon les caractéristiques du millésime et les choix de sélection.",
          "Cette composition contribue à différencier Haut-Brion de nombreux grands vins du Médoc. Le Merlot apporte de la chair et une texture enveloppante, tandis que les Cabernets assurent la fraîcheur, la structure et la longueur nécessaires à une évolution prolongée.",
        ],
      },
      {
        title: "La Mission Haut-Brion et les vins blancs du domaine",
        paragraphs: [
          "L’environnement viticole de Haut-Brion comprend également Château La Mission Haut-Brion, propriété voisine dotée d’une identité propre et d’une réputation internationale. Les deux domaines offrent des interprétations distinctes de terroirs proches, ce qui nourrit depuis longtemps l’intérêt des amateurs.",
          "Haut-Brion produit aussi un vin blanc sec extrêmement rare, issu principalement de Sauvignon Blanc et de Sémillon. Sa richesse, sa tension et sa capacité de vieillissement le placent parmi les expressions blanches les plus recherchées de Bordeaux.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Haut-Brion, c’est découvrir un grand vin dont la personnalité ne ressemble à aucune autre. Son histoire, son parfum fumé, sa texture profonde et sa capacité de garde en font une référence incontournable de Pessac-Léognan et de Bordeaux.",
  },
  "chateau-cheval-blanc": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Cheval Blanc, l'équilibre magistral de Saint-Émilion",
    introduction:
      "Premier Grand Cru Classé A historique de Saint-Émilion, Château Cheval Blanc est reconnu pour un style unique où l'élégance, la fraîcheur et la profondeur se rejoignent. Son identité repose sur un terroir exceptionnel et un assemblage dominé par le Cabernet Franc, qui lui confère une personnalité incomparable.",
    sections: [
      {
        title: "Un domaine emblématique de la rive droite",
        paragraphs: [
          "Depuis le XIXᵉ siècle, Château Cheval Blanc s'est imposé comme l'une des références absolues de Saint-Émilion. Sa réputation repose sur une remarquable constance qualitative et sur une philosophie privilégiant l'expression du terroir avant tout.",
          "Chaque millésime est élaboré avec une sélection parcellaire extrêmement précise afin de préserver la pureté du grand vin.",
        ],
      },
      {
        title: "Un terroir d'une rare singularité",
        paragraphs: [
          "Le vignoble associe graves, argiles et sables sur des parcelles bénéficiant d'un drainage naturel remarquable.",
          "Cette mosaïque de sols permet d'obtenir des vins d'une grande complexité, mariant tension, richesse et finesse.",
        ],
      },
      {
        title: "Le rôle essentiel du Cabernet Franc",
        paragraphs: [
          "Contrairement à la majorité des grands vins de la rive droite, Cheval Blanc accorde une place prépondérante au Cabernet Franc.",
          "Ce cépage apporte fraîcheur, longueur, finesse florale et potentiel de garde, parfaitement complétés par le Merlot.",
        ],
      },
      {
        title: "Une évolution exceptionnelle",
        paragraphs: [
          "Les grands millésimes gagnent progressivement en complexité avec des notes de violette, de truffe, de cèdre, d'épices douces et de fruits noirs.",
          "Même après plusieurs décennies, ils conservent une remarquable énergie et une texture soyeuse.",
        ],
      },
      {
        title: "Petit Cheval",
        paragraphs: [
          "Petit Cheval constitue une expression complémentaire du domaine.",
          "Issu d'une sélection spécifique, il reflète le style de la propriété avec une approche généralement plus accessible dans sa jeunesse.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Cheval Blanc, c'est découvrir l'une des expressions les plus raffinées de Saint-Émilion, où la précision, la fraîcheur et la profondeur s'unissent dans un équilibre remarquable.",
  },
  "chateau-ausone": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Ausone, la profondeur minérale de Saint-Émilion",
    introduction:
      "Château Ausone appartient au cercle le plus prestigieux des grands vins de Saint-Émilion. Installé sur les coteaux calcaires qui dominent la cité, le domaine se distingue par un terroir spectaculaire, une production confidentielle et un style d'une grande intensité. Sa signature associe profondeur, fraîcheur et précision minérale dans des vins capables d'évoluer pendant plusieurs décennies.",
    sections: [
      {
        title: "Un domaine historique aux portes de Saint-Émilion",
        paragraphs: [
          "L'histoire de Château Ausone est intimement liée à celle de Saint-Émilion. Le domaine occupe un site ancien, installé sur les pentes calcaires qui entourent la ville et qui témoignent de plusieurs siècles de culture de la vigne.",
          "Sa réputation s'est construite sur une production limitée et sur une continuité remarquable dans l'expression du terroir. Cette rareté contribue à faire d'Ausone l'un des vins les plus recherchés de la rive droite.",
        ],
      },
      {
        title: "Le calcaire comme colonne vertébrale",
        paragraphs: [
          "Le vignoble repose sur un plateau et des coteaux calcaires où la vigne bénéficie d'un drainage naturel efficace et d'une alimentation hydrique régulière.",
          "Ce sous-sol calcaire joue un rôle essentiel dans la fraîcheur, la tension et la longueur du vin. Il apporte également cette sensation minérale qui constitue l'une des signatures les plus reconnaissables d'Ausone.",
        ],
      },
      {
        title: "Cabernet Franc et Merlot en harmonie",
        paragraphs: [
          "L'assemblage repose principalement sur le Cabernet Franc et le Merlot. Le Cabernet Franc apporte la fraîcheur, la finesse florale et la structure, tandis que le Merlot contribue à la chair et à la profondeur.",
          "Cette complémentarité permet d'obtenir des vins à la fois puissants et précis, capables de conserver une remarquable énergie malgré leur densité.",
        ],
      },
      {
        title: "Un style intense et sculpté",
        paragraphs: [
          "Dans sa jeunesse, Château Ausone peut se montrer compact, profond et réservé. Les arômes de fruits noirs, de violette, de pierre humide, d'épices et de graphite s'inscrivent dans une bouche très structurée.",
          "Avec le temps, la texture s'assouplit et révèle une complexité supplémentaire, marquée par des notes de truffe, de tabac fin et de sous-bois, sans perdre la tension minérale du terroir.",
        ],
      },
      {
        title: "Chapelle d'Ausone",
        paragraphs: [
          "Chapelle d'Ausone constitue la seconde expression du domaine. Issue d'une sélection spécifique, cette cuvée conserve la fraîcheur et la précision caractéristiques de la propriété.",
          "Elle offre généralement une approche plus accessible dans sa jeunesse tout en possédant un réel potentiel de garde.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Ausone, c'est découvrir un grand vin façonné par le calcaire, la rareté et le temps. Sa profondeur, sa tension et son élégance en font l'une des expressions les plus singulières de Saint-Émilion.",
  },
  petrus: {
    eyebrow: "Histoire, terroir et identité",
    title: "Petrus, l’expression mythique du plateau de Pomerol",
    introduction:
      "Petrus occupe une place unique parmi les grands vins de Bordeaux. Il ne s’agit pas d’un château, mais d’un domaine de Pomerol dont le nom seul est devenu une référence mondiale. Sa réputation repose sur un terroir d’argiles exceptionnel, une production très limitée et un style d’une profondeur remarquable, dominé par le Merlot dans ce qu’il peut offrir de plus dense, de plus velouté et de plus complexe.",
    sections: [
      {
        title: "Un nom à part dans l’histoire de Pomerol",
        paragraphs: [
          "Petrus s’est imposé progressivement comme l’un des vins les plus recherchés de Bordeaux, sans bénéficier du classement historique qui structure les appellations du Médoc ou de Saint-Émilion.",
          "Sa notoriété repose avant tout sur la singularité de son terroir, sur la constance de sa qualité et sur une production confidentielle qui renforce encore son caractère exceptionnel.",
        ],
      },
      {
        title: "Le rôle déterminant des argiles bleues",
        paragraphs: [
          "Le vignoble est implanté sur le plateau de Pomerol, sur des sols riches en argiles profondes capables de conserver l’humidité et de réguler naturellement l’alimentation de la vigne.",
          "Ces argiles donnent au vin sa densité, sa texture et sa profondeur, tout en conservant une fraîcheur essentielle à son équilibre.",
        ],
      },
      {
        title: "Le Merlot dans sa forme la plus accomplie",
        paragraphs: [
          "Petrus est élaboré presque exclusivement à partir de Merlot, cépage particulièrement adapté aux sols argileux de Pomerol.",
          "Il développe une matière ample et soyeuse, des tanins profonds et une intensité aromatique exceptionnelle, sans jamais perdre sa précision.",
        ],
      },
      {
        title: "Une signature de profondeur et de velours",
        paragraphs: [
          "Dans sa jeunesse, Petrus peut offrir des arômes de fruits noirs mûrs, de prune, de violette, d’épices et de terre fraîche.",
          "Avec le temps, le vin gagne en complexité et révèle des notes de truffe, de sous-bois, de cuir fin et de cacao, tout en conservant une texture enveloppante.",
        ],
      },
      {
        title: "Une rareté recherchée",
        paragraphs: [
          "La production limitée de Petrus, associée à une demande internationale considérable, en fait l’un des vins les plus rares du marché.",
          "Chaque bouteille constitue une expression singulière du millésime et du terroir, ce qui explique l’intérêt constant des amateurs et des collectionneurs.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Petrus, c’est découvrir l’une des expressions les plus profondes et les plus singulières du Merlot à Pomerol. Sa texture, sa rareté et sa capacité de vieillissement en font un vin à part dans l’univers des grands Bordeaux.",
  },

  "chateau-lafleur": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Lafleur, la rareté souveraine de Pomerol",
    introduction:
      "Château Lafleur occupe une place unique parmi les grands vins de Pomerol. Domaine familial de très petite taille, il est recherché pour la profondeur de ses vins, leur précision et leur capacité de vieillissement exceptionnelle. Son identité repose sur un terroir singulier et sur l'association du Merlot et du Cabernet Franc, qui lui confère une tension et une complexité remarquables.",
    sections: [
      {
        title: "Un domaine confidentiel au cœur de Pomerol",
        paragraphs: [
          "Château Lafleur est l'une des propriétés les plus discrètes et les plus recherchées de la rive droite. Sa superficie limitée et sa production naturellement réduite contribuent à la rareté de ses bouteilles.",
          "Le domaine s'est construit une réputation mondiale sans rechercher la démonstration, grâce à une continuité familiale et à une exigence constante dans le travail de la vigne et du vin.",
        ],
      },
      {
        title: "Une mosaïque de sols exceptionnelle",
        paragraphs: [
          "Le vignoble réunit des sols de graves, d'argiles et de sables qui apportent chacun une composante essentielle à l'équilibre du vin.",
          "Cette diversité géologique favorise une expression complexe, où la puissance reste toujours soutenue par la fraîcheur et la précision.",
        ],
      },
      {
        title: "Le rôle majeur du Cabernet Franc",
        paragraphs: [
          "Lafleur se distingue par la place importante accordée au Cabernet Franc, localement appelé Bouchet, aux côtés du Merlot.",
          "Le Cabernet Franc apporte tension, finesse aromatique et longueur, tandis que le Merlot contribue à la densité, à la chair et à la profondeur.",
        ],
      },
      {
        title: "Un style profond, droit et réservé",
        paragraphs: [
          "Dans sa jeunesse, Château Lafleur peut se montrer compact et peu démonstratif. Les fruits noirs, la violette, les épices, le graphite et les notes terreuses apparaissent progressivement.",
          "Avec le temps, la texture gagne en souplesse et révèle une grande complexité, sans perdre la structure qui permet au vin de traverser les décennies.",
        ],
      },
      {
        title: "Pensées de Lafleur",
        paragraphs: [
          "Pensées de Lafleur constitue une autre expression du vignoble. Issue de parcelles et de sélections spécifiques, cette cuvée conserve la profondeur et la précision caractéristiques du domaine.",
          "Elle possède sa propre personnalité et peut offrir une lecture plus accessible du style Lafleur selon les millésimes.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Lafleur, c'est découvrir l'un des vins les plus rares et les plus singuliers de Pomerol. Sa profondeur, sa tension et sa capacité de garde en font une référence majeure pour les amateurs de grands vins de la rive droite.",
  },

  "chateau-le-pin": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Le Pin, la micro-propriété devenue légende",
    introduction:
      "Château Le Pin est l'un des domaines les plus confidentiels de Pomerol. Sa production extrêmement limitée, son approche artisanale et la qualité de son terroir en font l'un des vins les plus recherchés au monde. Chaque millésime privilégie la précision, la richesse et l'expression la plus pure du Merlot.",
    sections: [
      {
        title: "Une histoire récente devenue mythique",
        paragraphs: [
          "Contrairement aux grandes propriétés historiques de Bordeaux, Le Pin s'est imposé en quelques décennies seulement grâce à la qualité exceptionnelle de ses vins.",
          "Sa réputation internationale repose sur une production confidentielle et une recherche permanente d'excellence.",
        ],
      },
      {
        title: "Un terroir privilégié de Pomerol",
        paragraphs: [
          "Le vignoble repose sur des graves mêlées d'argiles qui assurent un excellent équilibre entre drainage et alimentation hydrique.",
          "Ces sols permettent au Merlot d'atteindre une maturité remarquable tout en conservant fraîcheur et précision.",
        ],
      },
      {
        title: "Le Merlot comme signature",
        paragraphs: [
          "Le Pin est élaboré presque exclusivement à partir de Merlot.",
          "Le cépage exprime ici une texture veloutée, une grande profondeur et des arômes de fruits noirs, de violette, d'épices et de truffe avec l'âge.",
        ],
      },
      {
        title: "Une production confidentielle",
        paragraphs: [
          "Quelques milliers de bouteilles seulement sont produites selon les millésimes.",
          "Cette rareté explique la place particulière occupée par Le Pin auprès des collectionneurs internationaux.",
        ],
      },
      {
        title: "Un style recherchant l'émotion",
        paragraphs: [
          "Le Pin privilégie l'équilibre plutôt que la démonstration de puissance.",
          "Sa texture soyeuse, sa longueur et son évolution remarquable en bouteille en font l'une des expressions les plus singulières de Pomerol.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Le Pin, c'est découvrir un vin d'une rareté exceptionnelle où la précision du terroir et le travail artisanal donnent naissance à l'une des cuvées les plus emblématiques de Pomerol.",
  },

  "chateau-yquem": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Yquem, la référence absolue des grands vins liquoreux",
    introduction:
      "Unique Premier Cru Supérieur du classement de 1855, Château Yquem incarne l'excellence des grands vins de Sauternes. Sa réputation repose sur un terroir exceptionnel, le développement maîtrisé de la pourriture noble et une sélection d'une exigence extrême, donnant naissance à des vins d'une richesse, d'une fraîcheur et d'une longévité incomparables.",
    sections: [
      {
        title: "Un domaine unique dans le classement de 1855",
        paragraphs: [
          "Château Yquem est le seul domaine à avoir reçu le titre de Premier Cru Supérieur lors du classement officiel de 1855.",
          "Cette distinction reflète une réputation déjà établie depuis plusieurs siècles et toujours confirmée par la qualité constante de ses vins.",
        ],
      },
      {
        title: "Le terroir de Sauternes",
        paragraphs: [
          "Les graves reposant sur des sous-sols argileux et la rencontre des brouillards du Ciron avec la Garonne favorisent le développement du Botrytis cinerea.",
          "Cette pourriture noble concentre naturellement les raisins tout en préservant leur équilibre grâce à une remarquable acidité.",
        ],
      },
      {
        title: "Une sélection sans compromis",
        paragraphs: [
          "Les vendanges sont réalisées par tries successives afin de ne récolter que les baies parfaitement botrytisées.",
          "Certains millésimes ne donnent lieu qu'à une production très limitée, et il arrive que le grand vin ne soit pas produit lorsque le niveau d'exigence n'est pas atteint.",
        ],
      },
      {
        title: "Un style inimitable",
        paragraphs: [
          "Jeune, Yquem dévoile des notes d'abricot, de fruits exotiques, d'agrumes confits, de miel et de fleurs blanches.",
          "Avec le temps apparaissent des arômes de safran, de cire d'abeille, de fruits secs, de caramel fin et d'épices, tout en conservant une fraîcheur remarquable.",
        ],
      },
      {
        title: "Une longévité exceptionnelle",
        paragraphs: [
          "Les plus grands millésimes traversent plusieurs décennies, voire plus d'un siècle, sans perdre leur équilibre.",
          "Cette capacité de vieillissement fait de Château Yquem une référence incontournable pour les amateurs et les collectionneurs.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Yquem, c'est découvrir l'expression la plus accomplie des grands vins liquoreux de Bordeaux, où richesse, fraîcheur et complexité évoluent harmonieusement au fil du temps.",
  },

  "chateau-palmer": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Palmer, l'élégance singulière de Margaux",
    introduction:
      "Troisième Grand Cru Classé en 1855, Château Palmer s'est forgé une réputation dépassant largement son rang officiel. Son style associe richesse, finesse et profondeur grâce à un terroir exceptionnel et à une forte proportion de Merlot, rare dans le Médoc.",
    sections: [
      {
        title: "Un domaine emblématique de Margaux",
        paragraphs: [
          "Situé au cœur de l'appellation Margaux, Château Palmer est reconnu depuis le XIXᵉ siècle pour la personnalité unique de ses vins.",
          "La propriété privilégie une approche parcellaire minutieuse afin d'exprimer avec précision chaque millésime.",
        ],
      },
      {
        title: "Un terroir de graves d'exception",
        paragraphs: [
          "Les graves profondes assurent un excellent drainage et favorisent une maturation régulière des raisins.",
          "Cette diversité de sols permet d'obtenir des assemblages complexes, élégants et équilibrés.",
        ],
      },
      {
        title: "Le Merlot, signature du domaine",
        paragraphs: [
          "La part importante du Merlot distingue Palmer de nombreux autres grands crus du Médoc.",
          "Associé au Cabernet Sauvignon et au Petit Verdot, il apporte une texture soyeuse et une remarquable richesse aromatique.",
        ],
      },
      {
        title: "Un style raffiné et profond",
        paragraphs: [
          "Les vins développent des arômes de violette, cassis, mûre, cèdre et épices avec une grande précision.",
          "La bouche conjugue densité, fraîcheur et longueur dans un équilibre qui favorise un long vieillissement.",
        ],
      },
      {
        title: "Alter Ego de Palmer",
        paragraphs: [
          "Alter Ego constitue une interprétation complémentaire du vignoble.",
          "Cette cuvée possède sa propre identité tout en conservant l'élégance caractéristique de Château Palmer.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Palmer, c'est découvrir l'une des expressions les plus élégantes de Margaux, où la finesse s'allie à une remarquable profondeur.",
  },

  "cos-d-estournel": {
    eyebrow: "Histoire, terroir et identité",
    title: "Cos d'Estournel, la puissance raffinée de Saint-Estèphe",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Cos d'Estournel est l'une des propriétés les plus emblématiques de Saint-Estèphe. Son identité repose sur un terroir de graves exceptionnel, une forte personnalité et un style qui conjugue puissance, précision et remarquable aptitude au vieillissement.",
    sections: [
      {
        title: "Un domaine visionnaire",
        paragraphs: [
          "Fondé au début du XIXᵉ siècle, Cos d'Estournel s'est rapidement distingué par son exigence qualitative et par l'audace de son fondateur Louis-Gaspard d'Estournel.",
          "L'architecture orientale du château est devenue l'un des symboles les plus reconnaissables du vignoble bordelais.",
        ],
      },
      {
        title: "Un terroir dominant l'estuaire",
        paragraphs: [
          "Le vignoble est implanté sur une croupe de graves dominant l'estuaire de la Gironde.",
          "Cette situation favorise une maturation lente et régulière des raisins, tout en préservant leur fraîcheur.",
        ],
      },
      {
        title: "Cabernet Sauvignon et Merlot en équilibre",
        paragraphs: [
          "Le Cabernet Sauvignon constitue la base des grands millésimes, complété par le Merlot et une faible proportion de Cabernet Franc et de Petit Verdot.",
          "L'assemblage offre une structure profonde, une texture veloutée et une grande richesse aromatique.",
        ],
      },
      {
        title: "Un style intense et épicé",
        paragraphs: [
          "Les vins développent des arômes de cassis, mûre, graphite, cèdre, réglisse et épices orientales.",
          "Après quelques années de garde apparaissent des notes de cuir fin, de truffe et de tabac qui renforcent leur complexité.",
        ],
      },
      {
        title: "Pagodes de Cos",
        paragraphs: [
          "Pagodes de Cos est la seconde expression du domaine.",
          "Elle reprend les grands équilibres de Cos d'Estournel dans un style généralement plus accessible durant sa jeunesse.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Cos d'Estournel, c'est découvrir un grand Saint-Estèphe où puissance, élégance et profondeur s'expriment avec une remarquable précision.",
  },

  "chateau-montrose": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Montrose, la force classique de Saint-Estèphe",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Montrose est l'une des expressions les plus profondes et les plus régulières de Saint-Estèphe. Son style repose sur un terroir d'un seul tenant, une forte proportion de Cabernet Sauvignon et une capacité de vieillissement remarquable. Les grands millésimes associent puissance, fraîcheur et précision dans une architecture particulièrement durable.",
    sections: [
      {
        title: "Un vignoble historique face à l'estuaire",
        paragraphs: [
          "Château Montrose est implanté sur une vaste croupe de graves dominant la Gironde. La proximité de l'estuaire joue un rôle modérateur essentiel sur les températures et contribue à limiter les excès climatiques.",
          "Le vignoble, largement regroupé autour du domaine, bénéficie d'une remarquable cohérence géologique et permet une lecture précise de chaque parcelle.",
        ],
      },
      {
        title: "Les graves profondes de Saint-Estèphe",
        paragraphs: [
          "Les sols associent graves, sables et sous-sols argileux capables de conserver une réserve hydrique utile pendant les périodes sèches.",
          "Cette structure favorise un enracinement profond et permet au Cabernet Sauvignon d'atteindre une maturité lente tout en conservant fraîcheur et tension.",
        ],
      },
      {
        title: "Un style construit pour le temps",
        paragraphs: [
          "Dans sa jeunesse, Montrose peut se montrer dense, droit et réservé. Les fruits noirs, le graphite, le cèdre, les épices et les notes de tabac s'inscrivent dans une trame tannique solide.",
          "Avec le vieillissement, la texture s'assouplit et révèle des nuances de cuir, de sous-bois, de truffe et de fumée, sans perdre la structure qui caractérise le domaine.",
        ],
      },
      {
        title: "Une régularité remarquable",
        paragraphs: [
          "Montrose est reconnu pour sa capacité à produire de grands vins dans des profils de millésimes très différents.",
          "Cette régularité repose sur la qualité homogène du vignoble, une sélection exigeante et une approche attentive de l'élevage.",
        ],
      },
      {
        title: "La Dame de Montrose",
        paragraphs: [
          "La Dame de Montrose constitue la seconde expression de la propriété.",
          "Issue de sélections distinctes, elle conserve la structure et la fraîcheur du domaine dans un style généralement plus accessible dans sa jeunesse.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Montrose, c'est découvrir un grand Saint-Estèphe de garde, profondément marqué par son terroir et par une recherche constante d'équilibre entre puissance, fraîcheur et précision.",
  },

  "chateau-lynch-bages": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Lynch-Bages, l'énergie classique de Pauillac",
    introduction:
      "Cinquième Grand Cru Classé en 1855, Château Lynch-Bages occupe une place majeure à Pauillac. Sa réputation dépasse largement son rang historique grâce à des vins profonds, réguliers et construits pour la garde. Le domaine associe la puissance du Cabernet Sauvignon à une remarquable précision, dans un style généreux mais toujours équilibré.",
    sections: [
      {
        title: "Une propriété emblématique de Pauillac",
        paragraphs: [
          "L'histoire de Lynch-Bages est liée au hameau de Bages, au sud de Pauillac. Le domaine s'est progressivement imposé comme l'une des signatures les plus fiables de l'appellation.",
          "Sa notoriété repose sur une constance qualitative remarquable et sur une identité forte, reconnue aussi bien par les amateurs que par les collectionneurs.",
        ],
      },
      {
        title: "Des graves profondes et un terroir de caractère",
        paragraphs: [
          "Le vignoble repose sur des croupes de graves bien drainées, particulièrement adaptées au Cabernet Sauvignon.",
          "Ces sols permettent une maturation lente et régulière, tout en préservant la fraîcheur nécessaire à l'équilibre du vin.",
        ],
      },
      {
        title: "Le Cabernet Sauvignon comme colonne vertébrale",
        paragraphs: [
          "Le Cabernet Sauvignon domine les assemblages et apporte structure, profondeur et potentiel de garde.",
          "Le Merlot, le Cabernet Franc et le Petit Verdot complètent l'ensemble en apportant rondeur, complexité et nuances aromatiques.",
        ],
      },
      {
        title: "Un style ample, énergique et précis",
        paragraphs: [
          "Les vins de Lynch-Bages développent des arômes de cassis, de mûre, de cèdre, de graphite et d'épices.",
          "La bouche est dense et structurée, avec des tanins fermes dans la jeunesse puis progressivement plus soyeux avec le temps.",
        ],
      },
      {
        title: "Écho de Lynch-Bages et Blanc de Lynch-Bages",
        paragraphs: [
          "Écho de Lynch-Bages constitue la seconde expression rouge du domaine, avec un style généralement plus accessible dans sa jeunesse.",
          "Blanc de Lynch-Bages complète la gamme avec une cuvée blanche rare, fraîche et aromatique, issue principalement de Sauvignon Blanc et de Sémillon.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Lynch-Bages, c'est découvrir un grand Pauillac de caractère, généreux, précis et capable d'évoluer harmonieusement pendant plusieurs décennies.",
  },

  "chateau-pichon-baron": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Pichon Baron, la noblesse de Pauillac",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Pichon Baron est l'une des grandes références de Pauillac. Son style conjugue puissance, précision et élégance grâce à un terroir de graves remarquablement situé au sud de l'appellation, à proximité immédiate de Château Latour.",
    sections: [
      {
        title: "Une propriété historique",
        paragraphs: [
          "Fondé à la fin du XVIIᵉ siècle, Château Pichon Baron a construit sa réputation sur une remarquable régularité qualitative.",
          "Le domaine est aujourd'hui reconnu comme l'un des grands ambassadeurs de Pauillac.",
        ],
      },
      {
        title: "Un terroir d'exception",
        paragraphs: [
          "Les vignes reposent sur des graves profondes parfaitement drainées qui favorisent une maturation lente du Cabernet Sauvignon.",
          "La proximité de l'estuaire contribue à préserver la fraîcheur et l'équilibre des raisins.",
        ],
      },
      {
        title: "Le style Pichon Baron",
        paragraphs: [
          "Dominé par le Cabernet Sauvignon, l'assemblage offre une structure puissante, des tanins précis et une remarquable longueur.",
          "Les arômes de cassis, de graphite, de cèdre, de tabac et d'épices évoluent avec le temps vers des notes plus complexes de cuir et de truffe.",
        ],
      },
      {
        title: "Une grande aptitude au vieillissement",
        paragraphs: [
          "Les meilleurs millésimes traversent plusieurs décennies en gagnant progressivement en finesse.",
          "La puissance initiale laisse place à une texture soyeuse sans perdre la profondeur qui caractérise le domaine.",
        ],
      },
      {
        title: "Les Griffons de Pichon Baron",
        paragraphs: [
          "Les Griffons de Pichon Baron constitue la seconde expression du domaine.",
          "Cette cuvée conserve les marqueurs du grand vin tout en offrant une approche plus accessible dans sa jeunesse.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Pichon Baron, c'est découvrir un grand Pauillac où puissance, raffinement et longévité s'expriment avec une remarquable constance.",
  },

  "chateau-pichon-comtesse-de-lalande": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Pichon Comtesse de Lalande, la grâce de Pauillac",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Pichon Comtesse de Lalande est reconnu pour un style d'une grande élégance. Sa proximité avec l'estuaire, la diversité de ses terroirs et une proportion plus importante de Merlot que chez de nombreux voisins de Pauillac donnent naissance à des vins raffinés, profonds et remarquablement équilibrés.",
    sections: [
      {
        title: "Une grande dame de Pauillac",
        paragraphs: [
          "L'histoire du domaine est intimement liée à la famille de Lalande, qui a marqué durablement son identité.",
          "Aujourd'hui, la propriété demeure l'une des références incontournables des grands vins du Médoc.",
        ],
      },
      {
        title: "Des terroirs complémentaires",
        paragraphs: [
          "Les graves profondes reposant sur des sous-sols argileux assurent une alimentation hydrique régulière et une excellente maturité des raisins.",
          "Cette diversité permet de produire des assemblages précis, complexes et harmonieux.",
        ],
      },
      {
        title: "Une signature élégante",
        paragraphs: [
          "Le Cabernet Sauvignon apporte structure et longévité tandis que le Merlot renforce la texture soyeuse et le raffinement du vin.",
          "Les arômes de cassis, violette, cèdre, graphite et épices évoluent vers des notes de truffe, de tabac blond et de cuir fin.",
        ],
      },
      {
        title: "Une remarquable capacité de garde",
        paragraphs: [
          "Les grands millésimes gagnent progressivement en complexité sans perdre leur fraîcheur.",
          "La finesse des tanins permet une évolution particulièrement harmonieuse pendant plusieurs décennies.",
        ],
      },
      {
        title: "Réserve de la Comtesse",
        paragraphs: [
          "Réserve de la Comtesse constitue la seconde expression du domaine.",
          "Elle offre une approche plus accessible tout en conservant la personnalité élégante de la propriété.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Pichon Comtesse de Lalande, c'est découvrir un grand Pauillac où la finesse et la profondeur s'expriment avec une remarquable délicatesse.",
  },

  "chateau-pontet-canet": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Pontet-Canet, l'excellence visionnaire de Pauillac",
    introduction:
      "Cinquième Grand Cru Classé en 1855, Château Pontet-Canet s'est imposé comme l'une des propriétés les plus innovantes de Bordeaux. Son engagement précoce en biodynamie, allié à un terroir exceptionnel de graves, donne naissance à des vins profonds, précis et d'une remarquable énergie.",
    sections: [
      {
        title: "Une propriété historique en constante évolution",
        paragraphs: [
          "Créé au début du XVIIIᵉ siècle, le domaine a profondément évolué tout en restant fidèle à l'identité de Pauillac.",
          "Les choix viticoles entrepris depuis plusieurs décennies ont renforcé l'expression du terroir plutôt que la recherche d'un style démonstratif.",
        ],
      },
      {
        title: "Un terroir de graves remarquable",
        paragraphs: [
          "Les vignes reposent sur des graves profondes avec des sous-sols argilo-calcaires favorisant un enracinement durable.",
          "La proximité de l'estuaire tempère les variations climatiques et participe à la régularité des maturités.",
        ],
      },
      {
        title: "La biodynamie au service du terroir",
        paragraphs: [
          "Pontet-Canet fait figure de référence parmi les grands crus bordelais pour son approche biodynamique.",
          "Cette philosophie privilégie l'équilibre naturel du vignoble et une expression plus fidèle de chaque millésime.",
        ],
      },
      {
        title: "Un style profond et énergique",
        paragraphs: [
          "Le Cabernet Sauvignon domine généralement les assemblages, accompagné du Merlot, du Cabernet Franc et du Petit Verdot.",
          "Les vins développent des arômes de cassis, de mûre, de violette, de graphite et d'épices, soutenus par une texture dense mais d'une grande fraîcheur.",
        ],
      },
      {
        title: "Une garde remarquable",
        paragraphs: [
          "Les grands millésimes gagnent progressivement en complexité, révélant des notes de cèdre, de tabac, de truffe et de sous-bois.",
          "Cette évolution lente confirme la place de Pontet-Canet parmi les grandes références contemporaines de Pauillac.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Pontet-Canet, c'est découvrir un grand Pauillac où tradition, innovation et respect du terroir s'unissent pour produire des vins d'une remarquable précision.",
  },

  "chateau-grand-puy-lacoste": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Grand-Puy-Lacoste, la pure tradition de Pauillac",
    introduction:
      "Cinquième Grand Cru Classé en 1855, Château Grand-Puy-Lacoste est reconnu pour son style classique, précis et remarquablement régulier. Son vignoble d'un seul tenant, implanté sur de profondes graves, donne naissance à des vins élégants, structurés et bâtis pour une longue garde.",
    sections: [
      {
        title: "Une propriété historique de Pauillac",
        paragraphs: [
          "Le domaine puise ses origines dans les anciens terroirs du lieu-dit Grand Puy, réputés depuis plusieurs siècles pour la qualité de leurs graves.",
          "La famille Borie perpétue aujourd'hui une philosophie fondée sur la constance, le respect du terroir et la recherche d'une expression authentique de Pauillac.",
        ],
      },
      {
        title: "Un vignoble remarquablement homogène",
        paragraphs: [
          "Les vignes reposent sur une vaste croupe de graves profondes assurant un drainage naturel idéal.",
          "Cette homogénéité permet d'obtenir des Cabernets Sauvignon d'une grande précision, complétés par le Merlot et une faible proportion de Cabernet Franc.",
        ],
      },
      {
        title: "Un style classique et intemporel",
        paragraphs: [
          "Les vins développent des notes de cassis, de cèdre, de graphite, de mûre et d'épices fines.",
          "La bouche associe une structure ferme, des tanins élégants et une fraîcheur qui accompagne une longue finale.",
        ],
      },
      {
        title: "Une remarquable aptitude au vieillissement",
        paragraphs: [
          "Les grands millésimes gagnent progressivement en complexité avec des notes de tabac, de cuir fin, de truffe et de sous-bois.",
          "Cette évolution lente confirme la réputation de Grand-Puy-Lacoste parmi les grands vins de garde du Médoc.",
        ],
      },
      {
        title: "Lacoste-Borie",
        paragraphs: [
          "Lacoste-Borie constitue la seconde expression du domaine.",
          "Cette cuvée reprend les grands équilibres de la propriété dans un style plus immédiatement accessible.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Grand-Puy-Lacoste, c'est découvrir un Pauillac classique où l'élégance, la précision et la longévité s'expriment avec une remarquable régularité.",
  },

  "chateau-haut-batailley": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Haut-Batailley, l'élégance discrète de Pauillac",
    introduction:
      "Cinquième Grand Cru Classé en 1855, Château Haut-Batailley représente l'une des expressions les plus raffinées de Pauillac. Son vignoble de graves profondes, associé à une vinification attentive, donne naissance à des vins équilibrés, précis et dotés d'un excellent potentiel de vieillissement.",
    sections: [
      {
        title: "Une histoire intimement liée à Batailley",
        paragraphs: [
          "Issu du partage historique du vaste domaine Batailley, Château Haut-Batailley possède aujourd'hui une identité propre tout en conservant les qualités de son terroir d'origine.",
          "La propriété poursuit une recherche constante de finesse et d'expression fidèle du terroir pauillacais.",
        ],
      },
      {
        title: "Des graves favorables au Cabernet Sauvignon",
        paragraphs: [
          "Le vignoble repose sur des croupes de graves parfaitement drainées, idéales pour le Cabernet Sauvignon.",
          "Le Merlot vient compléter les assemblages en apportant rondeur et harmonie.",
        ],
      },
      {
        title: "Un style élégant et structuré",
        paragraphs: [
          "Les vins dévoilent des arômes de cassis, de mûre, de cèdre, de graphite et d'épices.",
          "La bouche conjugue précision, fraîcheur et profondeur avec des tanins particulièrement soignés.",
        ],
      },
      {
        title: "Une évolution harmonieuse",
        paragraphs: [
          "Les grands millésimes développent progressivement des notes de tabac blond, de cuir fin, de truffe et de sous-bois.",
          "Cette évolution lente souligne le remarquable potentiel de garde de la propriété.",
        ],
      },
      {
        title: "Une signature classique de Pauillac",
        paragraphs: [
          "Haut-Batailley privilégie l'équilibre plutôt que la démonstration de puissance.",
          "Cette philosophie donne naissance à des vins fidèles à la tradition des grands Pauillac de garde.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Haut-Batailley, c'est découvrir un Pauillac élégant, précis et construit pour évoluer harmonieusement au fil des décennies.",
  },

  "chateau-d-armailhac": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château d'Armailhac, l'équilibre authentique de Pauillac",
    introduction:
      "Cinquième Grand Cru Classé en 1855, Château d'Armailhac appartient à la famille Rothschild depuis 1933. Son vignoble de graves profondes produit des vins qui expriment avec fidélité le caractère de Pauillac : structure, fraîcheur, précision et aptitude au vieillissement.",
    sections: [
      {
        title: "Un domaine chargé d'histoire",
        paragraphs: [
          "Le domaine trouve ses origines au XVIIIᵉ siècle et a porté plusieurs noms avant de devenir Château d'Armailhac.",
          "Son intégration au sein des propriétés Rothschild a permis de préserver son identité tout en bénéficiant d'investissements constants.",
        ],
      },
      {
        title: "Les terroirs de graves de Pauillac",
        paragraphs: [
          "Le vignoble repose sur des croupes de graves profondes reposant sur des sous-sols argileux et calcaires.",
          "Ces sols favorisent une maturation régulière du Cabernet Sauvignon, complété par le Merlot, le Cabernet Franc et le Petit Verdot.",
        ],
      },
      {
        title: "Une signature fidèle à Pauillac",
        paragraphs: [
          "Les vins développent des arômes de cassis, de mûre, de cèdre, de graphite et d'épices.",
          "La bouche associe fraîcheur, précision tannique et longueur avec un équilibre qui caractérise les grands vins de l'appellation.",
        ],
      },
      {
        title: "Une belle capacité de garde",
        paragraphs: [
          "Les meilleurs millésimes évoluent harmonieusement pendant plusieurs décennies.",
          "Le temps révèle progressivement des notes de tabac, de cuir fin, de sous-bois et de truffe.",
        ],
      },
      {
        title: "Une propriété complémentaire des grands Pauillac Rothschild",
        paragraphs: [
          "Sans chercher à imiter ses prestigieux voisins, Château d'Armailhac affirme une personnalité propre.",
          "Il offre une lecture classique, élégante et accessible de Pauillac tout en conservant un véritable potentiel de garde.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château d'Armailhac, c'est découvrir un Pauillac authentique où tradition, précision et élégance s'expriment avec constance.",
  },

  "chateau-leoville-las-cases": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Château Léoville Las Cases, la grandeur intemporelle de Saint-Julien",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Léoville Las Cases est considéré comme l'une des références absolues du Médoc. Son terroir exceptionnel, voisin immédiat de Pauillac, donne naissance à des vins d'une profondeur remarquable, alliant puissance, précision et extraordinaire potentiel de garde.",
    sections: [
      {
        title: "Un héritage historique prestigieux",
        paragraphs: [
          "Issu de l'ancien vaste domaine Léoville, Las Cases a conservé les parcelles les plus emblématiques autour du célèbre Clos.",
          "Depuis plusieurs générations, la famille Delon perpétue une recherche constante d'excellence et de fidélité au terroir.",
        ],
      },
      {
        title: "Le Grand Clos de Léoville",
        paragraphs: [
          "Le cœur du vignoble repose sur de profondes graves garonnaises bordant l'estuaire de la Gironde.",
          "Cette situation privilégiée favorise une maturation lente du Cabernet Sauvignon tout en préservant une grande fraîcheur.",
        ],
      },
      {
        title: "Une signature de puissance maîtrisée",
        paragraphs: [
          "Dominé par le Cabernet Sauvignon, l'assemblage développe des notes de cassis, graphite, cèdre, violette et épices.",
          "La bouche impressionne par sa densité, sa précision tannique et sa longueur exceptionnelle.",
        ],
      },
      {
        title: "Un immense vin de garde",
        paragraphs: [
          "Dans sa jeunesse, Léoville Las Cases peut paraître réservé tant sa structure est importante.",
          "Après plusieurs décennies, il révèle une complexité remarquable mêlant tabac, truffe, cuir fin et sous-bois tout en conservant une étonnante énergie.",
        ],
      },
      {
        title: "Le Petit Lion et Clos du Marquis",
        paragraphs: [
          "Le domaine produit également Le Petit Lion ainsi que Clos du Marquis, deux cuvées possédant chacune leur identité propre.",
          "Elles permettent de découvrir différentes expressions du vignoble tout en conservant l'élégance caractéristique de la propriété.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Léoville Las Cases, c'est découvrir l'un des plus grands vins de Bordeaux, où puissance, précision et longévité atteignent un équilibre exceptionnel.",
  },

  "chateau-leoville-barton": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Léoville Barton, l'élégance classique de Saint-Julien",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Léoville Barton incarne l'expression la plus traditionnelle de Saint-Julien. Resté entre les mains de la famille Barton depuis le XIXᵉ siècle, le domaine est reconnu pour la régularité de ses vins, leur profondeur et leur remarquable potentiel de vieillissement.",
    sections: [
      {
        title: "Une propriété familiale historique",
        paragraphs: [
          "Acquis en 1826 par Hugh Barton, le domaine est toujours dirigé par la même famille, fait rare parmi les grands crus bordelais.",
          "Cette continuité contribue à préserver un style fidèle au terroir et à la tradition de Saint-Julien.",
        ],
      },
      {
        title: "Un terroir de graves exceptionnel",
        paragraphs: [
          "Les vignes reposent sur des croupes de graves profondes parfaitement drainées, favorables au Cabernet Sauvignon.",
          "Le Merlot vient compléter les assemblages en apportant rondeur et équilibre sans altérer la structure du vin.",
        ],
      },
      {
        title: "Une signature de précision",
        paragraphs: [
          "Les vins développent des arômes de cassis, de mûre, de graphite, de cèdre et d'épices fines.",
          "La bouche se distingue par une structure droite, des tanins précis et une fraîcheur qui accompagne une longue finale.",
        ],
      },
      {
        title: "Une garde remarquable",
        paragraphs: [
          "Les meilleurs millésimes gagnent progressivement en complexité avec des notes de tabac blond, de cuir, de truffe et de sous-bois.",
          "Cette évolution lente fait de Léoville Barton l'un des grands vins de garde du Médoc.",
        ],
      },
      {
        title: "Un style fidèle à Saint-Julien",
        paragraphs: [
          "Léoville Barton privilégie l'équilibre, la pureté du fruit et la précision plutôt qu'une puissance démonstrative.",
          "Cette philosophie lui vaut une réputation exceptionnelle auprès des amateurs de grands Bordeaux classiques.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Léoville Barton, c'est découvrir un grand Saint-Julien où tradition, précision et longévité s'expriment avec une remarquable constance.",
  },

  "chateau-leoville-poyferre": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Château Léoville Poyferré, la profondeur contemporaine de Saint-Julien",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Léoville Poyferré s'est imposé parmi les grandes références de Saint-Julien grâce à des vins profonds, généreux et remarquablement équilibrés. Son style associe la puissance caractéristique du Cabernet Sauvignon à une texture soyeuse et à une grande richesse aromatique.",
    sections: [
      {
        title: "Un héritage prestigieux",
        paragraphs: [
          "Issu de l'ancien vaste domaine Léoville, le château possède une identité propre depuis le XIXᵉ siècle.",
          "La famille Cuvelier poursuit aujourd'hui une recherche constante de précision afin d'exprimer pleinement le potentiel du terroir.",
        ],
      },
      {
        title: "Un terroir remarquable de Saint-Julien",
        paragraphs: [
          "Les vignes reposent sur des graves garonnaises profondes offrant un drainage naturel idéal.",
          "Le Cabernet Sauvignon domine les assemblages, accompagné du Merlot, du Petit Verdot et du Cabernet Franc.",
        ],
      },
      {
        title: "Un style riche et élégant",
        paragraphs: [
          "Les vins dévoilent des notes de cassis, de mûre, de violette, de graphite, de cèdre et d'épices.",
          "La bouche associe concentration, fraîcheur et tanins soyeux, offrant une remarquable sensation d'équilibre.",
        ],
      },
      {
        title: "Une grande aptitude au vieillissement",
        paragraphs: [
          "Les meilleurs millésimes évoluent lentement vers des arômes de cuir fin, de tabac, de truffe et de sous-bois.",
          "Cette évolution renforce la complexité tout en conservant l'énergie qui caractérise la propriété.",
        ],
      },
      {
        title: "Une signature moderne de Saint-Julien",
        paragraphs: [
          "Léoville Poyferré privilégie la maturité du fruit et la précision des extractions.",
          "Il en résulte des vins séduisants dès leur jeunesse mais capables de traverser plusieurs décennies.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Léoville Poyferré, c'est découvrir un grand Saint-Julien où puissance, raffinement et profondeur s'unissent dans un remarquable équilibre.",
  },

  "chateau-ducru-beaucaillou": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Ducru-Beaucaillou, l'élégance minérale de Saint-Julien",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Ducru-Beaucaillou figure parmi les plus grandes références de Saint-Julien. Son nom, issu des « beaux cailloux » de graves qui couvrent son vignoble, résume parfaitement l'origine de son style : une alliance de puissance, de finesse et de précision minérale portée par un terroir exceptionnel.",
    sections: [
      {
        title: "Un domaine emblématique",
        paragraphs: [
          "Depuis le XVIIIᵉ siècle, Ducru-Beaucaillou s'est imposé comme l'une des signatures majeures du Médoc.",
          "La famille Borie perpétue aujourd'hui une recherche constante d'excellence fondée sur une sélection parcellaire rigoureuse.",
        ],
      },
      {
        title: "Les célèbres « beaux cailloux »",
        paragraphs: [
          "Le vignoble repose sur de profondes graves garonnaises composées de gros galets parfaitement drainants.",
          "Ces sols favorisent une maturation lente du Cabernet Sauvignon tout en préservant fraîcheur et équilibre.",
        ],
      },
      {
        title: "Une signature raffinée",
        paragraphs: [
          "Le Cabernet Sauvignon domine les assemblages, accompagné principalement du Merlot.",
          "Les vins développent des arômes de cassis, de violette, de graphite, de cèdre et d'épices avec une remarquable pureté.",
        ],
      },
      {
        title: "Un immense vin de garde",
        paragraphs: [
          "Dans sa jeunesse, Ducru-Beaucaillou séduit déjà par l'élégance de ses tanins.",
          "Avec les décennies apparaissent des notes de tabac, de cuir fin, de truffe et de sous-bois sans perdre la tension caractéristique du domaine.",
        ],
      },
      {
        title: "La Croix Ducru-Beaucaillou",
        paragraphs: [
          "La Croix Ducru-Beaucaillou constitue la seconde expression de la propriété.",
          "Elle offre une approche plus accessible du style du domaine tout en conservant précision et équilibre.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Ducru-Beaucaillou, c'est découvrir un grand Saint-Julien où la finesse des graves rencontre une profondeur et une longévité remarquables.",
  },

  "chateau-gruaud-larose": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Gruaud Larose, la tradition vivante de Saint-Julien",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Gruaud Larose est l'une des propriétés historiques de Saint-Julien. Son style associe profondeur, fraîcheur et élégance grâce à un vaste vignoble de graves et à une philosophie privilégiant l'expression du terroir et la capacité de garde.",
    sections: [
      {
        title: "Une histoire pluriséculaire",
        paragraphs: [
          "Fondé au XVIIIᵉ siècle, le domaine doit son nom à l'union des familles Gruaud et Larose.",
          "Sa devise, « Le roi des vins, le vin des rois », illustre la réputation acquise au fil des siècles.",
        ],
      },
      {
        title: "Un terroir remarquable",
        paragraphs: [
          "Les vignes reposent sur des graves garonnaises profondes, particulièrement adaptées au Cabernet Sauvignon.",
          "La diversité des parcelles permet d'élaborer des assemblages précis et réguliers.",
        ],
      },
      {
        title: "Une signature classique de Saint-Julien",
        paragraphs: [
          "Les vins développent des arômes de cassis, de mûre, de cèdre, de graphite, de réglisse et d'épices.",
          "La bouche conjugue structure, fraîcheur et finesse avec des tanins qui gagnent progressivement en velouté.",
        ],
      },
      {
        title: "Une grande aptitude au vieillissement",
        paragraphs: [
          "Les meilleurs millésimes évoluent lentement vers des notes de tabac, de cuir, de truffe et de sous-bois.",
          "Cette évolution confirme la remarquable longévité des vins de Gruaud Larose.",
        ],
      },
      {
        title: "Une philosophie de transmission",
        paragraphs: [
          "Le domaine privilégie une viticulture attentive et une sélection rigoureuse des raisins.",
          "Chaque millésime cherche à refléter fidèlement l'identité du terroir de Saint-Julien.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Gruaud Larose, c'est découvrir un grand Saint-Julien où tradition, profondeur et élégance s'expriment avec une remarquable régularité.",
  },

  "chateau-beychevelle": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Beychevelle, l'élégance emblématique de Saint-Julien",
    introduction:
      "Quatrième Grand Cru Classé en 1855, Château Beychevelle est l'une des propriétés les plus célèbres de Saint-Julien. Son terroir de graves, son histoire et son style raffiné donnent naissance à des vins où la finesse, l'équilibre et la régularité occupent une place essentielle.",
    sections: [
      {
        title: "Le château au vaisseau",
        paragraphs: [
          "Le nom Beychevelle est associé à la célèbre légende des navires abaissant leurs voiles devant le duc d'Épernon, symbole encore présent sur l'étiquette du domaine.",
          "Cette identité historique contribue au rayonnement international de la propriété.",
        ],
      },
      {
        title: "Un terroir de graves au cœur de Saint-Julien",
        paragraphs: [
          "Les vignes reposent sur des graves profondes bénéficiant d'un excellent drainage naturel.",
          "Le Cabernet Sauvignon y exprime toute sa finesse, complété par le Merlot, le Cabernet Franc et le Petit Verdot.",
        ],
      },
      {
        title: "Une signature d'élégance",
        paragraphs: [
          "Les vins offrent des notes de cassis, de mûre, de violette, de cèdre et d'épices fines.",
          "La bouche séduit par des tanins soyeux, une belle fraîcheur et une finale harmonieuse.",
        ],
      },
      {
        title: "Une évolution remarquable",
        paragraphs: [
          "Les meilleurs millésimes gagnent progressivement en complexité avec des arômes de tabac blond, de cuir fin, de truffe et de sous-bois.",
          "Cette capacité de garde confirme la place de Beychevelle parmi les grandes références de Saint-Julien.",
        ],
      },
      {
        title: "Amiral de Beychevelle",
        paragraphs: [
          "Amiral de Beychevelle constitue la seconde expression du domaine.",
          "Cette cuvée reprend les marqueurs du grand vin dans un style généralement plus accessible dès sa jeunesse.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Beychevelle, c'est découvrir un grand Saint-Julien où tradition, élégance et précision s'expriment avec une remarquable constance.",
  },

  "chateau-branaire-ducru": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Branaire-Ducru, la finesse classique de Saint-Julien",
    introduction:
      "Quatrième Grand Cru Classé en 1855, Château Branaire-Ducru est reconnu pour son style élégant, précis et remarquablement équilibré. Son vaste vignoble de graves produit des vins où la fraîcheur, la pureté du fruit et la finesse tannique occupent une place essentielle.",
    sections: [
      {
        title: "Un héritage historique",
        paragraphs: [
          "Issu de l'ancien domaine Beychevelle, Branaire-Ducru s'est affirmé au fil des générations comme l'une des signatures majeures de Saint-Julien.",
          "La propriété privilégie une approche parcellaire précise afin de révéler le caractère de chaque millésime.",
        ],
      },
      {
        title: "Les graves de Saint-Julien",
        paragraphs: [
          "Le vignoble repose sur des graves garonnaises profondes offrant un drainage naturel idéal.",
          "Le Cabernet Sauvignon domine les assemblages, soutenu par le Merlot, le Petit Verdot et le Cabernet Franc.",
        ],
      },
      {
        title: "Un style raffiné",
        paragraphs: [
          "Les vins développent des arômes de cassis, de mûre, de violette, de cèdre, de graphite et d'épices fines.",
          "La bouche séduit par sa précision, sa fraîcheur et des tanins d'une grande élégance.",
        ],
      },
      {
        title: "Une évolution harmonieuse",
        paragraphs: [
          "Les meilleurs millésimes gagnent progressivement en complexité avec des notes de tabac blond, de cuir fin, de truffe et de sous-bois.",
          "Cette évolution confirme leur remarquable aptitude au vieillissement.",
        ],
      },
      {
        title: "Une vision d'équilibre",
        paragraphs: [
          "Le domaine recherche avant tout l'expression du terroir plutôt qu'une puissance démonstrative.",
          "Cette philosophie donne naissance à des vins harmonieux, accessibles relativement jeunes mais capables de vieillir longtemps.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Branaire-Ducru, c'est découvrir un grand Saint-Julien où précision, élégance et équilibre s'expriment avec constance.",
  },

  "chateau-rauzan-segla": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Rauzan-Ségla, l'élégance racée de Margaux",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Rauzan-Ségla est l'une des propriétés emblématiques de Margaux. Son vignoble de graves profondes produit des vins où la finesse aromatique, la précision des tanins et la profondeur de texture s'expriment avec une remarquable constance.",
    sections: [
      {
        title: "Un grand nom de Margaux",
        paragraphs: [
          "L'histoire de Rauzan-Ségla remonte au XVIIᵉ siècle, lorsque le vaste domaine de Rauzan figurait déjà parmi les plus réputés du Médoc.",
          "Au fil des générations, la propriété a préservé une identité fondée sur la précision et la recherche permanente de l'équilibre.",
        ],
      },
      {
        title: "Des terroirs d'une grande diversité",
        paragraphs: [
          "Le vignoble repose sur des graves fines mêlées à des argiles et des calcaires, offrant une remarquable diversité de profils.",
          "Cette mosaïque de sols permet d'assembler des vins complexes où le Cabernet Sauvignon dialogue harmonieusement avec le Merlot.",
        ],
      },
      {
        title: "La signature Rauzan-Ségla",
        paragraphs: [
          "Les vins développent des arômes de cassis, de mûre, de violette, de rose, de cèdre et d'épices fines.",
          "La bouche se distingue par des tanins soyeux, une fraîcheur persistante et une grande élégance de texture.",
        ],
      },
      {
        title: "Une remarquable capacité de garde",
        paragraphs: [
          "Les meilleurs millésimes évoluent lentement vers des notes de tabac blond, de truffe, de cuir fin et de sous-bois.",
          "Cette évolution progressive confirme leur aptitude à traverser plusieurs décennies tout en conservant leur fraîcheur.",
        ],
      },
      {
        title: "Ségla",
        paragraphs: [
          "Ségla constitue la seconde expression du domaine.",
          "Cette cuvée reflète l'identité de Rauzan-Ségla dans un style plus accessible durant sa jeunesse.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Rauzan-Ségla, c'est découvrir un grand Margaux où la finesse, la précision et la profondeur s'unissent dans un équilibre remarquable.",
  },

  "chateau-brane-cantenac": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Brane-Cantenac, la finesse lumineuse de Margaux",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Brane-Cantenac est l'une des références historiques de Margaux. Son vignoble, situé sur le célèbre plateau de Brane, donne naissance à des vins d'une grande précision, où la finesse aromatique, l'énergie et la profondeur s'équilibrent avec naturel.",
    sections: [
      {
        title: "Une propriété emblématique",
        paragraphs: [
          "Depuis le XIXᵉ siècle, Brane-Cantenac s'est imposé comme l'un des grands noms de Margaux grâce à une recherche constante de qualité.",
          "La famille Lurton perpétue aujourd'hui cette tradition en privilégiant une lecture précise de chaque parcelle.",
        ],
      },
      {
        title: "Le plateau de Brane",
        paragraphs: [
          "Le vignoble repose sur des graves profondes parmi les plus qualitatives de l'appellation.",
          "Ces sols favorisent une maturation lente du Cabernet Sauvignon tout en conservant fraîcheur et équilibre.",
        ],
      },
      {
        title: "Un style tout en élégance",
        paragraphs: [
          "Les vins offrent des arômes de cassis, de framboise, de violette, de rose, de graphite et d'épices fines.",
          "La bouche séduit par ses tanins soyeux, sa fraîcheur et une remarquable précision.",
        ],
      },
      {
        title: "Une évolution harmonieuse",
        paragraphs: [
          "Les grands millésimes développent progressivement des notes de cèdre, de tabac blond, de truffe et de sous-bois.",
          "Cette évolution confirme leur excellente aptitude au vieillissement.",
        ],
      },
      {
        title: "Baron de Brane",
        paragraphs: [
          "Baron de Brane constitue la seconde expression du domaine.",
          "Cette cuvée permet de retrouver l'identité de Brane-Cantenac dans un style plus accessible durant sa jeunesse.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Brane-Cantenac, c'est découvrir un grand Margaux où élégance, fraîcheur et précision s'expriment avec une remarquable constance.",
  },

  "chateau-lascombes": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Lascombes, la richesse élégante de Margaux",
    introduction:
      "Deuxième Grand Cru Classé en 1855, Château Lascombes est l'une des plus vastes propriétés de Margaux. Son vignoble réparti sur plusieurs terroirs complémentaires permet d'élaborer des vins alliant profondeur, richesse aromatique et élégance, dans un style fidèle à l'identité de l'appellation.",
    sections: [
      {
        title: "Une propriété historique de Margaux",
        paragraphs: [
          "Fondé au XVIIᵉ siècle, Château Lascombes doit son nom à la famille qui développa le domaine pendant plusieurs générations.",
          "Au fil du temps, la propriété s'est imposée comme l'un des grands noms de Margaux grâce à une recherche constante de qualité.",
        ],
      },
      {
        title: "Une remarquable diversité de terroirs",
        paragraphs: [
          "Le vignoble repose sur une mosaïque de graves, d'argiles et de sols calcaires répartis sur plusieurs secteurs de l'appellation.",
          "Cette diversité permet d'adapter les assemblages à chaque millésime et d'obtenir des vins complexes et équilibrés.",
        ],
      },
      {
        title: "Une signature généreuse et raffinée",
        paragraphs: [
          "Le Cabernet Sauvignon et le Merlot constituent la base des assemblages, complétés selon les années par le Petit Verdot.",
          "Les vins développent des arômes de cassis, de mûre, de violette, de cèdre, de chocolat fin et d'épices, soutenus par une texture ample et des tanins soyeux.",
        ],
      },
      {
        title: "Une belle aptitude au vieillissement",
        paragraphs: [
          "Les meilleurs millésimes évoluent progressivement vers des notes de tabac blond, de truffe, de cuir fin et de sous-bois.",
          "Cette évolution apporte une complexité supplémentaire tout en conservant l'équilibre caractéristique du domaine.",
        ],
      },
      {
        title: "Chevalier de Lascombes",
        paragraphs: [
          "Chevalier de Lascombes constitue la seconde expression de la propriété.",
          "Cette cuvée offre une approche plus accessible du style Lascombes tout en conservant la richesse et l'élégance qui font la réputation du domaine.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Lascombes, c'est découvrir un grand Margaux où profondeur, générosité et élégance s'expriment avec une remarquable régularité.",
  },

  "chateau-la-mission-haut-brion": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Château La Mission Haut-Brion, la puissance raffinée de Pessac-Léognan",
    introduction:
      "Classé Cru Classé de Graves, Château La Mission Haut-Brion figure parmi les plus grands vins de Bordeaux. Voisin immédiat de Château Haut-Brion, il possède une identité propre, marquée par une profondeur exceptionnelle, une intensité aromatique remarquable et un potentiel de vieillissement parmi les plus élevés de l'appellation.",
    sections: [
      {
        title: "Une histoire intimement liée à Haut-Brion",
        paragraphs: [
          "Fondé au XVIᵉ siècle, le domaine partage depuis longtemps son histoire avec les grands terroirs de Pessac-Léognan.",
          "Aujourd'hui, il est exploité par les mêmes équipes que Château Haut-Brion, tout en conservant une personnalité parfaitement distincte.",
        ],
      },
      {
        title: "Un terroir de graves exceptionnel",
        paragraphs: [
          "Le vignoble repose sur des graves profondes mêlées d'argiles et de sables offrant un drainage naturel remarquable.",
          "Cette diversité géologique permet d'obtenir des vins à la fois puissants, précis et d'une grande fraîcheur.",
        ],
      },
      {
        title: "Une signature profonde et complexe",
        paragraphs: [
          "Les assemblages, dominés par le Cabernet Sauvignon et le Merlot, développent des arômes de cassis, de mûre, de graphite, de fumée, de cèdre et d'épices.",
          "La bouche se distingue par une texture dense, des tanins parfaitement intégrés et une longueur exceptionnelle.",
        ],
      },
      {
        title: "Un immense potentiel de garde",
        paragraphs: [
          "Les grands millésimes évoluent lentement vers des notes de tabac blond, de cuir fin, de truffe, de sous-bois et de cacao.",
          "Cette évolution confirme la place de La Mission Haut-Brion parmi les plus grands vins de garde de Bordeaux.",
        ],
      },
      {
        title: "La Chapelle de La Mission Haut-Brion",
        paragraphs: [
          "La Chapelle de La Mission Haut-Brion constitue la seconde expression du domaine.",
          "Elle offre une approche plus accessible tout en conservant la profondeur et la précision qui caractérisent la propriété.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château La Mission Haut-Brion, c'est découvrir un grand Pessac-Léognan où puissance, complexité et élégance s'expriment avec une remarquable intensité.",
  },

  "chateau-haut-bailly": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Haut-Bailly, l'élégance intemporelle de Pessac-Léognan",
    introduction:
      "Cru Classé de Graves, Château Haut-Bailly est reconnu comme l'une des références majeures de Pessac-Léognan. Son style repose sur un terroir de graves anciennes, une remarquable finesse tannique et une capacité de vieillissement qui en fait l'un des grands vins de Bordeaux les plus recherchés.",
    sections: [
      {
        title: "Une propriété historique",
        paragraphs: [
          "L'histoire de Haut-Bailly remonte au XVIᵉ siècle et témoigne d'une longue tradition de recherche qualitative.",
          "Le domaine s'est progressivement imposé comme l'un des plus grands ambassadeurs des vins rouges de Graves.",
        ],
      },
      {
        title: "Un terroir de graves anciennes",
        paragraphs: [
          "Le vignoble repose sur des croupes de graves mêlées de sable et d'argile, offrant un drainage naturel remarquable.",
          "Ces sols permettent au Cabernet Sauvignon, au Merlot et au Cabernet Franc d'exprimer pleinement leur potentiel.",
        ],
      },
      {
        title: "Une signature d'une grande finesse",
        paragraphs: [
          "Les vins développent des arômes de cassis, de mûre, de violette, de graphite, de cèdre et d'épices.",
          "La bouche séduit par sa texture veloutée, sa fraîcheur et une remarquable précision tannique.",
        ],
      },
      {
        title: "Une remarquable aptitude au vieillissement",
        paragraphs: [
          "Les meilleurs millésimes évoluent lentement vers des notes de tabac blond, de truffe, de cuir fin et de sous-bois.",
          "Cette évolution renforce la complexité tout en conservant l'équilibre caractéristique de la propriété.",
        ],
      },
      {
        title: "Haut-Bailly II",
        paragraphs: [
          "Haut-Bailly II constitue la seconde expression du domaine.",
          "Cette cuvée reflète l'identité du vignoble dans un style plus accessible tout en conservant la finesse propre à Haut-Bailly.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Haut-Bailly, c'est découvrir un grand Pessac-Léognan où élégance, précision et profondeur s'expriment avec une remarquable harmonie.",
  },

  "chateau-les-carmes-haut-brion": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Château Les Carmes Haut-Brion, l'expression contemporaine de Pessac-Léognan",
    introduction:
      "Cru Classé de Graves, Château Les Carmes Haut-Brion est aujourd'hui l'une des propriétés les plus admirées de Bordeaux. Son terroir singulier, son encépagement original et son approche précise de la vinification donnent naissance à des vins d'une personnalité immédiatement reconnaissable, alliant profondeur, fraîcheur et remarquable finesse.",
    sections: [
      {
        title: "Un domaine chargé d'histoire",
        paragraphs: [
          "Fondé au XVIᵉ siècle par l'ordre des Carmes, le domaine doit son nom à cette présence historique qui a marqué durablement son identité.",
          "Depuis plusieurs décennies, d'importants investissements ont permis de révéler tout le potentiel du vignoble tout en respectant son héritage.",
        ],
      },
      {
        title: "Un terroir rare au cœur de Bordeaux",
        paragraphs: [
          "Le vignoble repose sur des graves, des argiles et des sables traversés par un petit cours d'eau, situation quasiment unique dans l'appellation.",
          "Cette diversité de sols apporte aux vins une tension naturelle et une grande complexité aromatique.",
        ],
      },
      {
        title: "Le Cabernet Franc comme signature",
        paragraphs: [
          "Contrairement à la majorité des grands vins de Bordeaux, Les Carmes Haut-Brion accorde une place importante au Cabernet Franc aux côtés du Cabernet Sauvignon et du Merlot.",
          "Cette particularité confère aux vins une fraîcheur, une finesse florale et une énergie remarquables.",
        ],
      },
      {
        title: "Une vinification tournée vers la précision",
        paragraphs: [
          "Les extractions sont volontairement mesurées afin de préserver la pureté du fruit et la délicatesse des tanins.",
          "Les vins développent des notes de cassis, de violette, de graphite, d'épices, de cèdre et de fleurs séchées dans une bouche profonde et élancée.",
        ],
      },
      {
        title: "Une nouvelle référence de Pessac-Léognan",
        paragraphs: [
          "Les grands millésimes évoluent harmonieusement pendant plusieurs décennies en gagnant en complexité sans perdre leur fraîcheur.",
          "Cette combinaison de modernité et de fidélité au terroir place aujourd'hui Les Carmes Haut-Brion parmi les domaines les plus recherchés de l'appellation.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Les Carmes Haut-Brion, c'est découvrir un grand Pessac-Léognan où précision, élégance et originalité s'unissent pour offrir l'une des expressions les plus singulières de Bordeaux.",
  },

  "chateau-smith-haut-lafitte": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Château Smith Haut Lafitte, l'excellence contemporaine de Pessac-Léognan",
    introduction:
      "Cru Classé de Graves, Château Smith Haut Lafitte s'est imposé comme l'une des références incontournables de Pessac-Léognan. Son vignoble de graves, son engagement environnemental et sa recherche constante de précision donnent naissance à des vins rouges et blancs parmi les plus réputés de Bordeaux.",
    sections: [
      {
        title: "Une propriété historique tournée vers l'avenir",
        paragraphs: [
          "Le domaine trouve ses origines au XIVᵉ siècle et doit son nom au négociant écossais George Smith, qui développa sa renommée au XVIIIᵉ siècle.",
          "Depuis son acquisition par la famille Cathiard, Smith Haut Lafitte connaît un renouveau remarquable fondé sur la qualité du vignoble et l'innovation.",
        ],
      },
      {
        title: "Un terroir de graves exceptionnel",
        paragraphs: [
          "Les vignes reposent sur d'épaisses graves garonnaises reposant sur des sous-sols argileux, offrant un drainage naturel idéal.",
          "Cette diversité favorise une expression précise du Cabernet Sauvignon, du Merlot, du Cabernet Franc et du Petit Verdot, ainsi que des cépages blancs du domaine.",
        ],
      },
      {
        title: "Une philosophie de précision et de respect du vivant",
        paragraphs: [
          "Le domaine privilégie une viticulture durable, une sélection parcellaire rigoureuse et des vinifications adaptées à chaque millésime.",
          "Cette approche permet de préserver l'identité du terroir tout en recherchant une grande pureté aromatique.",
        ],
      },
      {
        title: "Une signature élégante et profonde",
        paragraphs: [
          "Les vins rouges développent des notes de cassis, de mûre, de graphite, de violette, de cèdre et d'épices, soutenues par une texture veloutée et une remarquable fraîcheur.",
          "Les vins blancs séduisent par leur tension, leurs arômes d'agrumes, de fruits exotiques, de fleurs blanches et leur grande capacité de vieillissement.",
        ],
      },
      {
        title: "Les Hauts de Smith",
        paragraphs: [
          "Les Hauts de Smith constituent la seconde gamme du domaine, en rouge comme en blanc.",
          "Ces cuvées permettent de retrouver l'esprit de Smith Haut Lafitte dans une expression plus accessible tout en conservant la précision caractéristique de la propriété.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Smith Haut Lafitte, c'est découvrir un grand Pessac-Léognan où tradition, innovation et respect du terroir s'unissent pour produire des vins d'une remarquable élégance.",
  },

  "chateau-pape-clement": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Pape Clément, l'un des plus anciens domaines de Bordeaux",
    introduction:
      "Cru Classé de Graves, Château Pape Clément est l'une des propriétés historiques de Pessac-Léognan. Son vignoble, cultivé depuis le XIIIᵉ siècle, donne naissance à des vins rouges et blancs d'une grande profondeur, où richesse, fraîcheur et élégance se conjuguent avec une remarquable constance.",
    sections: [
      {
        title: "Un héritage exceptionnel",
        paragraphs: [
          "Le domaine doit son nom à Bertrand de Goth, devenu le pape Clément V, qui développa la propriété avant son pontificat.",
          "Cette histoire pluriséculaire fait de Pape Clément l'un des plus anciens vignobles encore en activité à Bordeaux.",
        ],
      },
      {
        title: "Un terroir de graves emblématique",
        paragraphs: [
          "Les vignes reposent sur des graves profondes mêlées d'argiles, parfaitement adaptées au Cabernet Sauvignon, au Merlot ainsi qu'aux cépages blancs.",
          "Le drainage naturel et la diversité des sols favorisent des maturités régulières et des assemblages complexes.",
        ],
      },
      {
        title: "Une signature riche et raffinée",
        paragraphs: [
          "Les vins rouges développent des arômes de cassis, de mûre, de graphite, de cèdre, de violette et d'épices, soutenus par une texture ample et des tanins soyeux.",
          "Les vins blancs séduisent par leur tension, leurs notes d'agrumes, de fleurs blanches et leur remarquable potentiel de garde.",
        ],
      },
      {
        title: "Une évolution harmonieuse",
        paragraphs: [
          "Les grands millésimes gagnent progressivement en complexité avec des notes de tabac, de truffe, de cuir fin et de sous-bois.",
          "Cette évolution confirme la capacité des vins du domaine à vieillir pendant plusieurs décennies.",
        ],
      },
      {
        title: "Le second vin",
        paragraphs: [
          "Le Clémentin de Pape Clément est élaboré en rouge comme en blanc.",
          "Il reprend l'esprit du grand vin dans une expression plus accessible tout en conservant la personnalité du domaine.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Pape Clément, c'est découvrir un grand Pessac-Léognan où histoire, précision et profondeur s'expriment avec une remarquable élégance.",
  },

  "domaine-de-chevalier": {
    eyebrow: "Histoire, terroir et identité",
    title: "Domaine de Chevalier, l'excellence discrète de Pessac-Léognan",
    introduction:
      "Cru Classé de Graves, Domaine de Chevalier est l'une des propriétés les plus respectées de Pessac-Léognan. Niché au cœur d'une vaste forêt, le domaine produit des vins rouges et blancs d'une grande précision, reconnus pour leur élégance, leur fraîcheur et leur remarquable aptitude au vieillissement.",
    sections: [
      {
        title: "Un domaine historique au cœur des Graves",
        paragraphs: [
          "L'histoire du Domaine de Chevalier remonte à plusieurs siècles. Son environnement préservé, entouré de forêts, crée un microclimat particulièrement favorable à la vigne.",
          "Cette situation contribue à préserver la fraîcheur des raisins et participe à la personnalité singulière des vins du domaine.",
        ],
      },
      {
        title: "Un terroir de graves exceptionnel",
        paragraphs: [
          "Les vignes reposent sur de profondes graves garonnaises mêlées à des sous-sols argileux assurant un drainage naturel remarquable.",
          "Le Cabernet Sauvignon, le Merlot, ainsi que les cépages blancs Sauvignon Blanc et Sémillon y trouvent des conditions idéales d'expression.",
        ],
      },
      {
        title: "Une signature fondée sur la précision",
        paragraphs: [
          "Les vins rouges développent des arômes de cassis, de mûre, de graphite, de cèdre et d'épices avec une grande pureté.",
          "Les vins blancs offrent une remarquable tension, des notes d'agrumes, de fleurs blanches, de fruits exotiques et une grande capacité de garde.",
        ],
      },
      {
        title: "Une élégance qui traverse le temps",
        paragraphs: [
          "Les meilleurs millésimes évoluent progressivement vers des notes de tabac blond, de truffe, de cuir fin et de sous-bois pour les rouges, tandis que les blancs gagnent en complexité autour du miel, de la cire et des fruits secs.",
          "Cette évolution harmonieuse fait du Domaine de Chevalier l'une des grandes références de garde de Pessac-Léognan.",
        ],
      },
      {
        title: "L'Esprit de Chevalier",
        paragraphs: [
          "L'Esprit de Chevalier constitue la seconde gamme du domaine, en rouge comme en blanc.",
          "Ces cuvées reprennent l'identité du vignoble dans une expression plus accessible tout en conservant l'élégance propre à la propriété.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Domaine de Chevalier, c'est découvrir un grand Pessac-Léognan où précision, fraîcheur et élégance s'expriment avec une remarquable constance, aussi bien en rouge qu'en blanc.",
  },

  "chateau-la-conseillante": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château La Conseillante, la soie de Pomerol",
    introduction:
      "Château La Conseillante figure parmi les propriétés les plus prestigieuses de Pomerol. Son terroir d'argiles et de graves, associé à une forte proportion de Merlot complétée par le Cabernet Franc, donne naissance à des vins réputés pour leur élégance, leur texture soyeuse et leur remarquable potentiel de garde.",
    sections: [
      {
        title: "Une grande propriété familiale",
        paragraphs: [
          "Fondé au XVIIIᵉ siècle, le domaine est resté fidèle à une tradition d'excellence tout en faisant évoluer ses pratiques pour révéler avec précision chaque millésime.",
          "La Conseillante est aujourd'hui considérée comme l'une des signatures incontournables de Pomerol.",
        ],
      },
      {
        title: "Un terroir au cœur du plateau de Pomerol",
        paragraphs: [
          "Le vignoble repose sur une combinaison d'argiles, de graves et de sables qui favorise une alimentation hydrique régulière et une maturation homogène.",
          "Cette diversité permet d'obtenir des vins profonds, équilibrés et particulièrement raffinés.",
        ],
      },
      {
        title: "Merlot et Cabernet Franc en parfaite harmonie",
        paragraphs: [
          "Le Merlot apporte chair, velouté et richesse aromatique tandis que le Cabernet Franc renforce la fraîcheur, la finesse florale et la longueur.",
          "L'assemblage donne naissance à des vins d'une remarquable précision.",
        ],
      },
      {
        title: "Une signature d'élégance",
        paragraphs: [
          "Les vins dévoilent des notes de violette, de cassis, de prune, de graphite, d'épices douces et de truffe avec l'âge.",
          "La bouche se distingue par des tanins soyeux, une grande fraîcheur et une finale persistante.",
        ],
      },
      {
        title: "Une garde exceptionnelle",
        paragraphs: [
          "Les meilleurs millésimes évoluent pendant plusieurs décennies sans perdre leur équilibre.",
          "Le temps révèle une complexité croissante tout en conservant la délicatesse qui fait la réputation du domaine.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château La Conseillante, c'est découvrir l'une des expressions les plus élégantes de Pomerol, où profondeur, finesse et harmonie s'unissent dans un équilibre remarquable.",
  },

  "chateau-l-evangile": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château L'Évangile, la profondeur raffinée de Pomerol",
    introduction:
      "Château L'Évangile compte parmi les grandes références de Pomerol. Situé entre Petrus et Cheval Blanc, son vignoble bénéficie d'un terroir exceptionnel où les argiles et les graves donnent naissance à des vins profonds, précis et remarquablement équilibrés.",
    sections: [
      {
        title: "Un domaine historique de Pomerol",
        paragraphs: [
          "Fondé au XVIIIᵉ siècle, le domaine s'est progressivement imposé parmi les propriétés les plus recherchées de l'appellation.",
          "Son histoire est marquée par une recherche constante de qualité et par une attention particulière portée au terroir.",
        ],
      },
      {
        title: "Un terroir privilégié",
        paragraphs: [
          "Les parcelles reposent sur une mosaïque d'argiles profondes, de graves et de sables, offrant une remarquable diversité d'expression.",
          "Cette richesse géologique favorise des vins à la fois puissants, frais et d'une grande précision.",
        ],
      },
      {
        title: "Merlot et Cabernet Franc",
        paragraphs: [
          "Le Merlot constitue l'ossature du grand vin, tandis que le Cabernet Franc apporte fraîcheur, tension et complexité aromatique.",
          "L'assemblage offre une texture soyeuse et une remarquable longueur.",
        ],
      },
      {
        title: "Une signature élégante",
        paragraphs: [
          "Les vins développent des notes de cassis, de prune, de violette, de graphite, d'épices et, avec le temps, de truffe et de sous-bois.",
          "La bouche associe densité, équilibre et finesse avec des tanins particulièrement veloutés.",
        ],
      },
      {
        title: "Une garde de très haut niveau",
        paragraphs: [
          "Les meilleurs millésimes évoluent harmonieusement pendant plusieurs décennies.",
          "Le temps renforce leur complexité sans jamais altérer leur fraîcheur naturelle.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château L'Évangile, c'est découvrir un grand Pomerol où profondeur, élégance et précision traduisent avec fidélité l'un des plus beaux terroirs de la rive droite.",
  },

  "vieux-chateau-certan": {
    eyebrow: "Histoire, terroir et identité",
    title: "Vieux Château Certan, l'équilibre absolu de Pomerol",
    introduction:
      "Vieux Château Certan est l'une des propriétés les plus prestigieuses de Pomerol. Domaine familial depuis près d'un siècle, il est reconnu pour la précision de ses assemblages, la noblesse de son terroir et une remarquable capacité à produire des vins d'une grande profondeur tout en conservant une élégance exemplaire.",
    sections: [
      {
        title: "Une histoire au cœur de Pomerol",
        paragraphs: [
          "Les origines de Vieux Château Certan remontent au XVIIIᵉ siècle. Depuis plusieurs générations, la famille Thienpont veille à préserver l'identité du domaine tout en recherchant une qualité constante.",
          "Cette continuité familiale contribue largement à la personnalité singulière des vins produits sur cette propriété emblématique.",
        ],
      },
      {
        title: "Un terroir exceptionnel",
        paragraphs: [
          "Le vignoble repose sur une mosaïque d'argiles, de graves et de sables qui favorise une expression particulièrement nuancée des cépages.",
          "La diversité des sols permet d'élaborer des assemblages complexes où chaque parcelle apporte une contribution spécifique à l'équilibre du grand vin.",
        ],
      },
      {
        title: "Merlot, Cabernet Franc et Cabernet Sauvignon",
        paragraphs: [
          "Le Merlot constitue généralement la base de l'assemblage, complété par une proportion importante de Cabernet Franc et une présence plus rare de Cabernet Sauvignon.",
          "Cette combinaison apporte profondeur, fraîcheur, finesse florale et remarquable potentiel de vieillissement.",
        ],
      },
      {
        title: "Une signature d'une grande élégance",
        paragraphs: [
          "Les vins développent des arômes de cassis, de prune, de violette, de graphite, de cèdre et d'épices, auxquels s'ajoutent avec l'âge des notes de truffe, de tabac blond et de sous-bois.",
          "La bouche se distingue par des tanins particulièrement soyeux, une fraîcheur persistante et une finale d'une grande précision.",
        ],
      },
      {
        title: "Une référence des grands Pomerol",
        paragraphs: [
          "Les meilleurs millésimes évoluent harmonieusement pendant plusieurs décennies sans perdre leur équilibre.",
          "Cette remarquable régularité place Vieux Château Certan parmi les vins les plus recherchés de l'appellation.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Vieux Château Certan, c'est découvrir un grand Pomerol où profondeur, harmonie et élégance traduisent avec fidélité l'un des plus beaux terroirs de la rive droite.",
  },

  "chateau-trotanoy": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Trotanoy, la puissance maîtrisée de Pomerol",
    introduction:
      "Château Trotanoy est l'une des propriétés les plus prestigieuses de Pomerol. Son terroir exceptionnel, dominé par des argiles profondes, donne naissance à des vins d'une rare intensité, réputés pour leur structure, leur profondeur et leur extraordinaire potentiel de vieillissement.",
    sections: [
      {
        title: "Une propriété historique",
        paragraphs: [
          "Cultivé depuis plusieurs siècles, le vignoble de Trotanoy s'est progressivement imposé parmi les plus grandes références de Pomerol.",
          "Le domaine est aujourd'hui reconnu pour la remarquable constance de ses grands millésimes et pour son exigence dans le travail de la vigne.",
        ],
      },
      {
        title: "Un terroir d'argiles exceptionnel",
        paragraphs: [
          "Les sols reposent principalement sur des argiles très compactes mêlées de graves et de dépôts ferrugineux.",
          "Cette composition confère au Merlot une profondeur, une densité et une fraîcheur remarquables, même lors des années les plus chaudes.",
        ],
      },
      {
        title: "Une expression unique du Merlot",
        paragraphs: [
          "Le Merlot domine largement les assemblages, complété par une faible proportion de Cabernet Franc.",
          "Les vins développent des arômes de prune, de cassis, de violette, de graphite, d'épices et de truffe avec l'âge.",
        ],
      },
      {
        title: "Une signature puissante et raffinée",
        paragraphs: [
          "Dans sa jeunesse, Trotanoy impressionne par sa concentration et sa structure tannique.",
          "Au fil des décennies, la texture gagne en velouté tout en conservant une remarquable énergie et une longueur exceptionnelle.",
        ],
      },
      {
        title: "Une référence incontournable de Pomerol",
        paragraphs: [
          "Les meilleurs millésimes figurent parmi les plus recherchés de la rive droite.",
          "Leur capacité à évoluer harmonieusement pendant plusieurs décennies renforce encore la réputation internationale du domaine.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Trotanoy, c'est découvrir un grand Pomerol où puissance, profondeur et élégance traduisent avec fidélité l'un des plus grands terroirs de l'appellation.",
  },

  "chateau-hosanna": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Hosanna, l'élégance contemporaine de Pomerol",
    introduction:
      "Château Hosanna est l'une des propriétés les plus prestigieuses de Pomerol. Né de la réunion de parcelles historiques, le domaine s'est rapidement imposé parmi les grandes références de l'appellation grâce à des vins profonds, raffinés et remarquablement équilibrés, où le Merlot et le Cabernet Franc expriment toute la richesse du terroir.",
    sections: [
      {
        title: "Une propriété récente sur un terroir historique",
        paragraphs: [
          "Créé à la fin du XXᵉ siècle à partir de parcelles réputées de Pomerol, Château Hosanna bénéficie d'un patrimoine viticole exceptionnel.",
          "Le domaine appartient aux propriétés emblématiques de la famille Moueix, dont l'expérience contribue à révéler toute la personnalité du terroir.",
        ],
      },
      {
        title: "Un terroir d'argiles et de graves",
        paragraphs: [
          "Le vignoble repose sur une combinaison d'argiles profondes, de graves et de sols riches en oxydes de fer.",
          "Cette diversité favorise une maturation régulière des raisins et donne naissance à des vins d'une remarquable profondeur.",
        ],
      },
      {
        title: "Merlot et Cabernet Franc en harmonie",
        paragraphs: [
          "Le Merlot apporte chair, velouté et richesse aromatique, tandis que le Cabernet Franc renforce la fraîcheur, la tension et la finesse florale.",
          "L'assemblage offre une structure élégante et une grande précision.",
        ],
      },
      {
        title: "Une signature raffinée",
        paragraphs: [
          "Les vins développent des arômes de cassis, de prune, de violette, de graphite, d'épices et de truffe au fil du vieillissement.",
          "La bouche séduit par sa texture soyeuse, son équilibre et une longue finale empreinte de fraîcheur.",
        ],
      },
      {
        title: "Un grand vin de garde",
        paragraphs: [
          "Les meilleurs millésimes évoluent harmonieusement pendant plusieurs décennies.",
          "Cette remarquable aptitude au vieillissement renforce la place de Château Hosanna parmi les grandes références de Pomerol.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Hosanna, c'est découvrir un grand Pomerol où profondeur, finesse et précision traduisent avec élégance la richesse de l'un des plus beaux terroirs de la rive droite.",
  },

  "chateau-la-fleur-petrus": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château La Fleur-Pétrus, l'harmonie du plateau de Pomerol",
    introduction:
      "Château La Fleur-Pétrus compte parmi les grandes références de Pomerol. Situé sur le célèbre plateau de l'appellation, le domaine produit des vins d'une grande finesse où le Merlot, soutenu par le Cabernet Franc, exprime toute la richesse d'un terroir exceptionnel.",
    sections: [
      {
        title: "Une propriété emblématique",
        paragraphs: [
          "Le domaine appartient à la famille Moueix et bénéficie d'une longue tradition d'excellence dans l'élaboration des grands vins de Pomerol.",
          "Sa réputation repose sur une remarquable régularité qualitative et une sélection parcellaire exigeante.",
        ],
      },
      {
        title: "Un terroir de graves et d'argiles",
        paragraphs: [
          "Le vignoble repose sur une mosaïque de graves, d'argiles profondes et de sols riches en crasse de fer.",
          "Cette diversité apporte à la fois profondeur, fraîcheur et précision aux assemblages.",
        ],
      },
      {
        title: "Le style La Fleur-Pétrus",
        paragraphs: [
          "Le Merlot apporte une texture veloutée et une grande richesse aromatique tandis que le Cabernet Franc renforce la fraîcheur et la longueur.",
          "Les vins développent des notes de cassis, de prune, de violette, de graphite, d'épices douces et, avec l'âge, de truffe.",
        ],
      },
      {
        title: "Une évolution remarquable",
        paragraphs: [
          "Les grands millésimes gagnent progressivement en complexité tout en conservant une remarquable harmonie.",
          "Le vieillissement révèle des nuances de tabac blond, de cuir fin et de sous-bois sans altérer la pureté du fruit.",
        ],
      },
      {
        title: "Une référence de la rive droite",
        paragraphs: [
          "La Fleur-Pétrus est reconnu pour son équilibre entre puissance et élégance.",
          "Cette personnalité en fait l'un des vins les plus recherchés de Pomerol par les amateurs et collectionneurs.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château La Fleur-Pétrus, c'est découvrir un grand Pomerol où profondeur, finesse et équilibre expriment toute la noblesse du plateau de l'appellation.",
  },

  "chateau-l-eglise-clinet": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château L'Église-Clinet, la précision absolue de Pomerol",
    introduction:
      "Château L'Église-Clinet figure parmi les domaines les plus prestigieux de Pomerol. Grâce à un terroir exceptionnel et à une recherche constante de précision, la propriété produit des vins d'une remarquable intensité, où profondeur, fraîcheur et élégance se conjuguent avec une rare harmonie.",
    sections: [
      {
        title: "Une propriété emblématique de Pomerol",
        paragraphs: [
          "Le domaine trouve ses origines dans deux anciennes propriétés historiques réunies pour former l'actuel Château L'Église-Clinet.",
          "Sous l'impulsion de la famille Durantou, la propriété s'est imposée comme l'une des références incontournables de l'appellation.",
        ],
      },
      {
        title: "Un terroir d'argiles et de graves",
        paragraphs: [
          "Le vignoble repose sur une combinaison de graves profondes, d'argiles et de crasse de fer qui favorise une expression particulièrement complexe des cépages.",
          "Cette diversité géologique apporte à la fois concentration, fraîcheur et précision.",
        ],
      },
      {
        title: "Merlot et Cabernet Franc en parfaite complémentarité",
        paragraphs: [
          "Le Merlot constitue la base de l'assemblage tandis que le Cabernet Franc apporte tension, finesse aromatique et longueur.",
          "Cette alliance donne naissance à des vins d'une texture soyeuse et d'une remarquable profondeur.",
        ],
      },
      {
        title: "Une signature d'une grande pureté",
        paragraphs: [
          "Les vins développent des arômes de cassis, de prune, de violette, de graphite, d'épices et de truffe au fil du vieillissement.",
          "La bouche séduit par son équilibre, ses tanins raffinés et une finale particulièrement persistante.",
        ],
      },
      {
        title: "Une référence mondiale",
        paragraphs: [
          "Les meilleurs millésimes évoluent harmonieusement pendant plusieurs décennies.",
          "Cette capacité de garde et cette régularité qualitative expliquent la place privilégiée occupée par Château L'Église-Clinet parmi les grands vins de Pomerol.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château L'Église-Clinet, c'est découvrir un grand Pomerol où précision, profondeur et élégance expriment avec fidélité l'un des plus beaux terroirs de la rive droite.",
  },

  "chateau-clinet": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Clinet, la richesse expressive de Pomerol",
    introduction:
      "Château Clinet compte parmi les grandes références de Pomerol. Situé sur le célèbre plateau de l'appellation, le domaine est reconnu pour des vins profonds, généreux et remarquablement équilibrés, où le Merlot exprime toute la richesse de son terroir tout en conservant une remarquable fraîcheur.",
    sections: [
      {
        title: "Une propriété historique de Pomerol",
        paragraphs: [
          "Les origines de Château Clinet remontent à plusieurs siècles. Au fil du temps, le domaine s'est imposé comme l'une des propriétés les plus réputées de la rive droite grâce à une recherche constante de qualité.",
          "L'évolution du vignoble et des méthodes de vinification a permis de révéler toute la personnalité de ce terroir emblématique.",
        ],
      },
      {
        title: "Un terroir d'argiles et de graves",
        paragraphs: [
          "Le vignoble repose sur une combinaison d'argiles profondes, de graves et de sols riches en oxydes de fer, particulièrement adaptés au Merlot.",
          "Cette diversité géologique favorise des vins concentrés, équilibrés et d'une grande précision aromatique.",
        ],
      },
      {
        title: "Le Merlot comme fil conducteur",
        paragraphs: [
          "Le Merlot constitue l'ossature des assemblages, complété par le Cabernet Franc selon les millésimes.",
          "Il apporte une texture veloutée, une grande richesse aromatique et une remarquable profondeur.",
        ],
      },
      {
        title: "Une signature généreuse et élégante",
        paragraphs: [
          "Les vins développent des notes de cassis, de prune, de violette, de graphite, d'épices et de truffe au fil du vieillissement.",
          "La bouche associe densité, fraîcheur et tanins soyeux dans une finale longue et harmonieuse.",
        ],
      },
      {
        title: "Une remarquable capacité de garde",
        paragraphs: [
          "Les meilleurs millésimes évoluent progressivement pendant plusieurs décennies.",
          "Cette aptitude au vieillissement confirme la place de Château Clinet parmi les grandes signatures de Pomerol.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Clinet, c'est découvrir un grand Pomerol où richesse, précision et élégance traduisent avec fidélité la noblesse du plateau de l'appellation.",
  },

  "chateau-la-violette": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château La Violette, la rareté absolue de Pomerol",
    introduction:
      "Château La Violette est l'une des propriétés les plus confidentielles de Pomerol. Avec une superficie extrêmement réduite et une production limitée à quelques milliers de bouteilles selon les millésimes, le domaine produit des vins recherchés pour leur profondeur, leur texture soyeuse et leur remarquable intensité aromatique.",
    sections: [
      {
        title: "Une micro-propriété d'exception",
        paragraphs: [
          "Situé sur le plateau de Pomerol, Château La Violette fait partie des domaines les plus rares de Bordeaux.",
          "Sa taille confidentielle permet un suivi extrêmement précis de chaque parcelle et une sélection particulièrement exigeante des raisins.",
        ],
      },
      {
        title: "Un terroir privilégié",
        paragraphs: [
          "Le vignoble repose principalement sur des argiles profondes enrichies de graves et de dépôts ferrugineux, parfaitement adaptées au Merlot.",
          "Ces sols favorisent une alimentation hydrique régulière et contribuent à la richesse ainsi qu'à la fraîcheur des vins.",
        ],
      },
      {
        title: "Le Merlot dans toute sa pureté",
        paragraphs: [
          "Le Merlot constitue presque l'intégralité de l'encépagement et exprime ici une remarquable concentration sans jamais perdre son élégance.",
          "Les vins développent des arômes de prune, de cassis, de violette, de chocolat noir, d'épices douces et, avec le temps, de truffe.",
        ],
      },
      {
        title: "Une signature raffinée",
        paragraphs: [
          "La bouche impressionne par sa texture veloutée, la finesse de ses tanins et une longueur exceptionnelle.",
          "Les grands millésimes évoluent lentement vers une complexité toujours plus grande tout en conservant une remarquable précision.",
        ],
      },
      {
        title: "Une production extrêmement limitée",
        paragraphs: [
          "Chaque millésime est produit en quantité très réduite, ce qui renforce encore la rareté des bouteilles.",
          "Cette confidentialité fait de Château La Violette l'une des cuvées les plus recherchées par les amateurs de grands Pomerol.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château La Violette, c'est découvrir un grand Pomerol d'une rareté exceptionnelle où profondeur, finesse et élégance expriment toute la richesse d'un terroir unique.",
  },

  "chateau-angelus": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Angélus, la puissance harmonieuse de Saint-Émilion",
    introduction:
      "Premier Grand Cru Classé A pendant de nombreuses années, Château Angélus est l'une des propriétés emblématiques de Saint-Émilion. Son terroir exceptionnel, où le Cabernet Franc joue un rôle majeur aux côtés du Merlot, donne naissance à des vins profonds, raffinés et dotés d'un remarquable potentiel de garde.",
    sections: [
      {
        title: "Une propriété historique",
        paragraphs: [
          "La famille de Boüard de Laforest façonne l'identité du domaine depuis plusieurs générations en recherchant une expression fidèle du terroir.",
          "Le nom Angélus évoque les clochers voisins dont les sonneries se rejoignaient autrefois au-dessus du vignoble.",
        ],
      },
      {
        title: "Un terroir d'exception",
        paragraphs: [
          "Les parcelles reposent sur des argiles, des calcaires et des éboulis calcaires qui assurent fraîcheur et régularité de maturation.",
          "Cette diversité géologique permet de produire des vins complexes et équilibrés.",
        ],
      },
      {
        title: "Le rôle essentiel du Cabernet Franc",
        paragraphs: [
          "Le Cabernet Franc occupe une place importante dans les assemblages et apporte tension, finesse florale et longueur.",
          "Le Merlot complète l'ensemble par sa chair, sa profondeur et sa texture veloutée.",
        ],
      },
      {
        title: "Une signature intense et élégante",
        paragraphs: [
          "Les vins révèlent des arômes de cassis, de mûre, de violette, de graphite, d'épices et, avec l'âge, de truffe et de tabac blond.",
          "La bouche associe densité, fraîcheur et tanins soyeux dans une finale particulièrement persistante.",
        ],
      },
      {
        title: "Carillon d'Angélus",
        paragraphs: [
          "Carillon d'Angélus constitue la seconde expression du domaine.",
          "Cette cuvée offre une approche plus accessible tout en conservant la personnalité et la précision propres à Château Angélus.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Angélus, c'est découvrir un grand Saint-Émilion où puissance, élégance et précision traduisent toute la richesse d'un terroir exceptionnel.",
  },

  "chateau-figeac": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Figeac, l'élégance singulière de Saint-Émilion",
    introduction:
      "Premier Grand Cru Classé A, Château Figeac occupe une place à part dans le paysage de Saint-Émilion. Son vaste terroir de graves et son assemblage dominé par les Cabernets lui confèrent un style unique, alliant finesse, fraîcheur, profondeur et exceptionnelle capacité de vieillissement.",
    sections: [
      {
        title: "Un domaine historique",
        paragraphs: [
          "Les origines de Figeac remontent à l'époque gallo-romaine. Au fil des siècles, le domaine s'est imposé comme l'une des propriétés les plus prestigieuses de la rive droite.",
          "Son identité repose sur la continuité de son vignoble et sur une recherche constante de précision.",
        ],
      },
      {
        title: "Un terroir de graves rare à Saint-Émilion",
        paragraphs: [
          "Contrairement à de nombreuses propriétés de l'appellation, Figeac repose sur trois croupes de graves profondes mêlées à des argiles.",
          "Cette singularité favorise une maturation lente des Cabernets et apporte une remarquable fraîcheur aux vins.",
        ],
      },
      {
        title: "Les Cabernets comme signature",
        paragraphs: [
          "Le Cabernet Franc et le Cabernet Sauvignon occupent une place inhabituelle dans l'assemblage, complétés par le Merlot.",
          "Cette combinaison donne naissance à des vins racés, complexes et particulièrement aptes au vieillissement.",
        ],
      },
      {
        title: "Une élégance intemporelle",
        paragraphs: [
          "Les vins développent des arômes de cassis, de mûre, de violette, de graphite, de cèdre et d'épices fines.",
          "Avec le temps apparaissent des notes de tabac blond, de truffe, de cuir fin et de sous-bois, dans une bouche toujours équilibrée.",
        ],
      },
      {
        title: "Petit-Figeac",
        paragraphs: [
          "Petit-Figeac constitue la seconde expression du domaine.",
          "Il reflète la personnalité de Figeac dans un style plus accessible tout en conservant l'élégance caractéristique de la propriété.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Figeac, c'est découvrir un grand Saint-Émilion où la fraîcheur des Cabernets, la profondeur du terroir et l'élégance de la rive droite s'unissent dans un équilibre remarquable.",
  },

  "chateau-canon": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Canon, la pureté du calcaire de Saint-Émilion",
    introduction:
      "Premier Grand Cru Classé B, Château Canon figure parmi les références majeures de Saint-Émilion. Implanté sur le célèbre plateau calcaire, le domaine produit des vins où la précision, la fraîcheur et la profondeur s'équilibrent avec une remarquable élégance. Son identité repose sur l'alliance du Merlot et du Cabernet Franc, révélant toute la finesse de ce terroir d'exception.",
    sections: [
      {
        title: "Une propriété historique",
        paragraphs: [
          "Fondé au XVIIIᵉ siècle par le négociant Jacques Kanon, dont le nom est devenu Canon, le domaine s'est progressivement imposé parmi les plus grands crus de Saint-Émilion.",
          "La propriété est aujourd'hui reconnue pour la régularité de ses vins et son exigence dans la conduite du vignoble.",
        ],
      },
      {
        title: "Le plateau calcaire de Saint-Émilion",
        paragraphs: [
          "Le vignoble repose sur un socle calcaire recouvert par endroits d'une fine couche d'argiles.",
          "Ce terroir favorise une alimentation hydrique régulière, apporte de la fraîcheur aux raisins et contribue à la remarquable tension des vins.",
        ],
      },
      {
        title: "Merlot et Cabernet Franc en équilibre",
        paragraphs: [
          "Le Merlot apporte chair, profondeur et velouté, tandis que le Cabernet Franc renforce la fraîcheur, la finesse florale et la longueur.",
          "L'assemblage donne naissance à des vins précis, harmonieux et particulièrement aptes au vieillissement.",
        ],
      },
      {
        title: "Une signature élégante",
        paragraphs: [
          "Les vins développent des arômes de cerise noire, de cassis, de violette, de graphite, d'épices douces et, avec le temps, de truffe et de tabac blond.",
          "La bouche séduit par des tanins soyeux, une grande pureté aromatique et une finale persistante marquée par la fraîcheur du calcaire.",
        ],
      },
      {
        title: "Croix Canon",
        paragraphs: [
          "Croix Canon constitue la seconde expression du domaine.",
          "Cette cuvée reflète l'identité de Château Canon dans un style plus accessible tout en conservant la précision et l'élégance qui caractérisent la propriété.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Canon, c'est découvrir un grand Saint-Émilion où la noblesse du plateau calcaire s'exprime à travers des vins d'une remarquable finesse, d'une grande profondeur et d'un exceptionnel potentiel de garde.",
  },

  "chateau-belair-monange": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Château Bélair-Monange, la noblesse du plateau calcaire de Saint-Émilion",
    introduction:
      "Premier Grand Cru Classé B, Château Bélair-Monange est l'une des grandes propriétés historiques de Saint-Émilion. Situé sur le célèbre plateau calcaire, le domaine produit des vins où la pureté du fruit, la fraîcheur minérale et la profondeur s'unissent dans un équilibre remarquable. Son style allie la richesse du Merlot à l'élégance du Cabernet Franc.",
    sections: [
      {
        title: "Une propriété au riche héritage",
        paragraphs: [
          "Les origines du domaine remontent à plusieurs siècles et font de Bélair-Monange l'un des noms historiques de Saint-Émilion.",
          "Depuis son intégration au sein des propriétés de la famille Moueix, d'importants travaux ont permis de révéler tout le potentiel du vignoble tout en respectant son identité.",
        ],
      },
      {
        title: "Le plateau calcaire de Saint-Émilion",
        paragraphs: [
          "Le vignoble repose principalement sur des calcaires à astéries recouverts par endroits d'une fine couche d'argiles.",
          "Ce terroir exceptionnel apporte fraîcheur, tension et précision, tout en favorisant une remarquable régularité de maturation.",
        ],
      },
      {
        title: "Merlot et Cabernet Franc en parfaite harmonie",
        paragraphs: [
          "Le Merlot constitue la base de l'assemblage, complété par le Cabernet Franc qui apporte finesse florale, longueur et énergie.",
          "Cette complémentarité donne naissance à des vins d'une grande profondeur sans jamais sacrifier l'élégance.",
        ],
      },
      {
        title: "Une signature racée",
        paragraphs: [
          "Les vins développent des arômes de cerise noire, de cassis, de violette, de graphite, d'épices douces et de réglisse.",
          "Avec le vieillissement apparaissent des notes de truffe, de tabac blond, de sous-bois et de cuir fin, dans une bouche toujours précise et harmonieuse.",
        ],
      },
      {
        title: "Une remarquable aptitude au vieillissement",
        paragraphs: [
          "Les meilleurs millésimes traversent plusieurs décennies en gagnant progressivement en complexité.",
          "Cette évolution confirme la place de Château Bélair-Monange parmi les références incontournables de Saint-Émilion.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Bélair-Monange, c'est découvrir un grand Saint-Émilion où la finesse du plateau calcaire, la profondeur du Merlot et la fraîcheur du Cabernet Franc s'expriment avec une remarquable élégance.",
  },

  "chateau-pavie": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Pavie, la puissance maîtrisée de Saint-Émilion",
    introduction:
      "Premier Grand Cru Classé A pendant de nombreuses années, Château Pavie domine le coteau sud-est de Saint-Émilion depuis un terroir exceptionnel. Son vignoble, composé de calcaires, d'argiles et d'éboulis, donne naissance à des vins profonds, concentrés et remarquablement aptes au vieillissement, tout en conservant une grande précision.",
    sections: [
      {
        title: "Une propriété emblématique",
        paragraphs: [
          "Cultivé depuis l'époque romaine, Château Pavie est l'un des plus anciens domaines de Saint-Émilion. Son histoire est intimement liée à celle du plateau et des coteaux qui font la renommée de l'appellation.",
          "Au cours des dernières décennies, la propriété a poursuivi une recherche constante de qualité afin d'exprimer pleinement la richesse de son terroir.",
        ],
      },
      {
        title: "Un terroir exceptionnel",
        paragraphs: [
          "Le vignoble s'étend du plateau calcaire jusqu'aux coteaux argilo-calcaires, offrant une remarquable diversité de sols.",
          "Cette mosaïque géologique permet au Merlot, au Cabernet Franc et au Cabernet Sauvignon de révéler toute leur complexité.",
        ],
      },
      {
        title: "Une signature profonde et précise",
        paragraphs: [
          "Les vins développent des arômes de mûre, de cassis, de cerise noire, de violette, de graphite et d'épices.",
          "La bouche associe concentration, fraîcheur et structure, avec des tanins denses qui gagnent progressivement en finesse.",
        ],
      },
      {
        title: "Un très grand potentiel de garde",
        paragraphs: [
          "Les meilleurs millésimes évoluent harmonieusement pendant plusieurs décennies.",
          "Le vieillissement révèle des notes de truffe, de tabac blond, de cuir fin et de sous-bois tout en conservant une remarquable énergie.",
        ],
      },
      {
        title: "Arômes de Pavie",
        paragraphs: [
          "Arômes de Pavie constitue la seconde expression du domaine.",
          "Cette cuvée reprend les grands équilibres de la propriété dans un style plus accessible durant sa jeunesse.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Pavie, c'est découvrir un grand Saint-Émilion où puissance, profondeur et élégance traduisent avec fidélité la richesse d'un terroir parmi les plus prestigieux de Bordeaux.",
  },

  "chateau-troplong-mondot": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Troplong Mondot, la grandeur du plateau de Saint-Émilion",
    introduction:
      "Premier Grand Cru Classé B, Château Troplong Mondot domine l'un des points culminants de Saint-Émilion. Son vaste terroir argilo-calcaire produit des vins profonds, complexes et d'une remarquable fraîcheur, où la puissance s'exprime toujours avec précision et équilibre.",
    sections: [
      {
        title: "Une propriété emblématique",
        paragraphs: [
          "Les origines du domaine remontent au XVIIIᵉ siècle. Au fil des générations, Troplong Mondot s'est imposé parmi les grandes références de Saint-Émilion grâce à l'excellence de son terroir.",
          "Aujourd'hui, la propriété poursuit une approche exigeante visant à exprimer avec fidélité chaque millésime.",
        ],
      },
      {
        title: "Un terroir d'altitude exceptionnel",
        paragraphs: [
          "Le vignoble repose sur un plateau argilo-calcaire culminant au-dessus de Saint-Émilion.",
          "Cette situation privilégiée favorise une maturation lente des raisins tout en préservant une remarquable tension naturelle.",
        ],
      },
      {
        title: "Merlot, Cabernet Franc et Cabernet Sauvignon",
        paragraphs: [
          "Le Merlot constitue la base des assemblages, complété par le Cabernet Franc et le Cabernet Sauvignon.",
          "Cette combinaison apporte profondeur, richesse aromatique, fraîcheur et grande aptitude au vieillissement.",
        ],
      },
      {
        title: "Une signature profonde et élégante",
        paragraphs: [
          "Les vins développent des arômes de cerise noire, de cassis, de violette, de graphite, d'épices et de réglisse.",
          "Avec le temps apparaissent des notes de truffe, de tabac blond, de sous-bois et de cuir fin, portées par une texture soyeuse.",
        ],
      },
      {
        title: "Une remarquable capacité de garde",
        paragraphs: [
          "Les meilleurs millésimes évoluent harmonieusement pendant plusieurs décennies.",
          "Cette longévité confirme la place de Troplong Mondot parmi les grands vins de Saint-Émilion.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Troplong Mondot, c'est découvrir un grand Saint-Émilion où puissance, fraîcheur et élégance traduisent toute la noblesse du plateau calcaire.",
  },

  "clos-fourtet": {
    eyebrow: "Histoire, terroir et identité",
    title: "Clos Fourtet, l'élégance du plateau calcaire de Saint-Émilion",
    introduction:
      "Premier Grand Cru Classé B, Clos Fourtet est l'une des propriétés emblématiques de Saint-Émilion. Entièrement ceint de murs, ce clos historique repose sur le plateau calcaire de l'appellation et produit des vins où fraîcheur, profondeur et finesse s'expriment avec une remarquable régularité.",
    sections: [
      {
        title: "Un clos chargé d'histoire",
        paragraphs: [
          "Ancienne place fortifiée située aux portes du village de Saint-Émilion, Clos Fourtet possède une histoire intimement liée à celle de la cité médiévale.",
          "Aujourd'hui encore, son vignoble d'un seul tenant constitue un patrimoine exceptionnel.",
        ],
      },
      {
        title: "Le plateau calcaire",
        paragraphs: [
          "Les vignes reposent sur un socle de calcaire à astéries recouvert d'argiles, terroir parmi les plus recherchés de l'appellation.",
          "Cette géologie favorise une alimentation hydrique régulière et apporte aux vins tension, fraîcheur et précision.",
        ],
      },
      {
        title: "Merlot et Cabernet Franc",
        paragraphs: [
          "Le Merlot domine l'assemblage et apporte profondeur ainsi qu'une texture veloutée.",
          "Le Cabernet Franc complète l'ensemble par sa finesse florale, sa fraîcheur et sa longueur, tandis qu'une faible proportion de Cabernet Sauvignon renforce la structure selon les millésimes.",
        ],
      },
      {
        title: "Une signature raffinée",
        paragraphs: [
          "Les vins révèlent des arômes de cerise noire, cassis, violette, graphite et épices, auxquels s'ajoutent avec le temps des notes de truffe, de tabac blond et de sous-bois.",
          "La bouche séduit par des tanins soyeux, une grande pureté et une finale persistante marquée par l'énergie du calcaire.",
        ],
      },
      {
        title: "Un grand vin de garde",
        paragraphs: [
          "Les meilleurs millésimes évoluent harmonieusement pendant plusieurs décennies sans perdre leur équilibre.",
          "Cette remarquable longévité fait de Clos Fourtet l'une des références incontournables de Saint-Émilion.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Clos Fourtet, c'est découvrir un grand Saint-Émilion où la noblesse du plateau calcaire s'exprime à travers des vins profonds, précis et d'une élégance intemporelle.",
  },

  "chateau-quintus": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Château Quintus, la nouvelle référence des hauteurs de Saint-Émilion",
    introduction:
      "Premier Grand Cru Classé de Saint-Émilion, Château Quintus est né de la réunion de plusieurs propriétés historiques situées sur un vaste promontoire calcaire. Son terroir remarquable et une approche parcellaire exigeante donnent naissance à des vins profonds, précis et élégants, fidèles à l'identité de la rive droite.",
    sections: [
      {
        title: "Une propriété tournée vers l'avenir",
        paragraphs: [
          "Créé par la famille propriétaire de Château Haut-Brion et de Château La Mission Haut-Brion, Quintus bénéficie d'une vision à long terme fondée sur la précision et le respect du terroir.",
          "L'agrandissement progressif du vignoble a permis de réunir plusieurs des plus belles parcelles des hauteurs de Saint-Émilion.",
        ],
      },
      {
        title: "Un terroir de plateau et de coteaux",
        paragraphs: [
          "Le vignoble repose sur des calcaires à astéries, des argiles et des coteaux bien exposés qui assurent une excellente maturité des raisins.",
          "Cette diversité géologique apporte fraîcheur, profondeur et complexité aux assemblages.",
        ],
      },
      {
        title: "Le Merlot au cœur de l'assemblage",
        paragraphs: [
          "Le Merlot apporte richesse, velouté et intensité aromatique tandis que le Cabernet Franc renforce la finesse florale, la tension et la longueur.",
          "Chaque millésime est élaboré dans le but de préserver l'équilibre naturel du terroir.",
        ],
      },
      {
        title: "Une signature élégante et profonde",
        paragraphs: [
          "Les vins développent des arômes de cerise noire, de cassis, de violette, de graphite, de réglisse et d'épices.",
          "Avec le vieillissement apparaissent des notes de truffe, de tabac blond, de sous-bois et de cuir fin, soutenues par une texture soyeuse.",
        ],
      },
      {
        title: "Le Dragon de Quintus",
        paragraphs: [
          "Le Dragon de Quintus constitue la seconde expression du domaine.",
          "Cette cuvée offre une lecture plus accessible du vignoble tout en conservant la fraîcheur et l'élégance caractéristiques de Château Quintus.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Quintus, c'est découvrir un grand Saint-Émilion où la précision du travail parcellaire, la richesse du Merlot et la fraîcheur des terroirs calcaires s'unissent dans un équilibre remarquable.",
  },

  "chateau-valandraud": {
    eyebrow: "Histoire, terroir et identité",
    title: "Château Valandraud, le pionnier des grands vins de garage",
    introduction:
      "Premier Grand Cru Classé de Saint-Émilion, Château Valandraud a profondément marqué l'histoire moderne de Bordeaux. Créé à la fin des années 1980 par Jean-Luc Thunevin et Murielle Andraud, le domaine a démontré qu'une petite propriété pouvait rivaliser avec les plus grands crus grâce à une sélection extrêmement rigoureuse, des rendements maîtrisés et une recherche constante de qualité.",
    sections: [
      {
        title: "Une aventure devenue légendaire",
        paragraphs: [
          "Né de quelques parcelles acquises progressivement, Château Valandraud est rapidement devenu l'emblème du mouvement des « vins de garage ».",
          "Son ascension spectaculaire a contribué à renouveler l'image de Saint-Émilion tout en conservant un profond respect du terroir.",
        ],
      },
      {
        title: "Des terroirs sélectionnés avec précision",
        paragraphs: [
          "Le vignoble est constitué de plusieurs parcelles réparties sur les meilleurs secteurs argilo-calcaires de Saint-Émilion.",
          "Cette diversité permet d'élaborer des assemblages complexes où chaque terroir apporte sa propre personnalité.",
        ],
      },
      {
        title: "Merlot, Cabernet Franc et Cabernet Sauvignon",
        paragraphs: [
          "Le Merlot domine généralement les assemblages, accompagné par le Cabernet Franc et parfois le Cabernet Sauvignon.",
          "Cette combinaison offre des vins riches, précis et dotés d'une remarquable fraîcheur malgré leur concentration.",
        ],
      },
      {
        title: "Une signature moderne et élégante",
        paragraphs: [
          "Les vins développent des arômes de mûre, de cassis, de violette, de graphite, de cacao et d'épices douces.",
          "La bouche associe densité, velouté et finesse avec des tanins parfaitement intégrés et une longue finale.",
        ],
      },
      {
        title: "Virginie de Valandraud",
        paragraphs: [
          "Virginie de Valandraud constitue la seconde expression du domaine.",
          "Cette cuvée permet de retrouver l'identité de la propriété dans un style plus accessible tout en conservant la précision qui fait la réputation de Valandraud.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Château Valandraud, c'est découvrir un grand Saint-Émilion qui a profondément marqué l'histoire contemporaine de Bordeaux en associant innovation, exigence et expression fidèle du terroir.",
  },

  "domaine-de-la-romanee-conti": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Domaine de la Romanée-Conti, la quintessence des grands vins de Bourgogne",
    introduction:
      "Le Domaine de la Romanée-Conti, souvent désigné par les initiales DRC, occupe une place unique dans l'univers des grands vins. Installé à Vosne-Romanée, il exploite certains des climats les plus prestigieux de Bourgogne et produit des vins d'une rare intensité, recherchés pour leur précision, leur profondeur et leur capacité exceptionnelle à traduire l'identité de chaque terroir.",
    sections: [
      {
        title: "Un domaine au cœur de l'histoire bourguignonne",
        paragraphs: [
          "L'histoire du domaine est intimement liée à celle de la Romanée-Conti, parcelle mythique dont le nom est devenu une référence mondiale.",
          "Au fil des générations, la propriété a préservé une philosophie fondée sur le respect des climats, la sélection rigoureuse et une production volontairement limitée.",
        ],
      },
      {
        title: "Des grands crus d'exception",
        paragraphs: [
          "Le domaine exploite notamment Romanée-Conti, La Tâche, Richebourg, Romanée-Saint-Vivant, Grands Échezeaux, Échezeaux, Corton et Montrachet.",
          "Chacune de ces appellations possède une personnalité propre, que le domaine cherche à exprimer sans uniformiser les vins.",
        ],
      },
      {
        title: "Le Pinot Noir dans sa forme la plus pure",
        paragraphs: [
          "Sur les grands crus rouges, le Pinot Noir révèle une palette aromatique d'une exceptionnelle complexité : rose, violette, cerise, fruits noirs, épices, sous-bois et notes minérales.",
          "La texture associe finesse, profondeur et énergie, avec des tanins d'une grande précision et une finale souvent interminable.",
        ],
      },
      {
        title: "Une viticulture exigeante",
        paragraphs: [
          "Le domaine privilégie une culture attentive des sols, des rendements faibles et une sélection sévère des raisins.",
          "Cette exigence vise à préserver l'équilibre naturel de chaque parcelle et à transmettre le plus fidèlement possible l'identité du millésime.",
        ],
      },
      {
        title: "Une rareté devenue légendaire",
        paragraphs: [
          "La superficie limitée des grands crus et les faibles volumes produits rendent chaque cuvée extrêmement rare.",
          "Cette rareté, associée à une qualité exceptionnelle et à une capacité de garde remarquable, explique la place du Domaine de la Romanée-Conti parmi les vins les plus recherchés au monde.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Domaine de la Romanée-Conti, c'est découvrir l'une des expressions les plus accomplies du Pinot Noir et des grands terroirs bourguignons, où précision, profondeur et émotion se rejoignent dans des vins d'une rare singularité.",
  },

  "armand-rousseau": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Domaine Armand Rousseau, la noblesse du Pinot Noir à Gevrey-Chambertin",
    introduction:
      "Le Domaine Armand Rousseau est l'une des références absolues de la Côte de Nuits. Installé à Gevrey-Chambertin, il exploite plusieurs des plus grands climats de Bourgogne et produit des vins recherchés pour leur profondeur, leur finesse et leur capacité exceptionnelle à traduire l'identité de chaque terroir.",
    sections: [
      {
        title: "Une histoire familiale emblématique",
        paragraphs: [
          "Fondé au début du XXᵉ siècle, le domaine s'est progressivement constitué autour de parcelles prestigieuses de Gevrey-Chambertin et de Morey-Saint-Denis.",
          "La famille Rousseau perpétue une philosophie fondée sur la précision, la régularité et le respect de l'identité de chaque climat.",
        ],
      },
      {
        title: "Des grands crus parmi les plus prestigieux",
        paragraphs: [
          "Le domaine exploite notamment Chambertin, Chambertin-Clos de Bèze, Clos de la Roche, Ruchottes-Chambertin, Mazis-Chambertin et Charmes-Chambertin.",
          "Ces terroirs offrent des expressions très différentes du Pinot Noir, de la puissance structurée à la finesse la plus délicate.",
        ],
      },
      {
        title: "Le style Armand Rousseau",
        paragraphs: [
          "Les vins se distinguent par une grande pureté aromatique, des notes de cerise, de framboise, de violette, d'épices fines et de sous-bois.",
          "La bouche associe profondeur, précision tannique et fraîcheur avec une remarquable élégance.",
        ],
      },
      {
        title: "Une vinification au service du terroir",
        paragraphs: [
          "Le domaine privilégie des extractions mesurées et des élevages précis afin de préserver la personnalité de chaque parcelle.",
          "Cette approche donne naissance à des vins capables de séduire dans leur jeunesse tout en évoluant harmonieusement pendant plusieurs décennies.",
        ],
      },
      {
        title: "Une rareté recherchée dans le monde entier",
        paragraphs: [
          "Les faibles rendements et la superficie limitée des grands crus rendent les bouteilles du domaine particulièrement rares.",
          "Cette rareté, associée à une qualité exceptionnelle et à une grande capacité de garde, explique leur place privilégiée auprès des amateurs et collectionneurs.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Domaine Armand Rousseau, c'est découvrir l'une des expressions les plus nobles du Pinot Noir bourguignon, où finesse, profondeur et précision révèlent toute la grandeur des terroirs de la Côte de Nuits.",
  },

  "domaine-trapet-pere-et-fils": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Domaine Trapet Père & Fils, l'expression authentique de Gevrey-Chambertin",
    introduction:
      "Le Domaine Trapet Père & Fils fait partie des grandes signatures de la Côte de Nuits. Installé à Gevrey-Chambertin, il est reconnu pour son approche exigeante de la viticulture, son respect du terroir et des vins d'une grande finesse, où le Pinot Noir exprime avec précision toute la personnalité des grands climats bourguignons.",
    sections: [
      {
        title: "Une longue tradition familiale",
        paragraphs: [
          "Depuis plusieurs générations, la famille Trapet cultive quelques-uns des plus beaux terroirs de Gevrey-Chambertin avec une volonté constante de préserver leur identité.",
          "Le domaine s'est imposé comme une référence grâce à une philosophie fondée sur l'équilibre, la précision et le respect de la nature.",
        ],
      },
      {
        title: "Des grands crus prestigieux",
        paragraphs: [
          "Le domaine exploite notamment Chambertin, Latricières-Chambertin et Chapelle-Chambertin, ainsi que plusieurs premiers crus et villages de Gevrey-Chambertin.",
          "Chaque climat est vinifié séparément afin de révéler les nuances propres à son terroir.",
        ],
      },
      {
        title: "Une viticulture respectueuse",
        paragraphs: [
          "Le Domaine Trapet est reconnu pour son engagement de longue date en faveur d'une viticulture biologique et biodynamique.",
          "Cette approche favorise des raisins d'une grande pureté et une expression fidèle des sols bourguignons.",
        ],
      },
      {
        title: "Le style Trapet",
        paragraphs: [
          "Les vins offrent des arômes de cerise, de framboise, de rose, de violette, d'épices fines et de sous-bois avec l'évolution.",
          "La bouche associe énergie, finesse tannique, profondeur et fraîcheur dans un équilibre remarquable.",
        ],
      },
      {
        title: "Une remarquable aptitude au vieillissement",
        paragraphs: [
          "Les grands millésimes gagnent progressivement en complexité pendant plusieurs décennies.",
          "Cette évolution harmonieuse confirme la place du Domaine Trapet parmi les références incontournables de la Côte de Nuits.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Domaine Trapet Père & Fils, c'est découvrir une interprétation authentique des grands terroirs de Gevrey-Chambertin, où élégance, précision et respect du vivant s'unissent dans des vins d'une remarquable personnalité.",
  },

  "domaine-comte-georges-de-vogue": {
    eyebrow: "Histoire, terroir et identité",
    title: "Domaine Comte Georges de Vogüé, l'excellence de Chambolle-Musigny",
    introduction:
      "Le Domaine Comte Georges de Vogüé figure parmi les propriétés les plus prestigieuses de Bourgogne. Installé à Chambolle-Musigny depuis plusieurs siècles, il possède quelques-uns des plus grands climats de la Côte de Nuits, dont une part majeure du mythique Bonnes-Mares ainsi que le célèbre Musigny Grand Cru. Ses vins incarnent la finesse, la profondeur et l'élégance les plus accomplies du Pinot Noir bourguignon.",
    sections: [
      {
        title: "Une histoire familiale exceptionnelle",
        paragraphs: [
          "Les origines du domaine remontent au XVe siècle, ce qui en fait l'une des plus anciennes propriétés viticoles de Bourgogne encore entre les mêmes mains.",
          "Au fil des générations, la famille de Vogüé a préservé un patrimoine viticole exceptionnel tout en privilégiant une recherche constante de qualité.",
        ],
      },
      {
        title: "Des terroirs parmi les plus prestigieux",
        paragraphs: [
          "Le domaine est mondialement reconnu pour Musigny Grand Cru, Bonnes-Mares Grand Cru ainsi que plusieurs remarquables Chambolle-Musigny Premier Cru et Village.",
          "Chaque climat est vinifié séparément afin de révéler avec précision la personnalité propre de son terroir.",
        ],
      },
      {
        title: "Le style Comte Georges de Vogüé",
        paragraphs: [
          "Les vins développent une palette aromatique raffinée mêlant rose, violette, cerise, framboise, épices fines, thé noir et notes minérales.",
          "La bouche impressionne par sa texture soyeuse, sa profondeur, sa fraîcheur et une longueur remarquable, sans jamais rechercher la puissance démonstrative.",
        ],
      },
      {
        title: "Une vinification au service des climats",
        paragraphs: [
          "Le domaine privilégie des interventions mesurées afin de préserver l'expression naturelle des raisins et de chaque parcelle.",
          "Cette philosophie donne naissance à des vins d'une grande pureté capables de refléter fidèlement le caractère du millésime.",
        ],
      },
      {
        title: "Des vins de très grande garde",
        paragraphs: [
          "Les grands millésimes évoluent harmonieusement pendant plusieurs décennies en gagnant progressivement en complexité.",
          "Cette aptitude exceptionnelle au vieillissement place le Domaine Comte Georges de Vogüé parmi les références absolues de la Bourgogne.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Domaine Comte Georges de Vogüé, c'est découvrir l'une des expressions les plus raffinées du Pinot Noir, où l'élégance de Chambolle-Musigny et la grandeur de Musigny et Bonnes-Mares atteignent un niveau d'excellence reconnu dans le monde entier.",
  },

  "domaine-leroy": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Domaine Leroy, l'expression absolue des grands terroirs de Bourgogne",
    introduction:
      "Le Domaine Leroy occupe une place unique dans l'univers des grands vins de Bourgogne. Sous l'impulsion de Lalou Bize-Leroy, le domaine est devenu une référence mondiale grâce à une viticulture d'une exigence exceptionnelle, des rendements très faibles et une recherche constante de l'expression la plus pure de chaque climat.",
    sections: [
      {
        title: "Une propriété devenue légendaire",
        paragraphs: [
          "L'histoire du Domaine Leroy est intimement liée aux plus grands terroirs de la Côte de Nuits et de la Côte de Beaune.",
          "La vision de Lalou Bize-Leroy a profondément marqué la Bourgogne contemporaine en privilégiant une approche fondée sur le respect absolu du vivant et du terroir.",
        ],
      },
      {
        title: "Des climats parmi les plus prestigieux",
        paragraphs: [
          "Le domaine exploite de nombreux Grands Crus et Premiers Crus, notamment Richebourg, Romanée-Saint-Vivant, Musigny, Chambertin, Clos de Vougeot, Corton-Charlemagne et plusieurs appellations emblématiques de Vosne-Romanée et Gevrey-Chambertin.",
          "Chaque parcelle est travaillée individuellement afin d'exprimer avec précision sa personnalité.",
        ],
      },
      {
        title: "Une viticulture d'exception",
        paragraphs: [
          "Le Domaine Leroy est reconnu pour son engagement pionnier en faveur de la biodynamie et pour des rendements volontairement très faibles.",
          "Cette exigence permet d'obtenir des raisins d'une concentration exceptionnelle tout en préservant l'équilibre naturel des vins.",
        ],
      },
      {
        title: "Une signature incomparable",
        paragraphs: [
          "Les vins dévoilent des arômes d'une rare complexité mêlant rose, violette, cerise, framboise, épices fines, thé noir, sous-bois et nuances minérales.",
          "La bouche impressionne par sa profondeur, sa texture soyeuse, son énergie et une longueur exceptionnelle qui évolue harmonieusement pendant plusieurs décennies.",
        ],
      },
      {
        title: "Une rareté mondiale",
        paragraphs: [
          "Les volumes produits demeurent extrêmement limités, renforçant la rareté de chaque bouteille.",
          "Cette confidentialité, associée à une qualité unanimement reconnue, place le Domaine Leroy parmi les producteurs les plus recherchés par les amateurs et collectionneurs du monde entier.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Domaine Leroy, c'est découvrir l'une des expressions les plus accomplies des grands terroirs bourguignons, où précision, émotion et profondeur atteignent un niveau d'excellence exceptionnel.",
  },

  "domaine-e-rouget": {
    eyebrow: "Histoire, terroir et identité",
    title: "Domaine E. Rouget, l'héritage de Henri Jayer",
    introduction:
      "Le Domaine E. Rouget compte parmi les propriétés les plus recherchées de Bourgogne. Installé à Flagey-Échezeaux, il perpétue l'héritage de Henri Jayer, figure légendaire de la viticulture bourguignonne. Ses vins, produits en très faibles quantités, sont réputés pour leur pureté, leur finesse et leur remarquable capacité à exprimer l'identité de chaque climat.",
    sections: [
      {
        title: "Un héritage unique",
        paragraphs: [
          "Créé par Marcel Rouget puis développé par Émile Rouget, le domaine est intimement lié à Henri Jayer, dont les méthodes de culture et de vinification ont profondément influencé la Bourgogne moderne.",
          "Aujourd'hui encore, cette philosophie privilégie la précision, le respect du terroir et la recherche permanente de l'équilibre.",
        ],
      },
      {
        title: "Des terroirs prestigieux",
        paragraphs: [
          "Le domaine exploite plusieurs appellations emblématiques de Vosne-Romanée, Flagey-Échezeaux et Échezeaux Grand Cru, ainsi que le mythique Cros Parantoux, rendu célèbre par Henri Jayer.",
          "Chaque parcelle est vinifiée séparément afin de préserver l'identité de son climat.",
        ],
      },
      {
        title: "Le style E. Rouget",
        paragraphs: [
          "Les vins développent des arômes de cerise noire, de framboise, de rose, de violette, d'épices douces, de réglisse et de sous-bois avec l'âge.",
          "La bouche associe une texture soyeuse, une remarquable profondeur et une grande fraîcheur, soutenues par des tanins d'une rare finesse.",
        ],
      },
      {
        title: "Une vinification respectueuse",
        paragraphs: [
          "Le domaine privilégie des interventions mesurées afin de préserver la pureté du fruit et l'expression naturelle du Pinot Noir.",
          "Les élevages sont conduits avec précision pour accompagner le vin sans masquer la personnalité du terroir.",
        ],
      },
      {
        title: "Une rareté très recherchée",
        paragraphs: [
          "Les faibles rendements et les petites surfaces cultivées limitent fortement les volumes disponibles.",
          "Cette rareté, associée à une qualité exceptionnelle et à un potentiel de garde remarquable, fait du Domaine E. Rouget l'une des signatures les plus recherchées de Bourgogne.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Domaine E. Rouget, c'est découvrir un Pinot Noir d'une rare élégance, héritier de la tradition de Henri Jayer et fidèle aux plus grands terroirs de la Côte de Nuits.",
  },

  "domaine-louis-jadot": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Domaine Louis Jadot, deux siècles d'excellence au cœur de la Bourgogne",
    introduction:
      "Fondée en 1859 à Beaune, la Maison Louis Jadot est l'une des signatures les plus prestigieuses de Bourgogne. À la fois propriétaire de domaines d'exception et négociant-éleveur de référence, elle élabore une collection remarquable de vins couvrant l'ensemble des grands terroirs bourguignons, des appellations régionales aux Grands Crus les plus mythiques.",
    sections: [
      {
        title: "Une maison historique",
        paragraphs: [
          "Depuis plus de 160 ans, Louis Jadot s'attache à révéler l'identité de chaque climat bourguignon avec une remarquable constance.",
          "L'acquisition progressive de prestigieux vignobles a permis à la maison de constituer un patrimoine viticole exceptionnel réparti sur la Côte de Beaune, la Côte de Nuits, Chablis et le Beaujolais.",
        ],
      },
      {
        title: "Un patrimoine unique de terroirs",
        paragraphs: [
          "Le domaine exploite de nombreux Grands Crus et Premiers Crus, parmi lesquels Bonnes-Mares, Chambertin, Clos Saint-Denis, Corton, Corton-Charlemagne, Montrachet, Chevalier-Montrachet, Musigny et bien d'autres climats emblématiques.",
          "Chaque parcelle fait l'objet d'une vinification distincte afin de préserver l'expression de son terroir.",
        ],
      },
      {
        title: "Une philosophie de précision",
        paragraphs: [
          "Louis Jadot privilégie des rendements maîtrisés, des vendanges soignées et des élevages adaptés à chaque appellation.",
          "Cette approche permet de produire des vins fidèles à leur origine, où l'équilibre prime toujours sur la démonstration de puissance.",
        ],
      },
      {
        title: "Des vins d'une grande élégance",
        paragraphs: [
          "Les Pinot Noir développent des arômes de cerise, de framboise, de rose, d'épices fines et de sous-bois, avec une texture précise et une remarquable capacité de garde.",
          "Les Chardonnay séduisent par leur pureté, leurs notes d'agrumes, de fleurs blanches, de fruits mûrs, leur minéralité et leur équilibre.",
        ],
      },
      {
        title: "Une référence mondiale",
        paragraphs: [
          "Grâce à la diversité exceptionnelle de ses terroirs et à une exigence qualitative constante, Louis Jadot figure parmi les producteurs les plus respectés de Bourgogne.",
          "Ses vins sont aujourd'hui présents dans les plus grandes caves privées et sur les plus belles tables du monde.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Domaine Louis Jadot, c'est découvrir une interprétation fidèle des grands terroirs de Bourgogne, où tradition, précision et élégance se retrouvent dans chacune des appellations produites par la maison.",
  },

  "georges-roumier": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Domaine Georges Roumier, l'une des plus grandes signatures de Chambolle-Musigny",
    introduction:
      "Le Domaine Georges Roumier figure parmi les propriétés les plus prestigieuses de Bourgogne. Fondé en 1924 à Chambolle-Musigny, il est reconnu dans le monde entier pour la finesse de ses Pinot Noir et sa capacité exceptionnelle à révéler la personnalité des plus grands climats de la Côte de Nuits.",
    sections: [
      {
        title: "Une histoire familiale d'excellence",
        paragraphs: [
          "Créé par Georges Roumier au début du XXᵉ siècle, le domaine est resté fidèle à une approche artisanale où chaque génération a poursuivi la recherche de la plus grande précision.",
          "Aujourd'hui, la famille Roumier continue de privilégier une viticulture exigeante et des vinifications respectueuses du terroir.",
        ],
      },
      {
        title: "Des terroirs parmi les plus prestigieux",
        paragraphs: [
          "Le domaine exploite notamment Bonnes-Mares Grand Cru, Musigny Grand Cru, Corton-Charlemagne, Ruchottes-Chambertin ainsi que plusieurs Premiers Crus et Villages de Chambolle-Musigny, Morey-Saint-Denis et Vosne-Romanée.",
          "Chaque climat est vinifié séparément afin de préserver son identité et ses nuances.",
        ],
      },
      {
        title: "Le style Georges Roumier",
        paragraphs: [
          "Les vins développent des arômes de cerise, de framboise, de rose, de violette, d'épices fines et de sous-bois avec l'évolution.",
          "La bouche associe profondeur, énergie, finesse tannique et remarquable fraîcheur, sans jamais rechercher la puissance démonstrative.",
        ],
      },
      {
        title: "Une philosophie de précision",
        paragraphs: [
          "Le domaine privilégie des rendements modérés, des vendanges soignées et des élevages parfaitement intégrés afin de laisser s'exprimer chaque terroir.",
          "Cette approche donne naissance à des vins d'une grande pureté capables de traverser plusieurs décennies.",
        ],
      },
      {
        title: "Une référence mondiale",
        paragraphs: [
          "La faible production et la qualité constante des grands crus du domaine expliquent leur rareté et leur forte demande auprès des amateurs et collectionneurs.",
          "Le Domaine Georges Roumier est aujourd'hui considéré comme l'une des références absolues de la Côte de Nuits.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Domaine Georges Roumier, c'est découvrir l'une des expressions les plus raffinées du Pinot Noir bourguignon, où précision, profondeur et élégance traduisent toute la noblesse des grands terroirs de Chambolle-Musigny.",
  },

  "clos-des-lambrays": {
    eyebrow: "Histoire, terroir et identité",
    title: "Domaine des Lambrays, l'âme du Clos des Lambrays Grand Cru",
    introduction:
      "Le Domaine des Lambrays est l'une des propriétés emblématiques de Morey-Saint-Denis. Autour du mythique Clos des Lambrays Grand Cru, monopole presque intégral du domaine, s'exprime une vision raffinée du Pinot Noir où profondeur, finesse et précision traduisent toute la noblesse de la Côte de Nuits.",
    sections: [
      {
        title: "Un clos chargé d'histoire",
        paragraphs: [
          "Les origines du Clos des Lambrays remontent au Moyen Âge. Au fil des siècles, ce vignoble ceint de murs est devenu l'un des Grands Crus les plus prestigieux de Bourgogne.",
          "Le domaine poursuit aujourd'hui une politique de valorisation du terroir en privilégiant des pratiques viticoles exigeantes et respectueuses.",
        ],
      },
      {
        title: "Un Grand Cru d'exception",
        paragraphs: [
          "Le Clos des Lambrays bénéficie d'une remarquable diversité de sols calcaires, marneux et argileux répartis sur le coteau.",
          "Cette mosaïque géologique apporte aux vins une complexité rare et une grande régularité qualitative.",
        ],
      },
      {
        title: "Une interprétation fidèle du Pinot Noir",
        paragraphs: [
          "Les vins développent des arômes de cerise, de framboise, de rose, de violette, d'épices fines, de thé noir et de sous-bois avec l'évolution.",
          "La bouche séduit par sa texture soyeuse, sa fraîcheur, sa profondeur et une longueur remarquable, toujours guidées par l'élégance.",
        ],
      },
      {
        title: "Une vinification de précision",
        paragraphs: [
          "Chaque intervention est pensée pour préserver la personnalité du climat et l'expression du millésime.",
          "Les élevages accompagnent le vin sans masquer la pureté du fruit ni la signature minérale du terroir.",
        ],
      },
      {
        title: "Une référence de Morey-Saint-Denis",
        paragraphs: [
          "Les grands millésimes du Clos des Lambrays évoluent harmonieusement pendant plusieurs décennies.",
          "Cette exceptionnelle capacité de garde et la rareté des bouteilles expliquent leur place privilégiée auprès des amateurs de grands vins de Bourgogne.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Domaine des Lambrays, c'est découvrir l'une des expressions les plus accomplies du Pinot Noir bourguignon, où le Clos des Lambrays révèle avec précision toute la richesse des grands terroirs de Morey-Saint-Denis.",
  },

  "clos-de-tart": {
    eyebrow: "Histoire, terroir et identité",
    title: "Clos de Tart, un Grand Cru d'exception en monopole",
    introduction:
      "Clos de Tart est l'un des plus prestigieux Grands Crus de Bourgogne. Situé à Morey-Saint-Denis, ce clos historique constitue un monopole rare, où un seul domaine cultive l'ensemble du vignoble. Cette unité exceptionnelle permet d'exprimer avec une remarquable précision toute la personnalité d'un terroir parmi les plus grands de la Côte de Nuits.",
    sections: [
      {
        title: "Un héritage séculaire",
        paragraphs: [
          "Fondé au XIIᵉ siècle par les moniales de l'abbaye de Tart, le Clos de Tart possède l'une des histoires les plus anciennes de Bourgogne.",
          "Son statut de monopole a permis de préserver au fil des siècles une identité unique et une remarquable continuité dans la conduite du vignoble.",
        ],
      },
      {
        title: "Un terroir unique",
        paragraphs: [
          "Le vignoble couvre un coteau aux sols calcaires, marneux et argileux offrant une grande diversité d'exposition et de profondeur.",
          "Cette mosaïque géologique apporte aux vins une remarquable complexité tout en conservant une forte cohérence stylistique.",
        ],
      },
      {
        title: "Une interprétation magistrale du Pinot Noir",
        paragraphs: [
          "Les vins développent des arômes de cerise noire, de framboise, de rose, de violette, d'épices fines, de thé noir et de notes minérales.",
          "La bouche associe puissance maîtrisée, finesse tannique, fraîcheur et une longueur exceptionnelle qui évolue harmonieusement pendant plusieurs décennies.",
        ],
      },
      {
        title: "Une viticulture de précision",
        paragraphs: [
          "Chaque parcelle est suivie avec une extrême attention afin de préserver l'identité du Grand Cru.",
          "Les vinifications recherchent avant tout la pureté du fruit et l'expression fidèle du climat sans masquer la personnalité du terroir.",
        ],
      },
      {
        title: "Une référence mondiale",
        paragraphs: [
          "Les faibles volumes produits et la réputation historique du Clos de Tart en font l'un des Grands Crus les plus recherchés de Bourgogne.",
          "Chaque millésime illustre la capacité exceptionnelle du domaine à conjuguer profondeur, élégance et potentiel de garde.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime du Clos de Tart, c'est découvrir un Grand Cru mythique où l'histoire, la précision du Pinot Noir et la noblesse des terroirs de Morey-Saint-Denis s'unissent dans l'une des plus grandes expressions de la Bourgogne.",
  },

  "dominio-de-pingus": {
    eyebrow: "Histoire, terroir et identité",
    title: "Dominio de Pingus, l'icône absolue de la Ribera del Duero",
    introduction:
      "Fondé par Peter Sisseck au milieu des années 1990, Dominio de Pingus est devenu l'un des vins les plus prestigieux d'Espagne. Produit en quantités extrêmement limitées à partir de vieilles vignes de Tempranillo, Pingus incarne une vision exigeante où la précision, le respect du terroir et la profondeur aromatique placent la Ribera del Duero parmi les plus grandes régions viticoles du monde.",
    sections: [
      {
        title: "La naissance d'une légende",
        paragraphs: [
          "Dès son premier millésime, Pingus s'est imposé comme l'une des plus grandes révélations du vignoble espagnol grâce à une qualité exceptionnelle et une identité immédiatement reconnaissable.",
          "Peter Sisseck poursuit depuis une philosophie fondée sur une sélection extrêmement rigoureuse des parcelles et une intervention minimale en cave.",
        ],
      },
      {
        title: "Des vieilles vignes d'exception",
        paragraphs: [
          "Le domaine travaille principalement des très vieilles vignes de Tempranillo implantées sur des sols calcaires, argileux et graveleux de la Ribera del Duero.",
          "Les faibles rendements permettent d'obtenir des raisins d'une remarquable concentration tout en conservant fraîcheur et équilibre.",
        ],
      },
      {
        title: "Une viticulture respectueuse",
        paragraphs: [
          "Dominio de Pingus privilégie depuis de nombreuses années une approche biologique et biodynamique afin de préserver la vitalité des sols.",
          "Chaque décision est prise dans le but d'exprimer avec fidélité le caractère du millésime et du terroir.",
        ],
      },
      {
        title: "Une signature unique",
        paragraphs: [
          "Les vins développent des arômes de mûre, de cerise noire, de violette, de graphite, d'épices, de cacao et de réglisse.",
          "La bouche impressionne par sa profondeur, ses tanins soyeux, sa fraîcheur naturelle et une longueur exceptionnelle qui permet aux plus grands millésimes de vieillir pendant plusieurs décennies.",
        ],
      },
      {
        title: "Pingus, Flor de Pingus et PSI",
        paragraphs: [
          "Autour de Pingus, le domaine produit également Flor de Pingus et participe au projet PSI, deux cuvées qui expriment différemment les terroirs de la Ribera del Duero.",
          "Chacune conserve la même recherche d'équilibre, de précision et de respect du vignoble qui fait la réputation internationale du domaine.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Dominio de Pingus, c'est découvrir l'une des plus grandes expressions contemporaines du Tempranillo, où rareté, profondeur et élégance placent la Ribera del Duero au sommet de la viticulture mondiale.",
  },

  "e-guigal": {
    eyebrow: "Histoire, terroir et identité",
    title: "Maison E. Guigal, l'excellence de la Vallée du Rhône",
    introduction:
      "Fondée en 1946 à Ampuis, la Maison E. Guigal est devenue l'une des références absolues de la Vallée du Rhône. Son nom est indissociable des plus grands terroirs de Côte-Rôtie, notamment La Mouline, La Turque, La Landonne et plus récemment La Reynarde. Chaque cuvée illustre une recherche constante de précision, d'élégance et de longévité.",
    sections: [
      {
        title: "Une maison familiale de renommée mondiale",
        paragraphs: [
          "Créée par Étienne Guigal puis développée par Marcel et Philippe Guigal, la maison s'est imposée parmi les producteurs les plus respectés du Rhône.",
          "Son exigence qualitative s'étend aujourd'hui de la Côte-Rôtie à Hermitage, Condrieu, Saint-Joseph, Crozes-Hermitage, Châteauneuf-du-Pape et de nombreuses autres appellations.",
        ],
      },
      {
        title: "Les mythiques « La La »",
        paragraphs: [
          "La Mouline, La Turque et La Landonne comptent parmi les vins les plus recherchés au monde. La Reynarde est venue enrichir cet ensemble exceptionnel en révélant une nouvelle facette des terroirs de Côte-Rôtie.",
          "Vinifiées séparément, ces cuvées démontrent toute la diversité des coteaux schisteux dominant le Rhône.",
        ],
      },
      {
        title: "La Syrah sublimée",
        paragraphs: [
          "Les grandes Côte-Rôtie Guigal développent des arômes de mûre, cassis, violette, olive noire, poivre, fumée, réglisse et épices, auxquels s'ajoutent avec le temps des notes de truffe, cuir fin et sous-bois.",
          "La bouche conjugue puissance, profondeur, fraîcheur et une texture d'une remarquable élégance.",
        ],
      },
      {
        title: "Un élevage emblématique",
        paragraphs: [
          "La maison est reconnue pour la maîtrise de ses élevages en fûts de chêne fabriqués dans sa propre tonnellerie.",
          "Cette approche accompagne le vin sans masquer l'identité du terroir et contribue à son extraordinaire potentiel de garde.",
        ],
      },
      {
        title: "Une référence internationale",
        paragraphs: [
          "Des cuvées accessibles jusqu'aux plus grands vins de collection, la Maison Guigal incarne l'excellence rhodanienne.",
          "La régularité qualitative et la capacité de vieillissement de ses vins en font une signature incontournable pour les amateurs de grands vins.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de la Maison E. Guigal, c'est découvrir l'une des plus grandes expressions de la Syrah et des terroirs de la Vallée du Rhône, où tradition, précision et émotion se retrouvent dans chaque bouteille.",
  },

  "m-chapoutier": {
    eyebrow: "Histoire, terroir et identité",
    title: "Maison M. Chapoutier, l'excellence des grands terroirs du Rhône",
    introduction:
      "Fondée en 1808 à Tain-l'Hermitage, la Maison M. Chapoutier est l'une des signatures majeures de la Vallée du Rhône. Reconnue pour son engagement pionnier en biodynamie et son interprétation parcellaire des plus grands terroirs, elle élabore des vins où précision, pureté et identité du lieu priment sur tout le reste.",
    sections: [
      {
        title: "Plus de deux siècles d'histoire",
        paragraphs: [
          "Depuis le début du XIXᵉ siècle, la famille Chapoutier façonne quelques-uns des plus grands vins du Rhône avec une exigence constante.",
          "Sous l'impulsion de Michel Chapoutier, la maison est devenue une référence internationale tout en restant fidèle au respect du terroir.",
        ],
      },
      {
        title: "Les plus grands terroirs du Rhône",
        paragraphs: [
          "La maison est présente sur les appellations emblématiques d'Hermitage, Côte-Rôtie, Crozes-Hermitage, Saint-Joseph, Condrieu, Cornas, Châteauneuf-du-Pape et bien d'autres.",
          "Ses célèbres cuvées parcellaires, comme Le Pavillon, L'Ermite, Le Méal ou La Mordorée, illustrent la personnalité unique de chaque climat.",
        ],
      },
      {
        title: "Une viticulture pionnière",
        paragraphs: [
          "M. Chapoutier compte parmi les premiers grands producteurs à avoir généralisé la biodynamie sur une grande partie de son vignoble.",
          "Cette approche vise à préserver la vie des sols et à transmettre avec fidélité l'identité de chaque parcelle.",
        ],
      },
      {
        title: "Des vins de caractère",
        paragraphs: [
          "Les Syrah développent des notes de mûre, cassis, violette, olive noire, poivre, graphite et épices, tandis que les grands blancs révèlent des arômes de fleurs blanches, fruits mûrs, miel, pierre chaude et agrumes.",
          "Les vins associent concentration, fraîcheur, précision et un exceptionnel potentiel de vieillissement.",
        ],
      },
      {
        title: "Une référence mondiale",
        paragraphs: [
          "La maison est également reconnue pour ses étiquettes en braille, symbole d'une volonté d'accessibilité devenue emblématique.",
          "Ses vins figurent aujourd'hui parmi les plus recherchés de la Vallée du Rhône par les amateurs et les collectionneurs.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de la Maison M. Chapoutier, c'est découvrir une interprétation authentique des plus grands terroirs rhodaniens, où précision, respect du vivant et émotion donnent naissance à des vins d'une remarquable longévité.",
  },

  "tenuta-san-guido": {
    eyebrow: "Histoire, terroir et identité",
    title: "Tenuta San Guido, le berceau du Sassicaia",
    introduction:
      "Située à Bolgheri, sur la côte toscane, Tenuta San Guido est l'un des domaines les plus prestigieux d'Italie. C'est ici qu'est né Sassicaia, vin pionnier qui a profondément transformé l'image des vins italiens dans le monde. Grâce à un terroir unique et à une vision novatrice, le domaine produit des vins où élégance, fraîcheur et longévité atteignent un niveau d'excellence exceptionnel.",
    sections: [
      {
        title: "La naissance d'un mythe",
        paragraphs: [
          "Dans les années 1940, le marquis Mario Incisa della Rocchetta implante du Cabernet Sauvignon sur les terres de Bolgheri, inspiré par les grands vins de Bordeaux.",
          "Le premier millésime commercialisé de Sassicaia marque le début d'une véritable révolution qui donnera naissance aux célèbres Super Toscans.",
        ],
      },
      {
        title: "Un terroir unique face à la mer",
        paragraphs: [
          "Le vignoble bénéficie de sols graveleux, riches en galets et en calcaire, ainsi que de l'influence tempérée de la mer Tyrrhénienne.",
          "Ces conditions favorisent une maturation lente des raisins et permettent de préserver une remarquable fraîcheur aromatique.",
        ],
      },
      {
        title: "Sassicaia, Guidalberto et Le Difese",
        paragraphs: [
          "Le domaine produit Sassicaia, référence absolue de Bolgheri, mais également Guidalberto et Le Difese, deux cuvées qui expriment différemment la personnalité du vignoble.",
          "Toutes partagent une même recherche d'équilibre, de précision et de finesse.",
        ],
      },
      {
        title: "Une signature internationale",
        paragraphs: [
          "Les vins développent des arômes de cassis, de mûre, de cèdre, de graphite, de tabac blond, d'épices et de fines notes balsamiques.",
          "La bouche associe profondeur, fraîcheur, tanins soyeux et une remarquable capacité de vieillissement qui permet aux plus grands millésimes d'évoluer pendant plusieurs décennies.",
        ],
      },
      {
        title: "L'une des plus grandes références italiennes",
        paragraphs: [
          "Tenuta San Guido est aujourd'hui considérée comme l'un des domaines les plus influents de la viticulture italienne contemporaine.",
          "La rareté de Sassicaia et la régularité qualitative du domaine expliquent son immense réputation auprès des amateurs et des collectionneurs du monde entier.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Tenuta San Guido, c'est découvrir le domaine qui a donné naissance à Sassicaia et ouvert une nouvelle page de l'histoire des grands vins italiens, où élégance, précision et longévité atteignent un niveau d'excellence reconnu dans le monde entier.",
  },

  "tenuta-dell-ornellaia": {
    eyebrow: "Histoire, terroir et identité",
    title: "Tenuta dell'Ornellaia, l'excellence contemporaine de Bolgheri",
    introduction:
      "Fondée au début des années 1980 sur les collines de Bolgheri, Tenuta dell'Ornellaia est aujourd'hui l'une des propriétés les plus prestigieuses d'Italie. Grâce à un terroir exceptionnel, à une approche parcellaire rigoureuse et à une recherche permanente d'équilibre, le domaine élabore des vins parmi les plus recherchés de la catégorie des Super Toscans.",
    sections: [
      {
        title: "Une propriété devenue une référence mondiale",
        paragraphs: [
          "Créée en 1981, Ornellaia s'est rapidement imposée parmi les plus grands domaines italiens grâce à la qualité exceptionnelle de ses premiers millésimes.",
          "Le domaine poursuit aujourd'hui une philosophie fondée sur la précision, la diversité des terroirs et l'expression fidèle de chaque récolte.",
        ],
      },
      {
        title: "Le terroir de Bolgheri",
        paragraphs: [
          "Les vignobles bénéficient de sols mêlant graves, argiles, sables et dépôts marins, tempérés par la proximité de la mer Tyrrhénienne.",
          "Cette diversité permet au Cabernet Sauvignon, au Merlot, au Cabernet Franc et au Petit Verdot d'atteindre une remarquable maturité tout en conservant fraîcheur et équilibre.",
        ],
      },
      {
        title: "Ornellaia, Masseto et Le Serre Nuove",
        paragraphs: [
          "Le domaine produit Ornellaia, grand vin emblématique de Bolgheri, ainsi que Le Serre Nuove dell'Ornellaia et Poggio alle Gazze.",
          "Le célèbre Masseto, issu d'une parcelle d'argiles bleues voisine, possède aujourd'hui son domaine autonome mais demeure intimement lié à l'histoire d'Ornellaia.",
        ],
      },
      {
        title: "Une signature d'une remarquable élégance",
        paragraphs: [
          "Les vins développent des arômes de cassis, de mûre, de cerise noire, de cèdre, de graphite, de tabac blond, de cacao et d'épices fines.",
          "La bouche associe profondeur, précision, tanins soyeux et une fraîcheur remarquable qui permet aux plus grands millésimes d'évoluer pendant plusieurs décennies.",
        ],
      },
      {
        title: "Une référence des Super Toscans",
        paragraphs: [
          "Grâce à la régularité qualitative de ses cuvées, Tenuta dell'Ornellaia figure aujourd'hui parmi les producteurs les plus respectés d'Italie.",
          "Ses vins occupent une place privilégiée dans les caves des amateurs et collectionneurs du monde entier.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime de Tenuta dell'Ornellaia, c'est découvrir l'une des plus belles expressions contemporaines de Bolgheri, où précision, élégance et profondeur font rayonner les grands vins italiens sur la scène internationale.",
  },

  "opus-one": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Opus One, l'alliance des grands savoir-faire de Napa Valley et Bordeaux",
    introduction:
      "Né de la rencontre entre le Baron Philippe de Rothschild et Robert Mondavi, Opus One est l'un des domaines les plus prestigieux des États-Unis. Situé au cœur de Napa Valley, il associe l'élégance bordelaise à la générosité californienne dans des vins d'une remarquable précision, devenus des références mondiales.",
    sections: [
      {
        title: "Une collaboration historique",
        paragraphs: [
          "Le projet voit officiellement le jour en 1979 avec l'ambition de créer un grand vin capable de rivaliser avec les plus prestigieuses références internationales.",
          "Cette vision commune a profondément marqué l'histoire moderne de la viticulture américaine.",
        ],
      },
      {
        title: "Un terroir d'exception à Oakville",
        paragraphs: [
          "Les vignobles sont implantés sur les meilleurs secteurs d'Oakville, bénéficiant de sols graveleux, argileux et alluviaux ainsi que d'un climat méditerranéen tempéré.",
          "Ces conditions permettent une maturation optimale des cépages bordelais tout en conservant fraîcheur et équilibre.",
        ],
      },
      {
        title: "Les grands cépages bordelais",
        paragraphs: [
          "Le Cabernet Sauvignon constitue l'ossature du vin, accompagné par le Merlot, le Cabernet Franc, le Petit Verdot et parfois le Malbec.",
          "Chaque parcelle est vinifiée séparément avant un assemblage recherchant avant tout l'harmonie et la précision.",
        ],
      },
      {
        title: "Une signature internationale",
        paragraphs: [
          "Les vins révèlent des arômes de cassis, mûre, cerise noire, violette, graphite, cèdre, cacao et épices fines.",
          "La bouche conjugue profondeur, fraîcheur, tanins soyeux et une remarquable capacité de vieillissement, offrant une évolution harmonieuse pendant plusieurs décennies.",
        ],
      },
      {
        title: "Une icône de Napa Valley",
        paragraphs: [
          "Grâce à une qualité constante et à des volumes volontairement maîtrisés, Opus One figure parmi les vins les plus recherchés des États-Unis.",
          "Il symbolise la rencontre réussie entre deux grandes traditions viticoles et demeure une référence incontournable pour les collectionneurs.",
        ],
      },
    ],
    conclusion:
      "Choisir un millésime d'Opus One, c'est découvrir l'une des plus grandes réussites de la viticulture contemporaine, où l'élégance inspirée de Bordeaux rencontre la richesse des terroirs de Napa Valley dans un équilibre remarquable.",
  },

  "bodegas-vega-sicilia": {
    eyebrow: "Histoire, terroir et identité",
    title:
      "Bodegas Vega Sicilia, la référence absolue des grands vins espagnols",
    introduction:
      "Dans l'univers des grands vins, peu de noms bénéficient d'une aura comparable à Vega Sicilia Único. Véritable légende de la viticulture espagnole, il représente depuis plus d'un siècle l'expression la plus prestigieuse de la Ribera del Duero. Produit en quantités limitées par les Bodegas Vega Sicilia, Único est reconnu pour son élégance, sa profondeur et son extraordinaire capacité de vieillissement. Plus qu'un simple vin, il est devenu le symbole de l'excellence espagnole et l'une des références incontournables des plus grands collectionneurs du monde.",
    sections: [
      {
        title: "Une histoire visionnaire née en 1864",
        paragraphs: [
          "L'histoire de Vega Sicilia débute en 1864, lorsque Don Eloy Lecanda y Chaves acquiert le domaine situé près de Valbuena de Duero, dans la province de Valladolid. Visionnaire, il introduit plusieurs cépages bordelais, dont le Cabernet Sauvignon et le Merlot, qu'il associe au cépage local Tempranillo, alors appelé Tinto Fino.",
          "Cette approche novatrice donne naissance à un style unique, profondément espagnol mais enrichi par l'influence des grands assemblages bordelais. Au fil des décennies, Vega Sicilia s'impose progressivement comme le domaine le plus prestigieux d'Espagne. Depuis 1982, il appartient à la famille Álvarez, qui poursuit avec exigence cette quête permanente d'excellence.",
        ],
      },
      {
        title: "Un terroir d'exception au cœur de la Ribera del Duero",
        paragraphs: [
          "Le vignoble s'étend sur plus de deux cents hectares au cœur de la Ribera del Duero, à une altitude comprise entre 700 et 900 mètres. Les sols mêlent calcaires, argiles et alluvions, offrant un excellent drainage et une remarquable diversité géologique.",
          "Le climat continental, marqué par des étés chauds, des hivers rigoureux et de fortes amplitudes thermiques entre le jour et la nuit, favorise une maturation lente des raisins. Cette combinaison permet de préserver une fraîcheur naturelle essentielle à l'équilibre du vin.",
        ],
      },
      {
        title: "Tempranillo et Cabernet Sauvignon en harmonie",
        paragraphs: [
          "L'assemblage d'Único repose principalement sur le Tempranillo, complété selon les millésimes par une faible proportion de Cabernet Sauvignon. Cette alliance confère au vin une personnalité singulière où la noblesse du cépage espagnol s'enrichit de la structure et de la longévité des grands assemblages internationaux.",
          "Les raisins proviennent exclusivement des meilleures parcelles du domaine, sélectionnées avec une extrême rigueur. Les rendements sont volontairement très faibles afin de privilégier la concentration naturelle, tandis que les vendanges manuelles sont suivies d'une sélection méticuleuse.",
        ],
      },
      {
        title: "La patience comme signature de Vega Sicilia",
        paragraphs: [
          "La philosophie de Vega Sicilia repose sur une patience devenue légendaire. L'élevage constitue l'une des signatures historiques du domaine : Único passe de nombreuses années en fûts de différentes capacités, puis poursuit son affinage en bouteille avant d'être commercialisé.",
          "Ce long vieillissement, exceptionnel dans le monde du vin, permet à Único d'atteindre une harmonie remarquable avant même sa mise sur le marché. Chaque millésime est ainsi présenté lorsqu'il a développé l'équilibre, la profondeur et la complexité recherchés par le domaine.",
        ],
      },
      {
        title: "Une complexité aromatique et une longévité extraordinaires",
        paragraphs: [
          "Dans sa jeunesse, Vega Sicilia Único dévoile des arômes de cassis, de mûre, de cerise noire et de prune mûre, accompagnés de violette, de graphite, de cèdre, de tabac blond et d'épices douces. Des nuances de cuir noble, de cacao, de café torréfié, de réglisse, de boîte à cigares et de fines herbes méditerranéennes enrichissent progressivement le bouquet.",
          "Avec le temps apparaissent des notes de truffe noire, de sous-bois, de champignons nobles, de bois précieux, de balsamique, de cuir ancien et de moka. En bouche, la matière est profonde, veloutée et parfaitement structurée, portée par des tanins d'une finesse exceptionnelle et par une tension minérale qui apporte énergie et précision.",
          "La finale, d'une longueur spectaculaire, laisse une sensation de fraîcheur, de profondeur et d'harmonie. Les meilleurs millésimes possèdent un potentiel de garde extraordinaire : cinquante ans, parfois davantage, ne suffisent pas à épuiser leur capacité d'évolution.",
        ],
      },
    ],
    conclusion:
      "Aujourd'hui, Vega Sicilia Único demeure la référence absolue des grands vins espagnols. Héritier d'une histoire de plus de cent cinquante ans, élaboré avec une exigence rarement égalée et élevé selon une tradition unique, il incarne l'excellence de la Ribera del Duero. Plus qu'une cuvée emblématique, Único est devenu un monument du patrimoine viticole mondial, démontrant que les plus grands vins naissent de la rencontre entre un terroir exceptionnel, le temps et une quête permanente de perfection.",
  },

  "domaine-jacques-selosse": {
    eyebrow: "Histoire, terroir et identité",
    title: "Domaine Jacques Selosse, une vision singulière du champagne",
    introduction:
      "Installé à Avize, au cœur de la Côte des Blancs, le Domaine Jacques Selosse occupe une place unique dans l’univers du champagne. Sous l’impulsion d’Anselme Selosse, la maison a profondément renouvelé la lecture du terroir champenois en privilégiant une approche parcellaire, des rendements maîtrisés, des vinifications ambitieuses et une recherche constante de l’expression du lieu.",
    sections: [
      {
        title: "Une vision révolutionnaire du champagne",
        paragraphs: [
          "Depuis les années 1980, Anselme Selosse défend une conception du champagne inspirée des grands vins de terroir. Chaque parcelle est travaillée comme une entité propre, avec une attention particulière portée à la vie des sols, à la maturité des raisins et à l’identité de chaque cru.",
          "Cette philosophie a contribué à faire évoluer la perception du champagne, non plus seulement comme un vin d’assemblage et de marque, mais comme l’expression précise d’un vignoble, d’un sol et d’un climat.",
        ],
      },
      {
        title: "Avize et les grands terroirs de la Côte des Blancs",
        paragraphs: [
          "Le domaine est historiquement implanté à Avize et exploite également des parcelles remarquables à Cramant, Oger, Le Mesnil-sur-Oger, Aÿ, Ambonnay et Mareuil-sur-Aÿ.",
          "Le Chardonnay occupe une place centrale dans l’identité du domaine, mais le Pinot Noir intervient également dans plusieurs cuvées parcellaires. Chaque terroir est vinifié de manière à préserver sa personnalité, sa tension et sa profondeur.",
        ],
      },
      {
        title: "Une vinification libre et exigeante",
        paragraphs: [
          "Les vins sont majoritairement vinifiés en fûts, souvent avec des fermentations spontanées et des élevages prolongés. Les interventions sont limitées afin de laisser le vin évoluer naturellement et révéler toute la complexité du raisin.",
          "Les dosages sont généralement faibles et les vins se distinguent par leur matière, leur vinosité, leur énergie et leur remarquable persistance.",
        ],
      },
      {
        title: "Des cuvées devenues mythiques",
        paragraphs: [
          "Substance, Initial, Version Originale, Millésime, Exquise et la collection des Lieux-Dits figurent parmi les cuvées les plus recherchées de Champagne.",
          "Chacune possède une identité forte, mais toutes partagent une profondeur exceptionnelle, une texture ample, une grande intensité aromatique et une capacité rare à évoluer avec le temps.",
        ],
      },
      {
        title: "Une référence mondiale",
        paragraphs: [
          "Jacques Selosse est aujourd’hui considéré comme l’un des domaines les plus influents de Champagne. Sa production confidentielle et la forte demande internationale ont fait de ses bouteilles des références recherchées par les collectionneurs et les amateurs de grands vins.",
          "Au-delà de leur rareté, les champagnes Selosse séduisent par leur singularité, leur précision et leur aptitude à exprimer le terroir avec une profondeur inhabituelle.",
        ],
      },
    ],
    conclusion:
      "Aujourd’hui, le Domaine Jacques Selosse incarne une vision profondément personnelle et exigeante du champagne. Par son travail parcellaire, ses vinifications ambitieuses et sa volonté de traduire fidèlement chaque terroir, il a contribué à redéfinir les standards de la région. Plus que de simples champagnes, les vins de Jacques Selosse sont devenus de véritables vins de lieu, recherchés pour leur intensité, leur complexité et leur caractère unique.",
  },

  "maison-roederer": {
    eyebrow: "Histoire, terroir et identité",
    title: "Maison Louis Roederer, l’élégance et la précision champenoises",
    introduction:
      "Fondée à Reims au XVIIIe siècle, la Maison Louis Roederer figure parmi les grandes signatures historiques de la Champagne. Restée indépendante et familiale, elle a construit son identité autour d’un vaste patrimoine viticole, d’une maîtrise exigeante des assemblages et d’une recherche constante d’équilibre entre maturité, fraîcheur et profondeur.",
    sections: [
      {
        title: "Une maison historique et indépendante",
        paragraphs: [
          "L’histoire de Louis Roederer s’inscrit dans la longue tradition des grandes maisons rémoises. Son développement repose sur une vision singulière : renforcer progressivement la maîtrise de l’approvisionnement en raisins afin de préserver un style régulier et une véritable identité de terroir.",
          "Cette indépendance permet à la maison de conduire ses choix viticoles et œnologiques dans la durée, avec une attention particulière portée à la précision des vins et à leur capacité de vieillissement.",
        ],
      },
      {
        title: "Un patrimoine viticole exceptionnel",
        paragraphs: [
          "Louis Roederer s’appuie sur un important vignoble réparti entre la Montagne de Reims, la Vallée de la Marne et la Côte des Blancs. Cette diversité de crus offre une palette complète de Pinot Noir, de Chardonnay et de Meunier.",
          "La maison accorde une place essentielle au travail des sols, à la maturité des raisins et à l’expression de chaque parcelle. Cette approche donne naissance à des vins à la fois structurés, lumineux et profondément liés à leur origine.",
        ],
      },
      {
        title: "Cristal, une cuvée devenue emblématique",
        paragraphs: [
          "Créée au XIXe siècle, Cristal est devenue l’une des cuvées de prestige les plus célèbres au monde. Élaborée uniquement dans les années jugées dignes de son style, elle recherche un équilibre entre finesse, intensité, pureté et longévité.",
          "Cristal Rosé prolonge cette ambition avec une expression plus rare encore, associant profondeur du Pinot Noir, précision du Chardonnay et texture raffinée.",
        ],
      },
      {
        title: "Un style fondé sur l’équilibre",
        paragraphs: [
          "Les champagnes Louis Roederer se distinguent par leur netteté aromatique, leur fraîcheur structurante et leur texture délicate. Les élevages prolongés permettent au vin de gagner en complexité sans perdre son énergie.",
          "Dans les grandes cuvées, la maturité du fruit s’accompagne de notes d’agrumes, de fleurs blanches, de fruits secs, de craie et de brioche fine, portées par une finale précise et persistante.",
        ],
      },
      {
        title: "Une référence internationale",
        paragraphs: [
          "Louis Roederer occupe aujourd’hui une place majeure parmi les maisons de Champagne. Son indépendance, son patrimoine de vignes et la régularité de ses cuvées lui permettent de conjuguer tradition, innovation et fidélité à son style.",
          "Des cuvées d’assemblage aux expressions millésimées, la maison propose une lecture cohérente de la Champagne, fondée sur l’élégance, la profondeur et la capacité de garde.",
        ],
      },
    ],
    conclusion:
      "Aujourd’hui, la Maison Louis Roederer incarne une vision exigeante et patrimoniale du champagne. Par la maîtrise de son vignoble, la précision de ses assemblages et l’identité de cuvées devenues emblématiques comme Cristal, elle demeure l’une des références majeures de la région et du monde des grands vins.",
  },

  "maison-salon": {
    eyebrow: "Histoire, terroir et identité",
    title: "Maison Salon, l’expression absolue du Mesnil-sur-Oger",
    introduction:
      "Installée au Mesnil-sur-Oger, au cœur de la Côte des Blancs, la Maison Salon occupe une place à part dans l’univers du champagne. Sa philosophie repose sur une idée d’une radicale simplicité : élaborer un seul champagne, issu d’un seul cépage, d’un seul cru et d’un seul millésime, uniquement lorsque l’année atteint le niveau d’exigence recherché.",
    sections: [
      {
        title: "Une maison née d’une vision singulière",
        paragraphs: [
          "Salon est née de la volonté de créer un champagne d’une pureté extrême, entièrement consacré au Chardonnay du Mesnil-sur-Oger. Dès l’origine, la maison s’est éloignée des usages traditionnels de l’assemblage pour défendre une interprétation strictement millésimée et parcellaire.",
          "Cette conception sans compromis a façonné l’identité de la maison : aucune cuvée non millésimée, aucun second vin et une production réservée aux seules années capables d’exprimer pleinement le caractère du terroir.",
        ],
      },
      {
        title: "Le Mesnil-sur-Oger, cœur du style Salon",
        paragraphs: [
          "Le Mesnil-sur-Oger est l’un des grands crus les plus réputés de la Côte des Blancs. Ses sols crayeux et son exposition favorisent des Chardonnays d’une grande droiture, marqués par la tension, la finesse et une minéralité persistante.",
          "Salon puise son identité dans cette combinaison entre profondeur de la craie, fraîcheur naturelle et maturité lente. Le vin se montre souvent réservé dans sa jeunesse avant de gagner progressivement en ampleur et en complexité.",
        ],
      },
      {
        title: "Une élaboration fondée sur le temps",
        paragraphs: [
          "Chaque millésime de Salon bénéficie d’un élevage prolongé en cave avant sa commercialisation. Cette patience permet au vin de développer une texture plus large, une grande précision aromatique et une remarquable cohésion.",
          "La maison privilégie une expression pure du Chardonnay, sans recherche d’effet immédiat. Le temps devient ainsi un élément essentiel de la construction du vin et de son identité.",
        ],
      },
      {
        title: "Un champagne rare et recherché",
        paragraphs: [
          "Salon n’est produit que lors d’un nombre limité de millésimes. Cette sélection sévère, associée à une production confidentielle, en fait l’un des champagnes les plus rares et les plus recherchés au monde.",
          "Les bouteilles les plus anciennes sont particulièrement appréciées pour leur capacité à conjuguer fraîcheur, profondeur et complexité, avec des évolutions aromatiques pouvant s’étendre sur plusieurs décennies.",
        ],
      },
      {
        title: "Une signature de pureté et de longévité",
        paragraphs: [
          "Dans sa jeunesse, Salon révèle souvent des notes d’agrumes, de fleurs blanches, de craie et de fruits à chair blanche. Avec l’âge apparaissent des nuances de noisette, de brioche, de cire, de miel fin et d’épices douces.",
          "La bouche se distingue par sa tension, sa verticalité et sa longueur. L’ensemble reste porté par une fraîcheur remarquable qui confère au vin une capacité de garde exceptionnelle.",
        ],
      },
    ],
    conclusion:
      "Aujourd’hui, la Maison Salon demeure l’une des expressions les plus pures et les plus exclusives du Chardonnay champenois. Par son attachement au Mesnil-sur-Oger, son refus du compromis et sa confiance absolue dans le temps, elle a créé un champagne devenu mythique, recherché pour sa rareté, sa précision et son extraordinaire potentiel d’évolution.",
  },

  "domaine-du-comte-liger-belair": {
    eyebrow: "Histoire, terroir et identité",
    title: "Domaine du Comte Liger-Belair, l’excellence de Vosne-Romanée",
    introduction:
      "Installé à Vosne-Romanée, le Domaine du Comte Liger-Belair figure parmi les propriétés les plus confidentielles et les plus recherchées de Bourgogne. Héritier d’une longue histoire familiale, il s’est imposé par une viticulture de précision, des élevages mesurés et une lecture particulièrement raffinée des grands terroirs de la Côte de Nuits.",
    sections: [
      {
        title: "Une histoire familiale profondément liée à Vosne-Romanée",
        paragraphs: [
          "La famille Liger-Belair est établie à Vosne-Romanée depuis le début du XIXe siècle. Son patrimoine viticole s’est constitué autour de parcelles prestigieuses, dont plusieurs comptent aujourd’hui parmi les terroirs les plus emblématiques de la commune.",
          "Après une période durant laquelle une partie des vignes était exploitée en métayage, Louis-Michel Liger-Belair a entrepris de reconstituer progressivement le domaine et de reprendre directement la conduite des parcelles et la vinification des vins.",
        ],
      },
      {
        title: "La Romanée, monopole emblématique",
        paragraphs: [
          "Au sommet du domaine se trouve La Romanée, grand cru monopole situé au-dessus de Romanée-Conti. Cette parcelle minuscule produit des vins d’une rare intensité, associant profondeur, finesse aromatique et remarquable persistance.",
          "La Romanée incarne avec éclat la philosophie du domaine : préserver l’identité du lieu, rechercher l’équilibre plutôt que la puissance et laisser le terroir s’exprimer avec la plus grande précision possible.",
        ],
      },
      {
        title: "Un patrimoine de climats remarquables",
        paragraphs: [
          "Le domaine exploite également plusieurs appellations prestigieuses de Vosne-Romanée et des communes voisines, parmi lesquelles Echezeaux, Clos de Vougeot, Vosne-Romanée Premier Cru Aux Reignots, Les Petits Monts et La Colombière.",
          "Chaque cuvée est pensée comme une interprétation distincte de son climat. Les différences de sol, d’altitude et d’exposition se traduisent par des profils allant de la délicatesse florale à une structure plus profonde et épicée.",
        ],
      },
      {
        title: "Une viticulture précise et attentive",
        paragraphs: [
          "Le travail à la vigne vise à favoriser l’équilibre naturel des sols et de la plante. Les interventions sont adaptées à chaque parcelle afin d’obtenir des raisins mûrs, sains et capables de traduire fidèlement leur origine.",
          "Les rendements demeurent maîtrisés et les vendanges sont réalisées avec un soin particulier. Cette exigence constitue le fondement de vins à la fois concentrés, lumineux et profondément liés à leur terroir.",
        ],
      },
      {
        title: "Un style fondé sur la finesse et l’énergie",
        paragraphs: [
          "Les vins du Domaine du Comte Liger-Belair se distinguent par leur texture soyeuse, leur précision aromatique et leur équilibre. Le fruit mûr s’accompagne fréquemment de notes florales, d’épices fines et d’une minéralité persistante.",
          "Les élevages sont conduits de manière à soutenir le vin sans masquer son identité. Avec le temps, les grandes cuvées gagnent en profondeur et en complexité tout en conservant une remarquable fraîcheur.",
        ],
      },
    ],
    conclusion:
      "Aujourd’hui, le Domaine du Comte Liger-Belair s’impose comme l’une des signatures majeures de Vosne-Romanée. Par la qualité exceptionnelle de son patrimoine, la précision de son travail et l’élégance de ses vins, il offre une interprétation parmi les plus recherchées des grands terroirs bourguignons.",
  },

  "domaine-francois-raveneau": {
    eyebrow: "Histoire, terroir et identité",
    title: "Domaine François Raveneau, la précision magistrale de Chablis",
    introduction:
      "Le Domaine François Raveneau appartient au cercle très restreint des signatures les plus emblématiques de Chablis. Sa réputation repose sur un patrimoine de parcelles exceptionnel, une production confidentielle et une interprétation d’une rare précision des terroirs kimméridgiens. Les vins du domaine associent tension, profondeur et complexité, tout en conservant cette pureté minérale qui constitue l’une des expressions les plus accomplies du Chardonnay à Chablis.",
    sections: [
      {
        title: "Une référence historique de Chablis",
        paragraphs: [
          "Fondé au milieu du XXe siècle, le Domaine François Raveneau s’est progressivement imposé comme l’une des références absolues de Chablis. Son développement est resté volontairement mesuré, avec une attention constante portée à la qualité des parcelles, à la précision du travail et à la fidélité au caractère de chaque climat.",
          "Aujourd’hui, le domaine demeure familial et conserve une production limitée. Cette rareté, associée à une remarquable régularité, explique l’intérêt constant que ses bouteilles suscitent auprès des amateurs et des collectionneurs du monde entier.",
        ],
      },
      {
        title: "Les grands terroirs du vignoble chablisien",
        paragraphs: [
          "Le domaine exploite un ensemble prestigieux de Premiers Crus et de Grands Crus, parmi lesquels Butteaux, Montée de Tonnerre, Forêt, Vaillons, Les Clos, Blanchot et Valmur. Chaque parcelle possède une identité propre, déterminée par son exposition, la profondeur de son sol et sa position dans le vignoble.",
          "Le sous-sol kimméridgien, composé de marnes calcaires riches en fossiles marins, constitue la colonne vertébrale du style chablisien. Il apporte aux vins leur tension, leur fraîcheur saline et cette impression minérale persistante qui se révèle pleinement avec le temps.",
        ],
      },
      {
        title: "Une vinification patiente et mesurée",
        paragraphs: [
          "Au Domaine François Raveneau, la vinification cherche avant tout à préserver l’identité du raisin et du terroir. Les fermentations sont conduites avec patience, et l’élevage associe traditionnellement cuves et fûts anciens afin d’accompagner le vin sans imposer une marque boisée dominante.",
          "Cette approche donne naissance à des vins souvent réservés dans leur jeunesse. Leur équilibre se construit lentement, laissant apparaître progressivement la profondeur, la texture et la complexité propres à chaque climat.",
        ],
      },
      {
        title: "Un style fondé sur la tension et la profondeur",
        paragraphs: [
          "Les vins du domaine se distinguent par une alliance rare entre énergie, densité et finesse. Les arômes d’agrumes, de fleurs blanches, de pierre humide et de coquille d’huître s’inscrivent dans une bouche précise, portée par une acidité vive et une matière profondément structurée.",
          "Avec l’évolution en bouteille, cette austérité initiale laisse place à une palette plus complexe où apparaissent des notes de miel fin, de cire, de fruits secs, d’épices douces et de sous-bois. La fraîcheur demeure cependant toujours présente et prolonge la finale avec une remarquable persistance.",
        ],
      },
      {
        title: "Des Chablis construits pour le temps",
        paragraphs: [
          "Les grandes cuvées du Domaine François Raveneau possèdent un potentiel de garde exceptionnel. Les Premiers Crus peuvent évoluer pendant de longues années, tandis que les Grands Crus atteignent souvent leur pleine expression après une maturation prolongée en bouteille.",
          "Cette capacité à traverser les décennies sans perdre leur énergie place les vins du domaine parmi les plus grandes expressions de Chardonnay au monde. Chaque millésime révèle une interprétation différente du terroir, mais conserve la précision et la profondeur qui signent l’identité Raveneau.",
        ],
      },
    ],
    conclusion:
      "Choisir un Chablis du Domaine François Raveneau, c’est découvrir une expression d’une rare pureté du Chardonnay et du terroir kimméridgien. La tension, la profondeur et la longévité de ses vins en font l’une des références majeures de Bourgogne et une signature incontournable pour les amateurs de grands vins blancs.",
  },


  "coche-dury": {
    eyebrow: "Histoire, terroir et identité",
    title: "Domaine Coche-Dury, la précision légendaire de Meursault",
    introduction:
      "Le Domaine Coche-Dury appartient au cercle le plus restreint des grandes signatures de Bourgogne. Installé à Meursault, il est devenu une référence mondiale grâce à des vins blancs d’une profondeur, d’une tension et d’une précision exceptionnelles. Sa production confidentielle, son exigence constante et sa capacité à révéler l’identité de chaque terroir expliquent la place singulière qu’il occupe auprès des amateurs et des collectionneurs.",
    sections: [
      {
        title: "Une histoire familiale profondément liée à Meursault",
        paragraphs: [
          "Le domaine trouve ses racines au début du XXe siècle et s’est développé progressivement autour d’un patrimoine de parcelles situées principalement à Meursault et dans les communes voisines. Sous l’impulsion de Jean-François Coche, puis de son fils Raphaël Coche, il a acquis une renommée internationale sans jamais renoncer à une dimension familiale et artisanale.",
          "Cette continuité a permis de préserver une connaissance intime de chaque vigne. Le travail repose sur l’observation, la précision et une recherche permanente d’équilibre, loin de toute standardisation du style.",
        ],
      },
      {
        title: "Un patrimoine exceptionnel de terroirs bourguignons",
        paragraphs: [
          "Le Domaine Coche-Dury exploite des parcelles dans plusieurs appellations prestigieuses de la Côte de Beaune, parmi lesquelles Meursault, Puligny-Montrachet, Auxey-Duresses, Monthelie et Corton-Charlemagne Grand Cru. Ce patrimoine permet au domaine d’exprimer des nuances très différentes du Chardonnay et, dans une moindre mesure, du Pinot Noir.",
          "Chaque climat conserve une personnalité distincte. Les terroirs de Meursault apportent ampleur, profondeur et texture, tandis que Puligny-Montrachet affirme davantage de droiture et de finesse. Corton-Charlemagne réunit quant à lui puissance, tension minérale et remarquable aptitude au vieillissement.",
        ],
      },
      {
        title: "Une viticulture exigeante et des rendements maîtrisés",
        paragraphs: [
          "Le travail à la vigne constitue le fondement du style Coche-Dury. Les sols sont entretenus avec soin, les rendements demeurent volontairement limités et les vendanges sont réalisées avec une sélection rigoureuse afin de récolter des raisins sains et parfaitement mûrs.",
          "Cette exigence vise moins la concentration que l’équilibre. Les raisins doivent posséder à la fois maturité, fraîcheur et intensité aromatique afin de permettre au terroir de s’exprimer pleinement au cours de la vinification et de l’élevage.",
        ],
      },
      {
        title: "Une vinification précise au service du terroir",
        paragraphs: [
          "Les fermentations sont conduites avec patience et les élevages en fûts accompagnent le vin sans jamais chercher à masquer son origine. Le bois participe à la texture et à la complexité, mais demeure intégré à une matière toujours portée par la fraîcheur et l’énergie.",
          "Le domaine est également reconnu pour la maîtrise de la réduction, qui peut apporter dans la jeunesse des notes fumées, grillées ou de pierre à fusil. Avec l’aération et le temps, ces nuances se fondent dans une palette plus large où apparaissent agrumes, fleurs blanches, fruits secs, épices fines et minéralité saline.",
        ],
      },
      {
        title: "Le style Coche-Dury : profondeur, tension et longévité",
        paragraphs: [
          "Les vins blancs du domaine se distinguent par une alliance remarquable entre richesse de texture et précision minérale. La matière peut être ample, parfois presque crémeuse, mais elle reste toujours soutenue par une tension qui donne au vin son équilibre et sa longueur.",
          "Avec le vieillissement, les grandes cuvées développent des notes de noisette fraîche, d’amande grillée, de cire, d’agrumes confits et d’épices, tout en conservant une énergie remarquable. Cette capacité à évoluer harmonieusement pendant plusieurs décennies place Coche-Dury parmi les plus grandes références mondiales du Chardonnay.",
        ],
      },
      {
        title: "Des cuvées devenues emblématiques",
        paragraphs: [
          "Le Meursault Village constitue déjà une expression majeure du style du domaine, recherchée pour sa profondeur et sa précision. Les cuvées parcellaires, parmi lesquelles Meursault Les Rougeots, Meursault Perrières et Puligny-Montrachet Les Enseignères, offrent des lectures encore plus précises de leurs terroirs respectifs.",
          "Au sommet de la gamme, Corton-Charlemagne Grand Cru figure parmi les vins blancs les plus rares et les plus recherchés de Bourgogne. Sa puissance, sa tension et sa capacité de garde en font une cuvée de référence pour les collectionneurs du monde entier.",
        ],
      },
      {
        title: "L’avis The Wine Watchers",
        paragraphs: [
          "Nous sélectionnons les vins du Domaine Coche-Dury pour leur capacité exceptionnelle à exprimer la noblesse des grands terroirs bourguignons avec une précision et une profondeur rarement égalées. Chaque cuvée témoigne d’une maîtrise remarquable, où la richesse naturelle du Chardonnay demeure toujours équilibrée par une tension minérale exemplaire.",
          "Plus qu’une icône recherchée par les collectionneurs, Coche-Dury représente selon nous l’une des expressions les plus accomplies des grands vins blancs de Bourgogne. Ses vins conjuguent intensité, finesse, énergie et émotion, tout en possédant une capacité de vieillissement qui les place parmi les références absolues du vignoble bourguignon.",
        ],
      },
    ],
    conclusion:
      "Choisir un vin du Domaine Coche-Dury, c’est découvrir une interprétation d’une rare précision des grands terroirs de la Côte de Beaune. Derrière leur extrême rareté se trouvent des vins profonds, lumineux et construits pour le temps, devenus des références incontournables pour les amateurs de grands Chardonnay de Bourgogne.",
  },

  faiveley: {
    eyebrow: "Histoire, terroir et identité",
    title: "Domaine Faiveley, deux siècles d’excellence en Bourgogne",
    introduction:
      "Fondé en 1825 à Nuits-Saint-Georges, le Domaine Faiveley figure parmi les maisons historiques les plus prestigieuses de Bourgogne. Resté entre les mains de la même famille depuis sept générations, le domaine s’est imposé comme l’un des plus importants propriétaires de Grands Crus de la Côte de Nuits, de la Côte de Beaune et de la Côte Chalonnaise. Son identité repose sur un patrimoine viticole exceptionnel, une connaissance précise des terroirs et une recherche constante d’équilibre entre tradition et précision contemporaine.",
    sections: [
      {
        title: "Une histoire familiale commencée en 1825",
        paragraphs: [
          "Le Domaine Faiveley fut fondé à Nuits-Saint-Georges par Pierre Faiveley au début du XIXᵉ siècle. Depuis cette date, sept générations se sont succédé à la tête de la propriété, assurant une continuité familiale rare dans le vignoble bourguignon.",
          "Cette longue histoire a permis au domaine de constituer progressivement un patrimoine viticole remarquable. Chaque génération a contribué à développer la propriété, à affiner le travail parcellaire et à renforcer la réputation de Faiveley parmi les grandes signatures de Bourgogne.",
        ],
      },
      {
        title: "Un patrimoine viticole exceptionnel",
        paragraphs: [
          "Le domaine possède des parcelles dans certaines des appellations les plus prestigieuses de Bourgogne. Son vignoble s’étend de la Côte de Nuits à la Côte de Beaune, ainsi qu’en Côte Chalonnaise, avec une proportion importante de Premiers Crus et de Grands Crus.",
          "Parmi ses cuvées les plus emblématiques figurent le Chambertin-Clos de Bèze, le Musigny Grand Cru, le Clos de Vougeot, les Mazis-Chambertin, les Latricières-Chambertin, le Corton-Charlemagne et le Bâtard-Montrachet. Le domaine est également propriétaire du Corton Clos des Cortons Faiveley, monopole historique devenu l’un des symboles de la maison.",
        ],
      },
      {
        title: "Une nouvelle génération tournée vers la précision",
        paragraphs: [
          "Sous la direction d’Erwan Faiveley, rejoint par sa sœur Eve Faiveley, le domaine a engagé une profonde évolution qualitative. Les investissements réalisés dans les vignes et dans les chais ont permis d’affiner les vinifications et les élevages tout en préservant l’identité de chaque climat.",
          "Cette recherche de précision s’accompagne d’une attention croissante portée aux sols, à la biodiversité et à l’équilibre naturel des parcelles. L’objectif n’est pas d’imposer un style uniforme, mais de laisser chaque terroir exprimer sa personnalité avec le plus de fidélité possible.",
        ],
      },
      {
        title: "Des rouges profonds et des blancs lumineux",
        paragraphs: [
          "Les vins rouges du Domaine Faiveley associent aujourd’hui pureté du fruit, profondeur et finesse tannique. Les grands terroirs de la Côte de Nuits donnent naissance à des vins structurés, précis et capables d’un long vieillissement, sans jamais sacrifier l’élégance.",
          "Les vins blancs se distinguent par leur tension, leur éclat et leur profondeur minérale. Du Corton-Charlemagne aux grands terroirs de Puligny-Montrachet, ils expriment avec précision la richesse des sols calcaires et la fraîcheur naturelle des meilleurs climats bourguignons.",
        ],
      },
      {
        title: "L’avis The Wine Watchers",
        paragraphs: [
          "Nous sélectionnons les vins du Domaine Faiveley pour leur remarquable équilibre entre tradition bourguignonne et précision contemporaine. Chaque cuvée traduit avec fidélité l’identité de son terroir, qu’il s’agisse d’un Grand Cru mythique comme le Chambertin-Clos de Bèze, du prestigieux Musigny, de l’emblématique Corton Clos des Cortons Faiveley ou encore du minéral Corton-Charlemagne.",
          "Ce sont des vins de caractère, d’une grande régularité, capables de séduire dans leur jeunesse tout en possédant un remarquable potentiel de garde. Leur précision, leur profondeur et leur fidélité aux climats de Bourgogne placent naturellement le Domaine Faiveley parmi les références majeures de notre sélection.",
        ],
      },
    ],
    conclusion:
      "Choisir un vin du Domaine Faiveley, c’est découvrir l’une des expressions les plus complètes de la Bourgogne. Derrière la diversité exceptionnelle des appellations se trouve une même exigence : révéler chaque terroir avec précision, équilibre et profondeur.",
  },

};

PRODUCER_EDITORIAL_LIBRARY["francois-raveneau"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-francois-raveneau"];

PRODUCER_EDITORIAL_LIBRARY["raveneau"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-francois-raveneau"];

PRODUCER_EDITORIAL_LIBRARY["domaine-comte-liger-belair"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-du-comte-liger-belair"];

PRODUCER_EDITORIAL_LIBRARY["comte-liger-belair"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-du-comte-liger-belair"];

PRODUCER_EDITORIAL_LIBRARY["liger-belair"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-du-comte-liger-belair"];

PRODUCER_EDITORIAL_LIBRARY["louis-michel-liger-belair"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-du-comte-liger-belair"];

PRODUCER_EDITORIAL_LIBRARY["louis-roederer"] =
  PRODUCER_EDITORIAL_LIBRARY["maison-roederer"];

PRODUCER_EDITORIAL_LIBRARY["champagne-louis-roederer"] =
  PRODUCER_EDITORIAL_LIBRARY["maison-roederer"];

PRODUCER_EDITORIAL_LIBRARY["maison-louis-roederer"] =
  PRODUCER_EDITORIAL_LIBRARY["maison-roederer"];

PRODUCER_EDITORIAL_LIBRARY["roederer"] =
  PRODUCER_EDITORIAL_LIBRARY["maison-roederer"];

PRODUCER_EDITORIAL_LIBRARY["salon"] =
  PRODUCER_EDITORIAL_LIBRARY["maison-salon"];

PRODUCER_EDITORIAL_LIBRARY["champagne-salon"] =
  PRODUCER_EDITORIAL_LIBRARY["maison-salon"];

PRODUCER_EDITORIAL_LIBRARY["maison-champagne-salon"] =
  PRODUCER_EDITORIAL_LIBRARY["maison-salon"];

PRODUCER_EDITORIAL_LIBRARY["vega-sicilia"] =
  PRODUCER_EDITORIAL_LIBRARY["bodegas-vega-sicilia"];

PRODUCER_EDITORIAL_LIBRARY["vega-sicilia-unico"] =
  PRODUCER_EDITORIAL_LIBRARY["bodegas-vega-sicilia"];

PRODUCER_EDITORIAL_LIBRARY["bodegas-vega-sicilia-unico"] =
  PRODUCER_EDITORIAL_LIBRARY["bodegas-vega-sicilia"];

PRODUCER_EDITORIAL_LIBRARY["domaine-georges-roumier"] =
  PRODUCER_EDITORIAL_LIBRARY["georges-roumier"];

PRODUCER_EDITORIAL_LIBRARY["domaine-armand-rousseau"] =
  PRODUCER_EDITORIAL_LIBRARY["armand-rousseau"];

PRODUCER_EDITORIAL_LIBRARY["louis-jadot"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-louis-jadot"];

PRODUCER_EDITORIAL_LIBRARY["maison-louis-jadot"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-louis-jadot"];

PRODUCER_EDITORIAL_LIBRARY["comte-georges-de-vogue"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-comte-georges-de-vogue"];

PRODUCER_EDITORIAL_LIBRARY["domaine-comte-georges-de-vogue"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-comte-georges-de-vogue"];

PRODUCER_EDITORIAL_LIBRARY["trapet-pere-et-fils"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-trapet-pere-et-fils"];

PRODUCER_EDITORIAL_LIBRARY["domaine-trapet"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-trapet-pere-et-fils"];

PRODUCER_EDITORIAL_LIBRARY["trapet"] =
  PRODUCER_EDITORIAL_LIBRARY["domaine-trapet-pere-et-fils"];

PRODUCER_EDITORIAL_LIBRARY["chapoutier"] =
  PRODUCER_EDITORIAL_LIBRARY["m-chapoutier"];

PRODUCER_EDITORIAL_LIBRARY["domaine-chapoutier"] =
  PRODUCER_EDITORIAL_LIBRARY["m-chapoutier"];

PRODUCER_EDITORIAL_LIBRARY["maison-chapoutier"] =
  PRODUCER_EDITORIAL_LIBRARY["m-chapoutier"];

PRODUCER_EDITORIAL_LIBRARY["guigal"] = PRODUCER_EDITORIAL_LIBRARY["e-guigal"];

PRODUCER_EDITORIAL_LIBRARY["domaine-guigal"] =
  PRODUCER_EDITORIAL_LIBRARY["e-guigal"];

PRODUCER_EDITORIAL_LIBRARY["maison-guigal"] =
  PRODUCER_EDITORIAL_LIBRARY["e-guigal"];

PRODUCER_EDITORIAL_LIBRARY["dominio-pingus"] =
  PRODUCER_EDITORIAL_LIBRARY["dominio-de-pingus"];

PRODUCER_EDITORIAL_LIBRARY["pingus"] =
  PRODUCER_EDITORIAL_LIBRARY["dominio-de-pingus"];

PRODUCER_EDITORIAL_LIBRARY["opus-one-winery"] =
  PRODUCER_EDITORIAL_LIBRARY["opus-one"];

PRODUCER_EDITORIAL_LIBRARY["domaine-opus-one"] =
  PRODUCER_EDITORIAL_LIBRARY["opus-one"];

PRODUCER_EDITORIAL_LIBRARY["dominio-de-pingus-peter-sisseck"] =
  PRODUCER_EDITORIAL_LIBRARY["dominio-de-pingus"];

PRODUCER_EDITORIAL_LIBRARY["peter-sisseck-dominio-de-pingus"] =
  PRODUCER_EDITORIAL_LIBRARY["dominio-de-pingus"];

PRODUCER_EDITORIAL_LIBRARY["peter-sisseck"] =
  PRODUCER_EDITORIAL_LIBRARY["dominio-de-pingus"];

PRODUCER_EDITORIAL_LIBRARY["pingus-dominio-de-pingus"] =
  PRODUCER_EDITORIAL_LIBRARY["dominio-de-pingus"];

PRODUCER_EDITORIAL_LIBRARY["opus-one-napa-valley"] =
  PRODUCER_EDITORIAL_LIBRARY["opus-one"];

PRODUCER_EDITORIAL_LIBRARY["opus-one-napa"] =
  PRODUCER_EDITORIAL_LIBRARY["opus-one"];

PRODUCER_EDITORIAL_LIBRARY["opus-one-californie"] =
  PRODUCER_EDITORIAL_LIBRARY["opus-one"];

PRODUCER_EDITORIAL_LIBRARY["opus-one-california"] =
  PRODUCER_EDITORIAL_LIBRARY["opus-one"];

PRODUCER_EDITORIAL_LIBRARY["robert-mondavi-opus-one"] =
  PRODUCER_EDITORIAL_LIBRARY["opus-one"];

PRODUCER_EDITORIAL_LIBRARY["baron-philippe-de-rothschild-opus-one"] =
  PRODUCER_EDITORIAL_LIBRARY["opus-one"];


PRODUCER_EDITORIAL_LIBRARY["domaine-coche-dury"] =
  PRODUCER_EDITORIAL_LIBRARY["coche-dury"];

PRODUCER_EDITORIAL_LIBRARY["domaine-jean-francois-coche-dury"] =
  PRODUCER_EDITORIAL_LIBRARY["coche-dury"];

function normalizeProducerKey(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProducerEditorialContent(
  slug: string,
  producer?: string | null,
): ProducerEditorialContent | undefined {
  const normalizedSlug = normalizeProducerKey(slug);
  const normalizedProducer = normalizeProducerKey(producer || "");
  const searchableValue = `${normalizedSlug} ${normalizedProducer}`.trim();

  const exactContent =
    PRODUCER_EDITORIAL_LIBRARY[normalizedSlug] ||
    PRODUCER_EDITORIAL_LIBRARY[normalizedProducer];

  if (exactContent) {
    return exactContent;
  }

  for (const [libraryKey, content] of Object.entries(
    PRODUCER_EDITORIAL_LIBRARY,
  )) {
    if (
      normalizedSlug.includes(libraryKey) ||
      libraryKey.includes(normalizedSlug) ||
      normalizedProducer.includes(libraryKey) ||
      libraryKey.includes(normalizedProducer)
    ) {
      return content;
    }
  }

  if (
    searchableValue.includes("raveneau") ||
    searchableValue.includes("francois-raveneau") ||
    searchableValue.includes("domaine-francois-raveneau")
  ) {
    return PRODUCER_EDITORIAL_LIBRARY["domaine-francois-raveneau"];
  }

  if (
    searchableValue.includes("opus-one") ||
    (searchableValue.includes("opus") && searchableValue.includes("one"))
  ) {
    return PRODUCER_EDITORIAL_LIBRARY["opus-one"];
  }

  if (
    searchableValue.includes("vega-sicilia") ||
    searchableValue.includes("vega-sicilia-unico") ||
    (searchableValue.includes("vega") && searchableValue.includes("sicilia"))
  ) {
    return PRODUCER_EDITORIAL_LIBRARY["bodegas-vega-sicilia"];
  }

  if (
    searchableValue.includes("pingus") ||
    searchableValue.includes("peter-sisseck") ||
    searchableValue.includes("flor-de-pingus") ||
    searchableValue === "psi" ||
    searchableValue.includes("dominio")
  ) {
    return PRODUCER_EDITORIAL_LIBRARY["dominio-de-pingus"];
  }

  return undefined;
}