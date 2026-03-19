import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import {
    listDiscussion,
    listDiscussionFilms,
    addToDiscussion,
    removeFromDiscussion,
    getFilmMessages,
} from "../controllers/discussion.controller";

const router = Router();

router.get("/", requireAuth, listDiscussion);
router.get("/films", requireAuth, listDiscussionFilms);
router.get("/messages/:filmId", requireAdmin, getFilmMessages);
router.post("/", requireAuth, addToDiscussion);
router.delete("/", requireAuth, removeFromDiscussion);

export default router;
