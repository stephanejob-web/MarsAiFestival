import { Request, Response } from "express";
import {
    addComment,
    getCommentsByFilm,
    getMyCommentsByJury,
    addFilmComment,
    getFilmComments,
    getMyFilmComments,
} from "../repositories/comment.repository";

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

// ── GET /api/comments/mine — Tous mes commentaires (bulk, pour le panel jury) ──
export const listMyComments = async (req: Request, res: Response): Promise<void> => {
    const juryId = req.juryUser!.id;
    try {
        const data = await getMyCommentsByJury(juryId);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
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

// ── POST /api/comments/film — Ajouter un commentaire libre (multi par film) ───
export const postFilmComment = async (req: Request, res: Response): Promise<void> => {
    const { filmId, text } = req.body as { filmId?: number; text?: string };
    const juryId = req.juryUser!.id;

    if (!filmId || !text?.trim()) {
        res.status(400).json({ success: false, message: "filmId et text sont obligatoires." });
        return;
    }

    try {
        const id = await addFilmComment(juryId, Number(filmId), text.trim());
        res.status(201).json({ success: true, data: { id } });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'enregistrement du commentaire.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/comments/film?filmId=X — Liste des commentaires d'un film ────────
export const listFilmComments = async (req: Request, res: Response): Promise<void> => {
    const filmId = Number(req.query.filmId);
    if (isNaN(filmId)) {
        res.status(400).json({ success: false, message: "filmId est requis." });
        return;
    }

    try {
        const data = await getFilmComments(filmId);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/comments/film/mine — Mes commentaires multi-film ─────────────────
export const listMyFilmComments = async (req: Request, res: Response): Promise<void> => {
    const juryId = req.juryUser!.id;
    try {
        const data = await getMyFilmComments(juryId);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
