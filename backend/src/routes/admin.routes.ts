import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
    listAdminFilms,
    listS3Videos,
    sendInvite,
    verifyInvite,
    listUsers,
    editUser,
    toggleUserStatus,
    removeUser,
    banUser,
    unbanUser,
    startAdminVocal,
    stopAdminVocal,
} from "../controllers/admin.controller";
import { getCalendarHandler, updateCalendarHandler } from "../controllers/calendar.controller";
import {
    getHeroHandler,
    updateHeroHandler,
    uploadHeroVideoHandler,
    getContactHandler,
    updateContactHandler,
} from "../controllers/hero.controller";
import {
    listSponsors,
    createSponsorHandler,
    updateSponsorHandler,
    deleteSponsorHandler,
    uploadSponsorLogoHandler,
} from "../controllers/sponsor.controller";

// ── Upload dirs ───────────────────────────────────────────────────────────────
const HERO_DIR = path.join(__dirname, "../../uploads/hero");
const SPONSORS_DIR = path.join(__dirname, "../../uploads/sponsors");
if (!fs.existsSync(HERO_DIR)) fs.mkdirSync(HERO_DIR, { recursive: true });
if (!fs.existsSync(SPONSORS_DIR)) fs.mkdirSync(SPONSORS_DIR, { recursive: true });

const heroStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, HERO_DIR),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase() || ".mp4";
        cb(null, `hero_${Date.now()}${ext}`);
    },
});

const sponsorStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, SPONSORS_DIR),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase() || ".png";
        cb(null, `sponsor_${Date.now()}${ext}`);
    },
});

const uploadHero = multer({ storage: heroStorage, limits: { fileSize: 200 * 1024 * 1024 } });
const uploadLogo = multer({ storage: sponsorStorage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

// ── Films ─────────────────────────────────────────────────────────────────────
router.get("/films", requireAdmin, listAdminFilms);
router.get("/videos", requireAdmin, listS3Videos);

// ── Invitations ───────────────────────────────────────────────────────────────
router.post("/invite", requireAdmin, sendInvite);
router.get("/invite/verify", verifyInvite);

// ── Utilisateurs ──────────────────────────────────────────────────────────────
router.get("/users", requireAdmin, listUsers);
router.patch("/users/:id", requireAdmin, editUser);
router.patch("/users/:id/status", requireAdmin, toggleUserStatus);
router.post("/users/:id/ban", requireAdmin, banUser);
router.post("/users/:id/unban", requireAdmin, unbanUser);
router.delete("/users/:id", requireAdmin, removeUser);

// ── Vocal admin ───────────────────────────────────────────────────────────────
router.post("/vocal/start", requireAdmin, startAdminVocal);
router.post("/vocal/stop", requireAdmin, stopAdminVocal);

// ── Calendrier ────────────────────────────────────────────────────────────────
router.get("/calendar", requireAdmin, getCalendarHandler);
router.put("/calendar", requireAdmin, updateCalendarHandler);

// ── Hero content ──────────────────────────────────────────────────────────────
router.get("/hero", requireAdmin, getHeroHandler);
router.put("/hero", requireAdmin, updateHeroHandler);
router.post("/hero/video", requireAdmin, uploadHero.single("video"), uploadHeroVideoHandler);

// ── Contact ───────────────────────────────────────────────────────────────────
router.get("/contact", requireAdmin, getContactHandler);
router.put("/contact", requireAdmin, updateContactHandler);

// ── Sponsors ──────────────────────────────────────────────────────────────────
router.get("/sponsors", requireAdmin, listSponsors);
router.post("/sponsors", requireAdmin, createSponsorHandler);
router.put("/sponsors/:id", requireAdmin, updateSponsorHandler);
router.delete("/sponsors/:id", requireAdmin, deleteSponsorHandler);
router.post(
    "/sponsors/:id/logo",
    requireAdmin,
    uploadLogo.single("logo"),
    uploadSponsorLogoHandler,
);

export default router;
