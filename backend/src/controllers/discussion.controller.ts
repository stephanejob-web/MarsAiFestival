import { Request, Response } from "express";
import type { Server } from "socket.io";
import {
    addFilmToDiscussion,
    removeFilmFromDiscussion,
    getDiscussionFilmIds,
    getDiscussionFilms,
} from "../repositories/discussion.repository";
import { getPresignedVideoUrl, extractS3Key } from "../services/s3.service";

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

// GET /api/discussion/films — films complets de la liste partagée (URLs présignées)
export const listDiscussionFilms = async (_req: Request, res: Response): Promise<void> => {
    try {
        const rows = await getDiscussionFilms();
        const data = await Promise.all(
            rows.map(async (row) => {
                if (!row.video_url) return row;
                const key = extractS3Key(row.video_url as string);
                if (!key) return row;
                try {
                    const presignedUrl = await getPresignedVideoUrl(key);
                    return { ...row, video_url: presignedUrl };
                } catch {
                    return row;
                }
            }),
        );
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
        const films = await getDiscussionFilms();
        (req.app.locals.io as Server | undefined)?.emit("discussion-list:updated", films);
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
        const films = await getDiscussionFilms();
        (req.app.locals.io as Server | undefined)?.emit("discussion-list:updated", films);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
