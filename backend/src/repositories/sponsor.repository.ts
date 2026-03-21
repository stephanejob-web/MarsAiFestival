import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";

export interface Sponsor {
    id: number;
    name: string;
    partnership_statut: "main" | "lead" | "partner" | "supporter" | "premium";
    sponsored_award: string | null;
    sponsor_link: string | null;
    sponsor_logo: string | null;
}

export const getAllSponsors = async (): Promise<Sponsor[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT id, name, partnership_statut, sponsored_award, sponsor_link, sponsor_logo FROM sponsor ORDER BY id",
    );
    return rows as Sponsor[];
};

export const createSponsor = async (data: Omit<Sponsor, "id">): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO sponsor (name, partnership_statut, sponsored_award, sponsor_link, sponsor_logo) VALUES (?, ?, ?, ?, ?)",
        [
            data.name,
            data.partnership_statut,
            data.sponsored_award ?? null,
            data.sponsor_link ?? null,
            data.sponsor_logo ?? null,
        ],
    );
    return result.insertId;
};

export const updateSponsor = async (
    id: number,
    data: Partial<Omit<Sponsor, "id">>,
): Promise<void> => {
    const fields = [
        "name",
        "partnership_statut",
        "sponsored_award",
        "sponsor_link",
        "sponsor_logo",
    ] as const;
    const updates = fields.filter((f) => f in data).map((f) => `\`${f}\` = ?`);
    const values = fields.filter((f) => f in data).map((f) => data[f] ?? null);
    if (updates.length === 0) return;
    await pool.execute(`UPDATE sponsor SET ${updates.join(", ")} WHERE id = ?`, [...values, id]);
};

export const deleteSponsor = async (id: number): Promise<void> => {
    await pool.execute("DELETE FROM sponsor WHERE id = ?", [id]);
};

export const uploadSponsorLogo = async (id: number, logoPath: string): Promise<void> => {
    await pool.execute("UPDATE sponsor SET sponsor_logo = ? WHERE id = ?", [logoPath, id]);
};
