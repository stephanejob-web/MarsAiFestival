#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Script de déploiement — à lancer sur le VPS après un git pull
# ─────────────────────────────────────────────────────────────────────────────
set -e

echo "Arrêt des conteneurs..."
docker compose -f docker-compose.prod.yml down

echo "Build et démarrage..."
docker compose -f docker-compose.prod.yml up -d --build

echo "Nettoyage des anciennes images..."
docker image prune -f

echo "Déploiement terminé !"
docker compose -f docker-compose.prod.yml ps
