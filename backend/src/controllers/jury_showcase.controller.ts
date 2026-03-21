import { Request, Response } from "express";
import {
    getActiveMembers,
    getAllMembers,
    createMember,
    updateMember,
    deleteMember,
} from "../repositories/jury_showcase.repository";

export const listPublicJury = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getActiveMembers();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur récupération jury.", error: err instanceof Error ? err.message : String(err) });
    }
};

export const listAdminJury = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllMembers();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur récupération jury.", error: err instanceof Error ? err.message : String(err) });
    }
};

export const createJuryMember = async (req: Request, res: Response): Promise<void> => {
    const { name, display_role, badge, quote, photo_url, is_featured, sort_order, is_active } = req.body as Record<string, string | number>;
    if (!name || !display_role) {
        res.status(400).json({ success: false, message: "name et display_role sont obligatoires." });
        return;
    }
    try {
        const id = await createMember({
            name: String(name),
            display_role: String(display_role),
            badge: String(badge ?? "Membre du Jury"),
            quote: quote ? String(quote) : null,
            photo_url: photo_url ? String(photo_url) : null,
            is_featured: Number(is_featured ?? 0),
            sort_order: Number(sort_order ?? 0),
            is_active: Number(is_active ?? 1),
        });
        res.status(201).json({ success: true, data: { id } });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur création membre.", error: err instanceof Error ? err.message : String(err) });
    }
};

export const updateJuryMember = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!id) { res.status(400).json({ success: false, message: "ID invalide." }); return; }
    try {
        await updateMember(id, req.body);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur mise à jour membre.", error: err instanceof Error ? err.message : String(err) });
    }
};

export const deleteJuryMember = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!id) { res.status(400).json({ success: false, message: "ID invalide." }); return; }
    try {
        await deleteMember(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur suppression membre.", error: err instanceof Error ? err.message : String(err) });
    }
};
