import { Request, Response } from "express";
import {
    getAllSponsors,
    createSponsor,
    updateSponsor,
    deleteSponsor,
    uploadSponsorLogo,
} from "../repositories/sponsor.repository";
import type { Sponsor } from "../repositories/sponsor.repository";

export const listSponsors = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllSponsors();
        res.json({ success: true, data });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

export const createSponsorHandler = async (req: Request, res: Response): Promise<void> => {
    const { name, partnership_statut } = req.body as Partial<Sponsor>;
    if (!name?.trim()) {
        res.status(400).json({ success: false, message: "Le nom est obligatoire." });
        return;
    }
    try {
        const id = await createSponsor({
            name: name.trim(),
            partnership_statut: partnership_statut ?? "partner",
            sponsored_award: req.body.sponsored_award ?? null,
            sponsor_link: req.body.sponsor_link ?? null,
            sponsor_logo: req.body.sponsor_logo ?? null,
        });
        res.status(201).json({ success: true, data: { id } });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

export const updateSponsorHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    try {
        await updateSponsor(id, req.body);
        res.json({ success: true });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

export const deleteSponsorHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    try {
        await deleteSponsor(id);
        res.json({ success: true });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

export const uploadSponsorLogoHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const file = req.file;
    if (!file) {
        res.status(400).json({ success: false, message: "Aucun fichier reçu." });
        return;
    }
    try {
        const logoPath = `/uploads/sponsors/${file.filename}`;
        await uploadSponsorLogo(id, logoPath);
        res.json({ success: true, url: logoPath });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};
