/* Hurricane Younes — données de base (programme, aliments, faits de boxe, versets) */
'use strict';
const YT = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
const GG = q => 'https://www.google.com/search?q=' + encodeURIComponent(q);

const WARM_BASE = [
  "Cercles de bras et rotations d'épaules (1 min)",
  "Rotations de hanches, genoux et chevilles (1 min)",
  "Shadow boxing léger, épaules relâchées (2 min)"
];

const PROGRAM = {
  FB: { name: 'Full body', icon: '⚡', focus: 'Force globale et transfert vers la boxe',
    warm: [...WARM_BASE, "Squats au poids du corps + fentes alternées (×10)", "Séries d'approche du 1er exercice : 50 % puis 75 % de la charge"],
    ex: [
      { id: 'fb1', n: 'Soulevé de terre trap bar (ou classique)', sets: 3, min: 5, max: 6, u: 'reps', side: '', why: "Apprend à pousser fort dans le sol : c'est de là que part la puissance d'un coup.", yt: 'soulevé de terre trap bar technique' },
      { id: 'fb2', n: 'Développé couché haltères', sets: 3, min: 8, max: 10, u: 'reps', side: '', why: "Force de poussée et stabilité des épaules, utile au corps à corps.", yt: 'développé couché haltères technique' },
      { id: 'fb3', n: 'Tractions (ou tirage vertical)', sets: 3, min: 6, max: 10, u: 'reps', side: '', why: "Dos large et épaules équilibrées : ramener le poing vite en garde.", yt: 'traction pronation technique débutant' },
      { id: 'fb4', n: 'Landmine press unilatéral', sets: 3, min: 8, max: 10, u: 'reps', side: 'par bras', why: "Mime le direct : poussée du sol, rotation de la hanche, extension du bras.", yt: 'landmine press unilatéral technique' },
      { id: 'fb5', n: 'Fentes marchées haltères', sets: 2, min: 10, max: 12, u: 'reps', side: 'par jambe', why: "Appuis, équilibre et déplacements, comme sur le ring.", yt: 'fentes marchées haltères technique' },
      { id: 'fb6', n: 'Pallof press', sets: 2, min: 10, max: 12, u: 'reps', side: 'par côté', why: "Gainage anti-rotation : le tronc transmet la force du bas vers le poing sans fuir.", yt: 'pallof press technique' }
    ] },
  PUSH: { name: 'Push', icon: '👊', focus: 'Pectoraux · épaules · triceps : la poussée des directs',
    warm: [...WARM_BASE, "Pompes lentes (×10) + rotations externes à l'élastique (×15)", "Séries d'approche du développé couché : 50 % puis 75 %"],
    ex: [
      { id: 'pu1', n: 'Pompes explosives', sets: 3, min: 5, max: 6, u: 'reps', side: '', why: "Vitesse de frappe : produire de la force très vite. En premier, quand tu es frais.", yt: 'pompes explosives pliométriques technique' },
      { id: 'pu2', n: 'Développé couché barre', sets: 3, min: 6, max: 8, u: 'reps', side: '', why: "Force de base de la poussée : la fondation de tes directs.", yt: 'développé couché barre technique' },
      { id: 'pu3', n: 'Développé militaire debout', sets: 3, min: 6, max: 8, u: 'reps', side: '', why: "Épaules solides et endurantes pour tenir la garde haute en fin de round.", yt: 'développé militaire debout barre technique' },
      { id: 'pu4', n: 'Développé incliné haltères', sets: 3, min: 8, max: 10, u: 'reps', side: '', why: "Haut des pectoraux : complète la poussée et dessine le buste.", yt: 'développé incliné haltères technique' },
      { id: 'pu5', n: 'Élévations latérales', sets: 3, min: 12, max: 15, u: 'reps', side: '', why: "Deltoïdes endurants : les bras ne tombent pas au dernier round.", yt: 'élévations latérales haltères technique' },
      { id: 'pu6', n: 'Extension triceps à la poulie', sets: 2, min: 10, max: 12, u: 'reps', side: '', why: "Les triceps verrouillent le bras en fin de direct.", yt: 'extension triceps poulie haute technique' }
    ] },
  PULL: { name: 'Pull', icon: '🪝', focus: 'Dos · biceps · grip : retour en garde et clinch',
    warm: [...WARM_BASE, "Suspension à la barre 20 s + tirages à l'élastique (×15)", "Séries d'approche des tractions ou du tirage"],
    ex: [
      { id: 'pl1', n: 'Tractions lestées (ou tirage vertical)', sets: 3, min: 6, max: 8, u: 'reps', side: '', why: "Grand dorsal puissant : il participe aux crochets et ramène le poing en garde.", yt: 'traction lestée technique' },
      { id: 'pl2', n: 'Rowing barre', sets: 3, min: 8, max: 10, u: 'reps', side: '', why: "Dos épais qui protège la colonne et équilibre un boxeur qui pousse sans arrêt.", yt: 'rowing barre technique' },
      { id: 'pl3', n: 'Rowing haltère unilatéral', sets: 3, min: 8, max: 10, u: 'reps', side: 'par bras', why: "Un côté à la fois, comme en boxe : corrige les déséquilibres gauche/droite.", yt: 'rowing haltère unilatéral technique' },
      { id: 'pl4', n: 'Face pull', sets: 3, min: 12, max: 15, u: 'reps', side: '', why: "Santé des épaules : compense la posture enroulée de la garde.", yt: 'face pull poulie technique' },
      { id: 'pl5', n: 'Curl marteau', sets: 2, min: 10, max: 12, u: 'reps', side: '', why: "Avant-bras et brachial : un poignet solide à l'impact.", yt: 'curl marteau technique' },
      { id: 'pl6', n: 'Farmer walk (marche du fermier)', sets: 3, min: 30, max: 40, u: 'sec', side: '', why: "Grip et gainage : utile au clinch et pour rester solide debout.", yt: 'farmer walk technique' }
    ] },
  LEGS: { name: 'Legs', icon: '🦵', focus: 'Jambes · fessiers : appuis, explosivité, puissance de frappe',
    warm: [...WARM_BASE, "Squats au poids du corps (×15) + ponts fessiers (×15)", "Quelques sauts sur place, puis séries d'approche du squat"],
    ex: [
      { id: 'lg1', n: 'Box jumps', sets: 3, min: 5, max: 5, u: 'reps', side: '', why: "Explosivité : départs rapides et entrées dans la distance. En premier, quand tu es frais.", yt: 'box jump technique réception' },
      { id: 'lg2', n: 'Squat barre', sets: 3, min: 6, max: 8, u: 'reps', side: '', why: "Force des jambes : la base de la puissance de frappe et de l'endurance des appuis.", yt: 'squat barre technique' },
      { id: 'lg3', n: 'Soulevé de terre roumain', sets: 3, min: 8, max: 10, u: 'reps', side: '', why: "Ischios et fessiers : la chaîne postérieure qui fait tourner la hanche.", yt: 'soulevé de terre roumain technique' },
      { id: 'lg4', n: 'Fentes bulgares', sets: 2, min: 8, max: 10, u: 'reps', side: 'par jambe', why: "Stabilité sur une jambe : pivots et changements d'appui.", yt: 'fentes bulgares technique' },
      { id: 'lg5', n: 'Hip thrust', sets: 3, min: 8, max: 10, u: 'reps', side: '', why: "Fessiers puissants : le moteur du crochet et de l'uppercut.", yt: 'hip thrust barre technique' },
      { id: 'lg6', n: 'Mollets debout', sets: 3, min: 12, max: 15, u: 'reps', side: '', why: "Mollets endurants pour sautiller, pivoter et sauter à la corde.", yt: 'extension mollets debout technique' }
    ] }
};

