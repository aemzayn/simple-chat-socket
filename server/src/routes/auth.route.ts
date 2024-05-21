import { Router } from "express";
import * as controllers from "../controllers/auth.controller";

const router = Router();

router.post("/signup", controllers.signUp);
router.post("/signin", controllers.signIn);

export default router;