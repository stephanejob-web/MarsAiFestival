import { Request, Response } from "express";
import {
    getHero,
    saveHero,
    saveHeroVideo,
    getContact,
    saveContact,
} from "../repositories/hero.repository";

export const getHeroHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getHero();
        res.json({ success: true, data });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

export const updateHeroHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        await saveHero(req.body);
        res.json({ success: true });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

export const uploadHeroVideoHandler = async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ success: false, message: "Aucun fichier reçu." });
        return;
    }
    try {
        const path = `/uploads/hero/${file.filename}`;
        await saveHeroVideo(path);
        res.json({ success: true, url: path });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

export const getContactHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getContact();
        res.json({ success: true, data });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

export const updateContactHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        await saveContact(req.body);
        res.json({ success: true });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};
