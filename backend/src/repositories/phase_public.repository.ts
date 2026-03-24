import { RowDataPacket } from "mysql2";
import pool from "../config/db";

export type PhaseNumber = 0 | 1 | 2 | 3;

export interface PhaseInfo {
    phase: PhaseNumber;
    label: string;
    /** ISO datetime string — cible du compte à rebours (null si phase terminale) */
    nextDate: string | null;
    submissionOpen: boolean;
    finalist_count: number;
    dates: {
        submission_open: string | null;
        submission_close: string | null;
        phase_top50_open: string | null;
        phase_top50_close: string | null;
        phase_award_open: string | null;
        phase_award_close: string | null;
        ceremony: string | null;
    };
}

export const getCurrentPhase = async (): Promise<PhaseInfo> => {
    await pool.execute("INSERT IGNORE INTO cms_content (id) VALUES (1)");
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT submission_open_date, submission_close_date,
                phase_top50_open_date, phase_top50_close_date,
                phase_award_open_date, phase_award_close_date,
                ceremony_date, finalist_count
         FROM cms_content WHERE id = 1`,
    );
    const row = (rows[0] ?? {}) as Record<string, string | number | null>;

    const toDate = (f: string): Date | null => {
        const v = row[f] as string | null;
        return v ? new Date(v) : null;
    };
    const toISO = (d: Date | null): string | null => d?.toISOString() ?? null;

    const sub_open = toDate("submission_open_date");
    const sub_close = toDate("submission_close_date");
    const top50_open = toDate("phase_top50_open_date");
    const top50_close = toDate("phase_top50_close_date");
    const award_open = toDate("phase_award_open_date");
    const award_close = toDate("phase_award_close_date");
    const ceremony = toDate("ceremony_date");
    const finalist_count = (row.finalist_count as number) ?? 5;
    const now = new Date();

    const dates = {
        submission_open: toISO(sub_open),
        submission_close: toISO(sub_close),
        phase_top50_open: toISO(top50_open),
        phase_top50_close: toISO(top50_close),
        phase_award_open: toISO(award_open),
        phase_award_close: toISO(award_close),
        ceremony: toISO(ceremony),
    };

    if (award_close && now >= award_close) {
        return {
            phase: 3,
            label: "Le Palmarès",
            nextDate: toISO(ceremony),
            submissionOpen: false,
            finalist_count,
            dates,
        };
    }
    if (award_open && now >= award_open) {
        return {
            phase: 2,
            label: "Les Finalistes",
            nextDate: toISO(award_close),
            submissionOpen: false,
            finalist_count,
            dates,
        };
    }
    if (top50_open && now >= top50_open) {
        return {
            phase: 1,
            label: "La Sélection Officielle",
            nextDate: toISO(top50_close),
            submissionOpen: false,
            finalist_count,
            dates,
        };
    }

    const submissionOpen = !!(
        sub_open &&
        now >= sub_open &&
        sub_close &&
        now > sub_close === false
    );
    const nextDate = toISO(top50_open) ?? toISO(sub_close);
    return { phase: 0, label: "Inscriptions", nextDate, submissionOpen, finalist_count, dates };
};
