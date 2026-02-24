import { Router } from "express";
import { welcome } from "../controllers/home.controller";

const router = Router();

router.get("/", welcome);

export default router;
