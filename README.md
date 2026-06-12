# DRAWERED

Application web de dessin simple, construite en **HTML / CSS / JavaScript vanilla**
(sans framework ni étape de build).

> État actuel : application fonctionnelle **habillée selon le design Figma** — boutons
> parallélogrammes, typographie dédiée et **3 thèmes de couleur** (Light / Dark / Sexy).

## 🔗 Rendu — Phase 3 (Interface 5 · ERACOM)

- **🖥️ Application en ligne** : https://walliser-chas-us-em-terroir.github.io/Drawered_Design-Interface/
  (page d'accueil → bouton **START** → l'application de dessin)
- **📄 Présentation (PDF, 37 pages)** : [télécharger / ouvrir](_Presentation/Pr%C3%A9sentation_Mathias_UDRIOT_Interface5.pdf)
- **🎨 Maquette Figma (mode édition)** : [ouvrir dans Figma](https://www.figma.com/design/7rikfm0izkG47NVU4KlcnE/Mathias_UDRIOT_Interface5?node-id=1-2&t=bDoTYTlNIwWmwJey-1)
  — *accès en édition protégé : le code est communiqué directement à l'enseignant (non publié ici).*

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

Habillage tiré du fichier Figma (`instructions-2.md` → `instructions-5.md`) :

- **Style de bouton unique** (parallélogrammes) à **3 bandes** : rim vif (G3) + bande foncée
  (G4) + fond (G3) ; états normal / hover (olive G1) / clicked (fond G2). Même style partout,
  y compris le bouton **START** et les pastilles de couleur (double contour autour de la couleur).
- **Sélecteur d'épaisseur** : cases-paliers (losanges) à **traits arrondis** remplies jusqu'à la
  valeur + barre continue à curseur rond, intégrés dans la rangée d'outils.
- **Tab-bar de thème** (page Info) : pastille active à double contour qui **glisse** entre
  Light / Dark / Sexy, hover en vert moyen.
- **Galerie d'accueil** : images **16:9** sur **3 lignes en briques** (décalage ½), **coin cassé
  à droite** avec bordure verte suivant tout le contour (wrapper `.frame`) ; occupe ~75 % de la
  hauteur, survol = hausse de luminosité (sans zoom, contour conservé).
- **Barre du bas** alignée au **même niveau** et même style sur les 3 pages.
- **Page Info** pleine page, sans bordure ni coin cassé ; paragraphes décalés à droite.
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
├── archive/            Journal de bord, classé par jour (jour-1 à jour-5)
├── _Presentation/      Rendu Phase 3 : présentation (HTML autonome + PDF)
└── old_version/        Ancienne version — ignorée, conservée pour référence
```

## Utilisation en local

Aucune dépendance n'est nécessaire pour utiliser l'application : ouvrir `index.html`
dans un navigateur. Pour servir le projet localement :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/
```

## Journal de bord (archive)

Le travail est archivé dans `archive/`, **classé par jour** (`jour-1` à `jour-5`) : notes de
cours, prompts envoyés, résultats et **captures d'écran** des interfaces à chaque étape. Cette
matière constitue le journal de bord repris dans la présentation (Phase 3).

## Déploiement

Hébergé via **GitHub Pages** (branche `main`, racine du dépôt). Chaque `push` sur `main`
reconstruit automatiquement le site.
