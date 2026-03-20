import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

// ── Multi-commentaires (jury_film_comment) — plusieurs par juré par film ───────

export const addFilmComment = async (
    juryId: number,
    filmId: number,
    text: string,
): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO jury_film_comment (jury_id, film_id, text) VALUES (?, ?, ?)`,
        [juryId, filmId, text],
    );
    return result.insertId;
};

export const getFilmComments = async (filmId: number): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT fc.id, fc.jury_id, fc.film_id, fc.text, fc.created_at,
                j.first_name, j.last_name, j.profil_picture
         FROM jury_film_comment fc
         JOIN jury j ON j.id = fc.jury_id
         WHERE fc.film_id = ?
         ORDER BY fc.created_at ASC`,
        [filmId],
    );
    return rows;
};

export const getMyFilmComments = async (juryId: number): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT id, film_id, text, created_at FROM jury_film_comment WHERE jury_id = ? ORDER BY created_at ASC`,
        [juryId],
    );
    return rows;
};

// ── Ajouter un commentaire sur un film ────────────────────────────────────────
export const addComment = async (juryId: number, filmId: number, text: string): Promise<number> => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Insérer le texte dans commentary
        const [comResult] = await conn.execute<ResultSetHeader>(
            `INSERT INTO commentary (commentary) VALUES (?)`,
            [text],
        );
        const commentaryId = comResult.insertId;

        // Upsert dans jury_film_commentary : lie le commentaire au couple (jury, film)
        await conn.execute(
            `INSERT INTO jury_film_commentary (jury_id, film_id, commentary_id)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE commentary_id = VALUES(commentary_id), updated_at = CURRENT_TIMESTAMP`,
            [juryId, filmId, commentaryId],
        );

        await conn.commit();
        return commentaryId;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

// ── Tous les commentaires d'un juré (bulk load au démarrage) ─────────────────
export const getMyCommentsByJury = async (
    juryId: number,
): Promise<{ film_id: number; text: string }[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT jfc.film_id, c.commentary AS text
         FROM jury_film_commentary jfc
         JOIN commentary c ON c.id = jfc.commentary_id
         WHERE jfc.jury_id = ? AND c.commentary IS NOT NULL AND c.commentary != ''`,
        [juryId],
    );
    return rows as { film_id: number; text: string }[];
};

// ── Commentaires d'un film (avec infos juré) ──────────────────────────────────
export const getCommentsByFilm = async (filmId: number): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            c.id AS comment_id, c.commentary AS text, jfc.updated_at,
            j.id AS jury_id, j.first_name, j.last_name, j.profil_picture,
            jfc.decision
         FROM jury_film_commentary jfc
         JOIN commentary c ON c.id = jfc.commentary_id
         JOIN jury j ON j.id = jfc.jury_id
         WHERE jfc.film_id = ? AND c.commentary IS NOT NULL AND c.commentary != ''
         ORDER BY jfc.updated_at DESC`,
        [filmId],
    );
    return rows;
};
