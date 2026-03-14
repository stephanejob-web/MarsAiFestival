import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import {
    submitTicket,
    listTickets,
    showTicket,
    patchTicket,
    emailRealisator,
} from "../controllers/ticket.controller";

const router = Router();

// POST  /api/tickets             — Créer un signalement (juré)
router.post("/", requireAuth, submitTicket);

// GET   /api/tickets             — Tous les tickets (admin)
router.get("/", requireAdmin, listTickets);

// GET   /api/tickets/:id         — Détail d'un ticket (admin)
router.get("/:id", requireAdmin, showTicket);

// PATCH /api/tickets/:id         — Mettre à jour statut + note admin
router.patch("/:id", requireAdmin, patchTicket);

// POST  /api/tickets/:id/email   — Envoyer un email au réalisateur (admin)
router.post("/:id/email", requireAdmin, emailRealisator);

export default router;
