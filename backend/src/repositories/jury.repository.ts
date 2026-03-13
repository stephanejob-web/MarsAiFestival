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
}

export interface JuryInsert {
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    profil_picture?: string | null;
}

export const findByEmail = async (email: string): Promise<JuryRow | null> => {
    const [rows] = await pool.execute<JuryRow[]>(
        `SELECT id, first_name, last_name, email, password_hash, role, google_id, profil_picture
         FROM jury WHERE email = ?`,
        [email],
    );
    return rows[0] ?? null;
};

export const findByGoogleId = async (googleId: string): Promise<JuryRow | null> => {
    const [rows] = await pool.execute<JuryRow[]>(
        `SELECT id, first_name, last_name, email, password_hash, role, google_id, profil_picture
         FROM jury WHERE google_id = ?`,
        [googleId],
    );
    return rows[0] ?? null;
};

export const insertJury = async (data: JuryInsert): Promise<JuryRow> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO jury (first_name, last_name, email, password_hash, role, profil_picture)
         VALUES (?, ?, ?, ?, 'jury', ?)`,
        [data.first_name, data.last_name, data.email, data.password_hash, data.profil_picture ?? null],
    );
    const [rows] = await pool.execute<JuryRow[]>(
        `SELECT id, first_name, last_name, email, password_hash, role, google_id, profil_picture
         FROM jury WHERE id = ?`,
        [result.insertId],
    );
    return rows[0];
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
