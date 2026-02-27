# MarsAiFestival

Projet fullstack React + Express.js TypeScript développé en équipe.

## Comment fonctionne le projet ?

Le projet est divisé en deux parties qui tournent en même temps :

- **Le frontend** (ce que l'utilisateur voit dans son navigateur) : une application React sur le port `5173`
- **Le backend** (le serveur qui gère les données) : une API Express.js sur le port `5500`

```
Navigateur  →  Frontend React (localhost:5173)
                     ↕ appels API
              Backend Express (localhost:5500)
```

Le dossier racine contient un seul `package.json` qui orchestre les deux. Avec un seul `npm install` et un seul `npm start`, tout se lance automatiquement.

## Stack technique

- **Frontend** : React 19, TypeScript, Vite
- **Backend** : Express.js, TypeScript, ts-node-dev
- **Base de données** : MySQL
- **Architecture** : MVC (backend)
- **Conteneurisation** : Docker + Docker Compose

## Prérequis

### Option A — Avec Docker (recommandé)

- [Docker](https://docs.docker.com/get-docker/) v24 ou supérieur
- [Docker Compose](https://docs.docker.com/compose/install/) v2 ou supérieur

> Pour vérifier : `docker --version` et `docker compose version`

### Option B — Sans Docker

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm v9 ou supérieur
- MySQL v8 ou supérieur

> Pour vérifier : `node -v`, `npm -v` et `mysql --version` dans un terminal.

## Lancer le projet

Toutes les commandes se lancent **depuis le dossier racine** `MarsAiFestival/`. Ne pas aller dans `backend/` ou `frontend/`.

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd MarsAiFestival
```

### Option A — Avec Docker (recommandé)

#### 2. Installer les dépendances localement (pour l'IDE)

```bash
npm install
```

> Cette étape installe les `node_modules` en local **uniquement pour VSCode** (autocompletion TypeScript, ESLint, Prettier).
> Docker utilise ses propres `node_modules` séparés — il n'y a aucun conflit.

#### 3. Lancer le projet

```bash
docker compose up --build
```

> Les fois suivantes, `docker compose up` suffit (pas besoin de `--build`).
> Rebuilder uniquement si `package.json` change : `docker compose up --build`

Pour arrêter :

```bash
docker compose down        # arrêter les containers
docker compose down -v     # arrêter + supprimer les données MySQL
```

**Hot reload inclus** : modifie un fichier dans `frontend/src/` ou `backend/src/` → les changements sont appliqués instantanément, sans rebuild.

### Option B — Sans Docker

#### 2. Configurer les variables d'environnement

```bash
cp backend/.env.example backend/.env
```

Ouvre `backend/.env` et remplis tes valeurs :

```env
PORT=5500

DB_HOST=localhost
DB_PORT=3306
DB_NAME=marsaifestival
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
```

> Le fichier `.env` est ignoré par Git. Ne jamais le committer.

#### 3. Installer les dépendances

```bash
npm install
```

> Installe tout en une fois : le backend et le frontend.

#### 4. Lancer le projet

```bash
npm start
```

Ouvre ensuite `http://localhost:5173` dans ton navigateur.

### Ports

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:5500 |
| MySQL    | localhost:33060 (Docker uniquement) |

## Qualité du code

| Outil    | Rôle                                              |
|----------|---------------------------------------------------|
| Prettier | Formatage automatique du code                     |
| ESLint   | Détection des erreurs et mauvaises pratiques      |
| Vitest   | Tests unitaires et d'intégration                  |
| Husky    | Bloque le push si `npm run check` échoue          |

### Commandes disponibles

```bash
npm run format       # formate tous les fichiers source
npm run lint         # vérifie le code (erreurs + warnings)
npm run test         # lance tous les tests
npm run check        # format + lint + tests en parallèle
```

### Hook git pre-push

`npm run check` est lancé automatiquement à chaque `git push`.
Si le format, le lint ou les tests échouent, le push est bloqué.

> Les hooks sont installés automatiquement via `npm install` — aucune action manuelle requise.

## Règle équipe — Utilisation des LLMs

> **Avant de coder une nouvelle feature avec un LLM (ChatGPT, Claude, Copilot...) :**
> 1. Ouvrir le prompt correspondant à ta partie du projet
> 2. Copier l'intégralité du fichier et le coller en **premier message** dans ta conversation
> 3. Répondre aux questions que l'IA te pose avant qu'elle génère du code

| Partie | Prompt |
|--------|--------|
| Frontend (React) | [`frontend/src/prompts/feature.md`](./frontend/src/prompts/feature.md) |
| Backend (Express) | [`backend/src/prompts/feature.md`](./backend/src/prompts/feature.md) |

Ces prompts garantissent que le code généré respecte l'architecture, les conventions et les règles strictes du projet.

## Structure du projet

```
MarsAiFestival/
├── backend/
│   └── src/
│       ├── config/          # configuration (db, env...)
│       ├── controllers/     # logique des requêtes
│       ├── middlewares/     # middlewares Express
│       ├── models/          # modèles de données
│       ├── routes/          # définition des routes
│       ├── services/        # logique métier
│       ├── types/           # types TypeScript partagés
│       ├── app.ts           # configuration Express
│       └── index.ts         # point d'entrée
├── frontend/
│   └── src/                 # composants React
├── Dockerfile.backend       # image Docker backend (dev)
├── Dockerfile.frontend      # image Docker frontend (dev)
├── docker-compose.yml       # orchestration des 3 services
├── .dockerignore            # fichiers exclus du build Docker
├── .prettierrc              # règles de formatage
├── package.json             # scripts racine
└── README.md
```
