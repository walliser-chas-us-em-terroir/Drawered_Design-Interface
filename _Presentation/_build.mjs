// Construit une présentation DRAWERED autonome à partir de l'artefact Claude Design.
// - récupère le CSS + les 36 slides de l'artefact bundlé
// - corrige le contenu (cours 4-5, travail IA, analyse) selon l'archive réelle
// - injecte les vraies captures (archive/ + links/) en base64 (fichier autonome)
// - ajoute un petit runtime (navigation clavier/clic, mise à l'échelle 16:9, thèmes)
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const R = (p) => resolve(__dirname, p);

/* 1. Extraire le document interne du bundle ------------------------------- */
let raw = readFileSync(R('Presentation-Claude-Design.html'), 'utf8');
const styleStart = raw.lastIndexOf('<style', raw.indexOf('<body data-theme='));
const deckEnd = raw.indexOf('<\\u002Fdeck-stage>');
let inner = raw.slice(styleStart, deckEnd + '<\\u002Fdeck-stage>'.length);
inner = inner.replace(/\\u002F/g, '/').replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '  ');

const styleCSS = inner.slice(inner.indexOf('<style'), inner.indexOf('</style>') + 8);
let deck = inner.slice(inner.indexOf('<deck-stage'), inner.indexOf('</deck-stage>') + '</deck-stage>'.length);

/* 2. Réécriture des slices Cours 4-5 / Travail IA / Analyse ---------------- */
const OV = '<div class="grid-overlay">' + '<i></i>'.repeat(12) + '</div>';
const head = '<header class="meta top"><span class="brand">DESIGN SYSTÈME · INTERFACE 5</span><span>ID432 / ERACOM 2026</span></header>';
const sec = (n, label, foot, inside) => `  <!-- ${n} -->
  <section data-label="${label}">
    <div class="frame">
      ${head}
      <div class="stage">
        <div class="grid">
${inside}
        </div>
        ${OV}
      </div>
      <footer class="meta bot"><span>${foot}</span><span class="pg"><b>${n}</b></span></footer>
    </div>
  </section>`;

// slide pleine page « en situation » (mockup) insérée après la version finale
const MOCKUP = `
  <!-- En situation -->
  <section data-label="En situation">
    <div class="frame" style="padding:0; justify-content:space-between;">
      <img src="../links/mockup/tablette-rendu-1.jpg" alt="DRAWERED en situation" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
      <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,.62), rgba(0,0,0,0) 48%);"></div>
      <header class="meta top" style="position:relative;z-index:2;padding:var(--mt) var(--mx) 0;"><span class="brand" style="color:#eaf6ef;">DESIGN SYSTÈME · INTERFACE 5</span><span style="color:#cfe7da;">ID432 / ERACOM 2026</span></header>
      <div style="position:relative;z-index:2;padding:0 var(--mx) var(--mb);">
        <p class="kicker">En situation</p>
        <h1 class="title" style="font-size: calc(92px * var(--type-scale)); max-width:20ch; color:#fff;">DRAWERED en conditions réelles</h1>
        <div class="meta" style="margin-top:18px;color:rgba(255,255,255,.72);"><span>Mise en situation · #drawered</span><span class="pg"><b>00</b></span></div>
      </div>
    </div>
  </section>`;

