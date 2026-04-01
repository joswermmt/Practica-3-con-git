import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "../../../domain/entities/User";

@Entity({ name: "Users" })
export class UserOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "nvarchar", length: 120 })
  name!: string;

  @Column({ type: "nvarchar", length: 180, unique: true })
  email!: string;

  @Column({ name: "password_hash", type: "nvarchar", length: 255 })
  passwordHash!: string;

  @Column({ type: "varchar", length: 20 })
  role!: UserRole;

  @CreateDateColumn({ name: "created_at", type: "datetime2" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime2" })
  updatedAt!: Date;
}