const CARDIO_BEFORE = "15 min en zone 2 (vélo, rameur ou corde à sauter) : tu dois pouvoir parler.";
const CARDIO_AFTER = "15 min tranquilles (marche inclinée ou vélo) : respiration calme, la récupération commence.";

const FOODS = [
  ['Blanc de poulet cuit', 165, 31, 0, 3.6, 150], ['Dinde (escalope) cuite', 135, 29, 0, 1.7, 150], ['Bœuf haché 5 % cru', 125, 21, 0, 5, 125], ['Saumon', 208, 20, 0, 13, 125],
  ['Thon au naturel égoutté', 116, 26, 0, 1, 100], ['Crevettes cuites', 99, 24, 0.2, 0.3, 150], ['Œuf entier', 143, 12.6, 0.7, 9.5, 60], ["Blanc d'œuf", 52, 11, 0.7, 0.2, 100],
  ['Skyr nature', 63, 11, 4, 0.2, 150], ['Fromage blanc 0 %', 47, 8, 4, 0.2, 200], ['Cottage cheese', 98, 11, 3.4, 4.3, 200], ['Lait demi-écrémé', 46, 3.3, 4.8, 1.6, 250],
  ['Whey (dose)', 380, 78, 6, 5, 30], ['Jambon de dinde', 105, 20, 1.5, 2, 60], ['Mozzarella light', 165, 19, 1, 9, 60],
  ['Riz blanc cuit', 130, 2.7, 28, 0.3, 200], ['Pâtes cuites', 157, 5.8, 30.6, 0.9, 200], ['Couscous cuit', 112, 3.8, 23, 0.2, 200], ['Pomme de terre cuite', 86, 1.9, 20, 0.1, 250],
  ['Patate douce cuite', 90, 2, 20.7, 0.2, 200], ["Flocons d'avoine", 372, 13.5, 58.7, 7, 60], ['Pain complet', 247, 13, 41, 3.4, 60], ['Pain blanc (baguette)', 270, 9, 55, 1.5, 80],
  ['Tortilla de blé', 300, 8, 50, 7, 60], ['Galette de riz', 387, 8, 81, 3, 10], ['Lentilles cuites', 116, 9, 20, 0.4, 200], ['Pois chiches cuits', 164, 8.9, 27, 2.6, 150],
  ['Banane', 89, 1.1, 22.8, 0.3, 120], ['Pomme', 52, 0.3, 13.8, 0.2, 150], ['Fruits rouges', 45, 1, 8, 0.3, 150], ['Dattes', 282, 2.5, 75, 0.4, 30],
  ['Brocoli cuit', 35, 2.4, 7, 0.4, 200], ['Haricots verts', 31, 1.8, 7, 0.1, 200], ['Salade / crudités', 20, 1.3, 3, 0.2, 150],
  ["Huile d'olive", 884, 0, 0, 100, 10], ['Beurre de cacahuète', 588, 25, 20, 50, 15], ['Amandes', 579, 21, 22, 50, 25], ['Avocat', 160, 2, 8.5, 14.7, 80],
  ['Chocolat noir 70 %', 598, 7.8, 46, 43, 20], ['Miel', 304, 0.3, 82, 0, 15], ['Thé à la menthe sucré (100 ml)', 40, 0, 10, 0, 200]
].map(f => ({ n: f[0], k: f[1], p: f[2], g: f[3], l: f[4], po: f[5] }));

