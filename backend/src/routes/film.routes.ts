
import { Router } from "express";
import multer from "multer";
import { submitFilm, listFilms, showFilm } from "../controllers/film.controller";

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 500 * 1024 * 1024 }, // 500 Mo max
});

router.get("/", listFilms);
router.get("/:id", showFilm);
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
