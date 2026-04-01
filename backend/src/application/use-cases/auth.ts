import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../ports";

export async function registerUser(
  repository: UserRepository,
  input: { name: string; email: string; password: string; role?: User["role"] },
): Promise<User> {
  const exists = await repository.findByEmail(input.email);
  if (exists) {
    throw new Error("Email already in use");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const now = new Date();
  return repository.create({
    id: randomUUID(),
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role ?? "USER",
    createdAt: now,
    updatedAt: now,
  });
}

export async function loginUser(
  repository: UserRepository,
  input: { email: string; password: string },
): Promise<User> {
  const user = await repository.findByEmail(input.email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }
  return user;
}
