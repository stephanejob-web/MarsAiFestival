import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export const addFilmToDiscussion = async (filmId: number, addedBy: number): Promise<void> => {
    await pool.execute(`INSERT IGNORE INTO film_discussion (film_id, added_by) VALUES (?, ?)`, [
        filmId,
        addedBy,
    ]);
};

export const removeFilmFromDiscussion = async (filmId: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `DELETE FROM film_discussion WHERE film_id = ?`,
        [filmId],
    );
    return result.affectedRows > 0;
};

export const getDiscussionFilmIds = async (): Promise<number[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(`SELECT film_id FROM film_discussion`);
    return rows.map((r) => r.film_id as number);
};

export const getDiscussionFilms = async (): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            f.id AS film_id, f.dossier_num, f.original_title, f.english_title,
            f.language, f.tags, f.duration, f.ia_class, f.video_url, f.poster_img,
            f.ia_image, f.ia_son, f.ia_scenario, f.ia_post,
            f.creative_workflow, f.tech_stack,
            f.subtitle_fr_url, f.subtitle_en_url,
            YEAR(f.created_at) AS film_year,
            r.first_name AS realisator_first,
            r.last_name  AS realisator_last,
            r.country    AS realisator_country,
            j.first_name AS added_by_first,
            j.last_name  AS added_by_last
         FROM film_discussion fd
         JOIN film       f ON f.id = fd.film_id
         JOIN realisator r ON r.id = f.realisator_id
         JOIN jury       j ON j.id = fd.added_by
         ORDER BY f.original_title ASC`,
    );
    return rows;
};