const NEW = {
  20: sec(20, '20 · Cours 4', 'Journal · Cours 4', `          <div class="block" style="grid-area: 1 / 1 / 13 / 5; justify-content:center;"><p class="phase-num">C4</p></div>
          <div class="block gap-s" style="grid-area: 3 / 6 / 11 / 13; justify-content:center;">
            <p class="kicker">Cours 4 · Le tournant</p>
            <h1 class="title" style="font-size: calc(78px * var(--type-scale));">Repartir<br>de zéro</h1>
            <p class="status ok">Reprise saine</p>
            <p class="lead">Cette fois, partir d'une app de dessin qui fonctionne vraiment, puis appliquer la charte DRAWERED par-dessus.</p>
          </div>`),

  21: sec(21, '21 · Cours 4 · Démarche', 'Journal · Cours 4', `          <figure class="ph" style="grid-area: 1 / 1 / 13 / 7;">
            <div class="ph-fill"><img class="shot" src="../archive/jour-4/prompt-1_260608231051/capture.png" alt="Base de dessin fonctionnelle"></div>
            <figcaption><span class="fig">Fig. 07</span><span class="fmt">Jour 4 · base fonctionnelle</span></figcaption>
          </figure>
          <div class="block gap-s" style="grid-area: 1 / 8 / 13 / 13;">
            <p class="kicker">Cours 4 · La démarche</p>
            <h1 class="title">D'abord la fonction, ensuite le style</h1>
            <div class="runtext" style="margin-top:8px;">
              <p>Plutôt que de styliser une coquille vide, je repars d'un <b>canvas minimal qui dessine vraiment</b> : pinceau, gomme, undo / redo, effacer, export PNG.</p>
              <p>Ensuite seulement, j'applique le design system DRAWERED — tokens de couleur, polices, boutons biseautés, grille de points — par petites touches.</p>
            </div>
          </div>`),

  22: sec(22, '22 · Cours 4 · Objectifs', 'Journal · Cours 4', `          <div class="block" style="grid-area: 1 / 1 / 3 / 8;"><p class="kicker">Cours 4 · Ce qui a été fait</p><h1 class="title" style="margin-top:12px;">Une base, puis la charte</h1></div>
          <ul class="jlist" style="grid-area: 4 / 1 / 13 / 8; gap:14px; font-size: calc(28px * var(--type-scale));">
            <li><span class="m ok">✓</span><span>Canvas fonctionnel en vanilla JS : tracé fluide souris + tactile, rendu HDPI.</span></li>
            <li><span class="m ok">✓</span><span>Undo / redo, tout effacer, export PNG.</span></li>
            <li><span class="m ok">✓</span><span>Design system appliqué : 3 thèmes, polices Elliot Swonger + Maven Pro.</span></li>
            <li><span class="m ok">✓</span><span>Boutons parallélogrammes, palette, grille de points.</span></li>
          </ul>
          <figure class="ph" style="grid-area: 1 / 8 / 13 / 13;"><div class="ph-fill"><img class="shot" src="../archive/jour-4/prompt-2_260609001437/capture.png" alt="Design appliqué"></div></figure>`),

  23: sec(23, '23 · Cours 5', 'Journal · Cours 5', `          <div class="block" style="grid-area: 1 / 1 / 13 / 5; justify-content:center;"><p class="phase-num">C5</p></div>
          <div class="block gap-s" style="grid-area: 3 / 6 / 11 / 13; justify-content:center;">
            <p class="kicker">Cours 5 · Finalisation</p>
            <h1 class="title" style="font-size: calc(78px * var(--type-scale));">Le rendu<br>final</h1>
            <p class="status ok">Terminé</p>
            <p class="lead">Itérations serrées, prompt par prompt, jusqu'à une interface fidèle à la maquette.</p>
          </div>`),

  24: sec(24, '24 · Cours 5 · Plan', 'Journal · Cours 5', `          <div class="block" style="grid-area: 1 / 1 / 4 / 11;"><p class="kicker">Cours 5 · Ce que j'ai finalisé</p><h1 class="title" style="margin-top:12px;">Boucler le rendu</h1></div>
          <ul class="jlist" style="grid-area: 5 / 1 / 11 / 7;">
            <li><span class="m ok">✓</span><span>Canvas fixe (zoom retiré) + grille de points conservée.</span></li>
            <li><span class="m ok">✓</span><span>Page Info pleine page : textes, navigation, thème.</span></li>
          </ul>
          <ul class="jlist" style="grid-area: 5 / 7 / 11 / 13;">
            <li><span class="m ok">✓</span><span>Épaisseur à 7 paliers + 4 couleurs de dessin.</span></li>
            <li><span class="m ok">✓</span><span>Bouton à double contour, tab-bar de thème qui glisse, galerie 16:9 en briques, mode sexy en rouge.</span></li>
          </ul>
          <div class="block" style="grid-area: 11 / 1 / 13 / 13;"><p class="tag">Chaque étape archivée prompt par prompt — dossier /archive, classé par jour.</p></div>`),

  25: sec(25, '25 · Cours 5 · Version finale', 'Journal · Cours 5', `          <div class="block gap-s" style="grid-area: 1 / 1 / 13 / 5;">
            <p class="kicker">Cours 5 · État final</p>
            <h1 class="title" style="font-size: calc(58px * var(--type-scale));">La version finale</h1>
            <div class="runtext" style="margin-top:8px;">
              <p>Une app fidèle à la maquette : identité néon / cyber, boutons biseautés à <b>double contour</b>, canvas en grille de points.</p>
              <p>Trois écrans cohérents et thémés — accueil, dessin, info.</p>
            </div>
            <p class="tag mt-auto">Publié avec #drawered</p>
          </div>
          <figure class="ph" style="grid-area: 1 / 6 / 13 / 13;">
            <div class="ph-fill"><img class="shot" src="../archive/jour-5/prompt-9_260612090134/app.png" alt="DRAWERED — version finale"></div>
            <figcaption><span class="fig">Fig. 08</span><span class="fmt">Jour 5 · version finale</span></figcaption>
          </figure>`) + MOCKUP,

  26: sec(26, "26 · Travail avec l'IA", "Travail avec l'IA", `          <div class="block" style="grid-area: 1 / 1 / 3 / 13;"><p class="kicker">05 · Travail avec l'IA</p><h1 class="title" style="margin-top:8px;">Deux outils, deux postures</h1></div>
          <div class="block" style="grid-area: 4 / 1 / 11 / 7;">
            <p class="colhead">Google AI Studio · Gemini</p>
            <ul class="jlist" style="font-size: calc(26px * var(--type-scale));">
              <li><span class="m nx">·</span><span>Premier jet complet en un seul fichier.</span></li>
              <li><span class="m nx">·</span><span>Structure des trois pages correcte.</span></li>
              <li><span class="m no">✕</span><span>Finitions, icônes et fonctions faibles.</span></li>
            </ul>
          </div>
          <div class="block" style="grid-area: 4 / 7 / 11 / 13;">
            <p class="colhead">Claude Code + Figma (MCP)</p>
            <ul class="jlist" style="font-size: calc(26px * var(--type-scale));">
              <li><span class="m no">✕</span><span>En « réparation » (Cours 3) : décevant, a cassé l'existant.</span></li>
              <li><span class="m ok">✓</span><span>Une fois cadré — charte fournie + pont Figma — rendu fidèle.</span></li>
              <li><span class="m ok">✓</span><span>Itérations fines, prompt par prompt (Cours 4-5).</span></li>
            </ul>
          </div>
          <div class="block" style="grid-area: 11 / 1 / 13 / 13;">
            <p class="tag">Écart attendu / obtenu : très approximatif au départ ; en fournissant la charte et en itérant petit à petit, la version finale rejoint la maquette.</p>
          </div>`),

  29: sec(29, '29 · Analyse critique', 'Analyse critique', `          <div class="block" style="grid-area: 1 / 1 / 3 / 13;"><p class="kicker">07 · Analyse critique</p><h1 class="title" style="margin-top:8px;">Ce qui fonctionne, ce qui non</h1></div>
          <div class="block" style="grid-area: 4 / 1 / 13 / 7;">
            <p class="colhead ok">Fonctionne</p>
            <ul class="jlist" style="font-size: calc(27px * var(--type-scale));">
              <li><span class="m ok">✓</span><span>Dessin libre au pinceau, gomme.</span></li>
              <li><span class="m ok">✓</span><span>4 couleurs + épaisseur à 7 paliers.</span></li>
              <li><span class="m ok">✓</span><span>Undo / redo, tout effacer, export PNG.</span></li>
              <li><span class="m ok">✓</span><span>3 thèmes, 3 écrans, identité fidèle (néons, biseaux, dot matrix).</span></li>
            </ul>
          </div>
          <div class="block" style="grid-area: 4 / 7 / 13 / 13;">
            <p class="colhead no">Limites</p>
            <ul class="jlist" style="font-size: calc(27px * var(--type-scale));">
              <li><span class="m no">✕</span><span>Pas de calques ni de sélection.</span></li>
              <li><span class="m no">✕</span><span>Pas d'import ni de sauvegarde de session.</span></li>
              <li><span class="m no">✕</span><span>Dessin matriciel (non vectoriel).</span></li>
              <li><span class="m nx">·</span><span>Zoom volontairement retiré (canvas fixe).</span></li>
            </ul>
          </div>`),

  5: sec(5, '05 · Spécificités', "L'application · USP", `          <div class="block" style="grid-area: 1 / 1 / 4 / 9;"><p class="kicker">01 · Spécificités · USP</p><h1 class="title" style="margin-top:12px;">Ce qui la rend particulière</h1></div>
          <ul class="jlist" style="grid-area: 5 / 1 / 13 / 7;">
            <li><span class="m nx">01</span><span>Identité néon / cyber assumée, loin des apps de dessin génériques.</span></li>
            <li><span class="m nx">02</span><span>Boutons biseautés (parallélogramme) à double contour.</span></li>
            <li><span class="m nx">03</span><span>Canvas en grille de points (dot matrix).</span></li>
          </ul>
          <ul class="jlist" style="grid-area: 5 / 7 / 13 / 13;">
            <li><span class="m nx">04</span><span>Trois thèmes en un clic : light / dark / sexy.</span></li>
            <li><span class="m nx">05</span><span>Mode SEXY : l'interface et les photos basculent en rouge.</span></li>
            <li><span class="m nx">06</span><span>Export PNG du dessin, en un geste.</span></li>
          </ul>`),

  6: sec(6, '06 · Système visuel', "L'application · Charte", `          <div class="block" style="grid-area: 1 / 1 / 3 / 13;"><p class="kicker">02 · Système visuel</p></div>
          <div class="block gap-s" style="grid-area: 3 / 1 / 13 / 5;">
            <h1 class="title" style="font-size: calc(60px * var(--type-scale));">Typographie</h1>
            <p class="sub" style="font-family:var(--font-display);">Elliot Swonger</p>
            <p class="tag">Titres et logo · style techno</p>
            <p class="sub" style="margin-top:10px;">Maven Pro</p>
            <p class="tag">Textes et interface</p>
          </div>
          <div class="block" style="grid-area: 3 / 6 / 13 / 13;">
            <p class="tag" style="margin-bottom:12px;">Palette · Dark</p>
            <div class="swrow">
              <div class="swatch"><div class="chip" style="background:#1C1C1C;"></div><span class="nm">BG</span><span class="hex">#1C1C1C</span></div>
              <div class="swatch"><div class="chip" style="background:#F3F3F3;"></div><span class="nm">Blanc</span><span class="hex">#F3F3F3</span></div>
              <div class="swatch"><div class="chip" style="background:#586E4D;"></div><span class="nm">G1</span><span class="hex">#586E4D</span></div>
              <div class="swatch"><div class="chip" style="background:#4B9826;"></div><span class="nm">G2</span><span class="hex">#4B9826</span></div>
              <div class="swatch"><div class="chip" style="background:#73DA41;"></div><span class="nm">G3</span><span class="hex">#73DA41</span></div>
              <div class="swatch"><div class="chip" style="background:#243F27;"></div><span class="nm">G4</span><span class="hex">#243F27</span></div>
              <div class="swatch"><div class="chip" style="background:#92580C;"></div><span class="nm">Red</span><span class="hex">#92580C</span></div>
            </div>
            <p class="tag" style="margin:20px 0 12px;">Palette · Light</p>
            <div class="swrow">
              <div class="swatch"><div class="chip" style="background:#F3F3F3;"></div><span class="nm">BG</span><span class="hex">#F3F3F3</span></div>
              <div class="swatch"><div class="chip" style="background:#1C1C1C;"></div><span class="nm">Blanc</span><span class="hex">#1C1C1C</span></div>
              <div class="swatch"><div class="chip" style="background:#4B9826;"></div><span class="nm">G1</span><span class="hex">#4B9826</span></div>
              <div class="swatch"><div class="chip" style="background:#586E4D;"></div><span class="nm">G2</span><span class="hex">#586E4D</span></div>
              <div class="swatch"><div class="chip" style="background:#2E6713;"></div><span class="nm">G3</span><span class="hex">#2E6713</span></div>
              <div class="swatch"><div class="chip" style="background:#73DA41;"></div><span class="nm">G4</span><span class="hex">#73DA41</span></div>
              <div class="swatch"><div class="chip" style="background:#C37C7C;"></div><span class="nm">Red</span><span class="hex">#C37C7C</span></div>
            </div>
            <p class="tag" style="margin:20px 0 12px;">Palette · Sexy</p>
            <div class="swrow">
              <div class="swatch"><div class="chip" style="background:#230202;"></div><span class="nm">BG</span><span class="hex">#230202</span></div>
              <div class="swatch"><div class="chip" style="background:#F4E3E3;"></div><span class="nm">Blanc</span><span class="hex">#F4E3E3</span></div>
              <div class="swatch"><div class="chip" style="background:#6E4D4D;"></div><span class="nm">G1</span><span class="hex">#6E4D4D</span></div>
              <div class="swatch"><div class="chip" style="background:#982626;"></div><span class="nm">G2</span><span class="hex">#982626</span></div>
              <div class="swatch"><div class="chip" style="background:#DA4141;"></div><span class="nm">G3</span><span class="hex">#DA4141</span></div>
              <div class="swatch"><div class="chip" style="background:#3F2424;"></div><span class="nm">G4</span><span class="hex">#3F2424</span></div>
              <div class="swatch"><div class="chip" style="background:#982626;"></div><span class="nm">Red</span><span class="hex">#982626</span></div>
            </div>
          </div>`),

  7: sec(7, '07 · Rappel Phase 1', 'Rappel · Phase 1', `          <div class="block" style="grid-area: 1 / 1 / 3 / 13;"><p class="kicker">Rappel · Phase 1 · UI Kit</p><h1 class="title" style="margin-top:6px; font-size: calc(56px * var(--type-scale));">De l'image au système</h1></div>
          <figure class="ph" style="grid-area: 3 / 1 / 13 / 8;"><div class="ph-fill"><img class="shot" src="../links/MOOBOARD.jpg" alt="Mood board d'inspiration"></div></figure>
          <div style="grid-area: 3 / 8 / 13 / 13; display:grid; grid-template-columns:repeat(2,1fr); grid-template-rows:repeat(4,1fr); gap:14px; min-height:0;">
            <div class="asset"><img src="../links/assets/bouton-pinceau.png" alt="Bouton"></div>
            <div class="asset"><img src="../links/assets/on-off.png" alt="Toggle"></div>
            <div class="asset"><img src="../links/assets/slider.png" alt="Slider"></div>
            <div class="asset"><img src="../links/assets/radio.png" alt="Radio"></div>
            <div class="asset"><img src="../links/assets/check-box.png" alt="Checkbox"></div>
            <div class="asset"><img src="../links/assets/dropdown.png" alt="Dropdown"></div>
            <div class="asset"><img src="../links/assets/tap-bar.png" alt="Tab bar"></div>
            <div class="asset"><img src="../links/assets/card.png" alt="Card"></div>
          </div>`),

  8: sec(8, '08 · Rappel Phase 2', 'Rappel · Phase 2', `          <figure class="ph" style="grid-area: 1 / 1 / 13 / 9;"><div class="ph-fill"><img class="shot" src="../links/analyse.png" alt="Analyse Phase 2"></div></figure>
          <div class="block gap-s" style="grid-area: 1 / 9 / 13 / 13;">
            <p class="kicker">Rappel · Phase 2</p>
            <h1 class="title">Maquette</h1>
            <div class="runtext" style="margin-top:8px;">
              <p>Analyse de trois apps de référence — <b>Freeform</b>, <b>Paint Toys</b>, <b>Wiggly Paint</b> : wireframes, grilles de lecture et synthèse, avant de composer la maquette.</p>
            </div>
            <p class="tag mt-auto">Canvas · outils · couleurs · épaisseur · undo / redo · export</p>
          </div>`),

  28: sec(28, '28 · Comparaison', 'Comparaison des versions', `          <div class="block" style="grid-area: 1 / 1 / 3 / 13;"><p class="kicker">06 · Comparaison</p><h1 class="title" style="margin-top:8px;">La page d'accueil, de la maquette à la finale</h1></div>
          <div class="compare" style="grid-area: 4 / 1 / 13 / 13;">
            <figure class="ph"><div class="ph-fill"><img class="shot" src="../links/interface/welcome.png" alt="Maquette"></div><div class="cmp-label"><b>00</b><span>Maquette</span></div></figure>
            <figure class="ph"><div class="ph-fill"><img class="shot" src="../archive/jour-2/Capture_decran_2026-05-19_a_10.39.43.png" alt="Cours 2"></div><div class="cmp-label"><b>01</b><span>Cours 2</span></div></figure>
            <figure class="ph"><div class="ph-fill"><img class="shot" src="../archive/jour-3/Capture_decran_2026-05-26_a_09.46.05.png" alt="Cours 3"></div><div class="cmp-label"><b>02</b><span>Cours 3</span></div></figure>
            <figure class="ph"><div class="ph-fill"><img class="shot" src="../archive/jour-5/prompt-9_260612090134/home.png" alt="Finale"></div><div class="cmp-label"><b>03</b><span>Finale</span></div></figure>
          </div>`),

  34: sec(34, '34 · Annexe · Références', 'Annexe · Références', `          <div class="block" style="grid-area: 1 / 1 / 3 / 13;"><p class="kicker">08 · Annexe</p><h1 class="title" style="margin-top:8px;">Références &amp; inspirations</h1></div>
          <div class="block" style="grid-area: 3 / 1 / 5 / 13;"><p class="tag">Trois applications de dessin analysées en Phase 2</p></div>
          <ul class="jlist" style="grid-area: 6 / 1 / 13 / 13; font-size: calc(34px * var(--type-scale)); gap:26px;">
            <li><span class="m nx">01</span><span>Apple Freeform<em>Canvas libre et infini, collaboration.</em></span></li>
            <li><span class="m nx">02</span><span>Paint Toys<em>Esthétique ludique et expérimentale.</em></span></li>
            <li><span class="m nx">03</span><span>Wiggly Paint<em>Traits vivants, animés, imparfaits.</em></span></li>
          </ul>`),

  36: sec(36, '36 · Annexe · Crédits', 'Annexe · Crédits', `          <div class="block" style="grid-area: 1 / 1 / 3 / 13;"><p class="kicker">08 · Annexe</p><h1 class="title" style="margin-top:8px;">Crédits &amp; liens</h1></div>
          <div class="block" style="grid-area: 4 / 1 / 13 / 5;">
            <p class="colhead">Projet</p>
            <div class="runtext" style="font-size: calc(26px * var(--type-scale));">
              <p style="margin:0 0 8px;"><b>Cours</b> · Interface 5 · ID432</p>
              <p style="margin:0 0 8px;"><b>École</b> · ERACOM</p>
              <p style="margin:0 0 8px;"><b>Enseignant</b> · Ivan Gulizia</p>
              <p style="margin:0 0 8px;"><b>Auteur</b> · Mathias Udriot</p>
            </div>
          </div>
          <div class="block" style="grid-area: 4 / 5 / 13 / 9;">
            <p class="colhead">Outils</p>
            <div class="runtext" style="font-size: calc(26px * var(--type-scale));">
              <p style="margin:0 0 8px;">Google AI Studio · Gemini</p>
              <p style="margin:0 0 8px;">Claude Code</p>
              <p style="margin:0 0 8px;">Figma + MCP</p>
              <p style="margin:0 0 8px;">#drawered</p>
            </div>
          </div>
          <div class="block" style="grid-area: 4 / 9 / 13 / 13;">
            <p class="colhead">Documentation</p>
            <div class="runtext" style="font-size: calc(26px * var(--type-scale));">
              <p style="margin:0 0 14px;">Tout le projet, le code et le journal de bord (classé par jour) sont versionnés et documentés sur GitHub.</p>
              <p style="margin:0;"><a class="linkred" href="https://github.com/walliser-chas-us-em-terroir/Drawered_Design-Interface" target="_blank" rel="noopener">github.com/walliser-chas-us-em-terroir/Drawered_Design-Interface</a></p>
            </div>
          </div>`),
};

