'use strict';

/* ============================================================
   DRAWERED — logique de l'app de dessin (vanilla JS)
   Fonctions : pinceau, gomme (épaisseurs), palette 5 couleurs,
   undo/redo, tout effacer, export PNG, grille en points (canvas
   fixe). Le thème (Light/Dark/Sexy) est choisi sur info.html et
   appliqué ici au démarrage via localStorage ('drawered-theme').
   ============================================================ */

/* ── Canvas & couches ────────────────────────────────────── */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const DPR = window.devicePixelRatio || 1;
let cssW = 0, cssH = 0;

let strokeCanvas = null, strokeCtx = null; // dessin de l'utilisateur
let gridCanvas = null, gridCtx = null;     // grille en points

/* ── État outils ─────────────────────────────────────────── */
let tool = 'brush';                 // 'brush' | 'eraser'
let brushColor = '#6FD3EC';         // cyan (défaut) — voir COLORS plus bas
let brushSize = 6;
let eraserSize = 20;

/* ── Undo / Redo ─────────────────────────────────────────── */
const undoStack = [], redoStack = [];
const MAX_STACK = 40;

/* ── Redimensionnement (plan de travail = 100% écran) ────── */
function resizeCanvas() {
  cssW = window.innerWidth;
  cssH = window.innerHeight;
  canvas.width = Math.round(cssW * DPR);
  canvas.height = Math.round(cssH * DPR);
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(DPR, DPR);
  ctx.lineCap = ctx.lineJoin = 'round';
  rebuildGrid();
  ensureStrokeCanvas(true);
  redrawAll();
}
window.addEventListener('resize', resizeCanvas);

/* ── Grille en points ────────────────────────────────────── */
const BASE_SPACING = 26;
function rebuildGrid() {
  gridCanvas = document.createElement('canvas');
  gridCanvas.width = canvas.width;
  gridCanvas.height = canvas.height;
  gridCtx = gridCanvas.getContext('2d');
  gridCtx.setTransform(1, 0, 0, 1, 0, 0);
  gridCtx.scale(DPR, DPR);
  paintGrid();
}
function gridColor() {
  // teinte des points dérivée du --fg du thème courant
  const fg = getComputedStyle(document.documentElement)
    .getPropertyValue('--fg').trim() || '#f3f3f3';
  const m = fg.replace('#', '');
  const r = parseInt(m.substring(0, 2), 16);
  const g = parseInt(m.substring(2, 4), 16);
  const b = parseInt(m.substring(4, 6), 16);
  return `rgba(${r},${g},${b},0.16)`;
}
function paintGrid() {
  gridCtx.clearRect(0, 0, cssW, cssH);
  const sp = BASE_SPACING;
  const r = 0.9;
  gridCtx.fillStyle = gridColor();
  for (let x = sp / 2; x < cssW; x += sp)
    for (let y = sp / 2; y < cssH; y += sp) {
      gridCtx.beginPath();
      gridCtx.arc(x, y, r, 0, Math.PI * 2);
      gridCtx.fill();
    }
}

/* ── Couche de dessin ────────────────────────────────────── */
function ensureStrokeCanvas(reset = false) {
  if (!strokeCanvas || reset) {
    const prev = strokeCanvas;
    strokeCanvas = document.createElement('canvas');
    strokeCanvas.width = canvas.width;
    strokeCanvas.height = canvas.height;
    strokeCtx = strokeCanvas.getContext('2d');
    strokeCtx.setTransform(1, 0, 0, 1, 0, 0);
    strokeCtx.scale(DPR, DPR);
    strokeCtx.lineCap = strokeCtx.lineJoin = 'round';
    if (prev && !reset) strokeCtx.drawImage(prev, 0, 0, cssW, cssH);
  }
}
function redrawAll() {
  ctx.clearRect(0, 0, cssW, cssH);
  if (gridCanvas) ctx.drawImage(gridCanvas, 0, 0, cssW, cssH);
  if (strokeCanvas) ctx.drawImage(strokeCanvas, 0, 0, cssW, cssH);
}

