# Feature — Soumission de film

## Objectif
Le réalisateur soumet son film via le formulaire 4 étapes.
La vidéo passe d'abord par YouTube (validation), puis est uploadée sur Scaleway S3.

---

## Flux cible

```
Réalisateur → Formulaire → POST /api/films
                                ↓
                          Upload YouTube
                                ↓
                       YouTube valide la vidéo
                                ↓
                          Upload Scaleway S3
                                ↓
                        Sauvegarde MySQL
                                ↓
                       Email de confirmation
```

---

## Ce qui est fait ✅

- [x] Formulaire frontend 4 étapes (Step1 à Step4)
- [x] Validation côté client (champs requis, âge 18+, durée vidéo 58-62s)
- [x] `submitForm()` construit un `FormData` et envoie `POST /api/films`
- [x] Backend reçoit les données via `multer` (texte + fichiers)
- [x] Backend génère un `dossierNum` (MAI-2026-XXXXX) et le renvoie
- [x] Frontend affiche l'écran de vérification email avec le dossierNum
- [x] Route `POST /api/films` créée dans Express

---

## Ce qui reste à faire ❌

### 1. Intégration YouTube API
- [ ] Obtenir une clé API YouTube (OAuth2 — nécessaire pour upload)
- [ ] Installer `googleapis` côté backend
- [ ] Créer un service `youtube.service.ts` pour uploader la vidéo
- [ ] Attendre le statut `processed` de YouTube (polling ou webhook)
- [ ] Stocker l'URL/ID YouTube dans la base MySQL

### 2. Intégration Scaleway S3
- [ ] Ajouter les variables d'env Scaleway dans `backend/.env`
  ```
  SCALEWAY_ACCESS_KEY=SCW3MFQBR803FXZS4N33
  SCALEWAY_SECRET_KEY=c64db8bf-f541-478d-aa6a-cbcb8c7be2ae
  SCALEWAY_ENDPOINT=https://s3.fr-par.scw.cloud
  SCALEWAY_BUCKET_NAME=tln
  SCALEWAY_REGION=fr-par
  SCALEWAY_FOLDER=grp???   ← à définir selon le groupe
  ```
- [ ] Installer `@aws-sdk/client-s3` (compatible Scaleway)
- [ ] Créer un service `s3.service.ts` pour uploader vidéo + sous-titres
- [ ] Upload déclenché APRÈS validation YouTube

### 3. Base de données MySQL
- [ ] Créer les tables (migrations) :
  - `realisateurs` (infos profil step 1)
  - `films` (infos film step 2 + 3)
  - `soumissions` (dossierNum, statut, dates)
- [ ] Créer les modèles correspondants dans `backend/src/models/`
- [ ] Sauvegarder le dossier complet après upload S3 réussi

### 4. Vérification email (OTP)
- [ ] Générer un vrai code OTP côté backend (remplacer `123456` hardcodé)
- [ ] Envoyer l'email via un service SMTP (ex: Nodemailer + SMTP Scaleway ou SendGrid)
- [ ] Route `POST /api/films/verify-otp` pour vérifier le code
- [ ] Expiration du code (ex: 10 minutes)

### 5. Gestion des erreurs frontend
- [ ] Afficher un message d'erreur si le POST échoue (actuellement : `setSubmissionState("idle")` silencieux)
- [ ] Gérer les erreurs réseau / timeout

---

## Config S3 à utiliser (prof)

| Variable               | Valeur                                      |
|------------------------|---------------------------------------------|
| SCALEWAY_ACCESS_KEY    | SCW3MFQBR803FXZS4N33                       |
| SCALEWAY_SECRET_KEY    | c64db8bf-f541-478d-aa6a-cbcb8c7be2ae        |
| SCALEWAY_ENDPOINT      | https://s3.fr-par.scw.cloud                 |
| SCALEWAY_BUCKET_NAME   | tln                                         |
| SCALEWAY_REGION        | fr-par                                      |
| SCALEWAY_FOLDER        | grp??? ← à modifier selon le groupe         |

---

## Fichiers clés

| Rôle                        | Chemin                                                              |
|-----------------------------|---------------------------------------------------------------------|
| Hook formulaire             | `frontend/src/features/formulaire/hooks/useFormDepot.ts`           |
| Service API frontend        | `frontend/src/services/api.ts`                                      |
| Controller film             | `backend/src/controllers/film.controller.ts`                       |
| Route film                  | `backend/src/routes/film.routes.ts`                                |
| App Express                 | `backend/src/app.ts`                                               |
| Config DB                   | `backend/src/config/db.ts`                                         |
| .env backend (exemple)      | `backend/.env.example`                                             |
