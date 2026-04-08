import jwt from "jsonwebtoken";
import { BrevoClient } from "@getbrevo/brevo";
import "dotenv/config";

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY ?? "" });

const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-secret";
const INVITE_URL = process.env.INVITE_URL ?? "https://marsai.lightchurch.fr/jury";
const INVITE_EXPIRY = "48h";

export interface InvitePayload {
    type: "invite";
    email: string;
    role: "jury" | "admin";
}

export function generateInviteToken(email: string, role: "jury" | "admin"): string {
    return jwt.sign({ type: "invite", email, role } satisfies InvitePayload, JWT_SECRET, {
        expiresIn: INVITE_EXPIRY,
    });
}

export function verifyInviteToken(token: string): InvitePayload {
    const payload = jwt.verify(token, JWT_SECRET) as InvitePayload;
    if (payload.type !== "invite") throw new Error("Token invalide.");
    return payload;
}

export async function sendInviteEmail(
    email: string,
    role: "jury" | "admin",
    token: string,
): Promise<void> {
    const inviteUrl = `${INVITE_URL}?token=${token}`;
    const roleLabel = role === "admin" ? "Administrateur" : "Membre du jury";

    await client.transactionalEmails.sendTransacEmail({
        sender: { name: "marsAI Festival", email: process.env.BREVO_SENDER_EMAIL ?? "" },
        to: [{ email }],
        subject: "marsAI 2026 — Votre invitation",
        textContent: `Vous avez été invité(e) à rejoindre le jury marsAI 2026 en tant que ${roleLabel}.\n\nCliquez sur ce lien pour créer votre compte (valable 48h) :\n${inviteUrl}`,
        htmlContent: `
            <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#0f111a;color:#e2e8f0;padding:32px;border-radius:16px;">
                <h2 style="color:#4effce;margin:0 0 8px">mars<span style="color:#a78bfa">AI</span> Festival 2026</h2>
                <p style="color:#94a3b8;margin:0 0 24px;font-size:0.85rem">Panneau d'administration</p>

                <p style="margin:0 0 8px">Vous avez été invité(e) à rejoindre la plateforme marsAI 2026 en tant que :</p>
                <div style="display:inline-block;padding:6px 16px;background:rgba(78,255,206,0.1);border:1px solid rgba(78,255,206,0.3);border-radius:8px;color:#4effce;font-weight:700;font-size:0.9rem;margin-bottom:24px;">
                    ${roleLabel}
                </div>

                <p style="margin:0 0 16px;color:#94a3b8;font-size:0.85rem;">
                    Cliquez sur le bouton ci-dessous pour créer votre compte. Ce lien est valable <strong style="color:#e2e8f0">48 heures</strong>.
                </p>

                <a href="${inviteUrl}"
                   style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#4effce,#a78bfa);color:#0f111a;font-weight:800;font-size:0.95rem;text-decoration:none;border-radius:10px;margin-bottom:24px;">
                    Créer mon compte →
                </a>

                <p style="font-size:0.75rem;color:#475569;margin:0;">
                    Si vous n'attendiez pas cette invitation, ignorez simplement cet email.<br/>
                    Lien : ${inviteUrl}
                </p>
            </div>
        `,
    });
}
