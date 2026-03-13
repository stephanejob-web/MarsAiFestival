/**
 * Lance un serveur temporaire qui gère le flow OAuth YouTube automatiquement.
 * Usage : npx ts-node scripts/get-youtube-token.ts
 */

import "dotenv/config";
import { google } from "googleapis";
import http from "http";
import { exec } from "child_process";

const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    "http://localhost:5500/oauth2callback",
);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
    prompt: "consent",
});

const server = http.createServer(async (req, res) => {
    if (!req.url?.startsWith("/oauth2callback")) {
        res.end("Not found");
        return;
    }

    const url = new URL(req.url, "http://localhost:5500");
    const code = url.searchParams.get("code");

    if (!code) {
        res.end("Erreur : pas de code dans l'URL");
        return;
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
            <html><body style="font-family:sans-serif;padding:40px;background:#0d1117;color:#4effce">
                <h2>✅ Refresh token obtenu !</h2>
                <p style="color:white">Copie cette ligne dans ton fichier <code>.env</code> :</p>
                <pre style="background:#1a1a2e;padding:16px;border-radius:8px;color:#f5e642;word-break:break-all">
YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
                <p style="color:#888">Tu peux fermer cette fenêtre et arrêter le script (Ctrl+C).</p>
            </body></html>
        `);

        console.log("\n✅ Refresh token obtenu !");
        console.log("\n📝 Ajoute cette ligne dans ton .env :\n");
        console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    } catch (err) {
        res.end(`Erreur : ${String(err)}`);
    } finally {
        server.close();
    }
});

server.listen(5500, () => {
    console.log("\n🚀 Serveur OAuth démarré sur http://localhost:5500");
    console.log("\n🔗 Ouverture du navigateur...\n");
    exec(`xdg-open "${authUrl}" 2>/dev/null || open "${authUrl}" 2>/dev/null`);
    console.log("Si le navigateur ne s'ouvre pas, copie cette URL manuellement :");
    console.log(`\n${authUrl}\n`);
});
