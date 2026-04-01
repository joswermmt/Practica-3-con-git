import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { AppDataSource } from "./infrastructure/database/data-source";
import { UserOrmEntity } from "./infrastructure/database/entities/UserOrmEntity";
import { SqlServerUserRepository } from "./infrastructure/repositories/SqlServerUserRepository";
import { createRouter } from "./presentation/routes";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const port = Number(process.env.PORT ?? 3001);

async function bootstrap() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();

  const repository = new SqlServerUserRepository(AppDataSource.getRepository(UserOrmEntity));

  const admin = await repository.findByEmail("admin@demo.com");
  if (!admin) {
    const passwordHash = await bcrypt.hash("123456", 10);
    const now = new Date();
    await repository.create({
      id: randomUUID(),
      name: "Administrador",
      email: "admin@demo.com",
      passwordHash,
      role: "ADMIN",
      createdAt: now,
      updatedAt: now,
    });
  }

  app.use("/api", createRouter(repository));

  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
}

void bootstrap();
