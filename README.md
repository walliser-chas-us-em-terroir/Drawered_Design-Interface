# DRAWERED

Application web de dessin simple, construite en **HTML / CSS / JavaScript vanilla**
(sans framework ni étape de build).

> État actuel : application fonctionnelle **habillée selon le design Figma** — boutons
> parallélogrammes, typographie dédiée et **3 thèmes de couleur** (Light / Dark / Sexy).

## 🔗 Démo en ligne

**https://walliser-chas-us-em-terroir.github.io/Drawered_Design-Interface/**

(page d'accueil → bouton **START** → l'application de dessin)

## Fonctionnalités

- **Pinceau / Gomme** — clic sur l'outil : un **sélecteur d'épaisseur** s'ouvre dans la barre
  (7 cases-paliers de 1 à 60 px + barre continue dessous) ; l'épaisseur de chaque outil est
  indépendante.
- **4 couleurs de dessin** (rouge, jaune, magenta, cyan — ni noir ni blanc) : le bouton couleur
  déplie les 4 pastilles ; choisir referme le sélecteur et recolore le bouton. **Cyan** par défaut.
- **Un seul panneau ouvert à la fois** : couleurs OU épaisseur.
- **Annuler / Rétablir** (undo / redo).
- **Tout effacer** en un seul clic.
- **Exporter** le plan de travail en **PNG** (grille + dessin).
- **Plan de travail fixe plein écran** avec une **grille en points** (teintée selon le thème) —
  pas de zoom, le canva ne bouge pas.
- Lien **Info** (bas droite) vers la **page d'information** dédiée (`info.html`).
- **Couleur de l'interface** : 3 thèmes (Light / Dark / Sexy) choisis sur la **page Info**,
  mémorisés (`localStorage`) et appliqués partout (accueil, app, info) ; le mode **Sexy** teinte
  aussi les photos de l'accueil en rouge.

## Design

Habillage tiré du fichier Figma (`instructions-2.md` → `instructions-4.md`) :

- **Boutons parallélogrammes** à **double contour** (fond vert + cadre intérieur foncé), états
  normal / hover / clicked, déclinés selon le thème.
- **Sélecteur d'épaisseur** : cases-paliers (losanges) remplies jusqu'à la valeur + barre
  continue à curseur rond, intégrés dans la rangée d'outils.
- **Coin cassé avec bordure** : box d'images de l'accueil (coin bas-gauche), la bordure verte
  suit tout le contour y compris la diagonale (wrapper `.frame`).
- **Page Info** pleine page, sans bordure ni coin cassé ; navigation + thème en bas.
- **Polices** : `Elliot Swonger` (logo, `elliot_swonger.TTF`) + `Maven Pro` (Google Fonts).
- **Tokens couleur** : variables CSS `--g1…--g4`, `--bg`, `--fg` pilotées par `[data-theme]`.

## Structure du projet

```
.
├── index.html          Page d'accueil (galerie, lien START vers l'app, lien Info)
├── app.html            Interface de l'application de dessin
├── app.js              Logique : canvas fixe, outils, slider, couleurs, undo/redo, export
├── info.html           Page d'information (textes + choix du thème de l'interface)
├── info.js             Logique de la page Info (sélecteur de thème)
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
