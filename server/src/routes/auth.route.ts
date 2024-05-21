import { Router } from "express";
import * as controllers from "../controllers/auth.controller";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

const router = Router();

router.post(
  "/signup",
  body("email").isEmail().withMessage("Email must be valid"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateRequest,
  controllers.signUp
);

router.post(
  "/signin",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateRequest,
  controllers.signIn
);

export default router;
