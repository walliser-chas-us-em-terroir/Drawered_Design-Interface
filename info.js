'use strict';

/* ============================================================
   DRAWERED — page info
   Choix de la couleur de l'interface (thème Light / Dark / Sexy).
   Le thème est mémorisé (localStorage 'drawered-theme') et
   appliqué partout (accueil, app, info).
   ============================================================ */

const themeSwitch = document.getElementById('theme-switch');

function applyTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('drawered-theme', name);
  themeSwitch.querySelectorAll('button').forEach((b) =>
    b.classList.toggle('active', b.dataset.themeValue === name)
  );
}

themeSwitch.querySelectorAll('button').forEach((b) =>
  b.addEventListener('click', () => applyTheme(b.dataset.themeValue))
);

// Applique et reflète le thème mémorisé au chargement
applyTheme(localStorage.getItem('drawered-theme') || 'dark');
