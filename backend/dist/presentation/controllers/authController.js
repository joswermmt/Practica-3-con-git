"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const zod_1 = require("zod");
const auth_1 = require("../../application/use-cases/auth");
const tokenService_1 = require("../../infrastructure/security/tokenService");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(["ADMIN", "MANAGER", "USER"]).optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
class AuthController {
    constructor(users) {
        this.users = users;
        this.register = async (req, res) => {
            try {
                const input = registerSchema.parse(req.body);
                const user = await (0, auth_1.registerUser)(this.users, input);
                return res.status(201).json({
                    user: sanitizeUser(user),
                    tokens: {
                        accessToken: (0, tokenService_1.signAccessToken)(user),
                        refreshToken: (0, tokenService_1.signRefreshToken)(user),
                    },
                });
            }
            catch (error) {
                return handleError(error, res);
            }
        };
        this.login = async (req, res) => {
            try {
                const input = loginSchema.parse(req.body);
                const user = await (0, auth_1.loginUser)(this.users, input);
                return res.json({
                    user: sanitizeUser(user),
                    tokens: {
                        accessToken: (0, tokenService_1.signAccessToken)(user),
                        refreshToken: (0, tokenService_1.signRefreshToken)(user),
                    },
                });
            }
            catch (error) {
                return handleError(error, res);
            }
        };
    }
}
exports.AuthController = AuthController;
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
function handleError(error, res) {
    if (error instanceof zod_1.z.ZodError) {
        return res.status(400).json({ message: "Validation error", details: error.issues });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Invalid credentials" ? 401 : 400;
    return res.status(status).json({ message });
}
