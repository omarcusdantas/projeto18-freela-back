import { Router } from "express";
import authRouter from "./auth.routes.js";
import servicesRouter from "./services.routes.js";

const router = Router();
router.use(authRouter);
router.use(servicesRouter);

export default router;