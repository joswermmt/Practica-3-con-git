import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { UserOrmEntity } from "./entities/UserOrmEntity";
import { CreateUsersTable202604010001 } from "./migrations/202604010001-CreateUsersTable";

dotenv.config();

export const AppDataSource = new DataSource({
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
  entities: [UserOrmEntity],
  migrations: [CreateUsersTable202604010001],
});
