import { Request, Response } from "express";
import { listVideosFromS3, getPresignedVideoUrl, extractS3Key } from "../services/s3.service";
import { getFilms, getFilmById } from "../repositories/film.repository";
import { resetAllVotes } from "../repositories/vote.repository";
import { getAllRealisators } from "../repositories/realisator.repository";
import { sendRealisateurEmail } from "../services/realisator-email.service";
import type { ScreeningState } from "../index";
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
    updateModeratorPermissions,
    getModeratorPermissions,
    type ModeratorPermissions,
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
        // Initialise les permissions si on passe un user en modérateur sans permissions
        if (role === "moderateur") {
            const existing = await getModeratorPermissions(id);
            if (!existing) {
                await updateModeratorPermissions(id, {
                    can_access_admin: false,
                    can_disable_accounts: false,
                    can_ban_users: false,
                    can_send_messages: false,
                });
            }
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

// ── PUT /api/admin/users/:id/permissions — Définir les permissions d'un modérateur ──
export const updatePermissions = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    const { can_disable_accounts, can_ban_users, can_send_messages, can_access_admin } =
        req.body as Partial<ModeratorPermissions>;

    const permissions: ModeratorPermissions = {
        can_disable_accounts: Boolean(can_disable_accounts),
        can_ban_users: Boolean(can_ban_users),
        can_send_messages: Boolean(can_send_messages),
        can_access_admin: Boolean(can_access_admin),
    };

    try {
        await updateModeratorPermissions(id, permissions);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour des permissions.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── POST /api/admin/users/:id/message — Envoyer un message en temps réel ──────
export const sendMessageToUser = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    const { message } = req.body as { message?: string };
    if (!message?.trim()) {
        res.status(400).json({ success: false, message: "Message vide." });
        return;
    }
    try {
        const io = req.app.locals.io as import("socket.io").Server;
        const juryToSockets = req.app.locals.juryToSockets as Map<number, Set<string>>;
        const sockets = juryToSockets.get(id);
        if (sockets) {
            for (const socketId of sockets) {
                io.to(socketId).emit("admin:message", { message: message.trim() });
            }
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'envoi.",
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

// ── POST /api/admin/screening/start — Projeter un film à tous les jurés ───────
export const startScreening = async (req: Request, res: Response): Promise<void> => {
    const { filmId } = req.body as { filmId?: number };
    if (!filmId) {
        res.status(400).json({ success: false, message: "filmId est requis." });
        return;
    }
    try {
        const film = await getFilmById(Number(filmId));
        if (!film) {
            res.status(404).json({ success: false, message: "Film introuvable." });
            return;
        }

        let videoUrl: string | null = (film.video_url as string | null) ?? null;
        if (videoUrl) {
            const key = extractS3Key(videoUrl);
            if (key) videoUrl = await getPresignedVideoUrl(key);
        }

        const state: ScreeningState = {
            filmId: Number(filmId),
            title: film.original_title as string,
            country: (film.country as string) ?? "",
            videoUrl,
            posterImg: (film.poster_img as string | null) ?? null,
            startedAt: Date.now(),
        };

        const io = req.app.locals.io as import("socket.io").Server;
        const screeningRef = req.app.locals.screeningRef as { current: ScreeningState | null };
        screeningRef.current = state;
        io.emit("screening:start", state);

        res.json({ success: true, data: state });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors du lancement du screening.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── POST /api/admin/screening/stop — Arrêter la projection ────────────────────
export const stopScreening = (req: Request, res: Response): void => {
    const io = req.app.locals.io as import("socket.io").Server;
    const screeningRef = req.app.locals.screeningRef as { current: ScreeningState | null };
    screeningRef.current = null;
    io.emit("screening:stop");
    res.json({ success: true });
};

// ── GET /api/admin/screening/state — État actuel de la projection ─────────────
export const getScreeningState = (req: Request, res: Response): void => {
    const screeningRef = req.app.locals.screeningRef as { current: ScreeningState | null };
    res.json({ success: true, data: screeningRef.current });
};

// ── POST /api/admin/screening/playback — Synchroniser play/pause ──────────────
export const playbackScreening = (req: Request, res: Response): void => {
    const { action, currentTime } = req.body as { action: "play" | "pause"; currentTime: number };
    const screeningRef = req.app.locals.screeningRef as { current: ScreeningState | null };
    if (!screeningRef.current) {
        res.status(400).json({ success: false, message: "Aucune projection en cours" });
        return;
    }
    const io = req.app.locals.io as import("socket.io").Server;
    io.emit("screening:playback", { action, currentTime, emittedAt: Date.now() });
    res.json({ success: true });
};

// ── POST /api/admin/screening/seek — Synchroniser la position de lecture ───────
export const seekScreening = (req: Request, res: Response): void => {
    const { currentTime } = req.body as { currentTime: number };
    const screeningRef = req.app.locals.screeningRef as { current: ScreeningState | null };
    if (!screeningRef.current) {
        res.status(400).json({ success: false, message: "Aucune projection en cours" });
        return;
    }
    const seekedAt = Date.now();
    screeningRef.current = { ...screeningRef.current, seekTime: currentTime, seekedAt };
    const io = req.app.locals.io as import("socket.io").Server;
    io.emit("screening:seek", { currentTime, seekedAt });
    res.json({ success: true });
};

// ── GET /api/admin/realisators — Liste des réalisateurs avec email ────────────
export const listRealisators = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllRealisators();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des réalisateurs.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── POST /api/admin/emailing — Envoi d'email groupé aux réalisateurs ──────────
export const sendBulkEmail = async (req: Request, res: Response): Promise<void> => {
    const { emails, subject, message } = req.body as {
        emails?: string[];
        subject?: string;
        message?: string;
    };

    if (!emails?.length || !subject?.trim() || !message?.trim()) {
        res.status(400).json({ success: false, message: "emails, subject et message sont requis." });
        return;
    }

    const results = await Promise.allSettled(
        emails.map((email) =>
            sendRealisateurEmail(email, "", "", subject.trim(), message.trim()),
        ),
    );

    const failed = results.filter((r) => r.status === "rejected").length;
    const sent = results.length - failed;

    res.json({ success: true, sent, failed });
};

// ── DELETE /api/admin/votes/reset — Remet tous les votes à NULL (tests/dev) ───
export const resetAllVotesHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const affected = await resetAllVotes();
        res.json({ success: true, message: `${affected} vote(s) réinitialisé(s).`, affected });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
