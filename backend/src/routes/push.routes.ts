import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import { savePushToken, sendPushNotification } from "../controllers/push.controller";

const router = Router();

// POST /api/push/token — juré enregistre son token (après login)
router.post("/token", requireAuth, savePushToken);

// POST /api/push/send  — admin envoie une notification (ou via Postman)
router.post("/send", requireAdmin, sendPushNotification);

export default router;
