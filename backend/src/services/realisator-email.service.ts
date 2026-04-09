import { BrevoClient } from "@getbrevo/brevo";

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY ?? "" });

export async function sendRealisateurEmail(
    to: string,
    realisatorName: string,
    filmTitle: string,
    subject: string,
    message: string,
): Promise<void> {
    await client.transactionalEmails.sendTransacEmail({
        sender: { name: "marsAI Festival", email: process.env.BREVO_SENDER_EMAIL ?? "" },
        to: [{ email: to }],
        subject: `marsAI 2026 — ${subject}`,
        textContent: `Bonjour ${realisatorName},\n\n${message}\n\nL'équipe marsAI Festival 2026`,
        htmlContent: `
            <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#0f111a;color:#e2e8f0;padding:32px;border-radius:16px;">
                <h2 style="color:#4effce;margin:0 0 4px">mars<span style="color:#a78bfa">AI</span> Festival 2026</h2>
                <p style="color:#94a3b8;margin:0 0 24px;font-size:0.82rem">Concernant votre film : <strong style="color:#e2e8f0">${filmTitle}</strong></p>

                <p style="margin:0 0 16px">Bonjour ${realisatorName},</p>

                <div style="white-space:pre-wrap;background:rgba(255,255,255,0.04);border-left:3px solid #4effce;padding:16px;border-radius:0 8px 8px 0;color:#e2e8f0;font-size:0.9rem;line-height:1.6;">
                    ${message.replace(/\n/g, "<br/>")}
                </div>

                <p style="margin:24px 0 0;color:#94a3b8;font-size:0.82rem">
                    Cordialement,<br/>
                    <strong style="color:#4effce">L'équipe marsAI Festival 2026</strong>
                </p>
            </div>
        `,
    });
}
