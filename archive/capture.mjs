// Captures d'écran de DRAWERED via Playwright (Chrome installé).
//
// Deux usages :
//
//   1) Toutes les interfaces dans un dossier (recommandé) :
//        node archive/capture.mjs <dossier-de-sortie>
//      → produit home.png, app.png et info.png dans ce dossier
//        (par ex. node archive/capture.mjs archive/prompt-3_aammjjhhmmss)
//
//   2) Une seule page (compat) :
//        node archive/capture.mjs <fichier-html> <fichier-png-de-sortie>

import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const VIEWPORT = { width: 1440, height: 810 };

async function shoot(browser, htmlFile, outPng) {
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.goto(pathToFileURL(resolve(htmlFile)).href);
  await page.waitForTimeout(400); // laisser le canvas / les polices s'initialiser
  await page.screenshot({ path: resolve(outPng) });
  await page.close();
  console.log('Capture enregistrée :', outPng);
}

const [, , arg1, arg2] = process.argv;

const browser = await chromium.launch({ channel: 'chrome' });

if (arg1 && arg1.endsWith('.html')) {
  // Usage 1 page (compat)
  await shoot(browser, arg1, arg2 || 'archive/capture.png');
} else {
  // Usage 3 interfaces dans un dossier
  const outDir = arg1 || 'archive';
  mkdirSync(resolve(outDir), { recursive: true });
  await shoot(browser, 'index.html', join(outDir, 'home.png'));
  await shoot(browser, 'app.html', join(outDir, 'app.png'));
  await shoot(browser, 'info.html', join(outDir, 'info.png'));
}

await browser.close();
