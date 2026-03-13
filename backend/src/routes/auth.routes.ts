import { Router } from "express";
import multer from "multer";
import { register, login, googleAuth } from "../controllers/auth.controller";

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max pour l'avatar
});

router.post("/register", upload.fields([{ name: "avatar", maxCount: 1 }]), register);
router.post("/login", login);
router.post("/google", googleAuth);

export default router;
