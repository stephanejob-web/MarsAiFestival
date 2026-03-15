import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { findByEmail, insertJury, upsertGoogleJury, findById, updateProfilPicture, updatePassword } from "../repositories/jury.repository";
import { verifyInviteToken } from "../services/invite.service";
import fs from "fs";
import path from "path";
import "dotenv/config";

const AVATARS_DIR = path.join(__dirname, "../../uploads/avatars");
if (!fs.existsSync(AVATARS_DIR)) fs.mkdirSync(AVATARS_DIR, { recursive: true });

const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const makeToken = (jury: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    profil_picture?: string | null;
}): string =>
    jwt.sign(
        {
            id: jury.id,
            email: jury.email,
            firstName: jury.first_name,
            lastName: jury.last_name,
            role: jury.role,
            profilPicture: jury.profil_picture ?? null,
        },
        JWT_SECRET,
        { expiresIn: "7d" },
    );

// ── POST /api/auth/register ────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password } = req.body as Record<string, string>;
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const avatarFile = files?.["avatar"]?.[0] ?? null;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
        res.status(400).json({ success: false, message: "Tous les champs sont obligatoires." });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({
            success: false,
            message: "Le mot de passe doit contenir au moins 8 caractères.",
        });
        return;
    }
    if (!avatarFile) {
        res.status(400).json({ success: false, message: "Un avatar est obligatoire." });
        return;
    }

    const existing = await findByEmail(email.toLowerCase());
    if (existing) {
        res.status(409).json({ success: false, message: "Un compte existe déjà avec cet e-mail." });
        return;
    }

    try {
        const ext = path.extname(avatarFile.originalname).toLowerCase() || ".jpg";
        const avatarFilename = `${Date.now()}${ext}`;
        fs.writeFileSync(path.join(AVATARS_DIR, avatarFilename), avatarFile.buffer);
        const profilPicture = `http://localhost:5500/uploads/avatars/${avatarFilename}`;

        const password_hash = await bcrypt.hash(password, 12);
        const jury = await insertJury({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.toLowerCase().trim(),
            password_hash,
            profil_picture: profilPicture,
        });

        res.status(201).json({
            success: true,
            token: makeToken(jury),
            user: {
                id: jury.id,
                email: jury.email,
                firstName: jury.first_name,
                lastName: jury.last_name,
                role: jury.role,
                profilPicture,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création du compte.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as Record<string, string>;

    if (!email?.trim() || !password?.trim()) {
        res.status(400).json({ success: false, message: "E-mail et mot de passe obligatoires." });
        return;
    }

    const jury = await findByEmail(email.toLowerCase());
    if (!jury || !jury.password_hash) {
        res.status(401).json({ success: false, message: "Identifiants incorrects." });
        return;
    }

    const valid = await bcrypt.compare(password, jury.password_hash);
    if (!valid) {
        res.status(401).json({ success: false, message: "Identifiants incorrects." });
        return;
    }

    res.json({
        success: true,
        token: makeToken(jury),
        user: {
            id: jury.id,
            email: jury.email,
            firstName: jury.first_name,
            lastName: jury.last_name,
            role: jury.role,
        },
    });
};

// ── GET /api/auth/me — Profil du juré connecté ────────────────────────────────
export const me = (req: Request, res: Response): void => {
    res.json({ success: true, user: req.juryUser });
};

// ── POST /api/auth/accept-invite ──────────────────────────────────────────────
// Le membre invité finalise son compte (nom, mot de passe, avatar) via le token d'invitation.
export const acceptInvite = async (req: Request, res: Response): Promise<void> => {
    const { token, firstName, lastName, password } = req.body as Record<string, string>;
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const avatarFile = files?.["avatar"]?.[0] ?? null;

    if (!token || !firstName?.trim() || !lastName?.trim() || !password?.trim()) {
        res.status(400).json({ success: false, message: "Tous les champs sont obligatoires." });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({
            success: false,
            message: "Le mot de passe doit contenir au moins 8 caractères.",
        });
        return;
    }

    let invitePayload: { email: string; role: "jury" | "admin" };
    try {
        invitePayload = verifyInviteToken(token);
    } catch {
        res.status(401).json({ success: false, message: "Token d'invitation invalide ou expiré." });
        return;
    }

    const existing = await findByEmail(invitePayload.email);
    if (existing) {
        res.status(409).json({
            success: false,
            message: "Ce compte a déjà été créé. Connectez-vous directement.",
        });
        return;
    }

    try {
        let profilPicture: string | null = null;
        if (avatarFile) {
            const ext = path.extname(avatarFile.originalname).toLowerCase() || ".jpg";
            const avatarFilename = `${Date.now()}${ext}`;
            fs.writeFileSync(path.join(AVATARS_DIR, avatarFilename), avatarFile.buffer);
            profilPicture = `http://localhost:5500/uploads/avatars/${avatarFilename}`;
        }

        const password_hash = await bcrypt.hash(password, 12);
        const jury = await insertJury({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: invitePayload.email,
            password_hash,
            role: invitePayload.role,
            profil_picture: profilPicture,
        });

        res.status(201).json({
            success: true,
            token: makeToken(jury),
            user: {
                id: jury.id,
                email: jury.email,
                firstName: jury.first_name,
                lastName: jury.last_name,
                role: jury.role,
                profilPicture,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création du compte.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── PUT /api/auth/profile/avatar — Changer son avatar ────────────────────────
export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
    const juryId = req.juryUser!.id;
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const avatarFile = files?.["avatar"]?.[0] ?? null;

    if (!avatarFile) {
        res.status(400).json({ success: false, message: "Aucun fichier fourni." });
        return;
    }

    try {
        const ext = path.extname(avatarFile.originalname).toLowerCase() || ".jpg";
        const avatarFilename = `${Date.now()}${ext}`;
        fs.writeFileSync(path.join(AVATARS_DIR, avatarFilename), avatarFile.buffer);
        const profilPicture = `http://localhost:5500/uploads/avatars/${avatarFilename}`;

        await updateProfilPicture(juryId, profilPicture);

        const jury = await findById(juryId);
        if (!jury) {
            res.status(404).json({ success: false, message: "Juré introuvable." });
            return;
        }

        const newToken = makeToken({ ...jury, profil_picture: profilPicture });
        res.json({ success: true, token: newToken, profilPicture });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour de l'avatar.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── PUT /api/auth/profile/password — Changer son mot de passe ────────────────
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body as Record<string, string>;
    const juryId = req.juryUser!.id;

    if (!newPassword?.trim() || newPassword.length < 8) {
        res.status(400).json({
            success: false,
            message: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
        });
        return;
    }

    try {
        const jury = await findById(juryId);
        if (!jury) {
            res.status(404).json({ success: false, message: "Juré introuvable." });
            return;
        }

        if (jury.password_hash) {
            if (!currentPassword?.trim()) {
                res.status(400).json({ success: false, message: "Mot de passe actuel requis." });
                return;
            }
            const valid = await bcrypt.compare(currentPassword, jury.password_hash);
            if (!valid) {
                res.status(401).json({ success: false, message: "Mot de passe actuel incorrect." });
                return;
            }
        }

        const newHash = await bcrypt.hash(newPassword, 12);
        await updatePassword(juryId, newHash);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors du changement de mot de passe.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── POST /api/auth/google ──────────────────────────────────────────────────────
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    const { credential } = req.body as { credential?: string };

    if (!credential) {
        res.status(400).json({ success: false, message: "Token Google manquant." });
        return;
    }
    if (!GOOGLE_CLIENT_ID) {
        res.status(500).json({
            success: false,
            message: "Google OAuth non configuré côté serveur.",
        });
        return;
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.sub || !payload.email) {
            res.status(400).json({ success: false, message: "Token Google invalide." });
            return;
        }

        const { jury, isNew } = await upsertGoogleJury({
            googleId: payload.sub,
            email: payload.email.toLowerCase(),
            firstName: payload.given_name ?? "",
            lastName: payload.family_name ?? "",
            picture: payload.picture ?? null,
        });

        res.status(isNew ? 201 : 200).json({
            success: true,
            isNew,
            token: makeToken(jury),
            user: {
                id: jury.id,
                email: jury.email,
                firstName: jury.first_name,
                lastName: jury.last_name,
                role: jury.role,
            },
        });
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Échec de la vérification Google.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
