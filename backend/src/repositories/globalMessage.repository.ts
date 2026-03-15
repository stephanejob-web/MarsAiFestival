import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface GlobalMessageRow extends RowDataPacket {
    id: number;
    jury_id: number | null;
    jury_name: string;
    jury_initials: string;
    profil_picture: string | null;
    message: string;
    sent_at: string;
}

export const saveGlobalMessage = async (
    juryId: number,
    juryName: string,
    juryInitials: string,
    message: string,
): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO global_chat_message (jury_id, jury_name, jury_initials, message)
         VALUES (?, ?, ?, ?)`,
        [juryId, juryName, juryInitials, message],
    );
    return result.insertId;
};

export const getRecentGlobalMessages = async (limit = 100): Promise<GlobalMessageRow[]> => {
    const [rows] = await pool.query<GlobalMessageRow[]>(
        `SELECT gcm.id, gcm.jury_id, gcm.jury_name, gcm.jury_initials, j.profil_picture, gcm.message, gcm.sent_at
         FROM global_chat_message gcm
         LEFT JOIN jury j ON j.id = gcm.jury_id
         ORDER BY gcm.sent_at DESC
         LIMIT ${Number(limit)}`,
    );
    return (rows as GlobalMessageRow[]).reverse();
};
