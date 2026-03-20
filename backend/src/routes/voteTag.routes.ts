import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import { listActiveTags, listAllTags, addTag, editTag, removeTag } from "../controllers/voteTag.controller";

const router = Router();

// GET  /api/vote-tags       — Étiquettes actives (jury + admin)
router.get("/", requireAuth, listActiveTags);

// GET  /api/vote-tags/all   — Toutes les étiquettes (admin)
router.get("/all", requireAdmin, listAllTags);

// POST /api/vote-tags       — Créer (admin)
router.post("/", requireAdmin, addTag);

// PATCH /api/vote-tags/:id  — Modifier (admin)
router.patch("/:id", requireAdmin, editTag);

// DELETE /api/vote-tags/:id — Supprimer (admin)
router.delete("/:id", requireAdmin, removeTag);

export default router;
