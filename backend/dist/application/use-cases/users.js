"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.updateUser = updateUser;
exports.removeUser = removeUser;
async function listUsers(repository, search) {
    return repository.findAll(search);
}
async function updateUser(repository, id, input) {
    const current = await repository.findById(id);
    if (!current) {
        throw new Error("User not found");
    }
    const next = {
        ...current,
        name: input.name ?? current.name,
        role: input.role ?? current.role,
        updatedAt: new Date(),
    };
    return repository.update(next);
}
async function removeUser(repository, id) {
    const current = await repository.findById(id);
    if (!current) {
        throw new Error("User not found");
    }
    await repository.delete(id);
}
