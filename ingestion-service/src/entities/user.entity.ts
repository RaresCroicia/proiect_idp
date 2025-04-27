import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserProgress } from './user-progress.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => UserProgress, progress => progress.user)
  progress: UserProgress[];
} 