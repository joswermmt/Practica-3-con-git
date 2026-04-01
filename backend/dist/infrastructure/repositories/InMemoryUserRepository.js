"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserRepository = void 0;
class InMemoryUserRepository {
    constructor() {
        this.users = new Map();
    }
    async create(user) {
        this.users.set(user.id, user);
        return user;
    }
    async findByEmail(email) {
        const user = Array.from(this.users.values()).find((u) => u.email === email);
        return user ?? null;
    }
    async findById(id) {
        return this.users.get(id) ?? null;
    }
    async findAll(search) {
        const all = Array.from(this.users.values());
        if (!search) {
            return all;
        }
        const value = search.toLowerCase();
        return all.filter((u) => u.name.toLowerCase().includes(value) ||
            u.email.toLowerCase().includes(value) ||
            u.role.toLowerCase().includes(value));
    }
    async update(user) {
        this.users.set(user.id, user);
        return user;
    }
    async delete(id) {
        this.users.delete(id);
    }
}
exports.InMemoryUserRepository = InMemoryUserRepository;