/* « Le saviez-vous ? » des jours de boxe : [texte, recherche Google pour aller plus loin] */
const BOX_FACTS = [
  ["Muhammad Ali a révolutionné la boxe poids lourds grâce à une mobilité exceptionnelle, des mains souvent basses et un jeu de jambes proche de la danse, résumé par sa formule « voler comme un papillon, piquer comme une abeille ».", 'style de boxe Muhammad Ali'],
  ["Améliorer son allonge, ce n'est pas avoir des bras plus longs : pivote le pied arrière, fais tourner la hanche et l'épaule, et garde le menton derrière l'épaule. Le direct gagne plusieurs centimètres sans que la tête avance.", 'comment améliorer son allonge en boxe'],
  ["Les règles du marquis de Queensberry, publiées en 1867, ont imposé les gants, les rounds de 3 minutes, la minute de repos et le compte jusqu'à 10 : la base de la boxe moderne.", 'règles du marquis de Queensberry boxe'],
  ["Mike Tyson est devenu champion du monde poids lourds à 20 ans, en 1986, le plus jeune de l'histoire. Son style « peek-a-boo », appris auprès de Cus D'Amato, reposait sur des gants collés aux joues et un mouvement de tête permanent.", 'peek-a-boo Mike Tyson Cus D\'Amato'],
  ["Floyd Mayweather Jr. a pris sa retraite invaincu (50-0) en utilisant le « shoulder roll » : l'épaule avant relevée protège le menton et fait glisser les coups adverses.", 'shoulder roll Mayweather technique'],
  ["Vasyl Lomachenko a pris des cours de danse traditionnelle ukrainienne enfant, sur l'idée de son père, pour développer son jeu de jambes. Résultat : des angles que peu de boxeurs savent prendre.", 'Lomachenko jeu de jambes danse'],
  ["Manny Pacquiao est le seul boxeur à avoir été champion du monde dans huit catégories de poids différentes.", 'Manny Pacquiao huit catégories'],
  ["Le jab est le coup le plus important de la boxe : il mesure la distance, ouvre la garde et prépare tout le reste. Les grands boxeurs le travaillent tous les jours.", 'travailler son jab boxe exercices'],
  ["Rocky Marciano est le seul champion du monde poids lourds à s'être retiré invaincu, avec 49 victoires en 49 combats.", 'Rocky Marciano 49-0'],
  ["Joe Louis a conservé le titre mondial des poids lourds près de 12 ans, de 1937 à 1949, avec 25 défenses victorieuses : un record dans la catégorie.", 'Joe Louis record défenses titre'],
  ["En 1974 à Kinshasa, Ali a battu George Foreman en le laissant frapper dans les cordes jusqu'à l'épuisement : le fameux « rope-a-dope », avant un KO au 8e round.", 'Rumble in the Jungle rope-a-dope'],
  ["En 1971, au Madison Square Garden, Joe Frazier a infligé à Ali sa première défaite professionnelle, aux points, lors du « combat du siècle ».", 'combat du siècle Ali Frazier 1971'],
  ["En 1994, George Foreman est redevenu champion du monde poids lourds à 45 ans en battant Michael Moorer par KO : un record de longévité.", 'George Foreman champion 45 ans'],
  ["Bernard Hopkins a remporté un titre mondial à 48 ans, en 2013, prouvant qu'une hygiène de vie irréprochable prolonge une carrière.", 'Bernard Hopkins hygiène de vie longévité'],
  ["Evander Holyfield est le seul boxeur sacré quatre fois champion du monde des poids lourds.", 'Evander Holyfield quatre fois champion'],
  ["Oleksandr Usyk a unifié les titres des lourds-légers, puis ceux des poids lourds en 2024 en battant Tyson Fury : un petit gabarit qui gagne par le jeu de jambes et le volume.", 'Oleksandr Usyk style de boxe'],
  ["Canelo Álvarez a été le premier champion incontesté des super-moyens, en 2021. Sa défense repose sur un mouvement de tête très économe.", 'Canelo défense mouvement de tête'],
  ["Le Marocain Mohammed Rabii a été champion du monde amateur en 2015 et médaillé de bronze aux Jeux de Rio en 2016, chez les welters.", 'Mohammed Rabii boxe'],
  ["« Prince » Naseem Hamed, Britannique d'origine yéménite, a marqué les années 90 par une garde basse, des entrées acrobatiques et une puissance rare pour un poids plume.", 'Naseem Hamed style'],
  ["La boxe est olympique depuis 1904, sauf en 1912 à Stockholm. La boxe féminine n'y est entrée qu'en 2012, à Londres.", 'histoire de la boxe aux Jeux olympiques'],
  ["Sugar Ray Robinson est souvent cité comme le meilleur boxeur de tous les temps « livre pour livre » : vitesse, puissance et enchaînements des deux mains.", 'Sugar Ray Robinson meilleur boxeur'],
  ["Expire à chaque coup (le petit « tss ») : cela gaine les abdominaux, protège en cas de contre et évite de bloquer sa respiration en plein échange.", 'respiration boxe expirer en frappant'],
  ["Contre un gaucher, garde ton pied avant à l'extérieur du sien : tu ouvres la ligne de ton direct arrière et tu fermes la sienne.", 'boxer contre un gaucher conseils'],
  ["Le crochet ne vient pas du bras mais de la rotation de la hanche et du pivot du pied avant : le bras reste verrouillé à environ 90°.", 'technique du crochet boxe hanche'],
  ["La corde à sauter développe le rythme, les appuis légers et l'endurance des mollets : elle reste au programme des champions depuis plus d'un siècle.", 'corde à sauter boxe exercices'],
  ["Le shadow boxing devant un miroir permet de corriger sa garde : menton baissé, coude collé au corps, poing qui revient toujours au visage.", 'shadow boxing conseils débutant'],
  ["Le sac de frappe rapide (« speed bag ») améliore le rythme, la coordination œil-main et l'endurance des épaules.", 'speed bag technique débutant'],
  ["Chez les amateurs, les combats masculins se disputent en 3 rounds de 3 minutes : intensité maximale, pas le temps de se chercher.", 'règles boxe amateur nombre de rounds'],
  ["Garder le menton baissé et les yeux sur le torse de l'adversaire : on voit mieux venir les coups qu'en fixant les gants.", 'où regarder en boxe'],
  ["Le « 1-2 » (jab puis direct arrière) reste l'enchaînement le plus utilisé au monde : simple, rapide et efficace.", 'enchaînement 1-2 boxe technique']
];

