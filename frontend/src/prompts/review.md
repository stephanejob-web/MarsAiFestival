# Prompt — Revue qualité post-feature

La feature est développée et validée fonctionnellement. Tu passes maintenant en mode **reviewer senior**. Tu n'es plus l'auteur du code — tu es quelqu'un d'autre qui le relit avec un œil critique.

Ton objectif : rendre ce code propre, robuste et maintenable pour une équipe de 6 développeurs.

---

## Étape 1 — Diagnostic initial

Lance d'abord la commande de vérification complète et lis chaque erreur :

```bash
npm run check --prefix frontend
```

Note toutes les erreurs. Tu les corrigeras dans l'ordre des étapes suivantes.

---

## Étape 2 — ESLint : corriger toutes les violations

Corrige chaque violation ESLint signalée. Les règles actives dans ce projet :

| Règle | Ce qu'elle interdit |
|---|---|
| `no-console` | Tout `console.log`, `console.error`, `console.warn` |
| `no-var` | Toute déclaration `var` |
| `@typescript-eslint/no-explicit-any` | Tout type `any` |
| `react-hooks/rules-of-hooks` | Hooks appelés conditionnellement ou dans des boucles |
| `react-hooks/exhaustive-deps` | Dépendances manquantes dans `useEffect` |

**Règle :** ne jamais désactiver une règle ESLint avec `// eslint-disable`. Corriger le code.

---

## Étape 3 — Prettier : formater tout le code modifié

```bash
npm run format --prefix frontend
```

Prettier applique automatiquement :
- Indentation à 4 espaces
- Guillemets doubles
- Point-virgule en fin de ligne
- Virgule trailing dans les objets et tableaux multi-lignes

Ne pas reformater manuellement — laisser Prettier décider.

---

## Étape 4 — Relecture TypeScript critique

Relis chaque fichier de la feature comme si tu ne l'avais pas écrit. Vérifie point par point :

### Types

```typescript
// ❌ À corriger — type trop large
const handleData = (data: object): void => { ... };

// ✅ Type précis
const handleData = (data: ApiResponse): void => { ... };
```

```typescript
// ❌ À corriger — assertion non vérifiée
const user = response as User;

// ✅ Validation avant assertion
if (!isUser(response)) throw new Error("Réponse invalide");
const user = response as User;
```

- [ ] Chaque `useState` a son générique
- [ ] Chaque fonction a son type de retour
- [ ] Chaque interface de props est déclarée et nommée
- [ ] Aucun paramètre ou variable déclaré mais inutilisé (`noUnusedLocals`, `noUnusedParameters`)

### Logique

