"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersTable202604010001 = void 0;
class CreateUsersTable202604010001 {
    constructor() {
        this.name = "CreateUsersTable202604010001";
    }
    async up(queryRunner) {
        await queryRunner.query(`
      IF OBJECT_ID('dbo.Users', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.Users (
          id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
          name NVARCHAR(120) NOT NULL,
          email NVARCHAR(180) NOT NULL,
          password_hash NVARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL CONSTRAINT CK_Users_Role CHECK (role IN ('ADMIN', 'MANAGER', 'USER')),
          created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
          updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
          CONSTRAINT PK_Users_Id PRIMARY KEY (id),
          CONSTRAINT UQ_Users_Email UNIQUE (email)
        );
      END
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
      BEGIN
        DROP TABLE dbo.Users;
      END
    `);
    }
}
exports.CreateUsersTable202604010001 = CreateUsersTable202604010001;
