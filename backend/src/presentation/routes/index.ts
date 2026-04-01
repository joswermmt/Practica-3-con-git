import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { UsersController } from "../controllers/usersController";
import { UserRepository } from "../../application/ports";

export function createRouter(repository: UserRepository) {
  const router = Router();
  const authController = new AuthController(repository);
  const usersController = new UsersController(repository);

  router.get("/health", (_req, res) => res.json({ status: "ok" }));

  router.post("/auth/register", authController.register);
  router.post("/auth/login", authController.login);

  router.get("/users", usersController.list);
  router.put("/users/:id", usersController.update);
  router.delete("/users/:id", usersController.remove);

  return router;
}
