import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

type Decision = "valide" | "arevoir" | "refuse" | "in_discussion";

// ── Soumettre ou mettre à jour un vote ────────────────────────────────────────
export const upsertVote = async (
    juryId: number,
    filmId: number,
    decision: Decision,
): Promise<void> => {
    await pool.execute<ResultSetHeader>(
        `INSERT INTO jury_film_commentary (jury_id, film_id, decision)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE decision = VALUES(decision), updated_at = CURRENT_TIMESTAMP`,
        [juryId, filmId, decision],
    );
};

// ── Récupérer le vote d'un juré sur un film ───────────────────────────────────
export const getVote = async (juryId: number, filmId: number): Promise<RowDataPacket | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT id, jury_id, film_id, decision, updated_at
         FROM jury_film_commentary
         WHERE jury_id = ? AND film_id = ?`,
        [juryId, filmId],
    );
    return rows[0] ?? null;
};

// ── Tous les votes pour un film (avec infos juré) ─────────────────────────────
export const getVotesByFilm = async (filmId: number): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            jfc.id, jfc.decision, jfc.updated_at,
            j.id AS jury_id, j.first_name, j.last_name, j.profil_picture
         FROM jury_film_commentary jfc
         JOIN jury j ON j.id = jfc.jury_id
         WHERE jfc.film_id = ? AND jfc.decision IS NOT NULL`,
        [filmId],
    );
    return rows;
};

// ── Tous les votes d'un juré (avec infos film) ────────────────────────────────
export const getVotesByJury = async (juryId: number): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            jfc.id, jfc.decision, jfc.updated_at,
            f.id AS film_id, f.original_title, f.dossier_num, f.poster_img
         FROM jury_film_commentary jfc
         JOIN film f ON f.id = jfc.film_id
         WHERE jfc.jury_id = ? AND jfc.decision IS NOT NULL
         ORDER BY jfc.updated_at DESC`,
        [juryId],
    );
    return rows;
};

// ── Supprimer le vote d'un juré sur un film ───────────────────────────────────
export const deleteVote = async (juryId: number, filmId: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `DELETE FROM jury_film_commentary WHERE jury_id = ? AND film_id = ?`,
        [juryId, filmId],
    );
    return result.affectedRows > 0;
};

// ── Stats globales (pour la vue Sélection admin) ──────────────────────────────
export const getVotesSummary = async (): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            f.id AS film_id, f.original_title, f.dossier_num, f.statut, f.poster_img,
            COUNT(jfc.id)                                                  AS total_votes,
            SUM(jfc.decision = 'valide')                                   AS votes_valide,
            SUM(jfc.decision = 'arevoir')                                  AS votes_arevoir,
            SUM(jfc.decision = 'refuse')                                   AS votes_refuse,
            SUM(jfc.decision = 'in_discussion')                            AS votes_discussion,
            COUNT(DISTINCT jfa.jury_id)                                    AS total_assigned,
            COUNT(c.id)                                                     AS total_comments,
            COUNT(t.id)                                                     AS total_tickets
         FROM film f
         LEFT JOIN jury_film_commentary jfc ON jfc.film_id = f.id AND jfc.decision IS NOT NULL
         LEFT JOIN jury_film_assignment jfa ON jfa.film_id = f.id
         LEFT JOIN commentary c ON c.id = jfc.commentary_id
         LEFT JOIN ticket t ON t.film_id = f.id AND t.status = 'open'
         GROUP BY f.id
         ORDER BY total_votes DESC, votes_valide DESC`,
    );
    return rows;
};
