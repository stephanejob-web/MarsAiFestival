import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";

export interface Award {
    id: number;
    name: string;
    description: string | null;
    cash_prize: string | null;
    laureat: number | null;
    display_rank: number;
    reveal_at: string | null;
}

export const getAllAwards = async (): Promise<Award[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT a.id, a.name, a.description, a.cash_prize, a.laureat,
                a.display_rank, a.reveal_at,
                CONCAT(r.first_name, ' ', r.last_name) AS laureate_name,
                f.original_title AS laureate_film
         FROM award a
         LEFT JOIN film f ON f.id = a.laureat
         LEFT JOIN realisator r ON r.id = f.realisator_id
         ORDER BY a.display_rank ASC, a.id ASC`,
    );
    return rows as Award[];
};

export const createAward = async (data: Omit<Award, "id">): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO award (name, description, cash_prize, laureat, display_rank, reveal_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.name,
            data.description ?? null,
            data.cash_prize ?? null,
            data.laureat ?? null,
            data.display_rank ?? 0,
            data.reveal_at ?? null,
        ],
    );
    return result.insertId;
};

export const updateAward = async (id: number, data: Partial<Award>): Promise<void> => {
    const fields = [
        "name",
        "description",
        "cash_prize",
        "laureat",
        "display_rank",
        "reveal_at",
    ] as const;
    const updates = fields.filter((f) => f in data).map((f) => `\`${f}\` = ?`);
    const values = fields
        .filter((f) => f in data)
        .map((f) => (data[f] !== undefined ? data[f] : null));
    if (updates.length === 0) return;
    await pool.execute(`UPDATE award SET ${updates.join(", ")} WHERE id = ?`, [...values, id]);
};

export const deleteAward = async (id: number): Promise<void> => {
    await pool.execute("DELETE FROM award WHERE id = ?", [id]);
};
