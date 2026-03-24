import { Router } from "express";
import { requireAuth, requireAdmin, requireNotBanned } from "../middlewares/auth.middleware";
import { submitVote, removeVote, listVotes, votesSummary } from "../controllers/vote.controller";

const router = Router();

// POST   /api/votes              — Soumettre / modifier son vote (juré)
router.post("/", requireAuth, requireNotBanned, submitVote);

// GET    /api/votes?filmId=X     — Votes pour un film
// GET    /api/votes?juryId=X     — Votes d'un juré
router.get("/", requireAuth, listVotes);

// DELETE /api/votes?filmId=X     — Annuler son vote sur un film
router.delete("/", requireAuth, requireNotBanned, removeVote);

// GET    /api/votes/summary      — Synthèse complète pour admin
router.get("/summary", requireAdmin, votesSummary);

export default router;
