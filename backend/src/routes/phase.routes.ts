import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import { listPhases, updatePhase } from "../controllers/phase.controller";
import pool from "../config/db";

const router = Router();

// GET  /api/phases               — Config phases + phase active (juré & admin)
router.get("/", requireAuth, listPhases);

// PUT  /api/phases/:phaseNumber  — Sauvegarder une phase (admin)
router.put("/:phaseNumber", requireAdmin, updatePhase);

// POST /api/phases/simulate — DEV ONLY: basculer rapidement sur une phase
router.post("/simulate", requireAdmin, async (req: Request, res: Response): Promise<void> => {
    const phase = Number(req.body.phase);
    if (![0, 1, 2, 3].includes(phase)) {
        res.status(400).json({ success: false, message: "phase doit être 0, 1, 2 ou 3" });
        return;
    }

    // Dates relatives à aujourd'hui
    const d = (offsetDays: number): string => {
        const date = new Date();
        date.setDate(date.getDate() + offsetDays);
        return date.toISOString().slice(0, 10);
    };

    // Phase 0 : inscriptions ouvertes, pas de sélection encore
    // Phase 1 : top50 ouvert maintenant
    // Phase 2 : top50 terminé, award ouvert maintenant
    // Phase 3 : award terminé (palmarès visible)
    const configs: Record<number, Record<string, string | null>> = {
        0: {
            submission_open_date:   d(-30),
            submission_close_date:  d(+15),
            phase_top50_open_date:  d(+20),
            phase_top50_close_date: d(+35),
            phase_award_open_date:  d(+40),
            phase_award_close_date: d(+55),
            ceremony_date:          d(+60),
        },
        1: {
            submission_open_date:   d(-30),
            submission_close_date:  d(-5),
            phase_top50_open_date:  d(-1),
            phase_top50_close_date: d(+20),
            phase_award_open_date:  d(+25),
            phase_award_close_date: d(+40),
            ceremony_date:          d(+45),
        },
        2: {
            submission_open_date:   d(-60),
            submission_close_date:  d(-35),
            phase_top50_open_date:  d(-30),
            phase_top50_close_date: d(-5),
            phase_award_open_date:  d(-1),
            phase_award_close_date: d(+15),
            ceremony_date:          d(+20),
        },
        3: {
            submission_open_date:   d(-90),
            submission_close_date:  d(-65),
            phase_top50_open_date:  d(-60),
            phase_top50_close_date: d(-35),
            phase_award_open_date:  d(-30),
            phase_award_close_date: d(-5),
            ceremony_date:          d(-1),
        },
    };

    try {
        const cfg = configs[phase];
        await pool.execute(
            `UPDATE cms_content SET
               submission_open_date   = ?,
               submission_close_date  = ?,
               phase_top50_open_date  = ?,
               phase_top50_close_date = ?,
               phase_award_open_date  = ?,
               phase_award_close_date = ?,
               ceremony_date          = ?
             WHERE id = 1`,
            [
                cfg.submission_open_date,
                cfg.submission_close_date,
                cfg.phase_top50_open_date,
                cfg.phase_top50_close_date,
                cfg.phase_award_open_date,
                cfg.phase_award_close_date,
                cfg.ceremony_date,
            ],
        );
        res.json({ success: true, phase, dates: cfg });
    } catch {
        res.status(500).json({ success: false });
    }
});

export default router;
