// Capture d'écran de l'app de dessin via Playwright (Chrome installé).
// Usage : node archive/capture.mjs <fichier-html> <fichier-png-de-sortie>
// Exemple : node archive/capture.mjs app.html archive/prompt-1_xxx/capture.png

import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const [, , inputHtml = 'app.html', outPng = 'archive/capture.png'] = process.argv;

const url = pathToFileURL(resolve(inputHtml)).href;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(url);
await page.waitForTimeout(400); // laisser le canvas s'initialiser
await page.screenshot({ path: resolve(outPng) });
await browser.close();

console.log('Capture enregistrée :', outPng);
