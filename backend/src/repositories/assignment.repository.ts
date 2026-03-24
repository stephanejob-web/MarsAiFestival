import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface AssignmentRow extends RowDataPacket {
    id: number;
    jury_id: number;
    film_id: number;
    assigned_by: number;
    assigned_at: string;
    // champs joints
    jury_first_name: string;
    jury_last_name: string;
    jury_email: string;
    film_title: string;
    film_dossier_num: string;
}

// ── Assigner un film à un juré ─────────────────────────────────────────────────
export const assignFilmToJury = async (
    juryId: number,
    filmId: number,
    assignedBy: number,
): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO jury_film_assignment (jury_id, film_id, assigned_by)
         VALUES (?, ?, ?)`,
        [juryId, filmId, assignedBy],
    );
    return result.insertId;
};

// ── Supprimer une attribution ──────────────────────────────────────────────────
export const removeAssignment = async (juryId: number, filmId: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `DELETE FROM jury_film_assignment WHERE jury_id = ? AND film_id = ?`,
        [juryId, filmId],
    );
    return result.affectedRows > 0;
};

// ── Films assignés à un juré donné ────────────────────────────────────────────
export const getFilmsByJury = async (juryId: number): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            jfa.id, jfa.assigned_at,
            f.id AS film_id, f.dossier_num, f.original_title, f.english_title,
            f.language, f.tags, f.poster_img, f.duration,
            f.ia_class, f.statut, f.video_url,
            f.ia_image, f.ia_son, f.ia_scenario, f.ia_post,
            f.creative_workflow, f.tech_stack,
            f.subtitle_fr_url, f.subtitle_en_url,
            YEAR(f.created_at) AS film_year,
            r.gender          AS realisator_gender,
            r.first_name      AS realisator_first,
            r.last_name       AS realisator_last,
            r.birth_date      AS realisator_birth_date,
            r.email           AS realisator_email,
            r.profession      AS realisator_profession,
            r.phone           AS realisator_phone,
            r.mobile_phone    AS realisator_mobile_phone,
            r.street          AS realisator_street,
            r.postal_code     AS realisator_postal_code,
            r.city            AS realisator_city,
            r.country         AS realisator_country,
            r.youtube         AS realisator_youtube,
            r.instagram       AS realisator_instagram,
            r.linkedin        AS realisator_linkedin,
            r.facebook        AS realisator_facebook,
            r.xtwitter        AS realisator_xtwitter,
            r.how_did_you_know_us AS realisator_how_did_you_know_us,
            r.newsletter      AS realisator_newsletter
         FROM jury_film_assignment jfa
         JOIN film       f ON f.id = jfa.film_id
         JOIN realisator r ON r.id = f.realisator_id
         WHERE jfa.jury_id = ?
         ORDER BY jfa.assigned_at DESC`,
        [juryId],
    );
    return rows;
};

// ── Jurés assignés à un film donné ────────────────────────────────────────────
export const getJuryByFilm = async (filmId: number): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            jfa.id, jfa.assigned_at,
            j.id AS jury_id, j.first_name, j.last_name, j.email, j.profil_picture, j.role
         FROM jury_film_assignment jfa
         JOIN jury j ON j.id = jfa.jury_id
         WHERE jfa.film_id = ?
         ORDER BY j.last_name ASC`,
        [filmId],
    );
    return rows;
};

// ── Toutes les attributions (vue admin) ───────────────────────────────────────
export const getAllAssignments = async (): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            jfa.id, jfa.assigned_at,
            j.id AS jury_id, j.first_name AS jury_first_name, j.last_name AS jury_last_name,
            j.email AS jury_email, j.profil_picture,
            f.id AS film_id, f.dossier_num, f.original_title, f.statut AS film_statut,
            ab.first_name AS assigned_by_first_name, ab.last_name AS assigned_by_last_name
         FROM jury_film_assignment jfa
         JOIN jury j  ON j.id  = jfa.jury_id
         JOIN film f  ON f.id  = jfa.film_id
         JOIN jury ab ON ab.id = jfa.assigned_by
         ORDER BY jfa.assigned_at DESC`,
    );
    return rows;
};

// ── Liste de tous les jurés (pour le select admin) ────────────────────────────
export const getAllJuryMembers = async (): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT id, first_name, last_name, email, role, profil_picture
         FROM jury
         ORDER BY last_name ASC`,
    );
    return rows;
};
