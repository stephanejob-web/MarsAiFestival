# MarsAiFestival

Projet fullstack React + Express.js TypeScript développé en équipe.

## Stack technique

- **Frontend** : React 19, TypeScript, Vite
- **Backend** : Express.js, TypeScript, ts-node-dev
- **Architecture** : MVC (backend)

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm v9 ou supérieur

## Installation et lancement

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd MarsAiFestival
```

### 2. Installer les dépendances

```bash
npm install
```

> Installe automatiquement les dépendances du backend et du frontend.

### 3. Lancer le projet

```bash
npm start
```

> Lance le backend et le frontend en même temps.

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:5500 |

## Variables d'environnement

Copier les fichiers d'exemple et les compléter :

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Règle équipe — Utilisation des LLMs

> **Avant de coder une nouvelle feature avec un LLM (ChatGPT, Claude, Copilot...), lire obligatoirement :**
> [`frontend/src/prompts/system.md`](./frontend/src/prompts/system.md)

Copier le contenu de ce fichier et le coller en début de conversation avec le LLM.
Cela garantit que le code généré respecte l'architecture et les conventions du projet.

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
├── package.json             # scripts racine
└── README.md
```
