import { Request, Response } from "express";
import User from "../models/user";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const user = await User.create({ name, username, password, role: "user" });

    const refreshToken = user.genRefreshToken();
    const accessToken = user.genAccessToken();

    return res.status(201).json({ accessToken, refreshToken, id: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isValid = user.comparePassword(password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const refreshToken = user.genRefreshToken();
    const accessToken = user.genAccessToken();

    return res.status(200).json({ accessToken, refreshToken, id: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
