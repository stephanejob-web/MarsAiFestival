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

// ── Supprimer le vote d'un juré sur un film (garde la ligne pour le commentaire) ─
export const deleteVote = async (juryId: number, filmId: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE jury_film_commentary SET decision = NULL, updated_at = CURRENT_TIMESTAMP
         WHERE jury_id = ? AND film_id = ?`,
        [juryId, filmId],
    );
    return result.affectedRows > 0;
};

// ── Stats globales (pour la vue Sélection admin) ──────────────────────────────
export const getVotesSummary = async (): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            f.id AS film_id, f.original_title, f.dossier_num, f.statut, f.poster_img,
            (SELECT COUNT(*)          FROM jury_film_commentary v WHERE v.film_id = f.id AND v.decision IS NOT NULL)                AS total_votes,
            (SELECT COUNT(*)          FROM jury_film_commentary v WHERE v.film_id = f.id AND v.decision = 'valide')                 AS votes_valide,
            (SELECT COUNT(*)          FROM jury_film_commentary v WHERE v.film_id = f.id AND v.decision = 'arevoir')                AS votes_arevoir,
            (SELECT COUNT(*)          FROM jury_film_commentary v WHERE v.film_id = f.id AND v.decision = 'refuse')                 AS votes_refuse,
            (SELECT COUNT(*)          FROM jury_film_commentary v WHERE v.film_id = f.id AND v.decision = 'in_discussion')          AS votes_discussion,
            (SELECT COUNT(DISTINCT jury_id) FROM jury_film_assignment   a WHERE a.film_id = f.id)                                   AS total_assigned,
            (SELECT COUNT(*) FROM jury WHERE role = 'jury')                                                                         AS total_jury,
            (SELECT COUNT(*) FROM jury_film_commentary jfc3 JOIN commentary c ON c.id = jfc3.commentary_id WHERE jfc3.film_id = f.id AND c.commentary IS NOT NULL AND c.commentary != '') AS total_comments,
            (SELECT COUNT(*)          FROM ticket                       t WHERE t.film_id = f.id AND t.status = 'open')             AS total_tickets,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'jury_id',       j2.id,
                        'first_name',    j2.first_name,
                        'last_name',     j2.last_name,
                        'profil_picture',j2.profil_picture,
                        'decision',      jfc2.decision
                    )
                )
                FROM jury j2
                LEFT JOIN jury_film_commentary jfc2
                    ON jfc2.jury_id = j2.id
                   AND jfc2.film_id = f.id
                   AND jfc2.decision IS NOT NULL
                WHERE j2.role = 'jury'
            )                                                                                                                       AS jury_decisions
         FROM film f
         ORDER BY total_votes DESC, votes_valide DESC`,
    );

    // mysql2 retourne JSON_ARRAYAGG comme une chaîne — on parse manuellement
    return rows.map((row) => ({
        ...row,
        jury_decisions:
            typeof row.jury_decisions === "string"
                ? (JSON.parse(row.jury_decisions) as unknown)
                : row.jury_decisions,
    }));
};
