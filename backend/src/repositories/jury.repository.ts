import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface JuryRow extends RowDataPacket {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    role: "jury" | "admin";
    google_id: string | null;
    profil_picture: string | null;
    jury_description: string | null;
    is_active: boolean;
}

export interface JuryInsert {
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    role?: "jury" | "admin";
    profil_picture?: string | null;
}

export const findByEmail = async (email: string): Promise<JuryRow | null> => {
    const [rows] = await pool.execute<JuryRow[]>(
        `SELECT id, first_name, last_name, email, password_hash, role, google_id, profil_picture, is_active
         FROM jury WHERE email = ?`,
        [email],
    );
    return rows[0] ?? null;
};

export const findByGoogleId = async (googleId: string): Promise<JuryRow | null> => {
    const [rows] = await pool.execute<JuryRow[]>(
        `SELECT id, first_name, last_name, email, password_hash, role, google_id, profil_picture, is_active
         FROM jury WHERE google_id = ?`,
        [googleId],
    );
    return rows[0] ?? null;
};

export const insertJury = async (data: JuryInsert): Promise<JuryRow> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO jury (first_name, last_name, email, password_hash, role, profil_picture)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.first_name,
            data.last_name,
            data.email,
            data.password_hash,
            data.role ?? "jury",
            data.profil_picture ?? null,
        ],
    );
    const [rows] = await pool.execute<JuryRow[]>(
        `SELECT id, first_name, last_name, email, password_hash, role, google_id, profil_picture
         FROM jury WHERE id = ?`,
        [result.insertId],
    );
    return rows[0];
};

export const getAllJury = async (): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            j.id, j.first_name, j.last_name, j.email, j.role, j.is_active,
            j.profil_picture, j.jury_description, j.created_at,
            COUNT(DISTINCT jfa.film_id) AS films_assigned,
            COUNT(DISTINCT jfc.film_id) AS films_evaluated
         FROM jury j
         LEFT JOIN jury_film_assignment jfa ON jfa.jury_id = j.id
         LEFT JOIN jury_film_commentary jfc ON jfc.jury_id = j.id AND jfc.decision IS NOT NULL
         GROUP BY j.id
         ORDER BY j.last_name ASC`,
    );
    return rows;
};

export const updateJuryUser = async (
    id: number,
    data: Partial<{
        first_name: string;
        last_name: string;
        role: "jury" | "admin";
        jury_description: string;
    }>,
): Promise<boolean> => {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];
    if (data.first_name !== undefined) {
        fields.push("first_name = ?");
        values.push(data.first_name);
    }
    if (data.last_name !== undefined) {
        fields.push("last_name = ?");
        values.push(data.last_name);
    }
    if (data.role !== undefined) {
        fields.push("role = ?");
        values.push(data.role);
    }
    if (data.jury_description !== undefined) {
        fields.push("jury_description = ?");
        values.push(data.jury_description);
    }
    if (fields.length === 0) return false;
    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE jury SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values,
    );
    return result.affectedRows > 0;
};

export const toggleJuryActive = async (id: number, isActive: boolean): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE jury SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [isActive, id],
    );
    return result.affectedRows > 0;
};

export const deleteJuryUser = async (id: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(`DELETE FROM jury WHERE id = ?`, [id]);
    return result.affectedRows > 0;
};

export const findById = async (id: number): Promise<JuryRow | null> => {
    const [rows] = await pool.execute<JuryRow[]>(
        `SELECT id, first_name, last_name, email, password_hash, role, google_id, profil_picture
         FROM jury WHERE id = ?`,
        [id],
    );
    return rows[0] ?? null;
};

export const updateProfilPicture = async (id: number, profilPicture: string): Promise<void> => {
    await pool.execute(
        `UPDATE jury SET profil_picture = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [profilPicture, id],
    );
};

export const updatePassword = async (id: number, passwordHash: string): Promise<void> => {
    await pool.execute(
        `UPDATE jury SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [passwordHash, id],
    );
};

export const upsertGoogleJury = async (data: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string | null;
}): Promise<{ jury: JuryRow; isNew: boolean }> => {
    // Cherche d'abord par google_id, puis par email (compte existant sans Google)
    let jury = await findByGoogleId(data.googleId);
    if (jury) return { jury, isNew: false };

    const byEmail = await findByEmail(data.email);
    if (byEmail) {
        // Lie le compte Google à l'email existant
        await pool.execute(`UPDATE jury SET google_id = ?, profil_picture = ? WHERE id = ?`, [
            data.googleId,
            data.picture,
            byEmail.id,
        ]);
        const updated = { ...byEmail, google_id: data.googleId, profil_picture: data.picture };
        return { jury: updated as JuryRow, isNew: false };
    }

    // Nouveau compte via Google
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO jury (first_name, last_name, email, password_hash, role, google_id, profil_picture)
         VALUES (?, ?, ?, '', 'jury', ?, ?)`,
        [data.firstName, data.lastName, data.email, data.googleId, data.picture],
    );
    const [rows] = await pool.execute<JuryRow[]>(
        `SELECT id, first_name, last_name, email, password_hash, role, google_id, profil_picture
         FROM jury WHERE id = ?`,
        [result.insertId],
    );
    jury = rows[0];
    return { jury, isNew: true };
};
