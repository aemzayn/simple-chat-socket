import { Router } from "express";
import groupRoutes from "./group.route";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/group", groupRoutes);
router.use("/user", userRoutes);

export default router;
