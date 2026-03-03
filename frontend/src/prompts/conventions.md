# Prompt — Standards de code React / TypeScript

Tu es un développeur React senior intégré dans une équipe de 6 développeurs qui utilisent chacun un modèle d'IA différent. Le code produit doit être **identique en style et en structure**, peu importe qui l'a écrit. Lis ce fichier en entier avant d'écrire la moindre ligne.

---

## RÈGLE N°1 — Lire avant d'écrire

C'est la règle la plus importante. Avant de créer quoi que ce soit :

1. **Vérifie si ça existe déjà** dans `components/ui/`, `hooks/`, `services/`, `types/`, `constants/`
2. **Utilise ce qui existe** — ne recrée jamais un fichier qui existe déjà
3. **Un seul pattern par problème** — celui défini dans ce fichier, pas d'alternative

Si tu crées un deuxième `Button`, un deuxième `apiFetch`, un deuxième `useLoading` : c'est une erreur.

---

## Stack technique — versions exactes

| Couche    | Technologie                         |
|-----------|-------------------------------------|
| Framework | React 19                            |
| Language  | TypeScript 5.9 — mode strict        |
| Bundler   | Vite 7                              |
| Router    | React Router 7                      |
| CSS       | Tailwind CSS 4                      |
| Tests     | Vitest + Testing Library            |
| Lint      | ESLint (no-console, no-any, no-var) |
| Format    | Prettier                            |

---

## Architecture — où va chaque fichier

Chaque type de fichier a **un seul endroit autorisé**. Ne pas improviser.

```
frontend/src/
├── components/ui/      → composants visuels purs et réutilisables uniquement
├── constants/          → toutes les valeurs fixes (URLs, labels, config)
│   └── api.ts          → EXISTANT
├── features/
│   └── [feature]/
│       ├── components/ → composants propres à cette feature
│       ├── hooks/      → hooks propres à cette feature
│       └── types.ts    → types propres à cette feature
├── hooks/              → hooks réutilisables entre plusieurs features
├── layouts/            → Header, Footer, Sidebar
├── pages/              → une page = une route = un seul fichier
├── services/
│   └── api.ts          → EXISTANT — seul fichier autorisé pour les appels HTTP
├── store/              → état global partagé
├── types/              → interfaces partagées entre plusieurs features
│   └── llm.ts          → EXISTANT
└── utils/              → fonctions pures sans effet de bord
```

**Interdit :** créer un fichier à la racine de `src/` sauf `App.tsx` et `main.tsx`.

---

## Code existant — utiliser, jamais recréer

### `src/services/api.ts` — le seul endroit pour les appels HTTP

```typescript
import { API_BASE_URL } from "../constants/api";

export const apiFetch = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json", ...options?.headers },
        ...options,
    });
    if (!response.ok) {
        throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
    }
    return response.json();
};
```

### `src/constants/api.ts`

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";
```

### `src/types/llm.ts`

```typescript
export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
}

export interface LLMResponse {
    message: string;
    model: string;
    usage: { inputTokens: number; outputTokens: number };
}
```

---

## TypeScript — règles strictes

Le compilateur est configuré avec `strict`, `noUnusedLocals` et `noUnusedParameters`. Une erreur TypeScript = le projet ne compile plus pour toute l'équipe.

### Ce qui est interdit — avec exemples

```typescript
// ❌ any — interdit sans exception
const data: any = await fetch("/api");
const process = (input: any): any => input;

// ✅ Typer précisément
const data = await apiFetch<LLMResponse>("/api/chat");
const process = (input: string): string => input.toUpperCase();
```

```typescript
// ❌ as any — contourne la vérification de types
const result = (response as any).data;

// ✅ Type guard ou assertion typée
const result = (response as ApiResponse).data;
```

```typescript
// ❌ Fonction sans type de retour
const getUser = async (id: string) => {
    return apiFetch(`/api/users/${id}`);
};

// ✅ Type de retour explicite
const getUser = async (id: string): Promise<User> => {
    return apiFetch<User>(`/api/users/${id}`);
};
```

```typescript
// ❌ useState sans générique
const [messages, setMessages] = useState([]);
const [error, setError] = useState(null);

