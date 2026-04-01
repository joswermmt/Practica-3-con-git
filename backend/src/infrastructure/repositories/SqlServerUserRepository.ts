import { Repository } from "typeorm";
import { UserRepository } from "../../application/ports";
import { User } from "../../domain/entities/User";
import { UserOrmEntity } from "../database/entities/UserOrmEntity";

export class SqlServerUserRepository implements UserRepository {
  constructor(private readonly repository: Repository<UserOrmEntity>) {}

  async create(user: User): Promise<User> {
    const entity = this.repository.create(user);
    const saved = await this.repository.save(entity);
    return toDomain(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ? toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user ? toDomain(user) : null;
  }

  async findAll(search?: string): Promise<User[]> {
    if (!search) {
      const users = await this.repository.find({
        order: { createdAt: "DESC" },
      });
      return users.map(toDomain);
    }

    const users = await this.repository
      .createQueryBuilder("user")
      .where("LOWER(user.name) LIKE LOWER(:term)", { term: `%${search}%` })
      .orWhere("LOWER(user.email) LIKE LOWER(:term)", { term: `%${search}%` })
      .orWhere("LOWER(user.role) LIKE LOWER(:term)", { term: `%${search}%` })
      .orderBy("user.created_at", "DESC")
      .getMany();

    return users.map(toDomain);
  }

  async update(user: User): Promise<User> {
    await this.repository.save(this.repository.create(user));
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}

function toDomain(entity: UserOrmEntity): User {
  return {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    passwordHash: entity.passwordHash,
    role: entity.role,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
