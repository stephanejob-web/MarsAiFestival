import { Request, Response } from "express";
import {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../repositories/programme.repository";

export const listProgramme = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllEvents();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur récupération programme.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

export const createProgrammeEvent = async (req: Request, res: Response): Promise<void> => {
    const { day, time, title, description, type, sort_order } = req.body as {
        day?: number;
        time?: string;
        title?: string;
        description?: string;
        type?: string;
        sort_order?: number;
    };
    if (!day || !time || !title || !type) {
        res.status(400).json({
            success: false,
            message: "day, time, title et type sont obligatoires.",
        });
        return;
    }
    try {
        const id = await createEvent({
            day: Number(day),
            time,
            title,
            description: description ?? null,
            type: type as any,
            sort_order: sort_order ?? 0,
        });
        res.status(201).json({ success: true, data: { id } });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur création événement.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

export const updateProgrammeEvent = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    try {
        await updateEvent(id, req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur mise à jour événement.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

export const deleteProgrammeEvent = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    try {
        await deleteEvent(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur suppression événement.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