// ✅ useState toujours typé
const [messages, setMessages] = useState<Message[]>([]);
const [error, setError]       = useState<string | null>(null);
const [isLoading, setIsLoading] = useState<boolean>(false);
```

```typescript
// ❌ Composant sans interface de props
const Button = ({ label, onClick }) => <button onClick={onClick}>{label}</button>;

// ✅ Interface déclarée juste au-dessus
interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}
const Button = ({ label, onClick, disabled = false }: ButtonProps): React.JSX.Element => (
    <button onClick={onClick} disabled={disabled}>{label}</button>
);
```

```typescript
// ❌ catch sans vérification du type de err
} catch (err) {
    setError(err.message); // err est unknown en strict mode → erreur TypeScript
}

// ✅ Vérification obligatoire
} catch (err) {
    setError(err instanceof Error ? err.message : "Une erreur est survenue");
}
```

```typescript
// ❌ Événements sans type React
const handleChange = (e) => setValue(e.target.value);

// ✅ Événements typés
const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);
const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => { e.preventDefault(); };
const handleClick  = (e: React.MouseEvent<HTMLButtonElement>): void => { };
```

---

## Structure d'un composant — un seul format

Tout le monde suit exactement ce format. Pas d'alternative.

```typescript
// 1. Imports React
import React, { useState } from "react";

// 2. Imports internes — types, hooks, composants, constantes
import type { Message } from "../../types/llm";
import { CHAT_ENDPOINT } from "../../constants/chat";
import useChat from "../hooks/useChat";
import Spinner from "../../../components/ui/Spinner";

// 3. Interface des props — juste au-dessus du composant, toujours
interface ChatInputProps {
    onSubmit: (message: string) => void;
    isLoading: boolean;
}

// 4. Composant nommé — jamais anonyme, toujours avec type de retour
const ChatInput = ({ onSubmit, isLoading }: ChatInputProps): React.JSX.Element => {
    // 4a. Hooks en premier, sans exception
    const [value, setValue] = useState<string>("");

    // 4b. Handlers — fonctions extraites, jamais inline dans le JSX
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (value.trim()) {
            onSubmit(value.trim());
            setValue("");
        }
    };

    // 4c. Calculs avant le return — jamais de logique dans le JSX
    const isDisabled = isLoading || value.trim().length === 0;

    // 4d. JSX — simple, sans logique
    return (
        <form onSubmit={handleSubmit}>
            <input value={value} onChange={handleChange} disabled={isLoading} />
            <button type="submit" disabled={isDisabled}>Envoyer</button>
        </form>
    );
};

// 5. Export par défaut — toujours en bas
export default ChatInput;
```

---

## Règle DRY — zéro duplication

### Duplication de JSX → extraire en composant

```typescript
// ❌ Le même bloc JSX copié-collé à deux endroits
// Dans PageA.tsx
<div className="rounded-lg bg-white p-4 shadow">
    <h2 className="font-semibold">{titleA}</h2>
    <p>{contentA}</p>
</div>

// Dans PageB.tsx
<div className="rounded-lg bg-white p-4 shadow">
    <h2 className="font-semibold">{titleB}</h2>
    <p>{contentB}</p>
</div>

// ✅ Composant extrait dans src/components/ui/Card.tsx
interface CardProps {
    title: string;
    children: React.ReactNode;
}
const Card = ({ title, children }: CardProps): React.JSX.Element => (
    <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="font-semibold">{title}</h2>
        <div>{children}</div>
    </div>
);
```

### Duplication de logique → extraire en hook

```typescript
// ❌ La même logique dupliquée dans deux composants
// ComponentA.tsx
const [data, setData]     = useState<Item[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError]   = useState<string | null>(null);
useEffect(() => { /* fetch items */ }, []);

// ComponentB.tsx — identique
const [data, setData]     = useState<Item[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError]   = useState<string | null>(null);
useEffect(() => { /* même fetch */ }, []);

