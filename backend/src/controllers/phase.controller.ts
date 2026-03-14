import { Request, Response } from "express";
import { getPhases, savePhase } from "../repositories/phase.repository";

// ── GET /api/phases ───────────────────────────────────────────────────────────
export const listPhases = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getPhases();

        // Calcule la phase active selon la date du jour
        const now = new Date();
        const toDate = (s: string | null) => (s ? new Date(s) : null);
        const p1Open = toDate(data.phase1_open);
        const p1Close = toDate(data.phase1_close);
        const p2Open = toDate(data.phase2_open);
        const p2Close = toDate(data.phase2_close);

        let activePhase: 1 | 2 | null = null;
        if (p1Open && p1Close && now >= p1Open && now <= p1Close) activePhase = 1;
        else if (p2Open && p2Close && now >= p2Open && now <= p2Close) activePhase = 2;

        res.json({ success: true, data: { ...data, activePhase } });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des phases.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── PUT /api/phases/:phaseNumber — Sauvegarder une phase (admin) ──────────────
export const updatePhase = async (req: Request, res: Response): Promise<void> => {
    const phaseNumber = Number(req.params.phaseNumber);
    if (phaseNumber !== 1 && phaseNumber !== 2) {
        res.status(400).json({ success: false, message: "phaseNumber doit être 1 ou 2." });
        return;
    }

    const { openDate, closeDate } = req.body as { openDate?: string; closeDate?: string };
    if (!openDate || !closeDate) {
        res.status(400).json({ success: false, message: "openDate et closeDate sont obligatoires." });
        return;
    }

    try {
        await savePhase(phaseNumber, openDate, closeDate);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la sauvegarde de la phase.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
