import { Request, Response } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "../../application/use-cases/auth";
import { UserRepository } from "../../application/ports";
import { signAccessToken, signRefreshToken } from "../../infrastructure/security/tokenService";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "MANAGER", "USER"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthController {
  constructor(private readonly users: UserRepository) {}

  register = async (req: Request, res: Response) => {
    try {
      const input = registerSchema.parse(req.body);
      const user = await registerUser(this.users, input);
      return res.status(201).json({
        user: sanitizeUser(user),
        tokens: {
          accessToken: signAccessToken(user),
          refreshToken: signRefreshToken(user),
        },
      });
    } catch (error) {
      return handleError(error, res);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const input = loginSchema.parse(req.body);
      const user = await loginUser(this.users, input);
      return res.json({
        user: sanitizeUser(user),
        tokens: {
          accessToken: signAccessToken(user),
          refreshToken: signRefreshToken(user),
        },
      });
    } catch (error) {
      return handleError(error, res);
    }
  };
}

function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function handleError(error: unknown, res: Response) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ message: "Validation error", details: error.issues });
  }
  const message = error instanceof Error ? error.message : "Unknown error";
  const status = message === "Invalid credentials" ? 401 : 400;
  return res.status(status).json({ message });
}
