import { Router } from "express";
import type { Request, Response } from "express";
import { getCurrentPhase } from "../repositories/phase_public.repository";
import { getPublicFilms, getPublicAwards } from "../repositories/film_public.repository";
import { getPresignedVideoUrl, extractS3Key } from "../services/s3.service";
import { getAllSponsors } from "../repositories/sponsor.repository";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

const router = Router();

/** GET /api/public/phase — phase active (no auth) */
router.get("/phase", async (_req: Request, res: Response): Promise<void> => {
    try {
        const info = await getCurrentPhase();
        res.json({ success: true, data: info });
    } catch {
        res.status(500).json({ success: false });
    }
});

/** GET /api/public/films?statut=selectionne&page=1&limit=20 */
router.get("/films", async (req: Request, res: Response): Promise<void> => {
    const statut = (req.query.statut as string) === "finaliste" ? "finaliste" : "selectionne";
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    try {
        const result = await getPublicFilms(statut, page, limit);
        res.json({ success: true, ...result, page, limit });
    } catch {
        res.status(500).json({ success: false });
    }
});

/** GET /api/public/films/:id/video — signed video URL (no auth, film must be selectionne/finaliste) */
router.get("/films/:id/video", async (req: Request, res: Response): Promise<void> => {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) { res.status(400).json({ success: false }); return; }
    try {
        const [[film]] = await pool.execute<RowDataPacket[]>(
            `SELECT video_url, statut FROM film WHERE id = ? AND statut IN ('selectionne','finaliste')`,
            [filmId],
        );
        if (!film?.video_url) { res.status(404).json({ success: false }); return; }
        const key = extractS3Key(film.video_url as string);
        if (!key) { res.status(404).json({ success: false }); return; }
        const url = await getPresignedVideoUrl(key, 3600);
        res.json({ success: true, url });
    } catch {
        res.status(500).json({ success: false });
    }
});

/** GET /api/public/sponsors — liste des sponsors (no auth) */
router.get("/sponsors", async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllSponsors();
        res.json({ success: true, data });
    } catch {
        res.status(500).json({ success: false });
    }
});

/** GET /api/public/awards — palmarès (no auth) */
router.get("/awards", async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getPublicAwards();
        res.json({ success: true, data });
    } catch {
        res.status(500).json({ success: false });
    }
});

export default router;
