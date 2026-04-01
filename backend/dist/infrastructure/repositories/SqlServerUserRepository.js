"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlServerUserRepository = void 0;
class SqlServerUserRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(user) {
        const entity = this.repository.create(user);
        const saved = await this.repository.save(entity);
        return toDomain(saved);
    }
    async findByEmail(email) {
        const user = await this.repository.findOne({ where: { email } });
        return user ? toDomain(user) : null;
    }
    async findById(id) {
        const user = await this.repository.findOne({ where: { id } });
        return user ? toDomain(user) : null;
    }
    async findAll(search) {
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
    async update(user) {
        await this.repository.save(this.repository.create(user));
        return user;
    }
    async delete(id) {
        await this.repository.delete({ id });
    }
}
exports.SqlServerUserRepository = SqlServerUserRepository;
function toDomain(entity) {
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
