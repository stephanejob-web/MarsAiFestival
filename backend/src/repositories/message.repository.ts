import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface MessageRow extends RowDataPacket {
    id: number;
    film_id: number;
    jury_id: number;
    jury_name: string;
    jury_initials: string;
    profil_picture: string | null;
    message: string;
    sent_at: string;
}

export const saveMessage = async (
    filmId: number,
    juryId: number,
    juryName: string,
    juryInitials: string,
    message: string,
): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO discussion_message (film_id, jury_id, jury_name, jury_initials, message)
         VALUES (?, ?, ?, ?, ?)`,
        [filmId, juryId, juryName, juryInitials, message],
    );
    return result.insertId;
};

export const getMessagesByFilm = async (filmId: number, limit = 100): Promise<MessageRow[]> => {
    const [rows] = await pool.query<MessageRow[]>(
        `SELECT dm.id, dm.film_id, dm.jury_id, dm.jury_name, dm.jury_initials, j.profil_picture, dm.message, dm.sent_at
         FROM discussion_message dm
         LEFT JOIN jury j ON j.id = dm.jury_id
         WHERE dm.film_id = ?
         ORDER BY dm.sent_at ASC
         LIMIT ${Number(limit)}`,
        [filmId],
    );
    return rows;
};
