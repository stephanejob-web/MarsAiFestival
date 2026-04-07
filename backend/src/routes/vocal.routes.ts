import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { getVocalToken } from "../controllers/vocal.controller";
import { getScreeningState } from "../controllers/admin.controller";

const router = Router();

// GET /api/vocal/token — Obtenir un token LiveKit pour rejoindre le salon vocal
router.get("/token", requireAuth, getVocalToken);

// GET /api/vocal/screening-state — État de la projection en cours (accessible aux jurés)
router.get("/screening-state", requireAuth, getScreeningState);

export default router;
