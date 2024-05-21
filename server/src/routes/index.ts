import { Router } from "express";
import blogRoutes from "./blog.route";
import authRoutes from "./auth.route";

const router = Router();

router.use("/blog", blogRoutes);
router.use("/auth", authRoutes);

export default router;
