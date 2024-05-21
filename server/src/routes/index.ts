import { Router } from "express";
import blogRoutes from "./group.route";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/blog", blogRoutes);
router.use("/user", userRoutes);

export default router;
