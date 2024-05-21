import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;

interface JwtPayload {
  _id: string;
  role: string;
}

interface tokenPayload {
  _id: string;
  role: string;
}

export class TokenService {
  static generateAccessToken(payload: tokenPayload) {
    return jwt.sign(
      {
        _id: payload._id,
        role: payload.role,
      },
      JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
  }

  static generateRefreshToken(payload: tokenPayload) {
    return jwt.sign(
      {
        _id: payload._id,
        role: payload.role,
      },
      JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  }

  static isTokenExpired(tokenError: unknown) {
    return tokenError instanceof jwt.TokenExpiredError;
  }

  static renewAccessToken(refreshToken: string) {
    const payload = jwt.verify(
      refreshToken,
      JWT_REFRESH_TOKEN_SECRET
    ) as JwtPayload;
    return jwt.sign(
      { _id: payload._id, role: payload.role },
      JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10 seconds",
      }
    );
  }
}