deck = deck.replace(/  <!-- (\d+) ·[\s\S]*?<\/section>/g, (m, num) => NEW[parseInt(num, 10)] || m);

/* 3. Injecter les vraies captures dans les placeholders ------------------- */
const IMG = {
  ACCUEIL: '../links/interface/welcome.png',
  'UI KIT': '../links/interface/button-exemple.png',
  MAQUETTE: '../links/interface/app.png',
  BASE: '../archive/jour-4/prompt-1_260608231051/capture.png',
  AVANT: '../archive/jour-2/Capture_decran_2026-05-19_a_10.40.06.png',
  V1: '../archive/jour-2/Capture_decran_2026-05-19_a_10.39.43.png',
  GEMINI: '../archive/jour-2/Capture_decran_2026-05-19_a_10.39.43.png',
  'APR': '../archive/jour-3/Capture_decran_2026-05-26_a_09.46.05.png',
  V2: '../archive/jour-3/Capture_decran_2026-05-26_a_09.46.05.png',
  FINALE: '../archive/jour-5/prompt-9_260612090134/app.png',
};
const pickImg = (label) => {
  const L = label.toUpperCase();
  for (const k of ['ACCUEIL', 'ÉCRAN', 'UI KIT', 'MAQUETTE', 'BASE', 'AVANT', 'APR', 'V1', 'GEMINI', 'V2', 'FINALE']) {
    if (L.includes(k)) return IMG[k] || IMG[k === 'ÉCRAN' ? 'ACCUEIL' : k];
  }
  return null;
};
deck = deck.replace(/<div class="ph-fill"><span>\[ ([^\]]+) \]<\/span><\/div>/g, (m, label) => {
  const src = pickImg(label);
  return src ? `<div class="ph-fill"><img class="shot" src="${src}" alt="${label.trim()}"></div>` : m;
});

