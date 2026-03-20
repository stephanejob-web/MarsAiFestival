import { Request, Response } from "express";
import { listVideosFromS3, getPresignedVideoUrl, extractS3Key } from "../services/s3.service";
import { getFilms } from "../repositories/film.repository";
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
    banJuryUser,
    unbanJuryUser,
    deleteJuryUser,
} from "../repositories/jury.repository";

// ── GET /api/admin/films — Films avec URLs vidéo pré-signées (1h) ─────────────
export const listAdminFilms = async (_req: Request, res: Response): Promise<void> => {
    try {
        const rows = await getFilms();
        const data = await Promise.all(
            rows.map(async (row) => {
                if (!row.video_url) return row;
                const key = extractS3Key(row.video_url as string);
                if (!key) return row;
                try {
                    const presignedUrl = await getPresignedVideoUrl(key);
                    return { ...row, video_url: presignedUrl };
                } catch {
                    return row;
                }
            }),
        );
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des films.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

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
            role: role as "jury" | "admin" | "moderateur" | undefined,
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
        res.status(403).json({
            success: false,
            message: "Impossible de désactiver votre propre compte.",
        });
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
        res.status(403).json({
            success: false,
            message: "Impossible de supprimer votre propre compte.",
        });
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

// ── POST /api/admin/vocal/start — L'admin lance un vocal (notifie tous les jurés) ──
export const startAdminVocal = (req: Request, res: Response): void => {
    const io = req.app.locals.io as import("socket.io").Server;
    const vocalUsers = req.app.locals.vocalUsers as Map<
        string,
        { juryId: number; name: string; initials: string; profilPicture: string | null }
    >;
    const admin = req.juryUser!;
    const fullName = `${admin.firstName} ${admin.lastName}`;
    const initials = `${admin.firstName[0]}${admin.lastName[0]}`.toUpperCase();

    const key = `admin-${admin.id}`;
    const isFirst = vocalUsers.size === 0;
    vocalUsers.set(key, {
        juryId: admin.id,
        name: fullName,
        initials,
        profilPicture: admin.profilPicture ?? null,
    });

    if (isFirst) {
        io.emit("vocal:started", {
            name: fullName,
            initials,
            profilPicture: admin.profilPicture ?? null,
        });
    } else {
        io.emit("vocal:joined", {
            name: fullName,
            initials,
            profilPicture: admin.profilPicture ?? null,
        });
    }
    io.emit("vocal:online", Array.from(vocalUsers.values()));
    res.json({ success: true });
};

// ── POST /api/admin/vocal/stop — L'admin quitte le vocal ─────────────────────
export const stopAdminVocal = (req: Request, res: Response): void => {
    const io = req.app.locals.io as import("socket.io").Server;
    const vocalUsers = req.app.locals.vocalUsers as Map<
        string,
        { juryId: number; name: string; initials: string; profilPicture: string | null }
    >;
    const admin = req.juryUser!;
    const fullName = `${admin.firstName} ${admin.lastName}`;

    const key = `admin-${admin.id}`;
    if (vocalUsers.has(key)) {
        vocalUsers.delete(key);
        io.emit("vocal:left", { name: fullName });
        io.emit("vocal:online", Array.from(vocalUsers.values()));
    }
    res.json({ success: true });
};

// ── POST /api/admin/users/:id/ban — Bannir un utilisateur en temps réel ───────
export const banUser = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    try {
        // Bannir en base (is_banned = 1, is_active = 0)
        const updated = await banJuryUser(id);
        if (!updated) {
            res.status(404).json({ success: false, message: "Utilisateur introuvable." });
            return;
        }

        // Émettre user:banned à tous les sockets de cet utilisateur
        const io = req.app.locals.io as import("socket.io").Server;
        const juryToSockets = req.app.locals.juryToSockets as Map<number, Set<string>>;
        const sockets = juryToSockets.get(id);
        if (sockets) {
            for (const socketId of sockets) {
                io.to(socketId).emit("user:banned");
            }
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors du bannissement.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── POST /api/admin/users/:id/unban — Réactiver un utilisateur banni ──────────
export const unbanUser = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    try {
        const updated = await unbanJuryUser(id);
        if (!updated) {
            res.status(404).json({ success: false, message: "Utilisateur introuvable." });
            return;
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la réactivation.",
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
