#!/usr/bin/env node
/**
 * seed-s3.js — Uploade une vidéo test sur S3 pour chaque dossier du seed.sql
 *
 * Usage :
 *   node scripts/seed-s3.js                         → télécharge une vidéo test automatiquement
 *   node scripts/seed-s3.js /chemin/vers/video.mp4  → utilise une vidéo locale
 *
 * Prérequis :
 *   - Le fichier .env doit être présent dans /backend (SCALEWAY_* configurés)
 *   - seed.sql doit avoir été exécuté avant (les dossiers doivent exister en BDD)
 */

require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// ── Numéros de dossier à créer sur S3 (doivent correspondre à seed.sql) ────────
const DOSSIERS = [
  "MAI-2026-10001",
  "MAI-2026-10002",
  "MAI-2026-10003",
  "MAI-2026-10004",
  "MAI-2026-10005",
  "MAI-2026-10006",
  "MAI-2026-10007",
  "MAI-2026-10008",
  "MAI-2026-10009",
  "MAI-2026-10010",
];

// ── Config S3 (depuis .env) ──────────────────────────────────────────────────
const s3 = new S3Client({
  region: process.env.SCALEWAY_REGION ?? "fr-par",
  endpoint: process.env.SCALEWAY_ENDPOINT ?? "https://s3.fr-par.scw.cloud",
  credentials: {
    accessKeyId: process.env.SCALEWAY_ACCESS_KEY ?? "",
    secretAccessKey: process.env.SCALEWAY_SECRET_KEY ?? "",
  },
});

const BUCKET = process.env.SCALEWAY_BUCKET_NAME ?? "tln";
const FOLDER = process.env.SCALEWAY_FOLDER ?? "grp1";

// ── Téléchargement d'une vidéo test publique ─────────────────────────────────
const TEST_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

function download(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        // Suivre les redirections
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} pour ${url}`));
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

// ── Upload d'un buffer vers S3 ───────────────────────────────────────────────
async function upload(buffer, dossierNum) {
  const key = `${FOLDER}/${dossierNum}/video-test.mp4`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "video/mp4",
    }),
  );
  return `${process.env.SCALEWAY_ENDPOINT}/${BUCKET}/${key}`;
}

// ── Point d'entrée ───────────────────────────────────────────────────────────
async function main() {
  // Vérification des credentials
  if (!process.env.SCALEWAY_ACCESS_KEY || !process.env.SCALEWAY_SECRET_KEY) {
    console.error("❌ SCALEWAY_ACCESS_KEY et SCALEWAY_SECRET_KEY doivent être définis dans .env");
    process.exit(1);
  }

  // Récupération de la vidéo (argument local ou téléchargement)
  let videoBuffer;
  const localPath = process.argv[2];

  if (localPath) {
    const resolved = path.resolve(localPath);
    if (!fs.existsSync(resolved)) {
      console.error(`❌ Fichier introuvable : ${resolved}`);
      process.exit(1);
    }
    console.log(`📂 Utilisation du fichier local : ${resolved}`);
    videoBuffer = fs.readFileSync(resolved);
  } else {
    console.log(`⬇️  Téléchargement de la vidéo test depuis :`);
    console.log(`   ${TEST_VIDEO_URL}`);
    console.log("   (cela peut prendre quelques secondes...)\n");
    videoBuffer = await download(TEST_VIDEO_URL);
    console.log(`✅ Vidéo téléchargée — ${(videoBuffer.length / 1024 / 1024).toFixed(2)} Mo\n`);
  }

  // Upload pour chaque dossier
  console.log(`🚀 Upload vers S3 (bucket: ${BUCKET}, dossier racine: ${FOLDER}/)\n`);

  let success = 0;
  let errors = 0;

  for (const dossierNum of DOSSIERS) {
    try {
      const url = await upload(videoBuffer, dossierNum);
      console.log(`  ✅ ${dossierNum}  →  ${url}`);
      success++;
    } catch (err) {
      console.error(`  ❌ ${dossierNum}  →  ${err.message}`);
      errors++;
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✅ ${success} vidéo(s) uploadée(s) avec succès`);
  if (errors > 0) {
    console.log(`❌ ${errors} erreur(s) — vérifiez vos credentials S3`);
  }
  console.log(`\n📌 Structure S3 créée :`);
  console.log(`   ${FOLDER}/`);
  DOSSIERS.forEach((d) => console.log(`     ${d}/video-test.mp4`));
  console.log(`\n💡 Vous pouvez maintenant tester l'application avec les données du seed.sql`);
}

main().catch((err) => {
  console.error("❌ Erreur inattendue :", err.message);
  process.exit(1);
});
