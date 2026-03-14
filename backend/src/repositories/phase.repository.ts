import { RowDataPacket } from "mysql2";
import pool from "../config/db";

// La config des phases est stockée dans cms_content (une seule ligne).
// Si aucune ligne n'existe, on en crée une à la volée.

const ensureCmsRow = async (): Promise<void> => {
    await pool.execute(`INSERT IGNORE INTO cms_content (id) VALUES (1)`);
};

export interface PhasesConfig {
    phase1_open: string | null;
    phase1_close: string | null;
    phase2_open: string | null;
    phase2_close: string | null;
}

export const getPhases = async (): Promise<PhasesConfig> => {
    await ensureCmsRow();
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT
            phase_top50_open_date  AS phase1_open,
            phase_top50_close_date AS phase1_close,
            phase_award_open_date  AS phase2_open,
            phase_award_close_date AS phase2_close
         FROM cms_content WHERE id = 1`,
    );
    const row = rows[0];
    return {
        phase1_open: row?.phase1_open ?? null,
        phase1_close: row?.phase1_close ?? null,
        phase2_open: row?.phase2_open ?? null,
        phase2_close: row?.phase2_close ?? null,
    };
};

export const savePhase = async (
    phaseNumber: 1 | 2,
    openDate: string,
    closeDate: string,
): Promise<void> => {
    await ensureCmsRow();
    if (phaseNumber === 1) {
        await pool.execute(
            `UPDATE cms_content SET phase_top50_open_date = ?, phase_top50_close_date = ? WHERE id = 1`,
            [openDate, closeDate],
        );
    } else {
        await pool.execute(
            `UPDATE cms_content SET phase_award_open_date = ?, phase_award_close_date = ? WHERE id = 1`,
            [openDate, closeDate],
        );
    }
};
