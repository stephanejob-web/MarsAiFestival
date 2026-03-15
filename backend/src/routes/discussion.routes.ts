import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
    listDiscussion,
    addToDiscussion,
    removeFromDiscussion,
} from "../controllers/discussion.controller";

const router = Router();

router.get("/", requireAuth, listDiscussion);
router.post("/", requireAuth, addToDiscussion);
router.delete("/", requireAuth, removeFromDiscussion);

export default router;
