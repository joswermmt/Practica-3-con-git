import jwt from "jsonwebtoken";
import { User } from "../../domain/entities/User";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";

export function signAccessToken(user: User): string {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(user: User): string {
  return jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}
