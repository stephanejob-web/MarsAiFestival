import { RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface PublicFilm {
    id: number;
    original_title: string;
    english_title: string | null;
    language: string;
    country: string | null;
    synopsis: string | null;
    poster_img: string | null;
    ia_class: string;
    statut: string;
    realisator_name: string | null;
    realisator_country: string | null;
}

export interface PublicAward {
    id: number;
    name: string;
    description: string | null;
    cash_prize: string | null;
    display_rank: number;
    film_id: number | null;
    original_title: string | null;
    english_title: string | null;
    language: string | null;
    synopsis: string | null;
    poster_img: string | null;
    ia_class: string | null;
    realisator_name: string | null;
    realisator_country: string | null;
}

export const getPublicFilms = async (
    statut: "selectionne" | "finaliste",
    page = 1,
    limit = 20,
): Promise<{ films: PublicFilm[]; total: number }> => {
    const offset = (page - 1) * limit;
    const [films] = await pool.execute<RowDataPacket[]>(
        `SELECT f.id, f.original_title, f.english_title, f.language,
                f.original_synopsis AS synopsis, f.poster_img, f.ia_class, f.statut,
                CONCAT(r.first_name, ' ', r.last_name) AS realisator_name,
                r.country AS realisator_country
         FROM film f
         LEFT JOIN realisator r ON r.id = f.realisator_id
         WHERE f.statut = ?
         ORDER BY f.created_at ASC
         LIMIT ? OFFSET ?`,
        [statut, limit, offset],
    );
    const [[countRow]] = await pool.execute<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM film WHERE statut = ?`,
        [statut],
    );
    return { films: films as PublicFilm[], total: (countRow as RowDataPacket).total as number };
};

export const getPublicAwards = async (): Promise<PublicAward[]> => {
    const [awards] = await pool.execute<RowDataPacket[]>(
        `SELECT a.id, a.name, a.description, a.cash_prize, a.display_rank,
                f.id AS film_id, f.original_title, f.english_title, f.language,
                f.original_synopsis AS synopsis, f.poster_img, f.ia_class,
                CONCAT(r.first_name, ' ', r.last_name) AS realisator_name,
                r.country AS realisator_country
         FROM award a
         LEFT JOIN film f ON f.id = a.laureat
         LEFT JOIN realisator r ON r.id = f.realisator_id
         WHERE a.reveal_at IS NULL OR a.reveal_at <= NOW()
         ORDER BY a.display_rank ASC, a.id ASC`,
    );
    return awards as PublicAward[];
};
