import { Request, Response } from "express";
import {
    assignFilmToJury,
    removeAssignment,
    getFilmsByJury,
    getJuryByFilm,
    getAllAssignments,
    getAllJuryMembers,
} from "../repositories/assignment.repository";
import { getUnassignedFilms } from "../repositories/film.repository";
import { getPresignedVideoUrl, extractS3Key } from "../services/s3.service";

// ── POST /api/assignments — Assigner un film à un juré (admin) ─────────────────
export const assign = async (req: Request, res: Response): Promise<void> => {
    const { juryId, filmId } = req.body as { juryId?: number; filmId?: number };
    const adminId = req.juryUser!.id;

    if (!juryId || !filmId) {
        res.status(400).json({ success: false, message: "juryId et filmId sont obligatoires." });
        return;
    }

    try {
        const id = await assignFilmToJury(Number(juryId), Number(filmId), adminId);
        res.status(201).json({ success: true, data: { id } });
    } catch (err: unknown) {
        const mysqlErr = err as { code?: string };
        if (mysqlErr?.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                success: false,
                message: "Ce film est déjà attribué à ce juré.",
            });
            return;
        }
        if (mysqlErr?.code === "ER_NO_REFERENCED_ROW_2") {
            res.status(404).json({ success: false, message: "Juré ou film introuvable." });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'attribution.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── DELETE /api/assignments — Retirer une attribution (admin) ──────────────────
export const unassign = async (req: Request, res: Response): Promise<void> => {
    const juryId = Number(req.query.juryId);
    const filmId = Number(req.query.filmId);

    if (isNaN(juryId) || isNaN(filmId)) {
        res.status(400).json({ success: false, message: "juryId et filmId sont obligatoires." });
        return;
    }

    try {
        const deleted = await removeAssignment(juryId, filmId);
        if (!deleted) {
            res.status(404).json({ success: false, message: "Attribution introuvable." });
            return;
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'attribution.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/assignments — Toutes les attributions (admin) ─────────────────────
export const listAssignments = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllAssignments();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des attributions.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/assignments/jury/:juryId — Films d'un juré ────────────────────────
export const listFilmsForJury = async (req: Request, res: Response): Promise<void> => {
    const juryId = Number(req.params.juryId);
    if (isNaN(juryId)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    try {
        const rows = await getFilmsByJury(juryId);

        // Replace raw S3 URLs with presigned URLs (1h validity)
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
            message: "Erreur lors de la récupération des films du juré.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/assignments/film/:filmId — Jurés assignés à un film ───────────────
export const listJuryForFilm = async (req: Request, res: Response): Promise<void> => {
    const filmId = Number(req.params.filmId);
    if (isNaN(filmId)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    try {
        const data = await getJuryByFilm(filmId);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des jurés du film.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── POST /api/assignments/auto-distribute — Répartition équitable (admin) ──────
// Distribue tous les films non assignés entre les jurés actifs de façon circulaire.
export const autoDistribute = async (req: Request, res: Response): Promise<void> => {
    const adminId = req.juryUser!.id;

    try {
        const [unassigned, juryMembers] = await Promise.all([
            getUnassignedFilms(),
            getAllJuryMembers(),
        ]);

        const activeJury = (juryMembers as { id: number; role: string }[]).filter(
            (j) => j.role === "jury",
        );

        if (activeJury.length === 0) {
            res.status(400).json({ success: false, message: "Aucun juré actif disponible." });
            return;
        }
        if (unassigned.length === 0) {
            res.json({ success: true, assigned: 0, message: "Tous les films sont déjà assignés." });
            return;
        }

        let assigned = 0;
        const errors: number[] = [];

        for (let i = 0; i < unassigned.length; i++) {
            const filmId = (unassigned[i] as { id: number }).id;
            const juryId = activeJury[i % activeJury.length].id;
            try {
                await assignFilmToJury(juryId, filmId, adminId);
                assigned++;
            } catch {
                errors.push(filmId);
            }
        }

        res.json({
            success: true,
            assigned,
            skipped: errors.length,
            message: `${assigned} film(s) réparti(s) entre ${activeJury.length} juré(s).`,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la répartition automatique.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/assignments/jury-members — Liste des jurés (admin) ────────────────
export const listJuryMembers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllJuryMembers();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des jurés.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
