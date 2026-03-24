import { Router } from "express";
import { getHero, getContact } from "../repositories/hero.repository";
import type { Request, Response } from "express";

const router = Router();

// Public endpoint — no auth required
// GET /api/cms/public
router.get("/public", async (_req: Request, res: Response): Promise<void> => {
    try {
        const [hero, contact] = await Promise.all([getHero(), getContact()]);
        res.json({ success: true, data: { ...hero, ...contact } });
    } catch {
        res.status(500).json({ success: false });
    }
});

export default router;
