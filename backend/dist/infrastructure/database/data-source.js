"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const UserOrmEntity_1 = require("./entities/UserOrmEntity");
const _202604010001_CreateUsersTable_1 = require("./migrations/202604010001-CreateUsersTable");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mssql",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 1433),
    username: process.env.DB_USERNAME ?? "sa",
    password: process.env.DB_PASSWORD ?? "YourStrong!Passw0rd",
    database: process.env.DB_NAME ?? "GestionUsuariosDB",
    synchronize: false,
    logging: false,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    entities: [UserOrmEntity_1.UserOrmEntity],
    migrations: [_202604010001_CreateUsersTable_1.CreateUsersTable202604010001],
});
