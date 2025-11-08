import { Exclude } from 'class-transformer';
import bcrypt from 'node_modules/bcryptjs';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserRole = 'user' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 50, nullable: true })
  firstName?: string;

  @Column({ length: 50, nullable: true })
  lastName?: string;

  // Hide password when serializing
  @Exclude()
  @Column({ length: 255 })
  password: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 15, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //   Helpers methods can be added here
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    // Hash password logic here (e.g., using bcrypt)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // convenience check
  async comparePassword(plain: string) {
    return bcrypt.compare(plain, this.password);
  }
}
