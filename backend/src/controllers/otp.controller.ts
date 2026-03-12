import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateAndStoreOtp, sendOtpEmail, verifyOtp } from "../services/otp.service";

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ message: "Email invalide." });
        return;
    }

    const code = generateAndStoreOtp(email);

    try {
        await sendOtpEmail(email, code);
        res.json({ message: "Code envoyé par email." });
    } catch (err) {
        res.status(500).json({ message: "Erreur envoi email.", error: err instanceof Error ? err.message : String(err) });
    }
};

export const verifyOtpHandler = (req: Request, res: Response): void => {
    const { email, code } = req.body as { email?: string; code?: string };

    if (!email || !code) {
        res.status(400).json({ message: "Email et code requis." });
        return;
    }

    if (!verifyOtp(email, code)) {
        res.status(400).json({ message: "Code incorrect ou expiré." });
        return;
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET ?? "secret", { expiresIn: "1h" });
    res.json({ message: "Email vérifié !", token });
};
