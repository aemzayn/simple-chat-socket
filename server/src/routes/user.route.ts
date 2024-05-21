import { Router } from "express";
import * as controllers from "../controllers/user.controller";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

const router = Router();

router.get("/:id", controllers.getUser);

router.put(
  "/:id",
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Email must be valid"),
  validateRequest,
  controllers.updateUser
);

router.delete("/:id", controllers.deleteUser);

export default router;
