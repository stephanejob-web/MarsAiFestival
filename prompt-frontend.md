# Guide — Comment utiliser ton modèle IA sur ce projet

Ce fichier explique comment travailler avec ton IA (Claude, Gemini, ChatGPT…) sur le projet MarsAiFestival. Lis-le une fois avant de commencer.

---

## Avant de coder — étape 1

Ouvre une nouvelle conversation avec ton modèle IA et commence par lui dire :

> "Lis ce fichier et respecte toutes les règles qu'il contient pour tout le code que tu vas écrire."

Puis colle le contenu du fichier :

```
frontend/src/prompts/conventions.md
```

Ton modèle connaît maintenant les règles du projet. Tu peux lui demander de coder ta feature.

---

## Tu codes ta feature — étape 2

Travaille normalement avec ton modèle. Demande-lui de coder ce dont tu as besoin.

Tant que tu n'es pas satisfait du résultat, continue d'échanger avec lui dans la même conversation.

---

## La feature te convient — étape 3

Une fois que tu es satisfait de ce que ton modèle a produit, dis-lui :

> "Lis ce fichier et applique tout ce qu'il demande sur le code qu'on vient d'écrire."

Puis colle le contenu du fichier :

```
frontend/src/prompts/review.md
```

Ton modèle va relire le code, corriger les erreurs, formater, et écrire les tests. Il tourne en boucle jusqu'à ce que tout soit propre.

---

## Résumé

```
1. Nouvelle conversation
      ↓
2. Colle conventions.md  →  ton modèle apprend les règles
      ↓
3. Tu codes ta feature
      ↓
4. Tu es satisfait ?  →  Colle review.md
      ↓
5. Ton modèle nettoie et valide tout
```

---

## Où sont les fichiers

```
frontend/src/prompts/
├── conventions.md   → les règles de code à donner avant de coder
└── review.md        → la revue qualité à lancer une fois la feature terminée
```
