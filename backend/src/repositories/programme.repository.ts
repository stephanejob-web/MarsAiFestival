import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";

export interface ProgrammeEvent {
    id: number;
    day: number;
    event_date: string | null;
    time: string;
    title: string;
    description: string | null;
    type: "opening" | "projection" | "masterclass" | "pause" | "gala" | "default";
    sort_order: number;
}

export const getAllEvents = async (): Promise<ProgrammeEvent[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM programme_event ORDER BY event_date, sort_order, time",
    );
    return rows as ProgrammeEvent[];
};

export const createEvent = async (data: Omit<ProgrammeEvent, "id">): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO programme_event (day, event_date, time, title, description, type, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            data.day,
            data.event_date ?? null,
            data.time,
            data.title,
            data.description,
            data.type,
            data.sort_order,
        ],
    );
    return result.insertId;
};

export const updateEvent = async (
    id: number,
    data: Partial<Omit<ProgrammeEvent, "id">>,
): Promise<void> => {
    const allowed = ["day", "event_date", "time", "title", "description", "type", "sort_order"];
    const entries = Object.entries(data).filter(([k]) => allowed.includes(k));
    if (entries.length === 0) return;
    const fields = entries.map(([k]) => `\`${k}\` = ?`).join(", ");
    const values = [...entries.map(([, v]) => v), id];
    await pool.execute(`UPDATE programme_event SET ${fields} WHERE id = ?`, values);
};

export const deleteEvent = async (id: number): Promise<void> => {
    await pool.execute("DELETE FROM programme_event WHERE id = ?", [id]);
};
