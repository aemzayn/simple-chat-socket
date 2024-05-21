import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/auth-request";

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.header("access-token");

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}
