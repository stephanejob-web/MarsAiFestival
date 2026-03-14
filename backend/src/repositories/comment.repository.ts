import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

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
