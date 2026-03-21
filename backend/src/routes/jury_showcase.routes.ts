import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
    listPublicJury,
    listAdminJury,
    createJuryMember,
    updateJuryMember,
    deleteJuryMember,
} from "../controllers/jury_showcase.controller";

const router = Router();

router.get("/", listPublicJury);
router.get("/admin", requireAdmin, listAdminJury);
router.post("/", requireAdmin, createJuryMember);
router.put("/:id", requireAdmin, updateJuryMember);
router.delete("/:id", requireAdmin, deleteJuryMember);

export default router;