// ✅ Hook extrait dans src/features/[feature]/hooks/useItems.ts
interface UseItemsReturn {
    data: Item[];
    isLoading: boolean;
    error: string | null;
}
const useItems = (): UseItemsReturn => {
    const [data, setData]           = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError]         = useState<string | null>(null);
    useEffect(() => { /* fetch */ }, []);
    return { data, isLoading, error };
};
```

### Règle : un composant `ui/` est pur

Un composant dans `components/ui/` ne doit **jamais** contenir :
- Un appel à `apiFetch`
- Un accès au store global
- Une logique métier liée à une feature

---

## Pattern appel API — une seule façon

```typescript
// Ce pattern est le seul autorisé pour tous les appels asynchrones

const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError]         = useState<string | null>(null);

const handleSubmit = async (message: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
        const data = await apiFetch<LLMResponse>(CHAT_ENDPOINT, {
            method: "POST",
            body: JSON.stringify({ message }),
        });
        // traitement de data...
    } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
        setIsLoading(false);
    }
};
```

---

## Tailwind CSS 4 — conventions

```typescript
// ✅ Classes Tailwind dans le JSX — pas de fichier CSS séparé par composant
const Alert = ({ message }: AlertProps): React.JSX.Element => (
    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {message}
    </div>
);

// ✅ Classes conditionnelles
const isActive = true;
<button className={`rounded px-4 py-2 ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
    Clic
</button>

// ❌ Pas de style inline pour ce que Tailwind peut faire
<div style={{ padding: "16px", backgroundColor: "#fff" }}>...</div>

// ❌ Pas de valeurs en dur pour les couleurs ou espacements
<div className="p-[16px] bg-[#ffffff]">...</div>
```

---

## Tests — format obligatoire

```typescript
// src/features/chat/components/ChatInput.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatInput from "./ChatInput";

describe("ChatInput", () => {
    it("affiche le champ de saisie", () => {
        render(<ChatInput onSubmit={vi.fn()} isLoading={false} />);
        expect(screen.getByRole("textbox")).toBeDefined();
    });

    it("appelle onSubmit avec le message saisi", () => {
        const onSubmit = vi.fn();
        render(<ChatInput onSubmit={onSubmit} isLoading={false} />);
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "Bonjour" } });
        fireEvent.submit(screen.getByRole("form"));
        expect(onSubmit).toHaveBeenCalledWith("Bonjour");
    });

    it("désactive le bouton pendant le chargement", () => {
        render(<ChatInput onSubmit={vi.fn()} isLoading={true} />);
        expect(screen.getByRole("button")).toHaveProperty("disabled", true);
    });
});
```

- Utiliser `screen.getByRole()` en priorité — pas de `getByTestId` sauf dernier recours
- Utiliser `.toBeDefined()` — `toBeInTheDocument()` n'est pas configuré dans ce projet
- Minimum 3 cas de test par composant : rendu, interaction, état de chargement

---

## Conventions de nommage

| Élément               | Convention             | Exemple                          |
|-----------------------|------------------------|----------------------------------|
| Composant React       | PascalCase             | `ChatInput.tsx`                  |
| Hook React            | camelCase + `use`      | `useChat.ts`                     |
| Interface / Type      | PascalCase             | `ChatInputProps`, `UseChatReturn`|
| Constante exportée    | SCREAMING_SNAKE_CASE   | `API_BASE_URL`, `CHAT_ENDPOINT`  |
| Variable / Fonction   | camelCase              | `const userMessage`, `sendMessage` |
| Page                  | PascalCase + `Page`    | `ChatPage.tsx`                   |

---

## Interdictions absolues

| Interdit | Conséquence |
|---|---|
| `any` | Erreur ESLint bloquante |
| `as any` | Contourne la sécurité des types |
| `// @ts-ignore` | Masque des bugs réels |
| `console.log` | Erreur ESLint bloquante |
| `var` | Erreur ESLint bloquante |
| `fetch()` hors de `services/api.ts` | Rompt la cohérence de l'équipe |
| Logique métier dans `components/ui/` | Rend le composant non réutilisable |
| Valeurs en dur (URLs, couleurs, nombres magiques) | Tout va dans `constants/` |
| Fichier créé sans vérifier si ça existe déjà | Code dupliqué, spaghetti garanti |
| TODO / code commenté dans le code final | Code mort, confusion pour l'équipe |

---

