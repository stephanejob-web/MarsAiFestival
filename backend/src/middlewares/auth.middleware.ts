import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-secret";

export interface JwtPayload {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: "jury" | "admin";
    profilPicture: string | null;
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

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    requireAuth(req, res, () => {
        if (req.juryUser?.role !== "admin") {
            res.status(403).json({ success: false, message: "Accès réservé aux administrateurs." });
            return;
        }
        next();
    });
};
