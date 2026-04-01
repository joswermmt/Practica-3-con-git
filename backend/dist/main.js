"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
const data_source_1 = require("./infrastructure/database/data-source");
const UserOrmEntity_1 = require("./infrastructure/database/entities/UserOrmEntity");
const SqlServerUserRepository_1 = require("./infrastructure/repositories/SqlServerUserRepository");
const routes_1 = require("./presentation/routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
const port = Number(process.env.PORT ?? 3001);
async function bootstrap() {
    await data_source_1.AppDataSource.initialize();
    await data_source_1.AppDataSource.runMigrations();
    const repository = new SqlServerUserRepository_1.SqlServerUserRepository(data_source_1.AppDataSource.getRepository(UserOrmEntity_1.UserOrmEntity));
    const admin = await repository.findByEmail("admin@demo.com");
    if (!admin) {
        const passwordHash = await bcryptjs_1.default.hash("123456", 10);
        const now = new Date();
        await repository.create({
            id: (0, crypto_1.randomUUID)(),
            name: "Administrador",
            email: "admin@demo.com",
            passwordHash,
            role: "ADMIN",
            createdAt: now,
            updatedAt: now,
        });
    }
    app.use("/api", (0, routes_1.createRouter)(repository));
    app.listen(port, () => {
        console.log(`API running on http://localhost:${port}`);
    });
}
void bootstrap();
