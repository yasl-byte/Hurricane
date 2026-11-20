# Hurricane Younes

Application (PWA) de sèche pour boxeur : muscu Full body / Push / Pull / Legs avec échauffement et cardio, jours de boxe au club, assiette en 3 repas, prières (Bruxelles et Charleroi), compléments avec rappel, statistiques et thèmes personnalisables.

## Mise en ligne sur GitHub Pages
1. Créer un dépôt (par exemple `hurricane-younes`) et y déposer **tout le contenu de ce dossier** à la racine.
2. Dans le dépôt : Settings → Pages → Source : `Deploy from a branch`, branche `main`, dossier `/ (root)`.
3. Ouvrir `https://<utilisateur>.github.io/hurricane-younes/` dans Chrome sur le téléphone, puis menu ⋮ → « Ajouter à l'écran d'accueil ».

## Fichiers
- `index.html` : structure de la page
- `style.css` : thèmes et mise en page
- `data.js` : programme, aliments, faits de boxe, versets et hadiths (modifiable facilement)
- `app.js` : logique de l'application
- `sw.js` : fonctionnement hors connexion (réseau d'abord : les mises à jour arrivent tout de suite)
- `celebration.webp` : animation de fin de séance et de prières complètes
- `bebas-neue.woff2`, `oswald-600.woff2` : polices (licence SIL Open Font License, voir `LICENSE-polices-OFL.txt`)

Les données restent sur le téléphone (stockage local du navigateur) : utiliser Réglages → Données → Exporter régulièrement.
