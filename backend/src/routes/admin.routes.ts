import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
    listS3Videos,
    sendInvite,
    verifyInvite,
    listUsers,
    editUser,
    toggleUserStatus,
    removeUser,
} from "../controllers/admin.controller";

const router = Router();

// ── Vidéos S3 ────────────────────────────────────────────────────────────────
// GET  /api/admin/videos
router.get("/videos", requireAdmin, listS3Videos);

// ── Invitations ───────────────────────────────────────────────────────────────
// POST /api/admin/invite
router.post("/invite", requireAdmin, sendInvite);
// GET  /api/admin/invite/verify?token=   (public — pas de requireAdmin)
router.get("/invite/verify", verifyInvite);

// ── Gestion utilisateurs ──────────────────────────────────────────────────────
// GET    /api/admin/users
router.get("/users", requireAdmin, listUsers);
// PATCH  /api/admin/users/:id
router.patch("/users/:id", requireAdmin, editUser);
// PATCH  /api/admin/users/:id/status
router.patch("/users/:id/status", requireAdmin, toggleUserStatus);
// DELETE /api/admin/users/:id
router.delete("/users/:id", requireAdmin, removeUser);

export default router;
