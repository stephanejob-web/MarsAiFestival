import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";

export interface JuryShowcaseMember {
    id: number;
    name: string;
    display_role: string;
    badge: string;
    quote: string | null;
    photo_url: string | null;
    is_featured: number;
    sort_order: number;
    is_active: number;
}

export const getActiveMembers = async (): Promise<JuryShowcaseMember[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM jury_showcase WHERE is_active = 1 ORDER BY sort_order ASC",
    );
    return rows as JuryShowcaseMember[];
};

export const getAllMembers = async (): Promise<JuryShowcaseMember[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM jury_showcase ORDER BY sort_order ASC",
    );
    return rows as JuryShowcaseMember[];
};

export const createMember = async (
    data: Omit<JuryShowcaseMember, "id">,
): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO jury_showcase (name, display_role, badge, quote, photo_url, is_featured, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [data.name, data.display_role, data.badge, data.quote, data.photo_url, data.is_featured, data.sort_order, data.is_active],
    );
    return result.insertId;
};

export const updateMember = async (
    id: number,
    data: Partial<Omit<JuryShowcaseMember, "id">>,
): Promise<void> => {
    const allowed = ["name", "display_role", "badge", "quote", "photo_url", "is_featured", "sort_order", "is_active"];
    const entries = Object.entries(data).filter(([k]) => allowed.includes(k));
    if (entries.length === 0) return;
    const fields = entries.map(([k]) => `\`${k}\` = ?`).join(", ");
    const values = [...entries.map(([, v]) => v), id];
    await pool.execute(`UPDATE jury_showcase SET ${fields} WHERE id = ?`, values);
};

export const deleteMember = async (id: number): Promise<void> => {
    await pool.execute("DELETE FROM jury_showcase WHERE id = ?", [id]);
};
