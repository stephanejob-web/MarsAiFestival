import { Request, Response } from "express";
import {
    getAllAwards,
    createAward,
    updateAward,
    deleteAward,
} from "../repositories/award.repository";

export const listAwards = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllAwards();
        res.json({ success: true, data });
    } catch {
        res.status(500).json({ success: false, message: "Erreur récupération palmarès." });
    }
};

export const createAwardHandler = async (req: Request, res: Response): Promise<void> => {
    const { name, description, cash_prize, laureat, display_rank, reveal_at } = req.body as {
        name?: string;
        description?: string;
        cash_prize?: string;
        laureat?: number;
        display_rank?: number;
        reveal_at?: string;
    };
    if (!name) {
        res.status(400).json({ success: false, message: "Le nom est obligatoire." });
        return;
    }
    try {
        const id = await createAward({
            name,
            description: description ?? null,
            cash_prize: cash_prize ?? null,
            laureat: laureat ?? null,
            display_rank: display_rank ?? 0,
            reveal_at: reveal_at ?? null,
        });
        res.status(201).json({ success: true, id });
    } catch {
        res.status(500).json({ success: false, message: "Erreur création prix." });
    }
};

export const updateAwardHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    try {
        await updateAward(id, req.body);
        res.json({ success: true });
    } catch {
        res.status(500).json({ success: false, message: "Erreur mise à jour prix." });
    }
};

export const deleteAwardHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    try {
        await deleteAward(id);
        res.json({ success: true });
    } catch {
        res.status(500).json({ success: false, message: "Erreur suppression prix." });
    }
};
