import { NextFunction, Request, Response } from "express";
import { TokenService } from "../services/token-services";
import RefreshToken from "../models/refresh-token";
import User from "../models/user";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.header("x-access-token");
  const refreshToken = req.header("x-refresh-token");

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = TokenService.verifyAccessToken(accessToken);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = typeof decodedToken === "object" && decodedToken._id;

    if (userId === undefined) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.locals.userId = userId;
  } catch (error) {
    // Access token is invalid or expired
    if (!refreshToken) {
      console.error("Refresh token not provided");
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Get the user id from the refresh token
      const decodedRefreshToken = TokenService.verifyRefreshToken(refreshToken);
      const storedRefreshToken = await RefreshToken.findOne({
        token: refreshToken,
        expiresAt: { $gt: new Date() },
      });

      if (!decodedRefreshToken || !storedRefreshToken) {
        console.error("Invalid refresh token or refresh token expired");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId =
        typeof decodedRefreshToken === "object" && decodedRefreshToken._id;

      if (userId === undefined) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId, { role: 1, _id: 1 });

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Generate new access token
      const newAccesToken = TokenService.generateAccessToken({
        _id: user._id,
        role: user.role,
      });

      res.setHeader("x-access-token", newAccesToken);
      res.locals.userId = userId;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  next();
}
