/**
 * Script à exécuter UNE SEULE FOIS pour obtenir le refresh token YouTube.
 *
 * Usage :
 *   1. Ajoute YOUTUBE_CLIENT_ID et YOUTUBE_CLIENT_SECRET dans .env
 *   2. Lance : npx ts-node scripts/get-youtube-token.ts
 *   3. Ouvre l'URL dans le navigateur, autorise l'accès
 *   4. Copie le code de l'URL de callback
 *   5. Colle-le dans le terminal
 *   6. Copie le refresh_token dans .env → YOUTUBE_REFRESH_TOKEN
 */

import "dotenv/config";
import { google } from "googleapis";
import * as readline from "readline";

const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    "http://localhost:5500/oauth2callback",
);

const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
});

console.log("\n🔗 Ouvre cette URL dans ton navigateur :\n");
console.log(authUrl);
console.log("\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("📋 Colle le code de l'URL de callback ici : ", async (code) => {
    rl.close();
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log("\n✅ Tokens obtenus :");
    console.log(JSON.stringify(tokens, null, 2));
    console.log("\n📝 Ajoute cette ligne dans ton .env :");
    console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
});
