import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
    listDiscussion,
    listDiscussionFilms,
    addToDiscussion,
    removeFromDiscussion,
} from "../controllers/discussion.controller";

const router = Router();

router.get("/", requireAuth, listDiscussion);
router.get("/films", requireAuth, listDiscussionFilms);
router.post("/", requireAuth, addToDiscussion);
router.delete("/", requireAuth, removeFromDiscussion);

export default router;
