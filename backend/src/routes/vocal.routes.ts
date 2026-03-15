import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { getVocalToken } from "../controllers/vocal.controller";

const router = Router();

// GET /api/vocal/token — Obtenir un token LiveKit pour rejoindre le salon vocal
router.get("/token", requireAuth, getVocalToken);

export default router;
