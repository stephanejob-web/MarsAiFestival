import { Request, Response } from "express";
import { listVideosFromS3 } from "../services/s3.service";
import {
    generateInviteToken,
    verifyInviteToken,
    sendInviteEmail,
} from "../services/invite.service";
import {
    findByEmail,
    getAllJury,
    updateJuryUser,
    toggleJuryActive,
    deleteJuryUser,
} from "../repositories/jury.repository";

// ── GET /api/admin/videos ──────────────────────────────────────────────────────
export const listS3Videos = async (_req: Request, res: Response): Promise<void> => {
    try {
        const videos = await listVideosFromS3();
        res.json({ success: true, count: videos.length, data: videos });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des vidéos S3.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── POST /api/admin/invite ─────────────────────────────────────────────────────
// L'admin envoie une invitation par email à un futur juré ou admin.
export const sendInvite = async (req: Request, res: Response): Promise<void> => {
    const { email, role } = req.body as { email?: string; role?: string };

    if (!email?.trim()) {
        res.status(400).json({ success: false, message: "L'email est obligatoire." });
        return;
    }
    if (role !== "jury" && role !== "admin") {
        res.status(400).json({ success: false, message: "Le rôle doit être 'jury' ou 'admin'." });
        return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier que le compte n'existe pas déjà
    const existing = await findByEmail(normalizedEmail);
    if (existing) {
        res.status(409).json({
            success: false,
            message: "Un compte existe déjà avec cette adresse email.",
        });
        return;
    }

    try {
        const token = generateInviteToken(normalizedEmail, role);
        await sendInviteEmail(normalizedEmail, role, token);
        res.status(201).json({ success: true, message: "Invitation envoyée." });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'envoi de l'invitation.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/admin/users — Liste tous les jurés & admins ──────────────────────
export const listUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllJury();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des utilisateurs.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── PATCH /api/admin/users/:id — Modifier nom / rôle / description ────────────
export const editUser = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { firstName, lastName, role, juryDescription } = req.body as Record<string, string>;

    try {
        const updated = await updateJuryUser(id, {
            first_name: firstName,
            last_name: lastName,
            role: role as "jury" | "admin" | undefined,
            jury_description: juryDescription,
        });
        if (!updated) {
            res.status(404).json({ success: false, message: "Utilisateur introuvable." });
            return;
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la modification.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── PATCH /api/admin/users/:id/status — Activer / désactiver un compte ─────────
export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { isActive } = req.body as { isActive?: boolean };

    if (typeof isActive !== "boolean") {
        res.status(400).json({ success: false, message: "isActive (boolean) est obligatoire." });
        return;
    }
    // Empêcher l'admin de se désactiver lui-même
    if (id === req.juryUser!.id && !isActive) {
        res.status(403).json({ success: false, message: "Impossible de désactiver votre propre compte." });
        return;
    }

    try {
        const updated = await toggleJuryActive(id, isActive);
        if (!updated) {
            res.status(404).json({ success: false, message: "Utilisateur introuvable." });
            return;
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors du changement de statut.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
export const removeUser = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (id === req.juryUser!.id) {
        res.status(403).json({ success: false, message: "Impossible de supprimer votre propre compte." });
        return;
    }

    try {
        const deleted = await deleteJuryUser(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: "Utilisateur introuvable." });
            return;
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/admin/invite/verify?token= ───────────────────────────────────────
// Vérifie le token d'invitation et retourne email + rôle (utilisé par la page d'inscription).
export const verifyInvite = (_req: Request, res: Response): void => {
    const token = _req.query.token as string;
    if (!token) {
        res.status(400).json({ success: false, message: "Token manquant." });
        return;
    }
    try {
        const payload = verifyInviteToken(token);
        res.json({ success: true, email: payload.email, role: payload.role });
    } catch {
        res.status(401).json({ success: false, message: "Token invalide ou expiré." });
    }
};
