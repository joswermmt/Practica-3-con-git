"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
async function registerUser(repository, input) {
    const exists = await repository.findByEmail(input.email);
    if (exists) {
        throw new Error("Email already in use");
    }
    const passwordHash = await bcryptjs_1.default.hash(input.password, 10);
    const now = new Date();
    return repository.create({
        id: (0, crypto_1.randomUUID)(),
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role ?? "USER",
        createdAt: now,
        updatedAt: now,
    });
}
async function loginUser(repository, input) {
    const user = await repository.findByEmail(input.email);
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isValid = await bcryptjs_1.default.compare(input.password, user.passwordHash);
    if (!isValid) {
        throw new Error("Invalid credentials");
    }
    return user;
}