/* slide 36 — crédit outils : préciser le pont Figma */
deck = deck.replace('<p style="margin:0 0 8px;">Figma</p>', '<p style="margin:0 0 8px;">Figma + MCP</p>');

/* pas de légende sous les images : on retire toutes les figcaptions */
deck = deck.replace(/\s*<figcaption>[\s\S]*?<\/figcaption>/g, '');

/* renumérotation séquentielle des pieds de page + total */
let pageNo = 0;
deck = deck.replace(/<span class="pg"><b>\d+<\/b><\/span>/g,
  () => `<span class="pg"><b>${('0' + (++pageNo)).slice(-2)}</b></span>`);
const TOTAL = pageNo;

/* 4. Inliner toutes les images locales en base64 ------------------------- */
const mime = (p) => ({ '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' }[extname(p).toLowerCase()] || 'application/octet-stream');
const cache = new Map();
deck = deck.replace(/src="((?:\.\.|\.)\/[^"]+)"/g, (m, p) => {
  if (!cache.has(p)) {
    const buf = readFileSync(R(p));
    cache.set(p, `data:${mime(p)};base64,${buf.toString('base64')}`);
  }
  return `src="${cache.get(p)}"`;
});

/* 5. Assembler le fichier autonome --------------------------------------- */
const extraCSS = `
  <style>
    html,body{height:100%;}
    body{background:#000;display:block;}
    #__bundler_loading{display:none!important;}
    deck-stage{position:fixed;inset:0;display:block;background:#000;overflow:hidden;}
    deck-stage>section{position:absolute;top:50%;left:50%;width:1920px;height:1080px;transform-origin:center center;display:none;}
    deck-stage>section[data-deck-active]{display:block;}
    .ph-fill .shot{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#0b0b0b;}
    .asset-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;height:100%;min-height:0;}
    .asset{border:1px solid var(--line);background:var(--ph);display:flex;align-items:center;justify-content:center;padding:16px;min-height:0;min-width:0;}
    .asset img{max-width:100%;max-height:100%;object-fit:contain;}
    .cmp-label{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding-top:12px;font-family:var(--mono);font-size:var(--type-meta);letter-spacing:.06em;color:var(--muted);flex:0 0 auto;}
    .cmp-label b{color:var(--red);font-weight:600;}
    .linkred{color:var(--red);text-decoration:none;border-bottom:1px solid var(--red);}
    .linkred:hover{color:var(--fg);border-color:var(--fg);}
    .nav-hint{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:9999;
      font:600 12px/1 'JetBrains Mono',monospace;letter-spacing:.16em;text-transform:uppercase;
      color:rgba(255,255,255,.45);background:rgba(0,0,0,.5);padding:8px 14px;border:1px solid rgba(255,255,255,.12);}
    .nav-hint b{color:#D52B1E;}
  </style>`;

