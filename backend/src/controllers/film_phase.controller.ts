import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";

type PhaseStatut = "valide" | "selectionne" | "finaliste" | "none";
const ALLOWED: PhaseStatut[] = ["valide", "selectionne", "finaliste", "none"];

export const setFilmPhaseStatus = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { statut } = req.body as { statut?: string };
    if (!id || !statut || !ALLOWED.includes(statut as PhaseStatut)) {
        res.status(400).json({ success: false, message: "ID ou statut invalide." });
        return;
    }
    try {
        // "none" resets to "valide"
        const target = statut === "none" ? "valide" : statut;
        await pool.execute("UPDATE film SET statut = ? WHERE id = ?", [target, id]);
        res.json({ success: true });
    } catch {
        res.status(500).json({ success: false, message: "Erreur mise à jour statut." });
    }
};

export const listFilmsByPhase = async (req: Request, res: Response): Promise<void> => {
    const statut = (req.query.statut as string) || "valide";
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT f.id, f.original_title, f.english_title, f.language, f.statut,
                    f.poster_img, f.ia_class,
                    CONCAT(r.first_name, ' ', r.last_name) AS realisator_name,
                    r.country AS realisator_country
             FROM film f
             LEFT JOIN realisator r ON r.id = f.realisator_id
             WHERE f.statut = ?
             ORDER BY f.created_at ASC`,
            [statut],
        );
        res.json({ success: true, data: rows });
    } catch {
        res.status(500).json({ success: false, message: "Erreur récupération films." });
    }
};
