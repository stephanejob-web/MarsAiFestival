import { Router } from "express";
import { requireAuth, requireNotBanned } from "../middlewares/auth.middleware";
import {
    postComment,
    listComments,
    listMyComments,
    postFilmComment,
    listFilmComments,
    listMyFilmComments,
} from "../controllers/comment.controller";

const router = Router();

// POST  /api/comments            — Publier un commentaire (juré, upsert 1 par film)
router.post("/", requireAuth, requireNotBanned, postComment);

// GET   /api/comments/mine       — Tous mes commentaires upsert (bulk)
router.get("/mine", requireAuth, listMyComments);

// GET   /api/comments?filmId=X   — Commentaires upsert d'un film
router.get("/", requireAuth, listComments);

// POST  /api/comments/film       — Ajouter un commentaire libre (N par film)
router.post("/film", requireAuth, requireNotBanned, postFilmComment);

// GET   /api/comments/film/mine  — Mes commentaires libres (bulk)
router.get("/film/mine", requireAuth, listMyFilmComments);

// GET   /api/comments/film?filmId=X — Commentaires libres d'un film
router.get("/film", requireAuth, listFilmComments);

export default router;
