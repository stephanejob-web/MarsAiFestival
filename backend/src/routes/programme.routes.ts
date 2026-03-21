import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
    listProgramme,
    createProgrammeEvent,
    updateProgrammeEvent,
    deleteProgrammeEvent,
} from "../controllers/programme.controller";

const router = Router();

router.get("/", listProgramme);
router.post("/", requireAdmin, createProgrammeEvent);
router.put("/:id", requireAdmin, updateProgrammeEvent);
router.delete("/:id", requireAdmin, deleteProgrammeEvent);

export default router;
