import { Router } from "express";
import { signPdf } from "../controllers/signController.js";

const router = Router();

router.post("/sign-pdf", signPdf);

export default router;
