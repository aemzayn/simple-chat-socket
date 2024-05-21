import { Router } from "express";
import blogRoutes from "./blog.route";

const router = Router();

router.use("/blog", blogRoutes);

export default router;
