import { Request, Response } from "express";
import {
    getAllTags,
    getActiveTags,
    createTag,
    updateTag,
    deleteTag,
} from "../repositories/voteTag.repository";

// ── GET /api/vote-tags — Liste des étiquettes actives (jury) ──────────────────
export const listActiveTags = async (_req: Request, res: Response): Promise<void> => {
    try {
        const tags = await getActiveTags();
        res.json({ success: true, data: tags });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

// ── GET /api/vote-tags/all — Toutes les étiquettes (admin) ────────────────────
export const listAllTags = async (_req: Request, res: Response): Promise<void> => {
    try {
        const tags = await getAllTags();
        res.json({ success: true, data: tags });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

// ── POST /api/vote-tags — Créer une étiquette (admin) ────────────────────────
export const addTag = async (req: Request, res: Response): Promise<void> => {
    const { key, label, icon, color, sortOrder, messageTemplate } = req.body as {
        key?: string;
        label?: string;
        icon?: string;
        color?: string;
        sortOrder?: number;
        messageTemplate?: string;
    };
    if (!key || !label || !icon || !color) {
        res.status(400).json({ success: false, message: "key, label, icon et color sont requis." });
        return;
    }
    try {
        const id = await createTag(key, label, icon, color, sortOrder ?? 0, messageTemplate);
        res.status(201).json({ success: true, data: { id } });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur serveur";
        res.status(500).json({ success: false, message: msg });
    }
};

// ── PATCH /api/vote-tags/:id — Modifier une étiquette (admin) ─────────────────
export const editTag = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { label, icon, color, isActive, sortOrder, messageTemplate } = req.body as {
        label?: string;
        icon?: string;
        color?: string;
        isActive?: boolean;
        sortOrder?: number;
        messageTemplate?: string;
    };
    if (!label || !icon || !color) {
        res.status(400).json({ success: false, message: "label, icon et color sont requis." });
        return;
    }
    try {
        await updateTag(id, label, icon, color, isActive ?? true, sortOrder ?? 0, messageTemplate);
        res.json({ success: true });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

// ── DELETE /api/vote-tags/:id — Supprimer une étiquette (admin) ───────────────
export const removeTag = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    try {
        await deleteTag(id);
        res.json({ success: true });
    } catch {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};
