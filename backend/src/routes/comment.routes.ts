import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { postComment, listComments, listMyComments } from "../controllers/comment.controller";

const router = Router();

// POST  /api/comments            — Publier un commentaire (juré)
router.post("/", requireAuth, postComment);

// GET   /api/comments/mine       — Tous mes commentaires (bulk)
router.get("/mine", requireAuth, listMyComments);

// GET   /api/comments?filmId=X   — Commentaires d'un film
router.get("/", requireAuth, listComments);

export default router;