/* ── Undo / Redo ─────────────────────────────────────────── */
function saveState() {
  if (!strokeCanvas) return;
  undoStack.push(strokeCanvas.toDataURL());
  if (undoStack.length > MAX_STACK) undoStack.shift();
  redoStack.length = 0;
}
function restoreState(url) {
  const img = new Image();
  img.onload = () => {
    ensureStrokeCanvas();
    strokeCtx.clearRect(0, 0, cssW, cssH);
    strokeCtx.drawImage(img, 0, 0, cssW, cssH);
    redrawAll();
  };
  img.src = url;
}
function undo() {
  if (undoStack.length <= 1) return;
  redoStack.push(undoStack.pop());
  restoreState(undoStack[undoStack.length - 1]);
}
function redo() {
  if (!redoStack.length) return;
  const s = redoStack.pop();
  undoStack.push(s);
  restoreState(s);
}

/* ── Dessin ──────────────────────────────────────────────── */
let isDrawing = false, lastX = 0, lastY = 0;

function getPos(e) {
  const r = canvas.getBoundingClientRect();
  const s = e.touches ? e.touches[0] : e;
  return { x: s.clientX - r.left, y: s.clientY - r.top };
}
function startDraw(e) {
  e.preventDefault();
  isDrawing = true;
  const p = getPos(e);
  lastX = p.x; lastY = p.y;
  ensureStrokeCanvas();
}
function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const p = getPos(e);
  ensureStrokeCanvas();
  strokeCtx.globalCompositeOperation =
    tool === 'eraser' ? 'destination-out' : 'source-over';
  strokeCtx.strokeStyle = brushColor;
  strokeCtx.lineWidth = tool === 'eraser' ? eraserSize : brushSize;
  strokeCtx.beginPath();
  strokeCtx.moveTo(lastX, lastY);
  strokeCtx.lineTo(p.x, p.y);
  strokeCtx.stroke();
  lastX = p.x; lastY = p.y;
  redrawAll();
}
function endDraw() {
  if (!isDrawing) return;
  isDrawing = false;
  saveState();
}
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', endDraw);
canvas.addEventListener('touchstart', startDraw, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', endDraw);

/* ── Barre d'outils : couleur, gomme, pinceau, slider ────────
   La rangée (alignée à droite) est reconstruite par JS selon
   panelMode. Un seul panneau ouvert à la fois (couleurs OU
   épaisseur). L'expansion grandit vers la gauche. ───────────── */
const toolbarRight = document.getElementById('toolbar-right');

/* 4 couleurs fixes (ni noir/blanc ni sombre/clair) + 7 paliers d'épaisseur */
const COLORS = ['#E5392B', '#F2C53B', '#D633CE', '#6FD3EC']; // rouge, jaune, magenta, cyan
const SIZES = [1, 10, 20, 30, 40, 50, 60];
let panelMode = 'none'; // 'none' | 'colors' | 'size'

function setTool(t) { tool = t; }
function currentSize() { return tool === 'eraser' ? eraserSize : brushSize; }
function setCurrentSize(v) {
  v = Math.min(60, Math.max(1, v | 0));
  if (tool === 'eraser') eraserSize = v; else brushSize = v;
}

function el(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }

function makeColorButton() {
  const b = el('button', 'btn btn--color');
  b.title = 'Couleur';
  b.style.setProperty('--current-color', brushColor);
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    panelMode = panelMode === 'colors' ? 'none' : 'colors';
    render();
  });
  return b;
}
function makeSwatch(col) {
  const b = el('button', 'btn btn--color');
  b.style.setProperty('--current-color', col);
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    brushColor = col;
    if (tool === 'eraser') setTool('brush');
    panelMode = 'none';
    render();
  });
  return b;
}
function makeToolButton(t, ico, title) {
  const b = el('button', 'btn' + (tool === t ? ' active' : ''));
  b.title = title;
  b.appendChild(el('span', 'ico ico-' + ico));
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    if (tool === t && panelMode === 'size') panelMode = 'none';
    else { setTool(t); panelMode = 'size'; }
    render();
  });
  return b;
}
function updateSizeFills() {
  toolbarRight.querySelectorAll('.size-cell').forEach((c, i) =>
    c.classList.toggle('filled', SIZES[i] <= currentSize())
  );
}
function makeSizeWidget() {
  const w = el('div', 'size-widget');
  const cells = el('div', 'size-cells');
  SIZES.forEach((sz) => {
    const c = el('button', 'size-cell' + (sz <= currentSize() ? ' filled' : ''));
    c.title = sz + ' px';
    const bar = el('span', 'bar');
    bar.style.height = Math.max(2, Math.round((sz / 60) * 22)) + 'px';
    c.appendChild(bar);
    c.addEventListener('click', (e) => {
      e.stopPropagation();
      setCurrentSize(sz);
      render();
    });
    cells.appendChild(c);
  });
  const track = el('input', 'size-track');
  track.type = 'range'; track.min = '1'; track.max = '60';
  track.value = String(currentSize());
  // on ne reconstruit pas pendant le glissement (on garde le focus du curseur)
  track.addEventListener('input', (e) => {
    e.stopPropagation();
    setCurrentSize(parseInt(track.value, 10));
    updateSizeFills();
  });
  track.addEventListener('click', (e) => e.stopPropagation());
  w.appendChild(cells);
  w.appendChild(track);
  return w;
}