/* Verset ou hadith du jour : sens rendu en français (traduction libre) + référence */
const VERSES = [
  { t: "Le croyant fort est meilleur et plus aimé d'Allah que le croyant faible, et il y a du bien en chacun d'eux. Attache-toi à ce qui t'est utile, demande l'aide d'Allah et ne baisse pas les bras.", r: 'Hadith rapporté par Muslim (n° 2664)' },
  { t: "Ton corps a un droit sur toi.", r: 'Hadith rapporté par al-Bukhari (n° 1975)' },
  { t: "Le fort n'est pas celui qui terrasse les autres à la lutte ; le fort est celui qui se maîtrise lorsqu'il est en colère.", r: 'Hadith rapporté par al-Bukhari (n° 6114) et Muslim (n° 2609)' },
  { t: "Ô enfants d'Adam, parez-vous à chaque lieu de prière ; mangez et buvez, mais sans excès, car Il n'aime pas ceux qui commettent des excès.", r: "Coran, sourate al-A'raf (7), verset 31" },
  { t: "Allah n'impose à aucune âme une charge supérieure à sa capacité.", r: 'Coran, sourate al-Baqara (2), verset 286' },
  { t: "Certes, avec la difficulté vient une facilité. Oui, avec la difficulté vient une facilité.", r: 'Coran, sourate ash-Sharh (94), versets 5 et 6' },
  { t: "Allah ne change pas l'état d'un peuple tant que ceux-ci ne changent pas ce qui est en eux-mêmes.", r: "Coran, sourate ar-Ra'd (13), verset 11" },
  { t: "Ô vous qui croyez, cherchez secours dans l'endurance et la prière. Allah est avec ceux qui endurent.", r: 'Coran, sourate al-Baqara (2), verset 153' },
  { t: "Ô vous qui croyez, soyez endurants, rivalisez d'endurance et restez fermes.", r: "Coran, sourate Âl 'Imran (3), verset 200" },
  { t: "Allah veut vous alléger la tâche, car l'homme a été créé faible.", r: "Coran, sourate an-Nisa' (4), verset 28" },
  { t: "Ô gens, mangez de ce qui est licite et bon sur la terre.", r: 'Coran, sourate al-Baqara (2), verset 168' },
  { t: "Mangez des bonnes choses que Nous vous avons accordées, et ne dépassez pas les limites.", r: 'Coran, sourate Ta-Ha (20), verset 81' },
  { t: "L'homme n'obtient que le fruit de ses efforts.", r: 'Coran, sourate an-Najm (53), verset 39' },
  { t: "Nous avons certes créé l'homme dans la forme la plus parfaite.", r: 'Coran, sourate at-Tin (95), verset 4' },
  { t: "Le meilleur à engager est celui qui est fort et digne de confiance.", r: 'Coran, sourate al-Qasas (28), verset 26' },
  { t: "Ne vous jetez pas de vos propres mains dans la perdition, et faites le bien : Allah aime ceux qui font le bien.", r: 'Coran, sourate al-Baqara (2), verset 195' },
  { t: "Le fils d'Adam ne remplit pas de récipient pire que son ventre. Quelques bouchées suffisent à lui tenir le dos droit ; s'il doit manger davantage, alors un tiers pour la nourriture, un tiers pour la boisson et un tiers pour le souffle.", r: "Hadith rapporté par at-Tirmidhi (n° 2380)" },
  { t: "Il est deux bienfaits dont beaucoup de gens ne profitent pas : la santé et le temps libre.", r: 'Hadith rapporté par al-Bukhari (n° 6412)' },
  { t: "Les œuvres les plus aimées d'Allah sont les plus régulières, même si elles sont modestes.", r: 'Hadith rapporté par al-Bukhari (n° 6464) et Muslim (n° 783)' },
  { t: "Profite de cinq choses avant cinq autres : ta jeunesse avant ta vieillesse, ta santé avant ta maladie, ta richesse avant ta pauvreté, ton temps libre avant tes occupations, et ta vie avant ta mort.", r: 'Hadith rapporté par al-Hakim' },
  { t: "Celui d'entre vous qui se réveille en sécurité chez lui, en bonne santé, et qui possède sa nourriture du jour, c'est comme si le monde entier lui avait été donné.", r: "Hadith rapporté par at-Tirmidhi (n° 2346)" },
  { t: "Attache ton chameau, puis place ta confiance en Allah.", r: "Hadith rapporté par at-Tirmidhi (n° 2517)" },
  { t: "Cette religion est facile, et nul ne s'y montre excessif sans être dépassé. Visez la justesse, rapprochez-vous-en et réjouissez-vous.", r: 'Hadith rapporté par al-Bukhari (n° 39)' },
  { t: "Le Prophète ﷺ fit une course à pied avec Aïcha : elle gagna la première, et lui la seconde, des années plus tard.", r: "Hadith rapporté par Abu Dawud (n° 2578)" },
  { t: "Allah aime que, lorsque l'un de vous accomplit une tâche, il la fasse avec excellence.", r: 'Hadith rapporté par al-Bayhaqi' },
  { t: "Combien de fois une petite troupe en a vaincu une grande, avec la permission d'Allah. Allah est avec ceux qui endurent.", r: 'Coran, sourate al-Baqara (2), verset 249' }
];

