# Workflow Complet Projet

> **Stack :** React · Express · MySQL
> **Équipe :** 6 développeurs · Claude · Copilot · CodeRabbit

---

## Vue d'ensemble

```
Maquette HTML → Design System → Tâche Trello → Feature Branch
    → Dev + IA → npm run check → PR → CI → CodeRabbit → Review → Merge
```

---

## 1. Client

- Valide la maquette HTML
- La maquette devient **source de vérité**

---

## 2. Maquette HTML

```
/mockups
  ├── dashboard.html
  ├── login.html
  ├── README.md        ← contexte pour l'IA
  └── UI_RULES.md      ← règles visuelles pour l'IA
```

Bonnes pratiques dans les fichiers HTML :

- Commenter les blocs pour identifier les futurs composants
- Utiliser des `data-component="Navbar"` pour nommer les blocs
- Nommer les classes CSS comme les futurs composants React

---

## 3. Design System

- Transformer le HTML en composants React
- Conserver le CSS, classes et design existants
- Stocker dans `/frontend/components`

---

## 4. Docs & AI Rules

```
/docs
  ├── architecture.md
  ├── database.md
  └── business-rules.md

.ai-rules.md           ← conventions React, TypeScript strict,
                          tests obligatoires, pas de inline style, etc.
```

> L'IA lit ces fichiers **avant** de coder.

---

## 5. Tâche Trello

Exemple de carte Trello :

| Champ       | Valeur                                     |
|-------------|--------------------------------------------|
| Titre       | `#32 - Créer la navigation principale`     |
| Étiquette   | `Frontend / Feature`                       |
| Assigné     | développeur                                |

**Description :**
- Créer la Navbar correspondant à la maquette
- Réutiliser composants existants (`Logo`, `MenuItem`)
- Responsive desktop et mobile
- Ajouter routes React Router existantes
- Ajouter tests unitaires pour rendu et clic

**Checklist :**
- [ ] Créer composant `Navbar.tsx`
- [ ] Ajouter props nécessaires
- [ ] Ajouter tests `Navbar.test.tsx`
- [ ] Vérifier ESLint + Prettier
- [ ] Commit `feat(navbar): créer la navigation principale`
- [ ] PR ouverte vers `develop`
- [ ] CodeRabbit review
- [ ] Validation humaine

---

## 6. Feature Branch

Nommage : `feature/#<numéro-tâche>-<nom-feature>`

```bash
git checkout -b feature/#32-navbar
```

> Le dev crée sa branche **avant** de coder.

---

## 7. Prompt IA Standard

```
Tu es un développeur senior IA.
Lis tous les fichiers dans /docs et .ai-rules.md avant de coder.
Tâche : implémenter la fonctionnalité suivante : [Nom de la feature]

Règles importantes :
- Respecter exactement le design de la maquette HTML
- Réutiliser composants existants
- Composant React fonctionnel en TypeScript
- Responsive si nécessaire
- Ajouter tests unitaires pour toutes nouvelles fonctions
- ESLint et Prettier obligatoires
- Retourner uniquement les fichiers modifiés ou créés
- Ajouter commentaires courts pour le code complexe

À la fin, fournis un résumé de ce qui a été créé/modifié.
```

**Exemple pour Navbar :**

```
Tâche : Création de la navigation principale (Navbar)
Fichiers générés :
  - /frontend/components/Navbar.tsx
  - /frontend/tests/Navbar.test.tsx
```

---

## 8. Développeur

1. Lit la carte Trello
2. Lance le prompt IA (Claude ou Copilot)
3. Écrit ses propres tests unitaires
4. Vérifie le code : `npm run check`

---

## 9. `npm run check`

| Étape         | Outil      |
|---------------|------------|
| Tests         | Jest / Vitest |
| Lint          | ESLint     |
| Formatage     | Prettier   |
| Types         | TypeScript |

```
npm run check
```

```
Si erreur  → commit et PR bloqués → dev corrige → relance check
Si tout OK → commit + push sur feature branch
```

**Convention de commit :**

```
type(scope): description courte

feat(navbar): créer la navigation principale
fix(users): corriger crash null pointer
test(order): ajouter tests API commandes
```

---

## 10. Pull Request

- PR ouverte vers `develop`
- **CI automatique :**
  - `npm test`
  - `eslint`
  - `prettier`
  - `build`

> Si erreur CI → PR bloquée jusqu'à correction.

---

## 11. IA Code Review — CodeRabbit

CodeRabbit analyse automatiquement la PR :

- Bugs potentiels
- Failles de sécurité
- Performance
- Duplication de code
- Résumé de la PR

> Commentaires automatiques directement dans la PR.

---

## 12. Review Humaine

- Tous les devs lisent la PR
- Petites demandes d'ajustement IA possibles (pas de gros refactor)
- Validation finale avant merge

---

## 13. Merge & Release

```
feature/#32-navbar → develop → main (production)
```

- Merge `develop` après validation IA + humains
- Merge `main` pour la mise en production

---

## 14. Workflow Complet — Récapitulatif

```
 1. Tâche Trello assignée
       ↓
 2. Créer feature branch
       ↓
 3. Préparer prompt IA (dans /prompts)
       ↓
 4. Dev + IA coding
       ↓
 5. Écrire tests unitaires
       ↓
 6. npm run check  (lint + prettier + TS + tests)
       ↓
 7. Commit + push
       ↓
 8. Ouvrir Pull Request → develop
       ↓
 9. CI automatique
       ↓
10. CodeRabbit review
       ↓
11. Review équipe
       ↓
12. Merge develop
       ↓
13. Release main  →  Production
```