function render() {
  toolbarRight.innerHTML = '';
  // zone couleur (bouton unique, ou les 4 pastilles dépliées)
  if (panelMode === 'colors') COLORS.forEach((col) => toolbarRight.appendChild(makeSwatch(col)));
  else toolbarRight.appendChild(makeColorButton());
  // gomme, (slider si gomme active), pinceau, (slider si pinceau actif)
  toolbarRight.appendChild(makeToolButton('eraser', 'eraser', 'Gomme'));
  if (panelMode === 'size' && tool === 'eraser') toolbarRight.appendChild(makeSizeWidget());
  toolbarRight.appendChild(makeToolButton('brush', 'brush', 'Pinceau'));
  if (panelMode === 'size' && tool === 'brush') toolbarRight.appendChild(makeSizeWidget());
}

/* clic ailleurs : referme le panneau ouvert */
toolbarRight.addEventListener('click', (e) => e.stopPropagation());
document.addEventListener('click', () => {
  if (panelMode !== 'none') { panelMode = 'none'; render(); }
});

render();

/* ── Actions ─────────────────────────────────────────────── */
document.getElementById('btn-undo').addEventListener('click', undo);
document.getElementById('btn-redo').addEventListener('click', redo);

document.getElementById('btn-clear').addEventListener('click', () => {
  ensureStrokeCanvas();
  strokeCtx.clearRect(0, 0, cssW, cssH);
  redrawAll();
  saveState();
});

document.getElementById('btn-export').addEventListener('click', () => {
  const exp = document.createElement('canvas');
  exp.width = canvas.width;
  exp.height = canvas.height;
  const ec = exp.getContext('2d');
  if (gridCanvas) ec.drawImage(gridCanvas, 0, 0);
  if (strokeCanvas) ec.drawImage(strokeCanvas, 0, 0);
  const a = document.createElement('a');
  a.download = 'drawered.png';
  a.href = exp.toDataURL('image/png');
  a.click();
});

/* ── Thème (choisi sur info.html, appliqué ici au démarrage) ─ */
function applyTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('drawered-theme', name);
  if (gridCtx) { paintGrid(); redrawAll(); }
}

/* ── Démarrage ───────────────────────────────────────────── */
applyTheme(localStorage.getItem('drawered-theme') || 'dark');
resizeCanvas();
saveState();
