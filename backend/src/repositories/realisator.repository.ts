import { ResultSetHeader } from "mysql2";
import pool from "../config/db";

export interface RealisatorInsert {
    gender: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    email: string;
    profession: string | null;
    phone: string | null;
    mobile_phone: string;
    street: string;
    postal_code: string;
    city: string;
    country: string;
    youtube: string | null;
    instagram: string | null;
    linkedin: string | null;
    facebook: string | null;
    xtwitter: string | null;
    how_did_you_know_us: string | null;
    newsletter: boolean;
}

export const insertRealisator = async (data: RealisatorInsert): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO realisator (
            gender, first_name, last_name, birth_date, email,
            profession, phone, mobile_phone,
            street, postal_code, city, country,
            youtube, instagram, linkedin, facebook, xtwitter,
            how_did_you_know_us, newsletter
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.gender,
            data.first_name,
            data.last_name,
            data.birth_date,
            data.email,
            data.profession ?? null,
            data.phone ?? null,
            data.mobile_phone,
            data.street,
            data.postal_code,
            data.city,
            data.country,
            data.youtube ?? null,
            data.instagram ?? null,
            data.linkedin ?? null,
            data.facebook ?? null,
            data.xtwitter ?? null,
            data.how_did_you_know_us ?? null,
            data.newsletter ? 1 : 0,
        ],
    );
    return result.insertId;
};