- [ ] Chaque appel asynchrone gère `isLoading`, `error` et le bloc `finally`
- [ ] Les erreurs sont affichées à l'utilisateur — jamais ignorées silencieusement
- [ ] Aucun effet de bord dans le rendu (pas de mutation d'état dans le corps du composant)
- [ ] Les `useEffect` ont toutes leurs dépendances déclarées

---

## Étape 5 — Détection des duplications

Relis l'ensemble de la feature et pose-toi ces questions :

**Pour le JSX :**
> Est-ce que ce bloc HTML/JSX apparaît plus d'une fois, même légèrement différent ?

Si oui → extraire en composant dans `components/ui/` ou `features/[feature]/components/`.

**Pour la logique :**
> Est-ce que ces lignes `useState` + `useEffect` ou ce pattern de fetch se répètent dans plusieurs composants ?

Si oui → extraire en hook dans `features/[feature]/hooks/` ou `hooks/`.

**Pour les valeurs :**
> Est-ce qu'il y a des chaînes, URLs, nombres écrits directement dans le code ?

Si oui → déplacer dans `constants/`.

---

## Étape 6 — Écriture des tests unitaires pertinents

Un test pertinent vérifie un **comportement observable**, pas un détail d'implémentation.

### Ce qu'on teste

| Scénario | Exemple de test |
|---|---|
| Rendu nominal | Le composant affiche les données attendues |
| Interaction utilisateur | Un clic / une saisie déclenche la bonne action |
| État de chargement | Le bouton est désactivé, un spinner est visible |
| Affichage d'erreur | Un message d'erreur apparaît si l'API échoue |
| Cas limite | Champ vide, liste vide, valeur nulle |

### Ce qu'on ne teste pas

- Les noms de variables internes
- L'état React directement (`useState`)
- Les détails CSS ou les classes Tailwind
- Ce que fait la librairie elle-même (React, React Router…)

### Format obligatoire

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ComponentName from "./ComponentName";

// Mock des dépendances externes uniquement
vi.mock("../../../services/api", () => ({
    apiFetch: vi.fn(),
}));

describe("ComponentName", () => {
    // Cas nominal — ce que voit l'utilisateur dans le cas normal
    it("affiche [élément attendu] au rendu", () => {
        render(<ComponentName prop="valeur" />);
        expect(screen.getByRole("heading", { name: /titre/i })).toBeDefined();
    });

    // Interaction utilisateur
    it("appelle [action] quand l'utilisateur [fait quelque chose]", async () => {
        const onAction = vi.fn();
        render(<ComponentName onAction={onAction} />);
        fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));
        expect(onAction).toHaveBeenCalledTimes(1);
    });

    // État de chargement
    it("désactive le bouton pendant le chargement", () => {
        render(<ComponentName isLoading={true} />);
        expect(screen.getByRole("button")).toHaveProperty("disabled", true);
    });

    // Affichage d'erreur
    it("affiche un message d'erreur si l'API échoue", async () => {
        const { apiFetch } = await import("../../../services/api");
        vi.mocked(apiFetch).mockRejectedValue(new Error("Serveur indisponible"));

        render(<ComponentName />);
        fireEvent.submit(screen.getByRole("form"));

        await waitFor(() => {
            expect(screen.getByText(/serveur indisponible/i)).toBeDefined();
        });
    });

    // Cas limite
    it("désactive le bouton si le champ est vide", () => {
        render(<ComponentName />);
        expect(screen.getByRole("button", { name: /envoyer/i })).toHaveProperty("disabled", true);
    });
});
```

### Règle : minimum 4 cas de test par composant

1. Rendu nominal
2. Interaction principale
3. État de chargement (`isLoading`)
4. Gestion d'erreur ou cas limite

---

## Étape 7 — Boucle de correction jusqu'au vert

Lance la commande suivante :

```bash
npm run check --prefix frontend
```

**Tu répètes cette boucle sans t'arrêter jusqu'à ce que tout soit vert :**

```
npm run check échoue ?
        │
        ▼
  Lis chaque erreur attentivement
        │
        ▼
  Corrige le fichier fautif
        │
        ▼
  Relance npm run check
        │
        ▼
  Tout est vert ? → Terminé
```

### Erreur TypeScript → lis le message complet

Le compilateur indique le fichier, la ligne et la raison. Corrige exactement ce qui est signalé. Ne contourne pas l'erreur avec `// @ts-ignore` ou `as any`.

### Erreur ESLint → corrige le code, jamais la règle

Ne jamais ajouter `// eslint-disable` pour faire taire une règle. L'erreur ESLint signale un vrai problème — corrige le code.

### Test en échec → relis le test et le composant

Un test qui échoue signale soit un bug dans le composant, soit un test mal écrit. Identifie lequel et corrige.

### Résultat attendu — les 3 lignes en vert

```
✓ tsc --noEmit        → 0 erreur TypeScript
✓ eslint .            → 0 violation
✓ vitest run          → tous les tests passent
```

**Tant que cette sortie n'est pas atteinte, tu continues de corriger. Sans exception.**

---

## Étape 8 — Rapport de revue

Une fois tout corrigé, fournis un rapport structuré :

```
## Rapport de revue — [nom de la feature]

### Corrections ESLint / Prettier
- [liste des corrections appliquées]

### Corrections TypeScript
- [liste des types corrigés ou ajoutés]

### Extractions (DRY)
- [composant ou hook extrait, avec son chemin]

### Tests ajoutés
- [NomComposant.test.tsx] — X cas de test
  - ✓ [description du cas 1]
  - ✓ [description du cas 2]
  - ...

### Résultat npm run check
✓ tsc — 0 erreur
✓ eslint — 0 violation
✓ vitest — X tests passent
```
