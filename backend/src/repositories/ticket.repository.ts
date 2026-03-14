import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

type TicketType = "content" | "technical" | "rights" | "other";
type TicketStatus = "open" | "in_progress" | "resolved" | "rejected";

// ── Créer un signalement ──────────────────────────────────────────────────────
export const createTicket = async (
    juryId: number,
    filmId: number,
    type: TicketType,
    description: string,
): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO ticket (jury_id, film_id, type, description) VALUES (?, ?, ?, ?)`,
        [juryId, filmId, type, description],
    );
    return result.insertId;
};

// ── Tous les tickets (admin) ──────────────────────────────────────────────────
export const getAllTickets = async (): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            t.id, t.type, t.description, t.status, t.admin_note, t.created_at, t.updated_at,
            j.id AS jury_id, j.first_name AS jury_first_name, j.last_name AS jury_last_name,
            j.profil_picture,
            f.id AS film_id, f.original_title, f.dossier_num, f.poster_img,
            r.email AS realisator_email, r.first_name AS realisator_first_name,
            r.last_name AS realisator_last_name
         FROM ticket t
         JOIN jury j ON j.id = t.jury_id
         JOIN film f ON f.id = t.film_id
         JOIN realisator r ON r.id = f.realisator_id
         ORDER BY FIELD(t.status,'open','in_progress','resolved','rejected'), t.created_at DESC`,
    );
    return rows;
};

// ── Un seul ticket ────────────────────────────────────────────────────────────
export const getTicketById = async (id: number): Promise<RowDataPacket | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            t.*,
            j.first_name AS jury_first_name, j.last_name AS jury_last_name, j.email AS jury_email,
            j.profil_picture,
            f.original_title, f.dossier_num, f.statut AS film_statut,
            r.email AS realisator_email, r.first_name AS realisator_first_name,
            r.last_name AS realisator_last_name
         FROM ticket t
         JOIN jury j ON j.id = t.jury_id
         JOIN film f ON f.id = t.film_id
         JOIN realisator r ON r.id = f.realisator_id
         WHERE t.id = ?`,
        [id],
    );
    return rows[0] ?? null;
};

// ── Mettre à jour le statut et/ou la note admin ───────────────────────────────
export const updateTicket = async (
    id: number,
    status: TicketStatus,
    adminNote?: string,
): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE ticket
         SET status = ?, admin_note = COALESCE(?, admin_note), updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [status, adminNote ?? null, id],
    );
    return result.affectedRows > 0;
};
