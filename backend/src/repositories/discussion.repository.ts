import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export const addFilmToDiscussion = async (filmId: number, addedBy: number): Promise<void> => {
    await pool.execute(
        `INSERT IGNORE INTO film_discussion (film_id, added_by) VALUES (?, ?)`,
        [filmId, addedBy],
    );
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
