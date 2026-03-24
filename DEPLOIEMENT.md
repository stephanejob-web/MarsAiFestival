# Déploiement — MarsAI Festival

Production sur `http://marsai.lightchurch.fr:8080` (VPS OVH `51.254.131.39`)

---

## Prérequis

- Docker installé sur le VPS
- Sous-domaine `marsai.lightchurch.fr` créé sur OVH DNS → pointant vers `51.254.131.39`

---

## Étape 1 — OVH : Créer le sous-domaine

1. Se connecter sur [ovh.com](https://ovh.com)
2. **Web Cloud** → **Noms de domaine** → `lightchurch.fr`
3. Onglet **Zone DNS** → **Ajouter une entrée**
4. Remplir :
   - Type : `A`
   - Sous-domaine : `marsai`
   - Cible : `51.254.131.39`
5. Confirmer et attendre la propagation (5 à 30 min)

Vérification :
```bash
ping marsai.lightchurch.fr
# doit répondre avec 51.254.131.39
```

---

## Étape 2 — VPS : Premier déploiement

### 2.1 Se connecter au VPS

```bash
ssh user@51.254.131.39
```

### 2.2 Cloner le projet

```bash
git clone https://github.com/ton-repo/MarsAiFestival
cd MarsAiFestival
```

### 2.3 Créer le fichier `.env`

```bash
cp .env.example .env
nano .env
```

Remplir toutes les valeurs :

```env
DB_NAME=marsai
DB_USER=root
DB_PASSWORD=un-mot-de-passe-fort

JWT_SECRET=une-longue-chaine-aleatoire

GOOGLE_CLIENT_ID=...
VITE_GOOGLE_CLIENT_ID=...

SCALEWAY_ACCESS_KEY=...
SCALEWAY_SECRET_KEY=...
SCALEWAY_ENDPOINT=https://s3.fr-par.scw.cloud
SCALEWAY_BUCKET_NAME=tln
SCALEWAY_REGION=fr-par
SCALEWAY_FOLDER=grp1

EMAIL_USER=...
EMAIL_PASS=...

LIVEKIT_URL=...
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...

YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...

FRONTEND_URL=http://marsai.lightchurch.fr:8080
```

### 2.4 Lancer le projet

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Le site est accessible sur `http://marsai.lightchurch.fr:8080`

---

## Mise à jour du projet (après un git push)

```bash
cd MarsAiFestival
git pull
bash deploy.sh
```

---

## Commandes utiles sur le VPS

```bash
# Voir les logs en temps réel
docker compose -f docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker compose -f docker-compose.prod.yml logs -f backend

# État des conteneurs
docker compose -f docker-compose.prod.yml ps

# Arrêter tout
docker compose -f docker-compose.prod.yml down

# Repartir de zéro (supprime la base de données !)
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Structure des fichiers de déploiement

```
├── docker-compose.prod.yml     orchestration production
├── .env.example                modèle des variables d'environnement
├── .env                        variables réelles (jamais committé dans git)
├── deploy.sh                   script de mise à jour
├── nginx/
│   └── default.conf            config nginx (proxy + frontend)
├── frontend/
│   └── Dockerfile.prod         build React → nginx
└── backend/
    └── Dockerfile.prod         compile TypeScript → node
```
