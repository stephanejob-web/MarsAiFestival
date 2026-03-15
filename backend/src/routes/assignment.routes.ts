import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware";
import {
    assign,
    unassign,
    listAssignments,
    listFilmsForJury,
    listJuryForFilm,
    listJuryMembers,
    autoDistribute,
} from "../controllers/assignment.controller";

const router = Router();

// Admin only
router.get("/", requireAdmin, listAssignments);
router.get("/jury-members", requireAdmin, listJuryMembers);
router.post("/", requireAdmin, assign);
router.post("/auto-distribute", requireAdmin, autoDistribute);
router.delete("/", requireAdmin, unassign);

// Juré connecté — films qui lui sont assignés
router.get("/jury/:juryId", requireAuth, listFilmsForJury);

// Admin — jurés assignés à un film
router.get("/film/:filmId", requireAdmin, listJuryForFilm);

export default router;
