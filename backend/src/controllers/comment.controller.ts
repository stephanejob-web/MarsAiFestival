import { Request, Response } from "express";
import { addComment, getCommentsByFilm } from "../repositories/comment.repository";

// ── POST /api/comments — Publier un commentaire ───────────────────────────────
export const postComment = async (req: Request, res: Response): Promise<void> => {
    const { filmId, text } = req.body as { filmId?: number; text?: string };
    const juryId = req.juryUser!.id;

    if (!filmId || !text?.trim()) {
        res.status(400).json({ success: false, message: "filmId et text sont obligatoires." });
        return;
    }

    try {
        const id = await addComment(juryId, Number(filmId), text.trim());
        res.status(201).json({ success: true, data: { id } });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'enregistrement du commentaire.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/comments?filmId=X ────────────────────────────────────────────────
export const listComments = async (req: Request, res: Response): Promise<void> => {
    const filmId = Number(req.query.filmId);
    if (isNaN(filmId)) {
        res.status(400).json({ success: false, message: "filmId est requis." });
        return;
    }

    try {
        const data = await getCommentsByFilm(filmId);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des commentaires.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
