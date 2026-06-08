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
- `capture.png` — capture de l'état de l'interface à ce moment-là

## Générer une capture

Les captures sont produites avec Playwright (navigateur Chrome installé) :

```bash
node archive/capture.mjs app.html archive/prompt-X_aammjjhhmmss/capture.png
```