const runtime = `
  <div class="nav-hint">DRAWERED · <b id="pgnow">01</b> / ${TOTAL} · ← → naviguer · T thème · G grille</div>
  <script>
    (function(){
      try{ customElements.define('deck-stage', class extends HTMLElement{}); }catch(e){}
      var stage=document.querySelector('deck-stage');
      var slides=[].slice.call(stage.children).filter(function(n){return n.tagName==='SECTION';});
      var i=0;
      function layout(){ var s=Math.min(innerWidth/1920, innerHeight/1080);
        slides.forEach(function(sec){ sec.style.transform='translate(-50%,-50%) scale('+s+')'; }); }
      function show(n){ i=(n%slides.length+slides.length)%slides.length;
        slides.forEach(function(sec,k){ if(k===i){sec.setAttribute('data-deck-active','');} else {sec.removeAttribute('data-deck-active');} });
        var pg=document.getElementById('pgnow'); if(pg) pg.textContent=('0'+(i+1)).slice(-2); }
      addEventListener('keydown',function(e){
        if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){show(i+1);e.preventDefault();}
        else if(e.key==='ArrowLeft'||e.key==='PageUp'){show(i-1);e.preventDefault();}
        else if(e.key==='Home'){show(0);} else if(e.key==='End'){show(slides.length-1);}
        else if(e.key==='t'||e.key==='T'){document.body.dataset.theme=document.body.dataset.theme==='noir'?'blanc':'noir';}
        else if(e.key==='g'||e.key==='G'){document.body.classList.toggle('show-grid');}
      });
      addEventListener('click',function(e){ if(e.target.closest('a')) return; show(e.clientX/innerWidth<0.28?i-1:i+1); });
      addEventListener('resize',layout); layout(); show(0);
    })();
  </script>`;

const out = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DRAWERED · Documentation Phase 3</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  ${styleCSS}
  ${extraCSS}
</head>
<body data-theme="noir">
${deck}
${runtime}
</body>
</html>`;

writeFileSync(R('Presentation-DRAWERED-Phase3.html'), out);
console.log('OK — Presentation-DRAWERED-Phase3.html', (out.length / 1024 / 1024).toFixed(2), 'Mo · images:', cache.size);
