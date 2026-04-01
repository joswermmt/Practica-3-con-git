import { Request, Response } from "express";
import { z } from "zod";
import { UserRepository } from "../../application/ports";
import { listUsers, removeUser, updateUser } from "../../application/use-cases/users";

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["ADMIN", "MANAGER", "USER"]).optional(),
});

export class UsersController {
  constructor(private readonly users: UserRepository) {}

  list = async (req: Request, res: Response) => {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const users = await listUsers(this.users, search);
    return res.json(users.map(sanitizeUser));
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const input = updateUserSchema.parse(req.body);
      const user = await updateUser(this.users, id, input);
      return res.json(sanitizeUser(user));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = message === "User not found" ? 404 : 400;
      return res.status(status).json({ message });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await removeUser(this.users, id);
      return res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = message === "User not found" ? 404 : 400;
      return res.status(status).json({ message });
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