const FIT_FACTS = [
  "En sèche, la musculation est le signal n°1 qui dit au corps de garder ses muscles. La boxe brûle, la fonte protège.",
  "Ton poids peut varier de 1 à 2 kg d'un jour à l'autre (eau, sel, glycogène) : seule la moyenne sur 7 jours compte.",
  "Tenir tes charges pendant la sèche est le meilleur indicateur que le muscle tient.",
  "La créatine se prend tous les jours, même les jours de repos : c'est la régularité qui sature les muscles, pas l'heure.",
  "Dormir 7 à 9 h est l'un des meilleurs « compléments » pour garder ses muscles en déficit.",
  "Répartir les protéines en 3 à 5 prises dans la journée aide la synthèse musculaire.",
  "Les courbatures ne mesurent pas l'efficacité d'une séance. La progression des charges, si.",
  "Le cardio en zone 2 (où tu peux encore parler) brûle des calories sans voler la récupération de la muscu et de la boxe."
];

const PRAYERS = [
  { k: 'fajr', n: 'Fajr', a: 'الفجر' }, { k: 'dhuhr', n: 'Dhohr', a: 'الظهر' }, { k: 'asr', n: 'Asr', a: 'العصر' },
  { k: 'maghrib', n: 'Maghreb', a: 'المغرب' }, { k: 'isha', n: 'Icha', a: 'العشاء' }
];
const CITIES = { bxl: { n: 'Bruxelles', lat: 50.8503, lng: 4.3517 }, cha: { n: 'Charleroi', lat: 50.4108, lng: 4.4446 } };
const PT_METHODS = {
  MWL: { n: 'Ligue islamique mondiale (18° / 17°)', fajr: 18, isha: 17 },
  MAROC: { n: 'Maroc, ministère des Habous (19° / 17°)', fajr: 19, isha: 17 },
  UOIF: { n: 'UOIF / Musulmans de France (12° / 12°)', fajr: 12, isha: 12 },
  ISNA: { n: 'ISNA, Amérique du Nord (15° / 15°)', fajr: 15, isha: 15 },
  EGYPT: { n: 'Égypte (19,5° / 17,5°)', fajr: 19.5, isha: 17.5 }
};

const LEVELS = [[0, 'Recrue'], [150, 'Sparring-partner'], [400, 'Amateur'], [800, 'Espoir'], [1300, 'Prétendant'], [2000, 'Challenger'], [3000, 'Champion'], [4500, 'Champion unifié'], [6500, 'Légende']];

const THEMES = {
  auto: 'Auto (suit le téléphone)', ring: 'Ring de nuit', champion: "Ceinture d'or", clair: 'Vestiaire clair',
  vintage: 'Affiche vintage', bleu: 'Coin bleu', rouge: 'Coin rouge'
};
const HOME_BLOCKS = {
  jour: 'Programme du jour', boxe: 'Jour de boxe', priere: 'Prières', forme: 'Jauge de forme', assiette: 'Assiette',
  supps: 'Compléments', verset: 'Verset du jour', todo: 'Au programme', niveau: 'Niveau et points'
};
