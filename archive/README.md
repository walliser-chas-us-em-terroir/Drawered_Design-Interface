# Archive des prompts

Ce dossier archive **chaque requête** faite à l'assistant et son résultat.

## Convention

Pour chaque requête, un sous-dossier est créé :

```
prompt-X_aammjjhhmmss/
```

- `X` — numéro de la requête (incrémental : 1, 2, 3, …)
- `aa` — année (2 chiffres) · `mm` — mois · `jj` — jour
- `hh` — heure · `mm` — minutes · `ss` — secondes

Chaque sous-dossier contient :

- `prompt.md` — le prompt de l'utilisateur (verbatim) + le résultat produit (résumé)
- `home.png`, `app.png`, `info.png` — captures des 3 interfaces à ce moment-là

## Générer les captures

Les captures sont produites avec Playwright (navigateur Chrome installé). Un seul appel
capture les 3 interfaces (accueil, app, info) dans le dossier indiqué :

```bash
node archive/capture.mjs archive/prompt-X_aammjjhhmmss
```

Usage compat (une seule page) : `node archive/capture.mjs app.html sortie.png`.
