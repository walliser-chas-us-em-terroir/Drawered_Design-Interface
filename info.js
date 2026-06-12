'use strict';

/* ============================================================
   DRAWERED — page info
   Tab-bar de couleur d'interface (Light / Dark / Sexy) avec
   pastille active qui glisse. Thème mémorisé (localStorage
   'drawered-theme') et appliqué partout (accueil, app, info).
   ============================================================ */

const ORDER = ['light', 'dark', 'sexy'];
const tabbar = document.getElementById('theme-tabbar');
const tabs = Array.from(tabbar.querySelectorAll('.tab'));
const indicator = tabbar.querySelector('.tabbar-indicator');

function applyTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('drawered-theme', name);
  tabs.forEach((t) => t.classList.toggle('active', t.dataset.themeValue === name));
  const i = Math.max(0, ORDER.indexOf(name));
  indicator.style.transform = `translateX(${i * 100}%)`; // glissement
}

tabs.forEach((t) =>
  t.addEventListener('click', () => applyTheme(t.dataset.themeValue))
);

applyTheme(localStorage.getItem('drawered-theme') || 'dark');
