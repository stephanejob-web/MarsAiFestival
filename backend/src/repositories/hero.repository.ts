import { RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface HeroConfig {
    hero_label: string;
    hero_title: string;
    hero_description: string;
    hero_content: string;
    hero_tag1: string;
    hero_tag2: string;
    hero_tag3: string;
    hero_tag4: string;
    hero_video_path: string | null;
}

export interface ContactConfig {
    contact_email: string;
    contact_instagram: string;
    contact_website: string;
    contact_description: string;
}

const ensureRow = async (): Promise<void> => {
    await pool.execute("INSERT IGNORE INTO cms_content (id) VALUES (1)");
};

export const getHero = async (): Promise<HeroConfig> => {
    await ensureRow();
    const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT hero_label, hero_title, hero_description, hero_content, hero_tag1, hero_tag2, hero_tag3, hero_tag4, hero_video_path FROM cms_content WHERE id = 1",
    );
    const row = (rows[0] ?? {}) as Record<string, string | null>;
    return {
        hero_label: row.hero_label ?? "",
        hero_title: row.hero_title ?? "",
        hero_description: row.hero_description ?? "",
        hero_content: row.hero_content ?? "",
        hero_tag1: row.hero_tag1 ?? "",
        hero_tag2: row.hero_tag2 ?? "",
        hero_tag3: row.hero_tag3 ?? "",
        hero_tag4: row.hero_tag4 ?? "",
        hero_video_path: row.hero_video_path ?? null,
    };
};

export const saveHero = async (data: Partial<HeroConfig>): Promise<void> => {
    await ensureRow();
    const fields = [
        "hero_label",
        "hero_title",
        "hero_description",
        "hero_content",
        "hero_tag1",
        "hero_tag2",
        "hero_tag3",
        "hero_tag4",
    ] as const;
    const updates = fields.filter((f) => f in data).map((f) => `\`${f}\` = ?`);
    const values = fields.filter((f) => f in data).map((f) => data[f] ?? null);
    if (updates.length === 0) return;
    await pool.execute(`UPDATE cms_content SET ${updates.join(", ")} WHERE id = 1`, values);
};

export const saveHeroVideo = async (path: string): Promise<void> => {
    await ensureRow();
    await pool.execute("UPDATE cms_content SET hero_video_path = ? WHERE id = 1", [path]);
};

export const getContact = async (): Promise<ContactConfig> => {
    await ensureRow();
    const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT contact_email, contact_instagram, contact_website, contact_description FROM cms_content WHERE id = 1",
    );
    const row = (rows[0] ?? {}) as Record<string, string | null>;
    return {
        contact_email: row.contact_email ?? "",
        contact_instagram: row.contact_instagram ?? "",
        contact_website: row.contact_website ?? "",
        contact_description: row.contact_description ?? "",
    };
};

export const saveContact = async (data: Partial<ContactConfig>): Promise<void> => {
    await ensureRow();
    const fields = [
        "contact_email",
        "contact_instagram",
        "contact_website",
        "contact_description",
    ] as const;
    const updates = fields.filter((f) => f in data).map((f) => `\`${f}\` = ?`);
    const values = fields.filter((f) => f in data).map((f) => data[f] ?? null);
    if (updates.length === 0) return;
    await pool.execute(`UPDATE cms_content SET ${updates.join(", ")} WHERE id = 1`, values);
};
