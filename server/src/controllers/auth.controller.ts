import { Request, Response } from "express";
import User from "../models/user";
import RefreshToken from "../models/refresh-token";
import dayjs from "dayjs";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username is already being used" });
    }
    const user = await User.create({ name, email, password, role: "user" });

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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValid = user.comparePassword(password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const storedRefreshToken = await RefreshToken.findOne({
      userId: user._id,
    });

    const accessToken = user.genAccessToken();
    const refreshToken = user.genRefreshToken();

    if (storedRefreshToken) {
      storedRefreshToken.token = refreshToken;
      storedRefreshToken.expiresAt = dayjs().add(7, "days").toDate();
      storedRefreshToken.deviceInfo = req.get("User-Agent");
      await storedRefreshToken.save();
    } else {
      await RefreshToken.create({
        token: refreshToken,
        userId: user._id,
        expiresAt: dayjs().add(7, "days").toDate(),
        deviceInfo: req.get("User-Agent"),
      });
    }

    return res.status(200).json({ accessToken, refreshToken, id: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
