import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { postComment, listComments } from "../controllers/comment.controller";

const router = Router();

// POST  /api/comments            — Publier un commentaire (juré)
router.post("/", requireAuth, postComment);

// GET   /api/comments?filmId=X   — Commentaires d'un film
router.get("/", requireAuth, listComments);

export default router;
