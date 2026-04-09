import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

// ── POST /api/push/token — Enregistre le push token du juré connecté ──────────
export const savePushToken = async (req: Request, res: Response): Promise<void> => {
    const juryId = (req as any).user?.id;
    const { token } = req.body as { token?: string };

    if (!token || typeof token !== "string") {
        res.status(400).json({ success: false, message: "Token manquant." });
        return;
    }

    if (!token.startsWith("ExponentPushToken[")) {
        res.status(400).json({ success: false, message: "Format de token invalide." });
        return;
    }

    await pool.execute(
        "UPDATE jury SET push_token = ? WHERE id = ?",
        [token, juryId],
    );

    res.json({ success: true });
};

// ── POST /api/push/send — Envoie une notification (admin / Postman) ───────────
export const sendPushNotification = async (req: Request, res: Response): Promise<void> => {
    const { title, body, juryIds } = req.body as {
        title?: string;
        body?: string;
        juryIds?: number[];
    };

    if (!title || !body) {
        res.status(400).json({ success: false, message: "title et body sont requis." });
        return;
    }

    // Récupère les tokens — tous les jurés ou seulement ceux spécifiés
    let rows: RowDataPacket[];
    if (juryIds && juryIds.length > 0) {
        const placeholders = juryIds.map(() => "?").join(", ");
        [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT push_token FROM jury WHERE push_token IS NOT NULL AND id IN (${placeholders})`,
            juryIds,
        );
    } else {
        [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT push_token FROM jury WHERE push_token IS NOT NULL",
        );
    }

    if (rows.length === 0) {
        res.json({ success: true, sent: 0, message: "Aucun token enregistré." });
        return;
    }

    const messages = rows.map((r) => ({
        to: r.push_token as string,
        sound: "default",
        title,
        body,
        data: {},
    }));

    // Expo Push API — chunks de 100 max
    const CHUNK = 100;
    let sent = 0;
    for (let i = 0; i < messages.length; i += CHUNK) {
        const chunk = messages.slice(i, i + CHUNK);
        const expRes = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate",
            },
            body: JSON.stringify(chunk),
        });
        if (expRes.ok) sent += chunk.length;
    }

    res.json({ success: true, sent, total: messages.length });
};
