import { User } from "../../domain/entities/User";
import { UserRepository } from "../../application/ports";

export class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, User>();

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find((u) => u.email === email);
    return user ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findAll(search?: string): Promise<User[]> {
    const all = Array.from(this.users.values());
    if (!search) {
      return all;
    }
    const value = search.toLowerCase();
    return all.filter(
      (u) =>
        u.name.toLowerCase().includes(value) ||
        u.email.toLowerCase().includes(value) ||
        u.role.toLowerCase().includes(value),
    );
  }

  async update(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}
