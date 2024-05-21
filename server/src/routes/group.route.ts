import { Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import * as controllers from "../controllers/group.controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  body("name").isString().notEmpty(),
  body("isPrivate").isBoolean().notEmpty(),
  validateRequest,
  controllers.createGroup
);

router.get("/me", authMiddleware, controllers.getMyGroups);

export default router;
