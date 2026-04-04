import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export type VoteTagType = "refuser" | "valide" | "a_revoir" | "a_discuter";

export interface VoteTag extends RowDataPacket {
    id: number;
    key: string;
    label: string;
    icon: string;
    color: string;
    type: VoteTagType;
    message_template: string | null;
    is_active: boolean;
    is_default: boolean;
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
    type: VoteTagType,
    sortOrder: number,
    isDefault: boolean,
    messageTemplate?: string,
): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO vote_tags (\`key\`, label, icon, color, type, sort_order, is_default, message_template) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [key, label, icon, color, type, sortOrder, isDefault ? 1 : 0, messageTemplate ?? null],
    );
    return result.insertId;
};

export const updateTag = async (
    id: number,
    label: string,
    icon: string,
    color: string,
    type: VoteTagType,
    isActive: boolean,
    isDefault: boolean,
    sortOrder: number,
    messageTemplate?: string,
): Promise<void> => {
    await pool.execute(
        `UPDATE vote_tags SET label = ?, icon = ?, color = ?, type = ?, is_active = ?, is_default = ?, sort_order = ?, message_template = ? WHERE id = ?`,
        [
            label,
            icon,
            color,
            type,
            isActive ? 1 : 0,
            isDefault ? 1 : 0,
            sortOrder,
            messageTemplate ?? null,
            id,
        ],
    );
};

export const deleteTag = async (id: number): Promise<void> => {
    await pool.execute(`DELETE FROM vote_tags WHERE id = ?`, [id]);
};

export const setdefault = async (id: number): Promise<void> => {
    await pool.execute(
        `UPDATE vote_tags v1
         INNER JOIN vote_tags v2 ON v1.type = v2.type AND v2.id = ?
         SET v1.is_default = CASE WHEN v1.id = ? AND v1.is_default = 0 THEN 1 ELSE 0 END`,
        [id, id],
    );
};
