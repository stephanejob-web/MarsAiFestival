import { Request, Response } from "express";
import { AccessToken } from "livekit-server-sdk";

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY ?? "";
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET ?? "";
const ROOM_NAME = "jury-vocal";

// ── GET /api/vocal/token — Générer un token LiveKit pour le salon vocal ────────
export const getVocalToken = async (req: Request, res: Response): Promise<void> => {
    const jury = req.juryUser!;

    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
        res.status(500).json({ success: false, message: "LiveKit non configuré." });
        return;
    }

    const identity = `jury-${jury.id}`;
    const name = `${jury.firstName} ${jury.lastName}`;
    const metadata = JSON.stringify({ profilPicture: jury.profilPicture ?? null });

    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity,
        name,
        ttl: "4h",
        metadata,
    });

    at.addGrant({
        roomJoin: true,
        room: ROOM_NAME,
        canPublish: true,
        canSubscribe: true,
    });

    const token = await at.toJwt();
    res.json({ success: true, token, room: ROOM_NAME });
};
