import { User } from "../domain/entities/User";

export interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(search?: string): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
