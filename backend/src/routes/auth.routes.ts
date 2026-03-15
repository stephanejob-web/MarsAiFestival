import { Router } from "express";
import multer from "multer";
import { register, login, googleAuth, acceptInvite, me, updateAvatar, changePassword } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/me", requireAuth, me);
router.post("/register", upload.fields([{ name: "avatar", maxCount: 1 }]), register);
router.post("/accept-invite", upload.fields([{ name: "avatar", maxCount: 1 }]), acceptInvite);
router.post("/login", login);
router.post("/google", googleAuth);
router.put("/profile/avatar", requireAuth, upload.fields([{ name: "avatar", maxCount: 1 }]), updateAvatar);
router.put("/profile/password", requireAuth, changePassword);

export default router;
