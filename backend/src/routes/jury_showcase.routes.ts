import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
    listPublicJury,
    listAdminJury,
    createJuryMember,
    updateJuryMember,
    deleteJuryMember,
} from "../controllers/jury_showcase.controller";
import type { Request, Response } from "express";

const JURY_PHOTOS_DIR = path.join(__dirname, "../../uploads/jury");
if (!fs.existsSync(JURY_PHOTOS_DIR)) fs.mkdirSync(JURY_PHOTOS_DIR, { recursive: true });

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.get("/", listPublicJury);
router.get("/admin", requireAdmin, listAdminJury);
router.post("/", requireAdmin, createJuryMember);
router.put("/:id", requireAdmin, updateJuryMember);
router.delete("/:id", requireAdmin, deleteJuryMember);

router.post(
    "/upload-photo",
    requireAdmin,
    upload.single("photo"),
    (req: Request, res: Response): void => {
        const file = req.file;
        if (!file) {
            res.status(400).json({ success: false, message: "Aucun fichier reçu." });
            return;
        }
        const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
        const filename = `jury_${Date.now()}${ext}`;
        fs.writeFileSync(path.join(JURY_PHOTOS_DIR, filename), file.buffer);
        res.json({ success: true, url: `/uploads/jury/${filename}` });
    },
);

export default router;
