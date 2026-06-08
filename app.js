'use strict';

/* ============================================================
   DRAWERED — logique de l'app de dessin (vanilla JS)
   Fonctions : pinceau, gomme (épaisseurs), palette 5 couleurs,
   undo/redo, tout effacer, export PNG, zoom 50%–200%, grille.
   ============================================================ */

/* ── Canvas & couches ────────────────────────────────────── */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const DPR = window.devicePixelRatio || 1;
let cssW = 0, cssH = 0;
let zoom = 1.0;

let strokeCanvas = null, strokeCtx = null; // dessin de l'utilisateur
let gridCanvas = null, gridCtx = null;     // grille en points

/* ── État outils ─────────────────────────────────────────── */
let tool = 'brush';                 // 'brush' | 'eraser'
let brushColor = '#000000';
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
function paintGrid() {
  gridCtx.clearRect(0, 0, cssW, cssH);
  const sp = BASE_SPACING * zoom;
  const r = Math.max(0.8, zoom * 0.9);
  gridCtx.fillStyle = 'rgba(0,0,0,0.18)';
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
  strokeCtx.lineWidth = (tool === 'eraser' ? eraserSize : brushSize) * zoom;
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

/* ── Panneaux (flyouts) ──────────────────────────────────── */
const btnBrush = document.getElementById('btn-brush');
const btnEraser = document.getElementById('btn-eraser');
const btnPalette = document.getElementById('btn-palette');
const panelBrush = document.getElementById('panel-brush');
const panelEraser = document.getElementById('panel-eraser');
const panelPalette = document.getElementById('panel-palette');

function closeAllPanels() {
  panelBrush.classList.add('hidden');
  panelEraser.classList.add('hidden');
  panelPalette.classList.add('hidden');
}
function togglePanel(panel) {
  const willOpen = panel.classList.contains('hidden');
  closeAllPanels();
  if (willOpen) panel.classList.remove('hidden');
}

function setTool(t) {
  tool = t;
  btnBrush.classList.toggle('active', t === 'brush');
  btnEraser.classList.toggle('active', t === 'eraser');
}

btnBrush.addEventListener('click', (e) => {
  e.stopPropagation();
  setTool('brush');
  togglePanel(panelBrush);
});
btnEraser.addEventListener('click', (e) => {
  e.stopPropagation();
  setTool('eraser');
  togglePanel(panelEraser);
});
btnPalette.addEventListener('click', (e) => {
  e.stopPropagation();
  togglePanel(panelPalette);
});

/* Fermer les panneaux au clic ailleurs */
document.addEventListener('click', closeAllPanels);
[panelBrush, panelEraser, panelPalette].forEach((p) =>
  p.addEventListener('click', (e) => e.stopPropagation())
);

/* ── Sliders d'épaisseur ─────────────────────────────────── */
const brushSlider = document.getElementById('brush-size');
const brushSizeLabel = document.getElementById('brush-size-label');
const eraserSlider = document.getElementById('eraser-size');
const eraserSizeLabel = document.getElementById('eraser-size-label');

brushSlider.addEventListener('input', () => {
  brushSize = parseInt(brushSlider.value, 10);
  brushSizeLabel.textContent = brushSize;
});
eraserSlider.addEventListener('input', () => {
  eraserSize = parseInt(eraserSlider.value, 10);
  eraserSizeLabel.textContent = eraserSize;
});

/* ── Palette : 5 couleurs, une seule sélection ───────────── */
const COLORS = ['#000000', '#e23b3b', '#2f6fd1', '#2faa4a', '#f2b705'];
COLORS.forEach((c) => {
  const sw = document.createElement('button');
  sw.className = 'swatch';
  sw.style.background = c;
  if (c === brushColor) sw.classList.add('selected');
  sw.addEventListener('click', () => {
    brushColor = c;
    if (tool === 'eraser') setTool('brush');
    panelPalette.querySelectorAll('.swatch')
      .forEach((s) => s.classList.remove('selected'));
    sw.classList.add('selected');
  });
  panelPalette.appendChild(sw);
});

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

/* ── Zoom (50% → 200%) ───────────────────────────────────── */
const zoomLabel = document.getElementById('zoom-label');
function setZoom(v) {
  zoom = Math.min(Math.max(v, 0.5), 2.0);
  zoomLabel.textContent = Math.round(zoom * 100) + '%';
  paintGrid();
  redrawAll();
}
document.getElementById('btn-zoom-in')
  .addEventListener('click', () => setZoom(zoom + 0.1));
document.getElementById('btn-zoom-out')
  .addEventListener('click', () => setZoom(zoom - 0.1));

/* ── Modal info ──────────────────────────────────────────── */
const infoModal = document.getElementById('info-modal');
document.getElementById('btn-info')
  .addEventListener('click', () => infoModal.classList.remove('hidden'));
document.getElementById('btn-info-close')
  .addEventListener('click', () => infoModal.classList.add('hidden'));
infoModal.addEventListener('click', (e) => {
  if (e.target === infoModal) infoModal.classList.add('hidden');
});

/* ── Démarrage ───────────────────────────────────────────── */
resizeCanvas();
saveState();
