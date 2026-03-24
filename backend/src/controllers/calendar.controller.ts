import { Request, Response } from "express";
import { getCalendar, saveCalendar } from "../repositories/calendar.repository";

export const getCalendarHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getCalendar();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur récupération calendrier.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

export const updateCalendarHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        await saveCalendar(req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur sauvegarde calendrier.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
