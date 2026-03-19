import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface FilmInsert {
    realisator_id: number;
    dossier_num: string;
    original_title: string;
    english_title: string | null;
    language: string;
    tags: string | null;
    original_synopsis: string | null;
    english_synopsis: string | null;
    video_url: string | null;
    subtitle_fr_url: string | null;
    subtitle_en_url: string | null;
    creative_workflow: string | null;
    tech_stack: string | null;
    ia_class: "full" | "hybrid";
    ia_image: boolean;
    ia_son: boolean;
    ia_scenario: boolean;
    ia_post: boolean;
}

export const insertFilm = async (data: FilmInsert): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO film (
            realisator_id, dossier_num,
            original_title, english_title, language, tags,
            original_synopsis, english_synopsis,
            video_url, subtitle_fr_url, subtitle_en_url,
            creative_workflow, tech_stack,
            ia_class, ia_image, ia_son, ia_scenario, ia_post,
            statut
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'to_review')`,
        [
            data.realisator_id,
            data.dossier_num,
            data.original_title,
            data.english_title ?? null,
            data.language,
            data.tags ?? null,
            data.original_synopsis ?? null,
            data.english_synopsis ?? null,
            data.video_url ?? null,
            data.subtitle_fr_url ?? null,
            data.subtitle_en_url ?? null,
            data.creative_workflow ?? null,
            data.tech_stack ?? null,
            data.ia_class,
            data.ia_image ? 1 : 0,
            data.ia_son ? 1 : 0,
            data.ia_scenario ? 1 : 0,
            data.ia_post ? 1 : 0,
        ],
    );
    return result.insertId;
};

export const getFilms = async (): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            f.id, f.dossier_num, f.original_title, f.english_title,
            f.language, f.tags, f.original_synopsis, f.poster_img,
            f.duration, f.ia_class, f.ia_image, f.ia_son, f.ia_scenario, f.ia_post,
            f.statut, f.video_url, f.created_at,
            r.first_name, r.last_name, r.email AS realisator_email, r.country
         FROM film f
         JOIN realisator r ON r.id = f.realisator_id
         ORDER BY f.created_at DESC`,
    );
    return rows;
};

export const updateFilmStatut = async (
    id: number,
    statut: "to_review" | "valide" | "arevoir" | "refuse" | "in_discussion" | "asked_to_modify",
): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE film SET statut = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [statut, id],
    );
    return result.affectedRows > 0;
};

export const getUnassignedFilms = async (): Promise<RowDataPacket[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT f.id FROM film f
         WHERE f.id NOT IN (SELECT DISTINCT film_id FROM jury_film_assignment)`,
    );
    return rows;
};

export const deleteFilm = async (id: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `DELETE FROM film WHERE id = ?`,
        [id],
    );
    return result.affectedRows > 0;
};

export const getFilmById = async (id: number): Promise<RowDataPacket | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            f.*,
            r.first_name, r.last_name, r.email AS realisator_email,
            r.country, r.profession, r.mobile_phone,
            r.youtube, r.instagram, r.linkedin, r.facebook, r.xtwitter
         FROM film f
         JOIN realisator r ON r.id = f.realisator_id
         WHERE f.id = ?`,
        [id],
    );
    return rows.length > 0 ? rows[0] : null;
};
