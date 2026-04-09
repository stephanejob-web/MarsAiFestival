import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import { savePushToken, sendPushNotification, getDevices } from "../controllers/push.controller";

const router = Router();

// POST /api/push/token — juré enregistre son token (après login)
router.post("/token", requireAuth, savePushToken);

// POST /api/push/send    — admin envoie une notification
router.post("/send", requireAdmin, sendPushNotification);

// GET  /api/push/devices — admin liste les devices enregistrés
router.get("/devices", requireAdmin, getDevices);

export default router;
