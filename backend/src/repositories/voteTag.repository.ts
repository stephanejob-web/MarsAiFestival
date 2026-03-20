import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface VoteTag extends RowDataPacket {
    id: number;
    key: string;
    label: string;
    icon: string;
    color: string;
    message_template: string | null;
    is_active: boolean;
    sort_order: number;
}

export const getAllTags = async (): Promise<VoteTag[]> => {
    const [rows] = await pool.execute<VoteTag[]>(
        `SELECT * FROM vote_tags ORDER BY sort_order ASC, id ASC`,
    );
    return rows;
};

export const getActiveTags = async (): Promise<VoteTag[]> => {
    const [rows] = await pool.execute<VoteTag[]>(
        `SELECT * FROM vote_tags WHERE is_active = 1 ORDER BY sort_order ASC, id ASC`,
    );
    return rows;
};

export const createTag = async (
    key: string,
    label: string,
    icon: string,
    color: string,
    sortOrder: number,
    messageTemplate?: string,
): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO vote_tags (\`key\`, label, icon, color, sort_order, message_template) VALUES (?, ?, ?, ?, ?, ?)`,
        [key, label, icon, color, sortOrder, messageTemplate ?? null],
    );
    return result.insertId;
};

export const updateTag = async (
    id: number,
    label: string,
    icon: string,
    color: string,
    isActive: boolean,
    sortOrder: number,
    messageTemplate?: string,
): Promise<void> => {
    await pool.execute(
        `UPDATE vote_tags SET label = ?, icon = ?, color = ?, is_active = ?, sort_order = ?, message_template = ? WHERE id = ?`,
        [label, icon, color, isActive ? 1 : 0, sortOrder, messageTemplate ?? null, id],
    );
};

export const deleteTag = async (id: number): Promise<void> => {
    await pool.execute(`DELETE FROM vote_tags WHERE id = ?`, [id]);
};
