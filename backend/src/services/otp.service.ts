import crypto from "crypto";
import { BrevoClient } from "@getbrevo/brevo";

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY ?? "" });

interface OtpEntry {
    code: string;
    expiresAt: number;
}

const otpStore: Record<string, OtpEntry> = {};

export function generateAndStoreOtp(email: string): string {
    const code = String(crypto.randomInt(100000, 1000000));
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore[email] = { code, expiresAt };
    return code;
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
    await client.transactionalEmails.sendTransacEmail({
        sender: { name: "marsAI Festival", email: process.env.BREVO_SENDER_EMAIL ?? "" },
        to: [{ email }],
        subject: "MarsAI Festival — Code de vérification",
        textContent: `Votre code de vérification est : ${code}\n\nIl expire dans 5 minutes.`,
        htmlContent: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto">
                <h2 style="color:#4effce">MarsAI Festival</h2>
                <p>Votre code de vérification :</p>
                <div style="font-size:2rem;font-weight:bold;letter-spacing:0.3em;padding:16px;background:#0d1117;color:#4effce;text-align:center;border-radius:8px">
                    ${code}
                </div>
                <p style="color:#888;font-size:0.85rem">Ce code expire dans 5 minutes.</p>
            </div>
        `,
    });
}

export function verifyOtp(email: string, code: string): boolean {
    const entry = otpStore[email];
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) return false;
    if (entry.code !== code) return false;
    delete otpStore[email];
    return true;
}
