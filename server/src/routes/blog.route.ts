import { Router } from "express";
import * as controllers from "../controllers/blog.controller";

const router = Router();

router.get("/", controllers.getBlogs);
router.post("/", controllers.createBlog);

export default router;
