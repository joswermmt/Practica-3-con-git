"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";
function signAccessToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, {
        expiresIn: "15m",
    });
}
function signRefreshToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user.id }, JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
}
