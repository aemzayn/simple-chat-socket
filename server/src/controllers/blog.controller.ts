import { Request, Response } from "express";
import Blog from "../models/blog";

export const createBlog = async (req: Request, res: Response) => {
  const { title, author, body, isPublished } = req.body;

  try {
    const blog = await Blog.create({
      title,
      author,
      body,
      isPublished,
    });

    res.status(201).json({ data: blog });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ data: blogs });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
