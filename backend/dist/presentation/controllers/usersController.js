"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const zod_1 = require("zod");
const users_1 = require("../../application/use-cases/users");
const updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    role: zod_1.z.enum(["ADMIN", "MANAGER", "USER"]).optional(),
});
class UsersController {
    constructor(users) {
        this.users = users;
        this.list = async (req, res) => {
            const search = typeof req.query.search === "string" ? req.query.search : undefined;
            const users = await (0, users_1.listUsers)(this.users, search);
            return res.json(users.map(sanitizeUser));
        };
        this.update = async (req, res) => {
            try {
                const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                const input = updateUserSchema.parse(req.body);
                const user = await (0, users_1.updateUser)(this.users, id, input);
                return res.json(sanitizeUser(user));
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                const status = message === "User not found" ? 404 : 400;
                return res.status(status).json({ message });
            }
        };
        this.remove = async (req, res) => {
            try {
                const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                await (0, users_1.removeUser)(this.users, id);
                return res.status(204).send();
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                const status = message === "User not found" ? 404 : 400;
                return res.status(status).json({ message });
            }
        };
    }
}
exports.UsersController = UsersController;
function sanitizeUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
