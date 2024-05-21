import { Router } from "express";
import * as controllers from "../controllers/user.controller";

const router = Router();

router.get("/:id", controllers.getUser);

export default router;
