import { RowDataPacket } from "mysql2";
import pool from "../config/db";

const ensureCmsRow = async (): Promise<void> => {
    await pool.execute("INSERT IGNORE INTO cms_content (id) VALUES (1)");
};

export interface CalendarConfig {
    submission_open: string | null;
    submission_close: string | null;
    phase1_open: string | null;
    phase1_close: string | null;
    phase2_open: string | null;
    phase2_close: string | null;
    ceremony_date: string | null;
}

export const getCalendar = async (): Promise<CalendarConfig> => {
    await ensureCmsRow();
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            submission_open_date  AS submission_open,
            submission_close_date AS submission_close,
            phase_top50_open_date  AS phase1_open,
            phase_top50_close_date AS phase1_close,
            phase_award_open_date  AS phase2_open,
            phase_award_close_date AS phase2_close,
            ceremony_date
         FROM cms_content WHERE id = 1`,
    );
    const r = rows[0] ?? {};
    return {
        submission_open: r.submission_open ?? null,
        submission_close: r.submission_close ?? null,
        phase1_open: r.phase1_open ?? null,
        phase1_close: r.phase1_close ?? null,
        phase2_open: r.phase2_open ?? null,
        phase2_close: r.phase2_close ?? null,
        ceremony_date: r.ceremony_date ?? null,
    };
};

export const saveCalendar = async (data: Partial<CalendarConfig>): Promise<void> => {
    await ensureCmsRow();
    const mapping: Record<keyof CalendarConfig, string> = {
        submission_open: "submission_open_date",
        submission_close: "submission_close_date",
        phase1_open: "phase_top50_open_date",
        phase1_close: "phase_top50_close_date",
        phase2_open: "phase_award_open_date",
        phase2_close: "phase_award_close_date",
        ceremony_date: "ceremony_date",
    };
    const entries = Object.entries(data).filter(([k]) => k in mapping);
    if (entries.length === 0) return;
    const fields = entries.map(([k]) => `${mapping[k as keyof CalendarConfig]} = ?`).join(", ");
    const values = [...entries.map(([, v]) => v)];
    await pool.execute(`UPDATE cms_content SET ${fields} WHERE id = 1`, values);
};
