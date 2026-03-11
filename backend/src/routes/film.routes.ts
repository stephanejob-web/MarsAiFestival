import { Router } from "express";
import multer from "multer";
import { submitFilm } from "../controllers/film.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

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
