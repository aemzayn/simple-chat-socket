import { Request, Response } from "express";
import User from "../models/user";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    const refreshToken = user.genRefreshToken();
    const accessToken = user.genAccessToken();
    return res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
