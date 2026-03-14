import { Router } from "express";
import multer from "multer";
import {
    submitFilm,
    listFilms,
    showFilm,
    patchFilm,
    filmsStats,
} from "../controllers/film.controller";
import { requireAdmin } from "../middlewares/auth.middleware";

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 500 * 1024 * 1024 }, // 500 Mo max
});

router.get("/", listFilms);
router.get("/stats", requireAdmin, filmsStats);
router.get("/:id", showFilm);
router.patch("/:id", requireAdmin, patchFilm);
router.post(
    "/",
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "subtitleFR", maxCount: 1 },
        { name: "subtitleEN", maxCount: 1 },
    ]),
    submitFilm,
);

export default router;
