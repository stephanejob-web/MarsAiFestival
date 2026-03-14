import { Request, Response } from "express";
import {
    upsertVote,
    getVotesByFilm,
    getVotesByJury,
    getVotesSummary,
    getVote,
} from "../repositories/vote.repository";

const VALID_DECISIONS = ["valide", "arevoir", "refuse", "in_discussion"] as const;
type Decision = (typeof VALID_DECISIONS)[number];

// ── POST /api/votes — Soumettre ou mettre à jour un vote ──────────────────────
export const submitVote = async (req: Request, res: Response): Promise<void> => {
    const { filmId, decision } = req.body as { filmId?: number; decision?: string };
    const juryId = req.juryUser!.id;

    if (!filmId || !decision) {
        res.status(400).json({ success: false, message: "filmId et decision sont obligatoires." });
        return;
    }
    if (!VALID_DECISIONS.includes(decision as Decision)) {
        res.status(400).json({
            success: false,
            message: `decision doit être parmi : ${VALID_DECISIONS.join(", ")}`,
        });
        return;
    }

    try {
        await upsertVote(juryId, Number(filmId), decision as Decision);
        const vote = await getVote(juryId, Number(filmId));
        res.status(200).json({ success: true, data: vote });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'enregistrement du vote.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/votes?filmId=X — Votes pour un film ─────────────────────────────
// ── GET /api/votes?juryId=X — Votes d'un juré ────────────────────────────────
export const listVotes = async (req: Request, res: Response): Promise<void> => {
    const filmId = req.query.filmId ? Number(req.query.filmId) : null;
    const juryId = req.query.juryId ? Number(req.query.juryId) : null;

    if (!filmId && !juryId) {
        res.status(400).json({ success: false, message: "filmId ou juryId est requis." });
        return;
    }

    try {
        const data = filmId ? await getVotesByFilm(filmId) : await getVotesByJury(juryId!);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des votes.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/votes/summary — Synthèse de tous les votes (admin) ───────────────
export const votesSummary = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getVotesSummary();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du résumé des votes.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
