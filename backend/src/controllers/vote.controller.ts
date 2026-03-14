import { Request, Response } from "express";
import nodemailer from "nodemailer";
import {
    upsertVote,
    getVotesByFilm,
    getVotesByJury,
    getVotesSummary,
    getVote,
} from "../repositories/vote.repository";
import { getFilmById } from "../repositories/film.repository";

const VALID_DECISIONS = ["valide", "arevoir", "refuse", "in_discussion"] as const;
type Decision = (typeof VALID_DECISIONS)[number];

const DECISIONS_WITH_EMAIL: Decision[] = ["arevoir", "refuse"];

const DECISION_LABELS: Record<Decision, string> = {
    valide: "Validé",
    arevoir: "À revoir",
    refuse: "Refusé",
    in_discussion: "En discussion",
};

// ── POST /api/votes — Soumettre ou mettre à jour un vote ──────────────────────
export const submitVote = async (req: Request, res: Response): Promise<void> => {
    const { filmId, decision, message } = req.body as {
        filmId?: number;
        decision?: string;
        message?: string;
    };
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

        // ── Email au réalisateur pour "arevoir" et "refuse" ───────────────────
        if (DECISIONS_WITH_EMAIL.includes(decision as Decision) && message?.trim()) {
            const film = await getFilmById(Number(filmId));
            if (film?.realisator_email) {
                const label = DECISION_LABELS[decision as Decision];
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                });
                await transporter
                    .sendMail({
                        from: `"marsAI Festival 2026" <${process.env.EMAIL_USER}>`,
                        to: film.realisator_email as string,
                        subject: `[marsAI 2026] ${label} — ${film.original_title as string} (${film.dossier_num as string})`,
                        html: `
                        <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1a1a2e">
                            <h2 style="color:#4a0080">marsAI Festival 2026</h2>
                            <p>Bonjour,</p>
                            <p>Le jury a évalué votre film <strong>${film.original_title as string}</strong>
                            (dossier <code>${film.dossier_num as string}</code>).</p>
                            <p><strong>Décision :</strong> ${label}</p>
                            <blockquote style="border-left:3px solid #4a0080;padding:8px 16px;color:#444">
                                ${message.trim().replace(/\n/g, "<br/>")}
                            </blockquote>
                            <p style="color:#888;font-size:12px">Ce message a été envoyé par le jury marsAI Festival 2026.</p>
                        </div>`,
                    })
                    .catch((err) => {
                        // eslint-disable-next-line no-console
                        console.error("⚠️ Échec envoi email réalisateur :", err);
                    });
            }
        }

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
