import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

// ── POST /api/push/token — Enregistre le push token du juré connecté ──────────
export const savePushToken = async (req: Request, res: Response): Promise<void> => {
    const juryId = req.juryUser?.id;
    const { token, deviceName, deviceOs } = req.body as {
        token?: string;
        deviceName?: string;
        deviceOs?: string;
    };

    if (!juryId) {
        res.status(401).json({ success: false, message: "Non authentifié." });
        return;
    }

    if (!token || typeof token !== "string") {
        res.status(400).json({ success: false, message: "Token manquant." });
        return;
    }

    if (!token.startsWith("ExponentPushToken[")) {
        res.status(400).json({ success: false, message: "Format de token invalide." });
        return;
    }

    try {
        await pool.execute(
            "UPDATE jury SET push_token = ?, device_name = ?, device_os = ? WHERE id = ?",
            [
                token,
                deviceName ? deviceName.slice(0, 100) : null,
                deviceOs ? deviceOs.slice(0, 100) : null,
                juryId,
            ],
        );
        res.json({ success: true });
    } catch (err) {
        console.error("[push] savePushToken error:", err);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
};

// ── GET /api/push/devices — Liste tous les jurés avec leur token/device ────────
export const getDevices = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT id, first_name, last_name, email, push_token, device_name, device_os
             FROM jury
             ORDER BY push_token IS NOT NULL DESC, last_name ASC`,
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error("[push] getDevices error:", err);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
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
