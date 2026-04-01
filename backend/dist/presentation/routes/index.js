"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const usersController_1 = require("../controllers/usersController");
function createRouter(repository) {
    const router = (0, express_1.Router)();
    const authController = new authController_1.AuthController(repository);
    const usersController = new usersController_1.UsersController(repository);
    router.get("/health", (_req, res) => res.json({ status: "ok" }));
    router.post("/auth/register", authController.register);
    router.post("/auth/login", authController.login);
    router.get("/users", usersController.list);
    router.put("/users/:id", usersController.update);
    router.delete("/users/:id", usersController.remove);
    return router;
}
