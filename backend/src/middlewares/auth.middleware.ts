import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {
    findById,
    getModeratorPermissions,
    type ModeratorPermissions,
} from "../repositories/jury.repository";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-secret";

export interface JwtPayload {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: "jury" | "admin" | "moderateur";
    profilPicture: string | null;
    sessionToken?: string;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            juryUser?: JwtPayload;
        }
    }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "Token manquant." });
        return;
    }
    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET) as JwtPayload;
        req.juryUser = payload;
        next();
    } catch {
        res.status(401).json({ success: false, message: "Token invalide ou expiré." });
    }
};

export const requireNotBanned = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const id = req.juryUser?.id;
    if (!id) {
        res.status(401).json({ success: false, message: "Non authentifié." });
        return;
    }
    const row = await findById(id);
    if (!row || row.is_banned) {
        res.status(403).json({ success: false, message: "Votre compte a été suspendu." });
        return;
    }
    next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    requireAuth(req, res, () => {
        const role = req.juryUser?.role;
        if (role !== "admin" && role !== "moderateur") {
            res.status(403).json({ success: false, message: "Accès réservé aux administrateurs." });
            return;
        }
        next();
    });
};

export const requirePermissionOrAdmin = (
    permission: keyof ModeratorPermissions,
) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (req.juryUser?.role === "admin") {
            next();
            return;
        }
        if (req.juryUser?.role === "moderateur") {
            const perms = await getModeratorPermissions(req.juryUser.id);
            if (perms?.[permission]) {
                next();
                return;
            }
            res.status(403).json({
                success: false,
                message: "Permission insuffisante.",
            });
            return;
        }
        res.status(403).json({ success: false, message: "Accès réservé aux administrateurs." });
    };
