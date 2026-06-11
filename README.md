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
- **Palette de 5 couleurs** (pinceau) — une seule couleur à la fois, s'ouvre à gauche du bouton.
- **Annuler / Rétablir** (undo / redo).
- **Tout effacer** en un seul clic.
- **Exporter** le plan de travail en **PNG** (grille + dessin).
- **Plan de travail fixe plein écran** avec une **grille en points** (teintée selon le thème) —
  pas de zoom, le canva ne bouge pas.
- Lien **Info** (bas droite) vers la **page d'information** dédiée (`info.html`).
- **Couleur de l'interface** : 3 thèmes (Light / Dark / Sexy) choisis sur la **page Info**,
  mémorisés (`localStorage`) et appliqués partout (accueil, app, info).

## Design

Habillage tiré du fichier Figma (`instructions-2.md` / `instructions-3.md`) :

- **Boutons parallélogrammes** (inclinés) **plats** — un fond, un svg, un bord, avec états
  normal / hover / clicked (sans ombre ni highlight), déclinés selon le thème.
- **Coin cassé** (clip-path) sur les box d'images de l'accueil (coin bas-gauche, avec effet
  hover) et sur le bloc de la page Info (coin bas-droite, comme les cards Figma).
- **Polices** : `Elliot Swonger` (logo, `elliot_swonger.TTF`) + `Maven Pro` (Google Fonts).
- **Tokens couleur** : variables CSS `--g1…--g4`, `--bg`, `--fg` pilotées par `[data-theme]`.

## Structure du projet

```
.
├── index.html          Page d'accueil (galerie, lien START vers l'app, lien Info)
├── app.html            Interface de l'application de dessin
├── app.js              Logique : canvas fixe, outils, undo/redo, export, thèmes
├── info.html           Page d'information (textes, choix de la couleur du pinceau)
├── info.js             Logique de la page Info (thème + sélecteur de couleur)
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
`prompt-X_aammjjhhmmss` contenant le prompt, le résultat produit et les **captures d'écran**
des 3 interfaces (`home.png`, `app.png`, `info.png`). Détails et convention de nommage :
[`archive/README.md`](archive/README.md).

Générer les captures des 3 interfaces (Playwright + Chrome) :

```bash
npm install            # installe Playwright (devDependency)
node archive/capture.mjs archive/prompt-X_aammjjhhmmss
```

## Déploiement

Hébergé via **GitHub Pages** (branche `main`, racine du dépôt). Chaque `push` sur `main`
reconstruit automatiquement le site.
