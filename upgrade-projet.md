# Améliorations projet Bayes

## À faire avant la soutenance (consigne obligatoire)

### Schéma explicatif
La consigne liste explicitement "Un schéma explicatif" dans les contraintes obligatoires.
Le pipeline texte `ENTRÉES → MODÈLE → ALGO → POSTERIOR → UI` ne suffit pas.

Ajouter dans la page "Les maths" (page-math) un vrai schéma visuel, par exemple :
- Un arbre de probabilités (prior → test+ / test- → posterior)
- Ou un diagramme avant/après mise à jour bayésienne avec les chiffres de l'exemple médical

Effort estimé : 20-30 min.

---

## Bonus (pas nécessaire pour la note, mais bien en soutenance)

### Expliquer le choix de la forme cote
Dans la page maths, après le bloc de code, ajouter une ligne expliquant *pourquoi*
la forme cote est préférée à la formule directe :
> stabilité numérique quand le prior est très petit (ex : 0,001) — la multiplication
> de ratios évite les underflows flottants.

Ça fait très bien à l'oral et montre qu'on a compris au-delà de la formule.

### Légende chiffrée sur la grille médicale
La grille de 1 000 points est bien, mais afficher en dessous :
`X vrais positifs · Y faux positifs · Z non détectés`
rendrait la visualisation encore plus immédiatement lisible.
