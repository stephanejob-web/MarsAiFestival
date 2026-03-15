import { Request, Response } from "express";
import {
    addFilmToDiscussion,
    removeFilmFromDiscussion,
    getDiscussionFilmIds,
} from "../repositories/discussion.repository";

// GET /api/discussion — liste partagée des film_ids en discussion
export const listDiscussion = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getDiscussionFilmIds();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// POST /api/discussion — ajouter un film à la discussion partagée
export const addToDiscussion = async (req: Request, res: Response): Promise<void> => {
    const { filmId } = req.body as { filmId?: number };
    const juryId = req.juryUser!.id;

    if (!filmId) {
        res.status(400).json({ success: false, message: "filmId est obligatoire." });
        return;
    }

    try {
        await addFilmToDiscussion(Number(filmId), juryId);
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// DELETE /api/discussion?filmId=X — retirer un film de la discussion partagée
export const removeFromDiscussion = async (req: Request, res: Response): Promise<void> => {
    const filmId = Number(req.query.filmId);

    if (isNaN(filmId)) {
        res.status(400).json({ success: false, message: "filmId est obligatoire." });
        return;
    }

    try {
        await removeFilmFromDiscussion(filmId);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
