import { User } from "../../domain/entities/User";
import { UserRepository } from "../ports";

export async function listUsers(repository: UserRepository, search?: string) {
  return repository.findAll(search);
}

export async function updateUser(
  repository: UserRepository,
  id: string,
  input: Partial<Pick<User, "name" | "role">>,
) {
  const current = await repository.findById(id);
  if (!current) {
    throw new Error("User not found");
  }

  const next: User = {
    ...current,
    name: input.name ?? current.name,
    role: input.role ?? current.role,
    updatedAt: new Date(),
  };

  return repository.update(next);
}

export async function removeUser(repository: UserRepository, id: string) {
  const current = await repository.findById(id);
  if (!current) {
    throw new Error("User not found");
  }
  await repository.delete(id);
}
