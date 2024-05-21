import { Router } from "express";

import * as controllers from "../controllers/group.controller";

const router = Router();

router.post("/create", controllers.createGroup);
router.get("/user", controllers.getUserGroups);

export default router;
