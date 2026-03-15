import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import { listPhases, updatePhase } from "../controllers/phase.controller";

const router = Router();

// GET  /api/phases               — Config phases + phase active (juré & admin)
router.get("/", requireAuth, listPhases);

// PUT  /api/phases/:phaseNumber  — Sauvegarder une phase (admin)
router.put("/:phaseNumber", requireAdmin, updatePhase);

export default router;
