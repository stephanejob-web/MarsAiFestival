import { Request, Response } from "express";
import { BrevoClient } from "@getbrevo/brevo";
import {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicket,
} from "../repositories/ticket.repository";
import "dotenv/config";

const TICKET_TYPES = ["content", "technical", "rights", "other"] as const;
const TICKET_STATUSES = ["open", "in_progress", "resolved", "rejected"] as const;

// ── POST /api/tickets — Créer un signalement (juré) ───────────────────────────
export const submitTicket = async (req: Request, res: Response): Promise<void> => {
    const { filmId, type, description } = req.body as {
        filmId?: number;
        type?: string;
        description?: string;
    };
    const juryId = req.juryUser!.id;

    if (!filmId || !description?.trim()) {
        res.status(400).json({
            success: false,
            message: "filmId et description sont obligatoires.",
        });
        return;
    }
    const ticketType = TICKET_TYPES.includes(type as (typeof TICKET_TYPES)[number])
        ? (type as (typeof TICKET_TYPES)[number])
        : "other";

    try {
        const id = await createTicket(juryId, Number(filmId), ticketType, description.trim());
        res.status(201).json({ success: true, data: { id } });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création du signalement.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/tickets — Tous les tickets (admin) ───────────────────────────────
export const listTickets = async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllTickets();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des tickets.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── GET /api/tickets/:id ──────────────────────────────────────────────────────
export const showTicket = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ success: false, message: "ID invalide." });
        return;
    }
    try {
        const ticket = await getTicketById(id);
        if (!ticket) {
            res.status(404).json({ success: false, message: "Ticket introuvable." });
            return;
        }
        res.json({ success: true, data: ticket });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du ticket.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── PATCH /api/tickets/:id — Mettre à jour statut + note admin ────────────────
export const patchTicket = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { status, adminNote } = req.body as { status?: string; adminNote?: string };

    if (!status || !TICKET_STATUSES.includes(status as (typeof TICKET_STATUSES)[number])) {
        res.status(400).json({
            success: false,
            message: `status doit être parmi : ${TICKET_STATUSES.join(", ")}`,
        });
        return;
    }

    try {
        const updated = await updateTicket(
            id,
            status as (typeof TICKET_STATUSES)[number],
            adminNote,
        );
        if (!updated) {
            res.status(404).json({ success: false, message: "Ticket introuvable." });
            return;
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du ticket.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

// ── POST /api/tickets/:id/email — Email au réalisateur (admin) ────────────────
export const emailRealisator = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { subject, body } = req.body as { subject?: string; body?: string };

    if (!subject?.trim() || !body?.trim()) {
        res.status(400).json({ success: false, message: "subject et body sont obligatoires." });
        return;
    }

    try {
        const ticket = await getTicketById(id);
        if (!ticket) {
            res.status(404).json({ success: false, message: "Ticket introuvable." });
            return;
        }

        const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY ?? "" });
        await brevo.transactionalEmails.sendTransacEmail({
            sender: { name: "marsAI Festival", email: process.env.BREVO_SENDER_EMAIL ?? "" },
            to: [{ email: ticket.realisator_email as string }],
            subject: subject.trim(),
            htmlContent: `<div style="font-family:sans-serif;max-width:520px;margin:auto">${body.trim().replace(/\n/g, "<br/>")}</div>`,
        });

        res.json({ success: true, message: "Email envoyé au réalisateur." });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'envoi de l'email.",
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
