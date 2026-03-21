import { Router } from "express";
import type { Request, Response } from "express";
import { getCurrentPhase } from "../repositories/phase_public.repository";
import { getPublicFilms, getPublicAwards } from "../repositories/film_public.repository";

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
