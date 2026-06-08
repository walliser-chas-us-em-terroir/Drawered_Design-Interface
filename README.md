# DRAWERED

Application web de dessin simple, construite en **HTML / CSS / JavaScript vanilla**
(sans framework ni étape de build).

> État actuel : application fonctionnelle **habillée selon le design Figma** — boutons
> parallélogrammes, typographie dédiée et **3 thèmes de couleur** (Light / Dark / Sexy).

## 🔗 Démo en ligne

**https://walliser-chas-us-em-terroir.github.io/Drawered_Design-Interface/**

(page d'accueil → bouton **START** → l'application de dessin)

## Fonctionnalités

- **Pinceau** (un seul style) — clic sur le bouton : un **slider d'épaisseur s'ouvre à sa droite**.
- **Gomme** — même principe, avec sa propre épaisseur.
- **Palette de 5 couleurs** — une seule couleur sélectionnée à la fois, s'ouvre à droite du bouton.
- **Annuler / Rétablir** (undo / redo).
- **Tout effacer** en un seul clic.
- **Exporter** le plan de travail en **PNG** (grille + dessin).
- **Zoom de 50 % à 200 %** (boutons − / + et libellé en bas à gauche).
- **Plan de travail plein écran** avec une **grille en points** (teintée selon le thème).
- Bouton **Info** (bas droite) ouvrant une fenêtre modale.
- **3 thèmes** (Light / Dark / Sexy) via un sélecteur en haut ; choix mémorisé (`localStorage`).

## Design

Habillage tiré du fichier Figma (`instructions-2.md`) :

- **Boutons parallélogrammes** (inclinés) avec états et icônes SVG, déclinés selon le thème.
- **Polices** : `Elliot Swonger` (logo, `elliot_swonger.TTF`) + `Maven Pro` (Google Fonts).
- **Tokens couleur** : variables CSS `--g1…--g4`, `--bg`, `--fg` pilotées par `[data-theme]`.

## Structure du projet

```
.
├── index.html          Page d'accueil (lien START vers l'app)
├── app.html            Interface de l'application de dessin
├── app.js              Logique : canvas, outils, zoom, undo/redo, export, thèmes
├── style.css           Design system : tokens 3 thèmes, boutons, typographie
├── elliot_swonger.TTF  Police du logo
├── package.json        Déclare Playwright (utilisé pour les captures d'archive)
├── links/              Maquettes, assets (dont links/assets/_icon SVG) et images
├── archive/            Archive des prompts (voir ci-dessous)
└── old_version/        Ancienne version — ignorée, conservée pour référence
```

## Utilisation en local

Aucune dépendance n'est nécessaire pour utiliser l'application : ouvrir `index.html`
dans un navigateur. Pour servir le projet localement :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/
```

## Archive des prompts

Chaque requête faite à l'assistant est archivée dans `archive/`, dans un sous-dossier
`prompt-X_aammjjhhmmss` contenant le prompt, le résultat produit et une **capture d'écran**
de l'interface. Détails et convention de nommage : [`archive/README.md`](archive/README.md).

Générer une capture (Playwright + Chrome) :

```bash
npm install            # installe Playwright (devDependency)
node archive/capture.mjs app.html archive/prompt-X_aammjjhhmmss/capture.png
```

## Déploiement

Hébergé via **GitHub Pages** (branche `main`, racine du dépôt). Chaque `push` sur `main`
reconstruit automatiquement le site.
