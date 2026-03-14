import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import { submitVote, listVotes, votesSummary } from "../controllers/vote.controller";

const router = Router();

// POST   /api/votes              — Soumettre / modifier son vote (juré)
router.post("/", requireAuth, submitVote);

// GET    /api/votes?filmId=X     — Votes pour un film
// GET    /api/votes?juryId=X     — Votes d'un juré
router.get("/", requireAuth, listVotes);

// GET    /api/votes/summary      — Synthèse complète pour admin
router.get("/summary", requireAdmin, votesSummary);

export default router;
